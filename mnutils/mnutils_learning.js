/**
 * 🎯 MNUtils 核心框架学习版 - 超详细注释版本
 * 
 * 【MNUtils 是什么？】
 * MNUtils 是 MarginNote 插件开发的核心框架，就像 jQuery 之于网页开发。
 * 它封装了 MarginNote 的底层 API，提供了简单易用的接口，让插件开发变得简单。
 * 
 * 【为什么需要 MNUtils？】
 * 1. 原生 API 复杂：MarginNote 的原生 API 基于 Objective-C，使用起来繁琐
 * 2. 功能分散：需要调用多个对象和方法才能完成一个简单功能
 * 3. 缺少工具：没有现成的 UI 组件、文件操作、网络请求等工具
 * 4. 容易出错：直接操作底层 API 容易引发崩溃
 * 
 * 【MNUtils 提供了什么？】
 * ┌─────────────────────────────────────────────┐
 * │                  MNUtils 框架                │
 * ├─────────────────────────────────────────────┤
 * │  🎨 UI 组件    │  📝 笔记操作   │  🔧 工具函数  │
 * │  • Menu 菜单   │  • MNNote     │  • 文件操作   │
 * │  • Button 按钮 │  • MNNotebook │  • 剪贴板     │
 * │  • HUD 提示    │  • MNDocument │  • 网络请求   │
 * │  • 对话框      │  • MNComment  │  • 数据存储   │
 * └─────────────────────────────────────────────┘
 * 
 * 【学习路线图】
 * 初级：Menu → MNUtil 基础方法 → MNNote 基础操作
 * 中级：MNButton → MNNotebook → MNDocument
 * 高级：MNConnection → MNComment → MNExtensionPanel
 * 
 * 【版本信息】
 * - 当前版本：0.1.5.alpha0624
 * - 文件大小：6878 行
 * - 支持版本：MarginNote 3.7.11+
 * 
 * 📚 配套文档：
 * - 项目总览：/MN-Addon/CLAUDE.md
 * - API 指南：/MN-Addon/MNUTILS_API_GUIDE.md
 * - 开发指南：/MN-Addon/mnutils/CLAUDE.md
 */

// ============================================================================
// 🎨 Menu 类 - 弹出菜单组件（第 1-139 行）
// ============================================================================

/**
 * 🍱 Menu 类 - 创建优雅的弹出菜单
 * 
 * 【什么是弹出菜单？】
 * 弹出菜单就是右键菜单，在 MarginNote 中广泛使用：
 * - 在笔记上右键：复制、删除、制卡等选项
 * - 在选中文本上右键：创建笔记、高亮等选项
 * - 点击插件按钮：显示功能菜单
 * 
 * 【Menu 类的特点】
 * 1. 智能定位：自动避免菜单超出屏幕
 * 2. 简单易用：几行代码就能创建专业菜单
 * 3. 高度定制：可以自定义样式、大小、位置
 * 4. 状态支持：菜单项可以显示勾选状态
 * 
 * 【菜单的工作原理】
 * ┌─────────────────┐
 * │ 🔘 触发按钮      │ ← 用户点击
 * └────────┬────────┘
 *          │ 
 *          ▼
 * ┌─────────────────┐
 * │ ✓ 复制笔记      │ ← 菜单项 1（勾选状态）
 * │   删除笔记      │ ← 菜单项 2
 * │   制作卡片      │ ← 菜单项 3
 * │ ─────────────   │ ← 分隔线（可选）
 * │   更多选项...   │ ← 菜单项 4
 * └─────────────────┘
 * 
 * 【基本使用流程】
 * ```javascript
 * // 1. 创建菜单对象
 * let menu = new Menu(button, self, 200)
 * 
 * // 2. 添加菜单项
 * menu.addMenuItem("复制", "copyNote:", note)
 * menu.addMenuItem("删除", "deleteNote:", note)
 * 
 * // 3. 显示菜单
 * menu.show()
 * ```
 */
class Menu{
  /**
   * 📍 菜单弹出的首选位置
   * 
   * 【位置编号说明】
   * 这个属性决定菜单相对于触发按钮的弹出方向：
   *        2 (上)
   *         ↑
   *   0 ← 按钮 → 4
   *  (左)   ↓   (右)
   *       1,3 (下)
   * 
   * 【为什么有两个下（1和3）？】
   * - 1: iOS 默认的向下弹出
   * - 3: 备选的向下弹出（某些情况下使用）
   * 
   * @type {number}
   */
  preferredPosition = 2  // 默认向上弹出（通常不会遮挡内容）
  
  /**
   * 📝 菜单项标题数组（暂未使用）
   * 预留属性，可能用于未来的功能扩展
   * @type {string[]}
   */
  titles = []
  
  /**
   * 🏗️ 创建一个新的菜单实例
   * 
   * 【构造函数详解】
   * 这个构造函数会：
   * 1. 创建底层的菜单控制器
   * 2. 保存必要的引用（触发者、处理者）
   * 3. 设置菜单的基本属性
   * 
   * @param {UIView} sender - 触发菜单的 UI 元素（通常是按钮）
   *   - 必须是有效的视图对象
   *   - 菜单会根据这个元素的位置来定位
   *   - 例如：UIButton, UIView, 或任何可点击的元素
   * 
   * @param {object} delegate - 处理菜单点击的对象（通常是插件主类）
   *   - 必须实现菜单项对应的方法
   *   - 例如：如果菜单项的 selector 是 "copyNote:"，delegate 必须有 copyNote 方法
   * 
   * @param {number} [width=200] - 菜单宽度（像素）
   *   - 默认 200 像素适合大多数场景
   *   - 可以根据最长的菜单项文字调整
   *   - 建议范围：150-300 像素
   * 
   * @param {number} [preferredPosition=2] - 首选弹出位置
   *   - 参见 preferredPosition 属性说明
   *   - 默认向上弹出最不容易遮挡内容
   * 
   * @example
   * // 示例1：基本用法
   * let menu = new Menu(button, self)
   * 
   * // 示例2：自定义宽度
   * let menu = new Menu(button, self, 250)
   * 
   * // 示例3：指定弹出方向（向右）
   * let menu = new Menu(button, self, 200, 4)
   * 
   * // 示例4：在插件类中使用
   * class MyPlugin {
   *   onButtonClick(button) {
   *     // self 指向插件实例，包含菜单项的处理方法
   *     let menu = new Menu(button, self, 200)
   *     menu.addMenuItem("选项1", "handleOption1:", null)
   *     menu.show()
   *   }
   *   
   *   handleOption1(sender) {
   *     MNUtil.showHUD("选项1被点击")
   *   }
   * }
   */
  constructor(sender,delegate,width = 200,preferredPosition = 2){
    // 创建系统的菜单控制器（这是 iOS 的原生组件）
    this.menuController = MenuController.new()
    
    // 保存委托对象的引用
    // 当用户点击菜单项时，会调用这个对象上的方法
    this.delegate = delegate
    
    // 保存触发菜单的 UI 元素
    // 用于计算菜单应该出现的位置
    this.sender = sender
    
    // 初始化命令表（存储所有菜单项的数据）
    // 每个元素包含：title, object, selector, param, checked
    this.commandTable = []
    
    // 设置菜单宽度
    this.width = width
    
    // 设置每个菜单项的高度
    // 35 像素是 iOS 标准的菜单项高度，确保良好的点击体验
    this.menuController.rowHeight = 35
    
    // 设置首选弹出位置
    this.preferredPosition = preferredPosition
  }
  
  /**
   * 📋 批量设置菜单项（setter 方法）
   * 
   * 【使用场景】
   * 当你已经有一个菜单项数组时，可以一次性设置所有菜单项
   * 
   * @param {object[]} items - 菜单项数组
   * 
   * @example
   * menu.menuItems = [
   *   {title: "复制", selector: "copy:", param: note},
   *   {title: "删除", selector: "delete:", param: note}
   * ]
   */
  set menuItems(items){
    this.commandTable = items
  }
  
  /**
   * 📋 获取所有菜单项（getter 方法）
   * @returns {object[]} 当前的所有菜单项
   */
  get menuItems(){
    return this.commandTable
  }
  
  /**
   * 📏 设置菜单项高度
   * 
   * 【何时需要调整高度？】
   * - 默认 35 像素适合单行文字
   * - 如果菜单项有小图标，可能需要 40-45 像素
   * - 如果要显示两行文字，可能需要 50-60 像素
   * 
   * @param {number} height - 高度值（像素）
   * 
   * @example
   * // 为带图标的菜单设置更大的行高
   * menu.rowHeight = 45
   */
  set rowHeight(height){
    this.menuController.rowHeight = height
  }
  
  get rowHeight(){
    return this.menuController.rowHeight
  }
  
  /**
   * 🔤 设置菜单字体大小
   * 
   * 【字体大小建议】
   * - 14: 默认大小，适合大多数场景
   * - 12: 紧凑显示，适合菜单项较多时
   * - 16: 大字体，适合重要操作或视力不佳用户
   * 
   * @param {number} size - 字体大小
   */
  set fontSize(size){
    this.menuController.fontSize = size
  }
  
  get fontSize(){
    return this.menuController.fontSize
  }
  
  /**
   * ➕ 添加单个菜单项
   * 
   * 【核心方法】这是最常用的添加菜单项的方法
   * 
   * 【工作原理】
   * 1. 用户点击菜单项
   * 2. 系统调用 delegate.selector(sender)
   * 3. sender.userInfo.param 包含传递的参数
   * 
   * @param {string} title - 菜单项显示的文字
   *   - 保持简洁，通常 2-6 个字
   *   - 可以包含 emoji：`"📋 复制"`
   *   - 支持中英文
   * 
   * @param {string} selector - 点击后调用的方法名
   *   - 必须以冒号结尾（Objective-C 风格）
   *   - 方法必须在 delegate 对象上存在
   *   - 方法签名：`methodName(sender)`
   * 
   * @param {any} [params=""] - 传递给方法的参数
   *   - 可以是任何类型：对象、字符串、数字等
   *   - 在方法中通过 `sender.userInfo.param` 获取
   *   - 多个参数可以用对象或数组包装
   * 
   * @param {boolean} [checked=false] - 是否显示勾选状态
   *   - true: 在菜单项前显示 ✓
   *   - false: 不显示勾选标记
   *   - 用于表示开关状态或当前选中项
   * 
   * @example
   * // 示例1：基本菜单项
   * menu.addMenuItem("复制", "copyNote:", note)
   * 
   * // 示例2：带勾选状态的菜单项
   * menu.addMenuItem("自动保存", "toggleAutoSave:", null, isAutoSaveOn)
   * 
   * // 示例3：传递复杂参数
   * menu.addMenuItem("移动到...", "moveNote:", {
   *   note: note,
   *   targetNotebook: notebook
   * })
   * 
   * // 示例4：使用 emoji 图标
   * menu.addMenuItem("🗑️ 删除", "deleteNote:", note)
   * menu.addMenuItem("⭐ 收藏", "starNote:", note, note.isStarred)
   * 
   * // 对应的处理方法示例
   * class MyPlugin {
   *   copyNote(sender) {
   *     let note = sender.userInfo.param
   *     MNUtil.copy(note.noteId)
   *     MNUtil.showHUD("已复制笔记 ID")
   *   }
   *   
   *   toggleAutoSave(sender) {
   *     this.autoSave = !this.autoSave
   *     MNUtil.showHUD(this.autoSave ? "自动保存已开启" : "自动保存已关闭")
   *   }
   * }
   */
  addMenuItem(title,selector,params = "",checked=false){
    // 构建菜单项对象并添加到命令表
    this.commandTable.push({
      title: title,           // 显示的文字
      object: this.delegate,  // 处理点击的对象（包含 selector 方法的对象）
      selector: selector,     // 要调用的方法名
      param: params,         // 传递的参数（存储在 sender.userInfo.param 中）
      checked: checked       // 是否显示勾选标记
    })
  }
  
  /**
   * ➕➕ 批量添加多个菜单项
   * 
   * 【使用场景】
   * - 从配置文件加载菜单
   * - 动态生成菜单项
   * - 复用菜单配置
   * 
   * @param {object[]} items - 菜单项对象数组
   * 
   * 【菜单项对象格式】
   * {
   *   title: string,      // 必需：显示文字
   *   selector: string,   // 必需：方法名
   *   param: any,        // 可选：参数
   *   checked: boolean,  // 可选：勾选状态
   *   object: object     // 可选：自定义处理对象（默认使用 delegate）
   * }
   * 
   * @example
   * // 示例1：基本用法
   * menu.addMenuItems([
   *   {title: "复制", selector: "copyNote:", param: note},
   *   {title: "删除", selector: "deleteNote:", param: note},
   *   {title: "分享", selector: "shareNote:", param: note}
   * ])
   * 
   * // 示例2：从配置生成菜单
   * const colorMenuItems = colors.map((color, index) => ({
   *   title: color.name,
   *   selector: "setNoteColor:",
   *   param: index,
   *   checked: note.colorIndex === index
   * }))
   * menu.addMenuItems(colorMenuItems)
   * 
   * // 示例3：混合不同的处理对象
   * menu.addMenuItems([
   *   {title: "内部功能", selector: "internalFunc:", param: data},
   *   {title: "外部功能", selector: "externalFunc:", param: data, object: externalHandler}
   * ])
   */
  addMenuItems(items){
    // 遍历所有菜单项，确保每个都有处理对象
    let fullItems = items.map(item=>{
      if ("object" in item) {
        // 如果指定了自定义处理对象，使用它
        return item
      }else{
        // 否则使用默认的 delegate
        item.object = this.delegate
        return item
      }
    })
    // 使用展开运算符将所有项添加到命令表
    this.commandTable.push(...fullItems)
  }
  
  /**
   * 📍 在指定位置插入单个菜单项
   * 
   * 【使用场景】
   * - 在现有菜单中插入分隔线
   * - 根据条件动态插入选项
   * - 调整菜单项顺序
   * 
   * @param {number} index - 插入位置（0 开始）
   * @param {string} title - 菜单项标题
   * @param {string} selector - 方法名
   * @param {any} [params=""] - 参数
   * @param {boolean} [checked=false] - 勾选状态
   * 
   * @example
   * // 在第二个位置插入新菜单项
   * menu.addMenuItem("复制", "copy:", note)
   * menu.addMenuItem("粘贴", "paste:", null)
   * menu.insertMenuItem(1, "剪切", "cut:", note)  // 插入到复制和粘贴之间
   * 
   * // 动态插入条件菜单项
   * if (note.hasChildren) {
   *   menu.insertMenuItem(0, "展开全部", "expandAll:", note)
   * }
   */
  insertMenuItem(index,title,selector,params = "",checked=false){
    // splice: 在 index 位置删除 0 个元素，然后插入新元素
    this.commandTable.splice(index,0,{
      title:title,
      object:this.delegate,
      selector:selector,
      param:params,
      checked:checked
    })
  }
  
  /**
   * 📍📍 在指定位置批量插入菜单项
   * 
   * @param {number} index - 插入位置
   * @param {object[]} items - 菜单项数组
   * 
   * @example
   * // 在开头插入一组常用操作
   * menu.insertMenuItems(0, [
   *   {title: "📋 复制", selector: "copy:", param: note},
   *   {title: "✂️ 剪切", selector: "cut:", param: note}
   * ])
   */
  insertMenuItems(index,items){
    let fullItems = items.map(item=>{
      if ("object" in item) {
        return item
      }else{
        item.object = this.delegate
        return item
      }
    })
    // 使用展开运算符批量插入
    this.commandTable.splice(index,0,...fullItems)
  }
  
  /**
   * 🎬 显示菜单（核心方法）
   * 
   * 【工作流程】
   * 1. 计算菜单应该出现的位置
   * 2. 检查是否会超出屏幕边界
   * 3. 自动调整到合适的位置
   * 4. 显示菜单并等待用户操作
   * 
   * 【智能定位算法】
   * - 如果向上弹出会超出顶部 → 改为向下
   * - 如果向下弹出会超出底部 → 改为向上
   * - 如果向左弹出会超出左边 → 改为向右
   * - 如果向右弹出会超出右边 → 改为向左
   * 
   * 【注意事项】
   * - 必须在添加菜单项后调用
   * - 菜单显示后会自动处理点击事件
   * - 用户点击菜单项或点击外部区域都会关闭菜单
   * 
   * @throws {Error} 如果显示失败会通过 HUD 提示错误
   * 
   * @example
   * // 完整的菜单使用流程
   * function showNoteMenu(button, note) {
   *   // 1. 创建菜单
   *   let menu = new Menu(button, self, 200)
   *   
   *   // 2. 添加菜单项
   *   menu.addMenuItem("📝 编辑", "editNote:", note)
   *   menu.addMenuItem("📋 复制", "copyNote:", note)
   *   menu.addMenuItem("🔗 创建链接", "createLink:", note)
   *   
   *   // 3. 添加分隔线（用空标题）
   *   menu.addMenuItem("───────", "", null)
   *   
   *   // 4. 添加危险操作（通常放在最后）
   *   menu.addMenuItem("🗑️ 删除", "deleteNote:", note)
   *   
   *   // 5. 显示菜单
   *   menu.show()
   * }
   * 
   * // 错误处理示例
   * try {
   *   menu.show()
   * } catch(error) {
   *   MNUtil.showHUD("菜单显示失败: " + error.message)
   * }
   */
  show(){
    try {
      // 获取首选位置
      let position = this.preferredPosition
      
      // 将菜单项数据传递给控制器
      this.menuController.commandTable = this.commandTable
      
      // 设置菜单的首选大小
      this.menuController.preferredContentSize = {
        width: this.width,
        // 高度 = 行高 × 菜单项数量
        height: this.menuController.rowHeight * this.menuController.commandTable.length
      };
      
      // 创建弹出控制器（iOS 的 UIPopoverController）
      // 这是实际显示菜单的系统组件
      var popoverController = new UIPopoverController(this.menuController);
      
      // 获取学习视图作为参考坐标系
      let targetView = MNUtil.studyView
      
      // 将触发按钮的坐标转换到目标视图的坐标系
      // 这是必要的，因为按钮可能在不同的视图层级中
      var r = this.sender.convertRectToView(this.sender.bounds,targetView);
      
      // 智能调整弹出位置，避免菜单超出屏幕
      // 边界检查的阈值是 50 像素，留出一定的安全边距
      switch (position) {
        case 0: // 向左弹出
          if (r.x < 50) {
            // 太靠左了，改为向右弹出
            position = 4
          }
          break;
        case 1: // 向下弹出
        case 3:
          if (r.y+r.height > targetView.frame.height - 50) {
            // 太靠下了，改为向上弹出
            position = 2
          }
          break;
        case 2: // 向上弹出
          if (r.y < 50) {
            // 太靠上了，改为向下弹出
            position = 3
          }
          break;
        case 4: // 向右弹出
          if (r.x+r.width > targetView.frame.width - 50) {
            // 太靠右了，改为向左弹出
            position = 0
          }
          break;
        default:
          break;
      }
      
      // 在计算好的位置显示菜单
      // 参数：触发区域，目标视图，弹出方向，是否动画
      popoverController.presentPopoverFromRect(r, targetView, position, true);
      
      // 设置弹出控制器的委托
      // 这样可以接收菜单关闭等事件
      popoverController.delegate = this.delegate
      
      // 保存弹出控制器的全局引用
      // 用于后续的关闭操作或防止重复打开
      Menu.popover = popoverController
      
    } catch (error) {
      // 如果出错，显示错误信息
      MNUtil.showHUD(error)
    }
  }
  
  /**
   * 🚪 关闭当前菜单
   * 
   * 【使用场景】
   * - 执行完菜单操作后立即关闭
   * - 在某些条件下提前关闭菜单
   * - 切换到其他视图前清理菜单
   * 
   * @example
   * // 在菜单操作完成后关闭
   * deleteNote(sender) {
   *   let note = sender.userInfo.param
   *   note.delete()
   *   
   *   // 关闭菜单
   *   if (sender.userInfo.menuController) {
   *     let menu = new Menu()
   *     menu.dismiss()
   *   }
   * }
   */
  dismiss(){
    if (Menu.popover) {
      // 带动画效果关闭菜单
      Menu.popover.dismissPopoverAnimated(true)
      // 清除全局引用
      Menu.popover = undefined
    }
  }
  
  /**
   * 🏭 静态方法：快速创建菜单项对象
   * 
   * 【为什么需要这个方法？】
   * - 提供统一的菜单项格式
   * - 减少手动创建对象的代码
   * - 便于批量创建菜单项
   * 
   * @param {string} title - 标题
   * @param {string} selector - 方法名
   * @param {any} [params=""] - 参数
   * @param {boolean} [checked=false] - 勾选状态
   * @returns {object} 标准格式的菜单项对象
   * 
   * @example
   * // 使用静态方法创建菜单项
   * let items = [
   *   Menu.item("复制", "copy:", note),
   *   Menu.item("粘贴", "paste:", null),
   *   Menu.item("自动换行", "toggleWrap:", null, isWrapEnabled)
   * ]
   * menu.addMenuItems(items)
   * 
   * // 动态创建菜单项
   * let colorItems = colors.map((color, idx) => 
   *   Menu.item(color.name, "setColor:", idx, idx === currentColor)
   * )
   */
  static item(title,selector,params = "",checked=false){
    return {title:title,selector:selector,param:params,checked:checked}
  }
  
  /**
   * 📌 静态属性：当前显示的弹出菜单
   * 
   * 【作用】
   * - 全局追踪当前菜单状态
   * - 防止同时显示多个菜单
   * - 提供全局关闭菜单的能力
   * 
   * @type {UIPopoverController|undefined}
   */
  static popover = undefined
  
  /**
   * 🚪 静态方法：关闭当前显示的任何菜单
   * 
   * 【使用场景】
   * - 在显示新菜单前关闭旧菜单
   * - 在场景切换时清理菜单
   * - 响应全局事件关闭菜单
   * 
   * @example
   * // 确保一次只显示一个菜单
   * function showMenu(button) {
   *   Menu.dismissCurrentMenu()  // 先关闭可能存在的菜单
   *   
   *   let menu = new Menu(button, self)
   *   menu.addMenuItem("选项", "handleOption:", null)
   *   menu.show()
   * }
   * 
   * // 在插件关闭时清理
   * sceneWillDisconnect() {
   *   Menu.dismissCurrentMenu()
   *   // 其他清理工作...
   * }
   */
  static dismissCurrentMenu(){
    if (this.popover) {
      this.popover.dismissPopoverAnimated(true)
    }
  }
}

// ============================================================================
// 🛠️ MNUtil 类 - 核心工具类（第 140-2787 行）
// ============================================================================

/**
 * 🌟 MNUtil 类 - MarginNote 插件开发的瑞士军刀
 * 
 * 【MNUtil 的地位】
 * 如果说 MNUtils 是整个框架，那么 MNUtil 类就是框架的核心引擎。
 * 它提供了 300+ 个静态方法，涵盖了插件开发的方方面面。
 * 
 * 【设计理念】
 * 1. 静态方法：所有方法都是静态的，无需实例化，随处可用
 * 2. 单一职责：每个方法只做一件事，做好一件事
 * 3. 链式调用：很多方法可以组合使用，形成强大的功能
 * 4. 安全优先：内置错误处理，避免插件崩溃
 * 
 * 【功能分类】
 * ┌─────────────────────────────────────────────────────┐
 * │                    MNUtil 功能地图                    │
 * ├─────────────────────────────────────────────────────┤
 * │ 🎯 环境访问器          │ 🎨 UI 交互              │
 * │ • app - 应用实例       │ • showHUD - 提示消息     │
 * │ • db - 数据库         │ • confirm - 确认对话框   │
 * │ • studyController     │ • input - 输入对话框     │
 * │ • currentNotebook     │ • alert - 警告框        │
 * ├─────────────────────────────────────────────────────┤
 * │ 📋 剪贴板操作          │ 📁 文件操作              │
 * │ • copy - 智能复制      │ • readJSON/writeJSON    │
 * │ • copyJSON - JSON复制  │ • readText/writeText    │
 * │ • clipboardText       │ • isFileExists          │
 * │ • clipboardImage      │ • createFolder          │
 * ├─────────────────────────────────────────────────────┤
 * │ 📝 笔记操作            │ 🔧 工具函数              │
 * │ • getNoteById         │ • delay - 延迟执行       │
 * │ • focusNote          │ • UUID - 生成唯一ID      │
 * │ • undoGrouping       │ • animate - 动画         │
 * │ • refreshAfterDB     │ • version - 版本信息     │
 * └─────────────────────────────────────────────────────┘
 * 
 * 【最佳实践】
 * 1. 始终在使用前初始化：MNUtil.init(self.path)
 * 2. 使用 try-catch 包装可能出错的操作
 * 3. 优先使用 MNUtil 的方法而不是原生 API
 * 4. 注意异步方法要用 await
 */
class MNUtil {
  /**
   * 🚨 是否正在显示 alert 对话框
   * 
   * 【为什么需要这个标志？】
   * iOS 不允许同时显示多个对话框，如果尝试这样做会导致：
   * - 新对话框无法显示
   * - 可能导致应用崩溃
   * - 用户体验混乱
   * 
   * 这个标志确保一次只显示一个对话框
   * 
   * @type {boolean}
   */
  static onAlert = false
  
  /**
   * 🎨 主题颜色配置
   * 
   * 【MarginNote 的主题系统】
   * MarginNote 支持多种主题，每个主题有不同的背景色。
   * 插件需要适配这些主题，确保在不同主题下都有良好的显示效果。
   * 
   * 【主题说明】
   * - Gray: 灰色主题，适合长时间阅读
   * - Default: 默认白色主题，最常用
   * - Dark: 深色主题，适合夜间使用
   * - Green: 绿色护眼主题，减少眼睛疲劳
   * - Sepia: 褐色复古主题，模拟纸张效果
   * 
   * @example
   * // 获取当前主题的颜色
   * let bgColor = MNUtil.currentThemeColor
   * 
   * // 根据主题设置文字颜色
   * let textColor = MNUtil.app.currentTheme === "Dark" 
   *   ? UIColor.whiteColor 
   *   : UIColor.blackColor
   */
  static themeColor = {
    Gray: UIColor.colorWithHexString("#414141"),    // 深灰色
    Default: UIColor.colorWithHexString("#FFFFFF"), // 纯白色
    Dark: UIColor.colorWithHexString("#000000"),    // 纯黑色
    Green: UIColor.colorWithHexString("#E9FBC7"),   // 淡绿色
    Sepia: UIColor.colorWithHexString("#F5EFDC")    // 米黄色
  }
  
  /**
   * 📌 弹出菜单的上下文信息
   * 
   * 【使用场景】
   * 当用户在笔记或选中文本上弹出菜单时，这些属性保存了相关信息。
   * 在菜单项的处理方法中，可能需要访问这些信息。
   * 
   * @type {object|undefined}
   */
  static popUpNoteInfo = undefined;      // 笔记弹出菜单的信息
  static popUpSelectionInfo = undefined; // 选择文本弹出菜单的信息
  
  /**
   * 📁 插件主路径
   * 
   * 【重要性】
   * 这是插件文件系统的根目录，所有资源文件都相对于这个路径。
   * 必须在 init() 方法中设置。
   * 
   * @type {string}
   * @example
   * // 访问插件资源
   * let configPath = MNUtil.mainPath + "/config.json"
   * let config = MNUtil.readJSON(configPath)
   */
  static mainPath
  
  /**
   * 🚀 初始化 MNUtil（必须首先调用）
   * 
   * 【为什么要初始化？】
   * 1. 设置插件路径，用于访问资源文件
   * 2. 初始化内部状态
   * 3. 准备运行环境
   * 
   * 【何时调用？】
   * 在插件的 sceneWillConnect 方法开始时调用
   * 
   * @param {string} mainPath - 插件的主路径（通常是 self.path）
   * 
   * @example
   * // 在插件主类中
   * JSB.defineClass("MyPlugin : JSExtension", {
   *   sceneWillConnect: function() {
   *     // 第一件事：初始化 MNUtil
   *     MNUtil.init(self.path)
   *     
   *     // 然后才能使用其他功能
   *     MNUtil.showHUD("插件已加载")
   *   }
   * })
   */
  static init(mainPath){
    this.mainPath = mainPath
    // 未来可能添加更多初始化逻辑
    // 如：检查版本兼容性、加载配置等
  }
  
  /**
   * 🐛 错误日志数组
   * 
   * 【错误追踪系统】
   * 存储所有通过 addErrorLog 记录的错误信息。
   * 可以用于调试、错误报告、用户反馈等。
   * 
   * @type {Array<{source: string, time: string, error: any, info?: any}>}
   */
  static errorLog = []
  
  /**
   * 📝 普通日志数组
   * 
   * 存储所有通过 log 方法记录的日志信息
   * 
   * @type {Array<{message: string, level: string, source: string, timestamp: number, detail?: any}>}
   */
  static logs = []
  
  /**
   * 🚨 添加错误日志
   * 
   * 【错误处理最佳实践】
   * 这个方法不仅记录错误，还会：
   * 1. 在 HUD 中显示错误信息
   * 2. 将错误复制到剪贴板（方便报告）
   * 3. 记录到日志系统
   * 
   * @param {Error|any} error - 错误对象或错误信息
   * @param {string} source - 错误来源（通常是函数名）
   * @param {object} [info] - 额外的上下文信息
   * 
   * @example
   * // 基本用法
   * try {
   *   // 可能出错的代码
   *   let note = MNUtil.getNoteById(noteId)
   *   note.delete()
   * } catch(error) {
   *   MNUtil.addErrorLog(error, "deleteNote", {noteId: noteId})
   * }
   * 
   * // 在异步函数中
   * async function fetchData() {
   *   try {
   *     let response = await fetch(url)
   *     return response.json()
   *   } catch(error) {
   *     MNUtil.addErrorLog(error, "fetchData", {url: url})
   *     return null
   *   }
   * }
   * 
   * // 主动记录错误
   * if (!note) {
   *   MNUtil.addErrorLog(
   *     new Error("Note not found"), 
   *     "processNote", 
   *     {noteId: noteId, action: "process"}
   *   )
   * }
   */
  static addErrorLog(error,source,info){
    // 立即显示错误提示，让用户知道出了问题
    MNUtil.showHUD("MN Utils Error ("+source+"): "+error)
    
    // 构建详细的错误日志对象
    let tem = {
      source: source,                              // 错误来源
      time: (new Date(Date.now())).toString()      // 错误发生时间
    }
    
    // 智能处理错误对象
    if (error.detail) {
      // 如果错误对象有 detail 属性，保存完整信息
      tem.error = {message:error.message,detail:error.detail}
    }else{
      // 否则只保存错误消息
      tem.error = error.message
    }
    
    // 添加额外的上下文信息
    if (info) {
      tem.info = info
    }
    
    // 保存到错误日志数组
    this.errorLog.push(tem)
    
    // 将错误日志复制到剪贴板
    // 方便用户报告问题或开发者调试
    this.copyJSON(this.errorLog)
    
    // 同时记录到普通日志系统
    this.log({
      message:source,
      level:"ERROR",
      source:"MN Utils",
      timestamp:Date.now(),
      detail:tem
    })
  }
  
  /**
   * 📝 记录日志
   * 
   * 【日志系统设计】
   * 支持两种方式：
   * 1. 简单字符串日志 - 快速记录
   * 2. 结构化日志对象 - 详细记录
   * 
   * 【日志级别】
   * - INFO: 一般信息
   * - WARN: 警告信息
   * - ERROR: 错误信息
   * - DEBUG: 调试信息
   * 
   * @param {string|object} log - 日志内容
   * 
   * @example
   * // 简单日志
   * MNUtil.log("用户点击了按钮")
   * MNUtil.log("笔记数量: " + notes.length)
   * 
   * // 详细日志
   * MNUtil.log({
   *   message: "批量处理完成",
   *   level: "INFO",
   *   source: "BatchProcessor",
   *   detail: {
   *     total: 100,
   *     success: 95,
   *     failed: 5,
   *     duration: "2.5s"
   *   }
   * })
   * 
   * // 警告日志
   * MNUtil.log({
   *   message: "内存使用率过高",
   *   level: "WARN",
   *   source: "MemoryMonitor",
   *   detail: {usage: "85%"}
   * })
   */
  static log(log){
    // 处理简单字符串日志
    if (typeof log == "string") {
      log = {
        message:log,
        level:"INFO",           // 默认信息级别
        source:"Default",       // 默认来源
        timestamp:Date.now()    // 当前时间戳
      }
      this.logs.push(log)
      
      // 如果订阅控制器存在，同步显示日志
      if (subscriptionUtils.subscriptionController) {
        subscriptionUtils.subscriptionController.appendLog(log)
      }
      return
    }
    
    // 处理结构化日志对象
    // 标准化日志级别为大写
    if ("level" in log) {
      log.level = log.level.toUpperCase();
    }else{
      log.level = "INFO";
    }
    
    // 设置默认来源
    if (!("source" in log)) {
      log.source = "Default";
    }
    
    // 添加时间戳
    if (!("timestamp" in log)) {
      log.timestamp = Date.now();
    }
    
    // 如果 detail 是对象，转换为格式化的 JSON 字符串
    if ("detail" in log && typeof log.detail == "object") {
      log.detail = JSON.stringify(log.detail,null,2)
    }
    
    // 保存日志并同步到UI
    this.logs.push(log)
    if (subscriptionUtils?.subscriptionController) {
      subscriptionUtils.subscriptionController.appendLog(log)
    }
  }
  
  /**
   * 🗑️ 清空所有日志
   * 
   * 【使用场景】
   * - 日志太多影响查看时
   * - 开始新的调试会话前
   * - 释放内存
   * 
   * @example
   * // 在开始新任务前清理日志
   * MNUtil.clearLogs()
   * MNUtil.log("=== 开始新任务 ===")
   */
  static clearLogs(){
    this.logs = []
    if (subscriptionUtils?.subscriptionController) {
      subscriptionUtils.subscriptionController.clearLogs()
    }
  }
  
  /**
   * 📱 获取应用版本信息（懒加载）
   * 
   * 【版本信息的重要性】
   * - 判断是 MN3 还是 MN4
   * - 确定可用的 API
   * - 实现版本兼容性
   * 
   * @returns {{version: string, type: string}} 版本信息对象
   * 
   * @example
   * let versionInfo = MNUtil.version
   * console.log(versionInfo)
   * // {version: "marginnote4", type: "iPadOS", versionNumber: 4.0}
   */
  static get version(){
    if (!this.mnVersion) {
      this.mnVersion = this.appVersion()
    }
    return this.mnVersion
  }
  
  /*
   * ========================================
   * 🎯 环境访问器（Getters）
   * 以下是一系列获取 MarginNote 核心对象的属性
   * 使用懒加载模式，提高性能
   * ========================================
   */
  
  /**
   * 📱 获取应用实例
   * 
   * 【Application 对象】
   * 这是整个 MarginNote 应用的核心对象，类似于 Web 开发中的 window。
   * 通过它可以访问应用级别的功能和状态。
   * 
   * 【主要用途】
   * - 获取应用版本信息
   * - 打开 URL
   * - 显示 HUD
   * - 访问剪贴板
   * - 获取应用路径
   * 
   * @returns {Application} 应用实例
   * 
   * @example
   * // 获取应用版本
   * let version = MNUtil.app.appVersion
   * 
   * // 打开网页
   * MNUtil.app.openURL(NSURL.URLWithString("https://marginnote.com"))
   * 
   * // 获取应用路径
   * let dbPath = MNUtil.app.dbPath
   */
  static get app(){
    // 懒加载：只在第一次访问时创建
    // 这样可以避免在不需要时就创建对象，节省资源
    if (!this.appInstance) {
      this.appInstance = Application.sharedInstance()
    }
    return this.appInstance
  }
  
  /**
   * 💾 获取数据库实例
   * 
   * 【Database 对象】
   * MarginNote 的所有数据（笔记、文档、笔记本）都存储在数据库中。
   * 这个对象提供了访问和操作这些数据的接口。
   * 
   * 【主要用途】
   * - 查询笔记：getNoteById()
   * - 查询笔记本：getNotebookById()
   * - 查询文档：getDocumentById()
   * - 获取所有笔记本：allNotebooks()
   * 
   * @returns {Database} 数据库实例
   * 
   * @example
   * // 获取笔记
   * let note = MNUtil.db.getNoteById(noteId)
   * 
   * // 获取所有笔记本
   * let notebooks = MNUtil.db.allNotebooks()
   * 
   * // 查询文档
   * let doc = MNUtil.db.getDocumentById(docMd5)
   */
  static get db(){
    if (!this.data) {
      this.data = Database.sharedInstance()
    }
    return this.data
  }
  
  /**
   * 🪟 获取当前窗口
   * 
   * 【重要提示】
   * 关闭 MN4 后再打开，focusWindow 会变化
   * 所以不能只在 init 做一遍初始化，需要每次使用时获取
   * 
   * @returns {Window} 当前聚焦的窗口
   */
  static get currentWindow(){
    return this.app.focusWindow
  }
  
  /**
   * 📏 获取窗口宽度
   * @returns {number} 窗口宽度（像素）
   */
  static get windowWidth(){
    return this.currentWindow.frame.width
  }
  
  /**
   * 📐 获取窗口高度
   * @returns {number} 窗口高度（像素）
   */
  static get windowHeight(){
    return this.currentWindow.frame.height
  }
  
  /**
   * 📚 获取学习控制器
   * 
   * 【StudyController 的核心地位】
   * StudyController 是 MarginNote 的核心控制器，管理着：
   * - 文档阅读器（ReaderController）
   * - 笔记本和脑图（NotebookController）
   * - 学习模式切换
   * - 插件面板
   * 
   * 可以把它理解为一个总指挥官，协调各个子系统的工作。
   * 
   * @returns {StudyController} 学习控制器
   * 
   * @example
   * // 获取当前学习模式
   * let mode = MNUtil.studyController.studyMode
   * // 0,1: 文档模式
   * // 2: 学习模式（文档+脑图）
   * // 3: 复习模式
   * 
   * // 刷新界面
   * MNUtil.studyController.refreshAddonCommands()
   * 
   * // 聚焦到某个笔记
   * MNUtil.studyController.focusNoteInMindMapById(noteId)
   */
  static get studyController(){
    return this.app.studyController(this.currentWindow)
  }
  
  /**
   * 📖 获取学习视图
   * 
   * 【StudyView 的作用】
   * 这是学习界面的主视图，包含了文档阅读器和脑图视图。
   * 所有的 UI 元素都是这个视图的子视图。
   * 
   * @returns {UIView} 学习视图
   * 
   * @example
   * // 在学习视图上添加自定义按钮
   * let button = UIButton.new()
   * button.frame = {x: 100, y: 100, width: 80, height: 40}
   * MNUtil.studyView.addSubview(button)
   * 
   * // 获取视图大小用于布局
   * let viewWidth = MNUtil.studyView.frame.width
   * let viewHeight = MNUtil.studyView.frame.height
   */
  static get studyView() {
    return this.app.studyController(this.currentWindow).view
  }
  
  // ... 更多环境访问器 ...
  
  /*
   * ========================================
   * 🎨 UI 交互方法
   * 以下是与用户界面交互相关的核心方法
   * ========================================
   */
  
  /**
   * 💬 显示 HUD 提示消息
   * 
   * 【什么是 HUD？】
   * HUD (Heads-Up Display) 是一种轻量级的提示方式：
   * - 半透明黑色背景
   * - 白色文字
   * - 自动消失
   * - 不阻塞用户操作
   * 
   * 【使用场景】
   * ✅ 操作成功提示
   * ✅ 状态变化通知  
   * ✅ 简短的错误信息
   * ❌ 需要用户确认的信息（用 confirm）
   * ❌ 长文本说明（用 alert）
   * 
   * @param {string} message - 要显示的消息内容
   * @param {number} [duration=2] - 显示时长（秒）
   * @param {UIWindow} [view=this.currentWindow] - 显示在哪个窗口上
   * 
   * @example
   * // 基本用法
   * MNUtil.showHUD("保存成功！")
   * 
   * // 自定义显示时间
   * MNUtil.showHUD("正在处理，请稍候...", 5)
   * 
   * // 显示操作结果
   * let count = notes.length
   * MNUtil.showHUD(`已处理 ${count} 个笔记`)
   * 
   * // 错误提示
   * try {
   *   // 某些操作
   * } catch(error) {
   *   MNUtil.showHUD("操作失败: " + error.message)
   * }
   * 
   * // 状态提示
   * MNUtil.showHUD(isEnabled ? "功能已开启" : "功能已关闭")
   */
  static showHUD(message, duration = 2, view = this.currentWindow) {
    this.app.showHUD(message, view, duration);
  }
  
  /**
   * ⏳ 显示等待 HUD（加载中）
   * 
   * 【与 showHUD 的区别】
   * - showHUD: 自动消失，用于提示
   * - waitHUD: 需要手动关闭，用于长时间操作
   * 
   * 【使用流程】
   * 1. 显示 waitHUD
   * 2. 执行耗时操作
   * 3. 调用 stopHUD 关闭
   * 
   * @param {string} message - 等待时显示的消息
   * @param {UIWindow} [view=this.currentWindow] - 显示窗口
   * 
   * @example
   * // 基本用法
   * MNUtil.waitHUD("正在导入笔记...")
   * await importNotes()  // 耗时操作
   * MNUtil.stopHUD()
   * 
   * // 带错误处理
   * async function processLargeData() {
   *   MNUtil.waitHUD("处理中，请稍候...")
   *   try {
   *     await doHeavyWork()
   *     MNUtil.stopHUD()
   *     MNUtil.showHUD("处理完成！")
   *   } catch(error) {
   *     MNUtil.stopHUD()
   *     MNUtil.showHUD("处理失败: " + error.message)
   *   }
   * }
   * 
   * // 分步骤显示进度
   * async function batchProcess(items) {
   *   for (let i = 0; i < items.length; i++) {
   *     MNUtil.waitHUD(`处理中 ${i+1}/${items.length}`)
   *     await processItem(items[i])
   *   }
   *   MNUtil.stopHUD()
   * }
   */
  static waitHUD(message, view = this.currentWindow) {
    this.app.waitHUDOnView(message, view);
    this.onWaitHUD = true
  }
  
  /**
   * 🛑 停止等待 HUD
   * 
   * @param {number} [delay=0] - 延迟关闭的时间（秒）
   * @param {UIWindow} [view=this.currentWindow] - 窗口
   * 
   * @example
   * // 立即关闭
   * MNUtil.stopHUD()
   * 
   * // 延迟 1 秒后关闭（给用户时间看清最后的状态）
   * MNUtil.waitHUD("处理完成！")
   * MNUtil.stopHUD(1)
   */
  static async stopHUD(delay = 0, view = this.currentWindow) {
    if (typeof delay === "number" && delay > 0) {
      await MNUtil.delay(delay)
    }
    this.app.stopWaitHUDOnView(view);
    this.onWaitHUD = false
  }
  
  /**
   * ❓ 显示确认对话框
   * 
   * 【设计理念】
   * 用于需要用户做出选择的场景，支持 2-n 个按钮。
   * 第一个按钮默认是取消按钮，返回 0。
   * 
   * 【返回值说明】
   * - 0: 用户点击了取消（第一个按钮）
   * - 1: 用户点击了确认（第二个按钮）
   * - 2+: 用户点击了其他按钮
   * 
   * @param {string} mainTitle - 主标题（简短）
   * @param {string} subTitle - 副标题（详细说明）
   * @param {string[]} [items=["Cancel","Confirm"]] - 按钮文字数组
   * @returns {Promise<number|undefined>} 返回按钮索引
   * 
   * @example
   * // 示例1：简单确认
   * let confirmed = await MNUtil.confirm("删除笔记", "确定要删除这个笔记吗？")
   * if (confirmed) {
   *   note.delete()
   *   MNUtil.showHUD("笔记已删除")
   * }
   * 
   * // 示例2：多选项
   * let choice = await MNUtil.confirm(
   *   "导出格式",
   *   "请选择导出格式",
   *   ["取消", "Markdown", "PDF", "HTML"]
   * )
   * switch(choice) {
   *   case 0: break;  // 取消
   *   case 1: exportAsMarkdown(); break;
   *   case 2: exportAsPDF(); break;
   *   case 3: exportAsHTML(); break;
   * }
   * 
   * // 示例3：危险操作二次确认
   * let reallyDelete = await MNUtil.confirm(
   *   "⚠️ 危险操作",
   *   "这将删除所有笔记，无法恢复！",
   *   ["取消", "我已了解风险，继续删除"]
   * )
   * if (reallyDelete === 1) {
   *   deleteAllNotes()
   * }
   */
  static async confirm(mainTitle,subTitle,items = ["Cancel","Confirm"]){
    // 防止重复弹出
    if (this.onAlert) {
      return
    }
    this.onAlert = true
    
    return new Promise((resolve, reject) => {
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        mainTitle,
        subTitle,
        0,  // style: 0 = 默认样式
        items[0],  // 取消按钮文字
        items.slice(1),  // 其他按钮
        (alert, buttonIndex) => {
          this.onAlert = false
          resolve(buttonIndex)
        }
      )
    })
  }
  
  // ... 更多 UI 方法 ...
  
  /*
   * ========================================
   * 📋 剪贴板操作
   * 支持多种数据类型的智能复制
   * ========================================
   */
  
  /**
   * 📋 智能复制功能
   * 
   * 【设计哲学】
   * "复制" 看似简单，但在 MarginNote 的复杂环境中，需要处理各种数据类型。
   * 这个方法会自动识别数据类型，选择最合适的复制方式。
   * 
   * 【智能之处】
   * 1. 自动识别数据类型
   * 2. 对象转换为格式化 JSON
   * 3. 笔记、文档等转换为有用信息
   * 4. 错误对象转换为字符串
   * 
   * @param {any} object - 要复制的内容（支持任意类型）
   * 
   * @example
   * // 复制文本
   * MNUtil.copy("Hello World")
   * 
   * // 复制数字（自动转字符串）
   * MNUtil.copy(123.456)
   * 
   * // 复制笔记信息
   * let note = MNNote.getFocusNote()
   * MNUtil.copy(note)  // 复制笔记的详细信息对象
   * 
   * // 复制对象（转为格式化 JSON）
   * MNUtil.copy({
   *   name: "张三",
   *   age: 25,
   *   hobbies: ["阅读", "编程"]
   * })
   * 
   * // 复制图片
   * let imageData = note.excerptPic
   * MNUtil.copy(imageData)
   * 
   * // 复制错误信息
   * try {
   *   // 某些操作
   * } catch(error) {
   *   MNUtil.copy(error)  // 方便调试
   * }
   * 
   * // 复制数组
   * let noteIds = notes.map(n => n.noteId)
   * MNUtil.copy(noteIds)
   */
  static copy(object) {
    switch (typeof object) {
      case "string":
        // 字符串直接复制
        UIPasteboard.generalPasteboard().string = object
        break;
        
      case "undefined":
        // undefined 时提示用户
        this.showHUD("Undefined")
        break;
        
      case "number":
      case "boolean":
        // 数字和布尔值转为字符串
        UIPasteboard.generalPasteboard().string = object.toString()
        break;
        
      case "object":
        // 对象类型需要特殊处理
        if (object instanceof NSData) {
          // NSData 通常是图片数据
          this.copyImage(object)
          break;
        }
        if (object instanceof UIImage) {
          // UIImage 转换为 PNG 数据再复制
          this.copyImage(object.pngData())
          break;
        }
        if (object instanceof MNDocument) {
          // 文档对象提取关键信息
          let docInfo = {
            id: object.docMd5,
            currentNotebookId: object.currentTopicId,
            title: object.docTitle,
            pageCount: object.pageCount,
            path: object.fullPathFileName
          }
          this.copy(docInfo)  // 递归调用
          break;
        }
        if (object instanceof MNNotebook) {
          // 笔记本对象提取关键信息
          let notebookInfo = {
            id: object.id,
            title: object.title,
            type: object.type,
            url: object.url,
            mainDocMd5: object.mainDocMd5
          }
          this.copy(notebookInfo)  // 递归调用
          break;
        }
        if (object instanceof MNNote) {
          // 笔记对象提取详细信息
          let noteInfo = {
            noteId: object.noteId,
            title: object.title,
            excerptText: object.excerptText,
            docMd5: object.docMd5,
            notebookId: object.notebookId,
            noteURL: object.noteURL,
            MNComments: object.MNComments
          }
          // 如果有标签，也包含进去
          if (object.tags && object.tags.length > 0) {
            noteInfo.tags = object.tags
          }
          this.copy(noteInfo)  // 递归调用
          break;
        }
        if (object instanceof Error) {
          // 错误对象转为字符串
          this.copy(object.toString())
          break
        }
        // 其他对象转为格式化的 JSON
        UIPasteboard.generalPasteboard().string = JSON.stringify(object, null, 2)
        break;
        
      default:
        // 不支持的类型
        this.showHUD("Unsupported type: "+typeof object)
        break;
    }
  }
  
  /**
   * 📋 复制 JSON 对象（格式化输出）
   * 
   * 【使用场景】
   * - 调试时复制对象状态
   * - 导出配置信息
   * - 分享数据结构
   * 
   * @param {Object} object - 要复制的对象
   * 
   * @example
   * // 复制配置对象
   * let config = {
   *   version: "1.0",
   *   settings: {
   *     autoSave: true,
   *     theme: "dark"
   *   }
   * }
   * MNUtil.copyJSON(config)
   * // 剪贴板内容（格式化的）：
   * // {
   * //   "version": "1.0",
   * //   "settings": {
   * //     "autoSave": true,
   * //     "theme": "dark"
   * //   }
   * // }
   */
  static copyJSON(object) {
    UIPasteboard.generalPasteboard().string = JSON.stringify(object, null, 2)
  }
  
  // ... MNUtil 还有很多其他方法，如文件操作、延迟执行等 ...
}

// ============================================================================
// 📝 MNNote 类 - 笔记核心类（最重要的类之一）
// ============================================================================

/**
 * 📝 MNNote 类 - MarginNote 笔记的封装和增强
 * 
 * 【什么是 MNNote？】
 * MNNote 是对 MarginNote 原生笔记对象（MbBookNote）的封装和增强。
 * 它让笔记操作变得简单、直观、强大。
 * 
 * 【为什么需要 MNNote？】
 * 原生的笔记 API 存在以下问题：
 * 1. 属性分散：需要访问多个对象才能获取完整信息
 * 2. 操作复杂：简单的操作需要多步骤完成
 * 3. 类型混乱：评论、标签等数据结构不统一
 * 4. 缺少功能：没有便捷的链接管理、内容操作等
 * 
 * 【MNNote 的设计理念】
 * 1. 统一接口：所有笔记相关操作都通过 MNNote
 * 2. 智能转换：自动处理各种输入格式（ID、URL、对象）
 * 3. 链式调用：支持流畅的方法链
 * 4. 安全操作：内置错误处理，避免崩溃
 * 
 * 【笔记在 MarginNote 中的地位】
 * ┌─────────────────────────────────────┐
 * │            MarginNote 数据结构        │
 * ├─────────────────────────────────────┤
 * │   📚 学习集 (Study Set)              │
 * │    └── 📓 笔记本 (Notebook)          │
 * │         └── 📝 笔记 (Note) ← 我们在这里 │
 * │              ├── 摘录文本             │
 * │              ├── 评论列表             │
 * │              ├── 标签                │
 * │              └── 子笔记              │
 * └─────────────────────────────────────┘
 * 
 * 【MNNote 的核心功能】
 * 1. 笔记创建和获取
 * 2. 内容管理（标题、摘录、评论）
 * 3. 层级关系（父子笔记）
 * 4. 样式设置（颜色、字体）
 * 5. 链接管理
 * 6. 卡片制作
 * 7. 复习功能
 */
class MNNote {
  /**
   * 🏗️ 构造函数 - 创建 MNNote 实例
   * 
   * 【设计特点】
   * 1. 智能识别输入类型
   * 2. 自动查询数据库
   * 3. 缓存原始对象
   * 4. 可选的错误提示
   * 
   * @param {string|MbBookNote|MNNote} note - 笔记标识
   * @param {boolean} [alert=false] - 找不到时是否提示
   * 
   * @example
   * // 从笔记 ID 创建
   * let note = new MNNote("E4B5C2D1-1234-5678-9ABC-DEF012345678")
   * 
   * // 从原生对象创建
   * let mbNote = MNUtil.db.getNoteById(noteId)
   * let note = new MNNote(mbNote)
   * 
   * // 从 URL 创建
   * let note = new MNNote("marginnote4app://note/E4B5C2D1-1234-5678")
   * 
   * // 静默模式（找不到不报错）
   * let note = new MNNote(noteId, false)
   * if (!note.note) {
   *   console.log("笔记不存在")
   * }
   */
  constructor(note, alert = false) {
    // 具体实现...
  }
  
  /**
   * 🎯 静态方法：智能创建 MNNote 实例（推荐使用）
   * 
   * 【与构造函数的区别】
   * - new(): 总是返回 MNNote 对象，即使笔记不存在
   * - new MNNote(): 笔记不存在时，返回的对象 .note 属性为 null
   * 
   * 【支持的输入类型】
   * 1. 笔记 ID (string)
   * 2. 笔记 URL (string)
   * 3. MbBookNote 对象
   * 4. MNNote 对象（返回自身）
   * 5. undefined/null（返回 undefined）
   * 
   * @param {any} note - 各种格式的笔记标识
   * @param {boolean} [alert=false] - 找不到时是否提示
   * @returns {MNNote|undefined} MNNote 实例或 undefined
   * 
   * @example
   * // ✅ 推荐：使用静态方法
   * let note = MNNote.new(noteId)
   * if (note) {
   *   note.noteTitle = "新标题"
   * }
   * 
   * // 链式调用
   * MNNote.new(noteId)?.appendTextComment("备注")?.addTag("重要")
   * 
   * // 批量处理
   * let noteIds = ["id1", "id2", "id3"]
   * let notes = noteIds.map(id => MNNote.new(id)).filter(n => n)
   * 
   * // 从各种来源创建
   * let note1 = MNNote.new("marginnote4app://note/xxx")  // URL
   * let note2 = MNNote.new(mbBookNote)                   // 原生对象
   * let note3 = MNNote.new(anotherMNNote)               // 已有 MNNote
   */
  static new(note, alert = false) {
    // 实现智能类型识别...
  }
  
  /**
   * 🔍 获取当前焦点笔记
   * 
   * 【什么是焦点笔记？】
   * - 在脑图中：当前选中的笔记节点
   * - 在文档中：最后一次点击的笔记
   * - 可能为空：没有选中任何笔记时
   * 
   * 【常见用途】
   * 1. 为当前笔记添加操作按钮
   * 2. 获取用户正在查看的内容
   * 3. 作为操作的默认目标
   * 
   * @returns {MNNote|undefined} 焦点笔记或 undefined
   * 
   * @example
   * // 获取并检查
   * let focusNote = MNNote.getFocusNote()
   * if (focusNote) {
   *   MNUtil.showHUD("当前笔记: " + focusNote.noteTitle)
   * } else {
   *   MNUtil.showHUD("请先选择一个笔记")
   * }
   * 
   * // 快速操作
   * MNNote.getFocusNote()?.highlightFromColor(3)  // 高亮为黄色
   * 
   * // 在菜单中使用
   * onPopupMenuOnNote(info) {
   *   let note = MNNote.getFocusNote()
   *   if (note && note.excerptText) {
   *     info.commandTable.push({
   *       title: "复制摘录",
   *       selector: "copyExcerpt:",
   *       param: note.excerptText
   *     })
   *   }
   * }
   */
  static getFocusNote() {
    // 实现...
  }
  
  /**
   * 🔍 获取所有选中的笔记
   * 
   * 【多选模式】
   * MarginNote 支持在脑图中多选笔记：
   * - Cmd/Ctrl + 点击：添加到选择
   * - Shift + 点击：范围选择
   * - 框选：拖动选择多个
   * 
   * @returns {MNNote[]} 选中的笔记数组（可能为空）
   * 
   * @example
   * // 批量修改颜色
   * let selectedNotes = MNNote.getSelectedNotes()
   * MNUtil.undoGrouping(() => {
   *   selectedNotes.forEach(note => {
   *     note.colorIndex = 3  // 全部设为黄色
   *   })
   * })
   * MNUtil.showHUD(`已修改 ${selectedNotes.length} 个笔记`)
   * 
   * // 批量添加标签
   * let tag = await MNUtil.input("添加标签", "输入标签名称", ["取消", "确定"])
   * if (tag.button === 1 && tag.input) {
   *   let notes = MNNote.getSelectedNotes()
   *   notes.forEach(note => note.addTag(tag.input))
   * }
   * 
   * // 创建笔记组
   * let selected = MNNote.getSelectedNotes()
   * if (selected.length > 1) {
   *   let parent = selected[0]
   *   for (let i = 1; i < selected.length; i++) {
   *     parent.addChild(selected[i])
   *   }
   * }
   */
  static getSelectedNotes() {
    // 实现...
  }
  
  /*
   * ========================================
   * 📋 笔记属性（Properties）
   * 以下是笔记的各种属性访问器
   * ========================================
   */
  
  /**
   * 🆔 笔记唯一标识符
   * 
   * 【笔记 ID 的特点】
   * - 格式：UUID (如 "E4B5C2D1-1234-5678-9ABC-DEF012345678")
   * - 全局唯一：不会重复
   * - 永不改变：即使移动、修改笔记
   * - 可用于：查询、链接、引用
   * 
   * @type {string}
   * @readonly
   * 
   * @example
   * let note = MNNote.getFocusNote()
   * console.log(note.noteId)
   * // "E4B5C2D1-1234-5678-9ABC-DEF012345678"
   * 
   * // 复制笔记 ID
   * MNUtil.copy(note.noteId)
   * 
   * // 保存引用
   * let bookmarks = {
   *   important: note.noteId,
   *   todo: anotherNote.noteId
   * }
   */
  get noteId() {
    return this.note.noteId
  }
  
  /**
   * 📑 笔记标题
   * 
   * 【标题的重要性】
   * - 在脑图中显示的主要文字
   * - 搜索时的主要依据
   * - 可以包含 Markdown 格式
   * - 可以包含链接
   * 
   * 【标题 vs 摘录】
   * - 标题：用户自定义的概括
   * - 摘录：从文档中选取的原文
   * 
   * @type {string}
   * 
   * @example
   * // 获取标题
   * let title = note.noteTitle
   * 
   * // 设置标题
   * note.noteTitle = "第一章 总结"
   * 
   * // 添加前缀
   * note.noteTitle = "⭐ " + note.noteTitle
   * 
   * // 使用 Markdown
   * note.noteTitle = "**重点** 这是重要内容"
   * 
   * // 动态生成标题
   * let date = new Date().toLocaleDateString()
   * note.noteTitle = `[${date}] ${note.excerptText.slice(0, 20)}...`
   */
  get noteTitle() {
    return this.note.noteTitle
  }
  
  set noteTitle(title) {
    this.note.noteTitle = title
  }
  
  /**
   * 📄 摘录文本
   * 
   * 【摘录的来源】
   * 1. 文档选择：从 PDF/EPUB 中选取的文字
   * 2. 图片 OCR：从图片识别的文字
   * 3. 手动输入：在脑图中创建的笔记
   * 
   * 【注意事项】
   * - 只读属性，不能直接修改
   * - 可能包含换行符和空格
   * - 可能为空（纯脑图笔记）
   * 
   * @type {string}
   * @readonly
   * 
   * @example
   * // 获取摘录
   * let text = note.excerptText
   * 
   * // 检查是否有摘录
   * if (note.excerptText) {
   *   console.log("摘录内容: " + note.excerptText)
   * } else {
   *   console.log("这是一个脑图笔记")
   * }
   * 
   * // 统计字数
   * let wordCount = note.excerptText.length
   * 
   * // 提取关键句
   * let firstSentence = note.excerptText.split(/[。！？]/)[0]
   * 
   * // 复制摘录
   * MNUtil.copy(note.excerptText)
   */
  get excerptText() {
    return this.note.excerptText || ""
  }
  
  /**
   * 🎨 笔记颜色索引
   * 
   * 【MarginNote 的 16 色系统】
   * 0: 灰色 (默认)     8: 深紫色
   * 1: 红色            9: 棕色
   * 2: 橙色            10: 深绿色
   * 3: 黄色            11: 深蓝色
   * 4: 绿色            12: 深橙色
   * 5: 青色            13: 深红色
   * 6: 蓝色            14: 深灰色
   * 7: 紫色            15: 粉色
   * 
   * 【颜色的用途】
   * - 视觉分类：不同颜色代表不同类型
   * - 重要性标记：红色=重要，绿色=完成
   * - 个人系统：建立自己的颜色规则
   * 
   * @type {number} 0-15 的整数
   * 
   * @example
   * // 设置颜色
   * note.colorIndex = 3  // 黄色
   * 
   * // 根据类型设置颜色
   * switch(note.type) {
   *   case "definition": note.colorIndex = 6; break;  // 蓝色
   *   case "example": note.colorIndex = 4; break;     // 绿色
   *   case "question": note.colorIndex = 1; break;    // 红色
   * }
   * 
   * // 颜色循环
   * note.colorIndex = (note.colorIndex + 1) % 16
   * 
   * // 恢复默认色
   * note.colorIndex = 0
   */
  get colorIndex() {
    return this.note.colorIndex
  }
  
  set colorIndex(index) {
    this.note.colorIndex = MNUtil.constrain(index, 0, 15)
  }
  
  /**
   * 💬 评论数组
   * 
   * 【评论类型】
   * MarginNote 支持多种评论类型：
   * 1. TextNote - 纯文本评论
   * 2. HtmlNote - 富文本评论（支持样式）
   * 3. MarkdownNote - Markdown 评论
   * 4. ImageNote - 图片评论
   * 5. LinkNote - 链接评论
   * 6. PaintNote - 手写评论
   * 7. TagNote - 标签（特殊的文本评论）
   * 
   * 【评论的顺序】
   * - 按添加时间排序
   * - 可以通过拖动重新排序
   * - 索引从 0 开始
   * 
   * @type {Array<Comment>}
   * @readonly
   * 
   * @example
   * // 遍历所有评论
   * note.comments.forEach((comment, index) => {
   *   console.log(`评论${index + 1}: ${comment.text}`)
   * })
   * 
   * // 查找特定类型的评论
   * let textComments = note.comments.filter(c => c.type === "TextNote")
   * let images = note.comments.filter(c => c.type === "ImageNote")
   * 
   * // 获取第一个文本评论
   * let firstText = note.comments.find(c => c.type === "TextNote")
   * 
   * // 统计评论
   * MNUtil.showHUD(`共有 ${note.comments.length} 条评论`)
   */
  get comments() {
    return this.note.comments
  }
  
  /*
   * ========================================
   * ✏️ 内容操作方法
   * 添加、修改、删除笔记内容
   * ========================================
   */
  
  /**
   * ➕ 添加纯文本评论
   * 
   * 【使用场景】
   * - 添加备注说明
   * - 记录想法
   * - 补充信息
   * 
   * @param {string} text - 要添加的文本
   * @returns {MNNote} 返回自身，支持链式调用
   * 
   * @example
   * // 基本使用
   * note.appendTextComment("这是我的理解")
   * 
   * // 链式调用
   * note
   *   .appendTextComment("第一条备注")
   *   .appendTextComment("第二条备注")
   *   .setColorIndex(3)
   * 
   * // 添加时间戳
   * let now = new Date().toLocaleString()
   * note.appendTextComment(`更新于: ${now}`)
   * 
   * // 条件添加
   * if (needsReview) {
   *   note.appendTextComment("⚠️ 需要复习")
   * }
   */
  appendTextComment(text) {
    // 实现...
    return this
  }
  
  /**
   * ➕ 添加 HTML 格式评论
   * 
   * 【HTML 评论的优势】
   * - 支持富文本格式（粗体、斜体、颜色）
   * - 可以创建表格、列表
   * - 支持自定义样式
   * - 可以嵌入图标
   * 
   * @param {string} html - HTML 内容
   * @param {string} text - 纯文本版本（用于搜索）
   * @param {object} options - 选项
   * @returns {MNNote} 返回自身
   * 
   * @example
   * // 添加格式化文本
   * note.appendHtmlComment(
   *   '<b>重点</b>: <span style="color: red">这很重要</span>',
   *   '重点: 这很重要'
   * )
   * 
   * // 添加列表
   * note.appendHtmlComment(`
   *   <ul>
   *     <li>第一点</li>
   *     <li>第二点</li>
   *     <li>第三点</li>
   *   </ul>
   * `, '第一点\n第二点\n第三点')
   * 
   * // 添加表格
   * note.appendHtmlComment(`
   *   <table border="1">
   *     <tr><th>概念</th><th>解释</th></tr>
   *     <tr><td>变量</td><td>存储数据的容器</td></tr>
   *   </table>
   * `, '概念: 变量 - 存储数据的容器')
   */
  appendHtmlComment(html, text, options) {
    // 实现...
    return this
  }
  
  /**
   * 🏷️ 添加标签
   * 
   * 【标签系统】
   * - 以 # 开头的特殊文本评论
   * - 用于分类和筛选
   * - 支持多级标签: #父级/子级
   * - 可以有多个标签
   * 
   * @param {string} tag - 标签名（不需要 # 前缀）
   * @returns {MNNote} 返回自身
   * 
   * @example
   * // 添加单个标签
   * note.addTag("重要")
   * 
   * // 添加多个标签
   * note
   *   .addTag("JavaScript")
   *   .addTag("前端")
   *   .addTag("待复习")
   * 
   * // 多级标签
   * note.addTag("编程/JavaScript/ES6")
   * 
   * // 条件标签
   * if (note.excerptText.includes("function")) {
   *   note.addTag("函数")
   * }
   * 
   * // 从数组添加标签
   * let tags = ["重要", "考试", "第3章"]
   * tags.forEach(tag => note.addTag(tag))
   */
  addTag(tag) {
    // 实现...
    return this
  }
  
  /*
   * ========================================
   * 🔗 笔记关系管理
   * 父子关系、链接等
   * ========================================
   */
  
  /**
   * 👨‍👦 添加子笔记
   * 
   * 【父子关系的作用】
   * - 组织知识结构
   * - 创建大纲层级
   * - 折叠/展开管理
   * - 批量操作
   * 
   * @param {MNNote|string} childNote - 要添加的子笔记
   * @returns {MNNote} 返回自身
   * 
   * @example
   * // 创建章节结构
   * let chapter = MNNote.new(chapterId)
   * let section1 = MNNote.new(section1Id)
   * let section2 = MNNote.new(section2Id)
   * 
   * chapter
   *   .addChild(section1)
   *   .addChild(section2)
   * 
   * // 整理零散笔记
   * let mainTopic = note
   * let relatedNotes = findRelatedNotes(note)
   * relatedNotes.forEach(n => mainTopic.addChild(n))
   * 
   * // 创建新子笔记
   * let child = note.createChild({
   *   title: "补充说明",
   *   content: "详细内容..."
   * })
   */
  addChild(childNote) {
    // 实现...
    return this
  }
  
  /**
   * 🔗 创建笔记链接
   * 
   * 【链接的类型】
   * 1. 笔记间链接：连接相关概念
   * 2. 返回链接：从摘录返回原文
   * 3. 外部链接：连接到网页
   * 
   * @param {MNNote|string} targetNote - 目标笔记
   * @param {string} [title] - 链接标题
   * @returns {MNNote} 返回自身
   * 
   * @example
   * // 创建相关链接
   * let definition = findDefinition("Array")
   * note.linkTo(definition, "查看定义")
   * 
   * // 双向链接
   * note1.linkTo(note2, "相关概念")
   * note2.linkTo(note1, "返回")
   * 
   * // 创建引用网络
   * let references = findReferences(topic)
   * references.forEach(ref => {
   *   note.linkTo(ref, "引用")
   * })
   */
  linkTo(targetNote, title) {
    // 实现...
    return this
  }
  
  /*
   * ========================================
   * 🎯 实用操作方法
   * ========================================
   */
  
  
  /**
   * 🗑️ 删除笔记
   * 
   * 【删除选项】
   * - 仅删除本身
   * - 删除包括所有子笔记
   * - 删除后子笔记会上移
   * 
   * @param {boolean} [withDescendants=false] - 是否删除子笔记
   * 
   * @example
   * // 删除单个笔记
   * note.delete()
   * 
   * // 删除整个分支
   * note.delete(true)
   * 
   * // 安全删除
   * let confirm = await MNUtil.confirm(
   *   "删除笔记",
   *   "确定要删除这个笔记吗？"
   * )
   * if (confirm) {
   *   note.delete()
   *   MNUtil.showHUD("已删除")
   * }
   */
  delete(withDescendants = false) {
    // 实现...
  }
  
  /**
   * 🎯 聚焦到笔记
   * 
   * 【聚焦效果】
   * - 在脑图中：居中显示并选中
   * - 在文档中：跳转到摘录位置
   * - 自动展开父级笔记
   * 
   * @example
   * // 跳转到笔记
   * note.focus()
   * 
   * // 查找并聚焦
   * let important = notes.find(n => n.tags.includes("重要"))
   * if (important) {
   *   important.focus()
   *   MNUtil.showHUD("已定位到重要笔记")
   * }
   */
  focus() {
    // 实现...
  }
  
  // ... 更多方法 ...
}

// ============================================================================
// 📚 使用 MNUtils 开发插件的最佳实践
// ============================================================================

/**
 * 【快速开始模板】
 * 
 * ```javascript
 * // 1. 插件基本结构
 * JSB.defineClass("MyPlugin : JSExtension", {
 *   // 插件初始化
 *   sceneWillConnect: function() {
 *     // 必须：初始化 MNUtil
 *     MNUtil.init(self.path)
 *     
 *     // 可选：显示欢迎信息
 *     MNUtil.showHUD("插件已加载")
 *   },
 *   
 *   // 笔记菜单
 *   onPopupMenuOnNote: function(note) {
 *     // 如果没有安装 MNUtils
 *     if (!MNNote) {
 *       note.commandTable.push({
 *         title: "需要安装 MNUtils",
 *         selector: "showInstallGuide:",
 *         param: null
 *       })
 *       return
 *     }
 *     
 *     // 添加自定义菜单项
 *     note.commandTable.push({
 *       title: "🎯 我的功能",
 *       selector: "myFunction:",
 *       param: note.note.noteId
 *     })
 *   },
 *   
 *   // 实现功能
 *   myFunction: function(sender) {
 *     let noteId = sender.userInfo.param
 *     let note = MNNote.new(noteId)
 *     
 *     if (!note) {
 *       MNUtil.showHUD("笔记不存在")
 *       return
 *     }
 *     
 *     // 使用 MNUtils 的强大功能
 *     MNUtil.undoGrouping(() => {
 *       note
 *         .appendTextComment("由插件添加")
 *         .highlightFromColor(3)
 *         .addTag("已处理")
 *     })
 *     
 *     MNUtil.showHUD("处理完成！")
 *   }
 * })
 * ```
 * 
 * 【常见模式】
 * 
 * 1. 批量操作模式
 * ```javascript
 * let notes = MNNote.getSelectedNotes()
 * MNUtil.undoGrouping(() => {
 *   notes.forEach(note => {
 *     // 批量操作
 *   })
 * })
 * ```
 * 
 * 2. 用户交互模式
 * ```javascript
 * let result = await MNUtil.input("标题", "说明", ["取消", "确定"])
 * if (result.button === 1) {
 *   // 用户确认
 * }
 * ```
 * 
 * 3. 错误处理模式
 * ```javascript
 * try {
 *   // 可能出错的操作
 * } catch(error) {
 *   MNUtil.addErrorLog(error, "functionName")
 *   MNUtil.showHUD("操作失败")
 * }
 * ```
 */

// ============================================================================
// 🌐 MNConnection 类 - 网络请求与 WebView 管理（第 2788-3171 行）
// ============================================================================

/**
 * 🔌 MNConnection 类 - 网络连接的瑞士军刀
 * 
 * 【什么是 MNConnection？】
 * MNConnection 是 MNUtils 框架中处理所有网络相关操作的核心类。就像浏览器的网络引擎，
 * 它负责发送 HTTP 请求、加载网页、处理 WebDAV 文件，甚至支持 ChatGPT API 调用。
 * 
 * 【为什么需要 MNConnection？】
 * 1. 原生复杂：iOS 的 NSURLRequest/NSURLConnection API 使用繁琐
 * 2. 功能分散：WebView、HTTP、WebDAV 需要不同的处理方式
 * 3. 异步困难：原生 API 的回调地狱难以管理
 * 4. 缺少工具：没有现成的 Base64、JSON 处理等工具
 * 
 * 【设计理念】
 * ┌─────────────────────────────────────────────┐
 * │              MNConnection 架构               │
 * ├─────────────────────────────────────────────┤
 * │  🌐 HTTP 请求   │  📱 WebView    │  ☁️ WebDAV │
 * │  • GET/POST    │  • 加载网页    │  • 读文件  │
 * │  • JSON/Form   │  • 加载HTML    │  • 写文件  │
 * │  • 异步请求     │  • User-Agent  │  • 认证    │
 * ├─────────────────────────────────────────────┤
 * │              🤖 AI 集成                      │
 * │         • ChatGPT API 支持                   │
 * │         • 流式响应处理                        │
 * └─────────────────────────────────────────────┘
 * 
 * 【核心功能清单】
 * 1. HTTP 请求：fetch() - 类似浏览器的 fetch API
 * 2. WebView 控制：loadRequest()、loadHTML()、loadFile()
 * 3. WebDAV 支持：readWebDAVFile()、uploadWebDAVFile()
 * 4. AI 集成：initRequestForChatGPT()
 * 5. 工具方法：btoa()、genURL()
 * 
 * 【使用示例】
 * 
 * 📌 示例 1：简单的 GET 请求
 * ```javascript
 * // 获取 JSON 数据
 * let data = await MNConnection.fetch("https://api.example.com/data")
 * if (!data.error) {
 *   MNUtil.showHUD("获取成功：" + data.title)
 * }
 * ```
 * 
 * 📌 示例 2：POST 请求提交表单
 * ```javascript
 * let response = await MNConnection.fetch("https://api.example.com/submit", {
 *   method: "POST",
 *   headers: {
 *     "Authorization": "Bearer token123"
 *   },
 *   json: {
 *     title: "笔记标题",
 *     content: "笔记内容",
 *     tags: ["学习", "重要"]
 *   }
 * })
 * ```
 * 
 * 📌 示例 3：WebView 加载网页
 * ```javascript
 * let webview = UIWebView.new()
 * // 加载网页，使用桌面版 User-Agent
 * MNConnection.loadRequest(webview, "https://example.com", true)
 * 
 * // 加载本地 HTML
 * MNConnection.loadHTML(webview, "<h1>Hello World</h1>", MNUtil.mainPath)
 * ```
 * 
 * 📌 示例 4：WebDAV 文件操作
 * ```javascript
 * // 读取 WebDAV 文件
 * let content = await MNConnection.readWebDAVFile(
 *   "https://dav.example.com/notes.json",
 *   "username",
 *   "password"
 * )
 * 
 * // 上传文件到 WebDAV
 * let result = await MNConnection.uploadWebDAVFile(
 *   "https://dav.example.com/backup.json",
 *   "username",
 *   "password",
 *   JSON.stringify(myData)
 * )
 * ```
 * 
 * 📌 示例 5：ChatGPT API 调用
 * ```javascript
 * let messages = [
 *   {role: "system", content: "你是一个学习助手"},
 *   {role: "user", content: "解释什么是递归"}
 * ]
 * 
 * let request = MNConnection.initRequestForChatGPT(
 *   messages,
 *   "sk-xxxxx",  // API key
 *   "https://api.openai.com/v1/chat/completions",
 *   "gpt-3.5-turbo",
 *   0.7  // temperature
 * )
 * ```
 * 
 * 【最佳实践】
 * 
 * ✅ 正确做法：
 * - 始终处理错误情况
 * - 使用 async/await 而不是回调
 * - 设置合理的超时时间
 * - 保护敏感信息（API key、密码）
 * 
 * ❌ 错误做法：
 * - 忽略错误处理
 * - 在主线程执行长时间请求
 * - 明文存储密码
 * - 不检查网络状态
 * 
 * 【常见问题】
 * 
 * Q: 请求超时怎么办？
 * A: 使用 timeout 参数：`fetch(url, {timeout: 30})`
 * 
 * Q: 如何处理大文件？
 * A: 使用流式处理或分块下载
 * 
 * Q: WebView 加载失败？
 * A: 检查 URL 格式和网络连接
 */
class MNConnection{
  // ... 原始代码 ...
}

// ============================================================================
// 🔘 MNButton 类 - 自定义按钮组件（第 3172-3754 行）
// ============================================================================

/**
 * 🎮 MNButton 类 - 创建美观的交互按钮
 * 
 * 【什么是 MNButton？】
 * MNButton 是对 iOS UIButton 的高级封装，提供了更简单的 API 和更丰富的样式选项。
 * 它让你可以用几行代码创建出专业美观的按钮，支持各种交互效果。
 * 
 * 【为什么需要 MNButton？】
 * 1. 原生复杂：UIButton 的配置需要多次调用不同方法
 * 2. 样式有限：原生按钮样式单调，定制困难
 * 3. 交互麻烦：处理点击、长按等事件需要大量代码
 * 4. 动画困难：实现按钮动画效果很复杂
 * 
 * 【按钮的组成】
 * ┌─────────────────────────────┐
 * │         MNButton            │
 * │  ┌─────────────────────┐   │
 * │  │    🏷️ 标题/图标      │   │ ← 内容区
 * │  └─────────────────────┘   │
 * │  ╱                     ╲   │ ← 圆角边框
 * │ ╱  背景色 + 透明度 + 阴影 ╲  │ ← 样式层
 * └─────────────────────────────┘
 * 
 * 【核心功能】
 * 1. 快速创建：new() - 一行代码创建按钮
 * 2. 丰富样式：支持颜色、圆角、阴影、透明度
 * 3. 灵活布局：自动计算大小，支持自定义位置
 * 4. 事件处理：简化的点击、长按事件绑定
 * 5. 动画效果：内置点击反馈动画
 * 
 * 【使用示例】
 * 
 * 📌 示例 1：创建基础按钮
 * ```javascript
 * // 最简单的按钮
 * let button = MNButton.new({
 *   title: "点击我",
 *   color: "#457bd3"
 * })
 * 
 * // 添加到视图
 * MNUtil.addView(button)
 * ```
 * 
 * 📌 示例 2：自定义样式按钮
 * ```javascript
 * let customButton = MNButton.new({
 *   title: "高级按钮",
 *   font: 16,               // 字体大小
 *   bold: true,             // 粗体
 *   color: "#e06c75",       // 背景色（红色）
 *   opacity: 0.9,           // 不透明度
 *   radius: 15,             // 圆角半径
 *   alpha: 0.95            // 整体透明度
 * })
 * 
 * // 设置位置和大小
 * customButton.frame = MNUtil.genFrame(100, 200, 150, 44)
 * ```
 * 
 * 📌 示例 3：带图标的按钮
 * ```javascript
 * let iconButton = MNButton.new({
 *   image: "icon_settings.png",  // 图标
 *   title: "设置",
 *   color: "#98c379"
 * })
 * 
 * // 只有图标的按钮
 * let pureIconButton = MNButton.new({
 *   image: "icon_close.png",
 *   radius: 20  // 圆形按钮
 * })
 * ```
 * 
 * 📌 示例 4：处理按钮事件
 * ```javascript
 * // 创建按钮时指定处理函数
 * let actionButton = MNButton.new({
 *   title: "执行操作",
 *   color: "#61afef"
 * })
 * 
 * // 绑定点击事件
 * actionButton.addTargetActionForControlEvents(
 *   self,                          // 目标对象
 *   "handleButtonClick:",          // 处理方法
 *   1 << 6                        // TouchUpInside
 * )
 * 
 * // 在插件类中定义处理方法
 * handleButtonClick: function(sender) {
 *   MNUtil.showHUD("按钮被点击了！")
 *   
 *   // 添加点击动画
 *   MNUtil.animate(() => {
 *     sender.transform = {a:0.95, b:0, c:0, d:0.95, tx:0, ty:0}
 *   }, 0.1)
 *   
 *   MNUtil.delay(0.1).then(() => {
 *     MNUtil.animate(() => {
 *       sender.transform = {a:1, b:0, c:0, d:1, tx:0, ty:0}
 *     }, 0.1)
 *   })
 * }
 * ```
 * 
 * 📌 示例 5：动态更新按钮
 * ```javascript
 * // 创建状态按钮
 * let statusButton = MNButton.new({
 *   title: "未开始",
 *   color: "#677180"  // 灰色
 * })
 * 
 * // 更新按钮状态
 * function updateButtonStatus(status) {
 *   switch(status) {
 *     case "processing":
 *       statusButton.setTitleForState("处理中...", 0)
 *       statusButton.backgroundColor = UIColor.colorWithHexString("#e5c07b")
 *       break
 *     case "success":
 *       statusButton.setTitleForState("已完成", 0)
 *       statusButton.backgroundColor = UIColor.colorWithHexString("#98c379")
 *       break
 *     case "error":
 *       statusButton.setTitleForState("失败", 0)
 *       statusButton.backgroundColor = UIColor.colorWithHexString("#e06c75")
 *       break
 *   }
 * }
 * ```
 * 
 * 【高级技巧】
 * 
 * 1. 按钮组管理
 * ```javascript
 * class ButtonGroup {
 *   constructor() {
 *     this.buttons = []
 *   }
 *   
 *   addButton(config) {
 *     let btn = MNButton.new(config)
 *     btn.tag = this.buttons.length
 *     this.buttons.push(btn)
 *     return btn
 *   }
 *   
 *   setExclusive(selectedIndex) {
 *     this.buttons.forEach((btn, index) => {
 *       btn.selected = (index === selectedIndex)
 *       btn.backgroundColor = btn.selected ? 
 *         MNButton.highlightColor : 
 *         UIColor.colorWithHexString("#677180")
 *     })
 *   }
 * }
 * ```
 * 
 * 2. 自定义按钮样式
 * ```javascript
 * // 创建渐变背景按钮
 * let gradientButton = MNButton.new({title: "渐变按钮"})
 * let gradientLayer = CAGradientLayer.layer()
 * gradientLayer.colors = [
 *   UIColor.colorWithHexString("#667eea").CGColor,
 *   UIColor.colorWithHexString("#764ba2").CGColor
 * ]
 * gradientLayer.frame = gradientButton.bounds
 * gradientButton.layer.insertSublayerAtIndex(gradientLayer, 0)
 * ```
 * 
 * 【最佳实践】
 * 
 * ✅ 正确做法：
 * - 使用语义化的按钮标题
 * - 保持按钮大小适合点击（最小 44x44）
 * - 提供视觉反馈（点击效果）
 * - 使用合适的颜色对比度
 * 
 * ❌ 错误做法：
 * - 按钮太小难以点击
 * - 没有点击反馈
 * - 颜色对比度不足
 * - 标题文字过长
 */
class MNButton{
  // ... 原始代码 ...
}

// ============================================================================
// 📄 MNDocument 类 - 文档操作接口（第 3755-3879 行）
// ============================================================================

/**
 * 📚 MNDocument 类 - 文档管理的核心
 * 
 * 【什么是 MNDocument？】
 * MNDocument 代表 MarginNote 中的一个文档（PDF 或 EPUB）。每个文档都有唯一的 MD5 标识，
 * 可以被多个笔记本引用。这个类提供了文档的基本信息访问和操作方法。
 * 
 * 【文档在 MarginNote 中的地位】
 * ┌─────────────────────────────────────┐
 * │           MarginNote 数据结构        │
 * ├─────────────────────────────────────┤
 * │  📚 文档 (Document)                  │
 * │   ├─ MD5 (唯一标识)                 │
 * │   ├─ 标题                           │
 * │   ├─ 页数                           │
 * │   └─ 文件路径                       │
 * │          ↓ 被引用                    │
 * │  📔 笔记本 (Notebook)                │
 * │   └─ 📝 笔记 (Note)                 │
 * │       └─ 摘录位置 → 文档页面         │
 * └─────────────────────────────────────┘
 * 
 * 【为什么需要 MNDocument？】
 * 1. 文档信息：获取文档标题、页数等基本信息
 * 2. 内容访问：读取特定页面的文本内容
 * 3. 文档管理：打开、关闭、切换文档
 * 4. 笔记关联：处理笔记与文档的关系
 * 
 * 【核心功能】
 * 1. 获取文档：currentDocument、allDocuments()
 * 2. 文档信息：docTitle、pageCount、docMd5
 * 3. 内容访问：textContentsForPageNo()
 * 4. 文档操作：open()、isEpub()
 * 
 * 【使用示例】
 * 
 * 📌 示例 1：获取当前文档信息
 * ```javascript
 * let doc = MNDocument.currentDocument
 * if (doc) {
 *   MNUtil.showHUD(`
 *     文档：${doc.docTitle}
 *     页数：${doc.pageCount}
 *     MD5：${doc.docMd5}
 *   `)
 * }
 * ```
 * 
 * 📌 示例 2：读取页面文本
 * ```javascript
 * // 读取第 10 页的文本内容
 * let pageText = doc.textContentsForPageNo(10)
 * 
 * // 搜索包含关键词的页面
 * function searchInDocument(keyword) {
 *   let results = []
 *   let doc = MNDocument.currentDocument
 *   
 *   for (let i = 1; i <= doc.pageCount; i++) {
 *     let text = doc.textContentsForPageNo(i)
 *     if (text && text.includes(keyword)) {
 *       results.push({
 *         page: i,
 *         preview: text.substring(0, 100) + "..."
 *       })
 *     }
 *   }
 *   return results
 * }
 * ```
 * 
 * 📌 示例 3：文档类型判断
 * ```javascript
 * let doc = MNDocument.currentDocument
 * if (doc.isEpub()) {
 *   MNUtil.showHUD("这是 EPUB 文档，页码可能是动态的")
 * } else {
 *   MNUtil.showHUD("这是 PDF 文档，页码是固定的")
 * }
 * ```
 * 
 * 📌 示例 4：获取所有打开的文档
 * ```javascript
 * let allDocs = MNDocument.allDocuments()
 * 
 * // 创建文档选择菜单
 * let docTitles = allDocs.map(doc => doc.docTitle)
 * let selected = await MNUtil.select("选择文档", docTitles)
 * 
 * if (selected.length > 0) {
 *   let selectedDoc = allDocs[selected[0]]
 *   selectedDoc.open(MNNotebook.currentNotebookId)
 * }
 * ```
 * 
 * 📌 示例 5：文档与笔记的关联
 * ```javascript
 * // 获取当前笔记所在的文档
 * let note = MNNote.getFocusNote()
 * if (note && note.docMd5) {
 *   let doc = MNDocument.getDocumentByMd5(note.docMd5)
 *   
 *   // 跳转到笔记所在页面
 *   if (doc && note.startPage) {
 *     MNUtil.studyController.focusDocumentPageAtIndex(
 *       note.startPage - 1,  // 页码从 0 开始
 *       note.docMd5
 *     )
 *   }
 * }
 * ```
 * 
 * 【高级用法】
 * 
 * 1. 批量处理文档中的笔记
 * ```javascript
 * function processNotesInDocument(docMd5) {
 *   let notebook = MNNotebook.currentNotebook
 *   let allNotes = MNDatabase.getNotesByNotebookId(notebook.notebookId)
 *   
 *   let docNotes = allNotes.filter(note => 
 *     note.docMd5 === docMd5
 *   )
 *   
 *   MNUtil.undoGrouping(() => {
 *     docNotes.forEach(note => {
 *       // 处理每个笔记
 *       note.colorIndex = 3  // 标记为已处理
 *     })
 *   })
 * }
 * ```
 * 
 * 2. 文档页面导航
 * ```javascript
 * class DocumentNavigator {
 *   constructor() {
 *     this.bookmarks = []  // 页面书签
 *   }
 *   
 *   addBookmark(page, description) {
 *     this.bookmarks.push({page, description})
 *   }
 *   
 *   async showBookmarks() {
 *     let options = this.bookmarks.map(b => 
 *       `第${b.page}页 - ${b.description}`
 *     )
 *     
 *     let selected = await MNUtil.select("跳转到", options)
 *     if (selected.length > 0) {
 *       let bookmark = this.bookmarks[selected[0]]
 *       MNUtil.studyController.focusDocumentPageAtIndex(
 *         bookmark.page - 1
 *       )
 *     }
 *   }
 * }
 * ```
 * 
 * 【注意事项】
 * 
 * ⚠️ 文档可能未打开：访问前检查 currentDocument 是否为 null
 * ⚠️ EPUB 页码动态：EPUB 的页数可能根据设备和字体大小变化
 * ⚠️ 大文档性能：读取所有页面文本可能很慢，考虑分批处理
 * ⚠️ 权限问题：某些受保护的 PDF 可能无法读取文本
 */
class MNDocument{
  // ... 原始代码 ...
}

// ============================================================================
// 📔 MNNotebook 类 - 笔记本管理系统（第 3880-4172 行）
// ============================================================================

/**
 * 📓 MNNotebook 类 - 笔记本与学习集管理
 * 
 * 【什么是笔记本？】
 * 在 MarginNote 中，笔记本（Notebook）是组织笔记的容器。每个笔记本可以关联多个文档，
 * 包含多个笔记，形成一个完整的学习单元。学习集（Study Set）则是笔记本的集合。
 * 
 * 【层级结构】
 * ┌─────────────────────────────────────┐
 * │         学习集 (Study Set)           │
 * │  ┌─────────────────────────────┐   │
 * │  │    📔 笔记本 (Notebook)      │   │
 * │  │  ┌───────────────────────┐  │   │
 * │  │  │   📝 笔记 (Note)       │  │   │
 * │  │  │    ├─ 摘录            │  │   │
 * │  │  │    ├─ 评论            │  │   │
 * │  │  │    └─ 子笔记          │  │   │
 * │  │  └───────────────────────┘  │   │
 * │  │  关联文档：                  │   │
 * │  │  • document1.pdf            │   │
 * │  │  • document2.epub           │   │
 * │  └─────────────────────────────┘   │
 * └─────────────────────────────────────┘
 * 
 * 【为什么需要 MNNotebook？】
 * 1. 组织管理：将相关笔记组织在一起
 * 2. 多文档支持：一个笔记本可以包含多个文档的笔记
 * 3. 独立存储：每个笔记本有独立的数据文件
 * 4. 协作共享：笔记本可以导出分享
 * 
 * 【核心功能】
 * 1. 获取笔记本：currentNotebook、allNotebooks()
 * 2. 笔记本信息：notebookId、title、docMd5
 * 3. 笔记本操作：open()、close()、create()
 * 4. 学习集管理：allStudySets()、currentStudySet
 * 
 * 【使用示例】
 * 
 * 📌 示例 1：获取当前笔记本信息
 * ```javascript
 * let notebook = MNNotebook.currentNotebook
 * if (notebook) {
 *   MNUtil.showHUD(`
 *     笔记本：${notebook.title}
 *     ID：${notebook.notebookId}
 *     笔记数：${notebook.notes.length}
 *   `)
 * }
 * ```
 * 
 * 📌 示例 2：切换笔记本
 * ```javascript
 * // 获取所有笔记本
 * let notebooks = MNNotebook.allNotebooks()
 * 
 * // 创建选择菜单
 * let titles = notebooks.map(nb => nb.title)
 * let selected = await MNUtil.select("选择笔记本", titles)
 * 
 * if (selected.length > 0) {
 *   let targetNotebook = notebooks[selected[0]]
 *   targetNotebook.open()  // 打开选中的笔记本
 * }
 * ```
 * 
 * 📌 示例 3：创建新笔记本
 * ```javascript
 * // 创建笔记本（需要用户交互）
 * function createStudyNotebook() {
 *   // 提示用户输入名称
 *   MNUtil.input("新建笔记本", "请输入笔记本名称", ["取消", "创建"])
 *     .then(result => {
 *       if (result.button === 1 && result.text) {
 *         // 注意：实际创建需要通过 UI 操作
 *         MNUtil.showHUD("请在界面中创建笔记本：" + result.text)
 *       }
 *     })
 * }
 * ```
 * 
 * 📌 示例 4：笔记本统计分析
 * ```javascript
 * function analyzeNotebook() {
 *   let notebook = MNNotebook.currentNotebook
 *   let notes = MNDatabase.getNotesByNotebookId(notebook.notebookId)
 *   
 *   // 统计信息
 *   let stats = {
 *     total: notes.length,
 *     excerpts: 0,
 *     mindmaps: 0,
 *     cards: 0,
 *     colors: new Array(16).fill(0)
 *   }
 *   
 *   notes.forEach(note => {
 *     if (note.excerptText) stats.excerpts++
 *     if (!note.docMd5) stats.mindmaps++
 *     if (note.isCard) stats.cards++
 *     stats.colors[note.colorIndex]++
 *   })
 *   
 *   // 显示统计结果
 *   MNUtil.showHUD(`
 *     总笔记数：${stats.total}
 *     摘录笔记：${stats.excerpts}
 *     脑图笔记：${stats.mindmaps}
 *     复习卡片：${stats.cards}
 *   `)
 * }
 * ```
 * 
 * 📌 示例 5：批量操作笔记本中的笔记
 * ```javascript
 * // 为笔记本中所有笔记添加标签
 * function tagAllNotes(tagName) {
 *   let notebook = MNNotebook.currentNotebook
 *   let notes = MNDatabase.getNotesByNotebookId(notebook.notebookId)
 *   
 *   MNUtil.undoGrouping(() => {
 *     let count = 0
 *     notes.forEach(note => {
 *       if (!note.tags.includes(tagName)) {
 *         note.addTag(tagName)
 *         count++
 *       }
 *     })
 *     MNUtil.showHUD(`已为 ${count} 个笔记添加标签`)
 *   })
 * }
 * ```
 * 
 * 【高级功能】
 * 
 * 1. 笔记本间迁移
 * ```javascript
 * async function moveNotesToAnotherNotebook(noteIds) {
 *   // 获取目标笔记本
 *   let notebooks = MNNotebook.allNotebooks()
 *   let current = MNNotebook.currentNotebook
 *   
 *   // 排除当前笔记本
 *   notebooks = notebooks.filter(nb => 
 *     nb.notebookId !== current.notebookId
 *   )
 *   
 *   let titles = notebooks.map(nb => nb.title)
 *   let selected = await MNUtil.select("移动到笔记本", titles)
 *   
 *   if (selected.length > 0) {
 *     let targetNotebook = notebooks[selected[0]]
 *     // 实际移动需要通过 UI 操作
 *     MNUtil.copy(noteIds.join("\n"))
 *     MNUtil.showHUD("已复制笔记 ID，请在目标笔记本中粘贴")
 *   }
 * }
 * ```
 * 
 * 2. 学习集管理
 * ```javascript
 * // 显示学习集结构
 * function showStudySetStructure() {
 *   let studySets = MNNotebook.allStudySets()
 *   
 *   studySets.forEach(studySet => {
 *     console.log(`📚 ${studySet.title}`)
 *     
 *     let notebooks = studySet.notebooks
 *     notebooks.forEach(notebook => {
 *       console.log(`  📔 ${notebook.title}`)
 *       console.log(`     笔记数：${notebook.notes.length}`)
 *     })
 *   })
 * }
 * ```
 * 
 * 【最佳实践】
 * 
 * ✅ 正确做法：
 * - 操作前检查 currentNotebook 是否存在
 * - 使用 undoGrouping 包装批量操作
 * - 处理大量笔记时显示进度
 * - 定期备份重要笔记本
 * 
 * ❌ 错误做法：
 * - 假设笔记本始终存在
 * - 不使用撤销分组进行批量修改
 * - 一次性加载所有笔记到内存
 * - 直接修改笔记本 ID
 * 
 * 【注意事项】
 * 
 * ⚠️ 权限限制：某些操作（如创建笔记本）需要用户手动完成
 * ⚠️ 性能考虑：大笔记本可能包含数千个笔记
 * ⚠️ 数据安全：修改前考虑备份
 * ⚠️ 同步问题：iCloud 同步可能导致延迟
 */
class MNNotebook{
  // ... 原始代码 ...
}

// ============================================================================
// 💬 MNComment 类 - 评论内容管理（第 6338-6757 行）
// ============================================================================

/**
 * 💭 MNComment 类 - 笔记内容的多样化管理
 * 
 * 【什么是 Comment？】
 * 在 MarginNote 中，Comment（评论）是笔记的内容载体。一个笔记可以包含多个评论，
 * 每个评论可以是文本、图片、链接、手写等不同类型。评论按顺序排列，共同构成笔记的完整内容。
 * 
 * 【评论类型体系】
 * ┌─────────────────────────────────────┐
 * │           MNComment 类型             │
 * ├─────────────────────────────────────┤
 * │ 📝 TextComment      - 纯文本        │
 * │ 🎨 HtmlComment      - 富文本/HTML   │
 * │ 📑 MarkdownComment  - Markdown      │
 * │ 🖼️ ImageComment     - 图片          │
 * │ 🔗 LinkComment      - 链接/引用     │
 * │ ✍️ HandwritingComment - 手写        │
 * │ 🏷️ TagComment       - 标签          │
 * │ 🎵 AudioComment     - 音频录音      │
 * └─────────────────────────────────────┘
 * 
 * 【为什么需要 MNComment？】
 * 1. 内容多样性：支持多种媒体类型
 * 2. 结构化存储：每种类型有特定的数据结构
 * 3. 灵活组合：多个评论可以组合成复杂内容
 * 4. 独立管理：每个评论可以单独编辑、删除、移动
 * 
 * 【评论在笔记中的组织】
 * ```
 * 📝 笔记 (Note)
 *  ├─ 摘录文本 (excerptText)
 *  └─ 评论数组 (comments)
 *      ├─ [0] TextComment: "这是重要概念"
 *      ├─ [1] HtmlComment: "<b>定义</b>：..."
 *      ├─ [2] ImageComment: 示意图.png
 *      ├─ [3] LinkComment: → 相关笔记
 *      └─ [4] TagComment: #重要 #待复习
 * ```
 * 
 * 【核心功能】
 * 1. 类型识别：type、text、html、imageData
 * 2. 内容操作：修改、删除、移动位置
 * 3. 格式转换：Markdown ↔ HTML ↔ 纯文本
 * 4. 特殊功能：链接跳转、标签管理
 * 
 * 【使用示例】
 * 
 * 📌 示例 1：添加各种类型的评论
 * ```javascript
 * let note = MNNote.getFocusNote()
 * 
 * // 添加纯文本评论
 * note.appendTextComment("这是一个重要的概念")
 * 
 * // 添加 Markdown 评论
 * note.appendMarkdownComment(`
 * ## 关键点
 * - 第一点
 * - 第二点
 * - **重要**：第三点
 * `)
 * 
 * // 添加 HTML 评论（带样式）
 * note.appendHtmlComment(
 *   '<span style="color: red; font-weight: bold;">警告：注意这个陷阱</span>',
 *   "警告：注意这个陷阱",  // 纯文本版本
 *   16,                      // 字体大小
 *   "warning"                // 标签
 * )
 * 
 * // 添加链接到另一个笔记
 * let targetNote = MNNote.getNoteById("another_note_id")
 * note.appendNoteLink(targetNote, "参考这个例子")
 * ```
 * 
 * 📌 示例 2：遍历和处理评论
 * ```javascript
 * let note = MNNote.getFocusNote()
 * 
 * // 遍历所有评论
 * note.comments.forEach((comment, index) => {
 *   console.log(`评论 ${index}:`)
 *   console.log(`  类型: ${comment.type}`)
 *   console.log(`  内容: ${comment.text || comment.htmlText || "非文本"}`)
 *   
 *   // 根据类型处理
 *   switch(comment.type) {
 *     case "TextComment":
 *       // 处理文本
 *       break
 *     case "HtmlComment":
 *       // 处理 HTML
 *       if (comment.htmlText.includes("重要")) {
 *         note.colorIndex = 2  // 标记为蓝色
 *       }
 *       break
 *     case "LinkComment":
 *       // 处理链接
 *       console.log(`  链接到: ${comment.noteid}`)
 *       break
 *   }
 * })
 * ```
 * 
 * 📌 示例 3：评论的增删改查
 * ```javascript
 * // 查找特定评论
 * function findCommentByText(note, searchText) {
 *   return note.comments.findIndex(comment => 
 *     comment.text && comment.text.includes(searchText)
 *   )
 * }
 * 
 * // 修改评论
 * let index = findCommentByText(note, "旧内容")
 * if (index !== -1) {
 *   let comment = note.comments[index]
 *   comment.text = "新内容"
 *   note.refreshComments()  // 刷新显示
 * }
 * 
 * // 删除评论
 * note.removeCommentByIndex(index)
 * 
 * // 移动评论位置
 * note.moveComment(2, 0)  // 将第3个评论移到最前面
 * ```
 * 
 * 📌 示例 4：高级评论操作
 * ```javascript
 * // 合并多个文本评论
 * function mergeTextComments(note) {
 *   let texts = []
 *   let indicesToRemove = []
 *   
 *   note.comments.forEach((comment, index) => {
 *     if (comment.type === "TextComment") {
 *       texts.push(comment.text)
 *       if (index > 0) indicesToRemove.push(index)
 *     }
 *   })
 *   
 *   if (texts.length > 1) {
 *     // 删除多余的文本评论
 *     indicesToRemove.reverse().forEach(i => 
 *       note.removeCommentByIndex(i)
 *     )
 *     
 *     // 更新第一个文本评论
 *     note.comments[0].text = texts.join("\n\n")
 *     note.refreshComments()
 *   }
 * }
 * 
 * // 提取所有链接
 * function extractAllLinks(note) {
 *   let links = []
 *   
 *   note.comments.forEach(comment => {
 *     if (comment.type === "LinkComment") {
 *       let linkedNote = MNNote.getNoteById(comment.noteid)
 *       if (linkedNote) {
 *         links.push({
 *           title: linkedNote.noteTitle,
 *           id: comment.noteid,
 *           note: linkedNote
 *         })
 *       }
 *     }
 *   })
 *   
 *   return links
 * }
 * ```
 * 
 * 📌 示例 5：创建复杂的笔记内容
 * ```javascript
 * // 创建一个学习卡片
 * function createStudyCard(concept, definition, example, imageData) {
 *   let note = MNNote.createNote()
 *   
 *   MNUtil.undoGrouping(() => {
 *     // 设置标题
 *     note.noteTitle = `【概念】${concept}`
 *     
 *     // 添加定义（HTML 格式）
 *     note.appendHtmlComment(
 *       `<h3>定义</h3><p>${definition}</p>`,
 *       `定义：${definition}`,
 *       14
 *     )
 *     
 *     // 添加示例（Markdown 格式）
 *     note.appendMarkdownComment(`
 * ### 示例
 * \`\`\`javascript
 * ${example}
 * \`\`\`
 *     `)
 *     
 *     // 添加图片
 *     if (imageData) {
 *       note.appendImageComment(imageData)
 *     }
 *     
 *     // 添加标签
 *     note.appendTags(["概念", "待复习", concept])
 *     
 *     // 设置为卡片并加入复习
 *     note.colorIndex = 3  // 蓝色
 *     note.addToReview()
 *   })
 *   
 *   return note
 * }
 * ```
 * 
 * 【最佳实践】
 * 
 * ✅ 正确做法：
 * - 使用适合的评论类型（文本用 Text，格式化用 HTML/Markdown）
 * - 修改后调用 refreshComments() 更新显示
 * - 批量操作时使用 undoGrouping
 * - 保持评论顺序的逻辑性
 * 
 * ❌ 错误做法：
 * - 直接修改 comments 数组而不刷新
 * - 在 TextComment 中存储 HTML
 * - 忽略评论类型直接访问属性
 * - 创建过多细碎的评论
 * 
 * 【性能优化】
 * 
 * ```javascript
 * // 批量添加评论时的优化
 * function batchAddComments(note, comments) {
 *   MNUtil.undoGrouping(() => {
 *     // 暂停自动刷新
 *     note.suspendRefresh = true
 *     
 *     // 批量添加
 *     comments.forEach(comment => {
 *       switch(comment.type) {
 *         case 'text':
 *           note.appendTextComment(comment.content)
 *           break
 *         case 'html':
 *           note.appendHtmlComment(comment.html, comment.text)
 *           break
 *         // ... 其他类型
 *       }
 *     })
 *     
 *     // 恢复刷新并手动刷新一次
 *     note.suspendRefresh = false
 *     note.refreshComments()
 *   })
 * }
 * ```
 */
class MNComment{
  // ... 原始代码 ...
}

// ============================================================================
// 🎛️ MNExtensionPanel 类 - 插件面板控制（第 6758-6841 行）
// ============================================================================

/**
 * 🖼️ MNExtensionPanel 类 - 插件界面的掌控者
 * 
 * 【什么是 ExtensionPanel？】
 * ExtensionPanel 是 MarginNote 插件的用户界面容器。每个插件可以有自己的面板，
 * 用于显示自定义界面、设置选项、操作按钮等。面板可以是迷你模式的浮动按钮，
 * 也可以是完整的侧边栏界面。
 * 
 * 【插件面板的形态】
 * ┌─────────────────────────────────────┐
 * │         插件面板的两种模式            │
 * ├─────────────────────────────────────┤
 * │  1. 迷你模式 (40x40)                 │
 * │     ┌──┐                            │
 * │     │🔌│ ← 浮动按钮                  │
 * │     └──┘                            │
 * │                                     │
 * │  2. 展开模式 (完整面板)              │
 * │     ┌────────────────┐              │
 * │     │ 🔌 插件名称  ✕ │ ← 标题栏      │
 * │     ├────────────────┤              │
 * │     │                │              │
 * │     │   自定义内容    │ ← 内容区      │
 * │     │                │              │
 * │     └────────────────┘              │
 * └─────────────────────────────────────┘
 * 
 * 【为什么需要 MNExtensionPanel？】
 * 1. 界面控制：管理插件的显示和隐藏
 * 2. 模式切换：在迷你和完整模式间切换
 * 3. 位置记忆：保存和恢复面板位置
 * 4. 视图管理：加载 WebView 或自定义视图
 * 
 * 【核心功能】
 * 1. 面板控制：show()、hide()、toggle()
 * 2. 模式切换：toMiniMode()、toNormalMode()
 * 3. 位置管理：savePosition()、restorePosition()
 * 4. 内容加载：loadWebView()、setViewController()
 * 
 * 【使用示例】
 * 
 * 📌 示例 1：基本的面板控制
 * ```javascript
 * // 在插件主类中
 * class MyPlugin extends JSExtension {
 *   constructor() {
 *     super()
 *     this.panel = MNExtensionPanel.new(this)
 *   }
 *   
 *   // 切换面板显示
 *   togglePanel() {
 *     if (this.panel.isHidden) {
 *       this.panel.show()
 *     } else {
 *       this.panel.hide()
 *     }
 *   }
 *   
 *   // 进入迷你模式
 *   minimize() {
 *     this.panel.toMiniMode(true)  // true 表示带动画
 *   }
 * }
 * ```
 * 
 * 📌 示例 2：加载自定义界面
 * ```javascript
 * // 加载 HTML 界面
 * function loadCustomUI() {
 *   let htmlPath = this.path + "/ui/index.html"
 *   let webView = UIWebView.new()
 *   
 *   // 加载 HTML 文件
 *   MNConnection.loadFile(
 *     webView,
 *     htmlPath,
 *     this.path + "/ui/"
 *   )
 *   
 *   // 设置为面板内容
 *   this.panel.setContentView(webView)
 *   
 *   // 注入 JavaScript 桥接
 *   webView.evaluateJavaScript(`
 *     window.mnBridge = {
 *       showHUD: function(msg) {
 *         window.webkit.messageHandlers.showHUD.postMessage(msg)
 *       }
 *     }
 *   `)
 * }
 * ```
 * 
 * 📌 示例 3：面板位置管理
 * ```javascript
 * // 保存面板位置
 * function savePanelState() {
 *   let state = {
 *     isMinimized: this.panel.isMinimized,
 *     position: this.panel.frame,
 *     isHidden: this.panel.isHidden
 *   }
 *   
 *   NSUserDefaults.standardUserDefaults()
 *     .setObjectForKey(state, "MyPlugin_PanelState")
 * }
 * 
 * // 恢复面板位置
 * function restorePanelState() {
 *   let state = NSUserDefaults.standardUserDefaults()
 *     .objectForKey("MyPlugin_PanelState")
 *   
 *   if (state) {
 *     this.panel.frame = state.position
 *     
 *     if (state.isMinimized) {
 *       this.panel.toMiniMode(false)
 *     }
 *     
 *     if (!state.isHidden) {
 *       this.panel.show()
 *     }
 *   }
 * }
 * ```
 * 
 * 📌 示例 4：创建自定义控制器
 * ```javascript
 * // 定义自定义视图控制器
 * JSB.defineClass("MyViewController : UIViewController", {
 *   viewDidLoad: function() {
 *     super.viewDidLoad()
 *     
 *     // 创建界面元素
 *     let label = UILabel.new()
 *     label.text = "自定义界面"
 *     label.frame = MNUtil.genFrame(10, 10, 200, 30)
 *     
 *     let button = MNButton.new({
 *       title: "执行操作",
 *       color: "#457bd3"
 *     })
 *     button.frame = MNUtil.genFrame(10, 50, 100, 40)
 *     
 *     // 添加到视图
 *     this.view.addSubview(label)
 *     this.view.addSubview(button)
 *   }
 * })
 * 
 * // 使用自定义控制器
 * let controller = MyViewController.new()
 * this.panel.setViewController(controller)
 * ```
 * 
 * 📌 示例 5：响应式面板设计
 * ```javascript
 * // 创建响应式面板
 * class ResponsivePanel {
 *   constructor(extensionPanel) {
 *     this.panel = extensionPanel
 *     this.setupResponsive()
 *   }
 *   
 *   setupResponsive() {
 *     // 监听屏幕旋转
 *     NSNotificationCenter.defaultCenter()
 *       .addObserverSelectorNameObject(
 *         this,
 *         "orientationChanged:",
 *         UIDeviceOrientationDidChangeNotification,
 *         null
 *       )
 *   }
 *   
 *   orientationChanged(notification) {
 *     let orientation = UIDevice.currentDevice().orientation
 *     
 *     if (UIDeviceOrientationIsLandscape(orientation)) {
 *       // 横屏模式 - 加宽面板
 *       this.panel.setWidth(400)
 *     } else {
 *       // 竖屏模式 - 标准宽度
 *       this.panel.setWidth(300)
 *     }
 *   }
 *   
 *   // 根据内容自动调整高度
 *   adjustHeightForContent(contentHeight) {
 *     let maxHeight = UIScreen.mainScreen().bounds.height * 0.8
 *     let finalHeight = Math.min(contentHeight, maxHeight)
 *     
 *     MNUtil.animate(() => {
 *       this.panel.setHeight(finalHeight)
 *     }, 0.3)
 *   }
 * }
 * ```
 * 
 * 【高级技巧】
 * 
 * 1. 面板动画效果
 * ```javascript
 * // 弹性展开效果
 * function bounceShow() {
 *   this.panel.transform = {a:0.8, b:0, c:0, d:0.8, tx:0, ty:0}
 *   this.panel.alpha = 0
 *   this.panel.show()
 *   
 *   MNUtil.animate(() => {
 *     this.panel.transform = {a:1.1, b:0, c:0, d:1.1, tx:0, ty:0}
 *     this.panel.alpha = 1
 *   }, 0.2)
 *   
 *   MNUtil.delay(0.2).then(() => {
 *     MNUtil.animate(() => {
 *       this.panel.transform = {a:1, b:0, c:0, d:1, tx:0, ty:0}
 *     }, 0.1)
 *   })
 * }
 * ```
 * 
 * 2. 面板拖动处理
 * ```javascript
 * // 添加拖动手势
 * function addDragGesture() {
 *   let panGesture = UIPanGestureRecognizer.alloc()
 *     .initWithTargetAction(this, "handlePan:")
 *   
 *   this.panel.miniButton.addGestureRecognizer(panGesture)
 * }
 * 
 * handlePan(gesture) {
 *   let translation = gesture.translationInView(
 *     this.panel.miniButton.superview
 *   )
 *   
 *   if (gesture.state === UIGestureRecognizerStateBegan ||
 *       gesture.state === UIGestureRecognizerStateChanged) {
 *     // 移动按钮
 *     let center = this.panel.miniButton.center
 *     center.x += translation.x
 *     center.y += translation.y
 *     this.panel.miniButton.center = center
 *     
 *     // 重置手势
 *     gesture.setTranslationInView(
 *       {x:0, y:0},
 *       this.panel.miniButton.superview
 *     )
 *   }
 * }
 * ```
 * 
 * 【最佳实践】
 * 
 * ✅ 正确做法：
 * - 保存和恢复面板状态
 * - 提供迷你模式选项
 * - 响应屏幕变化
 * - 平滑的动画过渡
 * 
 * ❌ 错误做法：
 * - 强制显示面板
 * - 忽略用户的位置偏好
 * - 面板过大遮挡内容
 * - 无法关闭或最小化
 * 
 * 【注意事项】
 * 
 * ⚠️ 内存管理：WebView 可能占用大量内存
 * ⚠️ 性能影响：复杂界面可能影响性能
 * ⚠️ 兼容性：不同设备的屏幕尺寸差异
 * ⚠️ 用户体验：避免面板遮挡重要内容
 */
class MNExtensionPanel{
  // ... 原始代码 ...
}

// ============================================================================
// 🎉 恭喜你！
// ============================================================================

/**
 * 🎊 你已经学完了 MNUtils 的所有核心类！
 * 
 * 【学习总结】
 * 
 * 通过这份详细注释的代码，你学习了：
 * 
 * 1. 🎨 Menu - 创建专业的弹出菜单
 * 2. 🔧 MNUtil - 掌握 300+ 实用工具方法
 * 3. 📝 MNNote - 操作笔记的核心技能
 * 4. 🌐 MNConnection - 处理网络请求和 WebView
 * 5. 🔘 MNButton - 创建美观的交互按钮
 * 6. 📄 MNDocument - 管理 PDF/EPUB 文档
 * 7. 📔 MNNotebook - 组织笔记本和学习集
 * 8. 💬 MNComment - 处理多样化的笔记内容
 * 9. 🎛️ MNExtensionPanel - 控制插件界面
 * 
 * 【下一步建议】
 * 
 * 1. 🚀 实践项目
 *    - 从简单的插件开始，如"批量修改笔记颜色"
 *    - 逐步增加功能，如"智能标签管理"
 *    - 最终创建完整的插件，如"学习统计面板"
 * 
 * 2. 📖 深入学习
 *    - 阅读 xdyyutils.js 了解高级功能
 *    - 研究 MNToolbar 项目学习插件架构
 *    - 参考其他优秀插件的源码
 * 
 * 3. 🤝 社区参与
 *    - 在 MarginNote 论坛分享你的插件
 *    - 为开源项目贡献代码
 *    - 帮助其他开发者解决问题
 * 
 * 【开发小贴士】
 * 
 * 💡 调试技巧：善用 MNUtil.log() 和 Safari Web Inspector
 * 💡 性能优化：批量操作使用 undoGrouping，大数据分批处理
 * 💡 用户体验：提供清晰的提示，操作可撤销，界面响应快
 * 💡 代码质量：保持代码整洁，添加注释，处理边界情况
 * 
 * 【激励寄语】
 * 
 * 插件开发是一个不断学习和创造的过程。每个优秀的插件都始于一个简单的想法。
 * 不要害怕犯错，每个错误都是成长的机会。保持好奇心，勇于尝试，你一定能
 * 创造出令人惊叹的插件！
 * 
 * Happy Coding! 🎈
 * 
 * —— MNUtils 学习指南
 */