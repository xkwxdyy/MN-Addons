/**
 * 🎯 UIView Frame 管理工具类 - 控制界面元素的位置和大小
 * 
 * 【什么是 Frame？】
 * Frame 是 iOS/macOS 中描述界面元素位置和大小的概念，包含 4 个属性：
 * - x: 元素左边缘到父视图左边缘的距离
 * - y: 元素上边缘到父视图上边缘的距离  
 * - width: 元素的宽度
 * - height: 元素的高度
 * 
 * 【坐标系统说明】
 * iOS/macOS 的坐标系统：
 * (0,0) ┌─────────────────────► X 轴（向右为正）
 *       │
 *       │   ┌─────────┐
 *       │   │ 按钮    │ (x=50, y=100)
 *       │   │         │ width=100
 *       │   └─────────┘ height=40
 *       │
 *       ▼ Y 轴（向下为正）
 * 
 * 【为什么需要这个类？】
 * 虽然 MNUtil 提供了基础的 genFrame 和 setFrame 方法，但本类提供了更多便利的操作方法：
 * - MNUtil.genFrame(): 只能创建新的 frame 对象
 * - MNUtil.setFrame(): 必须一次性设置所有属性
 * - 本类的方法：可以单独修改某个属性，更加灵活
 * 
 * 【主要功能分类】
 * 1. 创建 Frame：gen() - 创建新的 frame 对象
 * 2. 位置操作：setX(), setY(), setLoc() - 设置元素位置
 * 3. 大小操作：setWidth(), setHeight(), setSize() - 设置元素大小
 * 4. 相对移动：moveX(), moveY() - 相对当前位置移动
 * 5. 智能设置：set() - 只修改指定的属性
 * 6. 比较工具：sameFrame() - 判断两个 frame 是否相同
 * 
 * 【常见使用场景】
 * ```javascript
 * // 场景1：创建新按钮并设置位置
 * let button = UIButton.new()
 * let frame = pluginDemoFrame.gen(10, 20, 100, 50)
 * button.frame = frame
 * 
 * // 场景2：调整已存在按钮的位置
 * pluginDemoFrame.setLoc(button, 100, 200)  // 移动到 (100, 200)
 * 
 * // 场景3：响应式调整大小
 * let screenWidth = UIScreen.mainScreen.bounds.width
 * pluginDemoFrame.setWidth(button, screenWidth - 20)  // 宽度适应屏幕
 * 
 * // 场景4：动画效果 - 按钮向右滑动
 * for (let i = 0; i < 10; i++) {
 *   pluginDemoFrame.moveX(button, 5)  // 每次向右移动 5 像素
 *   await MNUtil.delay(0.1)  // 延迟 0.1 秒
 * }
 * 
 * // 场景5：只想改变部分属性
 * // 只改变 x 坐标和宽度，y 和高度保持不变
 * pluginDemoFrame.set(button, 50, undefined, 200, undefined)
 * ```
 */
class pluginDemoFrame{
  /**
   * 🏗️ 创建一个新的 frame 对象
   * 
   * 这个方法用于创建一个新的位置和大小信息对象，通常用于：
   * - 创建新的界面元素时设置初始位置和大小
   * - 需要一个 frame 对象作为参数传递时
   * 
   * @param {number} x - 水平位置（左边缘到父视图左边缘的距离）
   * @param {number} y - 垂直位置（上边缘到父视图上边缘的距离）
   * @param {number} width - 宽度（元素的水平尺寸）
   * @param {number} height - 高度（元素的垂直尺寸）
   * @returns {CGRect} 返回一个 frame 对象 {x, y, width, height}
   * 
   * @example
   * // 创建一个位于 (10, 20)，大小为 100x50 的 frame
   * let frame = pluginDemoFrame.gen(10, 20, 100, 50)
   * // frame = {x: 10, y: 20, width: 100, height: 50}
   * 
   * // 应用到按钮上
   * let button = UIButton.new()
   * button.frame = frame
   */
  static gen(x,y,width,height){
    return MNUtil.genFrame(x, y, width, height)
  }
  /**
   * 🎛️ 智能设置 frame 的任意属性（最灵活的方法）
   * 
   * 这是最强大的设置方法，允许你只修改需要的属性，其他属性保持不变。
   * 传入 undefined 的参数会被忽略，保持原值。
   * 
   * 【特点】
   * - 性能优化：只有当 frame 真正改变时才会更新视图
   * - 灵活性高：可以只修改部分属性
   * - 智能处理：会检查 view 对象上的临时属性（view.x, view.y 等）
   * 
   * @param {UIView} view - 要修改的视图对象
   * @param {number|undefined} x - 新的 x 坐标（传 undefined 保持原值）
   * @param {number|undefined} y - 新的 y 坐标（传 undefined 保持原值）
   * @param {number|undefined} width - 新的宽度（传 undefined 保持原值）
   * @param {number|undefined} height - 新的高度（传 undefined 保持原值）
   * 
   * @example
   * // 只修改 x 坐标
   * pluginDemoFrame.set(button, 100, undefined, undefined, undefined)
   * 
   * // 只修改位置，不改变大小
   * pluginDemoFrame.set(button, 50, 80, undefined, undefined)
   * 
   * // 只修改大小，不改变位置
   * pluginDemoFrame.set(button, undefined, undefined, 200, 60)
   * 
   * // 修改所有属性
   * pluginDemoFrame.set(button, 10, 20, 100, 50)
   */
  static set(view,x,y,width,height){
    let oldFrame = view.frame
    let frame = view.frame
    if (x !== undefined) {
      frame.x = x
    }else if (view.x !== undefined) {
      frame.x = view.x
    }
    if (y !== undefined) {
      frame.y = y
    }else if (view.y !== undefined) {
      frame.y = view.y
    }
    if (width !== undefined) {
      frame.width = width
    }else if (view.width !== undefined) {
      frame.width = view.width
    }
    if (height !== undefined) {
      frame.height = height
    }else if (view.height !== undefined) {
      frame.height = view.height
    }
    if (!this.sameFrame(oldFrame,frame)) {
      view.frame = frame
    }
  }
  /**
   * 🔍 比较两个 frame 是否完全相同
   * 
   * 用于判断两个 frame 的所有属性（x, y, width, height）是否都相等。
   * 主要用于性能优化，避免不必要的视图更新。
   * 
   * @param {CGRect} frame1 - 第一个 frame 对象
   * @param {CGRect} frame2 - 第二个 frame 对象
   * @returns {boolean} 如果所有属性都相同返回 true，否则返回 false
   * 
   * @example
   * let frame1 = {x: 10, y: 20, width: 100, height: 50}
   * let frame2 = {x: 10, y: 20, width: 100, height: 50}
   * let frame3 = {x: 10, y: 20, width: 100, height: 60}
   * 
   * pluginDemoFrame.sameFrame(frame1, frame2)  // true - 完全相同
   * pluginDemoFrame.sameFrame(frame1, frame3)  // false - height 不同
   */
  static sameFrame(frame1,frame2){
    if (frame1.x === frame2.x && frame1.y === frame2.y && frame1.width === frame2.width && frame1.height === frame2.height) {
      return true
    }
    return false
  }
  /**
   * ↔️ 设置元素的水平位置（只修改 x 坐标）
   * 
   * 保持元素的 y 坐标、宽度和高度不变，只改变水平位置。
   * 适用于水平对齐、水平移动等场景。
   * 
   * @param {UIView} view - 要修改的视图对象
   * @param {number} x - 新的 x 坐标值
   * 
   * @example
   * // 将按钮移动到屏幕左边缘
   * pluginDemoFrame.setX(button, 0)
   * 
   * // 将按钮移动到距离左边 20 像素的位置
   * pluginDemoFrame.setX(button, 20)
   * 
   * // 居中对齐示例
   * let screenWidth = UIScreen.mainScreen.bounds.width
   * let buttonWidth = button.frame.width
   * pluginDemoFrame.setX(button, (screenWidth - buttonWidth) / 2)
   */
  static setX(view,x){
    let frame = view.frame
    frame.x = x
    view.frame = frame
  }
  /**
   * ↕️ 设置元素的垂直位置（只修改 y 坐标）
   * 
   * 保持元素的 x 坐标、宽度和高度不变，只改变垂直位置。
   * 适用于垂直对齐、上下移动等场景。
   * 
   * @param {UIView} view - 要修改的视图对象
   * @param {number} y - 新的 y 坐标值
   * 
   * @example
   * // 将按钮移动到屏幕顶部
   * pluginDemoFrame.setY(button, 0)
   * 
   * // 将按钮移动到距离顶部 50 像素的位置
   * pluginDemoFrame.setY(button, 50)
   * 
   * // 垂直居中示例
   * let screenHeight = UIScreen.mainScreen.bounds.height
   * let buttonHeight = button.frame.height
   * pluginDemoFrame.setY(button, (screenHeight - buttonHeight) / 2)
   */
  static setY(view,y){
    let frame = view.frame
    frame.y = y
    view.frame = frame
  }
  /**
   * 📍 设置元素的位置（同时设置 x 和 y）
   * 
   * 一次性设置元素的位置，保持大小不变。
   * 注意：如果 view 对象上有临时的 width/height 属性，会优先使用这些值。
   * 
   * @param {UIView} view - 要修改的视图对象
   * @param {number} x - 新的 x 坐标
   * @param {number} y - 新的 y 坐标
   * 
   * @example
   * // 移动按钮到指定位置
   * pluginDemoFrame.setLoc(button, 100, 200)
   * 
   * // 移动到屏幕左上角
   * pluginDemoFrame.setLoc(button, 0, 0)
   * 
   * // 根据其他元素定位
   * let label = getLabel()
   * // 将按钮放在标签下方 10 像素处，左对齐
   * pluginDemoFrame.setLoc(button, label.frame.x, label.frame.y + label.frame.height + 10)
   */
  static setLoc(view,x,y){
    let frame = view.frame
    frame.x = x
    frame.y = y
    // 特殊处理：如果 view 对象上临时存储了宽高值，使用这些值
    // 这种情况通常出现在动画或临时调整时
    if (view.width) {
      frame.width = view.width
    }
    if (view.height) {
      frame.height = view.height
    }
    view.frame = frame
  }
  /**
   * 📐 设置元素的大小（同时设置宽度和高度）
   * 
   * 保持元素位置不变，只改变大小。
   * 适用于调整按钮大小、适配不同屏幕等场景。
   * 
   * @param {UIView} view - 要修改的视图对象
   * @param {number} width - 新的宽度
   * @param {number} height - 新的高度
   * 
   * @example
   * // 设置按钮为标准大小
   * pluginDemoFrame.setSize(button, 100, 44)  // iOS 标准按钮高度是 44
   * 
   * // 设置为正方形
   * pluginDemoFrame.setSize(imageView, 80, 80)
   * 
   * // 根据内容动态调整
   * let textWidth = calculateTextWidth(button.title)
   * pluginDemoFrame.setSize(button, textWidth + 20, 44)  // 加 20 像素边距
   */
  static setSize(view,width,height){
    let frame = view.frame
    frame.width = width
    frame.height = height
    view.frame = frame
  }
  /**
   * ↔️ 设置元素的宽度（只修改宽度）
   * 
   * 保持位置和高度不变，只改变宽度。
   * 常用于响应式布局、文本框宽度调整等。
   * 
   * @param {UIView} view - 要修改的视图对象
   * @param {number} width - 新的宽度值
   * 
   * @example
   * // 设置固定宽度
   * pluginDemoFrame.setWidth(button, 120)
   * 
   * // 适配屏幕宽度（留出边距）
   * let screenWidth = UIScreen.mainScreen.bounds.width
   * pluginDemoFrame.setWidth(textField, screenWidth - 40)  // 左右各留 20 像素
   * 
   * // 根据父视图调整
   * let parentWidth = button.superview.frame.width
   * pluginDemoFrame.setWidth(button, parentWidth * 0.8)  // 占父视图 80% 宽度
   */
  static setWidth(view,width){
    let frame = view.frame
    frame.width = width
    view.frame = frame
  }
  /**
   * ↕️ 设置元素的高度（只修改高度）
   * 
   * 保持位置和宽度不变，只改变高度。
   * 常用于展开/收起动画、内容自适应等。
   * 
   * @param {UIView} view - 要修改的视图对象
   * @param {number} height - 新的高度值
   * 
   * @example
   * // 设置标准高度
   * pluginDemoFrame.setHeight(button, 44)  // iOS 标准按钮高度
   * 
   * // 展开/收起动画
   * let isExpanded = false
   * function toggleExpand() {
   *   isExpanded = !isExpanded
   *   pluginDemoFrame.setHeight(contentView, isExpanded ? 200 : 50)
   * }
   * 
   * // 根据内容自适应高度
   * let contentHeight = calculateContentHeight()
   * pluginDemoFrame.setHeight(scrollView, Math.min(contentHeight, 300))  // 最大 300
   */
  static setHeight(view,height){
    let frame = view.frame
    frame.height = height
    view.frame = frame
  }
  /**
   * ➡️ 水平移动元素（相对于当前位置）
   * 
   * 基于元素当前位置进行水平移动，正值向右，负值向左。
   * 适用于滑动动画、手势拖动等场景。
   * 
   * @param {UIView} view - 要移动的视图对象
   * @param {number} xDiff - 水平移动距离（正值向右，负值向左）
   * 
   * @example
   * // 向右移动 20 像素
   * pluginDemoFrame.moveX(button, 20)
   * 
   * // 向左移动 30 像素
   * pluginDemoFrame.moveX(button, -30)
   * 
   * // 简单的滑动动画
   * async function slideRight() {
   *   for (let i = 0; i < 10; i++) {
   *     pluginDemoFrame.moveX(button, 5)  // 每次移动 5 像素
   *     await MNUtil.delay(0.05)  // 延迟 50 毫秒
   *   }
   * }
   * 
   * // 响应手势拖动
   * function onPanGesture(gesture) {
   *   let translation = gesture.translationInView(view)
   *   pluginDemoFrame.moveX(dragView, translation.x)
   *   gesture.setTranslationInView({x: 0, y: 0}, view)  // 重置手势位移
   * }
   */
  static moveX(view,xDiff){
    let frame = view.frame
    frame.x = frame.x+xDiff
    view.frame = frame
  }
  /**
   * ⬇️ 垂直移动元素（相对于当前位置）
   * 
   * 基于元素当前位置进行垂直移动，正值向下，负值向上。
   * 适用于下拉刷新、滚动效果等场景。
   * 
   * @param {UIView} view - 要移动的视图对象
   * @param {number} yDiff - 垂直移动距离（正值向下，负值向上）
   * 
   * @example
   * // 向下移动 30 像素
   * pluginDemoFrame.moveY(button, 30)
   * 
   * // 向上移动 50 像素
   * pluginDemoFrame.moveY(button, -50)
   * 
   * // 弹跳动画效果
   * async function bounce() {
   *   // 向上弹起
   *   for (let i = 0; i < 10; i++) {
   *     pluginDemoFrame.moveY(button, -3)
   *     await MNUtil.delay(0.02)
   *   }
   *   // 落下
   *   for (let i = 0; i < 10; i++) {
   *     pluginDemoFrame.moveY(button, 3)
   *     await MNUtil.delay(0.02)
   *   }
   * }
   * 
   * // 下拉效果
   * function onPullDown(distance) {
   *   if (distance > 0 && distance < 100) {
   *     pluginDemoFrame.moveY(refreshView, distance * 0.5)  // 阻尼效果
   *   }
   * }
   */
  static moveY(view,yDiff){
    let frame = view.frame
    frame.y = frame.y+yDiff
    view.frame = frame
  }
}


/**
 * 🔍 获取对象的所有属性（包括原型链上的）
 * 
 * 【为什么这是一个独立函数，而不是类的静态方法？】
 * 
 * 一、独立函数 vs 类静态方法
 * 
 * 📦 类静态方法                    🌐 独立函数
 * pluginDemoUtils.someMethod()      getAllProperties(obj)
 * 属于某个类                        不属于任何类
 * 有命名空间                        全局可访问
 * 相关功能的组织                    独立的工具函数
 * 
 * 二、什么时候用独立函数？
 * 
 * 1. 🔧 通用工具函数
 *    - 不属于任何特定的业务逻辑
 *    - 可能被多个不同的类使用
 * 
 * 2. 🎯 辅助/调试函数
 *    - 主要用于开发和调试
 *    - 不是主要业务逻辑的一部分
 * 
 * 3. 🐍 JavaScript 传统风格
 *    - 在 ES6 类出现之前，JS 都是用函数
 *    - 简单的工具函数没必要强行放入类中
 * 
 * 三、这个函数的作用
 * 
 * 获取一个对象的所有属性，包括：
 * - 自身属性
 * - 继承的属性（原型链上的）
 * 
 * 主要用于调试和探索未知对象的结构。
 * 
 * 四、实际使用场景
 * 
 * // 探索 iOS 原生对象的属性
 * let button = UIButton.new()
 * let allProps = getAllProperties(button)
 * console.log(allProps)  // ["frame", "backgroundColor", "title", ...]
 * 
 * // 调试时查看 MarginNote 提供的 API
 * let note = MNNote.getFocusNote()
 * let noteProps = getAllProperties(note)
 * // 可以看到所有可用的属性和方法
 * 
 * 五、为什么不放在 pluginDemoUtils 中？
 * 
 * 1. 这不是插件的核心业务逻辑
 * 2. 主要用于开发时的调试
 * 3. 可能在任何地方使用，不仅限于 pluginDemoUtils
 * 
 * 💡 总结：
 * - 独立函数 = 全局工具/辅助函数
 * - 适合简单、通用、不属于特定类的功能
 * - 在这里主要用于调试和探索对象结构
 * 
 * @param {Object} obj - 要获取属性的对象
 * @returns {string[]} 返回包含所有属性名的数组
 */
function getAllProperties(obj) {
  var props = [];
  var proto = obj;
  
  // 沿着原型链向上遍历
  while (proto) {
    // 获取当前对象的所有属性名
    props = props.concat(Object.getOwnPropertyNames(proto));
    // 移动到原型链的下一层
    proto = Object.getPrototypeOf(proto);
  }
  
  return props;
}


/**
 * 🛠️ 插件核心工具类 - 提供各种实用功能
 * 
 * 【为什么全部使用静态方法？】
 * 
 * 一、静态方法 vs 实例方法的核心区别
 * 
 * 1. 🔴 实例方法：需要先创建对象
 * ```javascript
 * class Dog {
 *   constructor(name) {
 *     this.name = name;  // 每只狗都有自己的名字
 *   }
 *   bark() {
 *     console.log(`${this.name} 汪汪叫`);
 *   }
 * }
 * 
 * let myDog = new Dog("小白");  // 先创建一只狗
 * myDog.bark();  // "小白 汪汪叫"
 * ```
 * 
 * 2. 🟢 静态方法：直接通过类名调用
 * ```javascript
 * class Calculator {
 *   static add(a, b) {
 *     return a + b;
 *   }
 * }
 * 
 * let result = Calculator.add(5, 3);  // 8 - 不需要 new
 * ```
 * 
 * 二、为什么 pluginDemoUtils 全是静态方法？
 * 
 * 这个类是一个【工具箱】，不是一个“东西”：
 * - 它不需要保存状态（没有实例属性）
 * - 它只是提供一组相关的功能
 * - 就像数学函数一样，输入参数，返回结果
 * 
 * 三、通俗理解：静态 = 工具，实例 = 对象
 * 
 * 🔧 工具箱（静态）          🚗 汽车（实例）
 * 工具箱.锤子(钉子)        我的车 = new 汽车("特斯拉", "白色")
 * 工具箱.螺丝刀(螺丝)      我的车.加油(50)
 *                           我的车.开车()
 * 
 * 四、在 MN Toolbar 项目中的应用
 * 
 * ✅ 好的设计 - 工具类用静态方法
 * pluginDemoUtils.smartCopy()      // 直接使用
 * pluginDemoUtils.getTextOCR()     // 不需要 new
 * pluginDemoConfig.save()          // 全局只有一份配置
 * 
 * 五、什么时候用静态，什么时候用实例？
 * 
 * 用静态方法当：
 * - 不需要保存状态
 * - 工具函数（如数学计算、格式化）
 * - 单例模式（全局只需要一个）
 * 
 * 用实例方法当：
 * - 需要保存状态（如用户信息）
 * - 每个对象有自己的数据
 * - 需要创建多个相似对象
 * 
 * 🎯 总结：在 MN Toolbar 项目中使用静态方法是因为：
 * 1. 工具性质：这些类都是工具集合，不是具体对象
 * 2. 无状态：不需要保存每个实例的数据
 * 3. 使用方便：直接调用，不需要 new
 * 4. 性能更好：不需要创建对象，节省内存
 * 
 * 就像你不需要“制造一把锤子”才能敲钉子，你只需要“使用锤子这个工具”就行了！
 */
class pluginDemoUtils {
  // 注意：这个类不需要 constructor，因为所有方法都是静态的
  // 我们永远不会使用 new pluginDemoUtils()，而是直接使用 pluginDemoUtils.methodName()
  
  /**
   * 📦 【静态变量（静态属性）的理解】
   * 
   * 一、什么是静态变量？
   * 
   * 静态变量就是属于“类”本身的变量，而不是属于某个具体对象的。
   * 
   * 🏢 通俗理解：公司的公告板
   * ```javascript
   * class 公司 {
   *   static 公告板 = "今天放假";        // 静态变量 - 整个公司共享
   *   constructor(name) {
   *     this.name = name;               // 实例变量 - 每个员工有自己的名字
   *   }
   * }
   * 
   * // 静态变量：所有人看到的都是同一个公告板
   * console.log(公司.公告板);  // "今天放假"
   * 公司.公告板 = "明天加班";    // 修改后所有人都看到新内容
   * 
   * // 实例变量：每个员工有自己的名字
   * let 员工1 = new 公司("张三");
   * let 员工2 = new 公司("李四");
   * console.log(员工1.name);  // "张三"
   * console.log(员工2.name);  // "李四"
   * ```
   * 
   * 二、静态变量 vs 实例变量
   * 
   * 🟢 静态变量（共享的）        🔴 实例变量（私有的）
   * 属于类                       属于对象
   * 只有一份                     每个对象一份
   * 类名.变量名 访问               对象.变量名 访问
   * 所有对象共享                 每个对象独立
   * 
   * 三、在 pluginDemoUtils 中的应用
   * 
   * 这些静态变量就像是插件的“全局记忆”：
   * - previousNoteId: 记住上一个操作的笔记 ID
   * - errorLog[]: 收集所有错误日志
   * - currentNoteId: 当前正在处理的笔记
   * - isSubscribe: 用户是否订阅（全局状态）
   * 
   * 这些信息需要在整个插件运行期间保持，所以用静态变量。
   * 
   * 四、为什么要用静态变量？
   * 
   * 1. 🌐 全局状态管理
   * pluginDemoUtils.isSubscribe = true;  // 在任何地方都能访问
   * 
   * 2. 📇 数据共享
   * pluginDemoUtils.errorLog.push(error);  // 所有错误都收集到一个地方
   * 
   * 3. 🛡️ 保持单例
   * pluginDemoUtils.mainPath  // 全局只有一个主路径
   * 
   * 五、实际例子
   * 
   * // 错误日志收集器
   * pluginDemoUtils.errorLog = [];  // 初始化为空数组
   * 
   * // 在任何地方添加错误
   * pluginDemoUtils.errorLog.push({
   *   time: Date.now(),
   *   error: "Something went wrong",
   *   location: "smartCopy"
   * });
   * 
   * // 在任何地方查看所有错误
   * console.log("总共有 " + pluginDemoUtils.errorLog.length + " 个错误");
   * 
   * 💡 总结：
   * - 静态变量 = 类的共享数据
   * - 适合存储全局状态、配置、缓存
   * - 在 MN Toolbar 中用于管理插件的全局信息
   */
  
  /**@type {string} */
  static previousNoteId        // 🔄 记录上一个操作的笔记 ID
  static errorLog = []         // 📦 错误日志收集器（数组）
  static version               // 🏷️ 插件版本号
  static currentNoteId         // 📌 当前正在处理的笔记 ID
  static currentSelection      // 🔖 当前选中的内容
  static isSubscribe = false   // 💳 用户是否订阅（默认 false）
  static mainPath              // 📁 插件主路径
  /**
   * @type {MNNote[]}
   * @static
   */
  static sourceToRemove = []
  static commentToRemove = {}
  /**
   * @type {UITextView}
   * @static
   */
  static textView
  
  /**
   * 📃 实际使用例子：错误日志系统
   * 
   * // 在插件启动时初始化
   * pluginDemoUtils.init = function(mainPath) {
   *   this.errorLog = [this.version];  // 初始化错误日志，第一项是版本号
   * }
   * 
   * // 在任何地方记录错误
   * try {
   *   // ... 一些可能出错的代码
   * } catch (error) {
   *   pluginDemoUtils.addErrorLog(error, "smartCopy");
   * }
   * 
   * // 查看所有错误
   * if (pluginDemoUtils.errorLog.length > 1) {
   *   MNUtil.copyJSON(pluginDemoUtils.errorLog);  // 复制所有错误到剪贴板
   * }
   * 
   * 🎯 这样做的好处：
   * 1. 不管在哪里发生错误，都能统一收集
   * 2. 方便调试和问题排查
   * 3. 可以一次性查看所有错误历史
   */
  
  static template = {
      "🔨 trigger button":{
        "action": "triggerButton",
        "target": "Custom 3"
      },
      "🔨 user confirm":{
        "action": "confirm",
        "title": "请点击确认",
        "onConfirm": {
          "action": "",
        },
        "onCancel": {
          "action": "",
        }
      },
      "🔨 user select":{
        "description": "要求用户选择一个选项",
        "action": "userSelect",
        "title": "test",
        "selectItems": [
          {
            "action": "showMessage",
            "content": "选中第一个",
            "selectTitle": "teste1"
          },
          {
            "action": "showMessage",
            "content": "选中第二个",
            "selectTitle": "teste2"
          }
        ]
      },
      "🔨 show message":{
        "action": "showMessage",
        "content": "Hello world"
      },
      "🔨 empty action":{
          "description": "空白动作",
          "action": "xxx",
      },
      "🔨 empty action with double click":{
        "description": "空白动作 带双击动作",
        "action": "xxx",
        "doubleClick": {
          "action": "xxx"
        }
      },
      "🔨 split note to mindmap":{
        "action": "markdown2Mindmap",
        "source": "currentNote"
      },
      "🔨 import mindmap from clipboard":{
        "action": "markdown2Mindmap",
        "source": "clipboard"
      },
      "🔨 import mindmap from markdown file":{
        "action": "markdown2Mindmap",
        "source": "file"
      },
      "🔨 empty action with finish action":{
        "description": "空白动作 带结束动作",
        "action": "xxx",
        "onFinish": {
          "action": "xxx"
        }
      },
      "🔨 setColor default":{},
      "🔨 with fillpattern: both":{
        "fillPattern":-1
      },
      "🔨 with fillpattern: fill":{
        "fillPattern":-1
      },
      "🔨 with fillpattern: border":{
        "fillPattern":-1
      },
      "🔨 with followAutoStyle":{
        "followAutoStyle":true
      },
      "🔨 insert snippet":{
        "description": "在输入框中插入文本片段",
        "action": "insertSnippet",
        "content": "test"
      },
      "🔨 insert snippet with menu":{
        "description": "弹出菜单,选择要在输入框中插入的文本片段",
        "action": "insertSnippet",
        "target": "menu",
        "menuItems": [
          {
            "menuTitle": "插入序号1️⃣",
            "content": "1️⃣ "
          },
          {
            "menuTitle": "插入序号2️⃣",
            "content": "2️⃣ "
          },
          {
            "menuTitle": "插入序号3️⃣",
            "content": "3️⃣ "
          },
          {
            "menuTitle": "插入序号4️⃣",
            "content": "4️⃣ "
          },
          {
            "menuTitle": "插入序号5️⃣",
            "content": "5️⃣ "
          },
          {
            "menuTitle": "插入序号6️⃣",
            "content": "6️⃣ "
          },
          {
            "menuTitle": "插入序号7️⃣",
            "content": "7️⃣ "
          },
          {
            "menuTitle": "插入序号8️⃣",
            "content": "8️⃣ "
          },
          {
            "menuTitle": "插入序号9️⃣",
            "content": "9️⃣ "
          }
        ]
      },
      "🔨 add note index":{
          "description": "多选状态下,给选中的卡片标题加序号",
          "action": "mergeText",
          "target": "title",
          "source": [
              "{{noteIndex}}、{{title}}"
          ]
      },
      "🔨 toggle mindmap":{
          "description": "开关脑图界面",
          "action": "command",
          "command": "ToggleMindMap"
      },
      "🔨 smart copy":{
        "description": "智能复制",
        "action": "copy",
        "target": "auto"
      },
      "🔨 copy with menu":{
          "description": "弹出菜单以选择需要复制的内容",
          "action": "copy",
          "target": "menu"
      },
      "🔨 copy markdown link":{
        "description": "复制markdown链接, 以卡片内容为标题,卡片url为链接",
        "action": "copy",
        "content": "[{{note.allText}}]({{{note.url}}})"
      },
      "🔨 toggle markdown":{
        "description": "切换摘录markdown渲染",
        "action": "toggleMarkdown"
      },
      "🔨 toggle textFirst":{
        "description": "切换摘录文本优先",
        "action": "toggleTextFirst"
      },
      "🔨 chatAI with menu":{
        "description": "弹出菜单选择需要执行的prompt",
        "action": "chatAI",
        "target": "menu"
      },
      "🔨 chatAI in prompt":{
        "description": "执行预定好的prompt",
        "action": "chatAI",
        "target": "翻译"
      },
      "🔨 chatAI in custom prompt":{
        "description": "指定user和system",
        "action": "chatAI",
        "user": "test",
        "system": "test"
      },
      "🔨 search with menu":{
        "description": "弹出菜单选择需要在Browser中搜索的内容",
        "action": "search",
        "target": "menu"
      },
      "🔨 search in Baidu":{
        "description": "弹出菜单选择搜索的目的",
        "action": "search",
        "target": "Baidu"
      },
      "🔨 OCR with menu":{
        "description": "弹出菜单选择OCR的目的",
        "action": "ocr",
        "target": "menu"
      },
      "🔨 OCR as chat mode reference":{
        "description": "OCR 结果作为聊天模式引用",
        "action": "ocr",
        "target": "chatModeReference"
      },
      "🔨 OCR to clipboard":{
        "description": "OCR 到剪贴板",
        "action": "ocr",
        "target": "clipboard"
      },
      "🔨 OCR with onFinish":{
        "description": "OCR结束后执行特定动作",
        "action": "ocr",
        "target": "excerpt",
        "onFinish":{
          "action": "xxx"
        }
      },
      "🔨 toggle full doc and tab bar":{
          "description": "开关文档全屏和标签页",
          "action": "command",
          "commands": [
              "ToggleFullDoc",
              "ToggleTabsBar"
          ]
      },
      "🔨 merge text of merged notes":{
          "description": "把合并的卡片的文本合并到主卡片的摘录中",
          "action": "mergeText",
          "target": "excerptText",
          "source": [
              "{{excerptTexts}},"
          ],
          "removeSource": true
      },
      "🔨 create & move to main mindmap":{
        "description": "创建摘录并移动到主脑图",
        "action": "noteHighlight",
        "mainMindMap": true
      },
      "🔨 create & move as child note":{
        "description": "创建摘录并移动到指定卡片下",
        "action": "noteHighlight",
        "parentNote": "marginnote4app://note/xxx"
      },
      "🔨 create & set branch style":{
        "description": "创建摘录并设置分支样式",
        "action": "noteHighlight",
        "onFinish": {
          "action": "command",
          "command": "SelBranchStyle3"
        }
        },
      "🔨 move note to main mindmap":{
        "description": "将当前笔记移动到主脑图中",
        "action": "moveNote",
        "target": "mainMindMap"
      },
    	"🔨 menu with actions":{
        "description": "弹出菜单以选择要执行的动作",
        "action": "menu",
        "menuItems": [
            "🔽 我是标题",
            {
                "action": "copy",
                "menuTitle": "123",
                "content": "test"
            },
            {
                "action": "toggleView",
                "targets": [
                    "mindmapToolbar",
                    "addonBar"
                ],
                "autoClose": false,
                "menuTitle": "toggle"
            }
        ]
      },
      "🔨 focus in float window":{
        "description": "在浮动窗口中显示当前笔记",
        "action": "showInFloatWindow",
        "target": "currentNoteInMindMap"
      },
      "🔨 focus note":{
        "description": "聚焦特定笔记",
        "action": "focus",
        "noteURL": "marginnote4app://note/C1919104-10E9-4C97-B967-1F2BE3FD0BDF",
        "target": "floatMindmap"
      }
    }
  /**
   * 🚀 初始化插件工具类
   * 
   * 这是插件启动时的第一个调用，负责初始化所有必要的全局变量和状态。
   * 
   * @param {string} mainPath - 插件的主路径（通常是 self.path）
   * 
   * 主要功能：
   * 1. 获取 MarginNote 应用实例
   * 2. 获取数据库实例
   * 3. 保存插件路径
   * 4. 获取版本信息
   * 5. 初始化错误日志
   * 
   * @example
   * // 在插件启动时调用
   * pluginDemoUtils.init(self.path)
   * 
   * // 之后就可以使用这些全局变量
   * console.log(pluginDemoUtils.version)  // 查看版本信息
   * console.log(pluginDemoUtils.mainPath) // 查看插件路径
   */
  static init(mainPath) {
    try {
      this.app = Application.sharedInstance()      // MarginNote 应用实例
      this.data = Database.sharedInstance()        // 数据库实例
      this.focusWindow = this.app.focusWindow      // 当前焦点窗口
      this.mainPath = mainPath                     // 插件路径
      this.version = this.appVersion()             // 获取版本信息
      this.errorLog = [this.version]               // 初始化错误日志，第一项是版本
    } catch (error) {
      this.addErrorLog(error, "init")
    }
  }
  /**
   * 🔄 刷新订阅状态
   * 
   * 检查并更新用户的订阅状态，将结果保存在静态变量 isSubscribe 中。
   * 
   * 使用场景：
   * - 插件启动时检查一次
   * - 用户购买后刷新状态
   * - 定期检查订阅是否过期
   * 
   * @example
   * // 刷新订阅状态
   * pluginDemoUtils.refreshSubscriptionStatus()
   * 
   * // 使用订阅状态
   * if (pluginDemoUtils.isSubscribe) {
   *   // 付费功能
   * } else {
   *   // 免费功能
   * }
   */
  static refreshSubscriptionStatus() {
    this.isSubscribe = this.checkSubscribe(false, false, true)
  }

  /**
   * 🏷️ 获取完整的版本信息
   * 
   * 收集并返回 MarginNote 应用版本、操作系统类型和插件版本信息。
   * 这些信息对于调试、兼容性处理和错误报告非常重要。
   * 
   * @returns {Object} 版本信息对象
   * @returns {string} info.version - MarginNote 版本："marginnote3" 或 "marginnote4"
   * @returns {string} info.type - 操作系统类型："iPadOS", "iPhoneOS" 或 "macOS"
   * @returns {string} info.pluginDemoVersion - 插件版本号（从 mnaddon.json 读取）
   * 
   * @example
   * let versionInfo = pluginDemoUtils.appVersion()
   * console.log(versionInfo)
   * // 输出：{
   * //   version: "marginnote4",
   * //   type: "macOS",
   * //   pluginDemoVersion: "1.0.0"
   * // }
   * 
   * // 根据版本做不同处理
   * if (versionInfo.version === "marginnote4") {
   *   // MN4 特有功能
   * }
   * 
   * // 根据平台做不同处理
   * if (versionInfo.type === "macOS") {
   *   // macOS 特有功能（如鼠标悬停）
   * }
   */
  static appVersion() {
    let info = {}
    let version = parseFloat(this.app.appVersion)
    
    // 判断 MarginNote 版本
    if (version >= 4) {
      info.version = "marginnote4"
    } else {
      info.version = "marginnote3"
    }
    
    // 判断操作系统类型
    switch (this.app.osType) {
      case 0:
        info.type = "iPadOS"
        break;
      case 1:
        info.type = "iPhoneOS"
        break;
      case 2:
        info.type = "macOS"
        break;
      default:
        break;
    }
    
    // 读取插件版本
    if (this.mainPath) {
      let pluginDemoVersion = MNUtil.readJSON(this.mainPath + "/mnaddon.json").version
      info.pluginDemoVersion = pluginDemoVersion
    }
    
    return info
  }
  /**
   * 🎨 获取笔记颜色列表
   * 
   * 返回 MarginNote 中所有可用的笔记颜色的十六进制值。
   * 这 16 种颜色对应 colorIndex 0-15。
   * 
   * @returns {string[]} 包含 16 个颜色十六进制值的数组
   * 
   * 颜色索引对应关系：
   * 0:  #ffffb4 - 淡黄色
   * 1:  #ccfdc4 - 淡绿色
   * 2:  #b4d1fb - 淡蓝色
   * 3:  #f3aebe - 粉色
   * 4:  #ffff54 - 黄色
   * 5:  #75fb4c - 绿色
   * 6:  #55bbf9 - 蓝色
   * 7:  #ea3323 - 红色
   * 8:  #ef8733 - 橙色
   * 9:  #377e47 - 深绿色
   * 10: #173dac - 深蓝色
   * 11: #be3223 - 深红色
   * 12: #ffffff - 白色
   * 13: #dadada - 浅灰色
   * 14: #b4b4b4 - 灰色
   * 15: #bd9fdc - 紫色
   * 
   * @example
   * // 获取所有颜色
   * let colors = pluginDemoUtils.getNoteColors()
   * 
   * // 获取淡黄色
   * let yellowColor = colors[0]  // "#ffffb4"
   * 
   * // 设置笔记颜色为红色
   * note.colorIndex = 7  // 红色对应索引 7
   */
  static getNoteColors() {
    return [
      "#ffffb4",  // 0:  淡黄色
      "#ccfdc4",  // 1:  淡绿色
      "#b4d1fb",  // 2:  淡蓝色
      "#f3aebe",  // 3:  粉色
      "#ffff54",  // 4:  黄色
      "#75fb4c",  // 5:  绿色
      "#55bbf9",  // 6:  蓝色
      "#ea3323",  // 7:  红色
      "#ef8733",  // 8:  橙色
      "#377e47",  // 9:  深绿色
      "#173dac",  // 10: 深蓝色
      "#be3223",  // 11: 深红色
      "#ffffff",  // 12: 白色
      "#dadada",  // 13: 浅灰色
      "#b4b4b4",  // 14: 灰色
      "#bd9fdc"   // 15: 紫色
    ]
  }
  /**
   * 📎 根据 ID 获取笔记对象
   * 
   * 通过笔记 ID 获取对应的 MNNote 对象。
   * 这是一个包装方法，内部调用 MNUtil.getNoteById。
   * 
   * @param {string} noteid - 笔记的唯一 ID
   * @returns {MNNote|null} 笔记对象，如果找不到则返回 null
   * 
   * @example
   * // 获取笔记
   * let note = pluginDemoUtils.getNoteById("12345678-1234-1234-1234-123456789012")
   * if (note) {
   *   console.log(note.noteTitle)
   *   note.colorIndex = 7  // 设置为红色
   * }
   */
  static getNoteById(noteid) {
    return MNUtil.getNoteById(noteid, false)  // 使用 MNUtil API，不显示错误提示
  }
  
  /**
   * 📓 根据 ID 获取笔记本对象
   * 
   * 通过笔记本 ID 获取对应的 MNNotebook 对象。
   * 
   * @param {string} notebookId - 笔记本的唯一 ID
   * @returns {MNNotebook|null} 笔记本对象，如果找不到则返回 null
   * 
   * @example
   * // 获取当前笔记本
   * let notebook = pluginDemoUtils.getNoteBookById(MNUtil.currentNotebookId)
   * if (notebook) {
   *   console.log(notebook.title)  // 笔记本标题
   *   console.log(notebook.notes.length)  // 笔记数量
   * }
   */
  static getNoteBookById(notebookId) {
    return MNUtil.getNoteBookById(notebookId)
  }
  /**
   * 🔗 根据笔记 ID 生成笔记的 URL
   * 
   * 将笔记 ID 转换为 MarginNote 的 URL 格式，可以用于跳转到指定笔记。
   * URL 格式根据 MarginNote 版本不同而不同：
   * - MN3: marginnote3app://note/xxxxx
   * - MN4: marginnote4app://note/xxxxx
   * 
   * @param {string} noteid - 笔记的唯一 ID
   * @returns {string} 笔记的 URL，可用于 openURL 跳转
   * 
   * @example
   * // 获取笔记 URL
   * let noteUrl = pluginDemoUtils.getUrlByNoteId("12345678-1234-1234-1234-123456789012")
   * // 返回: "marginnote4app://note/12345678-1234-1234-1234-123456789012"
   * 
   * // 跳转到该笔记
   * MNUtil.openURL(noteUrl)
   */
  static getUrlByNoteId(noteid) {
    let ver = this.appVersion()
    return ver.version + 'app://note/' + noteid
  }
  /**
   * 🆔 从 URL 中提取笔记 ID
   * 
   * 将 MarginNote 的笔记 URL 解析出笔记 ID。
   * 支持的 URL 格式：
   * - marginnote3app://note/xxxxx
   * - marginnote4app://note/xxxxx
   * 
   * @param {string} url - 笔记的 URL
   * @returns {string} 笔记 ID，如果 URL 格式不正确则返回 null
   * 
   * @example
   * // 从 URL 获取笔记 ID
   * let noteId = pluginDemoUtils.getNoteIdByURL("marginnote4app://note/12345678-1234-1234-1234-123456789012")
   * // 返回: "12345678-1234-1234-1234-123456789012"
   * 
   * // 使用场景：处理链接评论
   * if (comment.type === "LinkNote") {
   *   let linkedNoteId = pluginDemoUtils.getNoteIdByURL(comment.noteLinkURL)
   *   let linkedNote = pluginDemoUtils.getNoteById(linkedNoteId)
   * }
   */
  static getNoteIdByURL(url) {
    return MNUtil.getNoteIdByURL(url)
  }
  /**
   * 📋 获取剪贴板中的文本内容
   * 
   * 读取系统剪贴板中的纯文本内容。
   * 注意：这是一个包装方法，内部调用 MNUtil.clipboardText 属性。
   * 
   * @returns {string} 剪贴板中的文本，如果为空则返回空字符串
   * 
   * @example
   * // 获取剪贴板文本
   * let text = pluginDemoUtils.clipboardText()
   * if (text) {
   *   console.log("剪贴板内容：" + text)
   * }
   * 
   * // 常见用法：粘贴到笔记
   * let clipText = pluginDemoUtils.clipboardText()
   * if (clipText && focusNote) {
   *   focusNote.appendTextComment(clipText)
   * }
   */
  static clipboardText() {
    return MNUtil.clipboardText
  }
  /**
   * 🔀 合并连续的空白字符
   * 
   * 将字符串中连续的空格、制表符、换行符等空白字符合并为单个空格。
   * 这对于处理从 PDF 复制的文本特别有用，因为 PDF 文本常常包含多余的空白。
   * 
   * @param {string} str - 要处理的字符串
   * @returns {string} 处理后的字符串，连续空白被合并
   * 
   * @example
   * // 处理 PDF 复制的文本
   * let messyText = "这是   一段\n\n包含  很多\t\t空白的   文本"
   * let cleanText = pluginDemoUtils.mergeWhitespace(messyText)
   * // 返回: "这是 一段 包含 很多 空白的 文本"
   * 
   * // 处理摘录文本
   * let excerptText = focusNote.excerptText
   * let cleanExcerpt = pluginDemoUtils.mergeWhitespace(excerptText)
   * focusNote.excerptText = cleanExcerpt
   */
  static mergeWhitespace(str) {
    return MNUtil.mergeWhitespace(str)
  }
  /**
   * 🔄 执行文本替换操作
   * 
   * 根据描述对象（des）执行复杂的文本替换操作。
   * 支持单步替换和多步替换，可以针对不同范围的笔记进行操作。
   * 
   * @param {Object} des - 替换操作的描述对象
   * @param {string} [des.range="currentNotes"] - 操作范围
   * @param {Array} [des.steps] - 多步替换的步骤数组
   * @param {string} des.from - 要替换的文本（支持正则表达式）
   * @param {string} des.to - 替换为的文本
   * 
   * @example
   * // 单步替换
   * pluginDemoUtils.replaceAction({
   *   range: "currentNotes",
   *   from: "old text",
   *   to: "new text"
   * })
   * 
   * // 多步替换
   * pluginDemoUtils.replaceAction({
   *   range: "currentNotes",
   *   steps: [
   *     { from: "step1", to: "result1" },
   *     { from: "step2", to: "result2" }
   *   ]
   * })
   */
  static replaceAction(des) {
    try {

      let range = des.range ?? "currentNotes"
      let targetNotes = this.getNotesByRange(range)
      if ("steps" in des) {//如果有steps则表示是多步替换,优先执行
        let nSteps = des.steps.length
        MNUtil.undoGrouping(()=>{
          targetNotes.forEach(note=>{
            let content= this._replace_get_content_(note, des)
            for (let i = 0; i < nSteps; i++) {
              let step = des.steps[i]
              let ptt = this._replace_get_ptt_(step)
              content = content.replace(ptt, step.to)
            }
            this._replace_set_content_(note, des, content)
          })
        })
        return;
      }
      //如果没有steps则直接执行
      let ptt = this._replace_get_ptt_(des)
      MNUtil.undoGrouping(()=>{
        targetNotes.forEach(note=>{
          this.replace(note, ptt, des)
        })
      })
    } catch (error) {
      this.addErrorLog(error, "replace")
    }
  }
  /**
   * 🖼️ 检查 Markdown 是否只包含 MN 图片
   * 
   * 判断一段 Markdown 文本是否只包含 MarginNote 的内部图片链接，
   * 没有其他文本内容。MN 图片格式：![](marginnote4app://markdownimg/png/xxx)
   * 
   * @param {string} markdown - 要检查的 Markdown 文本
   * @returns {boolean} 如果只包含 MN 图片返回 true，否则返回 false
   * 
   * @example
   * // 纯图片
   * let md1 = "![](marginnote4app://markdownimg/png/abc123)"
   * pluginDemoUtils.isPureMNImages(md1)  // true
   * 
   * // 包含文字
   * let md2 = "文字 ![](marginnote4app://markdownimg/png/abc123)"
   * pluginDemoUtils.isPureMNImages(md2)  // false
   * 
   * // 使用场景：智能复制时判断是否复制图片
   * if (pluginDemoUtils.isPureMNImages(note.excerptText)) {
   *   // 复制图片而不是文本
   * }
   */
  static isPureMNImages(markdown) {
    try {
      // 匹配 MN 图片链接的正则表达式
      const MNImagePattern = /!\[.*?\]\((marginnote4app\:\/\/markdownimg\/png\/.*?)(\))/g;
      let res = markdown.match(MNImagePattern)
      if (res) {
        return markdown === res[0]
      } else {
        return false
      }
    } catch (error) {
      pluginDemoUtils.addErrorLog(error, "isPureMNImages")
      return false
    }
  }
  /**
   * 🔍 检查 Markdown 中是否包含 MN 图片
   * 
   * 判断一段 Markdown 文本中是否包含 MarginNote 的内部图片链接。
   * 与 isPureMNImages 不同，这个方法只要包含图片就返回 true，不管是否有其他内容。
   * 
   * @param {string} markdown - 要检查的 Markdown 文本
   * @returns {boolean} 如果包含 MN 图片返回 true，否则返回 false
   * 
   * @example
   * // 只有图片
   * let md1 = "![](marginnote4app://markdownimg/png/abc123)"
   * pluginDemoUtils.hasMNImages(md1)  // true
   * 
   * // 图片加文字
   * let md2 = "这是说明文字 ![](marginnote4app://markdownimg/png/abc123) 更多文字"
   * pluginDemoUtils.hasMNImages(md2)  // true
   * 
   * // 没有图片
   * let md3 = "只有文字没有图片"
   * pluginDemoUtils.hasMNImages(md3)  // false
   */
  static hasMNImages(markdown) {
    try {
      // 匹配 MN 图片链接的正则表达式
      const MNImagePattern = /!\[.*?\]\((marginnote4app\:\/\/markdownimg\/png\/.*?)(\))/g;
      let link = markdown.match(MNImagePattern)[0]
      // MNUtil.copyJSON({"a":link,"b":markdown})
      return markdown.match(MNImagePattern) ? true : false
    } catch (error) {
      pluginDemoUtils.addErrorLog(error, "hasMNImages")
      return false
    }
  }
  /**
   * 📷 从 Markdown 中提取 MN 图片数据
   * 
   * 解析 Markdown 文本中的 MarginNote 图片链接，并获取实际的图片数据。
   * MN 图片链接格式：![](marginnote4app://markdownimg/png/hash)
   * 
   * @param {string} markdown - 包含 MN 图片链接的 Markdown 文本
   * @returns {NSData|undefined} 图片的二进制数据，如果提取失败返回 undefined
   * 
   * @example
   * // 提取图片数据
   * let markdown = "![图片](marginnote4app://markdownimg/png/abc123def456)"
   * let imageData = pluginDemoUtils.getMNImagesFromMarkdown(markdown)
   * if (imageData) {
   *   // 复制图片到剪贴板
   *   MNUtil.copyImage(imageData)
   * }
   * 
   * // 处理摘录中的图片
   * if (pluginDemoUtils.hasMNImages(note.excerptText)) {
   *   let imgData = pluginDemoUtils.getMNImagesFromMarkdown(note.excerptText)
   *   // 导出或显示图片
   * }
   */
  static getMNImagesFromMarkdown(markdown) {
    try {
      const MNImagePattern = /!\[.*?\]\((marginnote4app\:\/\/markdownimg\/png\/.*?)(\))/g;
      let link = markdown.match(MNImagePattern)[0]
      // MNUtil.copyJSON(link)
      let hash = link.split("markdownimg/png/")[1].slice(0, -1)
      let imageData = MNUtil.getMediaByHash(hash)
      return imageData
    } catch (error) {
      pluginDemoUtils.addErrorLog(error, "replaceBase64ImagesWithR2")
      return undefined
    }
  }
  /**
   * ✏️ 在文本视图中插入代码片段
   * 
   * 在 UITextView 的当前光标位置或选中区域插入文本片段。
   * 支持 {{cursor}} 占位符来指定插入后的光标位置。
   * 
   * @param {string} text - 要插入的文本，可包含 {{cursor}} 占位符
   * @param {UITextView} textView - 目标文本视图对象
   * @returns {boolean} 插入是否成功
   * 
   * @example
   * // 简单插入
   * pluginDemoUtils.insertSnippetToTextView("Hello World", textView)
   * // 光标会在 "Hello World" 后面
   * 
   * // 使用光标占位符
   * pluginDemoUtils.insertSnippetToTextView("function {{cursor}}() {\n\n}", textView)
   * // 光标会定位在函数名位置
   * 
   * // 插入模板
   * let template = "/**\\n * {{cursor}}\\n *\\/\\nfunction name() {\\n\\n}"
   * pluginDemoUtils.insertSnippetToTextView(template, textView)
   * // 光标会定位在注释内容位置
   */
  static insertSnippetToTextView(text, textView) {
    try {
      let textLength = text.length
      let cursorLocation = textLength
      if (/{{cursor}}/.test(text)) {
        cursorLocation = text.indexOf("{{cursor}}")
        text = text.replace(/{{cursor}}/g, "")
        textLength = text.length
      }
      let selectedRange = textView.selectedRange
      let pre = textView.text.slice(0, selectedRange.location)
      let post = textView.text.slice(selectedRange.location + selectedRange.length)
      textView.text = pre + text + post
      textView.selectedRange = {location: selectedRange.location + cursorLocation, length: 0}
      return true
    } catch (error) {
      this.addErrorLog(error, "insertSnippetToTextView")
      return false
    }
  }
  /**
   * 智能复制功能
   * 根据当前的选择状态智能判断要复制的内容：
   * - 如果有文本/图片选择，复制选择内容
   * - 如果有焦点笔记，按优先级复制：摘录图片 > 摘录文本 > 首条评论 > 标题
   * 
   * 注意：这是业务逻辑方法，内部使用 MNUtil.copy() 和 MNUtil.copyImage()
   * @returns {boolean} 复制是否成功
   */
  static smartCopy(){
    MNUtil.showHUD("smartcopy")
    let selection = MNUtil.currentSelection
    if (selection.onSelection) {
      if (selection.isText) {
        MNUtil.copy(selection.text)
        MNUtil.showHUD('复制选中文本')
      }else{
        MNUtil.copyImage(selection.image)
        MNUtil.showHUD('复制框选图片')
      }
      return true
    }
    let focusNote = MNNote.getFocusNote()
    if (!focusNote) {
      MNUtil.showHUD("No note found")
      return false
    }
    if (focusNote.excerptPic && !focusNote.textFirst && focusNote.excerptPic.paint) {
      MNUtil.copyImage(focusNote.excerptPicData)
      MNUtil.showHUD('摘录图片已复制')
      return true
    }
    if ((focusNote.excerptText && focusNote.excerptText.trim())){
      let text = focusNote.excerptText
      if (focusNote.excerptTextMarkdown) {
        if (this.isPureMNImages(text.trim())) {
          let imageData = this.getMNImagesFromMarkdown(text)
          MNUtil.copyImage(imageData)
          MNUtil.showHUD('摘录图片已复制')
          return true
        }
      }

      MNUtil.copy(text)
      MNUtil.showHUD('摘录文字已复制')
      return true
    }
    if (focusNote.comments.length) {
      let firstComment = focusNote.comments[0]
      switch (firstComment.type) {
        case "TextNote":
          MNUtil.copy(firstComment.text)
          MNUtil.showHUD('首条评论已复制')
          return true
        case "PaintNote":
          let imageData = MNUtil.getMediaByHash(firstComment.paint)
          MNUtil.copyImage(imageData)
          MNUtil.showHUD('首条评论已复制')
          return true
        case "HtmlNote":
          MNUtil.copy(firstComment.text)
          MNUtil.showHUD('尝试复制该类型评论: '+firstComment.type)
          return true
        case "LinkNote":
          if (firstComment.q_hpic && !focusNote.textFirst && firstComment.q_hpic.paint) {
            MNUtil.copyImage(MNUtil.getMediaByHash(firstComment.q_hpic.paint))
            MNUtil.showHUD('图片已复制')
          }else{
            MNUtil.copy(firstComment.q_htext)
            MNUtil.showHUD('首条评论已复制')
          }
          return true
        default:
          MNUtil.showHUD('暂不支持的评论类型: '+firstComment.type)
          return false
      }
    }
    MNUtil.copy(focusNote.noteTitle)
    MNUtil.showHUD('标题已复制')
    return true
  }
  /**
   * 高级复制功能
   * 根据描述对象 des 的 target 属性决定复制什么内容
   * 支持的 target 包括：auto、selectionText、selectionImage、title、excerptText、noteId 等
   * 
   * 注意：这是业务逻辑方法，不是 MNUtil.copy() 的重复实现
   * @param {Object} des - 描述对象，包含 target、content 等属性
   * @returns {Promise<boolean>} 复制是否成功
   */
  static async copy(des) {
  try {
    let focusNote = MNNote.getFocusNote()
    let target = des.target
    let element = undefined
    if (target) {
      switch (target) {
        case "auto":
          pluginDemoUtils.smartCopy()
          return
        case "selectionText":
          if (MNUtil.currentSelection.onSelection) {
            element = MNUtil.selectionText
          }else{
            if (this.textView && this.textView.text) {
              let selectedRange = this.textView.selectedRange
              if (selectedRange.length) {
                element = this.textView.text.slice(selectedRange.location,selectedRange.location+selectedRange.length)
              }else{
                element = this.textView.text
              }
            }
          }
          break;
        case "selectionImage":
          MNUtil.copyImage(MNUtil.getDocImage(true))
          MNUtil.showHUD("框选图片已复制")
          return;
        case "title":
          if (focusNote) {
            element = focusNote.noteTitle
          }
          break;
        case "excerpt":
          if (focusNote) {
            if (focusNote.excerptPic && !focusNote.textFirst && focusNote.excerptPic.paint) {
              MNUtil.copyImage(MNUtil.getMediaByHash(focusNote.excerptPic.paint))
              MNUtil.showHUD("摘录图片已复制")
              return
            }
            let text = focusNote.excerptText.trim()
            if (focusNote.excerptTextMarkdown && this.isPureMNImages(text)) {
              let imageData = this.getMNImagesFromMarkdown(text)
              MNUtil.copyImage(imageData)
              MNUtil.showHUD('摘录图片已复制')
              return
            }
            if(text.trim()){
              element = text
            }else{
              element = ""
              MNUtil.showHUD("摘录文本为空")
            }
          }
          break
        case "excerptOCR":
          if (focusNote) {
            if (focusNote.excerptPic && !focusNote.textFirst && focusNote.excerptPic.paint) {
              // MNUtil.copyImage(MNUtil.getMediaByHash(focusNote.excerptPic.paint))
              // MNUtil.showHUD("图片已复制")

              element = await this.getTextOCR(MNUtil.getMediaByHash(focusNote.excerptPic.paint))
            }else{
              let text = focusNote.excerptText.trim()
              if (focusNote.excerptTextMarkdown && this.isPureMNImages(text)) {
                  let imageData = this.getMNImagesFromMarkdown(text)
                  element = await this.getTextOCR(imageData)
              }else{
                element = focusNote.excerptText
              }
            }
          }
          break
        case "notesText":
          if (focusNote) {
            element = focusNote.allNoteText()
          }
          break;
        case "comment":
          if (focusNote && focusNote.comments.length) {
            let index = 1
            if (des.index) {
              index = des.index
            }
            let comments = focusNote.comments
            let commentsLength = comments.length
            if (index > commentsLength) {
              index = commentsLength
            }
            element = comments[index-1].text
          }
          break;
        case "noteId":
          if (focusNote) {
            element = focusNote.noteId
          }
          break;
        case "noteURL":
          if (focusNote) {
            element = focusNote.noteURL
          }
          break;
        case "noteMarkdown":
          if (focusNote) {
            element = this.mergeWhitespace(await this.getMDFromNote(focusNote))
          }
          break;
        case "noteMarkdownOCR":
          if (focusNote) {
            element = this.mergeWhitespace(await this.getMDFromNote(focusNote,0,true))
          }
          break;
        case "noteWithDecendentsMarkdown":
          if (focusNote) {
            element = await this.getMDFromNote(focusNote)
            // MNUtil.copyJSON(focusNote.descendantNodes.treeIndex)
            let levels = focusNote.descendantNodes.treeIndex.map(ind=>ind.length)
            let descendantNotes = focusNote.descendantNodes.descendant
            let descendantsMarkdowns = await Promise.all(descendantNotes.map(async (note,index)=>{
                return this.getMDFromNote(note,levels[index])
              })
            )
            element = this.mergeWhitespace(element+"\n"+descendantsMarkdowns.join("\n\n"))
          }
          break;
        default:
          MNUtil.showHUD("Invalid target")
          break;
      }
    }
    let copyContent = des.content
    if (copyContent) {
      let replacedText = this.detectAndReplace(copyContent,element)
      MNUtil.copy(replacedText)
      MNUtil.showHUD("目标文本已复制")
      return true
    }else{//没有提供content参数则直接复制目标内容
      if (element) {
        MNUtil.copy(element)
        MNUtil.showHUD("目标文本已复制")
        return true
      }else{
        MNUtil.showHUD("无法获取目标文本")
        return false
      }
    }
    } catch (error) {
      pluginDemoUtils.addErrorLog(error, "copy")
      return false
    }
  }
  /**
   * 📋 复制对象的 JSON 字符串到剪贴板
   * 
   * 将任意 JavaScript 对象转换为格式化的 JSON 字符串并复制到剪贴板。
   * 主要用于调试和数据导出。
   * 
   * @param {*} object - 要复制的对象或数据
   * @returns {boolean} 复制是否成功
   * 
   * @example
   * // 复制笔记信息
   * let noteInfo = {
   *   id: focusNote.noteId,
   *   title: focusNote.noteTitle,
   *   color: focusNote.colorIndex
   * }
   * pluginDemoUtils.copyJSON(noteInfo)
   * 
   * // 复制错误日志
   * pluginDemoUtils.copyJSON(pluginDemoUtils.errorLog)
   * 
   * // 调试时查看对象结构
   * pluginDemoUtils.copyJSON(getAllProperties(someObject))
   */
  static copyJSON(object) {
    return MNUtil.copyJSON(object)
  }
  /**
   * 🖼️ 复制图片到剪贴板
   * 
   * 将图片的二进制数据复制到系统剪贴板。
   * 
   * @param {NSData} imageData - 图片的二进制数据
   * @returns {boolean} 复制是否成功
   * 
   * @example
   * // 复制摘录图片
   * if (focusNote.excerptPic) {
   *   let imageData = MNUtil.getMediaByHash(focusNote.excerptPic.paint)
   *   pluginDemoUtils.copyImage(imageData)
   * }
   * 
   * // 复制评论中的图片
   * if (comment.type === "PaintNote") {
   *   let imageData = MNUtil.getMediaByHash(comment.paint)
   *   pluginDemoUtils.copyImage(imageData)
   * }
   */
  static copyImage(imageData) {
    return MNUtil.copyImage(imageData)
  }
  /**
   * 📚 获取学习模式控制器
   * 
   * 返回 MarginNote 的学习模式控制器，用于访问和控制学习模式相关功能。
   * 学习模式是文档阅读和脑图编辑的组合界面。
   * 
   * @returns {Object} 学习模式控制器对象
   * 
   * @example
   * // 获取学习控制器
   * let studyCtrl = pluginDemoUtils.studyController()
   * 
   * // 使用控制器操作
   * if (studyCtrl) {
   *   // 获取当前笔记本
   *   let notebook = studyCtrl.notebookController.notebook
   * }
   */
  static studyController() {
    return MNUtil.studyController
  }
  /**
   * 📱 获取学习模式视图
   * 
   * 返回 MarginNote 的学习模式主视图，可用于添加自定义 UI 元素。
   * 
   * @returns {UIView} 学习模式的主视图对象
   * 
   * @example
   * // 获取学习视图
   * let studyView = pluginDemoUtils.studyView()
   * 
   * // 在学习视图上添加自定义按钮
   * if (studyView) {
   *   let button = UIButton.new()
   *   button.frame = {x: 10, y: 10, width: 100, height: 44}
   *   studyView.addSubview(button)
   * }
   */
  static studyView() {
    return MNUtil.studyView
  }
  /**
   * 📄 获取当前文档控制器
   * 
   * 返回当前打开的文档（PDF/ePub）的控制器，用于访问文档相关信息和操作。
   * 
   * @returns {Object} 文档控制器对象
   * 
   * @example
   * // 获取当前文档信息
   * let docCtrl = pluginDemoUtils.currentDocController()
   * if (docCtrl) {
   *   let docPath = docCtrl.document.pathFile
   *   let docName = MNUtil.getFileName(docPath)
   *   console.log("当前文档：" + docName)
   *   
   *   // 获取文档 MD5
   *   let docMd5 = docCtrl.document.docMd5
   * }
   */
  static currentDocController() {
    return MNUtil.currentDocController
  }
  /**
   * 🆔 获取当前笔记本 ID
   * 
   * 获取当前打开的笔记本的唯一标识符。
   * 注意：这是一个 getter 属性，不是方法。
   * 
   * @returns {string} 笔记本的唯一 ID
   * 
   * @example
   * // 获取当前笔记本 ID
   * let notebookId = pluginDemoUtils.currentNotebookId
   * console.log("当前笔记本 ID：" + notebookId)
   * 
   * // 用于操作当前笔记本
   * if (pluginDemoUtils.currentNotebookId) {
   *   let notebook = pluginDemoUtils.getNoteBookById(pluginDemoUtils.currentNotebookId)
   * }
   */
  static get currentNotebookId() {
    return MNUtil.currentNotebookId
  }
  /**
   * 📓 获取当前笔记本对象
   * 
   * 直接返回当前打开的笔记本对象，而不仅仅是 ID。
   * 这是一个便捷方法，内部调用 getNoteBookById。
   * 
   * @returns {MNNotebook|null} 笔记本对象，如果没有打开笔记本则返回 null
   * 
   * @example
   * // 获取当前笔记本
   * let notebook = pluginDemoUtils.currentNotebook()
   * if (notebook) {
   *   console.log("笔记本标题：" + notebook.title)
   *   console.log("笔记数量：" + notebook.notes.length)
   *   
   *   // 遍历所有笔记
   *   notebook.notes.forEach(note => {
   *     console.log(note.noteTitle)
   *   })
   * }
   */
  static currentNotebook() {
    return this.getNoteBookById(this.currentNotebookId)
  }
  /**
   * ♾️ 执行可撤销的操作组
   * 
   * 将一系列操作分组为一个可撤销的单元。用户按一次撤销就可以撤销整组操作。
   * 这对于批量修改非常重要，避免用户需要多次撤销。
   * 
   * @param {Function} f - 要执行的操作函数
   * @param {string} [notebookId=this.currentNotebookId] - 笔记本 ID（通常不需要传）
   * @returns {*} 返回函数 f 的执行结果
   * 
   * @example
   * // 批量修改笔记颜色
   * pluginDemoUtils.undoGrouping(() => {
   *   let notes = MNNote.getFocusNotes()
   *   notes.forEach(note => {
   *     note.colorIndex = 7  // 设置为红色
   *     note.noteTitle = "[重要] " + note.noteTitle
   *   })
   *   MNUtil.showHUD(`已修改 ${notes.length} 个笔记`)
   * })
   * // 用户只需撤销一次就能恢复所有修改
   * 
   * // 重要：在所有修改笔记的操作中都应该使用
   * pluginDemoUtils.undoGrouping(() => {
   *   // 你的修改操作
   * })
   */
  static undoGrouping(f, notebookId = this.currentNotebookId) {
    return MNUtil.undoGrouping(f)  // MNUtil 会自动处理 notebookId 和刷新
  }
  /**
   * ✅ 检查 MNUtils 是否已安装
   * 
   * 检查 MNUtils 插件是否已经安装并加载。MNUtils 是很多插件的依赖项。
   * 如果未安装，会提示用户安装。
   * 
   * @param {boolean} [alert=false] - 是否显示弹窗提示（true）还是 HUD 提示（false）
   * @param {number} [delay=0.01] - 检查前的延迟时间（秒）
   * @returns {Promise<boolean>} MNUtils 是否可用
   * 
   * @example
   * // 在插件启动时检查
   * async function sceneWillConnect() {
   *   if (!await pluginDemoUtils.checkMNUtil(true)) {
   *     // MNUtils 未安装，停止初始化
   *     return
   *   }
   *   // 继续初始化...
   * }
   * 
   * // 在使用 MNUtil API 前检查
   * if (await pluginDemoUtils.checkMNUtil()) {
   *   // 可以安全使用 MNUtil API
   *   MNUtil.showHUD("开始执行")
   * }
   */
  static async checkMNUtil(alert = false, delay = 0.01) {
    if (typeof MNUtil === 'undefined') {  // 如果 MNUtil 未被加载，则执行一次延时，然后再检测一次
      // 仅在 MNUtil 未被完全加载时执行 delay
      await pluginDemoUtils.delay(delay)
      if (typeof MNUtil === 'undefined') {
        if (alert) {
          pluginDemoUtils.confirm("MN Toolbar: Install 'MN Utils' first", "MN Toolbar: 请先安装'MN Utils'")
        } else {
          pluginDemoUtils.showHUD("MN Toolbar: Please install 'MN Utils' first!", 5)
        }
        return false
      }
    }
    return true
  }
  /**
   * 📦 克隆并合并笔记
   * 
   * 克隆一个指定的笔记，然后将其合并到当前笔记中。
   * 合并后，目标笔记的内容会成为当前笔记的一部分。
   * 
   * @param {MbBookNote|MNNote} currentNote - 要合并到的目标笔记
   * @param {string} targetNoteId - 要克隆的笔记 ID
   * 
   * @example
   * // 将另一个笔记合并到当前笔记
   * let focusNote = MNNote.getFocusNote()
   * if (focusNote) {
   *   // 将 ID 为 xxx 的笔记克隆并合并到当前笔记
   *   pluginDemoUtils.cloneAndMerge(focusNote, "12345678-1234-1234-1234-123456789012")
   *   MNUtil.showHUD("笔记已合并")
   * }
   * 
   * // 常见场景：合并相似内容的笔记
   * // 比如同一个概念在不同地方的摘录
   */
  static cloneAndMerge(currentNote, targetNoteId) {
    let cloneNote = MNNote.clone(targetNoteId)
    currentNote.merge(cloneNote.note)
  }
  /**
   * 🐶 克隆为子笔记
   * 
   * 克隆一个指定的笔记，并将其作为子笔记添加到当前笔记下。
   * 这样可以在不移动原笔记的情况下，创建笔记之间的关联。
   * 
   * @param {MbBookNote|MNNote} currentNote - 父笔记
   * @param {string} targetNoteId - 要克隆的笔记 ID
   * 
   * @example
   * // 将另一个笔记克隆为当前笔记的子笔记
   * let focusNote = MNNote.getFocusNote()
   * if (focusNote) {
   *   // 克隆并添加为子笔记
   *   pluginDemoUtils.cloneAsChildNote(focusNote, "12345678-1234-1234-1234-123456789012")
   *   MNUtil.showHUD("已添加子笔记")
   * }
   * 
   * // 常见场景：构建知识体系
   * // 将相关概念组织在主题笔记下
   */
  static cloneAsChildNote(currentNote, targetNoteId) {
    let cloneNote = MNNote.clone(targetNoteId)
    currentNote.addChild(cloneNote.note)
  }
  /**
   * 📢 发送系统通知
   * 
   * 通过 iOS/macOS 的通知中心发送自定义通知。
   * 可以用于插件间通信或触发系统事件。
   * 
   * @param {string} name - 通知名称
   * @param {Object} userInfo - 附带的信息对象
   * 
   * @example
   * // 发送简单通知
   * pluginDemoUtils.postNotification("MyPluginDidUpdate", {})
   * 
   * // 发送带数据的通知
   * pluginDemoUtils.postNotification("NoteColorChanged", {
   *   noteId: focusNote.noteId,
   *   oldColor: 0,
   *   newColor: 7
   * })
   * 
   * // 在其他地方监听通知
   * NSNotificationCenter.defaultCenter().addObserverSelectorNameObject(
   *   self,
   *   "onNoteColorChanged:",
   *   "NoteColorChanged",
   *   null
   * )
   */
  static postNotification(name, userInfo) {
    NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(name, this.focusWindow, userInfo)
  }
  /**
   * 🔄 在数组中移动元素位置
   * 
   * 将数组中的某个元素向上或向下移动一个位置。
   * 常用于调整列表顺序、排序等场景。
   * 
   * @param {string[]} arr - 要操作的数组
   * @param {string} element - 要移动的元素
   * @param {string} direction - 移动方向："up" 或 "down"
   * @returns {string[]} 移动后的新数组
   * 
   * @example
   * // 移动按钮顺序
   * let buttons = ["Button1", "Button2", "Button3", "Button4"]
   * 
   * // 将 Button3 向上移动
   * let newOrder = pluginDemoUtils.moveElement(buttons, "Button3", "up")
   * // 结果: ["Button1", "Button3", "Button2", "Button4"]
   * 
   * // 将 Button1 向下移动
   * let newOrder2 = pluginDemoUtils.moveElement(buttons, "Button1", "down")
   * // 结果: ["Button2", "Button1", "Button3", "Button4"]
   * 
   * // 保存新顺序
   * toolbarConfig.buttonOrder = newOrder
   * toolbarConfig.save()
   */
  static moveElement(arr, element, direction) {
    return MNUtil.moveElement(arr, element, direction)
  }
  /**
   * 📦 获取模板变量信息
   * 
   * 解析文本中的模板变量（如 {{clipboardText}}），并返回对应的实际值。
   * 这个方法不依赖特定的笔记，只处理全局变量。
   * 
   * @param {string} text - 包含模板变量的文本
   * @returns {Object} 变量名和对应值的对象
   * 
   * 支持的变量：
   * - {{clipboardText}} - 剪贴板文本
   * - {{selectionText}} - 当前选中的文本
   * - {{currentDocName}} - 当前文档名称
   * - {{currentDocAttach}} - 当前文档的附件内容
   * 
   * @example
   * // 解析模板文本
   * let template = "文档：{{currentDocName}}\n选中：{{selectionText}}"
   * let vars = pluginDemoUtils.getVarInfo(template)
   * // 返回: {
   * //   currentDocName: "MyBook.pdf",
   * //   selectionText: "选中的文字"
   * // }
   * 
   * // 替换模板变量
   * Object.keys(vars).forEach(key => {
   *   template = template.replace(`{{${key}}}`, vars[key])
   * })
   */
  static getVarInfo(text) {  // 对通用的部分先写好对应的值
    let config = {}
    let hasClipboardText = text.includes("{{clipboardText}}")
    let hasSelectionText = text.includes("{{selectionText}}")
    let hasCurrentDocName = text.includes("{{currentDocName}}")
    let hasCurrentDocAttach = text.includes("{{currentDocAttach}}")
    if (hasClipboardText) {
      config.clipboardText = MNUtil.clipboardText
    }
    if (hasSelectionText) {
      config.selectionText = MNUtil.selectionText
    }
    if (hasCurrentDocName) {
      config.currentDocName = MNUtil.getFileName(MNUtil.currentDocController.document.pathFile)
    }
    if (hasCurrentDocAttach && editorUtils) {
      config.currentDocAttach = editorUtils.getAttachContentByMD5(MNUtil.currentDocmd5)
    }
    return config
  }
  /**
   * 📄 获取包含笔记信息的模板变量
   * 
   * 解析文本中的模板变量，并结合特定笔记的信息返回实际值。
   * 与 getVarInfo 不同，这个方法可以处理笔记相关的变量。
   * 
   * @param {string} text - 包含模板变量的文本
   * @param {MbBookNote|MNNote} note - 相关的笔记对象
   * @returns {Object} 变量名和对应值的对象
   * 
   * 支持的变量：
   * - {{title}} - 笔记标题
   * - {{noteId}} - 笔记 ID
   * - {{clipboardText}} - 剪贴板文本
   * - {{selectionText}} - 当前选中的文本
   * - {{currentDocName}} - 当前文档名称
   * 
   * @example
   * // 使用笔记信息生成文本
   * let template = "## {{title}}\nID: {{noteId}}\n来源：{{currentDocName}}"
   * let focusNote = MNNote.getFocusNote()
   * let vars = pluginDemoUtils.getVarInfoWithNote(template, focusNote)
   * 
   * // 替换所有变量
   * Object.keys(vars).forEach(key => {
   *   template = template.replace(`{{${key}}}`, vars[key])
   * })
   * 
   * // 结果: "## 我的笔记\nID: 12345678-...\n来源：MyBook.pdf"
   */
  static getVarInfoWithNote(text, note) {
    let config = {}
    let hasClipboardText = text.includes("{{clipboardText}}")
    let hasSelectionText = text.includes("{{selectionText}}")
    let hasDocName = text.includes("{{currentDocName}}")
    let hasTitle = text.includes("{{title}}")
    let hasNoteId = text.includes("{{noteId}}")
    if (hasTitle) {
      config.title = note.noteTitle
    }
    if (hasClipboardText) {
      config.clipboardText = MNUtil.clipboardText
    }
    if (hasSelectionText) {
      config.selectionText = MNUtil.selectionText
    }
    if (hasDocName) {
      config.currentDocName = MNUtil.getFileName(MNUtil.currentDocController.document.pathFile)
    }
    if (hasNoteId) {
      config.noteId = note.noteId
    }
    return config
  }
  /**
   * 🔒 转义正则表达式特殊字符
   * 
   * 将字符串中的正则表达式特殊字符进行转义，
   * 使其可以在正则表达式中作为普通字符使用。
   * 
   * @param {string} str - 要转义的字符串
   * @returns {string} 转义后的字符串
   * 
   * @example
   * // 转义包含特殊字符的字符串
   * let userInput = "1+1=2"
   * let escaped = pluginDemoUtils.escapeStringRegexp(userInput)
   * // 返回: "1\\+1=2"
   * 
   * // 安全地使用用户输入创建正则
   * let regex = new RegExp(escaped)  // 不会把 + 当作量词
   * 
   * // 在替换操作中使用
   * let searchText = "[note]"
   * let safePattern = pluginDemoUtils.escapeStringRegexp(searchText)
   * text.replace(new RegExp(safePattern, "g"), "[card]")
   */
  static escapeStringRegexp(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d")
  }
  /**
   * 🔄 将字符串转换为正则表达式
   * 
   * 智能地将字符串转换为正则表达式对象。
   * - 如果字符串以 / 开头，解析为正则表达式字面量
   * - 否则作为普通字符串，转义后创建正则
   * 
   * @param {string} str - 要转换的字符串
   * @returns {RegExp} 正则表达式对象
   * @throws {string} 如果正则格式不正确抛出空字符串
   * 
   * @example
   * // 普通字符串
   * let reg1 = pluginDemoUtils.string2Reg("hello")
   * // 等价于: new RegExp("hello")
   * 
   * // 正则字面量
   * let reg2 = pluginDemoUtils.string2Reg("/\\d+/g")
   * // 等价于: /\d+/g
   * 
   * // 使用案例
   * let pattern = pluginDemoUtils.string2Reg("/note.*title/i")
   * if (pattern.test(text)) {
   *   console.log("匹配成功")
   * }
   */
  static string2Reg(str) {
    str = str.trim()
    if (!str.startsWith("/")) return new RegExp(pluginDemoUtils.escapeStringRegexp(str))
    const regParts = str.match(/^\/(.+?)\/([gimsuy]*)$/)
    if (!regParts) throw ""
    return new RegExp(regParts[1], regParts[2])
  }
  /**
   * 📦 根据范围获取笔记数组
   * 
   * 根据指定的范围参数，返回不同的笔记集合。
   * 这对于批量操作非常有用。
   * 
   * @param {string} [range] - 笔记范围
   * @returns {MNNote[]} 笔记数组
   * 
   * 支持的范围：
   * - undefined - 返回当前焦点笔记（单个）
   * - "currentNotes" - 返回所有选中的笔记
   * - "childNotes" - 返回选中笔记的所有子笔记
   * - "descendants" - 返回选中笔记的所有后代笔记
   * 
   * @example
   * // 获取当前选中的所有笔记
   * let notes = pluginDemoUtils.getNotesByRange("currentNotes")
   * console.log(`选中了 ${notes.length} 个笔记`)
   * 
   * // 处理所有子笔记
   * let childNotes = pluginDemoUtils.getNotesByRange("childNotes")
   * childNotes.forEach(note => {
   *   note.colorIndex = 5  // 统一设置颜色
   * })
   * 
   * // 处理整个分支
   * let allDescendants = pluginDemoUtils.getNotesByRange("descendants")
   * console.log(`包含 ${allDescendants.length} 个后代笔记`)
   */
  static getNotesByRange(range) {
    if (range === undefined) {
      return [MNNote.getFocusNote()]
    }
    switch (range) {
      case "currentNotes":
        return MNNote.getFocusNotes()
      case "childNotes":
        let childNotes = []
        MNNote.getFocusNotes().map(note => {
          childNotes = childNotes.concat(note.childNotes)
        })
        return childNotes
      case "descendants":
        let descendantNotes = []
        MNNote.getFocusNotes().map(note => {
          descendantNotes = descendantNotes.concat(note.descendantNodes.descendant)
        })
        return descendantNotes
      default:
        return [MNNote.getFocusNote()]
    }
  }
  /**
   * 🧹 清空笔记内容
   * 
   * 根据指定的目标和类型，清空笔记的某部分内容。
   * 可以清空标题、摘录文本或删除特定类型的评论。
   * 
   * @param {MNNote|MbBookNote} note - 要清空内容的笔记
   * @param {{target:string,type:string,index:number}} des - 描述对象
   * @param {string} [des.target="title"] - 目标内容："title", "excerptText", "comments"
   * @param {string} [des.type] - 评论类型："TextNote", "LinkNote", "PaintNote", "HtmlNote"
   * @param {number} [des.index] - 评论索引（未使用）
   * 
   * @example
   * // 清空标题
   * pluginDemoUtils.clearNoteContent(note, { target: "title" })
   * 
   * // 清空摘录文本
   * pluginDemoUtils.clearNoteContent(note, { target: "excerptText" })
   * 
   * // 删除所有文本评论
   * pluginDemoUtils.clearNoteContent(note, { 
   *   target: "comments", 
   *   type: "TextNote" 
   * })
   * 
   * // 删除所有评论
   * pluginDemoUtils.clearNoteContent(note, { target: "comments" })
   */
  static clearNoteContent(note, des) {
    let target = des.target ?? "title"
    switch (target) {
      case "title":
        note.noteTitle = ""
        break;
      case "excerptText":
        note.excerptText = ""
        break;
      case "comments":  // todo: 改进 type 检测,支持未添加 index 参数时移除所有评论
        // this.removeComment(des)
        let commentLength = note.comments.length
        let comment
        for (let i = commentLength - 1; i >= 0; i--) {
          if ("type" in des) {
            switch (des.type) {
              case "TextNote":
                comment = note.comments[i]
                if (comment.type === "TextNote") {
                  note.removeCommentByIndex(i)
                }
                break;
              case "LinkNote":
                comment = note.comments[i]
                if (comment.type === "LinkNote") {
                  note.removeCommentByIndex(i)
                }
                break;
              case "PaintNote":
                comment = note.comments[i]
                if (comment.type === "PaintNote") {
                  note.removeCommentByIndex(i)
                }
                break;
              case "HtmlNote":
                comment = note.comments[i]
                if (comment.type === "HtmlNote") {
                  note.removeCommentByIndex(i)
                }
                break;
              default:
                break;
            }
          } else {
            note.removeCommentByIndex(i)
          }
          break;
        }
        break;
      default:
        break;
    }
  }
  /**
   * 🖊️ 设置笔记内容
   * 
   * 根据指定的目标，设置笔记的某部分内容。
   * 支持模板变量替换，会自动调用 detectAndReplace 处理内容。
   * 
   * @param {MNNote|MbBookNote} note - 要设置内容的笔记
   * @param {string} content - 要设置的内容，可含模板变量
   * @param {{target:string}} des - 描述对象
   * @param {string} [des.target="title"] - 目标："title", "excerpt", "excerptText", "newComment"
   * 
   * @example
   * // 设置标题
   * pluginDemoUtils.setNoteContent(note, "新标题", { target: "title" })
   * 
   * // 设置摘录文本
   * pluginDemoUtils.setNoteContent(note, "新的摘录内容", { 
   *   target: "excerptText" 
   * })
   * 
   * // 添加新评论
   * pluginDemoUtils.setNoteContent(note, "这是一条评论", { 
   *   target: "newComment" 
   * })
   * 
   * // 使用模板变量
   * pluginDemoUtils.setNoteContent(note, "[摘自 {{currentDocName}}]", {
   *   target: "newComment"
   * })
   */
  static setNoteContent(note, content, des) {
    let target = des.target ?? "title"
    let replacedText = this.detectAndReplace(content, undefined, note)
    switch (target) {
      case "title":
        note.noteTitle = replacedText
        break;
      case "excerpt":
      case "excerptText":
        note.excerptText = replacedText
        break;
      case "newComment":
        note.appendTextComment(replacedText)
        break;
      default:
        MNUtil.showHUD("Invalid target: " + target)
        break;
    }
  }
  /**
   * 🧹 批量清空笔记内容
   * 
   * 根据指定的范围和目标，批量清空多个笔记的内容。
   * 所有操作会被分组为一个可撤销单元。
   * 
   * @param {Object} des - 描述对象
   * @param {string} [des.range="currentNotes"] - 笔记范围
   * @param {string} [des.target="title"] - 目标内容
   * @param {string} [des.type] - 评论类型（仅当 target 为 "comments" 时）
   * 
   * @example
   * // 清空所有选中笔记的标题
   * pluginDemoUtils.clearContent({
   *   range: "currentNotes",
   *   target: "title"
   * })
   * 
   * // 清空所有子笔记的摘录
   * pluginDemoUtils.clearContent({
   *   range: "childNotes",
   *   target: "excerptText"
   * })
   * 
   * // 删除所有后代笔记的文本评论
   * pluginDemoUtils.clearContent({
   *   range: "descendants",
   *   target: "comments",
   *   type: "TextNote"
   * })
   */
  static clearContent(des) {
    let range = des.range ?? "currentNotes"
    let targetNotes = this.getNotesByRange(range)
    MNUtil.undoGrouping(() => {
      targetNotes.forEach(note => {
        this.clearNoteContent(note, des)
      })
    })
  }
  /**
   * 📝 批量设置笔记内容
   * 
   * 根据指定的范围和目标，批量设置多个笔记的内容。
   * 这是 setNoteContent 的批量版本，所有操作会被分组为一个可撤销单元。
   * 
   * @param {Object} des - 描述对象
   * @param {string} [des.range="currentNotes"] - 笔记范围
   * @param {string} [des.content="content"] - 要设置的内容
   * @param {string} [des.target] - 目标："title", "excerpt", "newComment"
   * 
   * @example
   * // 为所有选中笔记添加前缀
   * pluginDemoUtils.setContent({
   *   range: "currentNotes",
   *   target: "title",
   *   content: "[重要] {{title}}"  // 使用模板变量
   * })
   * 
   * // 为所有子笔记添加评论
   * pluginDemoUtils.setContent({
   *   range: "childNotes",
   *   target: "newComment",
   *   content: "来自父笔记：{{parentNote.title}}"
   * })
   * 
   * // 统一设置摘录文本
   * pluginDemoUtils.setContent({
   *   range: "descendants",
   *   target: "excerptText",
   *   content: "请查看原文"
   * })
   */
  static setContent(des){
    try {
      let range = des.range ?? "currentNotes"
      let targetNotes = this.getNotesByRange(range)
      MNUtil.undoGrouping(()=>{
        targetNotes.forEach(note=>{
          let content = des.content ?? "content"
          this.setNoteContent(note, content,des)
        })
      })
    } catch (error) {
      pluginDemoUtils.addErrorLog(error, "setContent")
    }
  }
  /**
   * 🔄 替换单个笔记的内容
   * 
   * 使用正则表达式或字符串模式替换笔记的标题或摘录文本。
   * 这是内部方法，通常由其他批量替换方法调用。
   * 
   * @param {MNNote|MbBookNote} note - 要替换内容的笔记
   * @param {RegExp} ptt - 正则表达式模式
   * @param {Object} des - 描述对象
   * @param {string} des.target - 目标："title" 或 "excerpt"
   * @param {string} des.to - 替换后的文本
   * 
   * @example
   * // 替换标题中的文本
   * let pattern = /旧文本/g
   * pluginDemoUtils.replace(note, pattern, {
   *   target: "title",
   *   to: "新文本"
   * })
   * 
   * // 替换摘录中的空行
   * let emptyLinePattern = /\n\n+/g
   * pluginDemoUtils.replace(note, emptyLinePattern, {
   *   target: "excerpt",
   *   to: "\n"
   * })
   */
  static replace(note,ptt,des){
    let content
    switch (des.target) {
      case "title":
        content = note.noteTitle
        note.noteTitle = content.replace(ptt, des.to)
        break;
      case "excerpt":
        content = note.excerptText ?? ""
        note.excerptText = content.replace(ptt, des.to)
        break;
      default:
        break;
    }
  }
  /**
   * 🔧 【内部方法】获取替换模式
   * 
   * 根据描述对象生成正则表达式模式。
   * - 如果提供了 reg 参数，直接使用正则表达式
   * - 否则将 from 参数转义后创建正则表达式
   * 
   * @private
   * @param {Object} des - 描述对象
   * @param {string} [des.reg] - 正则表达式字符串
   * @param {string} [des.from] - 要替换的普通文本
   * @param {string} [des.mod="g"] - 正则修饰符
   * @returns {RegExp} 正则表达式对象
   * 
   * @example
   * // 使用正则表达式
   * let ptt1 = _replace_get_ptt_({ reg: "\\d+", mod: "gi" })
   * // 返回: /\d+/gi
   * 
   * // 使用普通文本
   * let ptt2 = _replace_get_ptt_({ from: "[note]" })
   * // 返回: /\[note\]/g （自动转义特殊字符）
   */
  static _replace_get_ptt_(des) {
    let mod= des.mod ?? "g"
    let ptt
    if ("reg" in des) {
      ptt = new RegExp(des.reg,mod)
    }else{
      ptt = new RegExp(this.escapeStringRegexp(des.from),mod)
    }
    return ptt
  }
  /**
   * 🔧 【内部方法】获取笔记内容
   * 
   * 根据目标类型获取笔记的相应内容。
   * 这是替换操作的辅助方法。
   * 
   * @private
   * @param {MNNote|MbBookNote} note - 笔记对象
   * @param {Object} des - 描述对象
   * @param {string} des.target - 目标："title" 或 "excerpt"
   * @returns {string} 对应的内容文本
   */
  static _replace_get_content_(note,des) {
    let content = ""
    switch (des.target) {
      case "title":
        content = note.noteTitle
        break;
      case "excerpt":
        content = note.excerptText ?? ""
        break;
      default:
        break;
    }
    return content
  }
  /**
   * 🔧 【内部方法】设置笔记内容
   * 
   * 根据目标类型设置笔记的相应内容。
   * 这是替换操作的辅助方法。
   * 
   * @private
   * @param {MNNote|MbBookNote} note - 笔记对象
   * @param {Object} des - 描述对象
   * @param {string} des.target - 目标："title" 或 "excerpt"
   * @param {string} content - 要设置的内容
   */
  static _replace_set_content_(note,des,content) {
    switch (des.target) {
      case "title":
        note.noteTitle = content
        break;
      case "excerpt":
        note.excerptText = content
        break;
      default:
        break;
    }
  }
  /**
   * ❌ 关闭弹出菜单
   * 
   * 用于程序化地关闭弹出菜单。支持立即关闭或延迟关闭。
   * 延迟关闭常用于给用户足够的时间看到反馈信息。
   * 
   * @param {PopupMenu} menu - 要关闭的菜单对象
   * @param {boolean} [delay=false] - 是否延迟 0.5 秒后关闭
   * @returns {void}
   * 
   * @example
   * // 立即关闭菜单
   * pluginDemoUtils.dismissPopupMenu(currentMenu)
   * 
   * // 延迟关闭（例如：显示成功提示后）
   * MNUtil.showHUD("✅ 操作成功")
   * pluginDemoUtils.dismissPopupMenu(currentMenu, true)
   * 
   * // 条件性关闭
   * if (operationSuccess && menu) {
   *   pluginDemoUtils.dismissPopupMenu(menu, true)
   * }
   */
  static dismissPopupMenu(menu,delay = false){
    if (!menu) {
      return
    }
    if (delay) {
      MNUtil.delay(0.5).then(()=>{
        if (!menu.stopHide) {
          menu.dismissAnimated(true)
        }
      })
      return
    }
    menu.dismissAnimated(true)
  }
  /**
   * 🎯 判断是否应该显示菜单
   * 
   * 根据描述对象判断是否应该显示菜单。
   * 这个方法用于处理按钮的不同行为模式。
   * 
   * @param {Object} des - 描述对象
   * @param {string} [des.target] - 目标行为
   * @returns {boolean} 是否显示菜单
   * 
   * 逻辑说明：
   * - 如果 des.target === "menu"，返回 true（显示菜单）
   * - 如果 des.target 是其他值，返回 false（执行动作）
   * - 如果没有提供 target 参数，默认返回 true（显示菜单）
   * 
   * @example
   * // 明确指定显示菜单
   * let des1 = { target: "menu", menuItems: [...] }
   * pluginDemoUtils.shouldShowMenu(des1)  // true
   * 
   * // 明确指定执行动作
   * let des2 = { target: "copy" }
   * pluginDemoUtils.shouldShowMenu(des2)  // false
   * 
   * // 默认行为（显示菜单）
   * let des3 = { menuItems: [...] }
   * pluginDemoUtils.shouldShowMenu(des3)  // true
   */
  static shouldShowMenu(des){
    if ( des && "target" in des) {
      //des里提供了target参数的时候，如果target为menu则显示menu
      if (des.target === "menu") {
        return true
      }
      return false
    }
    //des里不提供target参数的时候默认为menu
    return true
  }
  /**
   * 📋 智能粘贴功能
   * 
   * 根据目标将剪贴板内容粘贴到笔记的不同位置。
   * 支持替换和追加两种模式，以及 Markdown 格式。
   * 
   * @param {Object} des - 描述对象
   * @param {string} [des.target="default"] - 粘贴目标
   * @param {boolean} [des.hideMessage=false] - 是否隐藏提示信息
   * @param {boolean} [des.markdown=false] - 是否启用 Markdown 格式
   * 
   * 支持的目标：
   * - "default" - 使用系统默认粘贴（支持图片等）
   * - "title" - 替换标题
   * - "excerpt" - 替换摘录
   * - "appendTitle" - 追加到标题（用分号分隔）
   * - "appendExcerpt" - 追加到摘录（新行）
   * 
   * @example
   * // 默认粘贴（保留格式）
   * pluginDemoUtils.paste({ target: "default" })
   * 
   * // 替换标题
   * pluginDemoUtils.paste({ target: "title" })
   * 
   * // 追加到摘录（Markdown 格式）
   * pluginDemoUtils.paste({ 
   *   target: "appendExcerpt",
   *   markdown: true,
   *   hideMessage: true
   * })
   * 
   * // 追加到标题（用于多个关键词）
   * pluginDemoUtils.paste({ target: "appendTitle" })
   * // 结果：原标题;新内容
   */
  static paste(des){
    if (!des.hideMessage) {
      MNUtil.showHUD("paste")
    }
    let focusNote = MNNote.getFocusNote()
    let text = MNUtil.clipboardText
    let target = des.target ?? "default"
    switch (target) {
      case "default":
        focusNote.paste()
        break;
      case "title":
        MNUtil.undoGrouping(()=>{
          focusNote.noteTitle = text
        })
        break;
      case "excerpt":
        MNUtil.undoGrouping(()=>{
          focusNote.excerptText = text
          if (des.markdown) {
            focusNote.excerptTextMarkdown = true
          }
        })
        break;
      case "appendTitle":
        MNUtil.undoGrouping(()=>{
          focusNote.noteTitle = focusNote.noteTitle+";"+text
        })
        break;
      case "appendExcerpt":
        MNUtil.undoGrouping(()=>{
          focusNote.excerptText = focusNote.excerptText+"\n"+text
          if (des.markdown) {
            focusNote.excerptTextMarkdown = true
          }
        })
        break;
      default:
        break;
    }
  }
  /**
   * 🪟 在浮动窗口中显示笔记
   * 
   * 在 MarginNote 的浮动脑图窗口中打开指定的笔记。
   * 支持多种目标来源，方便快速导航和查看关联笔记。
   * 
   * @param {Object} des - 描述对象
   * @param {string} [des.noteURL] - 笔记的 URL
   * @param {string} [des.target] - 目标笔记类型
   * 
   * 支持的目标：
   * - "noteInClipboard" - 剪贴板中的笔记链接
   * - "currentNote" - 当前焦点笔记
   * - "currentChildMap" - 当前子脑图
   * - "parentNote" - 父笔记
   * - "currentNoteInMindMap" - 当前笔记在脑图中的位置
   * 
   * @example
   * // 打开剪贴板中的笔记
   * pluginDemoUtils.showInFloatWindow({ 
   *   target: "noteInClipboard" 
   * })
   * 
   * // 打开当前笔记的父笔记
   * pluginDemoUtils.showInFloatWindow({ 
   *   target: "parentNote" 
   * })
   * 
   * // 通过 URL 打开特定笔记
   * pluginDemoUtils.showInFloatWindow({ 
   *   noteURL: "marginnote4app://note/12345..." 
   * })
   * 
   * // 在脑图中定位当前笔记
   * pluginDemoUtils.showInFloatWindow({ 
   *   target: "currentNoteInMindMap" 
   * })
   */
  static showInFloatWindow(des){
    let targetNoteid
    if (des.noteURL) {
      targetNoteid = MNUtil.getNoteIdByURL(des.noteURL)
    }
    switch (des.target) {
      case "{{noteInClipboard}}":
      case "noteInClipboard":
        targetNoteid = MNNote.new(MNUtil.clipboardText).noteId
        break;
      case "{{currentNote}}":
      case "currentNote":
        targetNoteid = MNNote.getFocusNote().noteId
        break;
      case "{{currentChildMap}}":
      case "currentChildMap":
        if (MNUtil.mindmapView && MNUtil.mindmapView.mindmapNodes[0].note.childMindMap) {
          targetNoteid = MNUtil.mindmapView.mindmapNodes[0].note.childMindMap.noteId
        }else{
          targetNoteid = undefined
        }
        break;
      case "{{parentNote}}":
      case "parentNote":
        targetNoteid = MNNote.getFocusNote().parentNote.noteId
        break;
      case "{{currentNoteInMindMap}}":
      case "currentNoteInMindMap":
        let targetNote = MNNote.getFocusNote().realGroupNoteForTopicId()
        if (targetNote) {
          targetNote.focusInFloatMindMap()
        }else{
          MNUtil.showHUD("No Note found!")
        }
        return
      default:
        break;
    }
    if (targetNoteid) {
      MNNote.focusInFloatMindMap(targetNoteid)
    }else{
      MNUtil.showHUD("No Note found!")
    }
  }
  static async delay (seconds) {
    return MNUtil.delay(seconds)  // 使用 MNUtil API
  }
  /**
   * 🗺️ 获取当前子脑图
   * 
   * 获取当前脑图视图中根节点的子脑图（如果存在）。
   * 子脑图是 MarginNote 中用于组织层级结构的特殊笔记。
   * 
   * @returns {MNNote|undefined} 子脑图笔记对象，如果不存在返回 undefined
   * 
   * @example
   * // 检查是否有子脑图
   * let childMap = pluginDemoUtils.currentChildMap()
   * if (childMap) {
   *   console.log("子脑图标题：" + childMap.noteTitle)
   *   console.log("子笔记数量：" + childMap.childNotes.length)
   * } else {
   *   console.log("当前没有子脑图")
   * }
   * 
   * // 在子脑图中添加笔记
   * let childMap = pluginDemoUtils.currentChildMap()
   * if (childMap) {
   *   childMap.createChildNote({ title: "新笔记" })
   * }
   */
  static currentChildMap() {
    if (MNUtil.mindmapView && MNUtil.mindmapView.mindmapNodes[0].note?.childMindMap) {
      return MNNote.new(MNUtil.mindmapView.mindmapNodes[0].note.childMindMap.noteId)
    }else{
      return undefined
    }
  }
  /**
   * 📝 在当前子脑图中创建新笔记
   * 
   * 优先在当前子脑图中创建笔记，如果没有子脑图则创建独立笔记。
   * 这样可以保持笔记的层级组织结构。
   * 
   * @param {Object|string} config - 笔记配置对象或标题字符串
   * @param {string} [config.title] - 笔记标题
   * @param {number} [config.colorIndex] - 颜色索引
   * @returns {MNNote} 创建的笔记对象
   * 
   * @example
   * // 在子脑图中创建简单笔记
   * let note = pluginDemoUtils.newNoteInCurrentChildMap("新想法")
   * 
   * // 创建带配置的笔记
   * let note = pluginDemoUtils.newNoteInCurrentChildMap({
   *   title: "重要概念",
   *   colorIndex: 7  // 红色
   * })
   * 
   * // 条件创建
   * if (needsOrganization) {
   *   // 会自动判断是否有子脑图
   *   let note = pluginDemoUtils.newNoteInCurrentChildMap({
   *     title: "待整理内容"
   *   })
   *   note.appendTextComment("需要进一步研究")
   * }
   */
  static newNoteInCurrentChildMap(config){
    let childMap = this.currentChildMap()
    if (childMap) {
      let child = childMap.createChildNote(config)
      return child
    }else{
      let newNote = MNNote.new(config)
      return newNote
    }
  }
  /**
   * 🔢 替换笔记索引占位符
   * 
   * 将文本中的 {{noteIndex}} 占位符替换为对应的索引值。
   * 用于批量处理笔记时给每个笔记编号。
   * 
   * @param {string} text - 包含占位符的文本
   * @param {number} index - 索引位置（从 0 开始）
   * @param {Object} des - 描述对象
   * @param {string[]} [des.noteIndices] - 自定义索引数组
   * @returns {string} 替换后的文本
   * 
   * @example
   * // 默认数字索引
   * let text = "第 {{noteIndex}} 章"
   * pluginDemoUtils.replaceNoteIndex(text, 0, {})  // "第 1 章"
   * pluginDemoUtils.replaceNoteIndex(text, 5, {})  // "第 6 章"
   * 
   * // 自定义索引
   * let customText = "{{noteIndex}}. 内容"
   * pluginDemoUtils.replaceNoteIndex(customText, 2, {
   *   noteIndices: ["一", "二", "三", "四", "五"]
   * })  // "三. 内容"
   */
  static replaceNoteIndex(text,index,des){ 
    let noteIndices = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'] 
    if (des.noteIndices && des.noteIndices.length) {
      noteIndices = des.noteIndices
    }
    let tem = text.replace("{{noteIndex}}",noteIndices[index])
    return tem
  
  }
  /**
   * 🔢 替换多种索引占位符
   * 
   * 将文本中的多种索引占位符替换为对应的格式化索引。
   * 支持数字、圆圈数字、emoji 数字和字母索引。
   * 
   * @param {string} text - 包含占位符的文本
   * @param {number} index - 索引位置（从 0 开始）
   * @param {Object} des - 描述对象
   * @param {string[]} [des.customIndices] - 自定义索引数组（替换 {{index}}）
   * @returns {string} 替换后的文本
   * 
   * 支持的占位符：
   * - {{index}} - 普通数字（1, 2, 3...）
   * - {{circleIndex}} - 圆圈数字（①, ②, ③...）
   * - {{emojiIndex}} - Emoji 数字（1️⃣, 2️⃣, 3️⃣...）
   * - {{alphabetIndex}} - 字母索引（a, b, c...）
   * 
   * @example
   * // 使用不同格式的索引
   * let template = "{{circleIndex}} {{index}}. {{alphabetIndex}}"
   * pluginDemoUtils.replaceIndex(template, 0, {})
   * // 返回: "① 1. a"
   * 
   * // 批量生成列表
   * let items = ["苹果", "香蕉", "橙子"]
   * items.forEach((item, i) => {
   *   let text = pluginDemoUtils.replaceIndex(
   *     "{{emojiIndex}} {{index}}. " + item, 
   *     i, 
   *     {}
   *   )
   *   console.log(text)
   * })
   * // 输出:
   * // 1️⃣ 1. 苹果
   * // 2️⃣ 2. 香蕉
   * // 3️⃣ 3. 橙子
   */
  static replaceIndex(text,index,des){
    let circleIndices = ["①","②","③","④","⑤","⑥","⑦","⑧","⑨","⑩","⑪","⑫","⑬","⑭","⑮","⑯","⑰","⑱","⑲","⑳","㉑","㉒","㉓","㉔","㉕","㉖","㉗","㉘","㉙","㉚","㉛","㉜","㉝","㉞","㉟","㊱","㊲","㊳"]
    let emojiIndices = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"]
    let indices = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'] 
    let alphabetIndices = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    if (des.customIndices && des.customIndices.length) {
      indices = des.customIndices
    }
    let tem = text.replace("{{index}}",indices[index])
                  .replace("{{circleIndex}}",circleIndices[index])
                  .replace("{{emojiIndex}}",emojiIndices[index])
                  .replace("{{alphabetIndex}}",alphabetIndices[index])
    return tem
  }
  /**
   * 🔢 获取 Emoji 数字
   * 
   * 将数字转换为对应的 Emoji 表示形式。
   * 
   * @param {number} index - 数字（0-10）
   * @returns {string} Emoji 数字
   * 
   * @example
   * pluginDemoUtils.emojiNumber(0)   // "0️⃣"
   * pluginDemoUtils.emojiNumber(5)   // "5️⃣"
   * pluginDemoUtils.emojiNumber(10)  // "🔟"
   * 
   * // 在标题中使用
   * let title = pluginDemoUtils.emojiNumber(3) + " 第三章"
   * // "3️⃣ 第三章"
   */
  static emojiNumber(index){
    let emojiIndices = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"]
    return emojiIndices[index]
  }

  /**
   * 🔗 合并文本模板
   * 
   * 根据描述对象的配置，从笔记中提取内容并合并成文本。
   * 支持多种模板变量和格式化选项，用于批量生成格式化文本。
   * 
   * @param {MNNote} note - 笔记对象
   * @param {Object} des - 描述对象
   * @param {string[]} des.source - 模板数组，支持的变量：
   *   - {{title}} - 笔记标题
   *   - {{tags}} - 标签（会展开为多项）
   *   - {{textComments}} - 文本评论（会展开为多项）
   *   - {{htmlComments}} - HTML 评论（会展开为多项）
   *   - {{excerptText}} - 摘录文本
   *   - {{excerptTexts}} - 多个摘录文本（会展开为多项）
   * @param {string} [des.join=""] - 连接符
   * @param {string} [des.format] - 格式化模板，使用 {{element}} 占位符
   * @param {boolean} [des.trim=false] - 是否去除首尾空白
   * @param {boolean} [des.removeSource=false] - 是否标记源内容为待删除
   * @param {string[]} [des.replace] - 替换规则 [pattern, replacement]
   * @param {number} noteIndex - 笔记索引（用于编号）
   * @returns {string} 合并后的文本
   * 
   * @example
   * // 提取所有文本评论
   * let text = pluginDemoUtils.getMergedText(note, {
   *   source: ["{{textComments}}"],
   *   join: "\n",
   *   trim: true
   * }, 0)
   * 
   * // 格式化标签
   * let tags = pluginDemoUtils.getMergedText(note, {
   *   source: ["{{tags}}"],
   *   format: "#{{element}}",
   *   join: " "
   * }, 0)
   * // 结果: "#标签1 #标签2 #标签3"
   * 
   * // 复杂模板
   * let summary = pluginDemoUtils.getMergedText(note, {
   *   source: ["标题：{{title}}", "摘录：{{excerptText}}", "评论：{{textComments}}"],
   *   join: "\n",
   *   format: "- {{element}}"
   * }, 0)
   */
  static getMergedText(note,des,noteIndex){
  try {
    let textList = []
    des.source.map(text=>{
      if (text.includes("{{title}}") && des.removeSource) {
        if (note.noteId in pluginDemoUtils.commentToRemove) {
          pluginDemoUtils.commentToRemove[note.noteId].push(-1)
        }else{
          pluginDemoUtils.commentToRemove[note.noteId] = [-1]
        }
      }
      if (text.includes("{{tags}}")) {
        note.tags.map(tag=>{
          textList.push(text.replace('{{tags}}',tag))
        })
        return
      }
      if (text.includes("{{textComments}}")) {
        let elementIndex = 0
        note.comments.map((comment,index)=>{
          if (comment.type === "TextNote" && !/^marginnote\dapp:\/\/note\//.test(comment.text) && !comment.text.startsWith("#") ) {
            let tem = text.replace('{{textComments}}',(des.trim ? comment.text.trim(): comment.text))
            tem = this.replaceIndex(tem, elementIndex, des)
            tem = this.replaceNoteIndex(tem, noteIndex, des)
            textList.push(tem)
            elementIndex = elementIndex+1
            if (des.removeSource) {
              if (note.noteId in pluginDemoUtils.commentToRemove) {
                pluginDemoUtils.commentToRemove[note.noteId].push(index)
              }else{
                pluginDemoUtils.commentToRemove[note.noteId] = [index]
              }
            }
          }
        })
        return
      }
      if (text.includes("{{htmlComments}}")) {
        let elementIndex = 0
        note.comments.map((comment,index)=>{
          if (comment.type === "HtmlNote") {
            let tem = text.replace('{{htmlComments}}',(des.trim ? comment.text.trim(): comment.text))
            tem = this.replaceIndex(tem, index, des)
            tem = this.replaceNoteIndex(tem, noteIndex, des)
            textList.push(tem)
            elementIndex = elementIndex+1
            if (des.removeSource) {
              if (note.noteId in pluginDemoUtils.commentToRemove) {
                pluginDemoUtils.commentToRemove[note.noteId].push(index)
              }else{
                pluginDemoUtils.commentToRemove[note.noteId] = [index]
              }
            }
          }
        })
        return
      }
      if (text.includes("{{excerptText}}")) {
        let targetText = note.excerptText ?? ""
        if (des.trim) {
          targetText = targetText.trim()
        }
        let tem = text.replace('{{excerptText}}',targetText)
        tem = this.replaceNoteIndex(tem, noteIndex, des)
        textList.push(tem)
        return
      }
      if (text.includes("{{excerptTexts}}")) {
        let index = 0
        note.notes.map(n=>{
          if (n.excerptText) {
            let targetText = n.excerptText ?? ""
            if (des.trim) {
              targetText = targetText.trim()
            }
            let tem = text.replace('{{excerptTexts}}',targetText)
            tem = this.replaceIndex(tem, index, des)
            tem = this.replaceNoteIndex(tem, noteIndex, des)
            textList.push(tem)
            index = index+1
            if (des.removeSource && n.noteId !== note.noteId) {
              this.sourceToRemove.push(n)
            }
          }
        })
        return
      }
      let tem = this.detectAndReplaceWithNote(text,note)
      tem = this.replaceNoteIndex(tem, noteIndex, des)
      textList.push(tem) 
    })
    if (des.format) {
      textList = textList.map((text,index)=>{
        let tem = des.format.replace("{{element}}",text)
        tem = this.replaceIndex(tem, index, des)
        tem = this.replaceNoteIndex(tem, index, des)
        return tem
      })
    }
    let join = des.join ?? ""
    let mergedText = textList.join(join)
    if (des.replace) {
      let ptt = new RegExp(des.replace[0], "g")
      mergedText = mergedText.replace(ptt,des.replace[1])
    }
    return mergedText
  } catch (error) {
    return undefined
  }
  }
  /**
   * 🔄 检查并退化笔记相关的模板变量
   * 
   * 根据 OCR 模式和用户输入状态，将模板变量退化到合适的替代变量。
   * 主要用于 AI 聊天功能，根据不同情况智能选择最合适的变量。
   * 
   * @param {string} text - 包含模板变量的文本
   * @param {string} userInput - 用户输入的内容
   * @returns {string} 处理后的文本
   * 
   * 退化逻辑：
   * - OCR 启用时：优先使用 OCR 版本的变量
   * - 无用户输入时：{{userInput}} 退化为上下文
   * - 单个笔记时：{{cards}} 退化为 {{card}}
   * 
   * @example
   * // OCR 模式下
   * let text = "分析 {{cards}} 中的 {{userInput}}"
   * let result = pluginDemoUtils.checkVariableForNote(text, "")
   * // OCR 启用且无用户输入：
   * // "分析 {{cardsOCR}} 中的 {{textOCR}}"
   * 
   * // 单个笔记时
   * MNNote.getFocusNotes().length === 1
   * let result = pluginDemoUtils.checkVariableForNote("{{cards}}", "")
   * // 退化为: "{{cardOCR}}"
   */
  static checkVariableForNote(text,userInput){//提前写好要退化到的变量
    let OCR_Enabled = chatAIUtils.OCREnhancedMode
    let hasUserInput = text.includes("{{userInput}}")
    let hasCards = text.includes("{{cards}}")
    let hasCardsOCR = text.includes("{{cardsOCR}}")
    let replaceVarConfig = {}
    if (OCR_Enabled) {
      replaceVarConfig.context = `{{textOCR}}`
      replaceVarConfig.card = `{{cardOCR}}`
      replaceVarConfig.parentCard = `{{parentCardOCR}}`
      replaceVarConfig.cards = `{{cardsOCR}}`

      if (hasUserInput && !userInput) {
        replaceVarConfig.userInput = `{{textOCR}}`
      }
      if (hasCards || hasCardsOCR) {
        if (this.getFocusNotes().length === 1) {
          replaceVarConfig.cards = `{{cardOCR}}`
          replaceVarConfig.cardsOCR = `{{cardOCR}}`
        }
      }
    }else{
      if (hasUserInput && !userInput) {
        replaceVarConfig.userInput = `{{context}}`
      }
      if (hasCards || hasCardsOCR) {
        if (this.getFocusNotes().length === 1) {
          replaceVarConfig.cards = `{{card}}`
          replaceVarConfig.cardsOCR = `{{carsdOCR}}`
        }
      }
    }
    return this.replacVar(text, replaceVarConfig)
  }

  /**
   * 🔄 检查并退化文本相关的模板变量
   * 
   * 类似于 checkVariableForNote，但用于处理纯文本场景（非笔记）。
   * 主要用于处理选中文本或剪贴板文本的 AI 分析。
   * 
   * @param {string} text - 包含模板变量的文本
   * @param {string} userInput - 用户输入的内容
   * @returns {string} 处理后的文本
   * 
   * 退化逻辑：
   * - OCR 模式：所有卡片变量退化为 {{textOCR}}
   * - 非 OCR 模式：所有卡片变量退化为 {{context}}
   * - 文档相关变量保持不变
   * 
   * @example
   * // 处理选中文本
   * let template = "翻译 {{card}} 中的内容"
   * let result = pluginDemoUtils.checkVariableForText(template, "")
   * // OCR 模式: "翻译 {{textOCR}} 中的内容"
   * // 普通模式: "翻译 {{context}} 中的内容"
   */
  static checkVariableForText(text,userInput){//提前写好要退化到的变量
    let OCR_Enabled = chatAIUtils.OCREnhancedMode
    let hasUserInput = text.includes("{{userInput}}")
    let replaceVarConfig = {}
    if (OCR_Enabled) {
      replaceVarConfig.context = `{{textOCR}}`
      replaceVarConfig.card = `{{textOCR}}`
      replaceVarConfig.parentCard = `{{textOCR}}`
      replaceVarConfig.cards = `{{textOCR}}`
      if (hasUserInput && !userInput) {
        replaceVarConfig.userInput = `{{textOCR}}`
      }
    }else{
      replaceVarConfig.card = `{{context}}`
      replaceVarConfig.cards = `{{context}}`
      replaceVarConfig.parentCard = `{{context}}`
      if (hasUserInput && !userInput) {
        replaceVarConfig.userInput = `{{context}}`
      }
    }
    replaceVarConfig.cardOCR = `{{textOCR}}`
    replaceVarConfig.cardsOCR = `{{textOCR}}`
    replaceVarConfig.parentCardOCR = `{{textOCR}}`
    replaceVarConfig.noteDocInfo = `{{currentDocInfo}}`
    replaceVarConfig.noteDocAttach = `{{currentDocAttach}}`
    replaceVarConfig.noteDocName = `{{currentDocName}}`
    return this.replacVar(text, replaceVarConfig)
  }
  /**
   * 🔀 替换模板变量
   * 
   * 将文本中的模板变量替换为实际值。
   * 这是一个通用的变量替换引擎，支持 {{variable}} 格式。
   * 
   * @param {string} text - 包含模板变量的文本
   * @param {Object} varInfo - 变量名到值的映射对象
   * @returns {string} 替换后的文本
   * 
   * @example
   * // 简单替换
   * let template = "Hello {{name}}, today is {{date}}"
   * let vars = {
   *   name: "张三",
   *   date: "2024-01-01"
   * }
   * let result = pluginDemoUtils.replacVar(template, vars)
   * // "Hello 张三, today is 2024-01-01"
   * 
   * // 复杂模板
   * let noteTemplate = "{{title}}\n作者：{{author}}\n标签：{{tags}}"
   * let noteVars = {
   *   title: "JavaScript 高级编程",
   *   author: "Nicholas C. Zakas",
   *   tags: "#编程 #JavaScript"
   * }
   * let noteText = pluginDemoUtils.replacVar(noteTemplate, noteVars)
   */
  static replacVar(text,varInfo) {
    let vars = Object.keys(varInfo)
    let original = text
    for (let i = 0; i < vars.length; i++) {
      const variable = vars[i];
      const variableText = varInfo[variable]
      original = original.replace(`{{${variable}}}`,variableText)
    }
    // copy(original)
    return original
  }

  /**
   * 🔮 智能检测并替换模板变量
   * 
   * 自动检测文本中的模板变量并替换为实际值。
   * 这是一个高级的模板引擎，支持笔记信息、系统信息、日期等多种变量。
   * 
   * @param {string} text - 包含模板变量的文本
   * @param {*} [element=undefined] - 额外的元素数据
   * @param {MNNote} [note=MNNote.getFocusNote()] - 相关笔记
   * @returns {string} 处理后的文本
   * 
   * 支持的变量：
   * - {{note.*}} - 笔记相关信息（通过 getNoteObject 获取）
   * - {{date.*}} - 日期相关信息（通过 getDateObject 获取）
   * - {{clipboardText}} - 剪贴板文本
   * - {{selectionText}} - 当前选中的文本
   * - {{currentDocName}} - 当前文档名称
   * - {{currentDocAttach}} - 当前文档附件
   * - {{element}} - 传入的元素数据
   * - {{cursor}} - 光标位置占位符
   * - {{isSelectionImage}} - 是否选中图片
   * - {{isSelectionText}} - 是否选中文本
   * 
   * @example
   * // 使用笔记信息
   * let template = "标题：{{note.title}}\n日期：{{date.year}}-{{date.month}}-{{date.day}}"
   * let result = pluginDemoUtils.detectAndReplace(template)
   * // "标题：我的笔记\n日期：2024-01-01"
   * 
   * // 使用系统信息
   * let sysTemplate = "从 {{currentDocName}} 复制：{{selectionText}}"
   * let sysResult = pluginDemoUtils.detectAndReplace(sysTemplate)
   * 
   * // 传入额外元素
   * let customTemplate = "处理结果：{{element}}"
   * let customResult = pluginDemoUtils.detectAndReplace(customTemplate, "成功")
   * // "处理结果：成功"
   */
  static detectAndReplace(text,element=undefined,note = MNNote.getFocusNote()) {
    let noteConfig = this.getNoteObject(note,{},{parent:true,child:true,parentLevel:3})
    // MNUtil.copy(noteConfig)
    let config = {date:this.getDateObject()}
    if (noteConfig) {
      config.note = noteConfig
      config.cursor = "{{cursor}}"
    }
    if (element !== undefined) {
      config.element = element
    }
    let hasClipboardText = text.includes("{{clipboardText}}")
    let hasSelectionText = text.includes("{{selectionText}}")
    let hasCurrentDocName = text.includes("{{currentDocName}}")
    let hasCurrentDocAttach = text.includes("{{currentDocAttach}}")
    if (hasClipboardText) {
      config.clipboardText = MNUtil.clipboardText
    }
    if (hasSelectionText) {
      config.selectionText = MNUtil.selectionText
    }
    if (MNUtil.currentSelection.onSelection) {
      config.isSelectionImage = !MNUtil.currentSelection.isText
      config.isSelectionText = !!MNUtil.currentSelection.text
    }else{
      config.isSelectionImage = false
      config.isSelectionText = false
    }
    if (hasCurrentDocName) {
      config.currentDocName = MNUtil.getFileName(MNUtil.currentDocController.document.pathFile)
    }
    if (hasCurrentDocAttach && editorUtils) {
      config.currentDocAttach = editorUtils.getAttachContentByMD5(MNUtil.currentDocmd5)
    }
    let output = MNUtil.render(text, config)
    return output
  }
  /**
   * 🔮 使用笔记信息替换模板变量
   * 
   * detectAndReplace 的简化版本，专门用于处理笔记相关的变量替换。
   * 内部调用 getVarInfoWithNote 获取变量值。
   * 
   * @param {string} text - 包含模板变量的文本
   * @param {MbBookNote|MNNote} note - 相关笔记
   * @returns {string} 替换后的文本
   * 
   * @example
   * // 生成笔记摘要
   * let template = "《{{title}}》\nID: {{noteId}}\n来源：{{currentDocName}}"
   * let note = MNNote.getFocusNote()
   * let summary = pluginDemoUtils.detectAndReplaceWithNote(template, note)
   * 
   * // 批量处理
   * let notes = MNNote.getFocusNotes()
   * notes.forEach(note => {
   *   let text = pluginDemoUtils.detectAndReplaceWithNote(
   *     "- [ ] {{title}} ({{noteId}})",
   *     note
   *   )
   *   console.log(text)
   * })
   */
  static detectAndReplaceWithNote(text,note) {
    let config = this.getVarInfoWithNote(text,note)
    return this.replacVar(text,config)
  }
  /**
   * 📝 递归解析列表项及其子列表
   * 
   * 将 Markdown 解析器生成的列表项数组转换为树形结构。
   * 支持多级嵌套列表，保留列表类型信息。
   * 
   * @param {object[]} items - Markdown 列表项数组（来自 marked.js）
   * @returns {object[]} 树形结构的节点数组
   * 
   * 返回的节点结构：
   * - name: 列表项文本
   * - children: 子节点数组
   * - type: 节点类型
   * - hasList: 是否包含子列表
   * - listText: 子列表的原始文本
   * - listStart: 有序列表的起始编号
   * - listOrdered: 是否为有序列表
   * 
   * @example
   * // 输入的列表项
   * let items = [
   *   { text: "第一项", tokens: [...] },
   *   { text: "第二项", tokens: [
   *     { type: 'list', items: [...] }  // 包含子列表
   *   ]}
   * ]
   * 
   * // 解析结果
   * let nodes = pluginDemoUtils.processList(items)
   * // [
   * //   { name: "第一项", children: [], type: "list_item" },
   * //   { name: "第二项", children: [...], type: "list_item", hasList: true }
   * // ]
   */
  static processList(items) {
  return items.map(item => {
    // 提取当前列表项文本（忽略内部格式如粗体、斜体）
    const text = item.text.trim();
    const node = { name: text, children: [] ,type:item.type};

    // 检查列表项内部是否包含子列表（嵌套结构）
    const subLists = item.tokens.filter(t => t.type === 'list');
    if (subLists.length) {
      node.hasList = true
      node.listText = subLists[0].raw
      node.listStart = subLists[0].start
      node.listOrdered = subLists[0].ordered
      node.name = item.tokens[0].text
    }
    subLists.forEach(subList => {
      // 递归处理子列表的 items
      node.children.push(...this.processList(subList.items));
    });

    return node;
  });
}
  /**
   * 📄 获取无格式的纯文本
   * 
   * 递归提取 token 中的纯文本内容，忽略格式标记。
   * 用于从 Markdown 解析结果中获取干净的文本。
   * 
   * @param {Object} token - Markdown token 对象
   * @returns {string} 纯文本内容
   * 
   * @example
   * // 处理带格式的标题
   * let token = {
   *   type: "heading",
   *   tokens: [{
   *     type: "strong",
   *     text: "重要标题"
   *   }]
   * }
   * let text = pluginDemoUtils.getUnformattedText(token)
   * // "重要标题"（去除了加粗格式）
   */
  static getUnformattedText(token) {
    if ("tokens" in token && token.tokens.length === 1) {
      return this.getUnformattedText(token.tokens[0])
    }else{
      return token.text
    }
  }
  /**
   * 🌳 构建树结构（整合标题和列表解析）
   * 
   * 将 Markdown tokens 转换为层级树结构。
   * 根据标题级别和列表嵌套关系构建完整的文档大纲。
   * 
   * @param {object[]} tokens - Markdown 解析后的 token 数组
   * @returns {Object} 树形结构的根节点
   * 
   * 构建规则：
   * - 标题根据深度（h1-h6）形成层级
   * - 列表作为当前节点的子节点
   * - 段落文本附加到当前节点
   * - 忽略空格和分隔线
   * 
   * @example
   * // Markdown 文本
   * let markdown = `
   * # 第一章
   * ## 1.1 简介
   * - 要点一
   * - 要点二
   * ## 1.2 详情
   * # 第二章
   * `
   * 
   * // 构建树
   * let tokens = marked.lexer(markdown)
   * let tree = pluginDemoUtils.buildTree(tokens)
   * // tree = {
   * //   name: '中心主题',
   * //   children: [
   * //     { name: '第一章', children: [
   * //       { name: '1.1 简介', children: [...] },
   * //       { name: '1.2 详情', children: [] }
   * //     ]},
   * //     { name: '第二章', children: [] }
   * //   ]
   * // }
   */
  static buildTree(tokens) {
  const root = { name: '中心主题', children: [] };
  const stack = [{ node: root, depth: 0 }]; // 用栈跟踪层级
  let filteredTokens = tokens.filter(token => token.type !== 'space' && token.type !== 'hr')

  filteredTokens.forEach((token,index) => {
    let current = stack[stack.length - 1];

    if (token.type === 'heading') {
      // 标题层级比栈顶浅，则回退栈到对应层级
      while (stack.length > 1 && token.depth <= current.depth) {
        stack.pop();
        current = stack[stack.length - 1]
      }
      const newNode = { name: this.getUnformattedText(token), children: [] ,type:'heading'};
      current.node.children.push(newNode);
      stack.push({ node: newNode, depth: token.depth });
    } else if (token.type === 'list') {
      // 处理列表（可能包含多级嵌套）
      const listNodes = this.processList(token.items);
      if(index && filteredTokens[index-1].type === 'paragraph'){
        if (current.node.type === 'paragraph') {
          stack.pop();
        }
        stack.push({ node: current.node.children.at(-1), depth: 100 });
        current = stack[stack.length - 1];
        // current.node.children.at(-1).hasList = true;
        // current.node.children.at(-1).listText = token.raw;
        // current.node.children.at(-1).listStart = token.start;
        // current.node.children.at(-1).ordered = token.ordered;
        // current.node.children.at(-1).children.push(...listNodes)
      }
      current.node.hasList = true;
      current.node.listText = token.raw;
      current.node.listStart = token.start;
      current.node.ordered = token.ordered;
      current.node.children.push(...listNodes);
      
    } else {
      if (token.type === 'paragraph' && current.node.type === 'paragraph') {
        stack.pop();
        current = stack[stack.length - 1];
      }
      current.node.children.push({ name: token.raw, raw: token.raw, children: [] ,type:token.type});
    }
  });
  return root;
}
  /**
   * 🌲 Markdown 转抽象语法树（AST）
   * 
   * 将 Markdown 文本解析为树形结构的 AST。
   * 这是构建脑图、大纲等功能的基础。
   * 
   * @param {string} markdown - Markdown 格式的文本
   * @returns {Object} 抽象语法树的根节点
   * 
   * @example
   * let markdown = `
   * # 主题
   * ## 子主题1
   * - 内容1
   * - 内容2
   * ## 子主题2
   * `
   * 
   * let ast = pluginDemoUtils.markdown2AST(markdown)
   * // 可以用于生成脑图
   * pluginDemoUtils.AST2Mindmap(focusNote, ast)
   */
  static markdown2AST(markdown){
    let tokens = marked.lexer(markdown)
    // MNUtil.copy(tokens)
    return this.buildTree(tokens)
  }
  /**
   * 🧮 检查文本是否包含数学公式
   * 
   * 检测 Markdown 文本中是否包含 LaTeX 数学公式。
   * 支持行内公式（$...$）和块级公式（$$...$$）。
   * 
   * @param {string} markdownText - 要检查的文本
   * @returns {boolean} 是否包含数学公式
   * 
   * @example
   * pluginDemoUtils.containsMathFormula("这是公式：$E=mc^2$")     // true
   * pluginDemoUtils.containsMathFormula("$$\\int_0^1 x dx$$")     // true
   * pluginDemoUtils.containsMathFormula("普通文本")               // false
   * 
   * // 用于决定是否启用 Markdown 模式
   * if (pluginDemoUtils.containsMathFormula(text)) {
   *   note.excerptTextMarkdown = true
   * }
   */
  static  containsMathFormula(markdownText) {
    // 正则表达式匹配单美元符号包裹的公式
    const inlineMathRegex = /\$[^$]+\$/;
    // 正则表达式匹配双美元符号包裹的公式
    const blockMathRegex = /\$\$[^$]+\$\$/;
    // 检查是否包含单美元或双美元符号包裹的公式
    return inlineMathRegex.test(markdownText) || blockMathRegex.test(markdownText);
  }
  /**
   * 🔗 检查文本是否包含 URL
   * 
   * 检测文本中是否包含网址链接。
   * 支持 http/https 协议和 www 开头的网址。
   * 
   * @param {string} markdownText - 要检查的文本
   * @returns {boolean} 是否包含 URL
   * 
   * @example
   * pluginDemoUtils.containsUrl("访问 https://example.com")    // true
   * pluginDemoUtils.containsUrl("查看 www.example.com")        // true
   * pluginDemoUtils.containsUrl("普通文本")                     // false
   * 
   * // 用于决定是否保留 Markdown 格式
   * if (pluginDemoUtils.containsUrl(text)) {
   *   config.excerptTextMarkdown = true
   * }
   */
  static  containsUrl(markdownText) {
    // 正则表达式匹配常见的网址格式
    const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+/i;
    
    // 使用正则表达式测试文本
    return urlPattern.test(markdownText);
  }

  /**
   * 🧹 移除 Markdown 格式标记
   * 
   * 将 Markdown 格式的文本转换为纯文本。
   * 移除所有格式标记，保留实际内容。
   * 
   * @param {string} markdownStr - Markdown 格式的文本
   * @returns {string} 纯文本
   * 
   * 移除的格式：
   * - 加粗：`**text**` 和 `__text__`
   * - 斜体：`*text*` 和 `_text_`
   * - 删除线：`~~text~~`
   * - 内联代码：`code`
   * - 链接：`[text](url)`
   * - 图片：`![alt](url)`
   * - 标题：`# Title`
   * - 列表符号：`- item`
   * - 引用：`> quote`
   * - 分隔线：`---`
   * - HTML 标签：`<tag>`
   * 
   * @example
   * let markdown = "**重要**：请查看 [文档](http://example.com)"
   * let plainText = pluginDemoUtils.removeMarkdownFormat(markdown)
   * // "重要：请查看 文档"
   * 
   * let complex = "# 标题\n- **列表项1**\n- *列表项2*\n> 引用"
   * let plain = pluginDemoUtils.removeMarkdownFormat(complex)
   * // "标题\n列表项1\n列表项2\n引用"
   */
  static removeMarkdownFormat(markdownStr) {
    return markdownStr
      // 移除加粗 ** ** 和 __ __
      .replace(/\*\*(\S(.*?\S)?)\*\*/g, '$1')
      .replace(/__(\S(.*?\S)?)__/g, '$1')
      // 移除斜体 * * 和 _ _
      .replace(/\*(\S(.*?\S)?)\*/g, '$1')
      .replace(/_(\S(.*?\S)?)_/g, '$1')
      // 移除删除线 ~~ ~~
      .replace(/~~(\S(.*?\S)?)~~/g, '$1')
      // 移除内联代码 ` `
      .replace(/`([^`]+)`/g, '$1')
      // 移除链接 [text](url)
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // 移除图片 ![alt](url)
      .replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1')
      // 移除标题 # 和 ##
      .replace(/^#{1,6}\s+/gm, '')
      // 移除部分列表符号（*、-、+.）
      .replace(/^[\s\t]*([-*+]\.)\s+/gm, '')
      // 移除块引用 >
      .replace(/^>\s+/gm, '')
      // 移除水平线 ---
      .replace(/^[-*]{3,}/gm, '')
      // 移除HTML标签（简单处理）
      .replace(/<[^>]+>/g, '')
      // 合并多个空行
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }
  /**
   * 🎯 智能解析文本生成笔记配置
   * 
   * 根据文本内容智能判断应该如何创建笔记。
   * 支持识别数学公式、URL、标题与内容的分隔等。
   * 
   * @param {string} text - 要解析的文本
   * @returns {Object} 笔记配置对象
   * 
   * 解析规则：
   * 1. 包含数学公式 → 启用 Markdown 模式
   * 2. 包含 URL → 启用 Markdown 模式
   * 3. 包含冒号分隔 → 前半部分为标题，后半部分为摘录
   * 4. 长度超过 50 字符 → 作为摘录
   * 5. 其他情况 → 作为标题
   * 
   * 返回的配置：
   * - title: 笔记标题
   * - excerptText: 摘录文本
   * - excerptTextMarkdown: 是否启用 Markdown
   * 
   * @example
   * // 数学公式
   * let config1 = pluginDemoUtils.getConfig("定理：$a^2 + b^2 = c^2$")
   * // { title: "定理", excerptText: "$a^2 + b^2 = c^2$", excerptTextMarkdown: true }
   * 
   * // URL
   * let config2 = pluginDemoUtils.getConfig("参考：https://example.com")
   * // { excerptText: "参考：https://example.com", excerptTextMarkdown: true }
   * 
   * // 标题与内容
   * let config3 = pluginDemoUtils.getConfig("重要：这是一个重要的概念")
   * // { title: "重要", excerptText: "这是一个重要的概念" }
   * 
   * // 短文本
   * let config4 = pluginDemoUtils.getConfig("简短标题")
   * // { title: "简短标题" }
   * 
   * // 长文本
   * let config5 = pluginDemoUtils.getConfig("这是一段很长的文本..." + "x".repeat(50))
   * // { excerptText: "这是一段很长的文本...xxx..." }
   */
  static getConfig(text){
  let hasMathFormula = this.containsMathFormula(text)
  if (hasMathFormula) {
    if (/\:/.test(text)) {
      let splitedText = text.split(":")
      if (this.containsMathFormula(splitedText[0])) {
        let config = {excerptText:text,excerptTextMarkdown:true}
        return config
      }
      if (this.containsMathFormula(splitedText[1])) {
        let config = {title:splitedText[0],excerptText:splitedText[1],excerptTextMarkdown:true}
        return config
      }
      let config = {title:splitedText[0],excerptText:splitedText[1]}
      return config
    }
    if (/\：/.test(text)) {
      let splitedText = text.split("：")
      if (this.containsMathFormula(splitedText[0])) {
        let config = {excerptText:text,excerptTextMarkdown:true}
        return config
      }
      if (this.containsMathFormula(splitedText[1])) {
        let config = {title:splitedText[0],excerptText:splitedText[1],excerptTextMarkdown:true}
        return config
      }
      let config = {title:splitedText[0],excerptText:splitedText[1]}
      return config
    }
    let config = {excerptText:text,excerptTextMarkdown:true}
    return config
  }
  if (this.containsUrl(text)) {
    let config = {excerptText:text,excerptTextMarkdown:true}
    return config
  }
    if (/\:/.test(text)) {
      let splitedText = text.split(":")
      if (splitedText[0].length > 50) {
        let config = {excerptText:text}
        return config
      }
      let config = {title:splitedText[0],excerptText:splitedText[1]}
      return config
    }
    if (/\：/.test(text)) {
      let splitedText = text.split("：")
      if (splitedText[0].length > 50) {
        let config = {excerptText:text}
        return config
      }
      let config = {title:splitedText[0],excerptText:splitedText[1]}
      return config
    }
  if (text.length > 50) {
    return {excerptText:text}
  }
  return {title:text}
}
  /**
   * 🗺️ 将抽象语法树转换为脑图
   * 
   * 递归地将 AST 结构转换为 MarginNote 的脑图笔记。
   * 自动处理标题层级、列表结构，智能识别标题与内容。
   * 
   * @param {MNNote} note - 父笔记节点
   * @param {Object} ast - 抽象语法树节点
   * @param {string} [level="all"] - 处理层级（保留参数）
   * 
   * 转换规则：
   * 1. 根据文本内容智能判断标题和摘录
   * 2. 保留列表的编号（有序列表）
   * 3. 处理嵌套的子节点
   * 4. 跳过分隔线（hr）
   * 5. 智能合并标题与后续内容
   * 
   * @example
   * // 从 Markdown 创建脑图
   * let markdown = `
   * # 主题
   * ## 概念1
   * 定义：这是概念1的定义
   * ## 概念2
   * - 要点A
   * - 要点B
   * `
   * 
   * let ast = pluginDemoUtils.markdown2AST(markdown)
   * let rootNote = MNNote.getFocusNote()
   * pluginDemoUtils.AST2Mindmap(rootNote, ast)
   * 
   * // 结果：在 rootNote 下创建对应的脑图结构
   */
  static AST2Mindmap(note,ast,level = "all") {
try {
  if (ast.children && ast.children.length) {
    let hasList = ast.hasList
    let listOrdered = ast.listOrdered || ast.ordered
    ast.children.forEach((c,index)=>{
      if (c.type === 'hr') {
        return
      }
      let text = this.removeMarkdownFormat(c.name)
      // let text = c.name
      if (text.endsWith(":") || text.endsWith("：")) {
        text = text.slice(0,-1)
      }
      let config = this.getConfig(text)
      if ((text.startsWith('$') && text.endsWith('$')) || /\:/.test(text) || /：/.test(text)) {

      }else{
        if (c.children.length === 1 && !(/\:/.test(c.children[0].name) || /：/.test(c.children[0].name))) {
          if (text.endsWith(":") || text.endsWith("：")) {
            config = {excerptText:text+"\n"+c.children[0].name}
          }else{
            config = {title:text,excerptText:c.children[0].name}
          }
          let childNote = note.createChildNote(config)
          if (c.children[0].children.length) {
            this.AST2Mindmap(childNote,c.children[0])
          }
          return
        }
        if (c.children.length > 1 && c.children[0].type === 'paragraph' && c.children[1].type === 'heading') {
          if (text.endsWith(":") || text.endsWith("：")) {
            config = {excerptText:text+"\n"+c.children[0].name}
          }else{
            config = {title:text,excerptText:c.children[0].name}
          }
          c.children.shift()
        }
      }
      if (hasList && listOrdered) {
        if (ast.listStart == 0) {
          ast.listStart = 1
        }
        if (config.title) {
          config.title = (ast.listStart+index)+". "+config.title
        }else{
          config.excerptText = (ast.listStart+index)+". "+config.excerptText
        }
      }
      // MNUtil.showHUD("message")
      //继续创建子节点
      let childNote = note.createChildNote(config)
      this.AST2Mindmap(childNote,c)
    })
  }else{
    // MNUtil.showHUD("No children found")
  }
  } catch (error) {
  this.addErrorLog(error, "AST2Mindmap")
}
}
 static async markdown2Mindmap(des){
 try {
  

    let markdown = ``
    let source = des.source ?? "currentNote"
    let focusNote = MNNote.getFocusNote()
    let newNoteTitle = "Mindmap"
    switch (source) {
      case "currentNote":
        if (!focusNote) {
          MNUtil.showHUD("No note found")
          return
        }
        markdown = this.mergeWhitespace(await this.getMDFromNote(focusNote))
        break;
      case "file":
        let filePath = await MNUtil.importFile(["public.text"])
        if (filePath) {
          markdown = MNUtil.readText(filePath)
        }
        newNoteTitle = MNUtil.getFileName(filePath).split(".")[0]
        break;
      case "clipboard":
        markdown = MNUtil.clipboardText
        break;
      default:
        break;
    }
    // let markdown = des.markdown
    MNUtil.showHUD("Creating Mindmap...")
    await MNUtil.delay(0.1)
    let res = pluginDemoUtils.markdown2AST(markdown)
    // MNUtil.copy(res)
    MNUtil.undoGrouping(()=>{
      if (!focusNote) {
        focusNote = this.newNoteInCurrentChildMap({title:newNoteTitle})
        focusNote.focusInFloatMindMap(0.5)
      }
      pluginDemoUtils.AST2Mindmap(focusNote,res)
    })
    return
 } catch (error) {
  this.addErrorLog(error, "markdown2Mindmap")
  return
 }
  }
  static checkHeight(height,maxButtons = 20){
    if (height > 420 && !this.isSubscribed(false)) {
      return 420
    }
    // let maxNumber = this.isSubscribe?maxButtons:9
    let maxHeights = 45*maxButtons+15
    if (height > maxHeights) {
      return maxHeights
    }else if(height < 60){
      return 60
    }else{
      let newHeight = 45*(Math.floor(height/45))+15
      return newHeight
    }
  }
  static addErrorLog(error,source,info){
    MNUtil.showHUD("MN Toolbar Error ("+source+"): "+error)  // 保留特定的错误提示
    return MNUtil.addErrorLog(error, "MNToolbar:" + source, info)  // 使用 MNUtil 的错误日志系统
  }
  static removeComment(des){
    // MNUtil.copyJSON(des)
    let focusNotes = MNNote.getFocusNotes()
    if (des.find) {
      let condition  = des.find
      MNUtil.undoGrouping(()=>{
        focusNotes.forEach(note=>{
          if (note.comments.length) {
            let indices = note.getCommentIndicesByCondition(condition)
            if (!indices.length) {
              MNUtil.showHUD("No match")
              return
            }
            if (des.multi) {
              note.removeCommentsByIndices(indices)
            }else{
              indices = MNUtil.sort(indices,"increment")
              note.removeCommentByIndex(indices[0])
            }
          }
        })
      })
      return
    }
    if (des.types || des.type) {
      let types = Array.isArray(des.type) ? des.type : [des.type]
      if (des.types) {
        types = Array.isArray(des.types) ? des.types : [des.types]
      }
      MNUtil.undoGrouping(()=>{
        focusNotes.forEach(note=>{
          if (!note.comments.length) {
            return
          }
          if (des.multi) {
            let commentsToRemove = []
            note.comments.forEach((comment,index)=>{
              if (MNComment.commentBelongsToType(comment, types)) {
                commentsToRemove.push(index)
              }
            })
            if (!commentsToRemove.length) {
              MNUtil.showHUD("No match")
              return
            }
            note.removeCommentsByIndices(commentsToRemove)
          }else{
            let index = note.comments.findIndex(comment=>{
              if (MNComment.commentBelongsToType(comment, types)) {
                return true
              }
            })
            if (index < 0) {
              MNUtil.showHUD("No match")
              return
            }
            note.removeCommentByIndex(index)
          }
        })
      })
      return
    }
    if (des.multi) {
      let commentIndices = Array.isArray(des.index)? des.index : [des.index]
      commentIndices = MNUtil.sort(commentIndices,"decrement")
      // MNUtil.copyJSON(commentIndices)
      if (!commentIndices.length) {
        MNUtil.showHUD("No match")
        return
      }
      MNUtil.undoGrouping(()=>{
        focusNotes.forEach(note => {
          if (note.comments.length) {
            note.removeCommentsByIndices(commentIndices)
          }
        })
      })
    }else{
      let commentIndex = des.index+1
      if (commentIndex) {
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(note => {
            if (note.comments.length) {
              let commentLength = note.comments.length
              if (commentIndex > commentLength) {
                commentIndex = commentLength
              }
              note.removeCommentByIndex(commentIndex-1)
            }
          })
        })
      }
    }
  
  }
  static setTimer(des){
    let userInfo = {timerMode:des.timerMode}
    if (des.timerMode === "countdown") {
      userInfo.minutes = des.minutes
    }
    if ("annotation" in des) {
      userInfo.annotation = des.annotation
    }
    MNUtil.postNotification("setTimer", userInfo)
  }
  static searchInDict(des,button){
    let target = des.target ?? "eudic"
    let textSelected = MNUtil.selectionText
    if (!textSelected) {
      let focusNote = MNNote.getFocusNote()
      if (focusNote) {
        if (focusNote.excerptText) {
          textSelected = focusNote.excerptText
        }else if (focusNote.noteTitle) {
          textSelected = focusNote.noteTitle
        }else{
          let firstComment = focusNote.comments.filter(comment=>comment.type === "TextNote")[0]
          if (firstComment) {
            textSelected = firstComment.text
          }
        }
      }
    }
    if (textSelected) {
      if (target === "eudic") {
        let textEncoded = encodeURIComponent(textSelected)
        let url = "eudic://dict/"+textEncoded
        MNUtil.openURL(url)
      }else{
        let studyFrame = MNUtil.studyView.bounds
        let beginFrame = self.view.frame
        if (button.menu) {
          button.menu.dismissAnimated(true)
          let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
          let endFrame = pluginDemoFrame.gen(beginFrame.x-225, beginFrame.y-50, 500, 500)
          endFrame.y = MNUtil.constrain(endFrame.y, 0, studyFrame.height-500)
          endFrame.x = MNUtil.constrain(endFrame.x, 0, studyFrame.width-500)
          MNUtil.postNotification("lookupText"+target,{text:textSelected,beginFrame:beginFrame,endFrame:endFrame})
          return
        }
        let endFrame
        beginFrame.y = beginFrame.y-10
        if (beginFrame.x+490 > studyFrame.width) {
          endFrame = pluginDemoFrame.gen(beginFrame.x-450, beginFrame.y-10, 500, 500)
          if (beginFrame.y+490 > studyFrame.height) {
            endFrame.y = studyFrame.height-500
          }
          if (endFrame.x < 0) {
            endFrame.x = 0
          }
          if (endFrame.y < 0) {
            endFrame.y = 0
          }
        }else{
          endFrame = pluginDemoFrame.gen(beginFrame.x+40, beginFrame.y-10, 500, 500)
          if (beginFrame.y+490 > studyFrame.height) {
            endFrame.y = studyFrame.height-500
          }
          if (endFrame.x < 0) {
            endFrame.x = 0
          }
          if (endFrame.y < 0) {
            endFrame.y = 0
          }
        }
        MNUtil.postNotification("lookupText"+target, {text:textSelected,beginFrame:beginFrame,endFrame:endFrame})
      }


      // let des = pluginDemoConfig.getDescriptionByName("searchInEudic")
      // if (des && des.source) {
      //   // MNUtil.copyJSON(des)
      //   switch (des.source) {
      //     case "eudic":
      //       //donothing
      //       break;
      //     case "yddict":
      //       MNUtil.copy(textSelected)
      //       url = "yddict://"
      //       break;
      //     case "iciba":
      //       url = "iciba://word="+textEncoded
      //       break;
      //     case "sogodict":
      //       url = "bingdict://"+textEncoded
      //       break;
      //     case "bingdict":
      //       url = "sogodict://"+textEncoded
      //       break;
      //     default:
      //       MNUtil.showHUD("Invalid source")
      //       return
      //   }
      // }
      // showHUD(url)
    }else{
      MNUtil.showHUD('未找到有效文字')
    }


  }
  static showMessage(des){
    let content = this.detectAndReplace(des.content)
    MNUtil.showHUD(content)
  }
  static async userConfirm(des){
    if (des.title) {
      let confirmTitle = this.detectAndReplace(des.title)
      let confirmSubTitle = des.subTitle ? this.detectAndReplace(des.subTitle) : ""
      let confirm = await MNUtil.confirm(confirmTitle, confirmSubTitle)
      if (confirm) {
        if ("onConfirm" in des) {
          return des.onConfirm
        }
        return undefined
      }else{
        if ("onCancel" in des) {
          return des.onCancel
        }
      }
      return undefined
    }
    return undefined
  }
  static async userSelect(des){
    if (des.title && des.selectItems) {
      let confirmTitle = pluginDemoUtils.detectAndReplace(des.title)
      let confirmSubTitle = des.subTitle ? pluginDemoUtils.detectAndReplace(des.subTitle) : ""
      let selectTitles = des.selectItems.map(item=>{
        return pluginDemoUtils.detectAndReplace(item.selectTitle)
      })
      let select = await MNUtil.userSelect(confirmTitle, confirmSubTitle, selectTitles)
      if (select) {
        let targetDes = des.selectItems[select-1]
        return targetDes
      }else{
        if ("onCancel" in des) {
          return des.onCancel
        }
      }
      return undefined
    }
    return undefined
  }
  static chatAI(des,button){
    if (des.target === "openFloat") {
      MNUtil.postNotification("chatAIOpenFloat", {beginFrame:button.convertRectToView(button.bounds,MNUtil.studyView)})
      return
    }
    if (des.target === "currentPrompt") {
      MNUtil.postNotification("customChat",{})
      return true
    }
    if (!des || !Object.keys(des).length) {
      MNUtil.postNotification("customChat",{})
      return
    }

    if (des.prompt) {
      MNUtil.postNotification("customChat",{prompt:des.prompt})
      return
    }
    if(des.user){
      let question = {user:des.user}
      if (des.system) {
        question.system = des.system
      }
      MNUtil.postNotification("customChat",question)
      // MNUtil.showHUD("Not supported yet...")
      return;
    }
    MNUtil.postNotification("customChat",{})
    // MNUtil.showHUD("No valid argument!")
  }
  static search(des,button){
    // MNUtil.copyJSON(des)
    // MNUtil.showHUD("Search")
    let selectionText = MNUtil.selectionText
    let noteId = undefined
    let foucsNote = MNNote.getFocusNote()
    if (foucsNote) {
      noteId = foucsNote.noteId
    }
    let studyFrame = MNUtil.studyView.bounds
    let beginFrame = button.frame
    if (button.menu) {
      button.menu.dismissAnimated(true)
      let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
      let endFrame = pluginDemoFrame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
      endFrame.y = MNUtil.constrain(endFrame.y, 0, studyFrame.height-500)
      endFrame.x = MNUtil.constrain(endFrame.x, 0, studyFrame.width-500)
      if (selectionText) {
        // MNUtil.showHUD("Text:"+selectionText)
        MNUtil.postNotification("searchInBrowser",{text:selectionText,beginFrame:beginFrame,endFrame:endFrame})
      }else{
        // MNUtil.showHUD("NoteId:"+noteId)
        MNUtil.postNotification("searchInBrowser",{noteid:noteId,beginFrame:beginFrame,endFrame:endFrame})
      }
      return
    }
    // if (button.menu) {
    //   beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
    // }
    let endFrame
    beginFrame.y = beginFrame.y-10
    if (beginFrame.x+490 > studyFrame.width) {
      endFrame = pluginDemoFrame.gen(beginFrame.x-450, beginFrame.y-10, 450, 500)
      if (beginFrame.y+490 > studyFrame.height) {
        endFrame.y = studyFrame.height-500
      }
    }else{
      endFrame = pluginDemoFrame.gen(beginFrame.x+40, beginFrame.y-10, 450, 500)
      if (beginFrame.y+490 > studyFrame.height) {
        endFrame.y = studyFrame.height-500
      }
    }
    if (des.engine) {
      if (selectionText) {
        // MNUtil.showHUD("Text:"+selectionText)
        MNUtil.postNotification("searchInBrowser",{text:selectionText,engine:des.engine,beginFrame:beginFrame,endFrame:endFrame})
      }else{
        // MNUtil.showHUD("NoteId:"+noteId)
        MNUtil.postNotification("searchInBrowser",{noteid:noteId,engine:des.engine,beginFrame:beginFrame,endFrame:endFrame})
      }
      return
    }
    if (selectionText) {
      // MNUtil.showHUD("Text:"+selectionText)
      MNUtil.postNotification("searchInBrowser",{text:selectionText,beginFrame:beginFrame,endFrame:endFrame})
    }else{
      // MNUtil.showHUD("NoteId:"+noteId)
      MNUtil.postNotification("searchInBrowser",{noteid:noteId,beginFrame:beginFrame,endFrame:endFrame})
    }
  }
  /**
   * @param {NSData} image 
   * @returns 
   */
  static async getTextOCR (image) {
    if (typeof ocrNetwork === 'undefined') {
      MNUtil.showHUD("Install 'MN OCR' first")
      return undefined
    }
    try {
      let res = await ocrNetwork.OCR(image)
      // MNUtil.copy(res)
      return res
    } catch (error) {
      chatAIUtils.addErrorLog(error, "getTextOCR",)
      return undefined
    }
  }

/**
 * Initializes a request for ChatGPT using the provided configuration.
 * 
 * @param {Array} history - An array of messages to be included in the request.
 * @param {string} apikey - The API key for authentication.
 * @param {string} url - The URL endpoint for the API request.
 * @param {string} model - The model to be used for the request.
 * @param {number} temperature - The temperature parameter for the request.
 * @param {Array<number>} funcIndices - An array of function indices to be included in the request.
 * @returns {Promise<{content:string,media:string,title:string,link:string,refer:string,icon:string,index:number}[]>}
 * @throws {Error} If the API key is empty or if there is an error during the request initialization.
 */
static async webSearchForZhipu (question,apikey) {
  if (apikey.trim() === "") {
    MNUtil.showHUD(model+": No apikey!")
    return
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer "+apikey,
    Accept: "text/event-stream"
  }
    // copyJSON(headers)
  let body = {
    "tool":"web-search-pro",
    "messages":[{"role": "user", "content": question}],
    "stream":false
  }
  let url = "https://open.bigmodel.cn/api/paas/v4/tools"
  // copyJSON(body)

  // MNUtil.copyJSON(body)
  // MNUtil.copy(url)
  let res = await MNConnection.fetch(url,{
      method: "POST",
      headers: headers,
      timeout: 60,
      json: body
    })
  try {
    return res.choices[0].message.tool_calls[1].search_result
  } catch (error) {
    return res
  }
}
  static async webSearch(des){
  try {
    

    let focusNote = MNNote.getFocusNote()
    if (!focusNote) {
      return
    }
    // let noteConfig = this.getNoteObject(MNNote.getFocusNote(),{},{parent:true,child:true})

    let question = this.detectAndReplace(des.question)
    // MNUtil.copy(noteConfig)
    // return
    MNUtil.waitHUD("Searching for ["+question+"] ")
    let apikeys = ["449628b94fcac030495890ee542284b8.F23PvJW4XXLJ4Lsu","7a83bf0873d12b99a1f9ab972ee874a1.NULvuYvVrATzI4Uj"]
    let apikey = MNUtil.getRandomElement(apikeys)
    let res = await this.webSearchForZhipu(question,apikey)
    let readCount = 0
    if (!res.length) {
      MNUtil.waitHUD("❌ No result")
      MNUtil.delay(1).then(()=>{
        MNUtil.stopHUD()
      })
      return
    }
    MNUtil.waitHUD(`Open URL (0/${res.length})`)
    let processes = res.map(r=>{
      if (r.link) {
        return new Promise((resolve, reject) => {
          let apikey = MNUtil.getRandomElement(apikeys)
          this.webSearchForZhipu(r.link,apikey).then(tem=>{
            readCount++
            MNUtil.waitHUD(`Open URL (${readCount}/${res.length})`)
            if ("statusCode" in tem && tem.statusCode >= 400) {
            }else{
              if (tem[0].content.length > r.content.length) {
                r.content = tem[0].content
              }
            }
            resolve(r)
          })
        })
      }else{
        readCount++
        return r
      }
    })
    let fullRes = await Promise.all(processes)
    MNUtil.stopHUD()
    MNUtil.copy(fullRes)

    MNUtil.undoGrouping(()=>{
      fullRes.map((r)=>{
        let content = r.content
        let markdown = false
        if (r.link) {
          content = content+`\n[More](${r.link})`
          markdown = true
        }
        focusNote.createChildNote({title:r.title,excerptText:content,excerptTextMarkdown:markdown})
      })
    })
    // MNUtil.stopHUD()
    return res
  } catch (error) {
    this.addErrorLog(error, "webSearch")
  }
  }
  /**
   * 
   * @param {{buffer:boolean,target:string,method:string}} des 
   * @param {UIButton} button 
   * @returns 
   */
  static async ocr(des,button){
try {
    let focusNote = MNNote.getFocusNote()
    let imageData = MNUtil.getDocImage(true,true)
    if (!imageData && focusNote) {
      imageData = MNNote.getImageFromNote(focusNote)
    }
    if (!imageData) {
      MNUtil.showHUD("No image found")
      return
    }
    let buffer = des.buffer ?? true
    let source = des.ocrSource ?? des.source
    let target = des.target ?? "comment"
    let res
    if (typeof ocrUtils === 'undefined') {
      // MNUtil.showHUD("MN Toolbar: Please install 'MN OCR' first!")
      res = await this.freeOCR(imageData)
    }else{
      res = await ocrNetwork.OCR(imageData,source,buffer)
    }
    // let res
    let noteTargets = ["comment","excerpt","childNote"]
    if (!focusNote && noteTargets.includes(target)) {
      let selection = MNUtil.currentSelection
      if (selection.onSelection) {
        focusNote = MNNote.fromSelection()
      }
    }
    if (res) {
      switch (target) {
        case "option":
          if (focusNote) {
            let userSelect = await MNUtil.userSelect("OCR Result", res, ["Copy","Comment","Excerpt","Editor","ChildNote"])
            switch (userSelect) {
              case 0:
                return;
              case 1:
                MNUtil.copy(res)
                MNUtil.showHUD("✅ Save to clipboard")
                return;
              case 2:
                MNUtil.undoGrouping(()=>{
                  focusNote.appendMarkdownComment(res)
                  MNUtil.showHUD("✅ Append to comment")
                })
                MNUtil.postNotification("OCRFinished", {action:"toComment",noteId:focusNote.noteId,result:res})
                return;
              case 3:
                ocrUtils.undoGrouping(()=>{
                  // focusNote.textFirst = true
                  focusNote.excerptTextMarkdown = true
                  focusNote.excerptText =  res
                  MNUtil.showHUD("✅ Set to excerpt")
                })
                MNUtil.postNotification("OCRFinished", {action:"toExcerpt",noteId:focusNote.noteId,result:res})
                return;
              case 4:
                let studyFrame = MNUtil.studyView.bounds
                let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
                let endFrame = pluginDemoFrame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
                endFrame.y = MNUtil.constrain(endFrame.y, 0, studyFrame.height-500)
                endFrame.x = MNUtil.constrain(endFrame.x, 0, studyFrame.width-500)
                MNUtil.postNotification("openInEditor",{content:res,beginFrame:beginFrame,endFrame:endFrame})
                return;
              case 5:
                let child = focusNote.createChildNote({excerptText:res,excerptTextMarkdown:true})
                child.focusInMindMap(0.5)
                MNUtil.showHUD("✅ Create child note")
                return;
              default:
                return;
            }
          }else{
            let userSelect = await MNUtil.userSelect("OCR Result", res, ["Copy","Editor","New Note"])
            switch (userSelect) {
              case 0:
                return;
              case 1:
                MNUtil.copy(res)
                MNUtil.showHUD("✅ Save to clipboard")
                return;
              case 2:
                let studyFrame = MNUtil.studyView.bounds
                let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
                let endFrame = pluginDemoFrame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
                endFrame.y = MNUtil.constrain(endFrame.y, 0, studyFrame.height-500)
                endFrame.x = MNUtil.constrain(endFrame.x, 0, studyFrame.width-500)
                MNUtil.postNotification("openInEditor",{content:res,beginFrame:beginFrame,endFrame:endFrame})
                return;
              case 3:
                MNUtil.undoGrouping(()=>{
                  let childmap = MNUtil.currentChildMap
                  if (childmap) {
                    let child = focusNote.createChildNote({excerptText:res,excerptTextMarkdown:true})
                    child.focusInMindMap(0.5)
                  }else{
                    let child = MNNote.new({excerptText:res,excerptTextMarkdown:true})
                    child.focusInMindMap(0.5)
                  }
                })
                MNUtil.showHUD("✅ Create child note")
                return;
              default:
                return;
            }
          }
        case "comment":
          if (focusNote) {
            MNUtil.undoGrouping(()=>{
              focusNote.appendMarkdownComment(res)
              MNUtil.showHUD("Append to comment")
            })
          }else{
            MNUtil.copy(res)
          }
          break;
        case "childNote":
          if (focusNote) {
            let config = {
              excerptTextMarkdown: true,
              content: res
            }
            if (des.followParentColor) {
              config.colorIndex = focusNote.colorIndex
            }
            // MNUtil.copy(config)
            let child = focusNote.createChildNote(config)
            child.focusInMindMap(0.5)
            MNUtil.showHUD("Append to child note")
          }else{
            MNUtil.copy(res)
          }
        break;
        case "clipboard":
          MNUtil.copy(res)
          MNUtil.showHUD("Save to clipboard")
          break;
        case "excerpt":
          if (focusNote) {
            MNUtil.undoGrouping(()=>{
              focusNote.excerptText =  res
              focusNote.excerptTextMarkdown = true
              MNUtil.showHUD("Set to excerpt")
            })
          }else{
            MNUtil.copy(res)
          }
          break;
        case "editor":
          let studyFrame = MNUtil.studyView.bounds
          let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
          let endFrame = pluginDemoFrame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
          endFrame.y = MNUtil.constrain(endFrame.y, 0, studyFrame.height-500)
          endFrame.x = MNUtil.constrain(endFrame.x, 0, studyFrame.width-500)
          MNUtil.postNotification("openInEditor",{content:res,beginFrame:beginFrame,endFrame:endFrame})
          return
        case "chatModeReference":
          let method = "append"
          if ("method" in des) {
            method = des.method
          }
          MNUtil.postNotification(
            "insertChatModeReference",
            {
              contents:[{type:"text",content:res}],
              method:method
            }
          )
          break;
        default:
          MNUtil.copy(res)
          MNUtil.showHUD("Unkown target: "+target)
          break;
      }
    }
      
    } catch (error) {
      this.addErrorLog(error, "ocr")
    }
  
  }
/**
 * Initializes a request for ChatGPT using the provided configuration.
 * 
 * @param {Array} history - An array of messages to be included in the request.
 * @param {string} apikey - The API key for authentication.
 * @param {string} url - The URL endpoint for the API request.
 * @param {string} model - The model to be used for the request.
 * @param {number} temperature - The temperature parameter for the request.
 * @param {Array<number>} funcIndices - An array of function indices to be included in the request.
 * @throws {Error} If the API key is empty or if there is an error during the request initialization.
 */
static initRequestForChatGPTWithoutStream (history,apikey,url,model,temperature,funcIndices=[]) {
  if (apikey.trim() === "") {
    MNUtil.showHUD(model+": No apikey!")
    return
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer "+apikey,
    Accept: "text/event-stream"
  }
    // copyJSON(headers)
  let body = {
    "model":model,
    "messages":history
  }
  // if (model !== "deepseek-reasoner") {
    body.temperature = temperature
    // if (url === "https://api.minimax.chat/v1/text/chatcompletion_v2") {
    //   let tools = chatAITool.getToolsByIndex(funcIndices,true)
    //   if (tools.length) {
    //     body.tools = tools
    //   }
    //   body.max_tokens = 8000
    // }else{
    //   let tools = chatAITool.getToolsByIndex(funcIndices,false)
    //   if (tools.length) {
    //     body.tools = tools
    //     body.tool_choice = "auto"
    //   }
    // }
  const request = MNConnection.initRequest(url, {
      method: "POST",
      headers: headers,
      timeout: 60,
      json: body
    })
  return request
}
/**
 * 
 * @returns {Promise<Object>}
 */
 static async ChatGPTVision(imageData,model="glm-4v-flash") {
  try {
  let key = 'sk-S2rXjj2qB98OiweU46F3BcF2D36e4e5eBfB2C9C269627e44'
  MNUtil.waitHUD("OCR By "+model)
  let url = subscriptionConfig.config.url + "/v1/chat/completions"
  let prompt = `—role—
Image Text Extraction Specialist

—goal—
* For the given image, please directly output the text in the image.

* For any formulas, you must enclose them with dollar signs.

—constrain—
* You are not allowed to output any content other than what is in the image.`
  let compressedImageData = UIImage.imageWithData(imageData).jpegData(0.0)
  let history = [
    {
      role: "user", 
      content: [
        {
          "type": "text",
          "text": prompt
        },
        {
          "type": "image_url",
          "image_url": {
            "url" : "data:image/jpeg;base64,"+compressedImageData.base64Encoding()
          }
        }
      ]
    }
  ]
  let request = this.initRequestForChatGPTWithoutStream(history,key, url, model, 0.1)
    let res = await MNConnection.sendRequest(request)
    let ocrResult
    if (res.choices && res.choices.length) {
      ocrResult = res.choices[0].message.content
    }else{
      return undefined
    }
    let convertedText = ocrResult
      .replace(/\$\$\n?/g, '$$$\n')
      .replace(/(\\\[\s*\n?)|(\s*\\\]\n?)/g, '$$$\n')
      .replace(/(\\\(\s*)|(\s*\\\))/g, '$')
      .replace(/```/g,'')
    return convertedText
    
  } catch (error) {
    this.addErrorLog(error, "ChatGPTVision")
    throw error;
  }
}
  /**
   * @param {NSData} image 
   * @returns 
   */
  static async freeOCR(image){
    let res = await this.ChatGPTVision(image)
    MNUtil.stopHUD()
    return res
  }
  
  static moveComment(des){
    let focusNotes = MNNote.getFocusNotes()
    let commentIndex
    if (des.find) {
      let condition  = des.find
      MNUtil.undoGrouping(()=>{
        focusNotes.forEach(note=>{
          let indices = note.getCommentIndicesByCondition(condition)
          if (!indices.length) {
            MNUtil.showHUD("No match")
            return
          }
          if (indices.length && "to" in des) {
            switch (typeof des.to) {
              case "string":
                note.moveCommentByAction(indices[0],des.to)
                break;
              case "number":
                note.moveComment(indices[0], des.to)
                break
              default:
                break;
            }
            return
          }
        })
      })
      return
    }
    if (des.type && "to" in des) {
      let type = des.types ? des.type : [des.type]
      switch (typeof des.to) {
        case "string":
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(note=>{
                let index = note.comments.findIndex(comment=>type.includes(comment.type))
                if (index == -1) {
                  MNUtil.showHUD("No match")
                  return
                }
                note.moveCommentByAction(index,des.to)
            })
          })
          break;
        case "number":
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(note=>{
                let index = note.comments.findIndex(comment=>type.includes(comment.type))
                if (index == -1) {
                  MNUtil.showHUD("No match")
                  return
                }
                note.moveComment(index,des.to)
            })
          })
          break
        default:
          break;
      }
      return
    }
    commentIndex = des.index
    if (commentIndex === undefined) {
      MNUtil.showHUD("Invalid index!")
    }
    if ("to" in des) {
      switch (typeof des.to) {
        case "string":
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(note => {
              note.moveCommentByAction(commentIndex, des.to)
            })
          })
          break;
        case "number":
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(note => {
              note.moveComment(commentIndex, des.to)
            })
          })
          break
        default:
          break;
      }
    }
  
  }
  /**
   * 获取日期对象
   * 
   * 注意：虽然 MNUtil 也有 getDateObject() 方法，但本方法提供了更多的日期格式：
   * - now: 当前时间的本地化字符串
   * - tomorrow: 明天的日期
   * - yesterday: 昨天的日期
   * - year/month/day/hour/minute/second: 各个时间单位
   * 
   * 这些额外的格式在模板渲染时非常有用，所以保留此扩展实现
   * @returns {Object} 包含多种日期格式的对象
   */
  static getDateObject(){
    let dateObject = {
      now:new Date(Date.now()).toLocaleString(),
      tomorrow:new Date(Date.now()+86400000).toLocaleString(),
      yesterday:new Date(Date.now()-86400000).toLocaleString(),
      year:new Date().getFullYear(),
      month:new Date().getMonth()+1,
      day:new Date().getDate(),
      hour:new Date().getHours(),
      minute:new Date().getMinutes(),
      second:new Date().getSeconds()
    }
    return dateObject
  }
  /**
   * 
   * @param {MNNote} note 
   */
  static getNoteObject(note,config={},opt={first:true}) {
    try {
    if (!note) {
      return config
    }
      
    let noteConfig = config
    noteConfig.id = note.noteId
    if (opt.first) {
      noteConfig.notebook = {
        id:note.notebookId,
        name:MNUtil.getNoteBookById(note.notebookId).title,
      }
    }
    noteConfig.title = note.noteTitle
    noteConfig.url = note.noteURL
    noteConfig.excerptText = note.excerptText
    noteConfig.isMarkdownExcerpt = note.excerptTextMarkdown
    noteConfig.isImageExcerpt = !!note.excerptPic
    noteConfig.date = {
      create:note.createDate.toLocaleString(),
      modify:note.modifiedDate.toLocaleString(),
    }
    noteConfig.allText = note.allNoteText()
    noteConfig.tags = note.tags
    noteConfig.hashTags = note.tags.map(tag=> ("#"+tag)).join(" ")
    noteConfig.hasTag = note.tags.length > 0
    noteConfig.hasComment = note.comments.length > 0
    noteConfig.hasChild = note.childNotes.length > 0
    noteConfig.hasText = !!noteConfig.allText
    if (note.colorIndex !== undefined) {
      noteConfig.color = {}
      noteConfig.color.lightYellow = note.colorIndex === 0
      noteConfig.color.lightGreen = note.colorIndex === 1
      noteConfig.color.lightBlue = note.colorIndex === 2
      noteConfig.color.lightRed = note.colorIndex === 3
      noteConfig.color.yellow = note.colorIndex === 4
      noteConfig.color.green = note.colorIndex === 5
      noteConfig.color.blue = note.colorIndex === 6
      noteConfig.color.red = note.colorIndex === 7
      noteConfig.color.orange = note.colorIndex === 8
      noteConfig.color.darkGreen = note.colorIndex === 9
      noteConfig.color.darkBlue = note.colorIndex === 10
      noteConfig.color.deepRed = note.colorIndex === 11
      noteConfig.color.white = note.colorIndex === 12
      noteConfig.color.lightGray = note.colorIndex === 13
      noteConfig.color.darkGray = note.colorIndex === 14
      noteConfig.color.purple = note.colorIndex === 15
    }
    if (note.docMd5 && MNUtil.getDocById(note.docMd5)) {
      noteConfig.docName = MNUtil.getFileName(MNUtil.getDocById(note.docMd5).pathFile) 
    }
    noteConfig.hasDoc = !!noteConfig.docName
    if (note.childMindMap) {
      noteConfig.childMindMap = this.getNoteObject(note.childMindMap,{},{first:false})
    }
    noteConfig.inMainMindMap = !noteConfig.childMindMap
    noteConfig.inChildMindMap = !!noteConfig.childMindMap
    if ("parent" in opt && opt.parent && note.parentNote) {
      if (opt.parentLevel && opt.parentLevel > 0) {
        noteConfig.parent = this.getNoteObject(note.parentNote,{},{parentLevel:opt.parentLevel-1,parent:true,first:false})
      }else{
        noteConfig.parent = this.getNoteObject(note.parentNote,{},{first:false})
      }
    }
    noteConfig.hasParent = "parent" in noteConfig
    if ("child" in opt && opt.child && note.childNotes) {
      noteConfig.child = note.childNotes.map(note=>this.getNoteObject(note,{},{first:false}))
    }
    return noteConfig
    } catch (error) {
      this.addErrorLog(error, "getNoteObject")
      return undefined
    }
  }
  static htmlDev(content){
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>JSON Editor with Highlighting</title>
    <style>
        body{
            background-color: lightgray;
            font-size:1.1em;
        }
        .editor {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            font-family: monospace;
            white-space: pre-wrap;
            overflow: auto;
            outline: none; /* Removes the default focus outline */
        }
        .key {
            color: rgb(181, 0, 0);
            font-weight: bold;
        }
        .string {
            color: green;
        }
        .number {
            color: rgb(201, 77, 0);
        }
        .boolean {
            color: rgb(204, 0, 204);
        }
        .null {
            color: gray;
        }
    </style>
</head>
<body>

<div id="editor" class="editor" contenteditable>${content}</div>

<script>
  let isComposing = false;
function getCaretPosition(element) {
    const selection = window.getSelection();
    let caretOffset = 0;
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    }
    return caretOffset;
}

function setCaretPosition(element, offset) {
    const range = document.createRange();
    const selection = window.getSelection();
    let currentOffset = 0;
    let found = false;

    function traverseNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const nodeLength = node.textContent.length;
            if (currentOffset + nodeLength >= offset) {
                range.setStart(node, offset - currentOffset);
                range.collapse(true);
                found = true;
                return;
            } else {
                currentOffset += nodeLength;
            }
        } else {
            for (let i = 0; i < node.childNodes.length; i++) {
                traverseNodes(node.childNodes[i]);
                if (found) return;
            }
        }
    }

    traverseNodes(element);
    selection.removeAllRanges();
    selection.addRange(range);
}
    function updateContentWithoutBlur() {
        if (isComposing) return;
        const editor = document.getElementById('editor');
        const caretPosition = getCaretPosition(editor);
        const json = editor.innerText;
        editor.innerHTML = syntaxHighlight(json);
        setCaretPosition(editor, caretPosition);
    }
    function updateContent() {
        const editor = document.getElementById('editor');
        const json = editor.innerText;
        try {
            const parsedJson = JSON.parse(json);
            editor.innerHTML = syntaxHighlight(JSON.stringify(parsedJson, null, 4));
        } catch (e) {
            console.error("Invalid JSON:", e.message);
        }
        document.getElementById('editor').blur();
    }

    function syntaxHighlight(json) {
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?:\\s*:)?|\\b-?\\d+(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?\\b|\\btrue\\b|\\bfalse\\b|\\bnull\\b)/g, function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                    match = match.slice(0, -1) + '</span>:';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

  document.getElementById('editor').addEventListener('input', updateContentWithoutBlur);
  document.getElementById('editor').addEventListener('compositionstart', () => {
      isComposing = true;
  });

  document.getElementById('editor').addEventListener('compositionend', () => {
      isComposing = false;
      updateContentWithoutBlur();
  });
  updateContent();
</script>

</body>
</html>

`
  }
  static JShtml(content){
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>JSON Editor with Highlighting</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/github.min.css" rel="stylesheet">
    <style>
        body{
          margin: 0;
          background-color: lightgray;
          font-size:1.1em;
        }
        pre{
          margin: 0;
          padding: 0;
        }
        code{
            background-color: lightgray !important;
            height: calc(100vh - 30px);
            white-space: pre-wrap; /* 保留空格和换行符，并自动换行 */
            word-wrap: break-word; /* 针对长单词进行换行 */
        }
        .editor {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            font-family: monospace;
            white-space: pre-wrap;
            overflow: auto;
            outline: none; /* Removes the default focus outline */
        }
        .key {
            color: red;
        }
        .string {
            color: green;
        }
        .number {
            color: blue;
        }
    .hljs-literal {
        color: rgb(204, 0, 204);
    }
        .null {
            color: gray;
        }
    .hljs-property {
        color: #1870dc; /* 自定义内置类颜色 */
    }
    .hljs-function {
        color: #8f21d8; /* 自定义内置类颜色 */
    }
    .hljs-string {
        color: #429904; /* 自定义内置类颜色 */
    }
    .hljs-built_in {
        font-weight: bold;
        color: #dd6b00; /* 自定义内置类颜色 */
    }
    </style>
</head>
<body>
<pre><code class="javascript" id="code-block" contenteditable>${content}</code></pre>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/highlight.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/languages/javascript.min.js"></script>
<script>
hljs.registerLanguage('javascript', function(hljs) {
  var KEYWORDS = 'in if for while finally var new function do return void else break catch ' +
                 'instanceof with throw case default try this switch continue typeof delete ' +
                 'let yield const export super debugger as await static import from as async await';
  var LITERALS = 'true false null undefined NaN Infinity';
  var TYPES = 'Object Function Boolean Symbol MNUtil MNNote pluginDemoUtils pluginDemoConfig';

  return {
    keywords: {
      keyword: KEYWORDS,
      literal: LITERALS,
      built_in: TYPES
    },
    contains: [
      hljs.APOS_STRING_MODE,
      hljs.QUOTE_STRING_MODE,
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      hljs.C_NUMBER_MODE,
      {
        className: 'property',
        begin: '(?<=\\\\.)\\\\w+\\\\b(?!\\\\()'
      },
      {
        className: 'function',
        begin: '(?<=\\\\.)\\\\w+(?=\\\\()'
      }
    ]
  };
});
let isComposing = false;
function getCaretPosition(element) {
    const selection = window.getSelection();
    let caretOffset = 0;
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    }
    return caretOffset;
}

function setCaretPosition(element, offset) {
    const range = document.createRange();
    const selection = window.getSelection();
    let currentOffset = 0;
    let found = false;

    function traverseNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const nodeLength = node.textContent.length;
            if (currentOffset + nodeLength >= offset) {
                range.setStart(node, offset - currentOffset);
                range.collapse(true);
                found = true;
                return;
            } else {
                currentOffset += nodeLength;
            }
        } else {
            for (let i = 0; i < node.childNodes.length; i++) {
                traverseNodes(node.childNodes[i]);
                if (found) return;
            }
        }
    }

    traverseNodes(element);
    selection.removeAllRanges();
    selection.addRange(range);
}
    function updateContent() {
        const editor = document.getElementById('code-block');
        hljs.highlightElement(editor);
        editor.blur();
    }
    function updateContentWithoutBlur() {
      if (isComposing) return;
      const editor = document.getElementById('code-block');
      const caretPosition = getCaretPosition(editor);
      hljs.highlightElement(editor);
      setCaretPosition(editor, caretPosition);
    }
document.getElementById('code-block').addEventListener('input', updateContentWithoutBlur);
document.getElementById('code-block').addEventListener('compositionstart', () => {
    isComposing = true;
});

document.getElementById('code-block').addEventListener('compositionend', () => {
    isComposing = false;
    updateContentWithoutBlur();
});
    updateContent();
</script>

</body>
</html>
`
  }
  static jsonEditor(){
    return `
<!DOCTYPE HTML>
<html lang="en">
<head>
    <!-- when using the mode "code", it's important to specify charset utf-8 -->
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
    <title>Vditor</title>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <link href="jsoneditor.css" rel="stylesheet" type="text/css">
    <script src="jsoneditor.js"></script>
</head>
<style>
body {
    margin: 0;
    padding: 0;
    font-size: large;
    height: 100vh !important;
    min-height: 100vh !important;
}
</style>
<body>
    <div id="jsoneditor"></div>

    <script>
        // create the editor
        const container = document.getElementById("jsoneditor")
        const options = {}
        const editor = new JSONEditor(container, options)

        // set json
        const initialJson = {}
        editor.set(initialJson)

        // get json
        const updatedJson = editor.get()
        function updateContent(data) {
          let tem = decodeURIComponent(data)
          // MNUtil.copy(tem)
          editor.set(JSON.parse(tem))
        }
        function getContent() {
          let tem = JSON.stringify(editor.get(),null,2)
          return encodeURIComponent(tem)
        }
    </script>
</body>
</html>`
  }
  static html(content){
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>JSON Editor with Highlighting</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/styles/github.min.css" rel="stylesheet">
    <style>
        body{
          margin: 0;
          background-color: lightgray;
          font-size:1.1em;
        }
        pre{
          margin: 0;
          padding: 0;
        }
        code{
            padding: 0 !important;
            background-color: lightgray !important;
            height: 100vh;
            white-space: pre-wrap; /* 保留空格和换行符，并自动换行 */
            word-wrap: break-word; /* 针对长单词进行换行 */
        }
        .editor {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            font-family: monospace;
            white-space: pre-wrap;
            overflow: auto;
            outline: none; /* Removes the default focus outline */
        }
        .key {
            color: red;
        }
        .string {
            color: green;
        }
        .hljs-number {
            color: rgb(253, 99, 4);
        }
    .hljs-literal {
        color: rgb(204, 0, 204);
    }
        .null {
            color: gray;
        }
    .hljs-attr {
            color: rgb(181, 0, 0);
            font-weight: bold;
    }
    .hljs-function {
        color: #8f21d8; /* 自定义内置类颜色 */
    }
    .hljs-string {
        color: #429904; /* 自定义内置类颜色 */
    }
    .hljs-built_in {
        font-weight: bold;
        color: #dd6b00; /* 自定义内置类颜色 */
    }
    </style>
</head>
<body>
<pre><code class="json" id="code-block" contenteditable>${content}</code></pre>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/highlight.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.2.0/languages/javascript.min.js"></script>
<script>

let isComposing = false;
function getCaretPosition(element) {
    const selection = window.getSelection();
    let caretOffset = 0;
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
    }
    return caretOffset;
}

function setCaretPosition(element, offset) {
    const range = document.createRange();
    const selection = window.getSelection();
    let currentOffset = 0;
    let found = false;

    function traverseNodes(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const nodeLength = node.textContent.length;
            if (currentOffset + nodeLength >= offset) {
                range.setStart(node, offset - currentOffset);
                range.collapse(true);
                found = true;
                return;
            } else {
                currentOffset += nodeLength;
            }
        } else {
            for (let i = 0; i < node.childNodes.length; i++) {
                traverseNodes(node.childNodes[i]);
                if (found) return;
            }
        }
    }

    traverseNodes(element);
    selection.removeAllRanges();
    selection.addRange(range);
}
    function updateContent() {
        const editor = document.getElementById('code-block');
        const json = editor.innerText;

        try {
            const parsedJson = JSON.parse(json);
            editor.innerHTML = JSON.stringify(parsedJson, null, 4);
            hljs.highlightElement(editor);
        } catch (e) {
            console.error("Invalid JSON:", e.message);
        }
        editor.blur();
    }
    function updateContentWithoutBlur() {
      if (isComposing) return;
      const editor = document.getElementById('code-block');
      const caretPosition = getCaretPosition(editor);
      const json = editor.innerText.replace('”,','\",').replace('“,','\",');
      editor.innerHTML = json
      hljs.highlightElement(editor);
      setCaretPosition(editor, caretPosition);
    }
document.getElementById('code-block').addEventListener('input', updateContentWithoutBlur);
document.getElementById('code-block').addEventListener('compositionstart', () => {
    isComposing = true;
});

document.getElementById('code-block').addEventListener('compositionend', () => {
    isComposing = false;
    updateContentWithoutBlur();
});
    updateContent();
</script>

</body>
</html>
`
  }
  /**
   * count为true代表本次check会消耗一次免费额度（如果当天未订阅），如果为false则表示只要当天免费额度没用完，check就会返回true
   * 开启ignoreFree则代表本次check只会看是否订阅，不管是否还有免费额度
   * @returns {Boolean}
   */
  static checkSubscribe(count = true, msg = true,ignoreFree = false){
    // return true
    if (typeof subscriptionConfig !== 'undefined') {
      let res = subscriptionConfig.checkSubscribed(count,ignoreFree,msg)
      return res
    }else{
      if (msg) {
        MNUtil.showHUD("Please install 'MN Utils' first!")
      }
      return false
    }
  }
  static isSubscribed(msg = true){
    if (typeof subscriptionConfig !== 'undefined') {
      return subscriptionConfig.isSubscribed()
    }else{
      if (msg) {
        MNUtil.showHUD("Please install 'MN Utils' first!")
      }
      return false
    }
  }
  /**
   * 
   * @param {string} fullPath 
   * @returns {string}
   */
  static getExtensionFolder(fullPath) {
    return MNUtil.getFileFold(fullPath)  // 使用 MNUtil API 获取文件夹路径
  }
  static checkMNUtilsFolder(fullPath){
    let extensionFolder = this.getExtensionFolder(fullPath)
    let folderExists = NSFileManager.defaultManager().fileExistsAtPath(extensionFolder+"/marginnote.extension.mnutils/main.js")
    if (!folderExists) {
      MNUtil.showHUD("MN Toolbar: Please install 'MN Utils' first!")
    }
    return folderExists
  }
  /**
   * 
   * @param {MNNote} note 
   * @param {*} des 
   */
  static async focus(des){
    let targetNote = des.noteURL? MNNote.new(des.noteURL):MNNote.getFocusNote()
    if (!targetNote) {
      MNUtil.showHUD("No targetNote!")
      return
    }
    if (des.source) {
      switch (des.source) {
        case "parentNote":
          targetNote = targetNote.parentNote
          if (!targetNote) {
            MNUtil.showHUD("No parentNote!")
            return
          }
          break;
        default:
          break;
      }
    }
    if (!des.target) {
      MNUtil.showHUD("Missing param: target")
      return
    }
    targetNote = targetNote.realGroupNoteForTopicId()
    switch (des.target) {
        case "doc":
          await targetNote.focusInDocument()
          break;
        case "mindmap":
          if (targetNote.notebookId !== MNUtil.currentNotebookId) {
            if (des.forceToFocus) {
              MNUtil.openURL(targetNote.noteURL)
            }else{
              await targetNote.focusInFloatMindMap()
            }
          }else{
            await targetNote.focusInMindMap()
          }
          break;
        case "both":
          await targetNote.focusInDocument()
          if (targetNote.notebookId !== MNUtil.currentNotebookId) {
            await targetNote.focusInFloatMindMap()
          }else{
            await targetNote.focusInMindMap()
          }
          // await targetNote.focusInMindMap()
          break;
        case "floatMindmap":
          await targetNote.focusInFloatMindMap()
          break;
        default:
          MNUtil.showHUD("No valid value for target!")
          break;
      }
    }
  /**
   * 
   * @param {*} des 
   * @returns {Promise<MNNote|undefined>}
   */
  static async noteHighlight(des){
    let selection = MNUtil.currentSelection
    if (!selection.onSelection) {
      MNUtil.showHUD("No selection")
      return undefined
    }
    let OCRText = undefined
    if ("OCR" in des && des.OCR) {
      OCRText = await this.getTextOCR(selection.image)
    }
    let currentNote = MNNote.getFocusNote()
    let focusNote = MNNote.new(selection.docController.highlightFromSelection())
    focusNote = focusNote.realGroupNoteForTopicId()
    return new Promise((resolve, reject) => {
      MNUtil.undoGrouping(()=>{
        try {
        if ("color" in des && des.color >= 0) {
          let color = des.color
          focusNote.colorIndex = color
        }

        if ("fillPattern" in des && des.fillPattern >= 0) {
          let fillPattern = des.fillPattern
          focusNote.fillIndex = fillPattern
        }
        if (OCRText) {
          focusNote.excerptText = OCRText
          focusNote.excerptTextMarkdown = true
          focusNote.textFirst = true
        }else if ("textFirst" in des && des.textFirst) {
          focusNote.textFirst = des.textFirst
        }
        if ("asTitle" in des && des.asTitle) {
          focusNote.noteTitle = focusNote.excerptText
          focusNote.excerptText = ""
          focusNote.excerptTextMarkdown = false
        }else if ("title" in des) {
          focusNote.noteTitle = des.title
        }
        if ("tags" in des) {
          let tags = des.tags
          focusNote.appendTags(tags)
        }else if("tag" in des){
          let tag = des.tag
          MNUtil.showHUD("add tag: "+tag)
          focusNote.appendTags([tag])
        }
        if (des.mergeToPreviousNote && currentNote) {
            currentNote.merge(focusNote)
            focusNote.colorIndex = currentNote.colorIndex
            focusNote.fillIndex = currentNote.fillIndex
            if (currentNote.excerptText && (!currentNote.excerptPic || currentNote.textFirst) && focusNote.excerptText && (!focusNote.excerptPic || focusNote.textFirst)) {
              let mergedText = currentNote.excerptText+" "+focusNote.excerptText
              currentNote.excerptText = MNUtil.mergeWhitespace(mergedText)
              focusNote.excerptText = ""
            }
            resolve(currentNote)
        }else{
          if ("mainMindMap" in des && des.mainMindMap) {
            if (focusNote.parentNote) {
              focusNote.removeFromParent()
            }else{
              MNUtil.showHUD("Already in main mindmap")
            }
          }else if ("parentNote" in des) {
            let parentNote = MNNote.new(des.parentNote)
            if (parentNote) {
              parentNote = parentNote.realGroupNoteForTopicId()
            }
            if (parentNote.notebookId === focusNote.notebookId) {
              MNUtil.showHUD("move to "+parentNote.noteId)
              parentNote.addChild(focusNote)
            }else{
              MNUtil.showHUD("Not in same notebook")
            }
          }
        }
        resolve(focusNote)
        } catch (error) {
          pluginDemoUtils.addErrorLog(error, "noteHighlight")
          resolve(undefined)
        }
      })
    })
  }
  static insertSnippet(des){
    let target = des.target ?? "textview"
    let success = true
    switch (target) {
      case "textview":
        let textView = pluginDemoUtils.textView
        if (!textView || textView.hidden) {
          MNUtil.showHUD("No textView")
          success = false
          break;
        }
        let textContent = pluginDemoUtils.detectAndReplace(des.content)
        success = pluginDemoUtils.insertSnippetToTextView(textContent,textView)
        break;
      case "editor":
        let contents = [
          {
            type:"text",
            content:pluginDemoUtils.detectAndReplace(des.content)
          }
        ]
        MNUtil.postNotification("editorInsert", {contents:contents})
        break;
      default:
        break;
    }
    return success
  }
  static async moveNote(des){
    let focusNotes = MNNote.getFocusNotes()
    MNUtil.undoGrouping(()=>{
      if (des.mainMindMap) {
        focusNotes.map((note)=>{
          let realNote = note.realGroupNoteForTopicId()
          if (realNote.parentNote) {
            realNote.removeFromParent()
          }
        })
      }else if(des.noteURL){
        let parentNote = MNNote.new(des.noteURL)
        if (parentNote) {
          focusNotes.map((note)=>{
            if (parentNote.notebookId === note.notebookId) {
              parentNote.addChild(note)
            }
          })
        }
      }
    })
  }
  /**
   *
   * @param {UIView} view
   */
  static isDescendantOfCurrentWindow(view){
    return view.isDescendantOfView(MNUtil.currentWindow)
  }
  static toggleSidebar(des){
    if ("target" in des) {
      switch (des.target) {
        case "chatMode":
          if (typeof chatAIUtils === "undefined") {
            MNUtil.showHUD("Install MN ChatAI First")
            return
          }
          if (chatAIUtils.isMN3()) {
            MNUtil.showHUD("Only available in MN4")
            return
          }
          if (!chatAIUtils.sideOutputController) {
            try {
              chatAIUtils.sideOutputController = sideOutputController.new();
              MNUtil.toggleExtensionPanel()
              MNExtensionPanel.show()
              MNExtensionPanel.addSubview("chatAISideOutputView", chatAIUtils.sideOutputController.view)
              let panelView = MNExtensionPanel.view
              chatAIUtils.sideOutputController.view.hidden = false
              chatAIUtils.sideOutputController.view.frame = {x:0,y:0,width:panelView.frame.width,height:panelView.frame.height}
              chatAIUtils.sideOutputController.currentFrame = {x:0,y:0,width:panelView.frame.width,height:panelView.frame.height}
              // MNUtil.toggleExtensionPanel()
            } catch (error) {
              pluginDemoUtils.addErrorLog(error, "openSideBar")
            }
            chatAIUtils.sideOutputController.openChatView(false)
          }else{
            if (chatAIUtils.sideOutputController.view.hidden) {
              MNExtensionPanel.show("chatAISideOutputView")
              chatAIUtils.sideOutputController.openChatView(false)
            }else{
              MNUtil.toggleExtensionPanel()
            }
          }
          break;
        default:
          break;
      }
    }else{
      MNUtil.toggleExtensionPanel()
    }
  }
  static async setColor(des){
  try {
    let fillIndex = -1
    let colorIndex = des.color
    if ("fillPattern" in des) {
      fillIndex = des.fillPattern
    }
    if ("followAutoStyle" in des && des.followAutoStyle && (typeof autoUtils !== 'undefined')) {
      let focusNotes
      let selection = MNUtil.currentSelection
      if (selection.onSelection) {
        focusNotes = [MNNote.new(selection.docController.highlightFromSelection())]
      }else{
        focusNotes = MNNote.getFocusNotes()
      }
      if (!des.hideMessage) {
        MNUtil.showHUD("followAutoStyle")
      }
      MNUtil.undoGrouping(()=>{
        try {
          

        focusNotes.map(note=>{
          let fillIndex
          if (note.excerptPic) {
            fillIndex = autoUtils.getConfig("image")[colorIndex]
          }else{
            fillIndex = autoUtils.getConfig("text")[colorIndex]
          }
          this.setNoteColor(note,colorIndex,fillIndex)

        })
        } catch (error) {
          pluginDemoUtils.addErrorLog(error, "setColor")
        }
      })
      return
    }

    // MNUtil.copy(description+fillIndex)
    let focusNotes
    let selection = MNUtil.currentSelection
    if (selection.onSelection) {
      focusNotes = [MNNote.new(selection.docController.highlightFromSelection())]
    }else{
      focusNotes = MNNote.getFocusNotes()
    }
    // await MNUtil.delay(1)
    MNUtil.undoGrouping(()=>{
      focusNotes.map(note=>{
        this.setNoteColor(note,colorIndex,fillIndex)
          // let tem = {
          //   noteId:note.colorIndex}
          // // MNUtil.copy(note.realGroupNoteIdForTopicId())
          // // MNUtil.showHUD("123")
          // if (note.originNoteId) {
          //   // MNUtil.showHUD("message")
          //   let originNote = MNNote.new(note.originNoteId)
          //   tem.originNoteId = originNote.colorIndex
          //   this.setNoteColor(originNote,colorIndex,fillIndex)
          // }
          // tem.realGroupNoteId = note.realGroupNoteIdForTopicId()
          // MNUtil.copy(tem)
          // if (note.realGroupNoteIdForTopicId() && note.realGroupNoteIdForTopicId() !== note.noteId) {
          //   // MNUtil.showHUD("realGroupNoteIdForTopicId")
          //   let realGroupNote = note.realGroupNoteForTopicId()
          //   this.setNoteColor(realGroupNote,colorIndex,fillIndex)

          // }
      })
    })
  } catch (error) {
    pluginDemoUtils.addErrorLog(error, "setColor")
  }
  }
  static switchTitleOrExcerpt() {
    let focusNotes = MNNote.getFocusNotes()
    let success = true
    MNUtil.undoGrouping(()=>{
    try {
      for (const note of focusNotes) {
        let title = note.noteTitle ?? ""
        let text = note.excerptText ?? ""
        if (!title && !text) {
          let comments = note.comments
          if (comments.length > 0) {
            let firstComment = comments[0]
            switch (firstComment.type) {
              case "TextNote":
                note.noteTitle = firstComment.text
                note.removeCommentByIndex(0)
                break;
              case "LinkNote":
                note.noteTitle = firstComment.q_htext
                note.removeCommentByIndex(0)
                break;
              case "HtmlNote":
                note.noteTitle = firstComment.text
                note.removeCommentByIndex(0)
                break;
              default:
                MNUtil.showHUD("Unsupported comment type: "+firstComment.type)
                success = false
                break;
            }
          }
          return
        }
        // 只允许存在一个
          if ((title && text) && (title !== text)) {
            note.noteTitle = ""
            note.excerptText = title
            note.appendMarkdownComment(text)
          }else if (title || text) {
            // 去除划重点留下的 ****
            note.noteTitle = text.replace(/\*\*(.*?)\*\*/g, "$1")
            note.excerptText = title
          }else if (title == text) {
            // 如果摘录与标题相同，MN 只显示标题，此时我们必然想切换到摘录
            note.noteTitle = ""
          }
      }
    } catch (error) {
      this.addErrorLog(error, "switchTitleOrExcerpt")
      success = false
    }
    })
    return success
  }
  /**
   * 
   * @param {MNNote} note 
   * @param {number} colorIndex 
   * @param {number} fillIndex 
   */
  static setNoteColor(note,colorIndex,fillIndex){
    if (note.note.groupNoteId) {//有合并卡片
      let originNote = MNNote.new(note.note.groupNoteId)
      originNote.notes.forEach(n=>{
        n.colorIndex = colorIndex
        if (fillIndex !== -1) {
          n.fillIndex = fillIndex
        }
      })
    }else{
      note.notes.forEach(n=>{
        n.colorIndex = colorIndex
        if (fillIndex !== -1) {
          n.fillIndex = fillIndex
        }
      })
      // if (note.originNoteId) {
      //   let originNote = MNNote.new(note.originNoteId)
      //   originNote.notes.forEach(n=>{
      //     n.colorIndex = colorIndex
      //     if (fillIndex !== -1) {
      //       n.fillIndex = fillIndex
      //     }
      //   })
      //   // this.setNoteColor(originNote,colorIndex,fillIndex)
      // }
    }
  }
  /**
   * 
   * @param {UITextView} textView 
   */
  static getMindmapview(textView){
    let mindmapView
    if (textView.isDescendantOfView(MNUtil.mindmapView)) {
      mindmapView = MNUtil.mindmapView
      return mindmapView
    }else{
      try {
        let targetMindview = textView.superview.superview.superview.superview.superview
        let targetStudyview = targetMindview.superview.superview.superview
        if (targetStudyview === MNUtil.studyView) {
          mindmapView = targetMindview
          MNUtil.floatMindMapView = mindmapView
          return mindmapView
        }
        return undefined
      } catch (error) {
        return undefined
      }
    }
  }
  static checkExtendView(textView) {
    try {
      if (textView.superview.superview.superview.superview.superview.superview.superview.superview === MNUtil.readerController.view) {
        // MNUtil.showHUD("嵌入")
        return true
      }
      if (textView.superview.superview.superview.superview.superview.superview.superview.superview.superview === MNUtil.readerController.view) {
        // MNUtil.showHUD("折叠")
        return true
      }
      if (textView.superview.superview.superview.superview.superview.superview.superview.superview.superview.superview.superview.superview.superview === MNUtil.readerController.view) {
        // MNUtil.showHUD("页边")
        return true
      }
    } catch (error) {
      return false
    }
  }
  static isHexColor(str) {
    // 正则表达式匹配 3 位或 6 位的十六进制颜色代码
    const hexColorPattern = /^#([A-Fa-f0-9]{6})$/;
    return hexColorPattern.test(str);
  }
  static parseWinRect(winRect){
    return MNUtil.parseWinRect(winRect)
  }
  static getButtonColor(){
    if (!this.isSubscribed(false)) {
      return MNUtil.hexColorAlpha("#ffffff", 0.85)
    }
    // let color = MNUtil.app.defaultBookPageColor.hexStringValue
    // MNUtil.copy(color)
    let varColors = ["defaultBookPageColor","defaultHighlightBlendColor","defaultDisableColor","defaultTextColor","defaultNotebookColor","defaultTintColor","defaultTintColorForSelected","defaultTintColorForDarkBackground"]
    if (varColors.includes(pluginDemoConfig.buttonConfig.color)) {
      return MNUtil.app[pluginDemoConfig.buttonConfig.color].colorWithAlphaComponent(pluginDemoConfig.buttonConfig.alpha)
    }
    // if () {
      
    // }
    return MNUtil.hexColorAlpha(pluginDemoConfig.buttonConfig.color, pluginDemoConfig.buttonConfig.alpha)
  }
  static getOnlineImage(url,scale=3){
    MNUtil.showHUD("Downloading image")
    let imageData = NSData.dataWithContentsOfURL(MNUtil.genNSURL(url))
    if (imageData) {
      MNUtil.showHUD("Download success")
      return UIImage.imageWithDataScale(imageData,scale)
    }
    MNUtil.showHUD("Download failed")
    return undefined
  }
  static shortcut(name,des){
    let url = "shortcuts://run-shortcut?name="+encodeURIComponent(name)
    if (des && des.input) {
      url = url+"&input="+encodeURIComponent(des.input)
    }
    if (des && des.text) {
      let text = this.detectAndReplace(des.text)
      url = url+"&text="+encodeURIComponent(text)
    }
    MNUtil.openURL(url)
  }
  /**
   * 
   * @param {string} content 
   */
  static exportMD(content,target = "auto"){
    switch (target) {
      case "file":
        MNUtil.writeText(pluginDemoConfig.mainPath+"/export.md",content)
        MNUtil.saveFile(pluginDemoConfig.mainPath+"/export.md", ["public.md"])
        break;
      case "auto":
      case "clipboard":
        MNUtil.copy(content)
        break;
      default:
        break;
    }
  }
  static async export(des){
    try {

    let focusNote = MNNote.getFocusNote()
    let exportTarget = des.target ?? "auto"
    let exportSource = des.source ?? "noteDoc"
    switch (exportSource) {
      case "noteDoc":
        if (focusNote) {
          let noteDocPath = MNUtil.getDocById(focusNote.note.docMd5).fullPathFileName
          MNUtil.saveFile(noteDocPath, ["public.pdf"])
        }else{
          let docPath = MNUtil.currentDocController.document.fullPathFileName
          MNUtil.saveFile(docPath, ["public.pdf"])
        }
        break;
      case "noteMarkdown":
        let md = await this.getMDFromNote(focusNote)
        this.exportMD(md,exportTarget)
        break;
      case "noteMarkdownOCR":
        if (focusNote) {
          let md = this.mergeWhitespace(await this.getMDFromNote(focusNote,0,true))
          this.exportMD(md,exportTarget)
        }
        break;
      case "noteWithDecendentsMarkdown":
        if (focusNote) {
          let md = await this.getMDFromNote(focusNote)
          // MNUtil.copyJSON(focusNote.descendantNodes.treeIndex)
          let levels = focusNote.descendantNodes.treeIndex.map(ind=>ind.length)
          let descendantNotes = focusNote.descendantNodes.descendant
          let descendantsMarkdowns = await Promise.all(descendantNotes.map(async (note,index)=>{
              return this.getMDFromNote(note,levels[index])
            })
          )
          md = this.mergeWhitespace(md+"\n"+descendantsMarkdowns.join("\n\n"))
          this.exportMD(md,exportTarget)
        }
        break;
      case "currentDoc":
        let docPath = MNUtil.currentDocController.document.fullPathFileName
        MNUtil.saveFile(docPath, ["public.pdf"])
        break;
      default:
        break;
    }
      
  } catch (error) {
      pluginDemoUtils.addErrorLog(error, "export")
  }
  }
  /**
   * 
   * @param {MNNote} note 
   * @param {number} level 
   * @returns {Promise<string>}
   */
  static async getMDFromNote(note,level = 0,OCR_enabled = false){
    if (note) {
      note = note.realGroupNoteForTopicId()
    }else{
      return ""
    }
try {
  let title = (note.noteTitle && note.noteTitle.trim()) ? "# "+note.noteTitle.trim() : ""
  if (title.trim()) {
    title = title.split(";").filter(t=>{
      if (/{{.*}}/.test(t)) {
        return false
      }
      return true
    }).join(";")
  }
  let textFirst = note.textFirst
  let excerptText
  if (note.excerptPic && !textFirst) {
    if (OCR_enabled) {
      excerptText = await this.getTextOCR(MNUtil.getMediaByHash(note.excerptPic.paint))
    }else{
      excerptText = ""
    }
  }else{
    excerptText = note.excerptText ?? ""
  }
  if (note.comments.length) {
    let comments = note.comments
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      switch (comment.type) {
        case "TextNote":
          if (/^marginnote\dapp\:\/\//.test(comment.text)) {
            //do nothing
          }else{
            excerptText = excerptText+"\n"+comment.text
          }
          break;
        case "HtmlNote":
          excerptText = excerptText+"\n"+comment.text
          break
        case "LinkNote":
          if (OCR_enabled && comment.q_hpic  && comment.q_hpic.paint && !textFirst) {
            let imageData = MNUtil.getMediaByHash(comment.q_hpic.paint)
            let imageSize = UIImage.imageWithData(imageData).size
            if (imageSize.width === 1 && imageSize.height === 1) {
              if (comment.q_htext) {
                excerptText = excerptText+"\n"+comment.q_htext
              }
            }else{
              excerptText = excerptText+"\n"+await this.getTextOCR(imageData)
            }
          }else{
            excerptText = excerptText+"\n"+comment.q_htext
          }
          break
        case "PaintNote":
          if (OCR_enabled && comment.paint){
            excerptText = excerptText+"\n"+await this.getTextOCR(MNUtil.getMediaByHash(comment.paint))
          }
          break
        default:
          break;
      }
    }
  }
  excerptText = (excerptText && excerptText.trim()) ? this.highlightEqualsContentReverse(excerptText) : ""
  let content = title+"\n"+excerptText
  if (level) {
    content = content.replace(/(#+\s)/g, "#".repeat(level)+"\$1")
  }
  return content
}catch(error){
  this.addErrorLog(error, "getMDFromNote")
  return ""
}
  }
  static highlightEqualsContentReverse(markdown) {
      // 使用正则表达式匹配==xxx==的内容并替换为<mark>xxx</mark>
      return markdown.replace(/<mark>(.+?)<\/mark>/g, '==\$1==');
  }
  static constrain(value, min, max) {
    return MNUtil.constrain(value, min, max)
  }
/**
 * 
 * @param {UIButton} button 
 * @returns {CGRect}
 */
static getButtonFrame(button){
  let buttonFrame = button.convertRectToView(button.frame, MNUtil.studyView)
  return buttonFrame
}
  static getTempelateNames(item){
    if (!pluginDemoConfig.checkCouldSave(item)) {
      return undefined
    }
    switch (item) {
      case "ocr":
        return [
            "🔨 OCR to clipboard",
            "🔨 OCR as chat mode reference",
            "🔨 OCR with menu",
            "🔨 OCR with onFinish"
          ]
      case "search":
        return [
            "🔨 search with menu",
            "🔨 search in Baidu"
          ]
      case "chatglm":
        return [
            "🔨 chatAI with menu",
            "🔨 chatAI in prompt",
            "🔨 chatAI in custom prompt"
          ]
      case "copy":
        return [
            "🔨 smart copy",
            "🔨 copy with menu",
            "🔨 copy markdown link"
          ]
      case "color1":
      case "color2":
      case "color3":
      case "color4":
      case "color5":
      case "color6":
      case "color7":
      case "color8":
      case "color9":
      case "color10":
      case "color11":
      case "color12":
      case "color13":
      case "color14":
      case "color15":
        return [
          "🔨 setColor default",
          "🔨 with fillpattern: both",
          "🔨 with fillpattern: fill",
          "🔨 with fillpattern: border",
          "🔨 with followAutoStyle"
        ]
      default:
        break;
    }
    return [
      "🔨 empty action",
      "🔨 empty action with double click",
      "🔨 empty action with finish action",
      "🔨 insert snippet",
      "🔨 insert snippet with menu",
      "🔨 add note index",
      "🔨 toggle mindmap",
      "🔨 copy with menu",
      "🔨 copy markdown link",
      "🔨 toggle markdown",
      "🔨 toggle textFirst",
      "🔨 chatAI with menu",
      "🔨 search with menu",
      "🔨 split note to mindmap",
      "🔨 import mindmap from markdown file",
      "🔨 import mindmap from clipboard",
      "🔨 OCR with menu",
      "🔨 OCR to clipboard",
      "🔨 OCR as chat mode reference",
      "🔨 toggle full doc and tab bar",
      "🔨 merge text of merged notes",
      "🔨 create & move to main mindmap",
      "🔨 create & move as child note",
      "🔨 create & set branch style",
      "🔨 move note to main mindmap",
      "🔨 menu with actions",
      "🔨 focus in float window",
      "🔨 focus note",
      "🔨 user confirm",
      "🔨 user select",
      "🔨 show message",
      "🔨 trigger button"
    ]
  }
  static extractJSONFromMarkdown(markdown) {
    // 使用正则表达式匹配被```JSON```包裹的内容
    const regex = /```JSON([\s\S]*?)```/g;
    const matches = regex.exec(markdown);
    
    // 提取匹配结果中的JSON字符串部分，并去掉多余的空格和换行符
    if (matches && matches[1]) {
        const jsonString = matches[1].trim();
        return JSON.parse(jsonString);
    } else {
        return undefined;
    }
  }
  static addTags(des){
    let focusNotes = MNNote.getFocusNotes()
    if (des.tags) {
      MNUtil.undoGrouping(()=>{
        focusNotes.forEach(note=>{
          let tags = des.tags.map(t=>{
            return this.detectAndReplace(t,undefined,note)
          })
          note.appendTags(tags)
        })
      })
    }else{
      MNUtil.undoGrouping(()=>{
        focusNotes.forEach(note=>{
          let replacedText = this.detectAndReplace(des.tag,undefined,note)
          note.appendTags([replacedText])
        })
      })
    }
  }
  static removeTags(des){
    let focusNotes = MNNote.getFocusNotes()
    // MNUtil.showHUD("removeTags")
    if (des.tags) {
      MNUtil.undoGrouping(()=>{
        focusNotes.forEach(note=>{
          note.removeTags(des.tags)
        })
      })
    }else{
      MNUtil.undoGrouping(()=>{
        focusNotes.forEach(note=>{
          note.removeTags([des.tag])
        })
      })
    }
  }
  static extractUrls(text) {
  // 定义匹配URL的正则表达式
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
  // 使用正则表达式匹配所有的URL
  const urls = text.match(urlRegex);
  // 如果没有匹配的URL则返回空数组
  return urls ? urls : [];
}
  /**
   * 
   * @param {MNNote} note 
   */
  static noteHasWebURL(note){
    let content = note.allNoteText()
    return this.extractUrls(content)
  }
  static openWebURL(des){
    let focusNote = MNNote.getFocusNote()
    if (focusNote) {
      let urls = this.noteHasWebURL(focusNote)
      if (urls.length) {
        MNUtil.postNotification("openInBrowser", {url:urls[0]})
        return true
      }
    }
    let selection = MNUtil.currentSelection
    if (selection.onSelection) {
      let selectionText = selection.text
      let urls = this.extractUrls(selectionText)
      if (urls.length) {
        MNUtil.postNotification("openInBrowser", {url:urls[0]})
        return true
      }
    }
    MNUtil.showHUD("No web url found")
    return false
  }
  static async render(template,opt={}){
    try {
      if (opt.noteId) {
        return await this.getNoteVarInfo(opt.noteId,template,opt.userInput)
      }else{
        return await this.getTextVarInfo(template,opt.userInput)
      }
    } catch (error) {
      this.addErrorLog(error, "render")
      throw error;
    }
  }
  static async getNoteVarInfo(noteid,text,userInput) {
    try {
    let replaceText= text
    let note = MNNote.new(noteid)
    let noteConfig = this.getNoteObject(note)
    let config = this.getVarInfo(text,userInput,{note:noteConfig})
    let prompt = MNUtil.render(replaceText, config)
    return prompt
      
    } catch (error) {
      this.addErrorLog(error, "getNoteVarInfo")
      throw error;
    }
  }

static async getTextVarInfo(text,userInput) {
  try {
  let replaceText= text
  let noteConfig = this.getNoteObject(MNNote.getFocusNote())
  let config = this.getVarInfo(text,userInput,{note:noteConfig})
  let output = mustache.render(replaceText, config)
  return output
  // MNUtil.copy(output)
  // return this.replacVar(replaceText, config)
    } catch (error) {
    this.addErrorLog(error, "getTextVarInfo")
    throw error;
    // this.addErrorLog(error, "getTextVarInfo")
  }

}
  /**
   * Displays a confirmation dialog with a main title and a subtitle.
   * 
   * This method shows a confirmation dialog with the specified main title and subtitle.
   * It returns a promise that resolves with the button index of the button clicked by the user.
   * 
   * @param {string} mainTitle - The main title of the confirmation dialog.
   * @param {string} subTitle - The subtitle of the confirmation dialog.
   * @returns {Promise<number>} A promise that resolves with the button index of the button clicked by the user.
   */
  static async confirm(mainTitle,subTitle){
    return MNUtil.confirm(mainTitle, subTitle, ["Cancel", "Confirm"])
  }
  /**
   * 延迟执行
   * @param {number} seconds - 延迟的秒数
   * @returns {Promise<void>}
   */
  static async delay(seconds) {
    return MNUtil.delay(seconds)
  }
}

class pluginDemoConfig {
  // 构造器方法，用于初始化新创建的对象
  constructor(name) {
    this.name = name;
  }
  // static defaultAction
  static isFirst = true
  static cloudStore
  static mainPath
  static action = []
  static dynamicAction = []
  static showEditorOnNoteEdit = false
  static defalutButtonConfig = {color:"#ffffff",alpha:0.85}
  static defaultWindowState = {
    sideMode:"",//固定工具栏下贴边模式
    splitMode:false,//固定工具栏下是否跟随分割线
    open:false,//固定工具栏是否默认常驻
    dynamicButton:9,//跟随模式下的工具栏显示的按钮数量,
    dynamicOrder:false,
    dynamicDirection:"vertical",//跟随模式下的工具栏默认方向
    frame:{x:0,y:0,width:40,height:415},
    direction:"vertical",//默认工具栏方向
  }
  //非自定义动作的key
  static builtinActionKeys = [
    "setting",
    "copy",
    "searchInEudic",
    "switchTitleorExcerpt",
    "copyAsMarkdownLink",
    "search",
    "bigbang",
    "snipaste",
    "chatglm",
    "edit",
    "ocr",
    "execute",
    "pasteAsTitle",
    "clearFormat",
    "color0",
    "color1",
    "color2",
    "color3",
    "color4",
    "color5",
    "color6",
    "color7",
    "color8",
    "color9",
    "color10",
    "color11",
    "color12",
    "color13",
    "color14",
    "color15",
    "sidebar",]
  static allPopupButtons = [
  "copy",
  "copyOCR",
  "toggleTitle",
  "toggleCopyMode",
  "toggleGroupMode",
  "insertAI",
  "aiFromNote",
  "moveNoteTo",
  "linkNoteTo",
  "noteHighlight",
  "blankHighlight",
  "mergeHighlight",
  "delHighlight",
  "sendHighlight",
  "foldHighlight",
  "textHighlight",
  "paintHighlight",
  "sourceHighlight",
  "setTitleHighlight",
  "setCommentHighlight",
  "setEmphasisHighlight",
  "sourceHighlightOfNote",
  "highStyleColor0",
  "highStyleColor1",
  "highStyleColor2",
  "highStyleColor3",
  "highlightType1",
  "highlightType2",
  "highlightType3",
  "highlightType4",
  "highlightShortcut1",
  "highlightShortcut2",
  "highlightShortcut3",
  "highlightShortcut4",
  "highlightShortcut5",
  "highlightShortcut6",
  "highlightShortcut7",
  "highlightShortcut8",
  "editHashtags",
  "deleteNote",
  "commentNote",
  "pasteToNote",
  "mergeIntoNote",
  "focusCurrentNote",
  "draftCurrentNote",
  "collapseBlank",
  "collapseBlankOnPage",
  "cancelBlankOnPage",
  "setBlankLayer",
  "insertBlank",
  "insertTranslation",
  "addToTOC",
  "addToReview",
  "addSelToReivew",
  "speechText",
  "speechHighlight",
  "goWiki",
  "goPalette",
  "goWikiNote",
  "goDictionary",
  "goToMindMap",
  "newGroupChild",
  "splitBook",
  "pasteOnPage",
  "textboxOnPage",
  "fullTextOnPage",
  "imageboxOnPage",
  "cameraOnPage",
  "moreOperations",
  "dragDrop"
]
  static defaultPopupReplaceConfig = {
    noteHighlight:{enabled:false,target:"",name:"noteHighlight"},
    textHighlight:{enabled:false,target:"",name:"textHighlight"},
    addToReview:{enabled:false,target:"",name:"addToReview"},
    goPalette:{enabled:false,target:"",name:"goPalette"},
    editHashtags:{enabled:false,target:"",name:"editHashtags"},
    toggleTitle:{enabled:false,target:"",name:"toggleTitle"},
    moveNoteTo:{enabled:false,target:"",name:"moveNoteTo"},
    toggleCopyMode:{enabled:false,target:"",name:"toggleCopyMode"},
    insertAI:{enabled:false,target:"",name:"insertAI"},
    aiFromNote:{enabled:false,target:"",name:"aiFromNote"},
    pasteToNote:{enabled:false,target:"",name:"pasteToNote"},
    linkNoteTo:{enabled:false,target:"",name:"linkNoteTo"},
    goWikiNote:{enabled:false,target:"",name:"goWikiNote"},
    focusCurrentNote:{enabled:false,target:"",name:"focusCurrentNote"},
    delHighlight:{enabled:false,target:"",name:"delHighlight"},
    moreOperations:{enabled:false,target:"",name:"moreOperations"},
    blankHighlight:{enabled:false,target:"",name:"blankHighlight"},
    mergeHighlight:{enabled:false,target:"",name:"mergeHighlight"},
    highStyleColor0:{enabled:false,target:"",name:"highStyleColor0"},
    highStyleColor1:{enabled:false,target:"",name:"highStyleColor1"},
    highStyleColor2:{enabled:false,target:"",name:"highStyleColor2"},
    highStyleColor3:{enabled:false,target:"",name:"highStyleColor3"},
    goWiki:{enabled:false,target:"",name:"goWiki"},
    speechHighlight:{enabled:false,target:"",name:"speechHighlight"},
    sendHighlight:{enabled:false,target:"",name:"sendHighlight"},
    sourceHighlight:{enabled:false,target:"",name:"sourceHighlight"},
    commentNote:{enabled:false,target:"",name:"commentNote"},
    deleteNote:{enabled:false,target:"",name:"deleteNote"},
    copy:{enabled:false,target:"",name:"copy"},
    insertBlank:{enabled:false,target:"",name:"insertBlank"},
    collapseBlank:{enabled:false,target:"",name:"collapseBlank"},
    collapseBlankOnPage:{enabled:false,target:"",name:"collapseBlankOnPage"},
    cancelBlankOnPage:{enabled:false,target:"",name:"cancelBlankOnPage"},
    copyOCR:{enabled:false,target:"",name:"copyOCR"},
    foldHighlight:{enabled:false,target:"",name:"foldHighlight"},
    addToTOC:{enabled:false,target:"",name:"addToTOC"},
    addSelToReivew:{enabled:false,target:"",name:"addSelToReview"},
    highlightType1:{enabled:false,target:"",name:"highlightType1"},
    highlightType2:{enabled:false,target:"",name:"highlightType2"},
    highlightType3:{enabled:false,target:"",name:"highlightType3"},
    highlightType4:{enabled:false,target:"",name:"highlightType4"},
    highlightShortcut1:{enabled:false,target:"",name:"highlightShortcut1"},
    highlightShortcut2:{enabled:false,target:"",name:"highlightShortcut2"},
    highlightShortcut3:{enabled:false,target:"",name:"highlightShortcut3"},
    highlightShortcut4:{enabled:false,target:"",name:"highlightShortcut4"},
    highlightShortcut5:{enabled:false,target:"",name:"highlightShortcut5"},
    highlightShortcut6:{enabled:false,target:"",name:"highlightShortcut6"},
    highlightShortcut7:{enabled:false,target:"",name:"highlightShortcut7"},
    highlightShortcut8:{enabled:false,target:"",name:"highlightShortcut8"},
    speechText:{enabled:false,target:"",name:"speechText"},
    goDictionary:{enabled:false,target:"",name:"goDictionary"},
    goToMindMap:{enabled:false,target:"",name:"goToMindMap"},
    setTitleHighlight:{enabled:false,target:"",name:"setTitleHighlight"},
    setCommentHighlight:{enabled:false,target:"",name:"setCommentHighlight"},
    setEmphasisHighlight:{enabled:false,target:"",name:"setEmphasisHighlight"},
    mergeIntoNote:{enabled:false,target:"",name:"mergeIntoNote"},
    newGroupChild:{enabled:false,target:"",name:"newGroupChild"},
    toggleGroupMode:{enabled:false,target:"",name:"toggleGroupMode"},
    draftCurrentNote:{enabled:false,target:"",name:"draftCurrentNote"},
    insertTranslation:{enabled:false,target:"",name:"insertTranslation"},
    splitBook:{enabled:false,target:"",name:"splitBook"},
    pasteOnPage:{enabled:false,target:"",name:"pasteOnPage"},
    textboxOnPage:{enabled:false,target:"",name:"textboxOnPage"},
    fullTextOnPage:{enabled:false,target:"",name:"fullTextOnPage"},
    imageboxOnPage:{enabled:false,target:"",name:"imageboxOnPage"},
    cameraOnPage:{enabled:false,target:"",name:"cameraOnPage"},
    setBlankLayer:{enabled:false,target:"",name:"setBlankLayer"},
    sourceHighlightOfNote:{enabled:false,target:"",name:"sourceHighlightOfNote"},
    paintHighlight:{enabled:false,target:"",name:"paintHighlight"},
    dragDrop:{enabled:false,target:"",name:"dragDrop"},
  }
  static defalutImageScale = {
    "color0":2.4,
    "color1":2.4,
    "color2":2.4,
    "color3":2.4,
    "color4":2.4,
    "color5":2.4,
    "color6":2.4,
    "color7":2.4,
    "color8":2.4,
    "color9":2.4,
    "color10":2.4,
    "color11":2.4,
    "color12":2.4,
    "color13":2.4,
    "color14":2.4,
    "color15":2.4,
    "undo":2.2,
    "redo":2.2
  }
  static imageConfigs = {}
  static dynamicImageConfigs = {}
  static imageScale = {}
  static dynamicImageScale = {}
  static defaultSyncConfig = {
    iCloudSync: false,
    lastSyncTime: 0,
    lastModifyTime: 0
  }
  /**
   * @type {{iCloudSync:boolean,lastSyncTime:number,lastModifyTime:number}}
   */
  static syncConfig = {}
  /**
   * @type {NSUbiquitousKeyValueStore}
   */
  static cloudStore
  // static defaultConfig = {showEditorWhenEditingNote:false}
  static init(mainPath){
    // this.config = this.getByDefault("MNToolbar_config",this.defaultConfig)
    try {
    this.mainPath = mainPath
    this.dynamic = this.getByDefault("MNToolbar_dynamic",false)
    this.addonLogos = this.getByDefault("MNToolbar_addonLogos",{})
    this.windowState = this.getByDefault("MNToolbar_windowState",this.defaultWindowState)
    this.buttonNumber = this.getDefaultActionKeys().length
    //数组格式,存的是每个action的key
    this.action = this.getByDefault("MNToolbar_action", this.getDefaultActionKeys())
    this.action = this.action.map(a=>{
      if (a === "excute") {
        return "execute"
      }
      return a
    })
    this.dynamicAction = this.getByDefault("MNToolbar_dynamicAction", this.action)
    if (this.dynamicAction.length === 0) {
      this.dynamicAction = this.action
    }

    this.actions = this.getByDefault("MNToolbar_actionConfig", this.getActions())
    if ("excute" in this.actions) {
      let action = this.actions["excute"]
      action.image = "execute"
      this.actions["execute"] = action
      delete this.actions["excute"]
    }
    if ("execute" in this.actions) {
      if (this.actions["execute"].image === "excute") {
        this.actions["execute"].image = "execute"
      }
    }
    this.buttonConfig = this.getByDefault("MNToolbar_buttonConfig", this.defalutButtonConfig)
    // MNUtil.copyJSON(this.buttonConfig)
    this.highlightColor = UIColor.blendedColor(
      UIColor.colorWithHexString("#2c4d81").colorWithAlphaComponent(0.8),
      pluginDemoUtils.app.defaultTextColor,
      0.8
    );
      let editorConfig = this.getDescriptionByName("edit")
      if ("showOnNoteEdit" in editorConfig) {
        this.showEditorOnNoteEdit = editorConfig.showOnNoteEdit
      }
      
    } catch (error) {
      pluginDemoUtils.addErrorLog(error, "init")
    }
    this.buttonImageFolder = MNUtil.dbFolder+"/buttonImage"
    NSFileManager.defaultManager().createDirectoryAtPathAttributes(this.buttonImageFolder, undefined)
    // this.popupConfig = this.getByDefault("MNToolbar_popupConfig", this.defaultPopupReplaceConfig)
    // this.popupConfig = this.defaultPopupReplaceConfig
    this.popupConfig = this.getByDefault("MNToolbar_popupConfig", this.defaultPopupReplaceConfig)
    this.syncConfig = this.getByDefault("MNToolbar_syncConfig", this.defaultSyncConfig)
    this.initImage()
    this.checkCloudStore(false)
  }
  static checkCloudStore(notification = true){//用于替代initCloudStore
    if (!this.cloudStore) {
      this.cloudStore = NSUbiquitousKeyValueStore.defaultStore()
      if (notification) {
        MNUtil.postNotification("NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI", {}) 
      }
    }
  }
  static initCloudStore(){
    this.cloudStore = NSUbiquitousKeyValueStore.defaultStore()
    MNUtil.postNotification("NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI", {})
    // this.readCloudConfig(false)
  }
  static get iCloudSync(){//同时考虑订阅情况
    if (pluginDemoUtils.checkSubscribe(false,false,true)) {
      return this.syncConfig.iCloudSync
    }
    return false
  }
  static hasPopup(){
    let popupConfig = this.popupConfig
    let keys = Object.keys(this.popupConfig)
    let hasReplace = keys.some((key)=>{
    if (popupConfig[key].enabled && popupConfig[key].target) {
      return true
    }
    return false
  })
  return hasReplace
  }
  static getPopupConfig(key){
    if (this.popupConfig[key] !== undefined) {
      return this.popupConfig[key]
    }else{
      return this.defaultPopupReplaceConfig[key]
    }
  }
  /**
   * 深度比较两个配置对象是否相等
   * 
   * 注意：这不是通用的 deepEqual 实现，而是专门为配置同步设计的：
   * - 忽略 lastModifyTime、lastSyncTime、iCloudSync 字段（同步时间相关）
   * - iOS 端忽略 windowState 字段（窗口状态不同步）
   * 
   * 因此保留此自定义实现，不使用 MNUtil.deepEqual()
   * @param {Object} obj1 - 第一个对象
   * @param {Object} obj2 - 第二个对象
   * @returns {boolean} 是否相等
   */
  static deepEqual(obj1, obj2) {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || obj1 === null ||
        typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (!keys2.includes(key)) {
            return false;
        }
        if (["lastModifyTime","lastSyncTime","iCloudSync"].includes(key)) {
          continue
        }
        if (MNUtil.isIOS() && ["windowState"].includes(key)) {
          //iOS端不参与"MNToolbar_windowState"的云同步,因此比较时忽略该参数
          continue
        }
        if (!this.deepEqual(obj1[key], obj2[key])) {
          return false;
        }
    }
    return true;
  }
  static getAllConfig(){
    if (this.dynamicAction.length === 0) {
      this.dynamicAction = this.action
    }
    let config = {
      windowState: this.windowState,
      syncConfig: this.syncConfig,
      dynamic: this.dynamic,
      addonLogos: this.addonLogos,
      actionKeys: this.action,
      dynamicActionKeys: this.dynamicAction,
      actions: this.actions,
      buttonConfig:this.buttonConfig,
      popupConfig:this.popupConfig
    }
    return config
  }
  static importConfig(config){
    try {
    if (!MNUtil.isIOS()) { //iOS端不参与"MNToolbar_windowState"的云同步
      this.windowState = config.windowState
    }
    let icloudSync = this.syncConfig.iCloudSync
    this.syncConfig = config.syncConfig
    this.dynamic = config.dynamic
    this.addonLogos = config.addonLogos
    this.action = config.actionKeys
    this.actions = config.actions
    this.buttonConfig = config.buttonConfig
    this.popupConfig = config.popupConfig
    if (config.dynamicActionKeys && config.dynamicActionKeys.length > 0) {
      this.dynamicAction = config.dynamicActionKeys
    }else{
      this.dynamicAction = this.action
    }
    this.syncConfig.iCloudSync = icloudSync
    return true
    } catch (error) {
      pluginDemoUtils.addErrorLog(error, "importConfig")
      return false
    }
  }
  static getLocalLatestTime(){
    let lastSyncTime = this.syncConfig.lastSyncTime ?? 0
    let lastModifyTime = this.syncConfig.lastModifyTime ?? 0
    return Math.max(lastSyncTime,lastModifyTime)
  }
  static async readCloudConfig(msg = true,alert = false,force = false){
    try {
    if (force) {
      this.checkCloudStore(false)
      let cloudConfig = this.cloudStore.objectForKey("MNToolbar_totalConfig")
      this.importConfig(cloudConfig)
      this.syncConfig.lastSyncTime = Date.now()
      this.save(undefined,undefined,false)
      if (msg) {
        MNUtil.showHUD("Import from iCloud")
      }
      return true
    }
    if(!this.iCloudSync){
      return false
    }
      this.checkCloudStore(false)
      // this.cloudStore.removeObjectForKey("MNToolbar_totalConfig")
      let cloudConfig = this.cloudStore.objectForKey("MNToolbar_totalConfig")
      if (cloudConfig && cloudConfig.syncConfig) {
        let same = this.deepEqual(cloudConfig, this.getAllConfig())
        if (same && !force) {
          if (msg) {
            MNUtil.showHUD("No change")
          }
          return false
        }
        let localLatestTime = this.getLocalLatestTime()
        let localOldestTime = Math.min(this.syncConfig.lastSyncTime,this.syncConfig.lastModifyTime)
        let cloudLatestTime = Math.max(cloudConfig.syncConfig.lastSyncTime,cloudConfig.syncConfig.lastModifyTime)
        let cloudOldestTime = Math.min(cloudConfig.syncConfig.lastSyncTime,cloudConfig.syncConfig.lastModifyTime)
        if (localLatestTime < cloudOldestTime || force) {
          // MNUtil.copy("Import from iCloud")
          if (alert) {
            let confirm = await MNUtil.confirm("MN Toolbar: Import from iCloud?","MN Toolbar: 是否导入iCloud配置？")
            if (!confirm) {
              return false
            }
          }
          if (msg) {
            MNUtil.showHUD("Import from iCloud")
          }
          this.importConfig(cloudConfig)
          this.syncConfig.lastSyncTime = Date.now()
          this.save(undefined,undefined,false)
          return true
        }
        if (this.syncConfig.lastModifyTime > (cloudConfig.syncConfig.lastModifyTime+1000) ) {
          if (alert) {
            let confirm = await MNUtil.confirm("MN Toolbar: Uploading to iCloud?","MN Toolbar: 是否上传配置到iCloud？")
            if (!confirm) {
              return false
            }
          }
          this.writeCloudConfig()
          return false
        }
        let userSelect = await MNUtil.userSelect("MN Toolbar\nConflict config, import or export?","配置冲突，请选择操作",["📥 Import / 导入","📤 Export / 导出"])
        switch (userSelect) {
          case 0:
            MNUtil.showHUD("User Cancel")
            return false
          case 1:
            let success = this.importConfig(cloudConfig)
            if (success) {
              return true
            }else{
              MNUtil.showHUD("Invalid config in iCloud!")
              return false
            }
          case 2:
            this.writeCloudConfig(msg,true)
            return false
          default:
            return false
        }
      }else{
        let confirm = await MNUtil.confirm("MN Toolbar: Empty config in iCloud, uploading?","MN Toolbar: iCloud配置为空,是否上传？")
        if (!confirm) {
          return false
        }
        this.writeCloudConfig(msg)
        if (msg) {
          MNUtil.showHUD("No config in iCloud, uploading...")
        }
        return false
      }
    } catch (error) {
      pluginDemoUtils.addErrorLog(error, "readCloudConfig")
      return false
    }
  }
  static writeCloudConfig(msg = true,force = false){
  try {
    if (force) {//force下不检查订阅(由更上层完成)
      this.checkCloudStore()
      this.syncConfig.lastSyncTime = Date.now()
      this.syncConfig.lastModifyTime = Date.now()
      let cloudConfig = this.cloudStore.objectForKey("MNToolbar_totalConfig")
      let config = this.getAllConfig()
      if (MNUtil.isIOS() && cloudConfig && cloudConfig.windowState) {
        //iOS端不参与"MNToolbar_windowState"的云同步
        config.windowState = cloudConfig.windowState
      }
      if (msg) {
        MNUtil.showHUD("Uploading...")
      }
      this.cloudStore.setObjectForKey(config,"MNToolbar_totalConfig")
      return true
    }
    if(!this.iCloudSync){
      return false
    }
    let iCloudSync = this.syncConfig.iCloudSync
    this.checkCloudStore()
    let cloudConfig = this.cloudStore.objectForKey("MNToolbar_totalConfig")
    if (cloudConfig && cloudConfig.syncConfig) {
      let same = this.deepEqual(cloudConfig, this.getAllConfig())
      if (same) {
        if (msg) {
          MNUtil.showHUD("No change")
        }
        return false
      }
      let localLatestTime = this.getLocalLatestTime()
      let cloudOldestTime = Math.min(cloudConfig.syncConfig.lastSyncTime,cloudConfig.syncConfig.lastModifyTime)
      if (localLatestTime < cloudOldestTime) {
        let localTime = Date.parse(localLatestTime).toLocaleString()
        let cloudTime = Date.parse(cloudOldestTime).toLocaleString()
        MNUtil.showHUD("Conflict config: loca_"+localTime+", cloud_"+cloudTime)
        return false
      }
    }
    this.syncConfig.lastSyncTime = Date.now()
    // this.syncConfig.lastModifyTime = Date.now()
    if (this.dynamicAction.length === 0) {
      this.dynamicAction = this.action
    }
    let config = this.getAllConfig()
    if (MNUtil.isIOS() && cloudConfig && cloudConfig.windowState) {
      //iOS端不参与"MNToolbar_windowState"的云同步
      config.windowState = cloudConfig.windowState
    }
    // MNUtil.copyJSON(config)
    if (msg) {
      MNUtil.showHUD("Uploading...")
    }
    config.syncConfig.iCloudSync = iCloudSync
    this.cloudStore.setObjectForKey(config,"MNToolbar_totalConfig")
    this.syncConfig.lastSyncTime = Date.now()
    this.save("MNToolbar_syncConfig",undefined,false)
    return true
  } catch (error) {
    pluginDemoUtils.addErrorLog(error, "writeCloudConfig")
    return false
  }
  }
  static initImage(){
    try {
    let keys = this.getDefaultActionKeys()
    this.imageScale = pluginDemoConfig.getByDefault("MNToolbar_imageScale",{})
    // MNUtil.copyJSON(this.imageScale)
    // let images = keys.map(key=>this.mainPath+"/"+this.getAction(key).image+".png")
    // MNUtil.copyJSON(images)
    keys.forEach((key)=>{
      let tem = this.imageScale[key]
      if (tem && MNUtil.isfileExists(this.buttonImageFolder+"/"+tem.path)) {
        let scale = tem.scale ?? 2
        this.imageConfigs[key] = MNUtil.getImage(this.buttonImageFolder+"/"+tem.path,scale)
      }else{
        let scale = 2
        if (key in pluginDemoConfig.defalutImageScale) {
          scale = pluginDemoConfig.defalutImageScale[key]
        }
        this.imageConfigs[key] = MNUtil.getImage(this.mainPath+"/"+this.getAction(key).image+".png",scale)
      }
    })
    this.curveImage = MNUtil.getImage(this.mainPath+"/curve.png",2)
    this.runImage = MNUtil.getImage(this.mainPath+"/run.png",2.6)
    this.templateImage = MNUtil.getImage(this.mainPath+"/template.png",2.2)
    // MNUtil.copyJSON(this.imageConfigs)
      } catch (error) {
      pluginDemoUtils.addErrorLog(error, "initImage")
    }
  }
  // static setImageByURL(action,url,refresh = false) {
  //   this.imageConfigs[action] = pluginDemoUtils.getOnlineImage(url)
  //   if (refresh) {
  //     MNUtil.postNotification("refreshToolbarButton", {})
  //   }
  // }
  static setImageByURL(action,url,refresh = false,scale = 3) {
    let md5 = MNUtil.MD5(url)
    // let imagePath = this.mainPath+"/"+this.getAction(action).image+".png"
    // MNUtil.getImage(this.mainPath+"/"+this.getAction(key).image+".png",scale)
    let localPath = this.buttonImageFolder+"/"+md5+".png"
    this.imageScale[action] = {path:md5+".png",scale:scale}
    this.save("MNToolbar_imageScale")
    let image = undefined
    let imageData = undefined
    if (MNUtil.isfileExists(localPath)) {
      image = MNUtil.getImage(localPath,scale)
      // image.pngData().writeToFileAtomically(imagePath, false)
      this.imageConfigs[action] = image
      if (refresh) {
        MNUtil.postNotification("refreshToolbarButton", {})
      }
      return
    }
    if (/^marginnote\dapp:\/\/note\//.test(url)) {
      let note = MNNote.new(url)
      imageData = MNNote.getImageFromNote(note)
      if (imageData) {
        image = UIImage.imageWithDataScale(imageData, scale)
        // imageData.writeToFileAtomically(imagePath, false)
        imageData.writeToFileAtomically(localPath, false)
        this.imageConfigs[action] = image
        if (refresh) {
          MNUtil.postNotification("refreshToolbarButton", {})
        }
      }
      return
    }
    if (/^https?:\/\//.test(url)) {
      image = pluginDemoUtils.getOnlineImage(url,scale)
      this.imageConfigs[action] = image
      imageData = image.pngData()
      // imageData.writeToFileAtomically(imagePath, false)
      imageData.writeToFileAtomically(localPath, false)
      if (refresh) {
        MNUtil.postNotification("refreshToolbarButton", {})
      }
      return
    }
    // }
    if (refresh) {
      MNUtil.postNotification("refreshToolbarButton", {})
    }
  }
  /**
   * 
   * @param {string} action 
   * @param {UIImage} image 
   * @param {boolean} refresh 
   * @param {number} scale 
   * @returns 
   */
  static setButtonImage(action,image,refresh = false,scale = 3) {
  try {
    let size = image.size
    if (size.width > 500 || size.height > 500) {
      MNUtil.showHUD("Image size is too large")
      return
    }

    let md5 = MNUtil.MD5(image.pngData().base64Encoding())
    // let imagePath = this.mainPath+"/"+this.getAction(action).image+".png"
    // MNUtil.getImage(this.mainPath+"/"+this.getAction(key).image+".png",scale)
    let localPath = this.buttonImageFolder+"/"+md5+".png"
    this.imageScale[action] = {path:md5+".png",scale:1}
    this.save("MNToolbar_imageScale")
    if (MNUtil.isfileExists(localPath)) {
      this.imageConfigs[action] = image
      if (refresh) {
        MNUtil.postNotification("refreshToolbarButton", {})
      }
      return
    }else{
      this.imageConfigs[action] = image
      image.pngData().writeToFileAtomically(localPath, false)
      if (refresh) {
        MNUtil.postNotification("refreshToolbarButton", {})
      }
    }
    // }
    if (refresh) {
      MNUtil.postNotification("refreshToolbarButton", {})
    }
  } catch (error) {
    pluginDemoUtils.addErrorLog(error, "setButtonImage")
  }
  }
  /**
   * 只是返回数组,代表所有按钮的顺序
   * @param {boolean} dynamic
   * @returns {string[]}
   */
  static getAllActions(dynamic = false){
    if (dynamic) {
      let absentKeys = this.getDefaultActionKeys().filter(key=>!this.dynamicAction.includes(key))
      let allActions = this.dynamicAction.concat(absentKeys)
      // MNUtil.copyJSON(allActions)
      return allActions
    }else{
      let absentKeys = this.getDefaultActionKeys().filter(key=>!this.action.includes(key))
      let allActions = this.action.concat(absentKeys)
      // MNUtil.copyJSON(allActions)
      return allActions
    }
  }
  static getDesByButtonName(targetButtonName){
    let allActions = this.action.concat(this.getDefaultActionKeys().slice(this.action.length))
    let allButtonNames = allActions.map(action=>this.getAction(action).name)
    let buttonIndex = allButtonNames.indexOf(targetButtonName)
    if (buttonIndex === -1) {
      MNUtil.showHUD("Button not found: "	+ targetButtonName)
      return undefined
    }
    let action = allActions[buttonIndex]
    let actionDes = pluginDemoConfig.getDescriptionByName(action)
    return actionDes
  
  }
  static getWindowState(key){
    //用户已有配置可能不包含某些新的key，用这个方法做兼容性处理
    if (this.windowState[key] !== undefined) {
      return this.windowState[key]
    }else{
      return this.defaultWindowState[key]
    }
  }
  static direction(dynamic = false){
    if (dynamic) {
      return this.getWindowState("dynamicDirection")
    }else{
      return this.getWindowState("direction")
    }
  }
  static horizontal(dynamic = false){
    if (dynamic) {
      return this.getWindowState("dynamicDirection") === "horizontal"
    }else{
      return this.getWindowState("direction") === "horizontal"
    }
  }
  static vertical(dynamic = false){
    if (dynamic) {
      return this.getWindowState("dynamicDirection") === "vertical"
    }else{
      return this.getWindowState("direction") === "vertical"
    }
  }
  static toggleToolbarDirection(source){
    if (!pluginDemoUtils.checkSubscribe(true)) {
      return
    }
    switch (source) {
      case "fixed":
        if (pluginDemoConfig.getWindowState("direction") === "vertical") {
          pluginDemoConfig.windowState.direction = "horizontal"
          pluginDemoConfig.save("MNToolbar_windowState")
          MNUtil.showHUD("Set fixed direction to horizontal")

        }else{
          pluginDemoConfig.windowState.direction = "vertical"
          pluginDemoConfig.save("MNToolbar_windowState")
          MNUtil.showHUD("Set fixed direction to vertical")
        }
        break;
      case "dynamic":
        if (pluginDemoConfig.getWindowState("dynamicDirection") === "vertical") {
          pluginDemoConfig.windowState.dynamicDirection = "horizontal"
          pluginDemoConfig.save("MNToolbar_windowState")
          MNUtil.showHUD("Set dynamic direction to horizontal")
        }else{
          pluginDemoConfig.windowState.dynamicDirection = "vertical"
          pluginDemoConfig.save("MNToolbar_windowState")
          MNUtil.showHUD("Set dynamic direction to vertical")
        }
        break;
      default:
        break;
    }
    MNUtil.postNotification("refreshToolbarButton",{})
  }
  /**
   * 
   * @param {MbBookNote} note
   */
  static expandesConfig(note,config,orderedKeys=undefined,exclude=undefined) {
    let mnnote = MNNote.new(note)
    let keys
    if (orderedKeys) {
      keys = orderedKeys
    }else{
      keys = Object.keys(config)
    }
    keys.forEach((key)=>{
      let subConfig = config[key]
      if (typeof subConfig === "object") {
        let child = pluginDemoUtils.createChildNote(note,key)
        this.expandesConfig(child, subConfig,undefined,exclude)
      }else{
        if (exclude) {
          if (key !== exclude) {
            pluginDemoUtils.createChildNote(note,key,config[key])
          }
        }else{
          pluginDemoUtils.createChildNote(note,key,config[key])
        }
      }
    })
  }
  static checkLogoStatus(addon){
  // try {
    if (this.addonLogos && (addon in this.addonLogos)) {
      return this.addonLogos[addon]
    }else{
      return true
    }
  // } catch (error) {
  //   pluginDemoUtils.addErrorLog(error, "checkLogoStatus")
  //   return true
  // }
  }
static template(action) {
  let config = {action:action}
  switch (action) {
    case "cloneAndMerge":
      config.target = pluginDemoUtils.version.version+"app://note/xxxx"
      break
    case "link":
      config.target = pluginDemoUtils.version.version+"app://note/xxxx"
      config.type = "Both"
      break
    case "clearContent":
      config.target = "title"
      break
    case "setContent":
      config.target = "title"//excerptText,comment
      config.content = "test"
      break
    case "addComment":
      config.content = "test"
      break
    case "removeComment":
      config.index = 1//0表示全部，设一个特别大的值表示最后一个
      break
    case "copy":
      config.target = "title"
      break
    case "showInFloatWindow":
      config.target = pluginDemoUtils.version+"app://note/xxxx"
      break
    case "addChildNote":
      config.title = "title"
      config.content = "{{clipboardText}}"
      break;
    default:
      break;
  }
  return JSON.stringify(config,null,2)
}
static getAction(actionKey){
  let action = {}
  if (actionKey in this.actions) {
    action = this.actions[actionKey]
    if (!MNUtil.isValidJSON(action.description)) {//兼容旧版本的description问题
      action.description = this.getActions()[actionKey].description
    }
    return action
  }
  return this.getActions()[actionKey]
}

static getActions() {
  return {
    "copy":{name:"Copy",image:"copyExcerptPic",description:"{}"},
    "searchInEudic":{name:"Search in Eudic",image:"searchInEudic",description:"{}"},
    "switchTitleorExcerpt":{name:"Switch title",image:"switchTitleorExcerpt",description:"{}"},
    "copyAsMarkdownLink":{name:"Copy md link",image:"copyAsMarkdownLink",description:"{}"},
    "search":{name:"Search",image:"search",description:"{}"},
    "bigbang":{name:"Bigbang",image:"bigbang",description:"{}"},
    "snipaste":{name:"Snipaste",image:"snipaste",description:"{}"},
    "chatglm":{name:"ChatAI",image:"ai",description:"{}"},
    "setting":{name:"Setting",image:"setting",description:"{}"},
    "pasteAsTitle":{name:"Paste As Title",image:"pasteAsTitle",description:JSON.stringify({"action": "setContent","target": "title","content": "{{clipboardText}}"},null,2)},
    "clearFormat":{name:"Clear Format",image:"clearFormat",description:"{}"},
    "color0":{name:"Set Color 1",image:"color0",description:JSON.stringify({fillPattern:-1},null,2)},
    "color1":{name:"Set Color 2",image:"color1",description:JSON.stringify({fillPattern:-1},null,2)},
    "color2":{name:"Set Color 3",image:"color2",description:JSON.stringify({fillPattern:-1},null,2)},
    "color3":{name:"Set Color 4",image:"color3",description:JSON.stringify({fillPattern:-1},null,2)},
    "color4":{name:"Set Color 5",image:"color4",description:JSON.stringify({fillPattern:-1},null,2)},
    "color5":{name:"Set Color 6",image:"color5",description:JSON.stringify({fillPattern:-1},null,2)},
    "color6":{name:"Set Color 7",image:"color6",description:JSON.stringify({fillPattern:-1},null,2)},
    "color7":{name:"Set Color 8",image:"color7",description:JSON.stringify({fillPattern:-1},null,2)},
    "color8":{name:"Set Color 9",image:"color8",description:JSON.stringify({fillPattern:-1},null,2)},
    "color9":{name:"Set Color 10",image:"color9",description:JSON.stringify({fillPattern:-1},null,2)},
    "color10":{name:"Set Color 11",image:"color10",description:JSON.stringify({fillPattern:-1},null,2)},
    "color11":{name:"Set Color 12",image:"color11",description:JSON.stringify({fillPattern:-1},null,2)},
    "color12":{name:"Set Color 13",image:"color12",description:JSON.stringify({fillPattern:-1},null,2)},
    "color13":{name:"Set Color 14",image:"color13",description:JSON.stringify({fillPattern:-1},null,2)},
    "color14":{name:"Set Color 15",image:"color14",description:JSON.stringify({fillPattern:-1},null,2)},
    "color15":{name:"Set Color 16",image:"color15",description:JSON.stringify({fillPattern:-1},null,2)},
    "custom1":{name:"Custom 1",image:"custom1",description: this.template("cloneAndMerge")},
    "custom2":{name:"Custom 2",image:"custom2",description: this.template("link")},
    "custom3":{name:"Custom 3",image:"custom3",description: this.template("clearContent")},
    "custom4":{name:"Custom 4",image:"custom4",description: this.template("copy")},
    "custom5":{name:"Custom 5",image:"custom5",description: this.template("addChildNote")},
    "custom6":{name:"Custom 6",image:"custom6",description: this.template("showInFloatWindow")},
    "custom7":{name:"Custom 7",image:"custom7",description: this.template("setContent")},
    "custom8":{name:"Custom 8",image:"custom8",description: this.template("addComment")},
    "custom9":{name:"Custom 9",image:"custom9",description: this.template("removeComment")},
    "custom10":{name:"Custom 10",image:"custom10",description: this.template("cloneAndMerge")},
    "custom11":{name:"Custom 11",image:"custom11",description: this.template("cloneAndMerge")},
    "custom12":{name:"Custom 12",image:"custom12",description: this.template("link")},
    "custom13":{name:"Custom 13",image:"custom13",description: this.template("clearContent")},
    "custom14":{name:"Custom 14",image:"custom14",description: this.template("copy")},
    "custom15":{name:"Custom 15",image:"custom15",description: this.template("addChildNote")},
    "custom16":{name:"Custom 16",image:"custom16",description: this.template("showInFloatWindow")},
    "custom17":{name:"Custom 17",image:"custom17",description: this.template("setContent")},
    "custom18":{name:"Custom 18",image:"custom18",description: this.template("addComment")},
    "custom19":{name:"Custom 19",image:"custom19",description: this.template("removeComment")},
    "ocr":{name:"ocr",image:"ocr",description:JSON.stringify({target:"comment",source:"default"})},
    "edit":{name:"edit",image:"edit",description:JSON.stringify({showOnNoteEdit:false})},
    "timer":{name:"timer",image:"timer",description:JSON.stringify({target:"menu"})},
    "execute":{name:"execute",image:"execute",description:"MNUtil.showHUD('Hello world')"},
    "sidebar":{name:"sidebar",image:"sidebar",description:"{}"},
    "undo":{name:"undo",image:"undo",description:"{}"},
    "redo":{name:"redo",image:"redo",description:"{}"},
  }
}
static execute(){


}
static getDefaultActionKeys() {
  let actions = this.getActions()
  // MNUtil.copyJSON(actions)
  // MNUtil.copyJSON(Object.keys(actions))
  return Object.keys(actions)
}
static save(key = undefined,value = undefined,upload = true) {
  // MNUtil.showHUD("save")
  if(key === undefined){
    let defaults = NSUserDefaults.standardUserDefaults()
    defaults.setObjectForKey(this.windowState,"MNToolbar_windowState")
    defaults.setObjectForKey(this.dynamic,"MNToolbar_dynamic")
    defaults.setObjectForKey(this.action,"MNToolbar_action")
    defaults.setObjectForKey(this.dynamicAction,"MNToolbar_dynamicAction")
    defaults.setObjectForKey(this.actions,"MNToolbar_actionConfig")
    defaults.setObjectForKey(this.addonLogos,"MNToolbar_addonLogos")
    defaults.setObjectForKey(this.buttonConfig,"MNToolbar_buttonConfig")
    defaults.setObjectForKey(this.popupConfig,"MNToolbar_popupConfig")
    defaults.setObjectForKey(this.imageScale,"MNToolbar_imageScale")
    defaults.setObjectForKey(this.syncConfig,"MNToolbar_syncConfig")
    this.syncConfig.lastModifyTime = Date.now()
    if (upload && this.iCloudSync) {
      this.writeCloudConfig(false)
    }
    return
  }
  if (value) {
    NSUserDefaults.standardUserDefaults().setObjectForKey(value,key)
    this.syncConfig.lastModifyTime = Date.now()
    if (upload && this.iCloudSync) {
      this.writeCloudConfig(false)
    }
  }else{
    // showHUD(key)
    switch (key) {
      case "MNToolbar_windowState":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.windowState,key)
        if (MNUtil.isIOS()) { //iOS端不参与"MNToolbar_windowState"的云同步
          return
        }
        break;
      case "MNToolbar_dynamic":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.dynamic,key)
        break;
      case "MNToolbar_dynamicAction":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.dynamicAction,key)
        break;
      case "MNToolbar_action":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.action,key)
        break;
      case "MNToolbar_actionConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.actions,key)
        break;
      case "MNToolbar_addonLogos":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.addonLogos,key)
        break;
      case "MNToolbar_buttonConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.buttonConfig,key)
        break;
      case "MNToolbar_popupConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.popupConfig,key)
        break;
      case "MNToolbar_imageScale":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.imageScale,key)
        break;
      case "MNToolbar_syncConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.syncConfig,key)
        break;
      default:
        pluginDemoUtils.showHUD("Not supported")
        break;
    }
    this.syncConfig.lastModifyTime = Date.now()
    if (upload && this.iCloudSync) {
      this.writeCloudConfig(false)
    }
  }
  NSUserDefaults.standardUserDefaults().synchronize()
}

static get(key) {
  return NSUserDefaults.standardUserDefaults().objectForKey(key)
}

static getByDefault(key,defaultValue) {
  let value = NSUserDefaults.standardUserDefaults().objectForKey(key)
  if (value === undefined) {
    NSUserDefaults.standardUserDefaults().setObjectForKey(defaultValue,key)
    return defaultValue
  }
  return value
}

static remove(key) {
  NSUserDefaults.standardUserDefaults().removeObjectForKey(key)
}
static reset(target){
  switch (target) {
    case "config":
      this.actions = this.getActions()
      this.save("MNToolbar_actionConfig")
      break;
    case "order":
      this.action = this.getDefaultActionKeys()
      this.save("MNToolbar_action")
      break;  
    case "dynamicOrder":
      this.dynamicAction = this.getDefaultActionKeys()
      this.save("MNToolbar_dynamicAction")
      break;
    default:
      break;
  }
}
static getDescriptionByIndex(index){
  let actionName = pluginDemoConfig.action[index]
  if (actionName in pluginDemoConfig.actions) {
    return JSON.parse(pluginDemoConfig.actions[actionName].description)
  }else{
    return JSON.parse(pluginDemoConfig.getActions()[actionName].description)
  }
}
static getExecuteCode(){
  let actionName = "execute"
  if (actionName in pluginDemoConfig.actions) {
    return pluginDemoConfig.actions[actionName].description
  }else{
    return pluginDemoConfig.getActions()[actionName].description
  }
}
static getDescriptionByName(actionName){
  let des
  if (actionName in pluginDemoConfig.actions) {
    des = pluginDemoConfig.actions[actionName].description
  }else{
    des = pluginDemoConfig.getActions()[actionName].description
  }
  if (MNUtil.isValidJSON(des)) {
    return JSON.parse(des)
  }
  if (actionName === "pasteAsTitle") {
    return {
      "action": "paste",
      "target": "title",
      "content": "{{clipboardText}}"
    }
  }
  return {}
}
  static checkCouldSave(actionName){
    if (actionName.includes("custom")) {
      return true
    }
    if (actionName.includes("color")) {
      return true
    }
    let whiteNamelist = ["timer","search","copy","chatglm","ocr","edit","searchInEudic","pasteAsTitle","sidebar"]
    if (whiteNamelist.includes(actionName)) {
      return true
    }
    MNUtil.showHUD("Only available for Custom Action!")
    return false
  }

}


class pluginDemoSandbox{
  static async execute(code){
    'use strict';
    if (!pluginDemoUtils.checkSubscribe(true)) {
      return
    }
    try {
      eval(code)
      // MNUtil.studyView.bringSubviewToFront(MNUtil.mindmapView)
      // MNUtil.notebookController.view.hidden = true
      // MNUtil.mindmapView.setZoomScaleAnimated(10.0,true)
      // MNUtil.mindmapView.zoomScale = 0.1;
      // MNUtil.mindmapView.hidden = true
      // MNUtil.showHUD("message"+MNUtil.mindmapView.minimumZoomScale)
      // MNUtil.copyJSON(getAllProperties(MNUtil.mindmapView))
    } catch (error) {
      pluginDemoUtils.addErrorLog(error, "executeInSandbox",code)
    }
  }
}