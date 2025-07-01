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
 * let frame = taskFrame.gen(10, 20, 100, 50)
 * button.frame = frame
 * 
 * // 场景2：调整已存在按钮的位置
 * taskFrame.setLoc(button, 100, 200)  // 移动到 (100, 200)
 * 
 * // 场景3：响应式调整大小
 * let screenWidth = UIScreen.mainScreen.bounds.width
 * taskFrame.setWidth(button, screenWidth - 20)  // 宽度适应屏幕
 * 
 * // 场景4：动画效果 - 按钮向右滑动
 * for (let i = 0; i < 10; i++) {
 *   taskFrame.moveX(button, 5)  // 每次向右移动 5 像素
 *   await MNUtil.delay(0.1)  // 延迟 0.1 秒
 * }
 * 
 * // 场景5：只想改变部分属性
 * // 只改变 x 坐标和宽度，y 和高度保持不变
 * taskFrame.set(button, 50, undefined, 200, undefined)
 * ```
 */
class taskFrame{
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
   * let frame = taskFrame.gen(10, 20, 100, 50)
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
   * taskFrame.set(button, 100, undefined, undefined, undefined)
   * 
   * // 只修改位置，不改变大小
   * taskFrame.set(button, 50, 80, undefined, undefined)
   * 
   * // 只修改大小，不改变位置
   * taskFrame.set(button, undefined, undefined, 200, 60)
   * 
   * // 修改所有属性
   * taskFrame.set(button, 10, 20, 100, 50)
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
   * taskFrame.sameFrame(frame1, frame2)  // true - 完全相同
   * taskFrame.sameFrame(frame1, frame3)  // false - height 不同
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
   * taskFrame.setX(button, 0)
   * 
   * // 将按钮移动到距离左边 20 像素的位置
   * taskFrame.setX(button, 20)
   * 
   * // 居中对齐示例
   * let screenWidth = UIScreen.mainScreen.bounds.width
   * let buttonWidth = button.frame.width
   * taskFrame.setX(button, (screenWidth - buttonWidth) / 2)
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
   * taskFrame.setY(button, 0)
   * 
   * // 将按钮移动到距离顶部 50 像素的位置
   * taskFrame.setY(button, 50)
   * 
   * // 垂直居中示例
   * let screenHeight = UIScreen.mainScreen.bounds.height
   * let buttonHeight = button.frame.height
   * taskFrame.setY(button, (screenHeight - buttonHeight) / 2)
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
   * taskFrame.setLoc(button, 100, 200)
   * 
   * // 移动到屏幕左上角
   * taskFrame.setLoc(button, 0, 0)
   * 
   * // 根据其他元素定位
   * let label = getLabel()
   * // 将按钮放在标签下方 10 像素处，左对齐
   * taskFrame.setLoc(button, label.frame.x, label.frame.y + label.frame.height + 10)
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
   * taskFrame.setSize(button, 100, 44)  // iOS 标准按钮高度是 44
   * 
   * // 设置为正方形
   * taskFrame.setSize(imageView, 80, 80)
   * 
   * // 根据内容动态调整
   * let textWidth = calculateTextWidth(button.title)
   * taskFrame.setSize(button, textWidth + 20, 44)  // 加 20 像素边距
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
   * taskFrame.setWidth(button, 120)
   * 
   * // 适配屏幕宽度（留出边距）
   * let screenWidth = UIScreen.mainScreen.bounds.width
   * taskFrame.setWidth(textField, screenWidth - 40)  // 左右各留 20 像素
   * 
   * // 根据父视图调整
   * let parentWidth = button.superview.frame.width
   * taskFrame.setWidth(button, parentWidth * 0.8)  // 占父视图 80% 宽度
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
   * taskFrame.setHeight(button, 44)  // iOS 标准按钮高度
   * 
   * // 展开/收起动画
   * let isExpanded = false
   * function toggleExpand() {
   *   isExpanded = !isExpanded
   *   taskFrame.setHeight(contentView, isExpanded ? 200 : 50)
   * }
   * 
   * // 根据内容自适应高度
   * let contentHeight = calculateContentHeight()
   * taskFrame.setHeight(scrollView, Math.min(contentHeight, 300))  // 最大 300
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
   * taskFrame.moveX(button, 20)
   * 
   * // 向左移动 30 像素
   * taskFrame.moveX(button, -30)
   * 
   * // 简单的滑动动画
   * async function slideRight() {
   *   for (let i = 0; i < 10; i++) {
   *     taskFrame.moveX(button, 5)  // 每次移动 5 像素
   *     await MNUtil.delay(0.05)  // 延迟 50 毫秒
   *   }
   * }
   * 
   * // 响应手势拖动
   * function onPanGesture(gesture) {
   *   let translation = gesture.translationInView(view)
   *   taskFrame.moveX(dragView, translation.x)
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
   * taskFrame.moveY(button, 30)
   * 
   * // 向上移动 50 像素
   * taskFrame.moveY(button, -50)
   * 
   * // 弹跳动画效果
   * async function bounce() {
   *   // 向上弹起
   *   for (let i = 0; i < 10; i++) {
   *     taskFrame.moveY(button, -3)
   *     await MNUtil.delay(0.02)
   *   }
   *   // 落下
   *   for (let i = 0; i < 10; i++) {
   *     taskFrame.moveY(button, 3)
   *     await MNUtil.delay(0.02)
   *   }
   * }
   * 
   * // 下拉效果
   * function onPullDown(distance) {
   *   if (distance > 0 && distance < 100) {
   *     taskFrame.moveY(refreshView, distance * 0.5)  // 阻尼效果
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
 * taskUtils.someMethod()      getAllProperties(obj)
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
 * 五、为什么不放在 taskUtils 中？
 * 
 * 1. 这不是插件的核心业务逻辑
 * 2. 主要用于开发时的调试
 * 3. 可能在任何地方使用，不仅限于 taskUtils
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
 * 二、为什么 taskUtils 全是静态方法？
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
 * 四、在 MN Task 项目中的应用
 * 
 * ✅ 好的设计 - 工具类用静态方法
 * taskUtils.smartCopy()      // 直接使用
 * taskUtils.getTextOCR()     // 不需要 new
 * taskConfig.save()          // 全局只有一份配置
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
 * 🎯 总结：在 MN Task 项目中使用静态方法是因为：
 * 1. 工具性质：这些类都是工具集合，不是具体对象
 * 2. 无状态：不需要保存每个实例的数据
 * 3. 使用方便：直接调用，不需要 new
 * 4. 性能更好：不需要创建对象，节省内存
 * 
 * 就像你不需要“制造一把锤子”才能敲钉子，你只需要“使用锤子这个工具”就行了！
 */
class taskUtils {
  // 注意：这个类不需要 constructor，因为所有方法都是静态的
  // 我们永远不会使用 new taskUtils()，而是直接使用 taskUtils.methodName()
  
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
   * 三、在 taskUtils 中的应用
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
   * taskUtils.isSubscribe = true;  // 在任何地方都能访问
   * 
   * 2. 📇 数据共享
   * taskUtils.errorLog.push(error);  // 所有错误都收集到一个地方
   * 
   * 3. 🛡️ 保持单例
   * taskUtils.mainPath  // 全局只有一个主路径
   * 
   * 五、实际例子
   * 
   * // 错误日志收集器
   * taskUtils.errorLog = [];  // 初始化为空数组
   * 
   * // 在任何地方添加错误
   * taskUtils.errorLog.push({
   *   time: Date.now(),
   *   error: "Something went wrong",
   *   location: "smartCopy"
   * });
   * 
   * // 在任何地方查看所有错误
   * console.log("总共有 " + taskUtils.errorLog.length + " 个错误");
   * 
   * 💡 总结：
   * - 静态变量 = 类的共享数据
   * - 适合存储全局状态、配置、缓存
   * - 在 MN Task 中用于管理插件的全局信息
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
   * taskUtils.init = function(mainPath) {
   *   this.errorLog = [this.version];  // 初始化错误日志，第一项是版本号
   * }
   * 
   * // 在任何地方记录错误
   * try {
   *   // ... 一些可能出错的代码
   * } catch (error) {
   *   taskUtils.addErrorLog(error, "smartCopy");
   * }
   * 
   * // 查看所有错误
   * if (taskUtils.errorLog.length > 1) {
   *   MNUtil.copyJSON(taskUtils.errorLog);  // 复制所有错误到剪贴板
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
                    "mindmapTask",
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
   * taskUtils.init(self.path)
   * 
   * // 之后就可以使用这些全局变量
   * console.log(taskUtils.version)  // 查看版本信息
   * console.log(taskUtils.mainPath) // 查看插件路径
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
   * taskUtils.refreshSubscriptionStatus()
   * 
   * // 使用订阅状态
   * if (taskUtils.isSubscribe) {
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
   * @returns {string} info.taskVersion - 插件版本号（从 mnaddon.json 读取）
   * 
   * @example
   * let versionInfo = taskUtils.appVersion()
   * console.log(versionInfo)
   * // 输出：{
   * //   version: "marginnote4",
   * //   type: "macOS",
   * //   taskVersion: "1.0.0"
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
      let taskVersion = MNUtil.readJSON(this.mainPath + "/mnaddon.json").version
      info.taskVersion = taskVersion
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
   * let colors = taskUtils.getNoteColors()
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
   * let note = taskUtils.getNoteById("12345678-1234-1234-1234-123456789012")
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
   * let notebook = taskUtils.getNoteBookById(MNUtil.currentNotebookId)
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
   * let noteUrl = taskUtils.getUrlByNoteId("12345678-1234-1234-1234-123456789012")
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
   * let noteId = taskUtils.getNoteIdByURL("marginnote4app://note/12345678-1234-1234-1234-123456789012")
   * // 返回: "12345678-1234-1234-1234-123456789012"
   * 
   * // 使用场景：处理链接评论
   * if (comment.type === "LinkNote") {
   *   let linkedNoteId = taskUtils.getNoteIdByURL(comment.noteLinkURL)
   *   let linkedNote = taskUtils.getNoteById(linkedNoteId)
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
   * let text = taskUtils.clipboardText()
   * if (text) {
   *   console.log("剪贴板内容：" + text)
   * }
   * 
   * // 常见用法：粘贴到笔记
   * let clipText = taskUtils.clipboardText()
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
   * let cleanText = taskUtils.mergeWhitespace(messyText)
   * // 返回: "这是 一段 包含 很多 空白的 文本"
   * 
   * // 处理摘录文本
   * let excerptText = focusNote.excerptText
   * let cleanExcerpt = taskUtils.mergeWhitespace(excerptText)
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
   * taskUtils.replaceAction({
   *   range: "currentNotes",
   *   from: "old text",
   *   to: "new text"
   * })
   * 
   * // 多步替换
   * taskUtils.replaceAction({
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
   * taskUtils.isPureMNImages(md1)  // true
   * 
   * // 包含文字
   * let md2 = "文字 ![](marginnote4app://markdownimg/png/abc123)"
   * taskUtils.isPureMNImages(md2)  // false
   * 
   * // 使用场景：智能复制时判断是否复制图片
   * if (taskUtils.isPureMNImages(note.excerptText)) {
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
      taskUtils.addErrorLog(error, "isPureMNImages")
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
   * taskUtils.hasMNImages(md1)  // true
   * 
   * // 图片加文字
   * let md2 = "这是说明文字 ![](marginnote4app://markdownimg/png/abc123) 更多文字"
   * taskUtils.hasMNImages(md2)  // true
   * 
   * // 没有图片
   * let md3 = "只有文字没有图片"
   * taskUtils.hasMNImages(md3)  // false
   */
  static hasMNImages(markdown) {
    try {
      // 匹配 MN 图片链接的正则表达式
      const MNImagePattern = /!\[.*?\]\((marginnote4app\:\/\/markdownimg\/png\/.*?)(\))/g;
      let link = markdown.match(MNImagePattern)[0]
      // MNUtil.copyJSON({"a":link,"b":markdown})
      return markdown.match(MNImagePattern) ? true : false
    } catch (error) {
      taskUtils.addErrorLog(error, "hasMNImages")
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
   * let imageData = taskUtils.getMNImagesFromMarkdown(markdown)
   * if (imageData) {
   *   // 复制图片到剪贴板
   *   MNUtil.copyImage(imageData)
   * }
   * 
   * // 处理摘录中的图片
   * if (taskUtils.hasMNImages(note.excerptText)) {
   *   let imgData = taskUtils.getMNImagesFromMarkdown(note.excerptText)
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
      taskUtils.addErrorLog(error, "replaceBase64ImagesWithR2")
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
   * taskUtils.insertSnippetToTextView("Hello World", textView)
   * // 光标会在 "Hello World" 后面
   * 
   * // 使用光标占位符
   * taskUtils.insertSnippetToTextView("function {{cursor}}() {\n\n}", textView)
   * // 光标会定位在函数名位置
   * 
   * // 插入模板
   * let template = "/**\\n * {{cursor}}\\n *\\/\\nfunction name() {\\n\\n}"
   * taskUtils.insertSnippetToTextView(template, textView)
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
          taskUtils.smartCopy()
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
      taskUtils.addErrorLog(error, "copy")
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
   * taskUtils.copyJSON(noteInfo)
   * 
   * // 复制错误日志
   * taskUtils.copyJSON(taskUtils.errorLog)
   * 
   * // 调试时查看对象结构
   * taskUtils.copyJSON(getAllProperties(someObject))
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
   *   taskUtils.copyImage(imageData)
   * }
   * 
   * // 复制评论中的图片
   * if (comment.type === "PaintNote") {
   *   let imageData = MNUtil.getMediaByHash(comment.paint)
   *   taskUtils.copyImage(imageData)
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
   * let studyCtrl = taskUtils.studyController()
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
   * let studyView = taskUtils.studyView()
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
   * let docCtrl = taskUtils.currentDocController()
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
   * let notebookId = taskUtils.currentNotebookId
   * console.log("当前笔记本 ID：" + notebookId)
   * 
   * // 用于操作当前笔记本
   * if (taskUtils.currentNotebookId) {
   *   let notebook = taskUtils.getNoteBookById(taskUtils.currentNotebookId)
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
   * let notebook = taskUtils.currentNotebook()
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
   * taskUtils.undoGrouping(() => {
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
   * taskUtils.undoGrouping(() => {
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
   *   if (!await taskUtils.checkMNUtil(true)) {
   *     // MNUtils 未安装，停止初始化
   *     return
   *   }
   *   // 继续初始化...
   * }
   * 
   * // 在使用 MNUtil API 前检查
   * if (await taskUtils.checkMNUtil()) {
   *   // 可以安全使用 MNUtil API
   *   MNUtil.showHUD("开始执行")
   * }
   */
  static async checkMNUtil(alert = false, delay = 0.01) {
    if (typeof MNUtil === 'undefined') {  // 如果 MNUtil 未被加载，则执行一次延时，然后再检测一次
      // 仅在 MNUtil 未被完全加载时执行 delay
      await taskUtils.delay(delay)
      if (typeof MNUtil === 'undefined') {
        if (alert) {
          taskUtils.confirm("MN Task: Install 'MN Utils' first", "MN Task: 请先安装'MN Utils'")
        } else {
          taskUtils.showHUD("MN Task: Please install 'MN Utils' first!", 5)
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
   *   taskUtils.cloneAndMerge(focusNote, "12345678-1234-1234-1234-123456789012")
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
   *   taskUtils.cloneAsChildNote(focusNote, "12345678-1234-1234-1234-123456789012")
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
   * taskUtils.postNotification("MyPluginDidUpdate", {})
   * 
   * // 发送带数据的通知
   * taskUtils.postNotification("NoteColorChanged", {
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
   * let newOrder = taskUtils.moveElement(buttons, "Button3", "up")
   * // 结果: ["Button1", "Button3", "Button2", "Button4"]
   * 
   * // 将 Button1 向下移动
   * let newOrder2 = taskUtils.moveElement(buttons, "Button1", "down")
   * // 结果: ["Button2", "Button1", "Button3", "Button4"]
   * 
   * // 保存新顺序
   * taskConfig.buttonOrder = newOrder
   * taskConfig.save()
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
   * let vars = taskUtils.getVarInfo(template)
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
   * let vars = taskUtils.getVarInfoWithNote(template, focusNote)
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
   * let escaped = taskUtils.escapeStringRegexp(userInput)
   * // 返回: "1\\+1=2"
   * 
   * // 安全地使用用户输入创建正则
   * let regex = new RegExp(escaped)  // 不会把 + 当作量词
   * 
   * // 在替换操作中使用
   * let searchText = "[note]"
   * let safePattern = taskUtils.escapeStringRegexp(searchText)
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
   * let reg1 = taskUtils.string2Reg("hello")
   * // 等价于: new RegExp("hello")
   * 
   * // 正则字面量
   * let reg2 = taskUtils.string2Reg("/\\d+/g")
   * // 等价于: /\d+/g
   * 
   * // 使用案例
   * let pattern = taskUtils.string2Reg("/note.*title/i")
   * if (pattern.test(text)) {
   *   console.log("匹配成功")
   * }
   */
  static string2Reg(str) {
    str = str.trim()
    if (!str.startsWith("/")) return new RegExp(taskUtils.escapeStringRegexp(str))
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
   * let notes = taskUtils.getNotesByRange("currentNotes")
   * console.log(`选中了 ${notes.length} 个笔记`)
   * 
   * // 处理所有子笔记
   * let childNotes = taskUtils.getNotesByRange("childNotes")
   * childNotes.forEach(note => {
   *   note.colorIndex = 5  // 统一设置颜色
   * })
   * 
   * // 处理整个分支
   * let allDescendants = taskUtils.getNotesByRange("descendants")
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
   * taskUtils.clearNoteContent(note, { target: "title" })
   * 
   * // 清空摘录文本
   * taskUtils.clearNoteContent(note, { target: "excerptText" })
   * 
   * // 删除所有文本评论
   * taskUtils.clearNoteContent(note, { 
   *   target: "comments", 
   *   type: "TextNote" 
   * })
   * 
   * // 删除所有评论
   * taskUtils.clearNoteContent(note, { target: "comments" })
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
   * taskUtils.setNoteContent(note, "新标题", { target: "title" })
   * 
   * // 设置摘录文本
   * taskUtils.setNoteContent(note, "新的摘录内容", { 
   *   target: "excerptText" 
   * })
   * 
   * // 添加新评论
   * taskUtils.setNoteContent(note, "这是一条评论", { 
   *   target: "newComment" 
   * })
   * 
   * // 使用模板变量
   * taskUtils.setNoteContent(note, "[摘自 {{currentDocName}}]", {
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
   * taskUtils.clearContent({
   *   range: "currentNotes",
   *   target: "title"
   * })
   * 
   * // 清空所有子笔记的摘录
   * taskUtils.clearContent({
   *   range: "childNotes",
   *   target: "excerptText"
   * })
   * 
   * // 删除所有后代笔记的文本评论
   * taskUtils.clearContent({
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
   * taskUtils.setContent({
   *   range: "currentNotes",
   *   target: "title",
   *   content: "[重要] {{title}}"  // 使用模板变量
   * })
   * 
   * // 为所有子笔记添加评论
   * taskUtils.setContent({
   *   range: "childNotes",
   *   target: "newComment",
   *   content: "来自父笔记：{{parentNote.title}}"
   * })
   * 
   * // 统一设置摘录文本
   * taskUtils.setContent({
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
      taskUtils.addErrorLog(error, "setContent")
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
   * taskUtils.replace(note, pattern, {
   *   target: "title",
   *   to: "新文本"
   * })
   * 
   * // 替换摘录中的空行
   * let emptyLinePattern = /\n\n+/g
   * taskUtils.replace(note, emptyLinePattern, {
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
   * taskUtils.dismissPopupMenu(currentMenu)
   * 
   * // 延迟关闭（例如：显示成功提示后）
   * MNUtil.showHUD("✅ 操作成功")
   * taskUtils.dismissPopupMenu(currentMenu, true)
   * 
   * // 条件性关闭
   * if (operationSuccess && menu) {
   *   taskUtils.dismissPopupMenu(menu, true)
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
   * taskUtils.shouldShowMenu(des1)  // true
   * 
   * // 明确指定执行动作
   * let des2 = { target: "copy" }
   * taskUtils.shouldShowMenu(des2)  // false
   * 
   * // 默认行为（显示菜单）
   * let des3 = { menuItems: [...] }
   * taskUtils.shouldShowMenu(des3)  // true
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
   * taskUtils.paste({ target: "default" })
   * 
   * // 替换标题
   * taskUtils.paste({ target: "title" })
   * 
   * // 追加到摘录（Markdown 格式）
   * taskUtils.paste({ 
   *   target: "appendExcerpt",
   *   markdown: true,
   *   hideMessage: true
   * })
   * 
   * // 追加到标题（用于多个关键词）
   * taskUtils.paste({ target: "appendTitle" })
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
   * taskUtils.showInFloatWindow({ 
   *   target: "noteInClipboard" 
   * })
   * 
   * // 打开当前笔记的父笔记
   * taskUtils.showInFloatWindow({ 
   *   target: "parentNote" 
   * })
   * 
   * // 通过 URL 打开特定笔记
   * taskUtils.showInFloatWindow({ 
   *   noteURL: "marginnote4app://note/12345..." 
   * })
   * 
   * // 在脑图中定位当前笔记
   * taskUtils.showInFloatWindow({ 
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
  /**
   * ⏱️ 延迟执行（异步等待）
   * 
   * 在代码中创建指定时间的延迟，返回一个 Promise。
   * 这是 MNUtil.delay() 的封装，用于在异步函数中创建暂停效果。
   * 
   * @param {number} seconds - 延迟的秒数（支持小数）
   * @returns {Promise<void>} 延迟指定时间后 resolve 的 Promise
   * 
   * @example
   * // 延迟 1 秒
   * await taskUtils.delay(1)
   * console.log("1 秒后执行")
   * 
   * // 延迟 0.5 秒（500毫秒）
   * await taskUtils.delay(0.5)
   * 
   * // 在动画中使用
   * for (let i = 0; i < 10; i++) {
   *   button.frame.x += 10
   *   await taskUtils.delay(0.1)  // 每次移动后等待 100ms
   * }
   * 
   * // 显示提示后延迟关闭
   * MNUtil.showHUD("操作成功！")
   * await taskUtils.delay(2)  // 给用户 2 秒时间查看
   * menu.dismiss()
   * 
   * // 错误重试机制
   * let retries = 3
   * while (retries > 0) {
   *   try {
   *     await someAsyncOperation()
   *     break
   *   } catch (error) {
   *     retries--
   *     await taskUtils.delay(1)  // 等待 1 秒后重试
   *   }
   * }
   */
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
   * let childMap = taskUtils.currentChildMap()
   * if (childMap) {
   *   console.log("子脑图标题：" + childMap.noteTitle)
   *   console.log("子笔记数量：" + childMap.childNotes.length)
   * } else {
   *   console.log("当前没有子脑图")
   * }
   * 
   * // 在子脑图中添加笔记
   * let childMap = taskUtils.currentChildMap()
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
   * let note = taskUtils.newNoteInCurrentChildMap("新想法")
   * 
   * // 创建带配置的笔记
   * let note = taskUtils.newNoteInCurrentChildMap({
   *   title: "重要概念",
   *   colorIndex: 7  // 红色
   * })
   * 
   * // 条件创建
   * if (needsOrganization) {
   *   // 会自动判断是否有子脑图
   *   let note = taskUtils.newNoteInCurrentChildMap({
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
   * taskUtils.replaceNoteIndex(text, 0, {})  // "第 1 章"
   * taskUtils.replaceNoteIndex(text, 5, {})  // "第 6 章"
   * 
   * // 自定义索引
   * let customText = "{{noteIndex}}. 内容"
   * taskUtils.replaceNoteIndex(customText, 2, {
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
   * taskUtils.replaceIndex(template, 0, {})
   * // 返回: "① 1. a"
   * 
   * // 批量生成列表
   * let items = ["苹果", "香蕉", "橙子"]
   * items.forEach((item, i) => {
   *   let text = taskUtils.replaceIndex(
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
   * taskUtils.emojiNumber(0)   // "0️⃣"
   * taskUtils.emojiNumber(5)   // "5️⃣"
   * taskUtils.emojiNumber(10)  // "🔟"
   * 
   * // 在标题中使用
   * let title = taskUtils.emojiNumber(3) + " 第三章"
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
   * let text = taskUtils.getMergedText(note, {
   *   source: ["{{textComments}}"],
   *   join: "\n",
   *   trim: true
   * }, 0)
   * 
   * // 格式化标签
   * let tags = taskUtils.getMergedText(note, {
   *   source: ["{{tags}}"],
   *   format: "#{{element}}",
   *   join: " "
   * }, 0)
   * // 结果: "#标签1 #标签2 #标签3"
   * 
   * // 复杂模板
   * let summary = taskUtils.getMergedText(note, {
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
        if (note.noteId in taskUtils.commentToRemove) {
          taskUtils.commentToRemove[note.noteId].push(-1)
        }else{
          taskUtils.commentToRemove[note.noteId] = [-1]
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
              if (note.noteId in taskUtils.commentToRemove) {
                taskUtils.commentToRemove[note.noteId].push(index)
              }else{
                taskUtils.commentToRemove[note.noteId] = [index]
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
              if (note.noteId in taskUtils.commentToRemove) {
                taskUtils.commentToRemove[note.noteId].push(index)
              }else{
                taskUtils.commentToRemove[note.noteId] = [index]
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
   * let result = taskUtils.checkVariableForNote(text, "")
   * // OCR 启用且无用户输入：
   * // "分析 {{cardsOCR}} 中的 {{textOCR}}"
   * 
   * // 单个笔记时
   * MNNote.getFocusNotes().length === 1
   * let result = taskUtils.checkVariableForNote("{{cards}}", "")
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
   * let result = taskUtils.checkVariableForText(template, "")
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
   * let result = taskUtils.replacVar(template, vars)
   * // "Hello 张三, today is 2024-01-01"
   * 
   * // 复杂模板
   * let noteTemplate = "{{title}}\n作者：{{author}}\n标签：{{tags}}"
   * let noteVars = {
   *   title: "JavaScript 高级编程",
   *   author: "Nicholas C. Zakas",
   *   tags: "#编程 #JavaScript"
   * }
   * let noteText = taskUtils.replacVar(noteTemplate, noteVars)
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
   * let result = taskUtils.detectAndReplace(template)
   * // "标题：我的笔记\n日期：2024-01-01"
   * 
   * // 使用系统信息
   * let sysTemplate = "从 {{currentDocName}} 复制：{{selectionText}}"
   * let sysResult = taskUtils.detectAndReplace(sysTemplate)
   * 
   * // 传入额外元素
   * let customTemplate = "处理结果：{{element}}"
   * let customResult = taskUtils.detectAndReplace(customTemplate, "成功")
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
   * let summary = taskUtils.detectAndReplaceWithNote(template, note)
   * 
   * // 批量处理
   * let notes = MNNote.getFocusNotes()
   * notes.forEach(note => {
   *   let text = taskUtils.detectAndReplaceWithNote(
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
   * let nodes = taskUtils.processList(items)
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
   * let text = taskUtils.getUnformattedText(token)
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
   * let tree = taskUtils.buildTree(tokens)
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
   * let ast = taskUtils.markdown2AST(markdown)
   * // 可以用于生成脑图
   * taskUtils.AST2Mindmap(focusNote, ast)
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
   * taskUtils.containsMathFormula("这是公式：$E=mc^2$")     // true
   * taskUtils.containsMathFormula("$$\\int_0^1 x dx$$")     // true
   * taskUtils.containsMathFormula("普通文本")               // false
   * 
   * // 用于决定是否启用 Markdown 模式
   * if (taskUtils.containsMathFormula(text)) {
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
   * taskUtils.containsUrl("访问 https://example.com")    // true
   * taskUtils.containsUrl("查看 www.example.com")        // true
   * taskUtils.containsUrl("普通文本")                     // false
   * 
   * // 用于决定是否保留 Markdown 格式
   * if (taskUtils.containsUrl(text)) {
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
   * let plainText = taskUtils.removeMarkdownFormat(markdown)
   * // "重要：请查看 文档"
   * 
   * let complex = "# 标题\n- **列表项1**\n- *列表项2*\n> 引用"
   * let plain = taskUtils.removeMarkdownFormat(complex)
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
   * let config1 = taskUtils.getConfig("定理：$a^2 + b^2 = c^2$")
   * // { title: "定理", excerptText: "$a^2 + b^2 = c^2$", excerptTextMarkdown: true }
   * 
   * // URL
   * let config2 = taskUtils.getConfig("参考：https://example.com")
   * // { excerptText: "参考：https://example.com", excerptTextMarkdown: true }
   * 
   * // 标题与内容
   * let config3 = taskUtils.getConfig("重要：这是一个重要的概念")
   * // { title: "重要", excerptText: "这是一个重要的概念" }
   * 
   * // 短文本
   * let config4 = taskUtils.getConfig("简短标题")
   * // { title: "简短标题" }
   * 
   * // 长文本
   * let config5 = taskUtils.getConfig("这是一段很长的文本..." + "x".repeat(50))
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
   * let ast = taskUtils.markdown2AST(markdown)
   * let rootNote = MNNote.getFocusNote()
   * taskUtils.AST2Mindmap(rootNote, ast)
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
  /**
   * 📑 Markdown 转脑图
   * 
   * 将 Markdown 文本转换为 MarginNote 脑图结构。
   * 支持从当前笔记、文件或剪贴板读取 Markdown 内容。
   * 
   * @param {Object} des - 描述对象
   * @param {string} [des.source="currentNote"] - Markdown 来源
   *   - "currentNote" - 从当前笔记获取
   *   - "file" - 从文件导入
   *   - "clipboard" - 从剪贴板获取
   * @returns {Promise<void>}
   * 
   * @example
   * // 从当前笔记创建脑图
   * await taskUtils.markdown2Mindmap({ source: "currentNote" })
   * 
   * // 从文件导入
   * await taskUtils.markdown2Mindmap({ source: "file" })
   * // 会弹出文件选择器，选择 .md 文件
   * 
   * // 从剪贴板创建
   * // 先复制 Markdown 内容
   * await taskUtils.markdown2Mindmap({ source: "clipboard" })
   * 
   * // Markdown 格式示例：
   * // # 主题
   * // ## 子主题1
   * // - 要点1
   * // - 要点2
   * // ## 子主题2
   */
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
    let res = taskUtils.markdown2AST(markdown)
    // MNUtil.copy(res)
    MNUtil.undoGrouping(()=>{
      if (!focusNote) {
        focusNote = this.newNoteInCurrentChildMap({title:newNoteTitle})
        focusNote.focusInFloatMindMap(0.5)
      }
      taskUtils.AST2Mindmap(focusNote,res)
    })
    return
 } catch (error) {
  this.addErrorLog(error, "markdown2Mindmap")
  return
 }
  }
  /**
   * 📏 检查并调整高度
   * 
   * 根据订阅状态和按钮数量，计算工具栏的合适高度。
   * 用于确保工具栏高度符合限制并对齐到按钮行。
   * 
   * @param {number} height - 期望的高度
   * @param {number} [maxButtons=20] - 最大按钮数量
   * @returns {number} 调整后的高度
   * 
   * 高度计算规则：
   * - 每个按钮高度：45px
   * - 顶部/底部边距：15px
   * - 未订阅最大高度：420px
   * - 最小高度：60px
   * - 高度对齐到按钮行
   * 
   * @example
   * // 检查高度
   * let adjustedHeight = taskUtils.checkHeight(300)  // 返回对齐后的高度
   * 
   * // 设置最大20个按钮
   * let maxHeight = taskUtils.checkHeight(1000, 20)  // 返回 915 (45*20+15)
   * 
   * // 未订阅用户限制
   * let limitedHeight = taskUtils.checkHeight(500)  // 返回 420（如果未订阅）
   */
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
  /**
   * 🚨 记录错误日志
   * 
   * 记录错误信息并显示给用户。
   * 同时使用 MNUtil 的错误日志系统进行持久化记录。
   * 
   * @param {Error|string} error - 错误对象或错误信息
   * @param {string} source - 错误来源（函数名）
   * @param {*} [info] - 额外的调试信息
   * @returns {void}
   * 
   * @example
   * try {
   *   // 危险操作
   *   someRiskyOperation()
   * } catch (error) {
   *   taskUtils.addErrorLog(error, "someFunction", { 
   *     noteId: focusNote.noteId,
   *     action: "delete" 
   *   })
   * }
   * 
   * // 手动记录错误
   * taskUtils.addErrorLog(
   *   "Invalid parameter", 
   *   "validateInput",
   *   { received: value, expected: "string" }
   * )
   */
  static addErrorLog(error,source,info){
    MNUtil.showHUD("MN Task Error ("+source+"): "+error)  // 保留特定的错误提示
    return MNUtil.addErrorLog(error, "MNTask:" + source, info)  // 使用 MNUtil 的错误日志系统
  }
  /**
   * 🗑️ 删除评论
   * 
   * 根据不同的条件删除笔记中的评论。
   * 支持按索引、类型或查找条件删除单个或多个评论。
   * 
   * @param {Object} des - 描述对象
   * @param {Object} [des.find] - 查找条件对象
   * @param {string|string[]} [des.type] - 评论类型
   * @param {string|string[]} [des.types] - 评论类型（别名）
   * @param {number|number[]} [des.index] - 评论索引
   * @param {boolean} [des.multi=false] - 是否删除多个匹配项
   * 
   * 支持的类型：
   * - "TextNote" - 文本评论
   * - "LinkNote" - 链接评论
   * - "PaintNote" - 手写评论
   * - "HtmlNote" - HTML评论
   * 
   * @example
   * // 删除第一个文本评论
   * taskUtils.removeComment({ 
   *   type: "TextNote" 
   * })
   * 
   * // 删除所有链接评论
   * taskUtils.removeComment({ 
   *   type: "LinkNote", 
   *   multi: true 
   * })
   * 
   * // 按索引删除（第3个评论）
   * taskUtils.removeComment({ 
   *   index: 2 
   * })
   * 
   * // 按条件查找并删除
   * taskUtils.removeComment({ 
   *   find: { text: "TODO" },
   *   multi: true 
   * })
   */
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
  /**
   * ⏰ 设置定时器
   * 
   * 通过系统通知设置定时器功能。
   * 支持倒计时和其他定时模式。
   * 
   * @param {Object} des - 描述对象
   * @param {string} des.timerMode - 定时器模式
   *   - "countdown" - 倒计时模式
   *   - 其他自定义模式
   * @param {number} [des.minutes] - 倒计时分钟数（仅倒计时模式需要）
   * @param {string} [des.annotation] - 定时器注释说明
   * 
   * @example
   * // 设置 25 分钟倒计时（番茄钟）
   * taskUtils.setTimer({
   *   timerMode: "countdown",
   *   minutes: 25,
   *   annotation: "专注学习"
   * })
   * 
   * // 设置自定义定时器
   * taskUtils.setTimer({
   *   timerMode: "reminder",
   *   annotation: "休息一下"
   * })
   */
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
  /**
   * 📖 在词典中搜索
   * 
   * 在指定的词典应用中搜索选中的文本或笔记内容。
   * 支持欧路词典和其他词典应用。
   * 
   * @param {Object} des - 描述对象
   * @param {string} [des.target="eudic"] - 目标词典应用
   *   - "eudic" - 欧路词典（通过 URL Scheme）
   *   - 其他值 - 使用内置查词界面
   * @param {UIButton} button - 触发按钮对象
   * 
   * 搜索优先级：
   * 1. 当前选中的文本
   * 2. 焦点笔记的摘录文本
   * 3. 焦点笔记的标题
   * 4. 焦点笔记的第一个文本评论
   * 
   * @example
   * // 在欧路词典中查词
   * taskUtils.searchInDict({}, button)
   * 
   * // 使用内置查词界面
   * taskUtils.searchInDict({ 
   *   target: "builtin" 
   * }, button)
   */
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
          let endFrame = taskFrame.gen(beginFrame.x-225, beginFrame.y-50, 500, 500)
          endFrame.y = MNUtil.constrain(endFrame.y, 0, studyFrame.height-500)
          endFrame.x = MNUtil.constrain(endFrame.x, 0, studyFrame.width-500)
          MNUtil.postNotification("lookupText"+target,{text:textSelected,beginFrame:beginFrame,endFrame:endFrame})
          return
        }
        let endFrame
        beginFrame.y = beginFrame.y-10
        if (beginFrame.x+490 > studyFrame.width) {
          endFrame = taskFrame.gen(beginFrame.x-450, beginFrame.y-10, 500, 500)
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
          endFrame = taskFrame.gen(beginFrame.x+40, beginFrame.y-10, 500, 500)
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


      // let des = taskConfig.getDescriptionByName("searchInEudic")
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
  /**
   * 💬 显示消息
   * 
   * 显示支持模板变量的消息提示。
   * 会自动替换消息中的模板变量。
   * 
   * @param {Object} des - 描述对象
   * @param {string} des.content - 消息内容，支持模板变量
   * 
   * @example
   * // 显示简单消息
   * taskUtils.showMessage({
   *   content: "操作完成！"
   * })
   * 
   * // 使用模板变量
   * taskUtils.showMessage({
   *   content: "已处理笔记：{{note.title}}"
   * })
   * 
   * // 显示日期信息
   * taskUtils.showMessage({
   *   content: "今天是 {{date.year}}-{{date.month}}-{{date.day}}"
   * })
   */
  static showMessage(des){
    let content = this.detectAndReplace(des.content)
    MNUtil.showHUD(content)
  }
  /**
   * ✅ 用户确认对话框
   * 
   * 显示确认对话框，等待用户选择。
   * 支持模板变量，可根据用户选择返回不同的操作。
   * 
   * @param {Object} des - 描述对象
   * @param {string} des.title - 对话框标题，支持模板变量
   * @param {string} [des.subTitle] - 副标题，支持模板变量
   * @param {*} [des.onConfirm] - 用户确认时返回的值
   * @param {*} [des.onCancel] - 用户取消时返回的值
   * @returns {Promise<*>} 根据用户选择返回对应的值
   * 
   * @example
   * // 简单确认
   * let result = await taskUtils.userConfirm({
   *   title: "确定删除这个笔记吗？",
   *   subTitle: "此操作不可撤销"
   * })
   * if (result === undefined) {
   *   // 用户取消或确认（没有指定返回值）
   * }
   * 
   * // 带返回值的确认
   * let action = await taskUtils.userConfirm({
   *   title: "选择操作方式",
   *   subTitle: "{{note.title}}",
   *   onConfirm: "delete",
   *   onCancel: "keep"
   * })
   * if (action === "delete") {
   *   // 执行删除
   * }
   */
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
  /**
   * 🔘 用户选择对话框
   * 
   * 显示多选项对话框，让用户从列表中选择。
   * 支持模板变量，可根据选择返回对应的描述对象。
   * 
   * @param {Object} des - 描述对象
   * @param {string} des.title - 对话框标题，支持模板变量
   * @param {string} [des.subTitle] - 副标题，支持模板变量
   * @param {Object[]} des.selectItems - 选项数组
   * @param {string} des.selectItems[].selectTitle - 选项显示文本，支持模板变量
   * @param {*} [des.onCancel] - 用户取消时返回的值
   * @returns {Promise<Object|*>} 选中的选项对象或取消值
   * 
   * @example
   * // 选择颜色
   * let colorDes = await taskUtils.userSelect({
   *   title: "选择标记颜色",
   *   subTitle: "为 {{note.title}} 设置颜色",
   *   selectItems: [
   *     { selectTitle: "🟡 黄色", colorIndex: 0 },
   *     { selectTitle: "🟢 绿色", colorIndex: 1 },
   *     { selectTitle: "🔵 蓝色", colorIndex: 2 },
   *     { selectTitle: "🔴 红色", colorIndex: 3 }
   *   ]
   * })
   * 
   * if (colorDes && colorDes.colorIndex !== undefined) {
   *   focusNote.colorIndex = colorDes.colorIndex
   * }
   * 
   * // 选择操作
   * let actionDes = await taskUtils.userSelect({
   *   title: "选择操作",
   *   selectItems: [
   *     { selectTitle: "复制", action: "copy" },
   *     { selectTitle: "移动", action: "move" },
   *     { selectTitle: "删除", action: "delete" }
   *   ],
   *   onCancel: { action: "none" }
   * })
   */
  static async userSelect(des){
    if (des.title && des.selectItems) {
      let confirmTitle = taskUtils.detectAndReplace(des.title)
      let confirmSubTitle = des.subTitle ? taskUtils.detectAndReplace(des.subTitle) : ""
      let selectTitles = des.selectItems.map(item=>{
        return taskUtils.detectAndReplace(item.selectTitle)
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
  /**
   * 🤖 AI 聊天接口
   * 
   * 触发 AI 聊天功能，支持多种交互模式。
   * 通过系统通知与 AI 聊天模块通信。
   * 
   * @param {Object} des - 描述对象
   * @param {string} [des.target] - 目标操作
   *   - "openFloat" - 打开浮动聊天窗口
   *   - "currentPrompt" - 使用当前提示词
   * @param {string} [des.prompt] - 预设的提示词
   * @param {string} [des.user] - 用户问题
   * @param {string} [des.system] - 系统提示（与 user 配合使用）
   * @param {UIButton} button - 触发按钮对象
   * @returns {boolean|void}
   * 
   * @example
   * // 打开浮动聊天窗口
   * taskUtils.chatAI({ 
   *   target: "openFloat" 
   * }, button)
   * 
   * // 使用预设提示词
   * taskUtils.chatAI({ 
   *   prompt: "请帮我总结这段内容的要点" 
   * }, button)
   * 
   * // 自定义问答
   * taskUtils.chatAI({ 
   *   user: "什么是量子力学？",
   *   system: "你是一位物理学教授，请用简单的语言解释。" 
   * }, button)
   * 
   * // 使用当前配置的提示词
   * taskUtils.chatAI({ 
   *   target: "currentPrompt" 
   * }, button)
   */
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
  /**
   * 🔍 网页搜索
   * 
   * 在内置浏览器中搜索选中的文本或笔记内容。
   * 支持指定搜索引擎，在浮动窗口中显示结果。
   * 
   * @param {Object} des - 描述对象
   * @param {string} [des.engine] - 搜索引擎
   * @param {UIButton} button - 触发按钮对象
   * 
   * 搜索内容优先级：
   * 1. 当前选中的文本
   * 2. 焦点笔记的内容
   * 
   * @example
   * // 使用默认搜索引擎
   * taskUtils.search({}, button)
   * 
   * // 指定搜索引擎
   * taskUtils.search({ 
   *   engine: "google" 
   * }, button)
   * 
   * // 搜索流程：
   * // 1. 获取选中文本或笔记
   * // 2. 计算浮动窗口位置
   * // 3. 发送搜索通知
   * // 4. 在浮动窗口显示结果
   */
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
      let endFrame = taskFrame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
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
      endFrame = taskFrame.gen(beginFrame.x-450, beginFrame.y-10, 450, 500)
      if (beginFrame.y+490 > studyFrame.height) {
        endFrame.y = studyFrame.height-500
      }
    }else{
      endFrame = taskFrame.gen(beginFrame.x+40, beginFrame.y-10, 450, 500)
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
   * 📷 获取图片文字（OCR）
   * 
   * 使用 OCR 技术从图片中提取文字。
   * 需要安装 MN OCR 插件才能使用。
   * 
   * @param {NSData} image - 图片数据
   * @returns {Promise<string|undefined>} OCR 识别的文本，失败返回 undefined
   * 
   * @example
   * // 获取选中区域的文字
   * let imageData = MNUtil.getDocImage(true, true)
   * if (imageData) {
   *   let text = await taskUtils.getTextOCR(imageData)
   *   if (text) {
   *     console.log("识别的文字：", text)
   *   }
   * }
   * 
   * // 从笔记图片获取文字
   * let noteImage = MNNote.getImageFromNote(focusNote)
   * if (noteImage) {
   *   let text = await taskUtils.getTextOCR(noteImage)
   * }
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
   * 🔎 智谱 AI 网络搜索
   * 
   * 使用智谱 AI 的网络搜索工具搜索问题答案。
   * 返回搜索结果的结构化数据。
   * 
   * @param {string} question - 搜索问题
   * @param {string} apikey - 智谱 AI API 密钥
   * @returns {Promise<Array>} 搜索结果数组，每个结果包含：
   *   - content: 内容摘要
   *   - title: 标题
   *   - link: 原文链接
   *   - media: 媒体来源
   *   - refer: 引用信息
   *   - icon: 图标
   *   - index: 索引
   * @throws {Error} 如果 API 密钥为空或请求失败
   * 
   * @example
   * let apikey = "your-zhipu-api-key"
   * let results = await taskUtils.webSearchForZhipu(
   *   "MarginNote 4 使用技巧",
   *   apikey
   * )
   * 
   * results.forEach(result => {
   *   console.log(`${result.title}: ${result.content}`)
   *   console.log(`来源: ${result.link}`)
   * })
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
  /**
   * 🌐 网络搜索并创建笔记
   * 
   * 搜索指定问题，并将搜索结果创建为子笔记。
   * 会尝试获取每个结果的完整内容。
   * 
   * @param {Object} des - 描述对象
   * @param {string} des.question - 搜索问题，支持模板变量
   * @returns {Promise<Array|void>} 搜索结果数组
   * 
   * 工作流程：
   * 1. 解析问题中的模板变量
   * 2. 使用智谱 AI 搜索
   * 3. 尝试获取每个结果的完整内容
   * 4. 为每个结果创建子笔记
   * 
   * @example
   * // 搜索并创建笔记
   * await taskUtils.webSearch({
   *   question: "{{note.title}} 的相关研究"
   * })
   * 
   * // 搜索特定主题
   * await taskUtils.webSearch({
   *   question: "量子计算最新进展 2024"
   * })
   * 
   * // 结果会自动创建为当前笔记的子笔记
   * // 每个子笔记包含：
   * // - 标题：搜索结果的标题
   * // - 摘录：内容摘要 + 原文链接
   */
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
   * 📸 图片文字识别（OCR）
   * 
   * 对选中的图片或笔记中的图片进行文字识别。
   * 支持多种输出方式和 OCR 引擎。
   * 
   * @param {Object} des - 描述对象
   * @param {boolean} [des.buffer=true] - 是否使用缓冲
   * @param {string} [des.target="comment"] - 输出目标
   *   - "comment" - 添加为评论
   *   - "excerpt" - 设置为摘录
   *   - "childNote" - 创建子笔记
   *   - "clipboard" - 复制到剪贴板
   *   - "editor" - 在编辑器中打开
   *   - "option" - 让用户选择
   *   - "chatModeReference" - 插入到聊天模式
   * @param {string} [des.source] - OCR 引擎来源
   * @param {string} [des.method] - 插入方法（用于 chatModeReference）
   * @param {boolean} [des.followParentColor] - 子笔记是否继承父笔记颜色
   * @param {UIButton} button - 触发按钮对象
   * @returns {Promise<void>}
   * 
   * @example
   * // 识别并添加为评论
   * await taskUtils.ocr({
   *   target: "comment"
   * }, button)
   * 
   * // 识别并让用户选择
   * await taskUtils.ocr({
   *   target: "option"
   * }, button)
   * 
   * // 创建子笔记并继承颜色
   * await taskUtils.ocr({
   *   target: "childNote",
   *   followParentColor: true
   * }, button)
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
      // MNUtil.showHUD("MN Task: Please install 'MN OCR' first!")
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
                let endFrame = taskFrame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
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
                let endFrame = taskFrame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
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
          let endFrame = taskFrame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
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
   * 🤖 初始化 ChatGPT 请求（无流式）
   * 
   * 创建一个 ChatGPT API 请求对象，不使用流式传输。
   * 这是一个底层方法，通常由其他方法调用。
   * 
   * @param {Array} history - 对话历史数组，格式：[{role: "user"|"assistant"|"system", content: "..."}]
   * @param {string} apikey - API 密钥
   * @param {string} url - API 端点 URL
   * @param {string} model - 使用的模型名称
   * @param {number} temperature - 温度参数（0-2），控制回复的随机性
   * @param {Array<number>} [funcIndices=[]] - 函数索引数组（用于函数调用）
   * @returns {NSURLRequest} 请求对象
   * @throws {Error} 如果 API 密钥为空
   * 
   * @example
   * let history = [
   *   { role: "system", content: "你是一个有帮助的助手" },
   *   { role: "user", content: "什么是 JavaScript？" }
   * ]
   * 
   * let request = taskUtils.initRequestForChatGPTWithoutStream(
   *   history,
   *   "sk-...",
   *   "https://api.openai.com/v1/chat/completions",
   *   "gpt-3.5-turbo",
   *   0.7
   * )
   * 
   * let response = await MNConnection.sendRequest(request)
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
   * 👁️ ChatGPT 视觉识别
   * 
   * 使用支持视觉的 AI 模型进行图片文字识别。
   * 专门优化用于提取图片中的文本，包括公式。
   * 
   * @param {NSData} imageData - 图片数据
   * @param {string} [model="glm-4v-flash"] - 使用的视觉模型
   * @returns {Promise<string|undefined>} 识别的文本，失败返回 undefined
   * 
   * 特点：
   * - 自动识别并用 $ 符号包裹数学公式
   * - 压缩图片以优化传输
   * - 使用专门的提示词优化识别效果
   * - 支持 LaTeX 公式格式
   * 
   * @example
   * let imageData = MNUtil.getDocImage(true, true)
   * if (imageData) {
   *   let text = await taskUtils.ChatGPTVision(imageData)
   *   console.log("识别结果：", text)
   *   // 如果包含公式，会是这样的格式：
   *   // "根据勾股定理，$a^2 + b^2 = c^2$"
   * }
   * 
   * // 使用其他模型
   * let text = await taskUtils.ChatGPTVision(
   *   imageData, 
   *   "gpt-4-vision-preview"
   * )
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
   * 🆓 免费 OCR 服务
   * 
   * 使用内置的免费 OCR 服务识别图片文字。
   * 实际上是 ChatGPTVision 的封装，提供更简单的接口。
   * 
   * @param {NSData} image - 图片数据
   * @returns {Promise<string|undefined>} 识别的文本
   * 
   * @example
   * // 简单使用
   * let imageData = MNUtil.getDocImage(true, true)
   * let text = await taskUtils.freeOCR(imageData)
   * if (text) {
   *   MNUtil.copy(text)
   *   MNUtil.showHUD("文字已复制")
   * }
   */
  static async freeOCR(image){
    let res = await this.ChatGPTVision(image)
    MNUtil.stopHUD()
    return res
  }
  /**
   * 🔄 移动评论位置
   * 
   * 根据不同的条件移动笔记中评论的位置。
   * 支持按索引、类型或查找条件移动评论。
   * 
   * @param {Object} des - 描述对象
   * @param {Object} [des.find] - 查找条件
   * @param {string} [des.type] - 评论类型
   * @param {string[]} [des.types] - 评论类型数组
   * @param {number} [des.index] - 评论索引
   * @param {string|number} des.to - 目标位置
   *   - 数字：移动到指定索引
   *   - "top" - 移到最前
   *   - "bottom" - 移到最后
   *   - "up" - 上移一位
   *   - "down" - 下移一位
   * 
   * @example
   * // 将第一个评论移到最后
   * taskUtils.moveComment({
   *   index: 0,
   *   to: "bottom"
   * })
   * 
   * // 将文本评论移到最前
   * taskUtils.moveComment({
   *   type: "TextNote",
   *   to: "top"
   * })
   * 
   * // 按条件查找并上移
   * taskUtils.moveComment({
   *   find: { text: "重要" },
   *   to: "up"
   * })
   * 
   * // 移动到指定位置
   * taskUtils.moveComment({
   *   index: 2,
   *   to: 0  // 移到第一个位置
   * })
   */
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
   * 📅 获取日期对象（扩展版）
   * 
   * 获取包含多种日期格式的对象，用于模板变量替换。
   * 虽然 MNUtil 也有 getDateObject() 方法，但本方法提供了更多的日期格式。
   * 
   * @returns {Object} 日期对象，包含：
   *   - now: 当前时间的本地化字符串
   *   - tomorrow: 明天的日期字符串
   *   - yesterday: 昨天的日期字符串
   *   - year: 年份（数字）
   *   - month: 月份（1-12）
   *   - day: 日期（1-31）
   *   - hour: 小时（0-23）
   *   - minute: 分钟（0-59）
   *   - second: 秒（0-59）
   * 
   * @example
   * let date = taskUtils.getDateObject()
   * console.log(date.now)       // "2024/1/1 下午3:30:45"
   * console.log(date.year)      // 2024
   * console.log(date.month)     // 1
   * console.log(date.tomorrow)  // "2024/1/2 下午3:30:45"
   * 
   * // 在模板中使用
   * let template = "创建于 {{date.year}}-{{date.month}}-{{date.day}}"
   * let result = taskUtils.detectAndReplace(template)
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
   * 📝 获取笔记对象（用于模板）
   * 
   * 将 MNNote 对象转换为包含各种属性的普通对象。
   * 用于模板渲染和数据导出，提供丰富的笔记信息。
   * 
   * @param {MNNote} note - 笔记对象
   * @param {Object} [config={}] - 初始配置对象
   * @param {Object} [opt={first:true}] - 选项
   * @param {boolean} [opt.first=true] - 是否为第一层（包含笔记本信息）
   * @param {boolean} [opt.parent] - 是否包含父笔记信息
   * @param {boolean} [opt.child] - 是否包含子笔记信息
   * @param {number} [opt.parentLevel] - 递归获取父笔记的层数
   * @returns {Object|undefined} 笔记信息对象
   * 
   * 返回对象包含：
   * - 基本信息：id, title, url, excerptText, tags
   * - 时间信息：date.create, date.modify
   * - 状态信息：hasTag, hasComment, hasChild, hasText
   * - 颜色信息：color.lightYellow, color.green 等
   * - 关系信息：parent（可选）, child（可选）
   * - 文档信息：docName, hasDoc
   * - 位置信息：inMainMindMap, inChildMindMap
   * 
   * @example
   * // 获取基本信息
   * let noteObj = taskUtils.getNoteObject(focusNote)
   * console.log(noteObj.title)
   * console.log(noteObj.tags)
   * 
   * // 包含父子关系
   * let fullObj = taskUtils.getNoteObject(focusNote, {}, {
   *   parent: true,
   *   child: true,
   *   parentLevel: 2  // 获取两层父笔记
   * })
   * 
   * // 在模板中使用
   * let template = "标题：{{note.title}}\n创建时间：{{note.date.create}}"
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
  /**
   * 🛠️ 开发版 HTML 编辑器
   * 
   * 生成一个带语法高亮的 JSON 编辑器 HTML。
   * 支持实时编辑和语法高亮，用于开发调试。
   * 
   * @param {string} content - 初始内容
   * @returns {string} 完整的 HTML 页面代码
   * 
   * 特性：
   * - JSON 语法高亮
   * - 实时编辑
   * - 自动格式化
   * - 保持光标位置
   * - 支持中文输入法
   * 
   * @example
   * let html = taskUtils.htmlDev(
   *   JSON.stringify({name: "test", value: 123}, null, 2)
   * )
   * // 可以在 WebView 中加载这个 HTML
   */
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
  /**
   * 💻 JavaScript 代码编辑器
   * 
   * 生成一个带语法高亮的 JavaScript 代码编辑器 HTML。
   * 使用 highlight.js 提供专业的代码高亮。
   * 
   * @param {string} content - JavaScript 代码内容
   * @returns {string} 完整的 HTML 页面代码
   * 
   * 特性：
   * - JavaScript 语法高亮
   * - 自定义 MN 相关类高亮
   * - 实时编辑
   * - 保持光标位置
   * - 响应式布局
   * 
   * @example
   * let code = `
   * function hello() {
   *   let note = MNNote.getFocusNote()
   *   MNUtil.showHUD("Hello " + note.noteTitle)
   * }
   * `
   * let html = taskUtils.JShtml(code)
   * // 在 WebView 中显示带高亮的代码
   */
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
  var TYPES = 'Object Function Boolean Symbol MNUtil MNNote taskUtils taskConfig';

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
  /**
   * 📋 专业 JSON 编辑器
   * 
   * 生成一个功能完整的 JSON 编辑器页面。
   * 基于 JSONEditor 库，提供树形和代码视图。
   * 
   * @returns {string} JSON 编辑器的 HTML 页面
   * 
   * 特性：
   * - 树形视图编辑
   * - 代码视图编辑
   * - 语法验证
   * - 格式化功能
   * - 搜索功能
   * - 撤销/重做
   * 
   * API 方法：
   * - updateContent(data) - 更新内容
   * - getContent() - 获取内容
   * 
   * @example
   * let editorHTML = taskUtils.jsonEditor()
   * // 在 WebView 中加载
   * webView.loadHTMLString(editorHTML)
   * 
   * // 通过 JavaScript 交互
   * webView.evaluateJavaScript(
   *   `updateContent('${encodeURIComponent(jsonStr)}')`
   * )
   */
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
  /**
   * 📄 通用 JSON 高亮编辑器
   * 
   * 生成一个简洁的 JSON 编辑器，带有语法高亮。
   * 适合在小窗口或移动设备上使用。
   * 
   * @param {string} content - JSON 内容
   * @returns {string} 完整的 HTML 页面
   * 
   * 特性：
   * - JSON 语法高亮
   * - 自适应布局
   * - 实时编辑
   * - 轻量级实现
   * 
   * @example
   * let jsonData = { name: "测试", items: [1, 2, 3] }
   * let html = taskUtils.html(
   *   JSON.stringify(jsonData, null, 2)
   * )
   * // 适合在浮动窗口中显示
   */
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
   * 💳 检查订阅状态
   * 
   * 检查用户是否有权限使用付费功能。
   * 支持免费额度和付费订阅两种模式。
   * 
   * @param {boolean} [count=true] - 是否消耗免费额度
   *   - true: 本次调用会消耗一次免费额度（如果当天未订阅）
   *   - false: 仅检查是否还有免费额度，不消耗
   * @param {boolean} [msg=true] - 是否显示提示信息
   * @param {boolean} [ignoreFree=false] - 是否忽略免费额度
   *   - true: 只检查订阅状态，不考虑免费额度
   *   - false: 同时考虑订阅状态和免费额度
   * @returns {boolean} 是否有权限使用功能
   * 
   * 工作原理：
   * 1. 未订阅用户每天有一定的免费使用额度
   * 2. 订阅用户无限制使用
   * 3. 需要安装 MN Utils 插件才能使用
   * 
   * @example
   * // 消耗一次免费额度
   * if (taskUtils.checkSubscribe()) {
   *   // 执行付费功能
   * }
   * 
   * // 仅检查状态，不消耗额度
   * if (taskUtils.checkSubscribe(false)) {
   *   MNUtil.showHUD("您还有免费额度可用")
   * }
   * 
   * // 忽略免费额度，仅检查订阅
   * if (taskUtils.checkSubscribe(true, true, true)) {
   *   // 只有订阅用户才能使用
   * }
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
  /**
   * 💎 检查是否已订阅
   * 
   * 简单检查用户是否已经订阅付费功能。
   * 与 checkSubscribe 不同，本方法只返回订阅状态，不涉及免费额度。
   * 
   * @param {boolean} [msg=true] - 是否显示错误提示（当 MN Utils 未安装时）
   * @returns {boolean} 是否已订阅
   * 
   * @example
   * // 检查订阅状态
   * if (taskUtils.isSubscribed()) {
   *   // 显示订阅用户专属功能
   *   MNUtil.showHUD("欢迎订阅用户！")
   * } else {
   *   // 显示免费版功能
   *   MNUtil.showHUD("您正在使用免费版")
   * }
   * 
   * // 静默检查（不显示错误提示）
   * let subscribed = taskUtils.isSubscribed(false)
   * 
   * // 根据订阅状态显示不同界面
   * if (taskUtils.isSubscribed()) {
   *   // 解锁全部功能
   *   showAllFeatures()
   * } else {
   *   // 显示基础功能 + 升级提示
   *   showBasicFeatures()
   *   showUpgradeButton()
   * }
   */
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
   * 📁 获取插件文件夹路径
   * 
   * 从完整路径中提取所在文件夹的路径。
   * 这是一个包装方法，内部调用 MNUtil.getFileFold()。
   * 
   * @param {string} fullPath - 文件的完整路径
   * @returns {string} 文件所在文件夹的路径
   * 
   * @example
   * // 获取当前插件的文件夹
   * let pluginPath = "/path/to/marginnote.extension.mntask/main.js"
   * let folder = taskUtils.getExtensionFolder(pluginPath)
   * // 返回: "/path/to/marginnote.extension.mntask"
   * 
   * // 用于检查其他插件是否存在
   * let extensionDir = taskUtils.getExtensionFolder(self.path)
   * let mnUtilsPath = extensionDir + "/marginnote.extension.mnutils/main.js"
   * if (NSFileManager.defaultManager().fileExistsAtPath(mnUtilsPath)) {
   *   console.log("MN Utils 已安装")
   * }
   * 
   * // 获取资源文件路径
   * let folder = taskUtils.getExtensionFolder(self.path)
   * let imagePath = folder + "/resources/images/icon.png"
   */
  static getExtensionFolder(fullPath) {
    return MNUtil.getFileFold(fullPath)  // 使用 MNUtil API 获取文件夹路径
  }
  /**
   * 🔍 检查 MN Utils 插件是否已安装
   * 
   * 检查系统中是否存在 MN Utils 插件。
   * MN Utils 是许多高级功能的基础依赖。
   * 
   * @param {string} fullPath - 当前插件的完整路径（通常是 self.path）
   * @returns {boolean} MN Utils 是否已安装
   * 
   * 检查逻辑：
   * 1. 获取插件文件夹的父目录
   * 2. 查找 marginnote.extension.mnutils/main.js 文件
   * 3. 如果不存在，显示提示信息
   * 
   * @example
   * // 在插件初始化时检查依赖
   * if (!taskUtils.checkMNUtilsFolder(self.path)) {
   *   // MN Utils 未安装，禁用高级功能
   *   disableAdvancedFeatures()
   *   return
   * }
   * 
   * // 在使用高级功能前检查
   * function useAdvancedFeature() {
   *   if (!taskUtils.checkMNUtilsFolder(self.path)) {
   *     return
   *   }
   *   // 继续执行高级功能
   * }
   * 
   * // 检查并引导安装
   * if (!taskUtils.checkMNUtilsFolder(self.path)) {
   *   MNUtil.showHUD("请先安装 MN Utils 插件")
   *   // 可以打开插件商店或提供下载链接
   * }
   */
  static checkMNUtilsFolder(fullPath){
    let extensionFolder = this.getExtensionFolder(fullPath)
    let folderExists = NSFileManager.defaultManager().fileExistsAtPath(extensionFolder+"/marginnote.extension.mnutils/main.js")
    if (!folderExists) {
      MNUtil.showHUD("MN Task: Please install 'MN Utils' first!")
    }
    return folderExists
  }
  /**
   * 🎯 聚焦到笔记
   * 
   * 将指定笔记聚焦到文档或脑图中。
   * 支持多种聚焦模式和来源选择。
   * 
   * @param {Object} des - 描述对象
   * @param {string} [des.noteURL] - 目标笔记的 URL（可选，默认使用当前焦点笔记）
   * @param {string} [des.source] - 目标来源
   *   - "parentNote" - 使用父笔记作为目标
   * @param {string} des.target - 聚焦目标（必需）
   *   - "doc" - 聚焦到文档中
   *   - "mindmap" - 聚焦到脑图中
   *   - "both" - 同时聚焦到文档和脑图
   *   - "floatMindmap" - 聚焦到浮动脑图
   * @param {boolean} [des.forceToFocus] - 强制聚焦（跨笔记本时）
   * @returns {Promise<void>}
   * 
   * 聚焦策略：
   * - 同笔记本：直接在当前窗口聚焦
   * - 跨笔记本：默认使用浮动窗口，forceToFocus 时打开新窗口
   * 
   * @example
   * // 聚焦当前笔记到文档
   * await taskUtils.focus({
   *   target: "doc"
   * })
   * 
   * // 聚焦特定笔记到脑图
   * await taskUtils.focus({
   *   noteURL: "marginnote4app://note/xxxxx",
   *   target: "mindmap"
   * })
   * 
   * // 聚焦父笔记到文档和脑图
   * await taskUtils.focus({
   *   source: "parentNote",
   *   target: "both"
   * })
   * 
   * // 强制聚焦跨笔记本的笔记
   * await taskUtils.focus({
   *   noteURL: otherNotebookNoteURL,
   *   target: "mindmap",
   *   forceToFocus: true  // 会打开新窗口
   * })
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
   * 🖍️ 创建高亮笔记
   * 
   * 从当前选中的文本或图片创建高亮笔记。
   * 支持 OCR、颜色设置、标签添加、合并等高级功能。
   * 
   * @param {Object} des - 描述对象
   * @param {boolean} [des.OCR] - 是否对选中的图片进行 OCR
   * @param {number} [des.color] - 笔记颜色索引（0-15）
   * @param {number} [des.fillPattern] - 填充样式索引
   * @param {boolean} [des.textFirst] - 是否文本优先显示
   * @param {boolean} [des.asTitle] - 是否将摘录文本作为标题
   * @param {string} [des.title] - 自定义标题
   * @param {string[]} [des.tags] - 要添加的标签数组
   * @param {string} [des.tag] - 要添加的单个标签
   * @param {boolean} [des.mergeToPreviousNote] - 是否合并到之前的笔记
   * @param {boolean} [des.mainMindMap] - 是否移到主脑图
   * @param {string} [des.parentNote] - 父笔记的 URL
   * @returns {Promise<MNNote|undefined>} 创建或修改的笔记对象
   * 
   * 工作流程：
   * 1. 检查是否有选中内容
   * 2. 如果需要 OCR，对图片进行文字识别
   * 3. 创建高亮笔记
   * 4. 应用各种属性和设置
   * 5. 处理合并或层级关系
   * 
   * @example
   * // 创建带颜色的高亮
   * let note = await taskUtils.noteHighlight({
   *   color: 2,  // 淡蓝色
   *   tags: ["重要", "待复习"]
   * })
   * 
   * // 创建并进行 OCR
   * let note = await taskUtils.noteHighlight({
   *   OCR: true,
   *   textFirst: true
   * })
   * 
   * // 合并到上一个笔记
   * let note = await taskUtils.noteHighlight({
   *   mergeToPreviousNote: true,
   *   color: 3  // 继承上一个笔记的颜色
   * })
   * 
   * // 创建并设置为某个笔记的子笔记
   * let note = await taskUtils.noteHighlight({
   *   parentNote: parentNote.noteURL,
   *   asTitle: true  // 摘录作为标题
   * })
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
          taskUtils.addErrorLog(error, "noteHighlight")
          resolve(undefined)
        }
      })
    })
  }
  /**
   * 📝 插入代码片段
   * 
   * 在文本视图或编辑器中插入文本片段。
   * 支持模板变量替换，自动检测光标位置。
   * 
   * @param {Object} des - 描述对象
   * @param {string} [des.target="textview"] - 插入目标
   *   - "textview" - 插入到当前文本视图
   *   - "editor" - 插入到编辑器
   * @param {string} des.content - 要插入的内容，支持模板变量
   * @returns {boolean} 是否插入成功
   * 
   * 支持的模板变量：
   * - {{note.*}} - 笔记相关信息
   * - {{date.*}} - 日期相关信息
   * - {{cursor}} - 光标位置标记
   * - 其他通过 detectAndReplace 支持的变量
   * 
   * @example
   * // 插入简单文本
   * taskUtils.insertSnippet({
   *   content: "Hello World"
   * })
   * 
   * // 插入带模板变量的内容
   * taskUtils.insertSnippet({
   *   content: "创建于：{{date.year}}-{{date.month}}-{{date.day}}\n标题：{{note.title}}"
   * })
   * 
   * // 插入到编辑器
   * taskUtils.insertSnippet({
   *   target: "editor",
   *   content: "// TODO: {{cursor}}"  // 光标会定位到 {{cursor}} 位置
   * })
   * 
   * // 插入代码模板
   * taskUtils.insertSnippet({
   *   content: "function {{note.title}}() {\n  {{cursor}}\n}"
   * })
   */
  static insertSnippet(des){
    let target = des.target ?? "textview"
    let success = true
    switch (target) {
      case "textview":
        let textView = taskUtils.textView
        if (!textView || textView.hidden) {
          MNUtil.showHUD("No textView")
          success = false
          break;
        }
        let textContent = taskUtils.detectAndReplace(des.content)
        success = taskUtils.insertSnippetToTextView(textContent,textView)
        break;
      case "editor":
        let contents = [
          {
            type:"text",
            content:taskUtils.detectAndReplace(des.content)
          }
        ]
        MNUtil.postNotification("editorInsert", {contents:contents})
        break;
      default:
        break;
    }
    return success
  }
  /**
   * 📦 移动笔记
   * 
   * 将焦点笔记移动到指定位置。
   * 支持移到主脑图或指定的父笔记下。
   * 
   * @param {Object} des - 描述对象
   * @param {boolean} [des.mainMindMap] - 是否移到主脑图（最顶层）
   * @param {string} [des.noteURL] - 目标父笔记的 URL
   * @returns {Promise<void>}
   * 
   * 移动规则：
   * - mainMindMap: 将笔记移到最顶层，从任何父笔记中移除
   * - noteURL: 将笔记作为子笔记添加到指定父笔记
   * - 只能在同一笔记本内移动
   * 
   * @example
   * // 移到主脑图（顶层）
   * await taskUtils.moveNote({
   *   mainMindMap: true
   * })
   * 
   * // 移到特定父笔记下
   * let parentNote = MNNote.getFocusNote()
   * await taskUtils.moveNote({
   *   noteURL: parentNote.noteURL
   * })
   * 
   * // 批量移动多个笔记
   * // 先选中多个笔记，然后执行
   * await taskUtils.moveNote({
   *   noteURL: targetParent.noteURL
   * })
   * 
   * // 整理笔记结构
   * let chapterNote = findChapterNote()
   * await taskUtils.moveNote({
   *   noteURL: chapterNote.noteURL  // 将选中的笔记移到章节下
   * })
   */
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
   * 🪟 检查视图是否在当前窗口中
   * 
   * 判断指定的视图是否是当前窗口的子视图。
   * 用于确定视图的层级关系和可见性。
   *
   * @param {UIView} view - 要检查的视图对象
   * @returns {boolean} 视图是否在当前窗口中
   * 
   * 使用场景：
   * - 判断按钮是否在当前窗口
   * - 检查弹出菜单的归属
   * - 处理多窗口场景
   * - 防止跨窗口操作
   * 
   * @example
   * // 检查按钮是否在当前窗口
   * let button = sender
   * if (taskUtils.isDescendantOfCurrentWindow(button)) {
   *   // 按钮在当前窗口，可以安全操作
   *   showMenuAtButton(button)
   * } else {
   *   // 按钮不在当前窗口，需要特殊处理
   *   MNUtil.showHUD("请在当前窗口操作")
   * }
   * 
   * // 验证工具栏是否可见
   * if (taskUtils.isDescendantOfCurrentWindow(self.view)) {
   *   // 工具栏在当前窗口中
   *   updateTaskPosition()
   * }
   * 
   * // 多窗口支持检查
   * let views = getAllTaskViews()
   * let currentWindowViews = views.filter(view => 
   *   taskUtils.isDescendantOfCurrentWindow(view)
   * )
   */
  static isDescendantOfCurrentWindow(view){
    return view.isDescendantOfView(MNUtil.currentWindow)
  }
  /**
   * 📐 切换侧边栏
   * 
   * 打开或关闭插件侧边栏面板。
   * 支持通用侧边栏和特定插件（如 ChatAI）的侧边栏。
   * 
   * @param {Object} des - 描述对象
   * @param {string} [des.target] - 特定的侧边栏目标
   *   - "chatMode" - ChatAI 聊天模式侧边栏
   *   - 不指定则切换通用侧边栏
   * 
   * 工作原理：
   * - 使用 MNExtensionPanel 管理侧边栏
   * - 支持多个插件共享侧边栏空间
   * - 自动处理视图的显示/隐藏
   * - 记住上次的状态
   * 
   * @example
   * // 切换通用侧边栏
   * taskUtils.toggleSidebar({})
   * 
   * // 打开 ChatAI 侧边栏
   * taskUtils.toggleSidebar({
   *   target: "chatMode"
   * })
   * 
   * // 在按钮点击时切换
   * onButtonClick: function() {
   *   taskUtils.toggleSidebar({})
   * }
   * 
   * // 条件切换
   * if (needSidebar) {
   *   taskUtils.toggleSidebar({
   *     target: "chatMode"
   *   })
   * } else {
   *   // 关闭侧边栏
   *   MNUtil.toggleExtensionPanel()
   * }
   */
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
              taskUtils.addErrorLog(error, "openSideBar")
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
  /**
   * 🎨 设置笔记颜色
   * 
   * 为选中的笔记或高亮设置颜色和填充样式。
   * 支持自动样式跟随和批量设置。
   * 
   * @param {Object} des - 描述对象
   * @param {number} des.color - 颜色索引（0-15）
   * @param {number} [des.fillPattern] - 填充样式索引
   * @param {boolean} [des.followAutoStyle] - 是否跟随自动样式（需要 AutoStyle 插件）
   * @param {boolean} [des.hideMessage] - 是否隐藏提示信息
   * @returns {Promise<void>}
   * 
   * 颜色索引对应：
   * - 0: 淡黄色  1: 淡绿色  2: 淡蓝色  3: 淡红色
   * - 4: 黄色    5: 绿色    6: 蓝色    7: 红色
   * - 8: 橙色    9: 深绿色  10: 深蓝色 11: 深红色
   * - 12: 白色   13: 浅灰色 14: 深灰色 15: 紫色
   * 
   * @example
   * // 设置为蓝色
   * await taskUtils.setColor({
   *   color: 6
   * })
   * 
   * // 设置颜色和填充样式
   * await taskUtils.setColor({
   *   color: 2,      // 淡蓝色
   *   fillPattern: 1 // 填充样式
   * })
   * 
   * // 跟随自动样式（需要 AutoStyle 插件）
   * await taskUtils.setColor({
   *   color: 3,
   *   followAutoStyle: true  // 图片和文本使用不同的填充样式
   * })
   * 
   * // 批量设置多个笔记颜色
   * // 先选中多个笔记，然后：
   * await taskUtils.setColor({
   *   color: 5,  // 全部设为绿色
   *   hideMessage: true  // 不显示提示
   * })
   */
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
          taskUtils.addErrorLog(error, "setColor")
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
    taskUtils.addErrorLog(error, "setColor")
  }
  }
  /**
   * 🔄 切换标题和摘录
   * 
   * 智能切换笔记的标题和摘录内容。
   * 支持多种切换逻辑，包括从评论提取标题。
   * 
   * @returns {boolean} 操作是否成功
   * 
   * 切换逻辑：
   * 1. 如果标题和摘录都为空，尝试从第一个评论提取标题
   * 2. 如果标题和摘录都存在且不同，将标题移到摘录，摘录变为评论
   * 3. 如果只有一个存在，则互换位置
   * 4. 如果标题和摘录相同，清空标题（MN 只显示标题的情况）
   * 5. 自动去除摘录中的加粗标记（**）
   * 
   * @example
   * // 基本使用
   * let success = taskUtils.switchTitleOrExcerpt()
   * if (success) {
   *   MNUtil.showHUD("✅ 切换成功")
   * }
   * 
   * // 常见场景：
   * // 场景1：只有标题 "重要概念"
   * taskUtils.switchTitleOrExcerpt()
   * // 结果：标题变空，摘录变为 "重要概念"
   * 
   * // 场景2：标题 "第一章"，摘录 "介绍内容"
   * taskUtils.switchTitleOrExcerpt()
   * // 结果：标题变空，摘录变为 "第一章"，原摘录变为评论
   * 
   * // 场景3：标题和摘录都为空，第一个评论是 "待整理"
   * taskUtils.switchTitleOrExcerpt()
   * // 结果：标题变为 "待整理"，评论被移除
   * 
   * // 场景4：摘录中有划重点标记 "这是**重点**内容"
   * taskUtils.switchTitleOrExcerpt()
   * // 结果：标题变为 "这是重点内容"（自动去除**）
   */
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
   * 🎨 设置单个笔记的颜色（内部方法）
   * 
   * 为指定笔记设置颜色和填充样式。
   * 自动处理合并笔记的情况，确保所有相关笔记颜色一致。
   * 
   * @param {MNNote} note - 要设置颜色的笔记对象
   * @param {number} colorIndex - 颜色索引（0-15）
   * @param {number} fillIndex - 填充样式索引（-1 表示不设置）
   * 
   * 处理逻辑：
   * 1. 检查是否有合并的笔记组
   * 2. 如果有合并组，设置所有相关笔记
   * 3. 如果没有，只设置当前笔记及其链接
   * 4. fillIndex 为 -1 时保持原有填充样式
   * 
   * @example
   * // 设置单个笔记颜色
   * let note = MNNote.getFocusNote()
   * taskUtils.setNoteColor(note, 2, 1)  // 淡蓝色，填充样式1
   * 
   * // 只改变颜色，不改变填充样式
   * taskUtils.setNoteColor(note, 5, -1)  // 绿色，保持原填充
   * 
   * // 处理合并笔记
   * // 如果 note 是合并笔记的一部分，所有相关笔记都会被设置
   * taskUtils.setNoteColor(mergedNote, 7, 2)
   * 
   * // 批量处理时的内部调用
   * focusNotes.forEach(note => {
   *   taskUtils.setNoteColor(note, colorIndex, fillIndex)
   * })
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
   * 🗺️ 获取脑图视图
   * 
   * 从文本视图获取其所属的脑图视图。
   * 支持主脑图和浮动脑图的识别。
   * 
   * @param {UITextView} textView - 文本视图对象（通常是笔记编辑框）
   * @returns {UIView|undefined} 脑图视图对象，找不到返回 undefined
   * 
   * 查找逻辑：
   * 1. 先检查是否在主脑图视图中
   * 2. 如果不在，尝试通过视图层级查找浮动脑图
   * 3. 验证找到的视图确实是脑图视图
   * 4. 缓存浮动脑图视图引用
   * 
   * @example
   * // 获取当前编辑文本框所在的脑图
   * let textView = self.textView
   * let mindmapView = taskUtils.getMindmapview(textView)
   * if (mindmapView) {
   *   console.log("找到脑图视图")
   *   // 可以进行脑图相关操作
   * }
   * 
   * // 判断是主脑图还是浮动脑图
   * let mindmap = taskUtils.getMindmapview(textView)
   * if (mindmap === MNUtil.mindmapView) {
   *   console.log("在主脑图中")
   * } else if (mindmap === MNUtil.floatMindMapView) {
   *   console.log("在浮动脑图中")
   * }
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
  /**
   * 📄 检查文本视图是否在扩展模式中
   * 
   * 【什么是扩展模式？】
   * MarginNote 支持多种笔记显示模式：
   * - 嵌入模式：笔记直接嵌入在文档中
   * - 折叠模式：笔记可以折叠/展开
   * - 页边模式：笔记显示在页面边缘
   * 
   * 【工作原理】
   * 通过检查视图的层级关系来判断当前模式。
   * 不同模式下，textView 到 readerController.view 的层级深度不同：
   * - 嵌入模式：8 层
   * - 折叠模式：9 层
   * - 页边模式：13 层
   * 
   * @param {UITextView} textView - 要检查的文本视图
   * @returns {boolean} 如果在扩展模式中返回 true，否则返回 false
   * 
   * @example
   * // 在处理文本视图前检查模式
   * let textView = note.textView
   * if (taskUtils.checkExtendView(textView)) {
   *   // 在扩展模式中，可能需要特殊处理
   *   MNUtil.showHUD("当前处于扩展模式")
   * } else {
   *   // 正常模式
   * }
   * 
   * // 根据模式调整 UI 布局
   * if (taskUtils.checkExtendView(textView)) {
   *   // 扩展模式下可能需要更多空间
   *   menuWidth = 300
   * } else {
   *   menuWidth = 200
   * }
   * 
   * 💡 提示：
   * - 该方法通过链式访问 superview 来判断层级
   * - 使用 try-catch 防止视图层级不完整时出错
   * - 不同版本的 MarginNote 可能层级结构有差异
   */
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
  /**
   * 🎨 验证十六进制颜色格式
   * 
   * 检查字符串是否为有效的 6 位十六进制颜色代码。
   * 只接受标准的 #RRGGBB 格式。
   * 
   * 【颜色格式说明】
   * - # 开头
   * - 后跟 6 位十六进制字符（0-9, A-F, a-f）
   * - 每两位代表一个颜色通道：RR（红）GG（绿）BB（蓝）
   * - 每个通道的值范围：00-FF（0-255）
   * 
   * @param {string} str - 要验证的字符串
   * @returns {boolean} 如果是有效的十六进制颜色返回 true，否则返回 false
   * 
   * @example
   * // ✅ 有效的颜色格式
   * taskUtils.isHexColor("#FF0000")  // true - 红色
   * taskUtils.isHexColor("#00ff00")  // true - 绿色（小写也可以）
   * taskUtils.isHexColor("#0080FF")  // true - 天蓝色
   * 
   * // ❌ 无效的颜色格式
   * taskUtils.isHexColor("FF0000")   // false - 缺少 #
   * taskUtils.isHexColor("#FFF")     // false - 只有 3 位
   * taskUtils.isHexColor("#GGHHII")  // false - 包含无效字符
   * taskUtils.isHexColor("red")      // false - 颜色名称
   * 
   * // 在设置颜色前验证
   * let userColor = "#FF5733"
   * if (taskUtils.isHexColor(userColor)) {
   *   button.backgroundColor = MNUtil.hexColor(userColor)
   * } else {
   *   MNUtil.showHUD("请输入有效的颜色代码，如 #FF0000")
   * }
   * 
   * 💡 注意：
   * - 目前只支持 6 位格式，不支持 3 位简写（如 #FFF）
   * - 不支持 RGB、RGBA 或颜色名称
   * - 大小写不敏感
   */
  static isHexColor(str) {
    // 正则表达式匹配 3 位或 6 位的十六进制颜色代码
    const hexColorPattern = /^#([A-Fa-f0-9]{6})$/;
    return hexColorPattern.test(str);
  }
  /**
   * 📐 解析窗口矩形字符串
   * 
   * 将 WinRect 格式的字符串解析为 frame 对象。
   * WinRect 是 MarginNote 用于存储窗口位置和大小的格式。
   * 
   * 【WinRect 格式】
   * "{{x, y}, {width, height}}" - 类似于 iOS 的 CGRect 描述
   * 
   * @param {string} winRect - WinRect 格式的字符串
   * @returns {CGRect} 解析后的 frame 对象 {x, y, width, height}
   * 
   * @example
   * // 解析存储的窗口位置
   * let savedRect = "{{100, 50}, {300, 400}}"
   * let frame = taskUtils.parseWinRect(savedRect)
   * // frame = {x: 100, y: 50, width: 300, height: 400}
   * 
   * // 恢复窗口位置
   * let lastPosition = config.get("windowPosition")
   * if (lastPosition) {
   *   let frame = taskUtils.parseWinRect(lastPosition)
   *   window.frame = frame
   * }
   * 
   * // 配合其他方法使用
   * let rectString = "{{0, 0}, {500, 600}}"
   * let rect = taskUtils.parseWinRect(rectString)
   * Frame.set(view, rect.x, rect.y, rect.width, rect.height)
   * 
   * 💡 提示：
   * - 该方法直接调用 MNUtil.parseWinRect
   * - 通常用于解析配置文件中保存的位置信息
   * - 格式错误时可能返回 undefined 或抛出异常
   */
  static parseWinRect(winRect){
    return MNUtil.parseWinRect(winRect)
  }
  /**
   * 🎨 获取按钮颜色
   * 
   * 根据订阅状态和配置返回适当的按钮颜色。
   * 支持系统预定义颜色和自定义十六进制颜色。
   * 
   * 【颜色策略】
   * 1. 未订阅：返回白色半透明 (#ffffff, 85%)
   * 2. 已订阅：
   *    - 系统颜色：使用 MarginNote 的预定义颜色
   *    - 自定义颜色：使用配置中的十六进制颜色
   * 
   * 【支持的系统颜色】
   * - defaultBookPageColor: 默认书页颜色
   * - defaultHighlightBlendColor: 默认高亮混合颜色
   * - defaultDisableColor: 默认禁用颜色
   * - defaultTextColor: 默认文本颜色
   * - defaultNotebookColor: 默认笔记本颜色
   * - defaultTintColor: 默认主题色
   * - defaultTintColorForSelected: 默认选中主题色
   * - defaultTintColorForDarkBackground: 深色背景主题色
   * 
   * @returns {UIColor} 按钮颜色对象（包含透明度）
   * 
   * @example
   * // 设置按钮颜色
   * let button = UIButton.new()
   * button.backgroundColor = taskUtils.getButtonColor()
   * 
   * // 动态更新按钮颜色
   * function updateButtonStyle() {
   *   allButtons.forEach(btn => {
   *     btn.backgroundColor = taskUtils.getButtonColor()
   *   })
   * }
   * 
   * // 配置示例
   * taskConfig.buttonConfig = {
   *   color: "defaultTintColor",  // 或 "#FF6B6B"
   *   alpha: 0.9                   // 透明度 0-1
   * }
   * 
   * 💡 提示：
   * - 透明度由 buttonConfig.alpha 控制
   * - 颜色会根据系统主题自动适应
   * - 未订阅时使用固定颜色以示区分
   */
  static getButtonColor(){
    if (!this.isSubscribed(false)) {
      return MNUtil.hexColorAlpha("#ffffff", 0.85)
    }
    // let color = MNUtil.app.defaultBookPageColor.hexStringValue
    // MNUtil.copy(color)
    let varColors = ["defaultBookPageColor","defaultHighlightBlendColor","defaultDisableColor","defaultTextColor","defaultNotebookColor","defaultTintColor","defaultTintColorForSelected","defaultTintColorForDarkBackground"]
    if (varColors.includes(taskConfig.buttonConfig.color)) {
      return MNUtil.app[taskConfig.buttonConfig.color].colorWithAlphaComponent(taskConfig.buttonConfig.alpha)
    }
    // if () {
      
    // }
    return MNUtil.hexColorAlpha(taskConfig.buttonConfig.color, taskConfig.buttonConfig.alpha)
  }
  /**
   * 🌐 从 URL 下载图片
   * 
   * 从网络下载图片并返回 UIImage 对象。
   * 下载过程中会显示 HUD 提示。
   * 
   * 【使用场景】
   * - 下载用户头像
   * - 获取在线按钮图标
   * - 加载远程图片资源
   * 
   * @param {string} url - 图片的完整 URL 地址
   * @param {number} [scale=3] - 图片缩放比例（默认 3x，适合 Retina 显示）
   * @returns {UIImage|undefined} 成功返回 UIImage 对象，失败返回 undefined
   * 
   * @example
   * // 下载并设置按钮图标
   * let iconURL = "https://example.com/icon.png"
   * let image = taskUtils.getOnlineImage(iconURL)
   * if (image) {
   *   button.setImageForState(image, 0)  // 0 = UIControlStateNormal
   * }
   * 
   * // 下载高清图片（指定缩放）
   * let hdImage = taskUtils.getOnlineImage(imageURL, 2)
   * 
   * // 异步下载多张图片
   * async function downloadImages(urls) {
   *   let images = []
   *   for (let url of urls) {
   *     let img = taskUtils.getOnlineImage(url)
   *     if (img) images.push(img)
   *     await MNUtil.delay(0.1)  // 避免过快请求
   *   }
   *   return images
   * }
   * 
   * ⚠️ 注意事项：
   * - 该方法是同步的，会阻塞 UI
   * - 下载大图片时可能造成卡顿
   * - 建议在后台线程或使用异步方式
   * - 没有缓存机制，每次调用都会重新下载
   */
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
  /**
   * 🎯 运行 iOS 快捷指令
   * 
   * 调用 iOS/iPadOS 的快捷指令应用执行指定的快捷指令。
   * 可以传递输入参数给快捷指令。
   * 
   * 【快捷指令是什么？】
   * - Apple 的自动化工具，可以创建多步骤的自动化流程
   * - 通过 URL Scheme 可以从其他应用启动快捷指令
   * - 支持传递参数和接收返回值
   * 
   * @param {string} name - 快捷指令的名称（需要与快捷指令应用中的名称完全匹配）
   * @param {Object} [des] - 可选参数对象
   * @param {string} [des.input] - 传递给快捷指令的输入参数
   * @param {string} [des.text] - 传递给快捷指令的文本参数（会进行变量替换）
   * 
   * @example
   * // 简单运行快捷指令
   * taskUtils.shortcut("整理笔记")
   * 
   * // 传递输入参数
   * taskUtils.shortcut("翻译文本", {
   *   input: "Hello World"
   * })
   * 
   * // 传递带变量的文本
   * taskUtils.shortcut("创建任务", {
   *   text: "阅读笔记: {{noteTitle}}"
   * })
   * 
   * // 处理选中的笔记
   * let note = MNNote.getFocusNote()
   * if (note) {
   *   taskUtils.shortcut("导出到 Notion", {
   *     input: note.noteTitle,
   *     text: note.excerptText
   *   })
   * }
   * 
   * // 批量处理
   * function processNotes(notes) {
   *   let titles = notes.map(n => n.noteTitle).join("\n")
   *   taskUtils.shortcut("批量处理", {
   *     text: titles
   *   })
   * }
   * 
   * 💡 提示：
   * - 快捷指令名称必须与快捷指令 app 中的名称完全一致
   * - text 参数会调用 detectAndReplace 进行变量替换
   * - URL 会自动进行 URI 编码
   * - 仅在 iOS/iPadOS 上可用
   */
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
   * 📝 导出 Markdown 内容
   * 
   * 将 Markdown 格式的内容导出到文件或剪贴板。
   * 支持多种导出方式，可以根据用户需求选择。
   * 
   * @param {string} content - 要导出的 Markdown 内容
   * @param {string} [target="auto"] - 导出目标
   *   - "file": 保存为文件（弹出文件保存对话框）
   *   - "clipboard": 复制到剪贴板
   *   - "auto": 自动选择（默认为剪贴板）
   * 
   * @example
   * // 导出到剪贴板（默认）
   * let markdown = "# 标题\n\n这是内容"
   * taskUtils.exportMD(markdown)
   * 
   * // 保存为文件
   * let content = "# 笔记总结\n\n..."
   * taskUtils.exportMD(content, "file")
   * 
   * // 导出笔记内容
   * let note = MNNote.getFocusNote()
   * let md = await taskUtils.getMDFromNote(note)
   * taskUtils.exportMD(md, "clipboard")
   * 
   * // 批量导出
   * let allMarkdown = notes.map(note => {
   *   return `## ${note.noteTitle}\n${note.excerptText}`
   * }).join("\n\n---\n\n")
   * taskUtils.exportMD(allMarkdown, "file")
   * 
   * 💡 提示：
   * - 文件保存时会使用 export.md 作为默认文件名
   * - 用户可以在保存对话框中修改文件名和保存位置
   * - 剪贴板方式更适合快速分享
   */
  static exportMD(content,target = "auto"){
    switch (target) {
      case "file":
        MNUtil.writeText(taskConfig.mainPath+"/export.md",content)
        MNUtil.saveFile(taskConfig.mainPath+"/export.md", ["public.md"])
        break;
      case "auto":
      case "clipboard":
        MNUtil.copy(content)
        break;
      default:
        break;
    }
  }
  /**
   * 📤 导出功能主入口
   * 
   * 根据配置导出不同类型的内容，支持 PDF 文档和 Markdown 笔记。
   * 可以导出单个笔记、笔记和子笔记、或整个文档。
   * 
   * 【导出源类型】
   * - noteDoc: 笔记对应的 PDF 文档
   * - noteMarkdown: 笔记转换为 Markdown
   * - noteMarkdownOCR: 笔记转 Markdown（包含 OCR 识别）
   * - noteWithDecendentsMarkdown: 笔记及其所有子笔记转 Markdown
   * - currentDoc: 当前浏览的 PDF 文档
   * 
   * @param {Object} des - 导出配置对象
   * @param {string} [des.source="noteDoc"] - 导出源类型
   * @param {string} [des.target="auto"] - 导出目标 ("file", "clipboard", "auto")
   * @returns {Promise<void>}
   * 
   * @example
   * // 导出笔记对应的 PDF
   * await taskUtils.export({
   *   source: "noteDoc"
   * })
   * 
   * // 导出笔记为 Markdown 到剪贴板
   * await taskUtils.export({
   *   source: "noteMarkdown",
   *   target: "clipboard"
   * })
   * 
   * // 导出笔记及子笔记（包含 OCR）
   * await taskUtils.export({
   *   source: "noteMarkdownOCR",
   *   target: "file"
   * })
   * 
   * // 导出整个笔记树
   * await taskUtils.export({
   *   source: "noteWithDecendentsMarkdown",
   *   target: "file"
   * })
   * 
   * // 导出当前文档
   * await taskUtils.export({
   *   source: "currentDoc"
   * })
   * 
   * 💡 使用技巧：
   * - OCR 选项适用于包含图片摘录的笔记
   * - 导出子笔记时会保持层级结构
   * - PDF 导出会弹出系统文件保存对话框
   * - 没有选中笔记时，某些选项会默认导出当前文档
   */
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
      taskUtils.addErrorLog(error, "export")
  }
  }
  /**
   * 📄 将笔记转换为 Markdown 格式
   * 
   * 将 MarginNote 笔记对象转换为格式化的 Markdown 文本。
   * 支持标题、摘录、评论和 OCR 识别。
   * 
   * 【处理内容】
   * 1. 笔记标题 → Markdown 标题（# 开头）
   * 2. 摘录内容：
   *    - 文本摘录：直接转换
   *    - 图片摘录：可选 OCR 识别
   * 3. 评论内容：
   *    - 文本评论：附加到摘录后
   *    - HTML 评论：保留格式
   *    - 链接评论：提取链接文本
   *    - 手写评论：可 OCR 识别
   * 
   * @param {MNNote} note - 要转换的笔记对象
   * @param {number} [level=0] - 标题级别偏移（用于子笔记层级）
   * @param {boolean} [OCR_enabled=false] - 是否启用 OCR 识别图片
   * @returns {Promise<string>} 转换后的 Markdown 字符串
   * 
   * @example
   * // 基本转换
   * let note = MNNote.getFocusNote()
   * let markdown = await taskUtils.getMDFromNote(note)
   * console.log(markdown)
   * // 输出: "# 笔记标题\n这是摘录内容"
   * 
   * // 启用 OCR
   * let mdWithOCR = await taskUtils.getMDFromNote(note, 0, true)
   * 
   * // 处理子笔记（增加标题级别）
   * let childMd = await taskUtils.getMDFromNote(childNote, 2)
   * // 原本 # 标题会变成 ### 标题
   * 
   * // 批量转换
   * let notes = MNNote.getFocusNotes()
   * let markdowns = await Promise.all(
   *   notes.map(n => taskUtils.getMDFromNote(n))
   * )
   * let fullDoc = markdowns.join("\n\n---\n\n")
   * 
   * ⚠️ 注意事项：
   * - 会自动过滤掉标题中的变量标记 {{...}}
   * - 会过滤掉 MarginNote 内部链接（marginnote3app://）
   * - OCR 需要时间，大量图片时可能较慢
   * - 高亮标记 <mark> 会转换为 ==...==
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
  /**
   * 🔄 转换高亮标记格式
   * 
   * 将 HTML 的 <mark> 标签转换为 Markdown 的 == 高亮语法。
   * 这是 getMDFromNote 方法的辅助函数。
   * 
   * 【转换规则】
   * <mark>高亮文本</mark> → ==高亮文本==
   * 
   * @param {string} markdown - 包含 <mark> 标签的文本
   * @returns {string} 转换后的 Markdown 文本
   * 
   * @example
   * let html = "这是<mark>重要内容</mark>和<mark>关键词</mark>"
   * let md = taskUtils.highlightEqualsContentReverse(html)
   * console.log(md)
   * // 输出: "这是==重要内容==和==关键词=="
   * 
   * // 在导出流程中使用
   * let noteText = note.excerptText  // 可能包含 <mark> 标签
   * let markdownText = taskUtils.highlightEqualsContentReverse(noteText)
   * 
   * 💡 说明：
   * - 使用非贪婪匹配 (.+?) 确保正确处理多个标签
   * - Markdown 中 == 语法在某些解析器中表示高亮
   * - 与 highlightEqualsContent 方法互为反向操作
   */
  static highlightEqualsContentReverse(markdown) {
      // 使用正则表达式匹配==xxx==的内容并替换为<mark>xxx</mark>
      return markdown.replace(/<mark>(.+?)<\/mark>/g, '==\$1==');
  }
  /**
   * 📢 限制数值范围
   * 
   * 将数值限制在指定的最小值和最大值之间。
   * 超出范围的值会被截断到边界值。
   * 
   * @param {number} value - 要限制的数值
   * @param {number} min - 最小值
   * @param {number} max - 最大值
   * @returns {number} 限制后的数值
   * 
   * @example
   * // 基本使用
   * taskUtils.constrain(50, 0, 100)   // 50 - 在范围内
   * taskUtils.constrain(150, 0, 100)  // 100 - 超过最大值
   * taskUtils.constrain(-10, 0, 100)  // 0 - 低于最小值
   * 
   * // 限制 UI 元素位置
   * let x = event.locationInView(view).x
   * x = taskUtils.constrain(x, 0, view.bounds.width)
   * button.frame = {x: x, y: 0, width: 50, height: 30}
   * 
   * // 限制缩放比例
   * let scale = userScale
   * scale = taskUtils.constrain(scale, 0.5, 3.0)
   * view.transform = {a: scale, d: scale}
   * 
   * // 限制透明度
   * let alpha = calculateAlpha()
   * view.alpha = taskUtils.constrain(alpha, 0, 1)
   * 
   * 💡 使用场景：
   * - UI 元素位置限制（防止超出屏幕）
   * - 参数值验证（确保在有效范围内）
   * - 动画值计算（防止异常值）
   * - 用户输入限制
   */
  static constrain(value, min, max) {
    return MNUtil.constrain(value, min, max)
  }
/**
 * 📐 获取按钮在 Study View 中的位置
 * 
 * 将按钮的局部坐标转换为在 Study View（学习界面）中的全局坐标。
 * 常用于计算弹出菜单、浮动窗口等 UI 元素的显示位置。
 * 
 * @param {UIButton} button - 要获取位置的按钮对象
 * @returns {CGRect} 按钮在 Study View 中的 frame
 * 
 * CGRect 包含：
 * - x: 左边缘的 X 坐标
 * - y: 上边缘的 Y 坐标  
 * - width: 宽度
 * - height: 高度
 * 
 * @example
 * // 在按钮旁边显示菜单
 * let buttonFrame = taskUtils.getButtonFrame(myButton)
 * let menuFrame = {
 *   x: buttonFrame.x + buttonFrame.width + 10,  // 按钮右侧 10 像素
 *   y: buttonFrame.y,
 *   width: 200,
 *   height: 300
 * }
 * menu.show(menuFrame)
 * 
 * // 在按钮下方显示浮窗
 * let frame = taskUtils.getButtonFrame(button)
 * let popupY = frame.y + frame.height + 5
 * showPopup(frame.x, popupY)
 * 
 * // 计算是否靠近屏幕边缘
 * let btnFrame = taskUtils.getButtonFrame(button)
 * let screenWidth = MNUtil.studyView.bounds.width
 * if (btnFrame.x + 200 > screenWidth) {
 *   // 菜单显示在按钮左侧
 * }
 */
static getButtonFrame(button){
  let buttonFrame = button.convertRectToView(button.frame, MNUtil.studyView)
  return buttonFrame
}
  /**
   * 🎨 获取模板名称列表
   * 
   * 根据指定的按钮类型返回预定义的模板名称列表。
   * 用于在设置界面为不同的按钮提供快速模板选择。
   * 
   * @param {string} item - 按钮类型标识
   * @returns {string[]|undefined} 模板名称数组，如果不能保存则返回 undefined
   * 
   * 支持的按钮类型：
   * - "ocr" - OCR 相关模板
   * - "search" - 搜索相关模板
   * - "chatglm" - AI 聊天相关模板
   * - "copy" - 复制相关模板
   * - "color0-15" - 颜色标记相关模板
   * - 其他 - 返回通用模板列表
   * 
   * @example
   * // 获取 OCR 按钮的模板
   * let ocrTemplates = taskUtils.getTempelateNames("ocr")
   * // ["🔨 OCR to clipboard", "🔨 OCR as chat mode reference", ...]
   * 
   * // 获取颜色按钮的模板
   * let colorTemplates = taskUtils.getTempelateNames("color1")
   * // ["🔨 setColor default", "🔨 with fillpattern: both", ...]
   * 
   * // 获取通用模板
   * let generalTemplates = taskUtils.getTempelateNames("custom")
   * // ["🔨 empty action", "🔨 insert snippet", ...]
   */
  static getTempelateNames(item){
    if (!taskConfig.checkCouldSave(item)) {
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
  /**
   * 📄 从 Markdown 中提取 JSON
   * 
   * 从 Markdown 文本中提取被 ```JSON``` 代码块包裹的 JSON 内容。
   * 常用于处理 AI 返回的格式化结果或配置文件。
   * 
   * @param {string} markdown - 包含 JSON 代码块的 Markdown 文本
   * @returns {Object|undefined} 解析后的 JSON 对象，未找到则返回 undefined
   * 
   * @example
   * // 提取 JSON 数据
   * let markdown = `
   * 这是一些说明文字
   * \`\`\`JSON
   * {
   *   "name": "示例",
   *   "value": 123,
   *   "items": ["a", "b", "c"]
   * }
   * \`\`\`
   * 这是后续内容
   * `
   * 
   * let data = taskUtils.extractJSONFromMarkdown(markdown)
   * console.log(data.name)  // "示例"
   * console.log(data.value) // 123
   * 
   * // 处理 AI 返回的结构化数据
   * let aiResponse = await chatWithAI("请用 JSON 格式返回...")
   * let result = taskUtils.extractJSONFromMarkdown(aiResponse)
   * if (result) {
   *   // 使用提取的数据
   * }
   */
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
  /**
   * 🏷️ 添加标签
   * 
   * 为当前选中的笔记批量添加标签。
   * 支持单个标签或多个标签，支持模板变量。
   * 
   * @param {Object} des - 描述对象
   * @param {string} [des.tag] - 单个标签（与 tags 二选一）
   * @param {string[]} [des.tags] - 标签数组（与 tag 二选一）
   * 
   * 特性：
   * - 支持模板变量替换（如 {{date.year}}）
   * - 使用撤销分组，可一键撤销
   * - 批量处理选中的所有笔记
   * 
   * @example
   * // 添加单个标签
   * taskUtils.addTags({
   *   tag: "重要"
   * })
   * 
   * // 添加多个标签
   * taskUtils.addTags({
   *   tags: ["待复习", "第一章", "概念"]
   * })
   * 
   * // 使用模板变量
   * taskUtils.addTags({
   *   tags: ["{{date.year}}-{{date.month}}", "{{note.notebook.name}}"]
   * })
   * 
   * // 动态标签
   * taskUtils.addTags({
   *   tag: "已处理-{{date.month}}/{{date.day}}"
   * })
   */
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
  /**
   * 🏷️ 移除标签
   * 
   * 从当前选中的笔记批量移除指定标签。
   * 支持单个标签或多个标签的移除。
   * 
   * @param {Object} des - 描述对象
   * @param {string} [des.tag] - 要移除的单个标签（与 tags 二选一）
   * @param {string[]} [des.tags] - 要移除的标签数组（与 tag 二选一）
   * 
   * 特性：
   * - 精确匹配标签名称
   * - 使用撤销分组，可一键撤销
   * - 批量处理选中的所有笔记
   * - 不存在的标签会被忽略
   * 
   * @example
   * // 移除单个标签
   * taskUtils.removeTags({
   *   tag: "已完成"
   * })
   * 
   * // 移除多个标签
   * taskUtils.removeTags({
   *   tags: ["临时", "草稿", "待审核"]
   * })
   * 
   * // 条件性移除
   * let notesToClean = MNNote.getFocusNotes()
   * if (notesToClean.length > 0) {
   *   taskUtils.removeTags({
   *     tags: ["过期", "旧版本"]
   *   })
   * }
   * 
   * // 清理特定标签
   * taskUtils.removeTags({
   *   tag: "2023-临时"
   * })
   */
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
  /**
   * 🔗 提取文本中的 URL
   * 
   * 从文本中提取所有的 HTTP/HTTPS URL 链接。
   * 使用正则表达式匹配标准的网址格式。
   * 
   * @param {string} text - 要搜索的文本
   * @returns {string[]} URL 数组，没有找到则返回空数组
   * 
   * 匹配规则：
   * - 必须以 http:// 或 https:// 开头
   * - 包含有效的域名和路径
   * - 自动识别到空格或文本结束
   * 
   * @example
   * // 提取单个 URL
   * let text = "查看文档：https://example.com/docs"
   * let urls = taskUtils.extractUrls(text)
   * console.log(urls)  // ["https://example.com/docs"]
   * 
   * // 提取多个 URL
   * let content = `
   *   官网：https://marginnote.com
   *   文档：https://docs.marginnote.com/guide
   *   论坛：http://bbs.marginnote.com
   * `
   * let allUrls = taskUtils.extractUrls(content)
   * console.log(allUrls.length)  // 3
   * 
   * // 从笔记中提取链接
   * let noteText = focusNote.allNoteText()
   * let links = taskUtils.extractUrls(noteText)
   * if (links.length > 0) {
   *   // 打开第一个链接
   *   MNUtil.openURL(links[0])
   * }
   */
  static extractUrls(text) {
  // 定义匹配URL的正则表达式
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
  // 使用正则表达式匹配所有的URL
  const urls = text.match(urlRegex);
  // 如果没有匹配的URL则返回空数组
  return urls ? urls : [];
}
  /**
   * 🔍 检查笔记是否包含 URL
   * 
   * 扫描笔记的所有文本内容，检查是否包含网址链接。
   * 包括标题、摘录和所有评论中的文本。
   * 
   * @param {MNNote} note - 要检查的笔记对象
   * @returns {string[]} 找到的所有 URL 数组，没有则返回空数组
   * 
   * @example
   * // 检查单个笔记
   * let focusNote = MNNote.getFocusNote()
   * let urls = taskUtils.noteHasWebURL(focusNote)
   * if (urls.length > 0) {
   *   console.log(`找到 ${urls.length} 个链接`)
   *   urls.forEach(url => console.log(url))
   * }
   * 
   * // 批量检查笔记
   * let notesWithLinks = []
   * MNNote.getFocusNotes().forEach(note => {
   *   let urls = taskUtils.noteHasWebURL(note)
   *   if (urls.length > 0) {
   *     notesWithLinks.push({
   *       note: note,
   *       urls: urls
   *     })
   *   }
   * })
   * 
   * // 打开笔记中的第一个链接
   * let urls = taskUtils.noteHasWebURL(focusNote)
   * if (urls.length > 0) {
   *   MNUtil.openURL(urls[0])
   * }
   */
  static noteHasWebURL(note){
    let content = note.allNoteText()
    return this.extractUrls(content)
  }
  /**
   * 🌐 打开网页链接
   * 
   * 智能识别并打开笔记或选中文本中的第一个 URL。
   * 优先级：笔记内容 > 选中文本。
   * 
   * @param {Object} des - 描述对象（保留参数，目前未使用）
   * @returns {boolean} 是否成功找到并打开了 URL
   * 
   * 搜索顺序：
   * 1. 当前焦点笔记的所有文本
   * 2. 当前选中的文本
   * 3. 如果都没有找到，显示提示
   * 
   * @example
   * // 打开笔记中的链接
   * taskUtils.openWebURL({})
   * 
   * // 通常用于按钮动作
   * {
   *   action: "openWebURL",
   *   menuTitle: "打开网页链接"
   * }
   * 
   * // 判断是否成功
   * if (taskUtils.openWebURL({})) {
   *   console.log("已打开链接")
   * } else {
   *   console.log("未找到链接")
   * }
   * 
   * // 典型使用场景
   * // 1. 笔记包含参考链接，快速打开
   * // 2. 选中带链接的文本，直接访问
   * // 3. 作为工具栏按钮的快捷操作
   */
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
  /**
   * 🎨 渲染模板
   * 
   * 使用 Mustache 模板引擎渲染文本，替换其中的变量。
   * 支持笔记相关变量和用户输入变量。
   * 
   * @param {string} template - 模板字符串，包含 {{variable}} 格式的变量
   * @param {Object} [opt={}] - 选项对象
   * @param {string} [opt.noteId] - 指定笔记 ID，用于获取笔记相关变量
   * @param {string} [opt.userInput] - 用户输入的文本
   * @returns {Promise<string>} 渲染后的文本
   * @throws {Error} 渲染过程中的错误
   * 
   * 模板变量类型：
   * - 笔记变量：{{note.title}}, {{note.tags}} 等
   * - 日期变量：{{date.year}}, {{date.month}} 等
   * - 用户输入：{{userInput}}
   * - 系统变量：{{clipboardText}}, {{selectionText}} 等
   * 
   * @example
   * // 基础模板渲染
   * let template = "今天是 {{date.year}} 年 {{date.month}} 月"
   * let result = await taskUtils.render(template)
   * console.log(result)  // "今天是 2024 年 1 月"
   * 
   * // 使用笔记变量
   * let noteTemplate = "# {{note.title}}\n标签：{{note.hashTags}}"
   * let rendered = await taskUtils.render(noteTemplate, {
   *   noteId: focusNote.noteId
   * })
   * 
   * // 包含用户输入
   * let inputTemplate = "用户说：{{userInput}}\n时间：{{date.now}}"
   * let output = await taskUtils.render(inputTemplate, {
   *   userInput: "这是一个测试"
   * })
   */
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
  /**
   * 📝 获取笔记变量信息并渲染
   * 
   * 内部方法：根据指定笔记 ID 获取变量信息，并渲染模板。
   * 结合笔记信息、系统变量和用户输入进行模板渲染。
   * 
   * @private
   * @param {string} noteid - 笔记 ID
   * @param {string} text - 包含模板变量的文本
   * @param {string} [userInput] - 用户输入的文本
   * @returns {Promise<string>} 渲染后的文本
   * @throws {Error} 渲染过程中的错误
   * 
   * 内部流程：
   * 1. 根据 noteId 获取笔记对象
   * 2. 转换为笔记配置对象（包含所有属性）
   * 3. 收集系统变量（剪贴板、日期等）
   * 4. 使用 MNUtil.render 进行渲染
   * 
   * @example
   * // 通常不直接调用，而是通过 render() 方法
   * let result = await taskUtils.getNoteVarInfo(
   *   "12345678-1234-1234-1234-123456789012",
   *   "笔记：{{note.title}}\n创建于：{{note.date.create}}",
   *   "用户输入内容"
   * )
   */
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

/**
   * 📄 获取文本变量信息并渲染
   * 
   * 内部方法：渲染包含变量的文本模板。
   * 使用当前焦点笔记（如果有）和系统变量进行渲染。
   * 
   * @private
   * @param {string} text - 包含模板变量的文本
   * @param {string} [userInput] - 用户输入的文本
   * @returns {Promise<string>} 渲染后的文本
   * @throws {Error} 渲染过程中的错误
   * 
   * 与 getNoteVarInfo 的区别：
   * - 使用当前焦点笔记，而非指定的笔记
   * - 如果没有焦点笔记，仍然可以渲染系统变量
   * 
   * 内部流程：
   * 1. 获取当前焦点笔记（可选）
   * 2. 收集所有可用变量
   * 3. 使用 Mustache 模板引擎渲染
   * 
   * @example
   * // 通常不直接调用，而是通过 render() 方法
   * let result = await taskUtils.getTextVarInfo(
   *   "当前时间：{{date.now}}\n剪贴板：{{clipboardText}}",
   *   "用户输入"
   * )
   */
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
   * ✅ 显示确认对话框
   * 
   * 显示一个带有标题和副标题的确认对话框。
   * 返回用户点击的按钮索引。
   * 
   * @param {string} mainTitle - 对话框主标题
   * @param {string} subTitle - 对话框副标题
   * @returns {Promise<number>} 用户点击的按钮索引
   *   - 0: 取消按钮
   *   - 1: 确认按钮
   * 
   * @example
   * // 简单确认
   * let result = await taskUtils.confirm(
   *   "删除笔记",
   *   "确定要删除这个笔记吗？此操作不可撤销。"
   * )
   * if (result === 1) {
   *   // 用户点击了确认
   *   note.delete()
   * }
   * 
   * // 操作前确认
   * let shouldContinue = await taskUtils.confirm(
   *   "批量操作",
   *   `即将处理 ${notes.length} 个笔记，是否继续？`
   * )
   * if (shouldContinue === 0) {
   *   return  // 用户取消
   * }
   * 
   * // 危险操作警告
   * let confirmed = await taskUtils.confirm(
   *   "⚠️ 警告",
   *   "这将清空所有标签，确定继续吗？"
   * )
   */
  static async confirm(mainTitle,subTitle){
    return MNUtil.confirm(mainTitle, subTitle, ["Cancel", "Confirm"])
  }
}

/**
 * ⚙️ 插件配置管理类
 * 
 * 管理 MN Task 插件的所有配置项，包括：
 * - 按钮配置和动作映射
 * - 窗口状态和界面设置
 * - 云同步配置
 * - 弹出菜单替换配置
 * 
 * 本类使用静态属性和方法，不需要实例化。
 * 所有配置都存储在本地，支持 iCloud 同步。
 * 
 * @class
 * 
 * @example
 * // 初始化配置（在插件启动时）
 * taskConfig.init(self.path)
 * 
 * // 读取配置
 * let buttons = taskConfig.action
 * let windowState = taskConfig.windowState
 * 
 * // 保存配置
 * taskConfig.windowState.frame = newFrame
 * taskConfig.save()
 * 
 * // 检查云同步
 * if (taskConfig.iCloudSync) {
 *   taskConfig.syncToCloud()
 * }
 */
class taskConfig {
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
  /**
   * 🚀 初始化配置系统
   * 
   * 加载所有配置项，设置默认值，初始化必要的资源。
   * 这是插件启动时必须调用的方法。
   * 
   * @param {string} mainPath - 插件主目录路径
   * 
   * 初始化内容：
   * - 加载窗口状态配置
   * - 加载按钮和动作配置
   * - 设置高亮颜色
   * - 创建按钮图片目录
   * - 初始化弹出菜单配置
   * - 检查云存储状态
   * 
   * @example
   * // 在插件启动时调用
   * sceneWillConnect: function() {
   *   taskConfig.init(self.path)
   *   // 后续初始化...
   * }
   * 
   * // 初始化后可以访问配置
   * let buttons = taskConfig.action
   * let windowState = taskConfig.windowState
   */
  static init(mainPath){
    // this.config = this.getByDefault("MNTask_config",this.defaultConfig)
    try {
    this.mainPath = mainPath
    this.dynamic = this.getByDefault("MNTask_dynamic",false)
    this.addonLogos = this.getByDefault("MNTask_addonLogos",{})
    this.windowState = this.getByDefault("MNTask_windowState",this.defaultWindowState)
    this.buttonNumber = this.getDefaultActionKeys().length
    //数组格式,存的是每个action的key
    this.action = this.getByDefault("MNTask_action", this.getDefaultActionKeys())
    this.action = this.action.map(a=>{
      if (a === "excute") {
        return "execute"
      }
      return a
    })
    this.dynamicAction = this.getByDefault("MNTask_dynamicAction", this.action)
    if (this.dynamicAction.length === 0) {
      this.dynamicAction = this.action
    }

    this.actions = this.getByDefault("MNTask_actionConfig", this.getActions())
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
    this.buttonConfig = this.getByDefault("MNTask_buttonConfig", this.defalutButtonConfig)
    // MNUtil.copyJSON(this.buttonConfig)
    this.highlightColor = UIColor.blendedColor(
      UIColor.colorWithHexString("#2c4d81").colorWithAlphaComponent(0.8),
      taskUtils.app.defaultTextColor,
      0.8
    );
      let editorConfig = this.getDescriptionByName("edit")
      if ("showOnNoteEdit" in editorConfig) {
        this.showEditorOnNoteEdit = editorConfig.showOnNoteEdit
      }
      
    } catch (error) {
      taskUtils.addErrorLog(error, "init")
    }
    this.buttonImageFolder = MNUtil.dbFolder+"/buttonImage"
    NSFileManager.defaultManager().createDirectoryAtPathAttributes(this.buttonImageFolder, undefined)
    // this.popupConfig = this.getByDefault("MNTask_popupConfig", this.defaultPopupReplaceConfig)
    // this.popupConfig = this.defaultPopupReplaceConfig
    this.popupConfig = this.getByDefault("MNTask_popupConfig", this.defaultPopupReplaceConfig)
    this.syncConfig = this.getByDefault("MNTask_syncConfig", this.defaultSyncConfig)
    this.initImage()
    this.checkCloudStore(false)
  }
  /**
   * ☁️ 检查并初始化云存储
   * 
   * 检查 iCloud 键值存储是否已初始化，如果未初始化则进行初始化。
   * 用于替代旧的 initCloudStore 方法，提供更灵活的控制。
   * 
   * @param {boolean} [notification=true] - 是否发送云存储变更通知
   * 
   * 特性：
   * - 单例模式，避免重复初始化
   * - 可选的通知发送，避免不必要的同步
   * - 自动获取系统默认的 iCloud 存储
   * 
   * @example
   * // 初始化时检查云存储（不发送通知）
   * taskConfig.checkCloudStore(false)
   * 
   * // 准备同步时检查（发送通知）
   * taskConfig.checkCloudStore(true)
   * 
   * // 之后可以使用云存储
   * if (taskConfig.cloudStore) {
   *   taskConfig.cloudStore.setObjectForKey(config, "key")
   * }
   */
  static checkCloudStore(notification = true){//用于替代initCloudStore
    if (!this.cloudStore) {
      this.cloudStore = NSUbiquitousKeyValueStore.defaultStore()
      if (notification) {
        MNUtil.postNotification("NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI", {}) 
      }
    }
  }
  /**
   * ☁️ 初始化云存储（已弃用）
   * 
   * @deprecated 请使用 checkCloudStore() 代替
   * 旧版本的云存储初始化方法，总是发送通知。
   * 保留此方法是为了向后兼容。
   * 
   * @example
   * // 不推荐
   * taskConfig.initCloudStore()
   * 
   * // 推荐
   * taskConfig.checkCloudStore(true)
   */
  static initCloudStore(){
    this.cloudStore = NSUbiquitousKeyValueStore.defaultStore()
    MNUtil.postNotification("NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI", {})
    // this.readCloudConfig(false)
  }
  /**
   * ☁️ 获取 iCloud 同步状态
   * 
   * 智能判断是否启用 iCloud 同步。
   * 不仅检查用户设置，还会验证订阅状态。
   * 
   * @returns {boolean} 是否启用 iCloud 同步
   * 
   * 判断逻辑：
   * 1. 检查用户是否有有效订阅
   * 2. 检查用户是否在设置中启用了同步
   * 3. 两者都满足才返回 true
   * 
   * @example
   * // 检查同步状态
   * if (taskConfig.iCloudSync) {
   *   // 执行同步操作
   *   taskConfig.syncToCloud()
   * } else {
   *   // 提示用户需要订阅或启用同步
   *   MNUtil.showHUD("需要订阅才能使用云同步")
   * }
   * 
   * // 在设置界面显示
   * let syncEnabled = taskConfig.iCloudSync
   * syncSwitch.on = syncEnabled
   */
  static get iCloudSync(){//同时考虑订阅情况
    if (taskUtils.checkSubscribe(false,false,true)) {
      return this.syncConfig.iCloudSync
    }
    return false
  }
  /**
   * 🔍 检查是否有弹出菜单替换配置
   * 
   * 扫描所有弹出菜单配置，判断是否有任何一个被启用并设置了替换目标。
   * 用于决定是否需要拦截系统的弹出菜单。
   * 
   * @returns {boolean} 是否有活动的弹出菜单替换
   * 
   * @example
   * // 在弹出菜单处理中使用
   * if (taskConfig.hasPopup()) {
   *   // 拦截系统菜单，显示自定义菜单
   *   event.preventDefault()
   *   showCustomMenu()
   * }
   * 
   * // 在设置界面提示
   * let hasCustomPopup = taskConfig.hasPopup()
   * statusLabel.text = hasCustomPopup ? "已启用自定义菜单" : "使用系统默认菜单"
   */
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
  /**
   * 📋 获取指定弹出菜单项的配置
   * 
   * 获取特定菜单项的替换配置。
   * 如果用户有自定义配置则返回用户配置，否则返回默认配置。
   * 
   * @param {string} key - 菜单项标识符（如 "copy", "noteHighlight" 等）
   * @returns {Object} 弹出菜单配置对象
   * @returns {boolean} returns.enabled - 是否启用替换
   * @returns {string} returns.target - 替换的目标动作
   * @returns {string} returns.name - 菜单项名称
   * 
   * @example
   * // 获取复制菜单的配置
   * let copyConfig = taskConfig.getPopupConfig("copy")
   * if (copyConfig.enabled && copyConfig.target) {
   *   // 执行自定义复制动作
   *   performAction(copyConfig.target)
   * }
   * 
   * // 检查某个菜单是否被替换
   * let config = taskConfig.getPopupConfig("noteHighlight")
   * console.log(`笔记高亮：${config.enabled ? "已自定义" : "系统默认"}`)
   */
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
          //iOS端不参与"MNTask_windowState"的云同步,因此比较时忽略该参数
          continue
        }
        if (!this.deepEqual(obj1[key], obj2[key])) {
          return false;
        }
    }
    return true;
  }
  /**
   * 📦 获取所有配置
   * 
   * 打包所有配置项为一个对象，用于导出、同步或备份。
   * 包含工具栏的所有设置和状态信息。
   * 
   * @returns {Object} 完整的配置对象
   * @returns {Object} returns.windowState - 窗口状态
   * @returns {Object} returns.syncConfig - 同步配置
   * @returns {boolean} returns.dynamic - 是否为动态模式
   * @returns {Object} returns.addonLogos - 插件图标
   * @returns {string[]} returns.actionKeys - 按钮动作列表
   * @returns {string[]} returns.dynamicActionKeys - 动态按钮列表
   * @returns {Object} returns.actions - 动作配置
   * @returns {Object} returns.buttonConfig - 按钮样式配置
   * @returns {Object} returns.popupConfig - 弹出菜单配置
   * 
   * @example
   * // 导出配置到剪贴板
   * let config = taskConfig.getAllConfig()
   * MNUtil.copyJSON(config)
   * MNUtil.showHUD("配置已复制")
   * 
   * // 保存配置到文件
   * let configData = taskConfig.getAllConfig()
   * let json = JSON.stringify(configData, null, 2)
   * MNUtil.writeFile(path, json)
   * 
   * // 同步到云端
   * let allConfig = taskConfig.getAllConfig()
   * cloudStore.setObjectForKey(allConfig, "MNTask_config")
   */
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
  /**
   * 📥 导入配置
   * 
   * 从配置对象中恢复所有设置。
   * 支持部分导入和平台差异处理。
   * 
   * @param {Object} config - 要导入的配置对象（通常来自 getAllConfig()）
   * @returns {boolean} 导入是否成功
   * 
   * 特殊处理：
   * - iOS 设备不导入窗口状态（界面布局不同）
   * - 保留本地的 iCloud 同步设置
   * - 自动处理空的动态按钮列表
   * 
   * @example
   * // 从剪贴板导入配置
   * try {
   *   let configText = MNUtil.clipboardText
   *   let config = JSON.parse(configText)
   *   if (taskConfig.importConfig(config)) {
   *     MNUtil.showHUD("✅ 配置导入成功")
   *     taskConfig.save()
   *   }
   * } catch (error) {
   *   MNUtil.showHUD("❌ 配置格式错误")
   * }
   * 
   * // 从云端同步配置
   * let cloudConfig = cloudStore.objectForKey("MNTask_config")
   * if (cloudConfig && taskConfig.importConfig(cloudConfig)) {
   *   // 更新本地配置
   *   taskConfig.syncConfig.lastSyncTime = Date.now()
   *   taskConfig.save()
   * }
   */
  static importConfig(config){
    try {
    if (!MNUtil.isIOS()) { //iOS端不参与"MNTask_windowState"的云同步
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
      taskUtils.addErrorLog(error, "importConfig")
      return false
    }
  }
  /**
   * 🕐 获取本地配置的最新时间
   * 
   * 返回本地配置的最新时间戳，用于云同步冲突检测。
   * 取同步时间和修改时间中的较大值。
   * 
   * @returns {number} 最新时间戳（毫秒）
   * 
   * @example
   * // 检查本地是否有更新
   * let localTime = taskConfig.getLocalLatestTime()
   * let cloudTime = cloudConfig.lastModifyTime || 0
   * 
   * if (localTime > cloudTime) {
   *   // 本地配置更新，需要上传
   *   taskConfig.syncToCloud()
   * } else if (cloudTime > localTime) {
   *   // 云端配置更新，需要下载
   *   taskConfig.readCloudConfig()
   * }
   */
  static getLocalLatestTime(){
    let lastSyncTime = this.syncConfig.lastSyncTime ?? 0
    let lastModifyTime = this.syncConfig.lastModifyTime ?? 0
    return Math.max(lastSyncTime,lastModifyTime)
  }
  /**
   * 📥 从云端读取配置
   * 
   * 从 iCloud 下载并应用配置。
   * 支持强制覆盖和智能冲突处理。
   * 
   * @param {boolean} [msg=true] - 是否显示提示消息
   * @param {boolean} [alert=false] - 是否显示确认对话框
   * @param {boolean} [force=false] - 是否强制覆盖本地配置
   * @returns {Promise<boolean>} 是否成功读取
   * 
   * 工作流程：
   * 1. 检查云同步权限
   * 2. 获取云端配置
   * 3. 比较时间戳（非强制模式）
   * 4. 处理冲突（如需要）
   * 5. 导入配置
   * 6. 更新同步时间
   * 
   * @example
   * // 强制从云端恢复
   * await taskConfig.readCloudConfig(true, false, true)
   * 
   * // 静默检查更新
   * await taskConfig.readCloudConfig(false, false, false)
   * 
   * // 用户手动同步（带确认）
   * await taskConfig.readCloudConfig(true, true, false)
   * 
   * // 自动同步检查
   * if (taskConfig.iCloudSync) {
   *   await taskConfig.readCloudConfig(false)
   * }
   */
  static async readCloudConfig(msg = true,alert = false,force = false){
    try {
    if (force) {
      this.checkCloudStore(false)
      let cloudConfig = this.cloudStore.objectForKey("MNTask_totalConfig")
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
      // this.cloudStore.removeObjectForKey("MNTask_totalConfig")
      let cloudConfig = this.cloudStore.objectForKey("MNTask_totalConfig")
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
            let confirm = await MNUtil.confirm("MN Task: Import from iCloud?","MN Task: 是否导入iCloud配置？")
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
            let confirm = await MNUtil.confirm("MN Task: Uploading to iCloud?","MN Task: 是否上传配置到iCloud？")
            if (!confirm) {
              return false
            }
          }
          this.writeCloudConfig()
          return false
        }
        let userSelect = await MNUtil.userSelect("MN Task\nConflict config, import or export?","配置冲突，请选择操作",["📥 Import / 导入","📤 Export / 导出"])
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
        let confirm = await MNUtil.confirm("MN Task: Empty config in iCloud, uploading?","MN Task: iCloud配置为空,是否上传？")
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
      taskUtils.addErrorLog(error, "readCloudConfig")
      return false
    }
  }
  /**
   * 📤 写入配置到云端
   * 
   * 将本地配置上传到 iCloud。
   * 支持强制覆盖和智能冲突检测。
   * 
   * @param {boolean} [msg=true] - 是否显示提示消息
   * @param {boolean} [force=false] - 是否强制覆盖云端配置
   * @returns {boolean} 是否成功写入
   * 
   * 工作流程：
   * 1. 检查云同步权限（非强制模式）
   * 2. 比较本地和云端配置
   * 3. 检测时间戳冲突
   * 4. 上传配置
   * 5. 更新同步时间
   * 
   * 特殊处理：
   * - iOS 设备不上传窗口状态
   * - 自动处理空的动态按钮列表
   * - 保留云端的 iOS 窗口状态
   * 
   * @example
   * // 强制上传（覆盖云端）
   * taskConfig.writeCloudConfig(true, true)
   * 
   * // 静默上传（有冲突时不上传）
   * taskConfig.writeCloudConfig(false, false)
   * 
   * // 用户保存时触发
   * if (taskConfig.save()) {
   *   taskConfig.writeCloudConfig()
   * }
   * 
   * // 定期自动同步
   * setInterval(() => {
   *   if (taskConfig.iCloudSync) {
   *     taskConfig.writeCloudConfig(false)
   *   }
   * }, 300000) // 5分钟
   */
  static writeCloudConfig(msg = true,force = false){
  try {
    if (force) {//force下不检查订阅(由更上层完成)
      this.checkCloudStore()
      this.syncConfig.lastSyncTime = Date.now()
      this.syncConfig.lastModifyTime = Date.now()
      let cloudConfig = this.cloudStore.objectForKey("MNTask_totalConfig")
      let config = this.getAllConfig()
      if (MNUtil.isIOS() && cloudConfig && cloudConfig.windowState) {
        //iOS端不参与"MNTask_windowState"的云同步
        config.windowState = cloudConfig.windowState
      }
      if (msg) {
        MNUtil.showHUD("Uploading...")
      }
      this.cloudStore.setObjectForKey(config,"MNTask_totalConfig")
      return true
    }
    if(!this.iCloudSync){
      return false
    }
    let iCloudSync = this.syncConfig.iCloudSync
    this.checkCloudStore()
    let cloudConfig = this.cloudStore.objectForKey("MNTask_totalConfig")
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
      //iOS端不参与"MNTask_windowState"的云同步
      config.windowState = cloudConfig.windowState
    }
    // MNUtil.copyJSON(config)
    if (msg) {
      MNUtil.showHUD("Uploading...")
    }
    config.syncConfig.iCloudSync = iCloudSync
    this.cloudStore.setObjectForKey(config,"MNTask_totalConfig")
    this.syncConfig.lastSyncTime = Date.now()
    this.save("MNTask_syncConfig",undefined,false)
    return true
  } catch (error) {
    taskUtils.addErrorLog(error, "writeCloudConfig")
    return false
  }
  }
  /**
   * 🖼️ 初始化按钮图片
   * 
   * 加载所有按钮的图片资源，支持自定义图片和默认图片。
   * 这是插件启动时的重要步骤，确保所有按钮都有正确的图标。
   * 
   * 工作流程：
   * 1. 加载已保存的图片缩放配置
   * 2. 遍历所有按钮，优先使用自定义图片
   * 3. 如果没有自定义图片，使用默认图片
   * 4. 加载特殊图标（曲线、运行、模板）
   * 
   * 图片来源优先级：
   * 1. 用户自定义图片（buttonImageFolder 目录）
   * 2. 默认图片（主目录下的 PNG 文件）
   * 
   * @example
   * // 在初始化时调用
   * taskConfig.init(mainPath)
   * // init 方法内部会调用 initImage()
   * 
   * // 自定义图片存储位置
   * // ~/Library/MarginNote 3/buttonImage/[md5].png
   * 
   * // 默认图片位置
   * // [插件目录]/copy.png
   * // [插件目录]/search.png
   * // 等等...
   * 
   * // 图片缩放配置示例
   * // imageScale = {
   * //   "copy": { path: "a1b2c3.png", scale: 2.5 },
   * //   "custom1": { path: "d4e5f6.png", scale: 3 }
   * // }
   */
  static initImage(){
    try {
    let keys = this.getDefaultActionKeys()
    this.imageScale = taskConfig.getByDefault("MNTask_imageScale",{})
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
        if (key in taskConfig.defalutImageScale) {
          scale = taskConfig.defalutImageScale[key]
        }
        this.imageConfigs[key] = MNUtil.getImage(this.mainPath+"/"+this.getAction(key).image+".png",scale)
      }
    })
    this.curveImage = MNUtil.getImage(this.mainPath+"/curve.png",2)
    this.runImage = MNUtil.getImage(this.mainPath+"/run.png",2.6)
    this.templateImage = MNUtil.getImage(this.mainPath+"/template.png",2.2)
    // MNUtil.copyJSON(this.imageConfigs)
      } catch (error) {
      taskUtils.addErrorLog(error, "initImage")
    }
  }
  // static setImageByURL(action,url,refresh = false) {
  //   this.imageConfigs[action] = taskUtils.getOnlineImage(url)
  //   if (refresh) {
  //     MNUtil.postNotification("refreshTaskButton", {})
  //   }
  // }
  /**
   * 🌐 通过 URL 设置按钮图片
   * 
   * 支持从多种来源设置按钮图片：网络图片、笔记图片或本地图片。
   * 使用 MD5 缓存机制避免重复下载。
   * 
   * @param {string} action - 按钮动作标识（如 "copy", "custom1" 等）
   * @param {string} url - 图片来源 URL，支持的格式：
   *   - 网络图片：https://example.com/image.png
   *   - 笔记图片：marginnote4app://note/[noteId]
   *   - 本地文件：file:///path/to/image.png
   * @param {boolean} [refresh=false] - 是否立即刷新工具栏显示
   * @param {number} [scale=3] - 图片缩放比例（影响显示清晰度）
   * 
   * 缓存机制：
   * - 使用 URL 的 MD5 作为文件名
   * - 缓存位置：~/Library/MarginNote 3/buttonImage/[md5].png
   * - 如果缓存存在，直接使用缓存
   * 
   * @example
   * // 设置网络图片
   * taskConfig.setImageByURL(
   *   "custom1", 
   *   "https://example.com/icon.png",
   *   true,  // 立即刷新
   *   2.5    // 缩放比例
   * )
   * 
   * // 使用笔记中的图片
   * let noteURL = "marginnote4app://note/ABC123"
   * taskConfig.setImageByURL("custom2", noteURL, true)
   * 
   * // 批量设置图片（最后才刷新）
   * taskConfig.setImageByURL("btn1", url1, false)
   * taskConfig.setImageByURL("btn2", url2, false)
   * taskConfig.setImageByURL("btn3", url3, true) // 最后一个刷新
   * 
   * // 在设置界面中使用
   * UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
   *   "输入图片URL",
   *   "支持网络图片或笔记图片",
   *   2,  // 输入框样式
   *   "取消",
   *   ["确定"],
   *   (alert, buttonIndex) => {
   *     if (buttonIndex === 1) {
   *       let url = alert.textFieldAtIndex(0).text
   *       taskConfig.setImageByURL(action, url, true)
   *     }
   *   }
   * )
   */
  static setImageByURL(action,url,refresh = false,scale = 3) {
    let md5 = MNUtil.MD5(url)
    // let imagePath = this.mainPath+"/"+this.getAction(action).image+".png"
    // MNUtil.getImage(this.mainPath+"/"+this.getAction(key).image+".png",scale)
    let localPath = this.buttonImageFolder+"/"+md5+".png"
    this.imageScale[action] = {path:md5+".png",scale:scale}
    this.save("MNTask_imageScale")
    let image = undefined
    let imageData = undefined
    if (MNUtil.isfileExists(localPath)) {
      image = MNUtil.getImage(localPath,scale)
      // image.pngData().writeToFileAtomically(imagePath, false)
      this.imageConfigs[action] = image
      if (refresh) {
        MNUtil.postNotification("refreshTaskButton", {})
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
          MNUtil.postNotification("refreshTaskButton", {})
        }
      }
      return
    }
    if (/^https?:\/\//.test(url)) {
      image = taskUtils.getOnlineImage(url,scale)
      this.imageConfigs[action] = image
      imageData = image.pngData()
      // imageData.writeToFileAtomically(imagePath, false)
      imageData.writeToFileAtomically(localPath, false)
      if (refresh) {
        MNUtil.postNotification("refreshTaskButton", {})
      }
      return
    }
    // }
    if (refresh) {
      MNUtil.postNotification("refreshTaskButton", {})
    }
  }
  /**
   * 🖼️ 直接设置按钮图片
   * 
   * 使用 UIImage 对象直接设置按钮图片。
   * 适用于从相册选择、截图或程序生成的图片。
   * 
   * @param {string} action - 按钮动作标识（如 "copy", "custom1" 等）
   * @param {UIImage} image - iOS 图片对象
   * @param {boolean} [refresh=false] - 是否立即刷新工具栏显示
   * @param {number} [scale=3] - 图片缩放比例（此参数实际未使用，保持为 1）
   * @returns {void}
   * 
   * 限制条件：
   * - 图片尺寸不能超过 500x500 像素
   * - 过大的图片会影响性能和内存使用
   * 
   * 缓存机制：
   * - 使用图片数据的 MD5 作为文件名
   * - 自动保存到 buttonImage 目录
   * - 如果相同图片已存在，直接使用缓存
   * 
   * @example
   * // 从剪贴板设置图片
   * let image = MNUtil.getImageFromPasteboard()
   * if (image) {
   *   taskConfig.setButtonImage("custom1", image, true)
   * }
   * 
   * // 使用截图
   * let screenshot = MNUtil.getDocImage(true, true)
   * if (screenshot) {
   *   let image = UIImage.imageWithData(screenshot)
   *   taskConfig.setButtonImage("custom2", image, true)
   * }
   * 
   * // 生成纯色图片
   * let color = UIColor.redColor()
   * let size = CGSizeMake(100, 100)
   * UIGraphicsBeginImageContext(size)
   * let context = UIGraphicsGetCurrentContext()
   * color.setFill()
   * context.fillRect(CGRectMake(0, 0, size.width, size.height))
   * let colorImage = UIGraphicsGetImageFromCurrentImageContext()
   * UIGraphicsEndImageContext()
   * taskConfig.setButtonImage("custom3", colorImage, true)
   * 
   * // 错误处理
   * let largeImage = getSomeLargeImage()
   * taskConfig.setButtonImage("custom4", largeImage, true)
   * // 如果图片太大，会显示 "Image size is too large"
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
    this.save("MNTask_imageScale")
    if (MNUtil.isfileExists(localPath)) {
      this.imageConfigs[action] = image
      if (refresh) {
        MNUtil.postNotification("refreshTaskButton", {})
      }
      return
    }else{
      this.imageConfigs[action] = image
      image.pngData().writeToFileAtomically(localPath, false)
      if (refresh) {
        MNUtil.postNotification("refreshTaskButton", {})
      }
    }
    // }
    if (refresh) {
      MNUtil.postNotification("refreshTaskButton", {})
    }
  } catch (error) {
    taskUtils.addErrorLog(error, "setButtonImage")
  }
  }
  /**
   * 📋 获取所有按钮动作列表
   * 
   * 返回完整的按钮动作数组，包括用户选择的和未选择的。
   * 用于设置界面显示所有可用按钮。
   * 
   * @param {boolean} [dynamic=false] - 是否获取动态工具栏的按钮列表
   *   - false: 获取固定工具栏的按钮列表
   *   - true: 获取动态（跟随）工具栏的按钮列表
   * @returns {string[]} 按钮动作标识数组
   * 
   * 返回顺序：
   * 1. 用户已选择的按钮（保持用户排序）
   * 2. 未选择的默认按钮（按默认顺序）
   * 
   * @example
   * // 获取固定工具栏的所有按钮
   * let allButtons = taskConfig.getAllActions()
   * // ["copy", "search", "custom1", ..., "setting", "undo", "redo"]
   * 
   * // 获取动态工具栏的所有按钮
   * let dynamicButtons = taskConfig.getAllActions(true)
   * 
   * // 在设置界面使用
   * let allActions = taskConfig.getAllActions()
   * allActions.forEach((action, index) => {
   *   let actionConfig = taskConfig.getAction(action)
   *   let cell = createCell(actionConfig.name, actionConfig.image)
   *   
   *   // 标记已选择的按钮
   *   if (index < taskConfig.action.length) {
   *     cell.accessoryType = UITableViewCellAccessoryCheckmark
   *   }
   * })
   * 
   * // 查找未使用的按钮
   * let allActions = taskConfig.getAllActions()
   * let unusedActions = allActions.slice(taskConfig.action.length)
   * console.log("未使用的按钮：", unusedActions)
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
  /**
   * 🔍 通过按钮名称获取描述对象
   * 
   * 根据按钮的显示名称查找对应的配置描述。
   * 用于通过用户可见的名称来执行对应的动作。
   * 
   * @param {string} targetButtonName - 按钮的显示名称（如 "Copy", "Search" 等）
   * @returns {Object|undefined} 按钮的描述对象，找不到时返回 undefined
   * 
   * 搜索范围：
   * - 用户当前选择的按钮
   * - 所有默认可用的按钮
   * 
   * @example
   * // 通过名称执行按钮动作
   * let des = taskConfig.getDesByButtonName("Copy")
   * if (des) {
   *   // des = { action: "copy", target: "title", ... }
   *   taskUtils.customActionByDes(button, des)
   * }
   * 
   * // 在快捷方式中使用
   * function executeButtonByName(name) {
   *   let des = taskConfig.getDesByButtonName(name)
   *   if (des) {
   *     webviewController.customActionByDes(null, des)
   *   }
   * }
   * 
   * // 处理找不到的情况
   * let des = taskConfig.getDesByButtonName("不存在的按钮")
   * // 显示 HUD: "Button not found: 不存在的按钮"
   * // 返回 undefined
   * 
   * // 获取所有按钮名称
   * let allActions = taskConfig.getAllActions()
   * let allNames = allActions.map(action => {
   *   return taskConfig.getAction(action).name
   * })
   * console.log("所有可用按钮：", allNames)
   */
  static getDesByButtonName(targetButtonName){
    let allActions = this.action.concat(this.getDefaultActionKeys().slice(this.action.length))
    let allButtonNames = allActions.map(action=>this.getAction(action).name)
    let buttonIndex = allButtonNames.indexOf(targetButtonName)
    if (buttonIndex === -1) {
      MNUtil.showHUD("Button not found: "	+ targetButtonName)
      return undefined
    }
    let action = allActions[buttonIndex]
    let actionDes = taskConfig.getDescriptionByName(action)
    return actionDes
  
  }
  /**
   * 🪟 获取窗口状态配置
   * 
   * 安全地获取窗口状态配置，自动处理版本兼容性。
   * 当用户的旧配置缺少新增字段时，返回默认值。
   * 
   * @param {string} key - 窗口状态键名，支持的键：
   *   - "sideMode": 贴边模式（左/右）
   *   - "splitMode": 是否跟随分割线
   *   - "open": 是否默认常驻
   *   - "dynamicButton": 动态工具栏按钮数量
   *   - "dynamicOrder": 动态按钮是否按使用频率排序
   *   - "dynamicDirection": 动态工具栏方向
   *   - "frame": 窗口位置和大小
   *   - "direction": 固定工具栏方向
   * @returns {*} 配置值
   * 
   * @example
   * // 获取工具栏方向
   * let direction = taskConfig.getWindowState("direction")
   * // "vertical" 或 "horizontal"
   * 
   * // 获取动态按钮数量
   * let buttonCount = taskConfig.getWindowState("dynamicButton")
   * // 默认值: 9
   * 
   * // 获取窗口 frame
   * let frame = taskConfig.getWindowState("frame")
   * // {x: 0, y: 0, width: 40, height: 415}
   * 
   * // 在版本升级后的兼容处理
   * // 假设新版本添加了 "newFeature" 字段
   * let newFeature = taskConfig.getWindowState("newFeature")
   * // 老用户会获得 defaultWindowState 中的默认值
   * 
   * // 检查是否为分屏模式
   * if (taskConfig.getWindowState("splitMode")) {
   *   // 工具栏跟随分割线移动
   * }
   */
  static getWindowState(key){
    //用户已有配置可能不包含某些新的key，用这个方法做兼容性处理
    if (this.windowState[key] !== undefined) {
      return this.windowState[key]
    }else{
      return this.defaultWindowState[key]
    }
  }
  /**
   * 📐 获取工具栏方向
   * 
   * 获取工具栏的布局方向（垂直或水平）。
   * 
   * @param {boolean} [dynamic=false] - 是否获取动态工具栏的方向
   *   - false: 获取固定工具栏方向
   *   - true: 获取动态（跟随）工具栏方向
   * @returns {string} "vertical" 或 "horizontal"
   * 
   * @example
   * // 获取固定工具栏方向
   * let fixedDir = taskConfig.direction()
   * // "vertical" 或 "horizontal"
   * 
   * // 获取动态工具栏方向
   * let dynamicDir = taskConfig.direction(true)
   * 
   * // 根据方向调整布局
   * if (taskConfig.direction() === "vertical") {
   *   // 垂直布局：按钮从上到下排列
   *   frame.height = buttonCount * buttonHeight
   *   frame.width = buttonWidth
   * } else {
   *   // 水平布局：按钮从左到右排列
   *   frame.width = buttonCount * buttonWidth
   *   frame.height = buttonHeight
   * }
   */
  static direction(dynamic = false){
    if (dynamic) {
      return this.getWindowState("dynamicDirection")
    }else{
      return this.getWindowState("direction")
    }
  }
  
  /**
   * ➡️ 检查是否为水平布局
   * 
   * 判断工具栏是否使用水平布局（按钮从左到右排列）。
   * 
   * @param {boolean} [dynamic=false] - 是否检查动态工具栏
   * @returns {boolean} 是否为水平布局
   * 
   * @example
   * // 检查固定工具栏
   * if (taskConfig.horizontal()) {
   *   // 水平布局特定逻辑
   *   button.frame = {x: index * 50, y: 0, width: 45, height: 40}
   * }
   * 
   * // 检查动态工具栏
   * if (taskConfig.horizontal(true)) {
   *   // 调整动态工具栏的水平布局
   * }
   * 
   * // 在手势处理中使用
   * onPanGesture: function(gesture) {
   *   if (taskConfig.horizontal()) {
   *     // 水平方向只允许左右移动
   *     frame.x += gesture.translationX
   *   } else {
   *     // 垂直方向只允许上下移动
   *     frame.y += gesture.translationY
   *   }
   * }
   */
  static horizontal(dynamic = false){
    if (dynamic) {
      return this.getWindowState("dynamicDirection") === "horizontal"
    }else{
      return this.getWindowState("direction") === "horizontal"
    }
  }
  
  /**
   * ⬇️ 检查是否为垂直布局
   * 
   * 判断工具栏是否使用垂直布局（按钮从上到下排列）。
   * 
   * @param {boolean} [dynamic=false] - 是否检查动态工具栏
   * @returns {boolean} 是否为垂直布局
   * 
   * @example
   * // 检查固定工具栏
   * if (taskConfig.vertical()) {
   *   // 垂直布局特定逻辑
   *   button.frame = {x: 0, y: index * 50, width: 40, height: 45}
   * }
   * 
   * // 计算工具栏尺寸
   * let taskSize = {
   *   width: taskConfig.vertical() ? 40 : buttonCount * 40,
   *   height: taskConfig.vertical() ? buttonCount * 40 : 40
   * }
   * 
   * // 贴边判断
   * if (taskConfig.vertical()) {
   *   // 垂直布局可以贴左边或右边
   *   if (frame.x < 50) {
   *     // 吸附到左边
   *     frame.x = 0
   *   }
   * }
   */
  static vertical(dynamic = false){
    if (dynamic) {
      return this.getWindowState("dynamicDirection") === "vertical"
    }else{
      return this.getWindowState("direction") === "vertical"
    }
  }
  /**
   * 🔄 切换工具栏方向
   * 
   * 在垂直和水平布局之间切换工具栏方向。
   * 需要订阅才能使用此功能。
   * 
   * @param {string} source - 要切换的工具栏类型
   *   - "fixed": 切换固定工具栏方向
   *   - "dynamic": 切换动态工具栏方向
   * 
   * 切换逻辑：
   * - 垂直 → 水平
   * - 水平 → 垂直
   * 
   * @example
   * // 切换固定工具栏方向
   * taskConfig.toggleTaskDirection("fixed")
   * // 如果当前是垂直，切换为水平
   * // 显示 HUD: "Set fixed direction to horizontal"
   * 
   * // 切换动态工具栏方向
   * taskConfig.toggleTaskDirection("dynamic")
   * 
   * // 在按钮动作中使用
   * {
   *   action: "toggleDirection",
   *   handler: function() {
   *     taskConfig.toggleTaskDirection("fixed")
   *   }
   * }
   * 
   * // 双击切换方向
   * onDoubleClick: function() {
   *   let source = isDynamicMode ? "dynamic" : "fixed"
   *   taskConfig.toggleTaskDirection(source)
   * }
   * 
   * // 检查订阅状态
   * // 如果未订阅，会自动处理并返回
   */
  static toggleTaskDirection(source){
    if (!taskUtils.checkSubscribe(true)) {
      return
    }
    switch (source) {
      case "fixed":
        if (taskConfig.getWindowState("direction") === "vertical") {
          taskConfig.windowState.direction = "horizontal"
          taskConfig.save("MNTask_windowState")
          MNUtil.showHUD("Set fixed direction to horizontal")

        }else{
          taskConfig.windowState.direction = "vertical"
          taskConfig.save("MNTask_windowState")
          MNUtil.showHUD("Set fixed direction to vertical")
        }
        break;
      case "dynamic":
        if (taskConfig.getWindowState("dynamicDirection") === "vertical") {
          taskConfig.windowState.dynamicDirection = "horizontal"
          taskConfig.save("MNTask_windowState")
          MNUtil.showHUD("Set dynamic direction to horizontal")
        }else{
          taskConfig.windowState.dynamicDirection = "vertical"
          taskConfig.save("MNTask_windowState")
          MNUtil.showHUD("Set dynamic direction to vertical")
        }
        break;
      default:
        break;
    }
    MNUtil.postNotification("refreshTaskButton",{})
  }
  /**
   * 🌳 展开配置为脑图结构
   * 
   * 将配置对象递归展开为脑图笔记结构。
   * 常用于可视化配置、调试或教学目的。
   * 
   * @param {MbBookNote} note - 根笔记对象
   * @param {Object} config - 要展开的配置对象
   * @param {string[]} [orderedKeys=undefined] - 指定键的顺序，不指定则按对象默认顺序
   * @param {string} [exclude=undefined] - 要排除的键名
   * 
   * 展开规则：
   * - 对象类型：创建子笔记并递归展开
   * - 基本类型：创建子笔记，值作为摘录
   * - 支持嵌套对象的深度展开
   * 
   * @example
   * // 展开按钮配置到脑图
   * let rootNote = MNNote.getFocusNote()
   * let buttonConfig = {
   *   name: "Copy",
   *   image: "copy.png",
   *   action: {
   *     type: "copy",
   *     target: "title"
   *   }
   * }
   * taskConfig.expandesConfig(rootNote, buttonConfig)
   * // 生成的脑图结构：
   * // rootNote
   * // ├── name: Copy
   * // ├── image: copy.png
   * // └── action
   * //     ├── type: copy
   * //     └── target: title
   * 
   * // 按指定顺序展开
   * let orderedKeys = ["action", "name", "image"]
   * taskConfig.expandesConfig(rootNote, buttonConfig, orderedKeys)
   * 
   * // 排除某些敏感信息
   * let userConfig = {
   *   username: "user123",
   *   password: "secret",
   *   settings: { theme: "dark" }
   * }
   * taskConfig.expandesConfig(rootNote, userConfig, null, "password")
   * // password 字段不会被展开
   * 
   * // 调试整个插件配置
   * let allConfig = taskConfig.getAllConfig()
   * taskConfig.expandesConfig(rootNote, allConfig)
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
        let child = taskUtils.createChildNote(note,key)
        this.expandesConfig(child, subConfig,undefined,exclude)
      }else{
        if (exclude) {
          if (key !== exclude) {
            taskUtils.createChildNote(note,key,config[key])
          }
        }else{
          taskUtils.createChildNote(note,key,config[key])
        }
      }
    })
  }
  /**
   * 🎨 检查插件 Logo 显示状态
   * 
   * 检查特定插件的 Logo 是否应该显示。
   * 用于控制插件推广图标的显示/隐藏。
   * 
   * @param {string} addon - 插件标识符（如 "MNUtils", "MNChatAI" 等）
   * @returns {boolean} 是否显示该插件的 Logo
   *   - true: 显示 Logo（默认值）
   *   - false: 隐藏 Logo
   * 
   * @example
   * // 检查是否显示 MNUtils 的 Logo
   * if (taskConfig.checkLogoStatus("MNUtils")) {
   *   // 在工具栏或设置界面显示 MNUtils 推广图标
   *   showPromoLogo("MNUtils")
   * }
   * 
   * // 在设置界面中使用
   * let addons = ["MNUtils", "MNChatAI", "MNSearch"]
   * addons.forEach(addon => {
   *   let showLogo = taskConfig.checkLogoStatus(addon)
   *   let switchCell = createSwitchCell(addon + " Logo", showLogo)
   *   switchCell.onSwitch = (isOn) => {
   *     taskConfig.addonLogos[addon] = isOn
   *     taskConfig.save()
   *   }
   * })
   * 
   * // 条件显示推广内容
   * if (taskConfig.checkLogoStatus("MNChatAI") && !isChatAIInstalled()) {
   *   // 显示安装提示
   *   showInstallHint("MNChatAI")
   * }
   */
  static checkLogoStatus(addon){
  // try {
    if (this.addonLogos && (addon in this.addonLogos)) {
      return this.addonLogos[addon]
    }else{
      return true
    }
  // } catch (error) {
  //   taskUtils.addErrorLog(error, "checkLogoStatus")
  //   return true
  // }
  }
/**
 * 📄 生成动作配置模板
 * 
 * 为指定的动作生成默认配置模板。
 * 用于帮助用户快速创建自定义动作配置。
 * 
 * @param {string} action - 动作类型
 * @returns {string} 格式化的 JSON 配置字符串
 * 
 * 支持的动作类型：
 * - "cloneAndMerge": 克隆并合并笔记
 * - "link": 链接笔记
 * - "clearContent": 清除内容
 * - "setContent": 设置内容
 * - "addComment": 添加评论
 * - "removeComment": 移除评论
 * - "copy": 复制内容
 * - "showInFloatWindow": 在浮窗显示
 * - "addChildNote": 添加子笔记
 * 
 * @example
 * // 生成复制动作的模板
 * let copyTemplate = taskConfig.template("copy")
 * console.log(copyTemplate)
 * // {
 * //   "action": "copy",
 * //   "target": "title"
 * // }
 * 
 * // 生成链接动作的模板
 * let linkTemplate = taskConfig.template("link")
 * // {
 * //   "action": "link",
 * //   "target": "marginnote4app://note/xxxx",
 * //   "type": "Both"
 * // }
 * 
 * // 在设置界面中使用
 * function showTemplateMenu() {
 *   let actions = ["copy", "link", "addComment", "setContent"]
 *   let templates = actions.map(action => {
 *     return {
 *       title: action,
 *       template: taskConfig.template(action)
 *     }
 *   })
 *   // 显示模板选择菜单
 * }
 * 
 * // 帮助用户创建自定义动作
 * let template = taskConfig.template("addChildNote")
 * // 用户可以基于这个模板修改
 * let customConfig = JSON.parse(template)
 * customConfig.title = "我的笔记"
 * customConfig.content = "自定义内容"
 */
static template(action) {
  let config = {action:action}
  switch (action) {
    case "cloneAndMerge":
      config.target = taskUtils.version.version+"app://note/xxxx"
      break
    case "link":
      config.target = taskUtils.version.version+"app://note/xxxx"
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
      config.target = taskUtils.version+"app://note/xxxx"
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
/**
 * 🔧 获取按钮动作配置
 * 
 * 获取指定按钮的完整配置信息。
 * 智能处理用户自定义配置和默认配置的合并。
 * 
 * @param {string} actionKey - 按钮动作标识（如 "copy", "search", "custom1" 等）
 * @returns {Object} 按钮配置对象
 * @returns {string} returns.name - 按钮显示名称
 * @returns {string} returns.image - 按钮图标文件名
 * @returns {string} returns.description - 按钮动作描述（JSON 字符串）
 * 
 * 配置优先级：
 * 1. 用户自定义配置（this.actions）
 * 2. 默认配置（getActions() 返回的配置）
 * 3. 自动修复无效的 description
 * 
 * @example
 * // 获取复制按钮的配置
 * let copyAction = taskConfig.getAction("copy")
 * // {
 * //   name: "Copy",
 * //   image: "copyExcerptPic",
 * //   description: "{}"
 * // }
 * 
 * // 获取自定义按钮配置
 * let customAction = taskConfig.getAction("custom1")
 * // {
 * //   name: "我的功能",
 * //   image: "myicon",
 * //   description: '{"action":"myAction","target":"title"}'
 * // }
 * 
 * // 在创建按钮时使用
 * function createButton(actionKey) {
 *   let config = taskConfig.getAction(actionKey)
 *   let button = UIButton.new()
 *   button.setTitle(config.name, UIControlStateNormal)
 *   
 *   // 设置图标
 *   let image = taskConfig.imageConfigs[actionKey]
 *   button.setImage(image, UIControlStateNormal)
 *   
 *   // 解析动作描述
 *   let des = JSON.parse(config.description)
 *   button.des = des
 *   
 *   return button
 * }
 * 
 * // 兼容性处理示例
 * // 如果用户的 description 是旧格式或损坏的
 * // 会自动使用默认的 description
 */
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
/**
 * 🔑 获取默认按钮动作键列表
 * 
 * 返回所有可用按钮的动作键数组。
 * 这些键是按钮的唯一标识符。
 * 
 * @returns {string[]} 默认的按钮动作键数组
 * 
 * @example
 * // 获取所有默认按钮
 * let defaultKeys = taskConfig.getDefaultActionKeys()
 * // ["copy", "searchInEudic", "switchTitleorExcerpt", "copyAsMarkdownLink", 
 * //  "search", "bigbang", "snipaste", "chatglm", "setting", "edit", 
 * //  "ocr", "execute", "pasteAsTitle", "clearFormat", 
 * //  "color0", "color1", ..., "color15", 
 * //  "custom1", "custom2", ..., "custom19", 
 * //  "timer", "sidebar", "undo", "redo"]
 * 
 * // 重置按钮顺序到默认值
 * taskConfig.action = taskConfig.getDefaultActionKeys()
 * taskConfig.save("MNTask_action")
 * 
 * // 检查某个按钮是否为默认按钮
 * let isDefault = taskConfig.getDefaultActionKeys().includes("myButton")
 * 
 * // 获取所有自定义按钮
 * let customButtons = taskConfig.getDefaultActionKeys()
 *   .filter(key => key.startsWith("custom"))
 */
static getDefaultActionKeys() {
  let actions = this.getActions()
  // MNUtil.copyJSON(actions)
  // MNUtil.copyJSON(Object.keys(actions))
  return Object.keys(actions)
}
/**
 * 💾 保存配置到本地存储
 * 
 * 灵活的配置保存方法，支持保存单个配置项或所有配置。
 * 自动处理云同步和修改时间更新。
 * 
 * @param {string} [key=undefined] - 要保存的配置键名，不传则保存所有配置
 * @param {*} [value=undefined] - 要保存的值，不传则使用类中对应的属性值
 * @param {boolean} [upload=true] - 是否同步到云端
 * 
 * 支持的配置键：
 * - "MNTask_windowState": 窗口状态（iOS 不同步）
 * - "MNTask_dynamic": 动态模式开关
 * - "MNTask_action": 固定工具栏按钮顺序
 * - "MNTask_dynamicAction": 动态工具栏按钮顺序
 * - "MNTask_actionConfig": 按钮动作配置
 * - "MNTask_addonLogos": 插件 Logo 显示状态
 * - "MNTask_buttonConfig": 按钮样式配置
 * - "MNTask_popupConfig": 弹出菜单配置
 * - "MNTask_imageScale": 图片缩放配置
 * - "MNTask_syncConfig": 同步配置
 * 
 * @example
 * // 保存所有配置
 * taskConfig.save()
 * 
 * // 保存单个配置项（使用类属性值）
 * taskConfig.windowState.frame = newFrame
 * taskConfig.save("MNTask_windowState")
 * 
 * // 保存自定义值
 * taskConfig.save("MNTask_action", ["copy", "search", "custom1"])
 * 
 * // 保存但不同步到云端
 * taskConfig.save("MNTask_syncConfig", null, false)
 * 
 * // 在设置变更后保存
 * function onButtonOrderChanged(newOrder) {
 *   taskConfig.action = newOrder
 *   taskConfig.save("MNTask_action")
 *   MNUtil.postNotification("refreshTaskButton", {})
 * }
 * 
 * // 批量修改后一次性保存
 * taskConfig.buttonConfig.color = "#ff0000"
 * taskConfig.buttonConfig.alpha = 0.9
 * taskConfig.windowState.direction = "horizontal"
 * taskConfig.save() // 保存所有更改
 */
static save(key = undefined,value = undefined,upload = true) {
  // MNUtil.showHUD("save")
  if(key === undefined){
    let defaults = NSUserDefaults.standardUserDefaults()
    defaults.setObjectForKey(this.windowState,"MNTask_windowState")
    defaults.setObjectForKey(this.dynamic,"MNTask_dynamic")
    defaults.setObjectForKey(this.action,"MNTask_action")
    defaults.setObjectForKey(this.dynamicAction,"MNTask_dynamicAction")
    defaults.setObjectForKey(this.actions,"MNTask_actionConfig")
    defaults.setObjectForKey(this.addonLogos,"MNTask_addonLogos")
    defaults.setObjectForKey(this.buttonConfig,"MNTask_buttonConfig")
    defaults.setObjectForKey(this.popupConfig,"MNTask_popupConfig")
    defaults.setObjectForKey(this.imageScale,"MNTask_imageScale")
    defaults.setObjectForKey(this.syncConfig,"MNTask_syncConfig")
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
      case "MNTask_windowState":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.windowState,key)
        if (MNUtil.isIOS()) { //iOS端不参与"MNTask_windowState"的云同步
          return
        }
        break;
      case "MNTask_dynamic":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.dynamic,key)
        break;
      case "MNTask_dynamicAction":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.dynamicAction,key)
        break;
      case "MNTask_action":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.action,key)
        break;
      case "MNTask_actionConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.actions,key)
        break;
      case "MNTask_addonLogos":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.addonLogos,key)
        break;
      case "MNTask_buttonConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.buttonConfig,key)
        break;
      case "MNTask_popupConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.popupConfig,key)
        break;
      case "MNTask_imageScale":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.imageScale,key)
        break;
      case "MNTask_syncConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.syncConfig,key)
        break;
      default:
        taskUtils.showHUD("Not supported")
        break;
    }
    this.syncConfig.lastModifyTime = Date.now()
    if (upload && this.iCloudSync) {
      this.writeCloudConfig(false)
    }
  }
  NSUserDefaults.standardUserDefaults().synchronize()
}

/**
 * 📖 获取配置值
 * 
 * 从本地存储中直接获取指定键的值。
 * 这是一个低级方法，通常使用更高级的方法如 getAction()。
 * 
 * @param {string} key - 配置键名
 * @returns {*} 存储的值，不存在时返回 undefined
 * 
 * @example
 * // 获取原始配置值
 * let windowState = taskConfig.get("MNTask_windowState")
 * 
 * // 检查某个配置是否存在
 * if (taskConfig.get("MNTask_customKey") !== undefined) {
 *   // 配置存在
 * }
 */
static get(key) {
  return NSUserDefaults.standardUserDefaults().objectForKey(key)
}

/**
 * 📖 获取配置值（带默认值）
 * 
 * 安全地获取配置值，如果不存在则使用默认值并保存。
 * 这是推荐的配置读取方式，确保总有有效值返回。
 * 
 * @param {string} key - 配置键名
 * @param {*} defaultValue - 配置不存在时的默认值
 * @returns {*} 存储的值或默认值
 * 
 * 特性：
 * - 如果键不存在，自动保存默认值
 * - 保证返回值永不为 undefined
 * - 适合初始化配置项
 * 
 * @example
 * // 获取配置，不存在时使用默认值
 * let theme = taskConfig.getByDefault("MNTask_theme", "light")
 * // 第一次调用返回 "light" 并保存
 * // 后续调用返回已保存的值
 * 
 * // 初始化数组配置
 * let favorites = taskConfig.getByDefault("MNTask_favorites", [])
 * 
 * // 初始化对象配置
 * let shortcuts = taskConfig.getByDefault("MNTask_shortcuts", {
 *   copy: "Cmd+C",
 *   paste: "Cmd+V"
 * })
 */
static getByDefault(key,defaultValue) {
  let value = NSUserDefaults.standardUserDefaults().objectForKey(key)
  if (value === undefined) {
    NSUserDefaults.standardUserDefaults().setObjectForKey(defaultValue,key)
    return defaultValue
  }
  return value
}

/**
 * 🗑️ 删除配置项
 * 
 * 从本地存储中完全删除指定的配置项。
 * 谨慎使用，删除后无法恢复。
 * 
 * @param {string} key - 要删除的配置键名
 * 
 * @example
 * // 删除单个配置
 * taskConfig.remove("MNTask_tempData")
 * 
 * // 清理过期配置
 * let oldKeys = ["MNTask_v1", "MNTask_legacy"]
 * oldKeys.forEach(key => taskConfig.remove(key))
 * 
 * // 重置前先删除
 * taskConfig.remove("MNTask_cache")
 * taskConfig.getByDefault("MNTask_cache", {})
 */
static remove(key) {
  NSUserDefaults.standardUserDefaults().removeObjectForKey(key)
}
/**
 * 🔄 重置配置到默认值
 * 
 * 将指定类型的配置重置为默认值。
 * 支持重置按钮配置、按钮顺序等。
 * 
 * @param {string} target - 要重置的目标类型
 *   - "config": 重置所有按钮的动作配置
 *   - "order": 重置固定工具栏的按钮顺序
 *   - "dynamicOrder": 重置动态工具栏的按钮顺序
 * 
 * @example
 * // 重置按钮配置
 * taskConfig.reset("config")
 * // 所有按钮恢复默认动作
 * 
 * // 重置按钮顺序
 * taskConfig.reset("order")
 * // 固定工具栏恢复默认顺序
 * 
 * // 重置动态工具栏顺序
 * taskConfig.reset("dynamicOrder")
 * 
 * // 在设置界面使用
 * function showResetMenu() {
 *   let options = [
 *     { title: "重置按钮配置", action: "config" },
 *     { title: "重置按钮顺序", action: "order" },
 *     { title: "重置动态顺序", action: "dynamicOrder" }
 *   ]
 *   // 显示选择菜单
 *   let selected = await showMenu(options)
 *   if (selected) {
 *     taskConfig.reset(selected.action)
 *     MNUtil.showHUD("已重置")
 *     MNUtil.postNotification("refreshTaskButton", {})
 *   }
 * }
 */
static reset(target){
  switch (target) {
    case "config":
      this.actions = this.getActions()
      this.save("MNTask_actionConfig")
      break;
    case "order":
      this.action = this.getDefaultActionKeys()
      this.save("MNTask_action")
      break;  
    case "dynamicOrder":
      this.dynamicAction = this.getDefaultActionKeys()
      this.save("MNTask_dynamicAction")
      break;
    default:
      break;
  }
}
/**
 * 📍 通过索引获取按钮描述
 * 
 * 根据按钮在工具栏中的位置索引获取其动作描述。
 * 用于处理按钮点击事件。
 * 
 * @param {number} index - 按钮在工具栏中的索引（从 0 开始）
 * @returns {Object} 解析后的动作描述对象
 * 
 * @example
 * // 处理按钮点击
 * onButtonClick: function(button) {
 *   let index = this.buttons.indexOf(button)
 *   let des = taskConfig.getDescriptionByIndex(index)
 *   // des = { action: "copy", target: "title" }
 *   this.performAction(des)
 * }
 * 
 * // 获取第一个按钮的配置
 * let firstButtonDes = taskConfig.getDescriptionByIndex(0)
 * console.log("第一个按钮:", firstButtonDes)
 */
static getDescriptionByIndex(index){
  let actionName = taskConfig.action[index]
  if (actionName in taskConfig.actions) {
    return JSON.parse(taskConfig.actions[actionName].description)
  }else{
    return JSON.parse(taskConfig.getActions()[actionName].description)
  }
}
/**
 * 💻 获取执行代码
 * 
 * 获取 execute 按钮的代码内容。
 * execute 按钮允许用户自定义 JavaScript 代码。
 * 
 * @returns {string} JavaScript 代码字符串
 * 
 * @example
 * // 获取并执行代码
 * let code = taskConfig.getExecuteCode()
 * // code = "MNUtil.showHUD('Hello world')"
 * 
 * // 在沙箱中执行
 * try {
 *   eval(code)
 * } catch (error) {
 *   MNUtil.showHUD("代码错误: " + error.message)
 * }
 * 
 * // 显示代码编辑器
 * let currentCode = taskConfig.getExecuteCode()
 * showCodeEditor(currentCode, (newCode) => {
 *   taskConfig.actions.execute.description = newCode
 *   taskConfig.save("MNTask_actionConfig")
 * })
 */
static getExecuteCode(){
  let actionName = "execute"
  if (actionName in taskConfig.actions) {
    return taskConfig.actions[actionName].description
  }else{
    return taskConfig.getActions()[actionName].description
  }
}
/**
 * 📋 通过名称获取按钮描述
 * 
 * 根据按钮动作名称获取其描述对象。
 * 智能处理 JSON 格式和特殊情况。
 * 
 * @param {string} actionName - 按钮动作名称（如 "copy", "search", "custom1" 等）
 * @returns {Object} 解析后的动作描述对象，解析失败返回空对象
 * 
 * 特殊处理：
 * - 自动解析 JSON 字符串
 * - 兼容旧版 "pasteAsTitle" 格式
 * - 无效 JSON 返回空对象而非抛出错误
 * 
 * @example
 * // 获取复制按钮的描述
 * let copyDes = taskConfig.getDescriptionByName("copy")
 * // {} 或 { action: "copy", target: "title" }
 * 
 * // 获取自定义按钮描述
 * let customDes = taskConfig.getDescriptionByName("custom1")
 * // { action: "cloneAndMerge", target: "marginnote4app://note/xxxx" }
 * 
 * // 安全使用
 * let des = taskConfig.getDescriptionByName(actionName)
 * if (des.action) {
 *   // 有效的动作描述
 *   this.performAction(des)
 * } else {
 *   // 空描述，使用默认行为
 * }
 * 
 * // 特殊情况：pasteAsTitle
 * let pasteDes = taskConfig.getDescriptionByName("pasteAsTitle")
 * // 即使 JSON 无效，也会返回兼容的描述对象
 */
static getDescriptionByName(actionName){
  let des
  if (actionName in taskConfig.actions) {
    des = taskConfig.actions[actionName].description
  }else{
    des = taskConfig.getActions()[actionName].description
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
/**
 * ✅ 检查按钮是否可保存配置
 * 
 * 判断指定的按钮是否允许用户自定义配置。
 * 某些系统按钮的行为是固定的，不允许修改。
 * 
 * @param {string} actionName - 按钮动作名称
 * @returns {boolean} 是否允许保存自定义配置
 * 
 * 可保存的按钮类型：
 * - 所有 custom 按钮（custom1-19）
 * - 所有颜色按钮（color0-15）
 * - 白名单中的特定按钮
 * 
 * @example
 * // 检查是否可以修改
 * if (taskConfig.checkCouldSave("custom1")) {
 *   // 允许用户编辑配置
 *   showConfigEditor("custom1")
 * }
 * 
 * // 在保存前检查
 * function saveButtonConfig(actionName, newConfig) {
 *   if (!taskConfig.checkCouldSave(actionName)) {
 *     // 显示 HUD: "Only available for Custom Action!"
 *     return false
 *   }
 *   taskConfig.actions[actionName].description = JSON.stringify(newConfig)
 *   taskConfig.save("MNTask_actionConfig")
 *   return true
 * }
 * 
 * // 批量检查
 * let editableButtons = allButtons.filter(name => 
 *   taskConfig.checkCouldSave(name)
 * )
 */
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


/**
 * 🏖️ 代码沙箱执行类
 * 
 * 提供受限的代码执行环境，用于运行用户自定义的 JavaScript 代码。
 * 主要用于 execute 按钮的功能实现。
 * 
 * 特性：
 * - 需要订阅才能使用
 * - 使用严格模式执行代码
 * - 自动捕获和记录错误
 * - 访问完整的 MNUtil API
 * 
 * @class
 * 
 * @example
 * // 执行简单代码
 * await taskSandbox.execute('MNUtil.showHUD("Hello World")')
 * 
 * // 执行复杂操作
 * let code = `
 *   let note = MNNote.getFocusNote()
 *   if (note) {
 *     note.noteTitle = "已处理: " + note.noteTitle
 *     MNUtil.showHUD("标题已更新")
 *   }
 * `
 * await taskSandbox.execute(code)
 * 
 * // 在 execute 按钮中使用
 * case "execute":
 *   let executeCode = taskConfig.getExecuteCode()
 *   await taskSandbox.execute(executeCode)
 *   break
 */
class taskSandbox{
  /**
   * 🚀 执行代码
   * 
   * 在沙箱环境中执行用户提供的 JavaScript 代码。
   * 需要有效订阅才能使用此功能。
   * 
   * @param {string} code - 要执行的 JavaScript 代码字符串
   * @returns {Promise<void>}
   * 
   * 安全限制：
   * - 代码在严格模式下执行
   * - 错误会被捕获并记录
   * - 需要订阅验证
   * 
   * 可用的全局对象：
   * - MNUtil: 核心工具类
   * - MNNote: 笔记操作类
   * - MNNotebook: 笔记本操作类
   * - MNDocument: 文档操作类
   * - UIKit 组件（如 UIButton, UIView 等）
   * - 其他 MarginNote 插件 API
   * 
   * @example
   * // 基础使用
   * await taskSandbox.execute('MNUtil.showHUD("执行成功")')
   * 
   * // 处理笔记
   * let code = `
   *   let notes = MNNote.getFocusNotes()
   *   notes.forEach(note => {
   *     note.colorIndex = 2  // 设置为蓝色
   *   })
   *   MNUtil.showHUD(\`处理了 \${notes.length} 个笔记\`)
   * `
   * await taskSandbox.execute(code)
   * 
   * // 带错误处理
   * let userCode = getUserInput()
   * try {
   *   await taskSandbox.execute(userCode)
   * } catch (error) {
   *   // 错误已被内部记录，这里通常不会触发
   * }
   * 
   * // 访问脑图视图（注释中的示例）
   * let advancedCode = `
   *   // 可以访问高级 API
   *   let mindmapView = MNUtil.mindmapView
   *   console.log("缩放级别:", mindmapView.zoomScale)
   * `
   * 
   * ⚠️ 注意：
   * - 代码执行是同步的，避免长时间运行
   * - 无法访问外部作用域的变量
   * - 错误会记录到错误日志中
   */
  static async execute(code){
    'use strict';
    if (!taskUtils.checkSubscribe(true)) {
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
      taskUtils.addErrorLog(error, "executeInSandbox",code)
    }
  }
}