# MN Toolbar 开发指南

> 本指南旨在帮助开发者理解 MN Toolbar 的工作原理，掌握扩展开发技术，既适合人类开发者阅读，也可作为 AI 辅助开发的提示词。

## 目录

- [第一部分：MN Toolbar 基础原理](#第一部分mn-toolbar-基础原理)
  - [1.1 架构概览](#11-架构概览)
  - [1.2 按钮工作原理](#12-按钮工作原理)
  - [1.3 菜单系统原理](#13-菜单系统原理)
  - [1.4 动作处理流程](#14-动作处理流程)
- [第二部分："补丁"架构设计](#第二部分补丁架构设计)
  - [2.1 为什么需要补丁架构](#21-为什么需要补丁架构)
  - [2.2 注册表模式设计](#22-注册表模式设计)
  - [2.3 四层架构解析](#23-四层架构解析)
  - [2.4 解耦的实现细节](#24-解耦的实现细节)
- [第三部分：开发实践指南](#第三部分开发实践指南)
  - [3.1 环境准备](#31-环境准备)
  - [3.2 快速上手：第一个按钮](#32-快速上手第一个按钮)
  - [3.3 进阶：多级菜单](#33-进阶多级菜单)
  - [3.4 用户交互模式](#34-用户交互模式)
  - [3.5 最佳实践](#35-最佳实践)
- [第四部分：API 参考](#第四部分api-参考)
  - [4.1 核心 API](#41-核心-api)
  - [4.2 调试技巧](#42-调试技巧)
  - [4.3 常见问题](#43-常见问题)

---

## 第一部分：MN Toolbar 基础原理

### 1.1 架构概览

MN Toolbar 是 MarginNote 的工具栏插件，采用 JSB (JavaScript Bridge) 框架开发。整体架构分为四个核心模块：

```
┌─────────────────────────────────────────┐
│           main.js (入口)                 │
│  - 生命周期管理                          │
│  - 插件初始化                            │
│  - 观察者注册                            │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│      webviewController.js               │
│  - UI 界面管理                          │
│  - 按钮创建和布局                       │
│  - 事件响应 (点击/长按/双击)            │
│  - 手势识别                             │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│           utils.js                      │
│  - 配置管理 (toolbarConfig)             │
│  - 工具函数 (toolbarUtils)              │
│  - 动作处理逻辑                         │
│  - 按钮/菜单配置                        │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│      settingController.js               │
│  - 设置界面                             │
│  - 配置持久化                           │
│  - 用户偏好管理                         │
└─────────────────────────────────────────┘
```

### 1.2 按钮工作原理

> **小白提示**：如果你不熟悉编程，可以把按钮想象成家里的电灯开关。当你按下开关（点击按钮），电路接通（触发事件），灯就亮了（执行功能）。

#### 1.2.1 基础概念

在深入了解之前，让我们先理解几个基础概念：

- **UIButton**：iOS 系统提供的按钮组件，就像现实中的按钮一样可以被点击
- **事件（Event）**：用户的操作，如点击、长按、双击等
- **函数（Function）**：一段可以被调用执行的代码，就像一个"动作脚本"
- **JSON**：一种数据格式，用 `{}` 包裹，里面是 `键:值` 对，如 `{name:"按钮", color:3}`

#### 1.2.2 按钮创建流程详解

当插件启动时，按钮通过以下流程创建：

```javascript
// webviewController.js - 按钮创建
viewDidLoad: function() {
  // 1. 创建 UIButton 实例
  // UIButton.buttonWithType(0) 创建一个标准按钮
  // 参数 0 表示 UIButtonTypeCustom（自定义样式按钮）
  let button = UIButton.buttonWithType(0);
  
  // 2. 设置按钮外观
  // setTitleForState: 设置按钮在某个状态下显示的文字
  // 第二个参数 0 表示 UIControlStateNormal（正常状态）
  button.setTitleForState('按钮文字', 0);  
  
  // setImageForState: 设置按钮图标
  // image 是一个 40x40 像素的 PNG 图片对象
  button.setImageForState(image, 0);       
  
  // 设置背景颜色，#9bb2d6 是一个淡蓝色的十六进制颜色值
  button.backgroundColor = UIColor.colorWithHexString("#9bb2d6");
  
  // 设置圆角，让按钮看起来更美观
  button.layer.cornerRadius = 5;
  
  // 3. 绑定点击事件 - 这是核心！
  // 这一步告诉系统：当用户点击这个按钮时，应该做什么
  button.addTargetActionForControlEvents(
    this,              // target: 谁来处理这个事件（当前控制器）
    "customAction:",   // action: 调用哪个方法（方法名必须带冒号）
    1 << 6            // event: 什么时候触发（见下方详解）
  );
  
  // 4. 添加到视图
  // 把按钮添加到界面上，这样用户才能看到并点击它
  this.view.addSubview(button);
}
```

**关键数值解释：`1 << 6` 是什么？**

```javascript
// 1 << 6 是位运算，表示将 1 左移 6 位
// 二进制：000001 变成 1000000
// 十进制：1 变成 64
// 含义：UIControlEventTouchUpInside = 64

// iOS 中的触摸事件类型：
// 1 << 0 = 1   : TouchDown（手指按下）
// 1 << 1 = 2   : TouchDownRepeat（连续按下）
// 1 << 2 = 4   : TouchDragInside（在按钮内拖动）
// 1 << 3 = 8   : TouchDragOutside（拖出按钮外）
// 1 << 4 = 16  : TouchDragEnter（拖入按钮内）
// 1 << 5 = 32  : TouchDragExit（拖出按钮外）
// 1 << 6 = 64  : TouchUpInside（在按钮内抬起手指）✅ 最常用
// 1 << 7 = 128 : TouchUpOutside（在按钮外抬起手指）

// 为什么用 TouchUpInside？
// 这是最符合用户习惯的交互方式：
// - 用户可以按下按钮后改变主意（拖出去再松手就不触发）
// - 避免误触（必须在按钮内松手才算完成点击）
```

**实际代码中的按钮创建：**

```javascript
// webviewController.js 实际代码（第1037-1052行）
toolbarController.prototype.setColorButtonLayout = function (button,targetAction,color) {
    // 设置按钮自动调整大小的方式
    button.autoresizingMask = (1 << 0 | 1 << 3);
    
    // 设置按钮文字颜色
    button.setTitleColorForState(UIColor.blackColor(),0);     // 正常状态：黑色
    button.setTitleColorForState(toolbarConfig.highlightColor, 1); // 高亮状态：特定颜色
    
    // 设置背景颜色
    button.backgroundColor = color;
    
    // 设置圆角和裁剪
    button.layer.cornerRadius = 10;
    button.layer.masksToBounds = true;  // 裁剪超出圆角的部分
    
    if (targetAction) {
      // 重要：先移除旧的事件监听，避免重复绑定
      let number = 64;  // 就是 1 << 6 的结果
      button.removeTargetActionForControlEvents(this, targetAction, number);
      button.addTargetActionForControlEvents(this, targetAction, number);
      
      // 同时添加双击检测
      button.addTargetActionForControlEvents(this, "doubleClick:", 1 << 1);
    }
    
    // 添加到界面
    this.view.addSubview(button);
}

#### 1.2.3 点击触发原理深度解析

**完整的点击事件流程：**

```
用户手指触摸屏幕
    ↓
iOS 系统检测到触摸点
    ↓
判断触摸点在哪个按钮上
    ↓
记录触摸状态变化
    ↓
手指抬起时判断是否还在按钮内
    ↓ （是）
触发 TouchUpInside 事件
    ↓
调用绑定的方法
```

当用户点击按钮时，系统会经历以下详细步骤：

**步骤 1：iOS 系统捕获触摸事件**
```javascript
// 系统底层检测到手指触摸
// 记录触摸点坐标 (x, y)
// 查找该坐标下的 UI 元素
```

**步骤 2：UIButton 识别事件类型**
```javascript
// 系统判断事件类型
if (手指按下位置在按钮内 && 手指抬起位置也在按钮内) {
  // 触发 TouchUpInside 事件（值为 64）
  eventType = UIControlEventTouchUpInside;
}
```

**步骤 3：触发绑定的 action 方法**
```javascript
// webviewController.js - 实际的 customAction 方法（第270-294行）
customAction: async function (button) {
  let self = getToolbarController();
  
  // 1. 确定按钮对应的功能名称
  // button.target: 直接指定的功能名（优先级最高）
  // button.index: 按钮在工具栏中的位置索引（0,1,2...）
  let dynamicOrder = toolbarConfig.getWindowState("dynamicOrder");
  let useDynamic = dynamicOrder && self.dynamicWindow;
  let actionName = button.target ?? (useDynamic 
    ? toolbarConfig.dynamicAction[button.index]  // 动态工具栏配置
    : toolbarConfig.action[button.index]);       // 固定工具栏配置
  
  // actionName 示例: "copy", "custom15", "timer" 等
  
  // 2. 获取该功能的详细配置
  // getDescriptionById 会查找该按钮的完整配置信息
  let des = toolbarConfig.getDescriptionById(actionName);
  // des 示例: {
  //   action: "copy",
  //   target: "title",
  //   doubleClick: {...},
  //   onLongPress: {...}
  // }
  
  // 3. 处理双击逻辑（如果配置了双击）
  if ("doubleClick" in des) {
    button.delay = true;  // 延迟隐藏菜单
    self.onClick = true;
    
    if (button.doubleClick) {
      // 这是第二次点击，执行双击动作
      button.doubleClick = false;
      let doubleClick = des.doubleClick;
      if (!("action" in doubleClick)) {
        doubleClick.action = des.action;  // 继承默认动作
      }
      self.customActionByDes(button, doubleClick);
      return;
    }
    // 第一次点击，等待可能的第二次点击
    // 具体逻辑见双击处理章节
  }
  
  // 4. 执行动作
  self.customActionByDes(button, des);
}
```

**步骤 4：查找并执行对应的动作配置**
```javascript
// utils.js - customActionByDes 方法（第5386行开始）
customActionByDes: async function(des, button, controller) {
  let action = des.action;  // 获取动作类型
  
  // 根据动作类型执行不同的操作
  switch(action) {
    case "copy":
      // 执行复制操作
      if (des.target || des.content) {
        success = await this.copy(des);
      } else {
        success = this.smartCopy();  // 智能复制
      }
      break;
      
    case "setColor":
      // 设置颜色
      let focusNote = MNNote.getFocusNote();
      if (focusNote) {
        focusNote.colorIndex = des.color;  // 0-15 的颜色索引
      }
      break;
      
    case "menu":
      // 显示菜单（见菜单系统章节）
      this.showMenu(des);
      break;
      
    default:
      // 检查是否是自定义动作（补丁架构的扩展点）
      if (typeof global !== 'undefined' && global.executeCustomAction) {
        const context = {button, des, focusNote, focusNotes, self: controller};
        const handled = await global.executeCustomAction(des.action, context);
        if (handled) break;
      }
      MNUtil.showHUD("Not supported yet...");
  }
}
```

**按钮属性详解：**

```javascript
// 每个按钮对象包含的关键属性
button = {
  // 系统属性
  frame: {x: 0, y: 0, width: 40, height: 40},  // 位置和大小
  backgroundColor: UIColor,                      // 背景颜色
  layer: {                                       // 视觉层
    cornerRadius: 10,                            // 圆角半径
    masksToBounds: true                          // 是否裁剪
  },
  
  // 自定义属性（插件添加的）
  target: "copy",        // 按钮对应的功能名称
  index: 3,             // 按钮在工具栏中的位置
  color: 5,             // 颜色按钮的颜色索引
  menu: PopupMenu,      // 关联的弹出菜单对象
  doubleClick: false,   // 双击状态标记
  delay: false          // 延迟隐藏标记
}
```

**实际例子：点击"复制"按钮**

```javascript
// 1. 用户点击"复制"按钮
// 2. 系统触发 customAction(button)
// 3. 获取 actionName = "copy"
// 4. 获取 des = {action: "copy", target: "title"}
// 5. 执行 customActionByDes
// 6. switch 匹配到 case "copy"
// 7. 执行复制逻辑：
//    - 获取焦点卡片
//    - 根据 target 确定复制内容（标题/摘录/评论）
//    - 调用 MNUtil.copy() 复制到剪贴板
//    - 显示 HUD 提示 "已复制"
```

#### 1.2.4 长按手势原理详解

> **小白提示**：长按就像按住电梯按钮不放。系统会计时，超过设定时间（通常 0.3 秒）就认为是"长按"而不是普通点击。

**长按手势的实现机制：**

```javascript
// webviewController.js - addLongPressGesture 方法（第2208-2218行）
toolbarController.prototype.addLongPressGesture = function (view, selector) {
  // 1. 创建长按手势识别器
  // UILongPressGestureRecognizer: iOS 提供的长按手势类
  // this: 手势的处理对象（当前控制器）
  // selector: 手势触发时调用的方法名
  let gestureRecognizer = new UILongPressGestureRecognizer(this, selector);
  
  // 2. 设置长按触发时间
  // minimumPressDuration: 最短按压时间（秒）
  // 0.3 秒是一个平衡点：既不会误触，又不会让用户等太久
  gestureRecognizer.minimumPressDuration = 0.3;
  
  // 3. 将手势识别器添加到视图（通常是按钮）
  // 这样按钮就能识别长按手势了
  view.addGestureRecognizer(gestureRecognizer);
}
```

**手势状态详解：**

```javascript
// 手势识别器的 5 个状态
gesture.state = {
  0: "Possible",     // 可能：手势刚开始，还不确定是什么手势
  1: "Began",        // 开始：确认是长按手势（按压超过 0.3 秒）
  2: "Changed",      // 改变：手指移动但还在按着
  3: "Ended",        // 结束：手指抬起，手势完成
  4: "Cancelled",    // 取消：手势被中断（如来电话）
  5: "Failed"        // 失败：不符合手势条件
}
```

**手势状态转换图（小白版）：**

```
用户按下手指
    ↓
[Possible] 状态 0
    ├─ 立即抬起 → [Failed] 状态 5（不是长按）
    └─ 继续按住
        ↓ (0.3秒后)
    [Began] 状态 1 ← 这时触发长按操作！
        ├─ 手指移动 → [Changed] 状态 2
        │               ├─ 继续移动 → 保持状态 2
        │               └─ 手指抬起 → [Ended] 状态 3
        ├─ 手指抬起 → [Ended] 状态 3
        └─ 被中断 → [Cancelled] 状态 4

实际代码只需要处理 Began (1) 状态：
if (gesture.state === 1) {
  // 执行长按操作
}
```

**长按响应方法的完整实现：**

```javascript
// webviewController.js - onLongPressGesture 方法（第902-921行）
onLongPressGesture: async function (gesture) {
  // 只在手势开始时处理（state === 1）
  // 避免重复触发
  if (gesture.state === 1) {  // UIGestureRecognizerStateBegan
    // 1. 获取触发手势的按钮
    let button = gesture.view;  // view 就是添加手势的那个按钮
    
    // 2. 确定按钮对应的功能
    let dynamicOrder = toolbarConfig.getWindowState("dynamicOrder");
    let useDynamic = dynamicOrder && self.dynamicWindow;
    
    // 获取按钮的功能名称
    // button.target: 直接指定的功能名
    // button.index: 按钮位置索引
    let actionName = button.target ?? (useDynamic 
      ? toolbarConfig.dynamicAction[button.index]
      : toolbarConfig.action[button.index]);
    
    // 3. 获取功能配置
    if (actionName) {
      let des = toolbarConfig.getDescriptionById(actionName);
      
      // 4. 检查是否配置了长按动作
      if ("onLongPress" in des) {
        // des.onLongPress 示例：
        // {
        //   action: "menu",
        //   menuWidth: 200,
        //   menuItems: [...]
        // }
        
        let onLongPress = des.onLongPress;
        
        // 如果长按配置没有指定 action，继承默认 action
        if (!("action" in onLongPress)) {
          onLongPress.action = des.action;
        }
        
        // 5. 执行长按动作
        await self.customActionByDes(button, onLongPress);
        return;
      } else {
        // 没有配置长按动作，显示提示
        MNUtil.showHUD("No long press action");
      }
    }
  }
  
  // 其他状态（Changed, Ended 等）暂不处理
  // 可以在这里添加手势追踪、动画等高级功能
}
```

**实际例子：长按显示菜单**

```javascript
// 按钮配置示例
{
  name: "制卡",
  image: "makeCards",
  description: {
    action: "quickMakeCard",     // 单击：快速制卡
    onLongPress: {               // 长按：显示菜单
      action: "menu",
      menuWidth: 250,
      menuItems: [
        {action: "quickMakeCard", menuTitle: "快速制卡"},
        {action: "advancedMakeCard", menuTitle: "高级制卡"},
        {action: "batchMakeCard", menuTitle: "批量制卡"}
      ]
    }
  }
}

// 用户交互流程：
// 1. 用户按住"制卡"按钮
// 2. 持续 0.3 秒后，触发 onLongPressGesture
// 3. gesture.state === 1 (Began)
// 4. 获取 actionName = "makeCards"
// 5. 获取 des.onLongPress 配置
// 6. 执行 customActionByDes(button, des.onLongPress)
// 7. action === "menu"，显示菜单
// 8. 用户可以从菜单中选择具体操作
```

**为什么是 0.3 秒？**

```javascript
// 不同场景的长按时间设置建议
0.2 秒：太短，容易误触（用户还没反应过来）
0.3 秒：标准值，iOS 系统默认 ✅
0.5 秒：适合老年用户或需要确认的危险操作
1.0 秒：特殊场景，如删除所有数据前的确认

// 可以根据需要调整
gestureRecognizer.minimumPressDuration = 0.5;  // 更保守的设置
```

#### 1.2.5 双击处理机制详解

> **小白提示**：双击就像敲门——"咚咚"两声要足够快（通常 300 毫秒内），太慢就变成两次单独的敲门了。

**双击的实现原理：**

iOS 原生不直接支持按钮双击，插件通过"延迟判断"巧妙实现：

```
第一次点击 → 标记 → 等待300ms → 判断
                ↓                    ↓
         第二次点击到来？        没有第二次点击
                ↓                    ↓
           执行双击动作          执行单击动作
```

**完整的双击处理代码：**

```javascript
// webviewController.js - customAction 方法中的双击处理
customAction: function(button) {
  let des = toolbarConfig.getDescriptionById(actionName);
  
  // 检查是否配置了双击功能
  if ("doubleClick" in des) {
    // des 配置示例：
    // {
    //   action: "copy",           // 单击动作
    //   doubleClick: {            // 双击动作
    //     action: "copyAll"
    //   }
    // }
    
    // 设置延迟标记，阻止菜单立即关闭
    button.delay = true;
    self.onClick = true;
    
    // 如果按钮有关联菜单，也要阻止菜单关闭
    if (button.menu) {
      button.menu.stopHide = true;
    }
    
    // 判断这是第几次点击
    if (button.doubleClick) {
      // ===== 这是第二次点击（双击完成）=====
      button.doubleClick = false;  // 重置标记
      
      // 获取双击配置
      let doubleClick = des.doubleClick;
      
      // 如果双击配置没有指定 action，使用默认 action
      if (!("action" in doubleClick)) {
        doubleClick.action = des.action;
      }
      
      // 执行双击动作
      self.customActionByDes(button, doubleClick);
      return;  // 结束处理
      
    } else {
      // ===== 这是第一次点击（可能是双击的开始）=====
      button.doubleClick = true;  // 标记为"等待第二次点击"
      
      // 设置超时器：300毫秒后检查
      setTimeout(() => {
        // 如果标记还在，说明没有第二次点击，执行单击
        if (button.doubleClick) {
          button.doubleClick = false;  // 重置标记
          
          // 执行单击动作
          self.customActionByDes(button, des);
          
          // 如果有菜单，关闭它
          if (button.menu) {
            button.menu.dismissAnimated(true);
          }
        }
        // 如果标记不在了，说明已经执行过双击，不做任何事
      }, 300);  // 300毫秒的等待时间
    }
  }
}
```

**双击时间窗口的考量：**

```javascript
// 不同的双击时间窗口设置
200ms：太短，手速慢的用户难以完成双击
300ms：标准值，大多数应用的默认设置 ✅
400ms：宽松设置，适合触摸不太灵敏的设备
500ms：太长，用户体验下降（感觉反应迟钝）

// 可以根据用户群体调整
const DOUBLE_CLICK_DELAY = 300;  // 可配置的常量
setTimeout(..., DOUBLE_CLICK_DELAY);
```

**实际例子：复制按钮的单击/双击**

```javascript
// 按钮配置
{
  name: "复制",
  image: "copy",
  description: {
    action: "copy",
    target: "title",      // 单击：复制标题
    doubleClick: {        // 双击：复制所有内容
      action: "copy",
      target: "all"
    }
  }
}

// 用户交互时序图：
// 
// 场景1：用户单击
// 0ms    用户点击按钮
// 1ms    button.doubleClick = true
// 2ms    设置 setTimeout
// 300ms  超时触发，button.doubleClick 仍为 true
// 301ms  执行单击动作：复制标题
// 302ms  显示 "标题已复制"
//
// 场景2：用户双击
// 0ms    用户第一次点击
// 1ms    button.doubleClick = true
// 2ms    设置 setTimeout
// 150ms  用户第二次点击（双击！）
// 151ms  检测到 button.doubleClick === true
// 152ms  执行双击动作：复制所有内容
// 153ms  显示 "全部内容已复制"
// 300ms  超时触发，但 button.doubleClick 已为 false，不执行
```

**防止冲突的机制：**

```javascript
// 双击按钮的特殊处理
toolbarController.prototype.doubleClick = function(button) {
  // 这个方法在按钮绑定时被调用
  // 用于设置双击标记
  button.doubleClick = true;
}

// 在 setColorButtonLayout 中的绑定
button.addTargetActionForControlEvents(this, "doubleClick:", 1 << 1);
// 1 << 1 = 2 = UIControlEventTouchDownRepeat（重复按下事件）

// 为什么要分开两个事件监听？
// 1. TouchUpInside (1 << 6) 用于正常的点击处理
// 2. TouchDownRepeat (1 << 1) 用于快速连续点击的检测
// 这样可以区分用户是在"慢慢点击"还是"快速双击"
```

**调试双击问题的技巧：**

```javascript
// 添加日志来追踪双击状态
if ("doubleClick" in des) {
  MNUtil.log(`双击检测 - 当前状态: ${button.doubleClick ? "第二次" : "第一次"}`);
  
  if (button.doubleClick) {
    MNUtil.log("执行双击动作");
  } else {
    MNUtil.log("开始等待第二次点击...");
    setTimeout(() => {
      MNUtil.log(`超时检查 - 状态: ${button.doubleClick ? "单击" : "已双击"}`);
    }, 300);
  }
}
```

### 1.3 菜单系统原理详解

> **小白提示**：菜单就像餐厅的菜单一样，列出所有可选项。点击某一项就像点菜，系统会执行对应的操作。

#### 1.3.1 菜单数据结构详解

**JSON 基础知识：**

```javascript
// JSON (JavaScript Object Notation) 是一种数据格式
// 用大括号 {} 表示对象，方括号 [] 表示数组

// 对象示例：
{
  "键": "值",
  "数字": 123,
  "布尔": true,
  "数组": [1, 2, 3],
  "嵌套对象": {
    "子键": "子值"
  }
}

// 数组示例：
[
  "项目1",
  "项目2",
  {"对象项": "值"}
]
```

**菜单配置的完整结构：**

```javascript
{
  action: "menu",           // 必需：标识这是一个菜单类型的动作
  menuWidth: 200,          // 可选：菜单宽度（像素），默认 200
  menuHeight: 300,         // 可选：最大高度，超出会滚动
  autoClose: true,         // 可选：点击后是否自动关闭
  menuItems: [             // 必需：菜单项数组
    
    // 类型1：纯文本分组标题（不可点击）
    "⬇️ 基础操作",
    
    // 类型2：简单菜单项
    {
      action: "copy",           // 点击时执行的动作
      menuTitle: "    复制"     // 显示的文字（4个空格缩进）
    },
    
    // 类型3：带参数的菜单项
    {
      action: "setColor",
      menuTitle: "    设置颜色",
      color: 3,                 // 额外参数
      target: "title"           // 额外参数
    },
    
    // 类型4：子菜单（可以无限嵌套）
    {
      action: "menu",           // 表示这还是一个菜单
      menuTitle: "    更多选项 ➡️",
      menuWidth: 250,           // 子菜单可以有不同宽度
      menuItems: [              // 子菜单项
        {
          action: "advanced1",
          menuTitle: "高级选项1"
        },
        {
          action: "advanced2",
          menuTitle: "高级选项2"
        }
      ]
    },
    
    // 类型5：分隔线（视觉分组）
    "━━━━━━━━━━",
    
    // 类型6：带图标的菜单项
    {
      action: "delete",
      menuTitle: "    🗑️ 删除",  // 可以包含 emoji
      confirmMessage: "确定删除？" // 危险操作的确认
    }
  ]
}
```

**层级关系的表示方法：**

```javascript
// 通过缩进（空格）来表示层级关系
menuItems: [
  "📁 文件操作",           // 顶层分组
  {menuTitle: "    新建"},  // 4个空格 = 第一层
  {menuTitle: "    打开"},
  {menuTitle: "    保存"},
  
  "📝 编辑操作",           // 另一个分组
  {menuTitle: "    剪切"},
  {menuTitle: "    复制"},
  {menuTitle: "    粘贴"},
  {
    menuTitle: "    查找 ➡️",
    action: "menu",
    menuItems: [
      {menuTitle: "查找文本"},      // 子菜单不需要额外缩进
      {menuTitle: "查找并替换"},
      {menuTitle: "查找下一个"}
    ]
  }
]
```

**实际例子：制卡菜单**

```javascript
// xdyy_menu_registry.js 中的实际菜单
global.registerMenuTemplate("menu_makeCards", {
  action: "makeCardsDefault",    // 默认动作（直接点击按钮时）
  onLongPress: {                 // 长按时显示的菜单
    action: "menu",
    menuWidth: 330,
    menuItems: [
      // 分组1：快速操作
      "⚡ 快速操作",
      {
        action: "quickMakeCards",
        menuTitle: "    一键制卡"
      },
      {
        action: "makeCardsWithReview",
        menuTitle: "    制卡并加入复习"
      },
      
      // 分组2：卡片类型
      "📚 卡片类型",
      {
        action: "makeDefinitionCard",
        menuTitle: "    制作定义卡"
      },
      {
        action: "makeQuestionCard",
        menuTitle: "    制作问题卡"
      },
      {
        action: "makeFormulaCard",
        menuTitle: "    制作公式卡"
      },
      
      // 分组3：高级选项（子菜单）
      "⚙️ 高级选项",
      {
        action: "menu",
        menuTitle: "    批量操作 ➡️",
        menuWidth: 280,
        menuItems: [
          {
            action: "batchMakeCards",
            menuTitle: "批量制卡"
          },
          {
            action: "batchRenameCards",
            menuTitle: "批量重命名"
          },
          {
            action: "batchSetColor",
            menuTitle: "批量设置颜色"
          }
        ]
      },
      {
        action: "makeCardsSettings",
        menuTitle: "    制卡设置..."
      }
    ]
  }
})
```

#### 1.3.2 菜单显示流程详解

**菜单渲染的完整过程：**

```
按钮被点击/长按
    ↓
检查 action === "menu"
    ↓
解析 menuItems 数组
    ↓
转换为 iOS 菜单格式
    ↓
创建 PopoverController
    ↓
显示在按钮旁边
```

**详细的代码实现：**

```javascript
// webviewController.js - customActionByMenu 方法（第296-331行）
customActionByMenu: async function (param) {
  let des = param.des;       // 菜单项的配置
  let button = param.button;  // 触发菜单的按钮
  
  // 判断是否是子菜单
  if (des.action === "menu") {
    // ===== 显示子菜单 =====
    self.onClick = true;
    self.checkPopover();  // 关闭之前的菜单
    
    // 检查是否需要自动关闭
    if (("autoClose" in des) && des.autoClose) {
      self.hideAfterDelay(0.1);
    }
    
    let menuItems = des.menuItems;
    let width = des.menuWidth ?? 200;  // 默认宽度 200
    
    if (menuItems.length) {
      // 1. 转换菜单项为 iOS 需要的格式
      var commandTable = menuItems.map(item => {
        // 确定显示的标题
        let title = (typeof item === "string") 
          ? item                           // 纯字符串直接使用
          : (item.menuTitle ?? item.action); // 对象取 menuTitle 或 action
        
        // 返回 iOS 菜单项格式
        return {
          title: title,                    // 显示文本
          object: self,                     // 处理对象
          selector: 'customActionByMenu:',  // 处理方法
          param: {des: item, button: button} // 传递的参数
        };
      });
      
      // 2. 添加返回按钮（多级菜单导航）
      commandTable.unshift({
        title: toolbarUtils.emojiNumber(self.commandTables.length) + " 🔙",
        object: self,
        selector: 'lastPopover:',
        param: button
      });
      
      // 3. 保存菜单栈（用于返回）
      self.commandTables.push(commandTable);
      
      // 4. 创建并显示菜单
      self.popoverController = MNUtil.getPopoverAndPresent(
        button,       // 锚点（菜单显示在哪个按钮旁）
        commandTable, // 菜单数据
        width,        // 菜单宽度
        4            // 箭头方向（4 = 自动选择）
      );
    }
    return;
  }
  
  // ===== 不是子菜单，执行具体动作 =====
  if (!("autoClose" in des) || des.autoClose) {
    self.checkPopover();      // 关闭菜单
    self.hideAfterDelay(0.1); // 延迟隐藏工具栏
  } else {
    self.checkPopover();      // 只关闭菜单，保持工具栏
  }
  
  // 清空菜单栈
  self.commandTables = [];
  
  // 执行动作
  self.customActionByDes(button, des);
}
```

**map 函数详解：**

```javascript
// map 是数组的转换函数，将每个元素转换成新的形式
// 原始数组
let menuItems = [
  "分组标题",
  {action: "copy", menuTitle: "复制"},
  {action: "paste", menuTitle: "粘贴"}
];

// map 转换过程
let commandTable = menuItems.map(function(item) {
  // item 依次是：
  // 第1次: "分组标题"
  // 第2次: {action: "copy", menuTitle: "复制"}
  // 第3次: {action: "paste", menuTitle: "粘贴"}
  
  // 返回新格式
  return {
    title: item.menuTitle || item,
    // ... 其他属性
  };
});

// 结果
commandTable = [
  {title: "分组标题", ...},
  {title: "复制", ...},
  {title: "粘贴", ...}
];
```

**PopoverController 详解：**

```javascript
// PopoverController 是 iOS 的弹出菜单控件
// 像一个带箭头的气泡，指向触发它的按钮

MNUtil.getPopoverAndPresent = function(anchor, items, width, arrow) {
  // anchor: 锚点视图（按钮）
  // items: 菜单项数组
  // width: 菜单宽度
  // arrow: 箭头方向
  //   1 = 向上 ↑
  //   2 = 向下 ↓
  //   3 = 向左 ←
  //   4 = 向右 →
  //   0 = 自动选择
  
  // 创建菜单控制器
  let menuController = MenuController.new();
  menuController.commandTable = items;
  menuController.rowHeight = 35;  // 每行高度
  
  // 设置大小
  menuController.preferredContentSize = {
    width: width,
    height: menuController.rowHeight * items.length
  };
  
  // 创建弹出控制器
  let popover = new UIPopoverController(menuController);
  
  // 计算显示位置
  let rect = anchor.convertRectToView(anchor.bounds, studyView);
  
  // 显示菜单
  popover.presentPopoverFromRect(
    rect,      // 位置
    studyView, // 父视图
    arrow,     // 箭头方向
    true       // 动画
  );
  
  return popover;
};
```

#### 1.3.3 菜单项点击处理详解

**完整的点击处理流程：**

```javascript
// 当用户点击菜单项时
customActionByMenu: function(param) {
  // param 包含：
  // {
  //   des: {action: "copy", menuTitle: "复制"},
  //   button: UIButton对象
  // }
  
  let des = param.des;
  let button = param.button;
  
  // 类型判断
  if (typeof des === "string") {
    // 纯字符串 = 分组标题，不执行任何操作
    return;
  }
  
  if (des.action === "menu") {
    // 是子菜单，显示下一级
    this.showSubMenu(des);
  } else {
    // 是具体动作，执行它
    this.customActionByDes(button, des);
    
    // 执行后的处理
    this.closeMenu();        // 关闭菜单
    this.updateUI();         // 更新界面
    this.saveState();        // 保存状态
  }
}
```

**菜单栈管理（多级菜单导航）：**

```javascript
// commandTables 是一个数组的数组，用于管理菜单层级
self.commandTables = [
  [/* 第一级菜单项 */],
  [/* 第二级菜单项 */],
  [/* 第三级菜单项 */]
];

// 返回上一级菜单
lastPopover: function(button) {
  self.checkPopover();           // 关闭当前菜单
  self.commandTables.pop();      // 移除当前层级
  let commandTable = self.commandTables.at(-1); // 获取上一级
  
  // 重新显示上一级菜单
  self.popoverController = MNUtil.getPopoverAndPresent(
    button, 
    commandTable, 
    200, 
    4
  );
}

// emojiNumber 函数：用表情显示层级深度
toolbarUtils.emojiNumber = function(n) {
  const emojis = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣"];
  return emojis[n] || "🔢";
}
// 例如：第3层菜单的返回按钮显示 "2️⃣ 🔙"
```

**实际例子：完整的菜单交互**

```javascript
// 用户操作流程：
// 1. 长按"制卡"按钮
// 2. 显示一级菜单：
//    ⚡ 快速操作
//        一键制卡
//        批量操作 ➡️
// 3. 点击"批量操作 ➡️"
// 4. 显示二级菜单：
//    1️⃣ 🔙
//    批量制卡
//    批量重命名
// 5. 点击"批量制卡"
// 6. 执行 batchMakeCards 动作
// 7. 菜单关闭

// 代码执行顺序：
onLongPressGesture(gesture)
  ↓
customActionByDes(button, des.onLongPress)
  ↓ (des.action === "menu")
显示一级菜单
  ↓ 用户点击"批量操作"
customActionByMenu({des: 子菜单配置, button})
  ↓ (des.action === "menu")
显示二级菜单
  ↓ 用户点击"批量制卡"
customActionByMenu({des: {action:"batchMakeCards"}, button})
  ↓ (des.action !== "menu")
customActionByDes(button, des)
  ↓
执行批量制卡功能
```

### 1.4 动作处理流程深度剖析

> **小白提示**：动作处理就像快递分拣中心。每个包裹（用户操作）都有目的地（要执行的功能），系统根据地址标签（action 名称）把包裹送到正确的处理点。

#### 1.4.1 完整的处理链路

**从用户操作到功能执行的完整旅程：**

```
用户手指触摸按钮
   ↓
iOS 系统识别手势类型
   ├─ 点击 (TouchUpInside)
   ├─ 长按 (LongPress > 0.3s)
   └─ 双击 (两次点击 < 0.3s)
   ↓
触发对应的处理方法
   ├─ customAction(button)
   ├─ onLongPressGesture(gesture)
   └─ doubleClick(button)
   ↓
获取按钮配置信息
   ├─ button.target（直接指定）
   └─ toolbarConfig.action[index]（位置索引）
   ↓
查找完整的功能描述
   toolbarConfig.getDescriptionById(actionName)
   ↓
解析 description 对象
   ├─ action: 动作类型
   ├─ 参数: target, content, color 等
   └─ 特殊: doubleClick, onLongPress
   ↓
执行 customActionByDes
   ↓
根据 action 类型分发
   ├─ 内置动作 → switch-case 处理
   └─ 自定义动作 → global.executeCustomAction
   ↓
执行具体功能代码
   ↓
反馈结果给用户
```

#### 1.4.2 配置查找机制详解

**getDescriptionById 的工作原理：**

```javascript
// utils.js - getDescriptionById 方法（第7261-7287行）
static getDescriptionById(actionKey) {
  let desObject = {};
  
  // 1. 尝试从 actions 配置中获取
  if (actionKey in this.actions) {
    // this.actions 是用户保存的配置
    let action = this.actions[actionKey];
    
    // 2. 解析 description
    if (action.description) {
      if (typeof action.description === "string") {
        // 字符串格式，尝试解析为 JSON
        if (MNUtil.isValidJSON(action.description)) {
          desObject = JSON.parse(action.description);
        }
      } else {
        // 已经是对象，直接使用
        desObject = action.description;
      }
    }
  }
  
  // 3. 如果没有找到，使用默认配置
  if (Object.keys(desObject).length === 0) {
    // 从 getActions() 获取默认配置
    let defaultActions = this.getActions();
    if (actionKey in defaultActions) {
      let defaultAction = defaultActions[actionKey];
      
      // 特殊处理某些按钮的默认行为
      switch (actionKey) {
        case "bigbang":
          desObject.action = "bigbang";
          break;
        case "switchTitleorExcerpt":
          desObject.action = "switchTitleOrExcerpt";
          break;
        case "clearFormat":
          desObject.action = "clearFormat";
          break;
        case "copy":
          desObject.action = "copy";
          break;
        // ... 更多默认配置
      }
    }
  }
  
  return desObject;
}
```

**配置优先级：**

```javascript
// 优先级从高到低：
// 1. 用户自定义配置 (toolbarConfig.actions)
// 2. 按钮默认配置 (getActions() 返回的)
// 3. 硬编码默认值 (switch-case 中的)

// 示例：查找 "copy" 按钮的配置
let des = toolbarConfig.getDescriptionById("copy");

// 查找顺序：
// 1. 检查 toolbarConfig.actions["copy"]
//    如果存在且有 description，使用它
// 2. 如果没有，检查 getActions()["copy"]
//    获取默认的 description
// 3. 如果还没有，使用硬编码默认值
//    {action: "copy"}
```

#### 1.4.3 核心处理函数完整实现

```javascript
// utils.js - customActionByDes 方法（第5379-5963行精简版）
static async customActionByDes(des, button, controller, fromOtherPlugin = false) {
  try {
    // 1. 获取当前环境
    let focusNote = fromOtherPlugin 
      ? des.focusNote 
      : MNNote.getFocusNote();
    let notebookid = focusNote 
      ? focusNote.notebookId 
      : MNUtil.currentNotebookId;
    
    // 2. 准备通用变量
    let success = true;
    let title, content, color, config;
    let targetNoteId;
    
    // 3. 记录日志（调试用）
    MNUtil.log(`执行动作: ${des.action}`);
    
    // 4. 根据 action 类型执行不同操作
    switch (des.action) {
      // ===== 文本操作类 =====
      case "copy":
        if (des.target || des.content) {
          // 有指定复制内容
          success = await this.copy(des);
        } else {
          // 智能复制（自动判断复制什么）
          success = this.smartCopy();
        }
        break;
        
      case "paste":
        this.paste(des);
        await MNUtil.delay(0.1);
        break;
        
      // ===== 卡片操作类 =====
      case "switchTitleOrExcerpt":
        // 交换标题和摘录
        this.switchTitleOrExcerpt();
        await MNUtil.delay(0.1);
        break;
        
      case "clearFormat":
        // 清除格式
        let focusNotes = MNNote.getFocusNotes();
        MNUtil.undoGrouping(() => {
          focusNotes.forEach(note => {
            note.clearFormat();
          });
        });
        await MNUtil.delay(0.1);
        break;
        
      case "setColor":
        // 设置颜色
        MNUtil.undoGrouping(() => {
          focusNotes.forEach(note => {
            note.colorIndex = des.color;  // 0-15
          });
        });
        MNUtil.showHUD(`颜色设置为 ${des.color}`);
        break;
        
      // ===== 评论操作类 =====
      case "addComment":
        // 添加评论
        content = this.parseContent(des.content);
        MNUtil.undoGrouping(() => {
          focusNote.appendComment(content);
        });
        break;
        
      case "removeComment":
        // 删除评论
        let index = des.index || -1;  // -1 表示最后一个
        MNUtil.undoGrouping(() => {
          if (index === 0) {
            // 删除所有评论
            focusNote.comments = [];
          } else if (index < 0) {
            // 删除最后一个
            focusNote.removeCommentAtIndex(
              focusNote.comments.length - 1
            );
          } else {
            // 删除指定索引
            focusNote.removeCommentAtIndex(index - 1);
          }
        });
        break;
        
      // ===== 系统功能类 =====
      case "undo":
        UndoManager.sharedInstance().undo();
        MNUtil.refreshAfterDBChanged(notebookid);
        await MNUtil.delay(0.1);
        break;
        
      case "redo":
        UndoManager.sharedInstance().redo();
        MNUtil.refreshAfterDBChanged(notebookid);
        await MNUtil.delay(0.1);
        break;
        
      case "openSetting":
        MNUtil.postNotification("openToolbarSetting", {});
        await MNUtil.delay(0.1);
        break;
        
      // ===== 菜单类 =====
      case "menu":
        // 显示菜单（见菜单系统章节）
        controller.customActionByMenu({
          des: des,
          button: button
        });
        break;
        
      // ===== 扩展动作 =====
      default:
        // 检查是否是自定义动作
        if (typeof global !== 'undefined' && global.executeCustomAction) {
          const context = {
            button: button,
            des: des,
            focusNote: focusNote,
            focusNotes: MNNote.getFocusNotes(),
            self: controller
          };
          
          // 尝试执行自定义动作
          const handled = await global.executeCustomAction(des.action, context);
          
          if (handled) {
            // 自定义动作已处理
            break;
          }
        }
        
        // 未知动作
        MNUtil.showHUD("Not supported yet: " + des.action);
        break;
    }
    
    // 5. 后续处理
    while ("onFinish" in des) {
      // 链式动作：执行完后还有后续动作
      des = des.onFinish;
      let delay = des.delay ?? 0.1;
      await MNUtil.delay(delay);
      
      // 递归执行后续动作
      await this.customActionByDes(des, button, controller, false);
    }
    
    return success;
    
  } catch (error) {
    // 错误处理
    toolbarUtils.addErrorLog(error, "customActionByDes");
    MNUtil.showHUD(`错误: ${error.message}`);
    return false;
  }
}
```

#### 1.4.4 内容解析机制

**parseContent 函数：解析动态内容**

```javascript
// 将模板字符串转换为实际内容
parseContent: function(template) {
  if (!template) return "";
  
  let result = template;
  
  // 替换剪贴板内容
  result = result.replace(/\{\{clipboardText\}\}/g, 
    MNUtil.clipboardText || "");
  
  // 替换当前时间
  result = result.replace(/\{\{currentTime\}\}/g, 
    new Date().toLocaleString());
  
  // 替换卡片信息
  let focusNote = MNNote.getFocusNote();
  if (focusNote) {
    result = result.replace(/\{\{note\.title\}\}/g, 
      focusNote.noteTitle || "");
    result = result.replace(/\{\{note\.excerpt\}\}/g, 
      focusNote.excerptText || "");
    result = result.replace(/\{\{note\.url\}\}/g, 
      focusNote.noteURL || "");
  }
  
  return result;
}

// 使用示例：
des = {
  action: "addComment",
  content: "摘录自: {{note.title}}\n时间: {{currentTime}}"
}
// 解析后：
// "摘录自: 第一章 基础概念\n时间: 2024/1/20 15:30:00"
```

#### 1.4.5 撤销组的重要性

```javascript
// MNUtil.undoGrouping 的作用
MNUtil.undoGrouping(() => {
  // 这里的所有操作会作为一个整体
  // 用户按一次撤销就能撤销所有操作
  
  note1.noteTitle = "新标题1";
  note2.noteTitle = "新标题2";
  note3.colorIndex = 5;
  note4.appendComment("评论");
});

// 没有使用 undoGrouping 的问题：
note1.noteTitle = "新标题1";  // 撤销1次
note2.noteTitle = "新标题2";  // 撤销2次
note3.colorIndex = 5;         // 撤销3次
note4.appendComment("评论");  // 撤销4次
// 用户需要撤销4次才能恢复原状！

// 使用 undoGrouping 的好处：
// 用户只需撤销1次就能恢复所有更改
```

---

## 第二部分："补丁"架构设计

### 2.1 为什么需要补丁架构

#### 2.1.1 传统方式的问题

在官方版本中添加功能需要直接修改核心文件：

```javascript
// ❌ 传统方式 - 直接修改 utils.js
toolbarConfig.actions = {
  "action1": {...},
  "action2": {...},
  "myAction": {...}  // 添加自定义动作 - 污染原始代码
};

// ❌ 传统方式 - 修改 switch-case
switch(action) {
  case "copy": ...
  case "myAction":     // 添加 case - 难以维护
    // 我的处理逻辑
    break;
}
```

问题：
- **版本升级困难**：官方更新后需要重新修改
- **代码冲突**：多人开发容易产生冲突  
- **维护困难**：自定义代码和官方代码混杂
- **调试困难**：难以区分问题来源

#### 2.1.2 补丁架构的优势

```javascript
// ✅ 补丁方式 - 独立文件扩展
// xdyy_custom_actions_registry.js
global.registerCustomAction("myAction", async function(context) {
  // 我的处理逻辑 - 完全独立
});
```

优势：
- **零侵入**：不修改任何官方文件
- **易升级**：官方更新不影响自定义功能
- **模块化**：功能独立，易于管理
- **可插拔**：随时启用/禁用功能

### 2.2 注册表模式设计

#### 2.2.1 核心思想

使用全局注册表存储自定义配置，主程序通过标准接口访问：

```javascript
// 注册表结构
global = {
  customButtons: {           // 按钮注册表
    "button1": {...},
    "button2": {...}
  },
  customMenuTemplates: {     // 菜单注册表
    "menu1": {...},
    "menu2": {...}
  },
  customActions: {           // 动作注册表
    "action1": function() {...},
    "action2": function() {...}
  }
}
```

#### 2.2.2 注册机制

```javascript
// 注册接口 - 简单直观
global.registerButton("myButton", {
  name: "我的按钮",
  image: "myicon",
  templateName: "myMenu"
});

global.registerMenuTemplate("myMenu", {
  action: "myAction"
});

global.registerCustomAction("myAction", async function(context) {
  // 处理逻辑
});
```

#### 2.2.3 查找机制

```javascript
// 主程序查找自定义内容
if (global.customActions[actionName]) {
  // 执行自定义动作
  global.executeCustomAction(actionName, context);
} else {
  // 执行内置动作
  this.executeBuiltinAction(actionName);
}
```

### 2.3 四层架构解析

#### 2.3.1 架构分层

```
┌──────────────────────────────────────┐
│  Layer 1: 按钮配置层                 │
│  xdyy_button_registry.js             │
│  - 定义按钮外观和关联                │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│  Layer 2: 菜单模板层                 │
│  xdyy_menu_registry.js               │
│  - 定义菜单结构和层级                │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│  Layer 3: 动作处理层                 │
│  xdyy_custom_actions_registry.js     │
│  - 实现具体功能逻辑                  │
└──────────────┬───────────────────────┘
               │
┌──────────────▼───────────────────────┐
│  Layer 4: 工具扩展层                 │
│  xdyy_utils_extensions.js            │
│  - 扩展工具函数和配置                │
└──────────────────────────────────────┘
```

#### 2.3.2 各层职责

**Layer 1 - 按钮配置层**：
```javascript
// 职责：定义按钮的视觉和行为
global.registerButton("custom15", {
  name: "制卡",              // 显示名称
  image: "makeCards",        // 图标文件
  templateName: "menu_makeCards"  // 关联的菜单模板
});
```

**Layer 2 - 菜单模板层**：
```javascript
// 职责：定义交互结构
global.registerMenuTemplate("menu_makeCards", {
  action: "makeCards",       // 默认动作
  onLongPress: {            // 长按菜单
    action: "menu",
    menuItems: [
      {action: "quickMake", menuTitle: "快速制卡"},
      {action: "batchMake", menuTitle: "批量制卡"}
    ]
  }
});
```

**Layer 3 - 动作处理层**：
```javascript
// 职责：实现业务逻辑
global.registerCustomAction("makeCards", async function(context) {
  const {focusNote, focusNotes} = context;
  
  MNUtil.undoGrouping(() => {
    // 具体的制卡逻辑
    focusNotes.forEach(note => {
      // 处理每个卡片
    });
  });
});
```

**Layer 4 - 工具扩展层**：
```javascript
// 职责：提供通用能力
toolbarUtils.makeCard = function(note, options) {
  // 通用的制卡函数
  // 可被多个动作复用
};
```

### 2.4 解耦的实现细节

#### 2.4.1 加载顺序控制

```javascript
// main.js - 精确的加载顺序
JSB.newAddon = function(mainPath) {
  // 1. 加载核心模块
  JSB.require('utils');
  
  // 2. 加载工具扩展（可能被其他模块依赖）
  JSB.require('xdyy_utils_extensions');
  
  // 3. 其他初始化...
  JSB.require('webviewController');
  JSB.require('settingController');
  
  // 4. 加载自定义模块（在核心模块之后）
  JSB.require('xdyy_menu_registry');
  JSB.require('xdyy_button_registry');
  JSB.require('xdyy_custom_actions_registry');
}
```

#### 2.4.2 接口注入点

在主程序中只需要一个注入点：

```javascript
// utils.js - 唯一的修改点
customActionByDes: async function(des, button, controller) {
  switch(des.action) {
    // ... 内置动作处理 ...
    
    default:
      // 注入点 - 检查自定义动作
      if (typeof global !== 'undefined' && global.executeCustomAction) {
        const context = {button, des, focusNote, focusNotes, self: controller};
        const handled = await global.executeCustomAction(des.action, context);
        if (handled) break;
      }
      MNUtil.showHUD("Not supported yet...");
  }
}
```

#### 2.4.3 配置融合机制（核心原理）

自定义按钮与官方按钮的融合是通过**重写 `getActions` 方法**实现的。这是整个补丁架构的核心，让我详细解释：

**步骤 1：保存原始方法**
```javascript
// xdyy_button_registry.js
// 首先保存官方的 getActions 方法，避免丢失原始逻辑
if (!toolbarConfig._originalGetActions) {
  toolbarConfig._originalGetActions = toolbarConfig.getActions;
}
```

**步骤 2：重写 getActions 方法**
```javascript
// 重写 getActions，这个方法会被 setToolbarButton 调用
toolbarConfig.getActions = function() {
  // 1. 调用原始方法，获取官方定义的所有按钮
  // 官方的 getActions 返回包含所有内置按钮的对象
  const defaultActions = toolbarConfig._originalGetActions 
    ? toolbarConfig._originalGetActions.call(this) 
    : {};
  
  // defaultActions 现在包含：
  // {
  //   "copy": {name:"Copy", image:"copy", description:{...}},
  //   "timer": {name:"Timer", image:"timer", description:{...}},
  //   "custom1": {name:"Custom 1", image:"custom1", description:{...}},
  //   "custom2": {name:"Custom 2", image:"custom2", description:{...}},
  //   ... // 所有官方按钮
  // }
  
  // 2. 如果没有自定义按钮，直接返回官方按钮
  if (Object.keys(global.customButtons).length === 0) {
    return defaultActions;
  }
  
  // 3. 创建新的按钮集合对象
  const allActions = {};
  
  // 4. 【关键】先添加所有自定义按钮
  // 这会覆盖同名的官方 custom 按钮
  for (const key in global.customButtons) {
    const button = Object.assign({}, global.customButtons[key]);
    
    // 5. 处理 templateName -> description 的转换
    // templateName 是菜单模板名称，需要转换为实际的 description 对象
    if (button.templateName && !button.description && toolbarConfig.template) {
      // 调用 template 方法获取菜单配置
      button.description = toolbarConfig.template(button.templateName);
    }
    
    // 6. 清理临时属性
    delete button.templateName;
    
    // 7. 添加到最终集合（会覆盖同名官方按钮）
    allActions[key] = button;
  }
  
  // 8. 添加非 custom 的官方按钮（保留官方的核心功能按钮）
  for (const key in defaultActions) {
    // 只添加：
    // - 不是 custom 开头的按钮（如 copy, timer, undo 等）
    // - 且没有被自定义按钮覆盖的
    if (!key.startsWith('custom') && !(key in allActions)) {
      allActions[key] = defaultActions[key];
    }
  }
  
  return allActions;
  // 最终返回的 allActions 包含：
  // - 所有自定义的 custom 按钮（覆盖了官方的）
  // - 所有官方的非 custom 按钮（如 copy, timer 等）
};
```

**步骤 3：调用链分析**

```
用户打开工具栏
    ↓
webviewController.viewDidLoad()
    ↓
this.setToolbarButton(toolbarConfig.action)
    ↓
let actions = toolbarConfig.actions  // getter 触发
    ↓
toolbarConfig.getActions()  // 调用重写的方法
    ↓
返回融合后的按钮配置
    ↓
创建实际的 UIButton 实例
```

**完整流程图：**

```
┌─────────────────────────────────────────────────┐
│         官方 utils.js 中的 getActions()         │
│  返回所有官方按钮包括 custom1-19                │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼ 被保存为 _originalGetActions
┌─────────────────────────────────────────────────┐
│    xdyy_button_registry.js 重写 getActions()    │
│  1. 调用 _originalGetActions 获取官方按钮       │
│  2. 用自定义按钮覆盖 custom 按钮                │
│  3. 保留官方的功能按钮（copy, timer 等）        │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼ 返回融合后的配置
┌─────────────────────────────────────────────────┐
│         webviewController.js 使用按钮           │
│  根据返回的配置创建实际的按钮 UI                │
└─────────────────────────────────────────────────┘
```

**为什么这样设计？**

1. **无侵入性**：不修改官方的 `getActions` 实现，只是包装它
2. **向后兼容**：如果官方更新了按钮，自动继承新功能
3. **灵活性**：可以选择性覆盖，不影响官方核心功能
4. **可恢复**：通过 `_originalGetActions` 可以随时恢复原始行为

---

## 初学者必读：从零开始的完整开发流程

> **小白提示**：如果你从未接触过编程，请先按照本章节一步步操作，成功运行第一个功能后，再阅读其他章节的原理解释。

### 开发前的心理准备

1. **不要害怕报错**：报错是正常的，它们是在告诉你哪里需要修正
2. **从模仿开始**：先复制现有代码，运行成功后再尝试修改
3. **小步快跑**：每次只改一点点，确认没问题后再继续
4. **保持备份**：修改前先备份原文件，出错了可以恢复

### Step 0：理解文件结构（用房子做比喻）

```
mntoolbar/（这是你的房子）
├── main.js                 # 大门：插件的入口
├── utils.js                # 工具箱：各种工具函数
├── webviewController.js    # 客厅：用户看到和操作的界面
├── settingController.js    # 书房：设置界面
│
├── xdyy_button_registry.js # 装饰品清单：定义有哪些按钮
├── xdyy_menu_registry.js   # 菜谱：定义菜单内容
├── xdyy_custom_actions_registry.js # 说明书：定义每个按钮做什么
└── xdyy_utils_extensions.js # 工具箱扩展：额外的工具
```

### Step 1：准备开发环境

#### 1.1 找到插件文件夹

**macOS 路径**：
```
/Users/你的用户名/Library/Containers/QReader.MarginStudyMac/Data/Library/MarginNote Extensions/
```

**iOS/iPadOS 路径**：
```
在"文件"App中：我的 iPad > MarginNote 3 > Extensions
```

#### 1.2 创建测试文件

在 mntoolbar 文件夹中创建 `test_hello.js`：

```javascript
// test_hello.js - 你的第一个测试文件
// 这个文件用来测试你的代码是否正确

// 定义一个简单的测试函数
function testHello() {
  // MNUtil.showHUD 会在屏幕上显示一个提示框
  MNUtil.showHUD("Hello, MN Toolbar!");
  
  // MNUtil.log 会在控制台输出日志（用于调试）
  MNUtil.log("测试成功执行");
}

// 执行测试
testHello();
```

### Step 2：创建你的第一个按钮

#### 2.1 理解三要素

创建一个按钮需要三个要素，就像点菜：
1. **菜单上要有这道菜**（按钮注册）
2. **要知道这道菜怎么做**（菜谱/模板）
3. **厨师要会做这道菜**（动作实现）

#### 2.2 实战：添加"添加时间戳"按钮

**文件 1：xdyy_button_registry.js**（添加到 registerAllButtons 函数末尾）

```javascript
// 在 registerAllButtons() 函数的末尾，custom19 之前添加：
// 注意：custom15 到 custom19 可能已经被占用，检查后使用空闲的

// 如果 custom15 未被使用：
global.registerButton("custom15", {
  name: "时间戳",      // 按钮显示的文字
  image: "custom15",   // 使用 custom15.png 作为图标
  templateName: "menu_timestamp"  // 关联的菜单模板名称
});
```

**文件 2：xdyy_menu_registry.js**（在文件末尾添加）

```javascript
// 简单版本：点击直接执行
global.registerMenuTemplate("menu_timestamp", {
  action: "addTimestamp"  // 点击按钮时执行的动作名称
});

// 或者高级版本：带菜单
global.registerMenuTemplate("menu_timestamp", {
  action: "addTimestamp",      // 默认点击动作
  onLongPress: {               // 长按显示菜单
    action: "menu",
    menuWidth: 200,
    menuItems: [
      {
        action: "addTimestamp",
        menuTitle: "添加到标题"
      },
      {
        action: "addTimestampComment",
        menuTitle: "添加为评论"
      }
    ]
  }
});
```

**文件 3：xdyy_custom_actions_registry.js**（在文件末尾添加）

```javascript
// 注册主动作：添加时间戳到标题
global.registerCustomAction("addTimestamp", async function(context) {
  // context 包含了所有需要的信息
  const {focusNote} = context;  // 获取当前选中的卡片
  
  // 检查是否有选中的卡片
  if (!focusNote) {
    MNUtil.showHUD("❌ 请先选择一个卡片");
    return;
  }
  
  // 使用撤销分组，这样用户可以撤销这个操作
  MNUtil.undoGrouping(() => {
    // 获取当前时间
    const now = new Date();
    const timestamp = now.toLocaleString('zh-CN');
    
    // 修改卡片标题
    if (focusNote.noteTitle) {
      // 如果已有标题，在后面添加时间戳
      focusNote.noteTitle = focusNote.noteTitle + " [" + timestamp + "]";
    } else {
      // 如果没有标题，直接设置为时间戳
      focusNote.noteTitle = timestamp;
    }
    
    // 显示成功提示
    MNUtil.showHUD("✅ 时间戳已添加");
  });
});

// 注册附加动作：添加时间戳为评论
global.registerCustomAction("addTimestampComment", async function(context) {
  const {focusNote} = context;
  
  if (!focusNote) {
    MNUtil.showHUD("❌ 请先选择一个卡片");
    return;
  }
  
  MNUtil.undoGrouping(() => {
    const timestamp = new Date().toLocaleString('zh-CN');
    
    // 添加评论
    focusNote.appendComment("📅 " + timestamp);
    
    MNUtil.showHUD("✅ 时间戳已添加为评论");
  });
});
```

### Step 3：测试你的按钮

1. **重启 MarginNote**（完全退出再打开）
2. **打开工具栏设置**，找到你的新按钮（时间戳）
3. **将按钮添加到工具栏**
4. **选择一个卡片**，点击按钮测试

### 常见错误及解决方法

#### 错误 1：按钮不显示

**症状**：在设置中看不到新按钮

**检查清单**：
```javascript
// 1. 检查按钮是否注册成功
// 在 xdyy_button_registry.js 的 registerAllButtons 末尾添加：
MNUtil.log("按钮注册完成，共注册: " + Object.keys(global.customButtons).length + " 个按钮");

// 2. 检查文件是否被加载
// 在每个 xdyy_*.js 文件开头添加：
MNUtil.log("✅ 正在加载: [文件名]");
```

#### 错误 2：点击按钮没反应

**症状**：按钮显示了，但点击后什么都不发生

**调试方法**：
```javascript
// 在 customAction 函数开头添加日志
global.registerCustomAction("myAction", async function(context) {
  MNUtil.log("🚀 动作被触发: myAction");  // 添加这行
  MNUtil.showHUD("动作开始执行");          // 添加这行
  
  // 原有代码...
});
```

#### 错误 3：功能执行了但报错

**症状**：出现错误提示或功能不完整

**调试模板**：
```javascript
global.registerCustomAction("safeAction", async function(context) {
  try {
    MNUtil.log("开始执行 safeAction");
    
    // 检查必需的对象
    if (!context) {
      MNUtil.log("❌ context 为空");
      return;
    }
    
    const {focusNote} = context;
    if (!focusNote) {
      MNUtil.log("❌ 没有选中的卡片");
      MNUtil.showHUD("请先选择卡片");
      return;
    }
    
    MNUtil.log("✅ 找到卡片: " + focusNote.noteId);
    
    // 执行实际操作
    MNUtil.undoGrouping(() => {
      // 你的代码
    });
    
    MNUtil.log("✅ 执行成功");
    
  } catch (error) {
    // 捕获并显示错误
    MNUtil.log("❌ 错误: " + error);
    MNUtil.showHUD("错误: " + error.message);
  }
});
```

### 实用调试技巧

#### 技巧 1：使用日志定位问题

```javascript
// 在代码的关键位置添加日志
MNUtil.log("=== 步骤 1 ===");
// 一些代码
MNUtil.log("=== 步骤 2 ===");
// 更多代码
MNUtil.log("=== 步骤 3 ===");

// 如果日志只显示到步骤 2，说明问题在步骤 2 和 3 之间
```

#### 技巧 2：检查对象内容

```javascript
// 将对象复制到剪贴板，然后粘贴到文本编辑器查看
MNUtil.copyJSON(focusNote);
MNUtil.showHUD("对象已复制，请粘贴查看");
```

#### 技巧 3：逐步简化

```javascript
// 先从最简单的功能开始
global.registerCustomAction("test", async function(context) {
  // 第一步：只显示提示
  MNUtil.showHUD("测试");
  
  // 成功后，添加第二步
  // const {focusNote} = context;
  // MNUtil.showHUD("卡片ID: " + focusNote.noteId);
  
  // 再添加第三步...
});
```

### 从模仿到创新：学习路径

#### 第一阶段：模仿（第1-7天）
1. 复制现有按钮的代码
2. 只改变提示文字
3. 运行并观察效果

#### 第二阶段：修改（第8-14天）
1. 修改现有功能的部分逻辑
2. 组合两个功能
3. 添加新的参数

#### 第三阶段：创造（第15天后）
1. 设计自己的功能
2. 实现复杂的业务逻辑
3. 优化用户体验

### 实际案例：批量添加标签

这是一个完整的实用功能示例：

```javascript
// === Step 1: 注册按钮 (xdyy_button_registry.js) ===
global.registerButton("custom16", {
  name: "批量标签",
  image: "custom16",
  templateName: "menu_batchTag"
});

// === Step 2: 定义菜单 (xdyy_menu_registry.js) ===
global.registerMenuTemplate("menu_batchTag", {
  action: "menu",
  menuWidth: 200,
  menuItems: [
    "🏷️ 快速添加",
    {action: "addTag_important", menuTitle: "    📌 重要"},
    {action: "addTag_review", menuTitle: "    📖 待复习"},
    {action: "addTag_question", menuTitle: "    ❓ 疑问"},
    
    "🎯 批量操作",
    {action: "addCustomTag", menuTitle: "    自定义标签..."},
    {action: "removeAllTags", menuTitle: "    清除所有标签"}
  ]
});

// === Step 3: 实现功能 (xdyy_custom_actions_registry.js) ===

// 添加预设标签
global.registerCustomAction("addTag_important", async function(context) {
  addTagToNotes(context, "重要");
});

global.registerCustomAction("addTag_review", async function(context) {
  addTagToNotes(context, "待复习");
});

global.registerCustomAction("addTag_question", async function(context) {
  addTagToNotes(context, "疑问");
});

// 通用的添加标签函数
function addTagToNotes(context, tagName) {
  const {focusNotes} = context;  // 注意是 focusNotes（复数），获取所有选中的卡片
  
  if (!focusNotes || focusNotes.length === 0) {
    MNUtil.showHUD("❌ 请先选择卡片");
    return;
  }
  
  MNUtil.undoGrouping(() => {
    let count = 0;
    
    // 遍历所有选中的卡片
    focusNotes.forEach(note => {
      // 检查是否已有该标签
      if (!note.tags.includes(tagName)) {
        note.appendTags([tagName]);
        count++;
      }
    });
    
    if (count > 0) {
      MNUtil.showHUD(`✅ 已为 ${count} 个卡片添加标签 #${tagName}`);
    } else {
      MNUtil.showHUD(`ℹ️ 所有卡片已有标签 #${tagName}`);
    }
  });
}

// 自定义标签
global.registerCustomAction("addCustomTag", async function(context) {
  const {focusNotes} = context;
  
  if (!focusNotes || focusNotes.length === 0) {
    MNUtil.showHUD("❌ 请先选择卡片");
    return;
  }
  
  // 显示输入框
  UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
    "添加自定义标签",
    `将为 ${focusNotes.length} 个卡片添加标签`,
    2,  // 输入框样式
    "取消",
    ["添加"],
    (alert, buttonIndex) => {
      if (buttonIndex === 1) {
        const tagName = alert.textFieldAtIndex(0).text;
        
        if (tagName && tagName.trim()) {
          addTagToNotes(context, tagName.trim());
        } else {
          MNUtil.showHUD("❌ 标签名不能为空");
        }
      }
    }
  );
});

// 清除所有标签
global.registerCustomAction("removeAllTags", async function(context) {
  const {focusNotes} = context;
  
  if (!focusNotes || focusNotes.length === 0) {
    MNUtil.showHUD("❌ 请先选择卡片");
    return;
  }
  
  // 显示确认对话框
  UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
    "确认清除",
    `将清除 ${focusNotes.length} 个卡片的所有标签，此操作可撤销`,
    0,  // 默认样式
    "取消",
    ["清除"],
    (alert, buttonIndex) => {
      if (buttonIndex === 1) {
        MNUtil.undoGrouping(() => {
          let totalTags = 0;
          
          focusNotes.forEach(note => {
            totalTags += note.tags.length;
            note.tags = [];  // 清空标签数组
          });
          
          MNUtil.showHUD(`✅ 已清除 ${totalTags} 个标签`);
        });
      }
    }
  );
});
```

### 💡 给初学者的建议

1. **不要贪多**：先实现一个简单功能，完全理解后再做下一个
2. **多看官方代码**：utils.js 中有很多可以学习的例子
3. **善用搜索**：遇到不懂的 API，在项目中搜索它的用法
4. **保持耐心**：编程是一个渐进的过程，每天进步一点点
5. **记录笔记**：把学到的东西记下来，下次遇到类似问题就有参考了

---

## 第三部分：开发实践指南

### 3.1 环境准备

#### 3.1.1 目录结构

```
mntoolbar/
├── main.js                    # 主入口（尽量不修改）
├── utils.js                   # 工具类（尽量不修改）
├── webviewController.js       # UI控制（尽量不修改）
├── settingController.js       # 设置界面（尽量不修改）
│
├── xdyy_button_registry.js    # 自定义按钮配置
├── xdyy_menu_registry.js      # 自定义菜单模板
├── xdyy_custom_actions_registry.js  # 自定义动作实现
├── xdyy_utils_extensions.js   # 工具函数扩展
│
└── 图标文件/
    ├── custom1.png
    ├── custom2.png
    └── ...
```

#### 3.1.2 开发工具

- **代码编辑器**：VSCode 或其他支持 JavaScript 的编辑器
- **调试工具**：MarginNote 的控制台输出
- **图标制作**：40x40 像素的 PNG 图片

### 3.2 快速上手：第一个按钮

让我们创建一个简单的"添加时间戳"按钮。

#### Step 1：注册按钮（xdyy_button_registry.js）

```javascript
// 在 registerAllButtons() 函数中添加
global.registerButton("customTimestamp", {
  name: "时间戳",
  image: "timestamp",  // 需要 timestamp.png 图标文件
  templateName: "menu_timestamp"
});
```

#### Step 2：定义菜单（xdyy_menu_registry.js）

```javascript
// 简单版本 - 直接执行
global.registerMenuTemplate("menu_timestamp", {
  action: "addTimestamp"
});

// 或带菜单版本
global.registerMenuTemplate("menu_timestamp", {
  action: "addTimestamp",  // 默认动作
  onLongPress: {           // 长按显示选项
    action: "menu",
    menuWidth: 200,
    menuItems: [
      {action: "addTimestamp", menuTitle: "添加到标题"},
      {action: "addTimestampComment", menuTitle: "添加为评论"},
      {action: "copyTimestamp", menuTitle: "复制时间戳"}
    ]
  }
});
```

#### Step 3：实现功能（xdyy_custom_actions_registry.js）

```javascript
// 注册主动作
global.registerCustomAction("addTimestamp", async function(context) {
  const {focusNote} = context;
  
  if (!focusNote) {
    MNUtil.showHUD("❌ 请先选择卡片");
    return;
  }
  
  MNUtil.undoGrouping(() => {
    const timestamp = new Date().toLocaleString('zh-CN');
    
    if (focusNote.noteTitle) {
      focusNote.noteTitle = `${focusNote.noteTitle} [${timestamp}]`;
    } else {
      focusNote.noteTitle = timestamp;
    }
    
    MNUtil.showHUD("✅ 已添加时间戳");
  });
});

// 注册其他动作
global.registerCustomAction("addTimestampComment", async function(context) {
  const {focusNote} = context;
  
  if (!focusNote) {
    MNUtil.showHUD("❌ 请先选择卡片");
    return;
  }
  
  MNUtil.undoGrouping(() => {
    const timestamp = new Date().toLocaleString('zh-CN');
    focusNote.appendComment(`时间戳: ${timestamp}`);
    MNUtil.showHUD("✅ 已添加时间戳评论");
  });
});

global.registerCustomAction("copyTimestamp", async function(context) {
  const timestamp = new Date().toLocaleString('zh-CN');
  MNUtil.copy(timestamp);
  MNUtil.showHUD(`✅ 已复制: ${timestamp}`);
});
```

#### Step 4：添加到工具栏

在 MarginNote 的工具栏设置中，将新按钮添加到工具栏即可。

### 3.3 进阶：多级菜单

创建一个复杂的多级菜单系统：

```javascript
// xdyy_menu_registry.js
global.registerMenuTemplate("menu_advanced", {
  action: "menu",
  menuWidth: 250,
  menuItems: [
    "📝 笔记操作",  // 分组标题
    {
      action: "noteOperation1",
      menuTitle: "    整理格式"
    },
    {
      action: "menu",  // 子菜单
      menuTitle: "    批量处理 ➡️",
      menuItems: [
        {action: "batchRename", menuTitle: "批量重命名"},
        {action: "batchTag", menuTitle: "批量添加标签"},
        {action: "batchMove", menuTitle: "批量移动"}
      ]
    },
    
    "🎨 样式调整",  // 另一个分组
    {
      action: "menu",
      menuTitle: "    颜色方案 ➡️",
      menuItems: [
        {action: "colorScheme1", menuTitle: "学术风格"},
        {action: "colorScheme2", menuTitle: "商务风格"},
        {action: "colorScheme3", menuTitle: "创意风格"}
      ]
    }
  ]
});
```

### 3.4 用户交互模式

#### 3.4.1 输入框交互

```javascript
global.registerCustomAction("renameNote", async function(context) {
  const {focusNote} = context;
  
  if (!focusNote) {
    MNUtil.showHUD("❌ 请先选择卡片");
    return;
  }
  
  // 显示输入框
  UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
    "重命名卡片",
    "请输入新的标题:",
    2,  // UIAlertViewStylePlainTextInput
    "取消",
    ["确定"],
    (alert, buttonIndex) => {
      if (buttonIndex === 1) {  // 点击确定
        const newTitle = alert.textFieldAtIndex(0).text;
        
        if (newTitle && newTitle.trim()) {
          MNUtil.undoGrouping(() => {
            focusNote.noteTitle = newTitle.trim();
            MNUtil.showHUD("✅ 重命名成功");
          });
        }
      }
    }
  );
  
  // 设置默认值
  let alert = UIAlertView.lastAlert;
  alert.textFieldAtIndex(0).text = focusNote.noteTitle || "";
});
```

#### 3.4.2 选择列表交互

```javascript
global.registerCustomAction("selectTemplate", async function(context) {
  const templates = [
    "📚 学习笔记",
    "💼 会议记录",
    "💡 灵感速记",
    "📊 数据分析",
    "🎯 目标规划"
  ];
  
  // 创建选择菜单
  const commandTable = templates.map(template => ({
    title: template,
    object: global,
    selector: 'applyTemplate:',
    param: {template, context}
  }));
  
  // 显示菜单
  MNUtil.getPopoverAndPresent(
    context.button,
    commandTable,
    200
  );
});

// 处理选择
global.applyTemplate = function(param) {
  const {template, context} = param;
  const {focusNote} = context;
  
  MNUtil.undoGrouping(() => {
    // 根据模板应用不同的格式
    switch(template) {
      case "📚 学习笔记":
        focusNote.noteTitle = `【学习】${focusNote.noteTitle || ""}`;
        focusNote.colorIndex = 3;  // 黄色
        break;
      case "💼 会议记录":
        focusNote.noteTitle = `【会议】${focusNote.noteTitle || ""}`;
        focusNote.colorIndex = 4;  // 绿色
        break;
      // ... 其他模板
    }
    
    MNUtil.showHUD(`✅ 已应用模板: ${template}`);
  });
};
```

#### 3.4.3 进度反馈

```javascript
global.registerCustomAction("batchProcess", async function(context) {
  const {focusNotes} = context;
  
  if (!focusNotes || focusNotes.length === 0) {
    MNUtil.showHUD("❌ 请先选择卡片");
    return;
  }
  
  const total = focusNotes.length;
  let processed = 0;
  
  // 显示开始提示
  MNUtil.showHUD(`⏳ 开始处理 ${total} 个卡片...`);
  
  for (const note of focusNotes) {
    // 处理每个卡片
    await processNote(note);
    
    processed++;
    
    // 更新进度（每处理 10% 显示一次）
    if (processed % Math.ceil(total / 10) === 0 || processed === total) {
      const percent = Math.round((processed / total) * 100);
      MNUtil.showHUD(`⏳ 处理进度: ${percent}% (${processed}/${total})`);
    }
    
    // 避免阻塞 UI
    if (processed % 10 === 0) {
      await MNUtil.delay(0.01);
    }
  }
  
  MNUtil.showHUD(`✅ 完成！共处理 ${total} 个卡片`);
});
```

### 3.5 最佳实践

#### 3.5.1 错误处理

```javascript
global.registerCustomAction("safeAction", async function(context) {
  try {
    // 参数验证
    if (!context || !context.focusNote) {
      MNUtil.showHUD("❌ 无效的上下文");
      return;
    }
    
    // 使用撤销分组
    MNUtil.undoGrouping(() => {
      // 危险操作
      performDangerousOperation();
    });
    
  } catch (error) {
    // 记录错误
    if (toolbarUtils && toolbarUtils.addErrorLog) {
      toolbarUtils.addErrorLog(error, "safeAction");
    }
    
    // 用户友好的错误提示
    MNUtil.showHUD(`❌ 操作失败: ${error.message || "未知错误"}`);
    
    // 开发模式下输出详细信息
    if (typeof MNUtil !== "undefined" && MNUtil.log) {
      MNUtil.log(`错误详情: ${error.stack}`);
    }
  }
});
```

#### 3.5.2 性能优化

```javascript
// 批量操作优化
global.registerCustomAction("optimizedBatch", async function(context) {
  const {focusNotes} = context;
  
  // 使用单个撤销组
  MNUtil.undoGrouping(() => {
    // 批量收集数据，减少 API 调用
    const noteData = focusNotes.map(note => ({
      id: note.noteId,
      title: note.noteTitle,
      color: note.colorIndex
    }));
    
    // 批量处理
    processBatch(noteData);
    
    // 批量更新
    focusNotes.forEach((note, index) => {
      note.noteTitle = noteData[index].title;
      note.colorIndex = noteData[index].color;
    });
  });
});
```

#### 3.5.3 状态管理

```javascript
// 使用闭包保存状态
(function() {
  // 私有状态
  let lastProcessedId = null;
  let processCount = 0;
  
  global.registerCustomAction("statefulAction", async function(context) {
    const {focusNote} = context;
    
    // 检查是否重复处理
    if (focusNote.noteId === lastProcessedId) {
      MNUtil.showHUD("⚠️ 该卡片刚刚已处理");
      return;
    }
    
    // 更新状态
    lastProcessedId = focusNote.noteId;
    processCount++;
    
    // 执行操作
    MNUtil.undoGrouping(() => {
      focusNote.appendComment(`处理次序: #${processCount}`);
    });
    
    MNUtil.showHUD(`✅ 已处理 (总计: ${processCount})`);
  });
})();
```

#### 3.5.4 调试技巧

```javascript
// 开发模式开关
const DEBUG = true;

global.registerCustomAction("debugAction", async function(context) {
  if (DEBUG) {
    // 输出详细调试信息
    MNUtil.log("=== 调试信息 ===");
    MNUtil.log(`Context keys: ${Object.keys(context).join(", ")}`);
    MNUtil.log(`FocusNote: ${context.focusNote?.noteId}`);
    MNUtil.log(`FocusNotes count: ${context.focusNotes?.length}`);
    
    // 复制完整上下文到剪贴板（方便分析）
    MNUtil.copyJSON(context);
    MNUtil.showHUD("📋 上下文已复制到剪贴板");
  }
  
  // 实际功能逻辑
  performActualWork(context);
});
```

---

## 第四部分：API 参考

### 4.1 核心 API

#### 4.1.1 MNNote API

```javascript
// 获取卡片
const focusNote = MNNote.getFocusNote();        // 当前选中的卡片
const focusNotes = MNNote.getFocusNotes();      // 所有选中的卡片
const note = MNNote.new(noteId);                // 根据 ID 获取卡片

// 卡片属性
note.noteId           // 卡片 ID
note.noteTitle        // 标题
note.excerptText      // 摘录文本
note.noteURL          // 卡片链接
note.colorIndex       // 颜色索引 (0-15)
note.fillIndex        // 填充样式索引
note.mindmapBranchIndex  // 脑图分支样式
note.tags             // 标签数组
note.comments         // 评论数组
note.parentNote       // 父卡片
note.childNotes       // 子卡片数组
note.linkedNotes      // 链接的卡片

// 卡片方法
note.appendComment(text);           // 添加文本评论
note.appendHtmlComment(html);       // 添加 HTML 评论
note.appendTags(["tag1", "tag2"]);  // 添加标签
note.removeCommentAtIndex(0);       // 删除评论
note.addChild(childNote);           // 添加子卡片
note.removeFromParent();           // 从父卡片移除
note.toBeIndependent();            // 转为独立卡片
note.merge(anotherNote);           // 合并卡片
note.focusInMindMap(duration);     // 在脑图中聚焦
note.focusInDocument();            // 在文档中聚焦
note.paste();                      // 粘贴剪贴板内容
note.clearFormat();                // 清除格式
```

#### 4.1.2 MNUtil API

```javascript
// UI 反馈
MNUtil.showHUD(message);            // 显示提示信息
MNUtil.confirm(title, message);     // 显示确认对话框
MNUtil.alert(title, message);       // 显示警告对话框

// 剪贴板
MNUtil.copy(text);                  // 复制文本
MNUtil.copyJSON(object);            // 复制 JSON 对象
MNUtil.copyImage(imageData);        // 复制图片
MNUtil.clipboardText                // 获取剪贴板文本

// 撤销管理
MNUtil.undoGrouping(() => {         // 创建撤销组
  // 多个操作作为一次撤销
});

// 异步控制
await MNUtil.delay(seconds);        // 延迟执行
MNUtil.animate(() => {              // 动画执行
  // UI 变化
}, duration);

// 系统信息
MNUtil.studyMode                    // 学习模式
MNUtil.currentNotebookId            // 当前笔记本 ID
MNUtil.currentDocmd5                // 当前文档 MD5
MNUtil.currentWindow                // 当前窗口
MNUtil.studyView                    // 学习视图
MNUtil.version                      // 版本信息

// 选择和选中
MNUtil.selectionText                // 选中的文本
MNUtil.currentSelection              // 当前选择对象

// 通知
MNUtil.postNotification(name, userInfo);  // 发送通知
MNUtil.addObserver(target, selector, name);  // 添加观察者
MNUtil.removeObserver(target, name);      // 移除观察者

// 工具函数
MNUtil.log(message);                // 输出日志
MNUtil.openURL(url);                // 打开 URL
MNUtil.refreshAddonCommands();      // 刷新插件命令
```

#### 4.1.3 toolbarConfig API

```javascript
// 配置管理
toolbarConfig.save(key, value);     // 保存配置
toolbarConfig.load(key);            // 加载配置
toolbarConfig.getWindowState(key);  // 获取窗口状态
toolbarConfig.setWindowState(key, value);  // 设置窗口状态

// 按钮和动作
toolbarConfig.action                // 当前工具栏按钮数组
toolbarConfig.dynamicAction          // 动态工具栏按钮数组
toolbarConfig.getDescriptionById(id);  // 获取动作描述
toolbarConfig.getDesByButtonName(name);  // 通过按钮名获取描述
toolbarConfig.imageConfigs          // 图标配置

// 工具栏状态
toolbarConfig.dynamic                // 是否动态模式
toolbarConfig.vertical();            // 是否垂直布局
toolbarConfig.horizontal();         // 是否水平布局
```

#### 4.1.4 UIKit API

```javascript
// 按钮
UIButton.buttonWithType(type);
button.setTitleForState(title, state);
button.setImageForState(image, state);
button.addTargetActionForControlEvents(target, action, events);
button.removeTargetActionForControlEvents(target, action, events);

// 颜色
UIColor.whiteColor();
UIColor.blackColor();
UIColor.colorWithHexString("#FF0000");
color.colorWithAlphaComponent(0.5);

// 弹窗
UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
  title,
  message,
  style,        // 0: 默认, 1: 密码, 2: 输入框
  cancelTitle,
  otherTitles,  // 数组
  callback      // (alert, buttonIndex) => {}
);

// 手势
gesture.state  // 1: began, 2: changed, 3: ended
gesture.locationInView(view);
```

### 4.2 调试技巧

#### 4.2.1 日志输出

```javascript
// 基础日志
MNUtil.log("简单消息");
MNUtil.log(`变量值: ${variable}`);

// 对象调试
MNUtil.copyJSON(complexObject);  // 复制到剪贴板查看
MNUtil.log(JSON.stringify(object, null, 2));  // 格式化输出

// 条件日志
const DEBUG = true;
if (DEBUG) {
  MNUtil.log("调试信息");
}

// 日志分类
MNUtil.log("🔧 初始化");
MNUtil.log("✅ 成功");
MNUtil.log("❌ 错误");
MNUtil.log("🔍 查找");
MNUtil.log("🚀 执行");
```

#### 4.2.2 断点调试

```javascript
// 使用 debugger 语句（需要开发者工具支持）
global.registerCustomAction("debugAction", async function(context) {
  debugger;  // 断点
  
  // 检查变量
  console.log(context);
});

// 手动断点
global.registerCustomAction("manualBreak", async function(context) {
  // 暂停并显示信息
  MNUtil.confirm("调试断点", `
    FocusNote: ${context.focusNote?.noteId}
    Button: ${context.button?.target}
    继续执行？
  `);
  
  // 继续执行
  performWork();
});
```

#### 4.2.3 性能分析

```javascript
// 计时器
global.registerCustomAction("timedAction", async function(context) {
  const startTime = Date.now();
  
  // 执行操作
  await heavyOperation();
  
  const elapsed = Date.now() - startTime;
  MNUtil.log(`执行时间: ${elapsed}ms`);
  
  if (elapsed > 1000) {
    MNUtil.log("⚠️ 性能警告: 操作耗时超过 1 秒");
  }
});

// 内存监控
global.registerCustomAction("memoryCheck", async function(context) {
  const before = process.memoryUsage?.();
  
  // 执行操作
  performOperation();
  
  const after = process.memoryUsage?.();
  if (before && after) {
    const diff = after.heapUsed - before.heapUsed;
    MNUtil.log(`内存使用: ${diff / 1024 / 1024}MB`);
  }
});
```

### 4.3 常见问题

#### Q1: 按钮不显示

**可能原因**：
1. 图标文件缺失
2. 按钮未正确注册
3. 加载顺序错误

**解决方案**：
```javascript
// 检查按钮是否注册
MNUtil.log(`按钮注册: ${global.customButtons["myButton"] ? "是" : "否"}`);

// 检查图标
MNUtil.log(`图标存在: ${toolbarConfig.imageConfigs["myIcon"] ? "是" : "否"}`);

// 强制刷新
MNUtil.refreshAddonCommands();
```

#### Q2: 动作不执行

**可能原因**：
1. action 名称不匹配
2. 函数未正确注册
3. 错误被静默捕获

**解决方案**：
```javascript
// 添加日志追踪
global.registerCustomAction("myAction", async function(context) {
  MNUtil.log("动作开始执行");  // 添加日志
  
  try {
    // 实际逻辑
  } catch (error) {
    MNUtil.log(`错误: ${error}`);  // 捕获错误
    throw error;  // 重新抛出
  }
});
```

#### Q3: 菜单不显示

**可能原因**：
1. 菜单模板格式错误
2. menuItems 为空
3. 手势识别冲突

**解决方案**：
```javascript
// 验证菜单模板
const template = global.customMenuTemplates["myMenu"];
MNUtil.copyJSON(template);  // 检查结构

// 确保有菜单项
if (!template.menuItems || template.menuItems.length === 0) {
  MNUtil.log("警告: 菜单项为空");
}
```

#### Q4: 撤销不工作

**可能原因**：
1. 未使用 undoGrouping
2. 操作不支持撤销
3. 撤销组嵌套

**解决方案**：
```javascript
// 正确使用撤销组
MNUtil.undoGrouping(() => {
  // 所有修改操作都放在这里
  note.noteTitle = "新标题";
  note.colorIndex = 3;
});

// 避免嵌套
let inUndoGroup = false;
function safeUndo(callback) {
  if (inUndoGroup) {
    callback();
  } else {
    inUndoGroup = true;
    MNUtil.undoGrouping(callback);
    inUndoGroup = false;
  }
}
```

#### Q5: 内存泄漏

**可能原因**：
1. 事件监听未清理
2. 定时器未清除
3. 循环引用

**解决方案**：
```javascript
// 使用闭包管理资源
(function() {
  let timer = null;
  let observer = null;
  
  global.registerCustomAction("managedAction", async function(context) {
    // 清理旧资源
    if (timer) {
      clearTimeout(timer);
    }
    if (observer) {
      MNUtil.removeObserver(observer);
    }
    
    // 创建新资源
    timer = setTimeout(() => {
      // 延迟操作
    }, 1000);
    
    // 确保清理
    context.self?.cleanupCallbacks?.push(() => {
      clearTimeout(timer);
    });
  });
})();
```

---

## 附录 A：完整示例

### 批量制卡功能完整实现

这是一个完整的批量制卡功能示例，展示了所有概念的综合应用：

```javascript
// === xdyy_button_registry.js ===
global.registerButton("batchCards", {
  name: "批量制卡",
  image: "batchcards",
  templateName: "menu_batchCards"
});

// === xdyy_menu_registry.js ===
global.registerMenuTemplate("menu_batchCards", {
  action: "quickBatchCards",
  onLongPress: {
    action: "menu",
    menuWidth: 250,
    menuItems: [
      "⚡ 快速操作",
      {action: "quickBatchCards", menuTitle: "    一键制卡"},
      {action: "batchCardsWithOptions", menuTitle: "    制卡选项..."},
      
      "🎨 预设模板",
      {action: "academicCards", menuTitle: "    学术模板"},
      {action: "reviewCards", menuTitle: "    复习模板"},
      {action: "summaryCards", menuTitle: "    总结模板"},
      
      "⚙️ 高级",
      {action: "batchCardsSettings", menuTitle: "    设置默认选项"},
      {action: "batchCardsHistory", menuTitle: "    查看历史"}
    ]
  }
});

// === xdyy_custom_actions_registry.js ===

// 状态管理
const batchCardsState = {
  lastOptions: {},
  history: [],
  processing: false
};

// 主功能：快速批量制卡
global.registerCustomAction("quickBatchCards", async function(context) {
  const {focusNotes} = context;
  
  if (!focusNotes || focusNotes.length === 0) {
    MNUtil.showHUD("❌ 请先选择要制卡的笔记");
    return;
  }
  
  if (batchCardsState.processing) {
    MNUtil.showHUD("⚠️ 正在处理中，请稍候");
    return;
  }
  
  batchCardsState.processing = true;
  const startTime = Date.now();
  
  try {
    MNUtil.showHUD(`⏳ 开始处理 ${focusNotes.length} 个卡片...`);
    
    let successCount = 0;
    let failCount = 0;
    
    MNUtil.undoGrouping(() => {
      focusNotes.forEach((note, index) => {
        try {
          // 制卡核心逻辑
          processNoteToCard(note);
          successCount++;
          
          // 进度反馈
          if ((index + 1) % 10 === 0) {
            const progress = Math.round(((index + 1) / focusNotes.length) * 100);
            MNUtil.showHUD(`⏳ 进度: ${progress}%`);
          }
        } catch (error) {
          failCount++;
          MNUtil.log(`制卡失败 [${note.noteId}]: ${error}`);
        }
      });
    });
    
    // 记录历史
    const record = {
      time: new Date().toISOString(),
      total: focusNotes.length,
      success: successCount,
      fail: failCount,
      duration: Date.now() - startTime
    };
    batchCardsState.history.unshift(record);
    if (batchCardsState.history.length > 10) {
      batchCardsState.history.pop();
    }
    
    // 显示结果
    const message = failCount > 0 
      ? `✅ 完成！成功: ${successCount}, 失败: ${failCount}`
      : `✅ 成功制作 ${successCount} 张卡片`;
    MNUtil.showHUD(message);
    
  } catch (error) {
    MNUtil.showHUD(`❌ 批量制卡失败: ${error.message}`);
    toolbarUtils.addErrorLog(error, "quickBatchCards");
  } finally {
    batchCardsState.processing = false;
  }
});

// 带选项的批量制卡
global.registerCustomAction("batchCardsWithOptions", async function(context) {
  // 显示选项对话框
  const options = await showCardOptions();
  
  if (!options) {
    return;  // 用户取消
  }
  
  // 保存选项
  batchCardsState.lastOptions = options;
  
  // 执行制卡
  await processBatchCardsWithOptions(context, options);
});

// 学术模板
global.registerCustomAction("academicCards", async function(context) {
  const academicOptions = {
    addTitle: true,
    titlePrefix: "【学术】",
    colorIndex: 3,  // 黄色
    addTags: ["学术", "待整理"],
    addToReview: true,
    extractKeywords: true
  };
  
  await processBatchCardsWithOptions(context, academicOptions);
});

// 核心处理函数
function processNoteToCard(note, options = {}) {
  // 默认选项
  const opts = {
    addTitle: true,
    titlePrefix: "",
    colorIndex: null,
    addTags: [],
    addToReview: false,
    extractKeywords: false,
    ...options
  };
  
  // 1. 处理标题
  if (opts.addTitle && !note.noteTitle) {
    const title = extractTitle(note);
    note.noteTitle = opts.titlePrefix + title;
  }
  
  // 2. 设置颜色
  if (opts.colorIndex !== null) {
    note.colorIndex = opts.colorIndex;
  }
  
  // 3. 添加标签
  if (opts.addTags.length > 0) {
    note.appendTags(opts.addTags);
  }
  
  // 4. 加入复习
  if (opts.addToReview) {
    // 调用复习相关 API
    addToReviewSystem(note);
  }
  
  // 5. 提取关键词
  if (opts.extractKeywords) {
    const keywords = extractKeywords(note.excerptText);
    if (keywords.length > 0) {
      note.appendComment(`关键词: ${keywords.join(", ")}`);
    }
  }
}

// 辅助函数：提取标题
function extractTitle(note) {
  if (note.excerptText) {
    // 从摘录提取第一句作为标题
    const firstSentence = note.excerptText.split(/[。！？\n]/)[0];
    return firstSentence.substring(0, 30);
  }
  return "未命名卡片";
}

// 辅助函数：提取关键词
function extractKeywords(text) {
  if (!text) return [];
  
  // 简单的关键词提取逻辑
  const words = text.match(/[\u4e00-\u9fa5]{2,}/g) || [];
  const frequency = {};
  
  words.forEach(word => {
    frequency[word] = (frequency[word] || 0) + 1;
  });
  
  // 按频率排序，取前5个
  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word);
}

// === xdyy_utils_extensions.js ===
// 扩展工具函数
toolbarUtils.batchCardsUtils = {
  // 获取默认选项
  getDefaultOptions() {
    return batchCardsState.lastOptions || {
      addTitle: true,
      colorIndex: null,
      addTags: [],
      addToReview: false
    };
  },
  
  // 获取历史记录
  getHistory() {
    return batchCardsState.history;
  },
  
  // 清空历史
  clearHistory() {
    batchCardsState.history = [];
    MNUtil.showHUD("✅ 历史已清空");
  }
};
```

---

## 附录 B：开发检查清单

在发布你的扩展之前，请确保：

### 功能检查

- [ ] 所有按钮都能正常显示
- [ ] 点击、长按、双击功能都正常
- [ ] 菜单能正确弹出和导航
- [ ] 错误处理完善，不会崩溃
- [ ] 撤销功能正常工作

### 代码质量

- [ ] 使用有意义的函数和变量名
- [ ] 添加必要的注释
- [ ] 遵循一致的代码风格
- [ ] 没有调试代码遗留
- [ ] 没有硬编码的测试数据

### 性能优化

- [ ] 批量操作使用单个撤销组
- [ ] 大量数据处理有进度反馈
- [ ] 避免不必要的 API 调用
- [ ] 及时清理资源和监听器

### 用户体验

- [ ] 操作有明确的反馈（HUD 提示）
- [ ] 错误信息友好易懂
- [ ] 危险操作有确认提示
- [ ] 图标清晰易识别

### 文档完善

- [ ] README 说明功能和用法
- [ ] 列出所有依赖项
- [ ] 提供安装指南
- [ ] 包含常见问题解答

---

## 结语

MN Toolbar 的扩展开发既简单又强大。通过本指南介绍的"补丁"架构，你可以：

1. **无侵入地扩展功能** - 不修改官方代码
2. **模块化管理代码** - 清晰的分层结构
3. **快速迭代开发** - 即改即用
4. **轻松分享成果** - 独立的扩展文件

记住核心原则：
- **分离关注点**：按钮、菜单、动作、工具各司其职
- **注册而非修改**：通过注册表添加功能
- **上下文驱动**：通过 context 对象传递所有信息
- **用户至上**：始终提供清晰的反馈

无论你是想添加一个简单的快捷操作，还是构建复杂的工作流系统，这个架构都能满足你的需求。

Happy Coding! 🚀

---

## 快速索引：我想要...

> **小白提示**：根据你的需求，快速找到对应的章节。

### 🚀 如果你想快速上手
- **从零开始** → [初学者必读](#初学者必读从零开始的完整开发流程)
- **创建第一个按钮** → [Step 2：创建你的第一个按钮](#step-2创建你的第一个按钮)
- **看完整示例** → [附录 A：完整示例](#附录-a完整示例)

### 🔍 如果你想理解原理
- **按钮如何工作** → [1.2 按钮工作原理](#12-按钮工作原理)
- **菜单如何弹出** → [1.3 菜单系统原理](#13-菜单系统原理)
- **动作如何执行** → [1.4 动作处理流程](#14-动作处理流程)

### 🛠️ 如果你想深入开发
- **理解补丁架构** → [第二部分：补丁架构设计](#第二部分补丁架构设计)
- **配置融合机制** → [2.4.3 配置融合机制](#243-配置融合机制核心原理)
- **高级交互模式** → [3.4 用户交互模式](#34-用户交互模式)

### ❓ 如果你遇到问题
- **按钮不显示** → [Q1: 按钮不显示](#q1-按钮不显示)
- **动作不执行** → [Q2: 动作不执行](#q2-动作不执行)
- **菜单不弹出** → [Q3: 菜单不显示](#q3-菜单不显示)
- **常见错误** → [常见错误及解决方法](#常见错误及解决方法)

### 📚 如果你想查 API
- **卡片操作** → [4.1.1 MNNote API](#411-mnote-api)
- **工具方法** → [4.1.2 MNUtil API](#412-mnutil-api)
- **UI 组件** → [4.1.4 UIKit API](#414-uikit-api)

### 💡 学习路径推荐

**第 1 周：基础入门**
1. 阅读[初学者必读](#初学者必读从零开始的完整开发流程)
2. 完成第一个按钮
3. 理解基本原理

**第 2 周：进阶实践**
1. 学习[多级菜单](#33-进阶多级菜单)
2. 掌握[用户交互](#34-用户交互模式)
3. 实现批量操作

**第 3 周：深入理解**
1. 研究[补丁架构](#第二部分补丁架构设计)
2. 理解配置融合
3. 优化性能

**第 4 周：独立开发**
1. 设计自己的功能
2. 处理复杂逻辑
3. 发布分享

---

*本指南持续更新中。如有问题或建议，欢迎提交 Issue 或 Pull Request。*