JSB.require("utils")
var mnTextHandlerController = JSB.defineClass(
  'mnTextHandlerController : UIViewController', {
    viewDidLoad: function() {
      let config  =  NSUserDefaults.standardUserDefaults().objectForKey("mnTextHandler")
      self.appInstance = Application.sharedInstance();
      self.closeImage = UIImage.imageWithDataScale(NSData.dataWithContentsOfFile(self.mainPath + `/close.png`), 2)
      self.lastFrame = self.view.frame;
      self.currentFrame = self.view.frame
      // 如果用户没有配置，则调用第一个功能
      self.mode = config?config.mode:1
      // 设置默认的分隔符和前缀
      self.delimiter = config?config.delimiter:"; "
      self.prefix = config?config.prefix:"  - "
      // 设置默认的查找和替换
      self.search = config?config.delimiter:"; "
      self.replacement = config?config.prefix:"  - "
      self.moveDate = Date.now()
      self.view.layer.shadowOffset = {width: 0, height: 0};
      self.view.layer.shadowRadius = 15;
      self.view.layer.shadowOpacity = 0.5;
      self.view.layer.shadowColor = UIColor.colorWithWhiteAlpha(0.5, 1);
      self.view.layer.opacity = 1.0
      self.view.layer.cornerRadius = 11
      self.view.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0.8)
      // 底下的 toolbar 选中后的背景颜色
      self.highlightColor = UIColor.blendedColor(
        UIColor.colorWithHexString("#2c4d81").colorWithAlphaComponent(0.8),
        Application.sharedInstance().defaultTextColor,
        0.8
      );

      self.moveButton = UIButton.buttonWithType(0);
      self.setButtonLayout(self.moveButton)

      self.closeButton = UIButton.buttonWithType(0);
      self.setButtonLayout(self.closeButton,"closeButtonTapped:")
      self.closeButton.setImageForState(self.closeImage,0)
      self.closeButton.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
      self.closeButton.titleLabel.font = UIFont.systemFontOfSize(14);



      self.transformButton = UIButton.buttonWithType(0);
      self.setButtonLayout(self.transformButton,"transform:")
      // 底下 toolbar 未选中时的背景颜色
      self.transformButton.backgroundColor = UIColor.colorWithHexString("#5982c4");
      self.transformButton.layer.opacity = 1.0
      // transform 按钮的显示文字
      self.transformButton.setTitleForState("Transform",0)
      self.transformButton.titleLabel.font = UIFont.systemFontOfSize(16);

      self.optionButton = UIButton.buttonWithType(0);
      self.setButtonLayout(self.optionButton,"showOption:")
      self.optionButton.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
      self.optionButton.layer.opacity = 0.5
      // option 按钮的显示文字
      self.optionButton.setTitleForState("Option",0)
      self.optionButton.titleLabel.font = UIFont.systemFontOfSize(16);

      // 新建一个 input 框的实例
      self.textviewInput = UITextView.new()
      self.textviewInput.font = UIFont.systemFontOfSize(16);
      self.textviewInput.layer.cornerRadius = 8
      // 输入框的背景颜色
      self.textviewInput.backgroundColor = UIColor.grayColor().colorWithAlphaComponent(0.3)  // 透明度
      self.view.addSubview(self.textviewInput)
      // 输入框的默认文本
      self.textviewInput.text = `Input here`
      self.textviewInput.bounces = true


      // 新建一个 output 框的实例
      self.textviewOutput = UITextView.new()
      self.textviewOutput.font = UIFont.systemFontOfSize(16);
      self.textviewOutput.layer.cornerRadius = 8
      // 输出框的背景颜色
      self.textviewOutput.backgroundColor = UIColor.grayColor().colorWithAlphaComponent(0.3)  // 透明度
      self.view.addSubview(self.textviewOutput)
      // 输出框的默认文本
      self.textviewOutput.text = `Output here`
      self.textviewOutput.bounces = true


      // 新建一个分隔符输入框的实例
      self.textviewDelimeter = UITextView.new()
      self.textviewDelimeter.font = UIFont.systemFontOfSize(16);
      self.textviewDelimeter.layer.cornerRadius = 8
      self.textviewDelimeter.backgroundColor = UIColor.grayColor().colorWithAlphaComponent(0.3)
      self.view.addSubview(self.textviewDelimeter)
      self.textviewDelimeter.text = self.delimiter
      self.textviewDelimeter.bounces = true


      // 新建一个前缀输入框的实例
      self.textviewPrefix = UITextView.new()
      self.textviewPrefix.font = UIFont.systemFontOfSize(16);
      self.textviewPrefix.layer.cornerRadius = 8
      self.textviewPrefix.backgroundColor = UIColor.grayColor().colorWithAlphaComponent(0.3)
      self.view.addSubview(self.textviewPrefix)
      self.textviewPrefix.text = self.prefix
      self.textviewPrefix.bounces = true


      // 新建一个输入框的粘贴按钮的实例
      self.pasteButton = UIButton.buttonWithType(0);
      // 点击后执行的方法 pasteButtonTapped
      self.setButtonLayout(self.pasteButton,"pasteButtonTapped:")
      self.pasteButton.layer.cornerRadius = 5
      self.pasteButton.setTitleForState("Paste",0)
      self.pasteButton.titleLabel.font = UIFont.systemFontOfSize(18);


      // 新建一个输出框的复制按钮的实例
      self.copyButton = UIButton.buttonWithType(0);
      self.setButtonLayout(self.copyButton,"copyButtonTapped:")
      self.copyButton.layer.cornerRadius = 5
      self.copyButton.setTitleForState("Copy",0)
      self.copyButton.titleLabel.font = UIFont.systemFontOfSize(18);

      // 新建一个查找框的复制按钮的实例
      self.copySearchButton = UIButton.buttonWithType(0);
      self.setButtonLayout(self.copySearchButton,"copySearchButtonTapped:")
      self.copySearchButton.layer.cornerRadius = 5
      self.copySearchButton.setTitleForState("Copy",0)
      self.copySearchButton.titleLabel.font = UIFont.systemFontOfSize(14);

      // 新建一个替换框的复制按钮的实例
      self.copyReplacementButton = UIButton.buttonWithType(0);
      self.setButtonLayout(self.copyReplacementButton,"copyReplacementButtonTapped:")
      self.copyReplacementButton.layer.cornerRadius = 5
      self.copyReplacementButton.setTitleForState("Copy",0)
      self.copyReplacementButton.titleLabel.font = UIFont.systemFontOfSize(14);

      // 新建一个查找框的粘贴按钮的实例
      self.pasteSearchButton = UIButton.buttonWithType(0);
      self.setButtonLayout(self.pasteSearchButton,"pasteSearchButtonTapped:")
      self.pasteSearchButton.layer.cornerRadius = 5
      self.pasteSearchButton.setTitleForState("Paste",0)
      self.pasteSearchButton.titleLabel.font = UIFont.systemFontOfSize(14);

      // 新建一个替换框的粘贴按钮的实例
      self.pasteReplacementButton = UIButton.buttonWithType(0);
      self.setButtonLayout(self.pasteReplacementButton,"pasteReplacementButtonTapped:")
      self.pasteReplacementButton.layer.cornerRadius = 5
      self.pasteReplacementButton.setTitleForState("Paste",0)
      self.pasteReplacementButton.titleLabel.font = UIFont.systemFontOfSize(14);

      // 新建一个替换框内容到查找框内容的按钮的实例
      self.transformReplacementToSearchButton = UIButton.buttonWithType(0);
      self.setButtonLayout(self.transformReplacementToSearchButton,"transformReplacementToSearchButtonTapped:")
      self.transformReplacementToSearchButton.layer.cornerRadius = 5
      self.transformReplacementToSearchButton.setTitleForState("⬅️",0)
      self.transformReplacementToSearchButton.titleLabel.font = UIFont.systemFontOfSize(18);

      // 新建一个查找框内容到替换框内容的按钮的实例
      self.transformSearchToReplacementButton = UIButton.buttonWithType(0);
      self.setButtonLayout(self.transformSearchToReplacementButton,"transformSearchToReplacementButtonTapped:")
      self.transformSearchToReplacementButton.layer.cornerRadius = 5
      self.transformSearchToReplacementButton.setTitleForState("➡️",0)
      self.transformSearchToReplacementButton.titleLabel.font = UIFont.systemFontOfSize(18);


      // 新建一个清空按钮的实例
      self.clearButton = UIButton.buttonWithType(0);
      // 点击后执行的方法 clearButtonTapped
      self.setButtonLayout(self.clearButton,"clearButtonTapped:")
      self.clearButton.layer.cornerRadius = 5
      self.clearButton.setTitleForState("🗑",0)
      self.clearButton.titleLabel.font = UIFont.systemFontOfSize(15);
      self.clearButton.backgroundColor = UIColor.colorWithHexString("#f1dddc");

      // 新建一个清空 textviewDelimeter 的按钮
      self.clearDelimeterButton = UIButton.buttonWithType(0);
      self.setButtonLayout(self.clearDelimeterButton,"clearDelimeterButtonTapped:")
      self.clearDelimeterButton.layer.cornerRadius = 5
      self.clearDelimeterButton.setTitleForState("🗑",0)
      self.clearDelimeterButton.titleLabel.font = UIFont.systemFontOfSize(15);
      self.clearDelimeterButton.backgroundColor = UIColor.colorWithHexString("#f1dddc");

      // 新建一个清空 textviewPrefix 的按钮
      self.clearPrefixButton = UIButton.buttonWithType(0);
      self.setButtonLayout(self.clearPrefixButton,"clearPrefixButtonTapped:")
      self.clearPrefixButton.layer.cornerRadius = 5
      self.clearPrefixButton.setTitleForState("🗑",0)
      self.clearPrefixButton.titleLabel.font = UIFont.systemFontOfSize(15);
      self.clearPrefixButton.backgroundColor = UIColor.colorWithHexString("#f1dddc");


      // 新建一个按钮，用于左侧添加文本片段,加个type属性作为标识
      // 绑定到showSnippets函数，用来弹出菜单
      self.addSnipLeft = UIButton.buttonWithType(0);
      self.setButtonLayout(self.addSnipLeft,"showSnippets:")
      self.addSnipLeft.layer.cornerRadius = 5
      self.addSnipLeft.setTitleForState("📍",0)
      self.addSnipLeft.titleLabel.font = UIFont.systemFontOfSize(14);
      self.addSnipLeft.type = "left"
      // 再增加一个右侧输入框的
      // 绑定到showSnippets函数，用来弹出菜单, 加个type属性作为标识
      self.addSnipRight = UIButton.buttonWithType(0);
      self.setButtonLayout(self.addSnipRight,"showSnippets:")
      self.addSnipRight.layer.cornerRadius = 5
      self.addSnipRight.setTitleForState("📍",0)
      self.addSnipRight.titleLabel.font = UIFont.systemFontOfSize(14);
      self.addSnipRight.type = "right"
      // self.moveGesture0 = new UIPanGestureRecognizer(self,"onMoveGesture:")
      // self.pasteButton.addGestureRecognizer(self.moveGesture0)
      // self.moveGesture0.view.hidden = false
      // self.moveGesture0.addTargetAction(self,"onMoveGesture:")
      self.moveGesture1 = new UIPanGestureRecognizer(self,"onMoveGesture:")
      self.optionButton.addGestureRecognizer(self.moveGesture1)
      self.moveGesture1.view.hidden = false
      self.moveGesture1.addTargetAction(self,"onMoveGesture:")
      self.moveGesture2 = new UIPanGestureRecognizer(self,"onMoveGesture:")
      self.transformButton.addGestureRecognizer(self.moveGesture2)
      self.moveGesture2.view.hidden = false
      self.moveGesture2.addTargetAction(self,"onMoveGesture:")
      self.moveGesture = new UIPanGestureRecognizer(self,"onMoveGesture:")
      self.moveButton.addGestureRecognizer(self.moveGesture)
      self.moveGesture.view.hidden = false
      self.moveGesture.addTargetAction(self,"onMoveGesture:")

      self.resizeGesture = new UIPanGestureRecognizer(self,"onResizeGesture:")
      self.closeButton.addGestureRecognizer(self.resizeGesture)
      self.resizeGesture.view.hidden = false
      self.resizeGesture.addTargetAction(self,"onResizeGesture:")
    },
    viewWillAppear: function(animated) {
    },
    viewWillDisappear: function(animated) {
    },
  viewWillLayoutSubviews: function() {
    if (self.miniMode) {
      return
    }
    var viewFrame = self.view.bounds;
    var xLeft     = viewFrame.x
    var xRight    = xLeft + viewFrame.width
    var yTop      = viewFrame.y
    var yBottom   = yTop + viewFrame.height
    self.closeButton.frame = {x: xRight-35,y: yBottom-35,width: 30,height: 30};
    self.moveButton.frame = {x: xLeft+5 ,y: yBottom-35,width: xRight-10,height: 30};
    var halfHeight = (viewFrame.height-100)*0.5
    var halfWidth = (viewFrame.width-15)*0.5
    viewFrame.y = 5
    viewFrame.x = 5
    viewFrame.height = halfHeight-30
    viewFrame.width = viewFrame.width -10

    self.textviewInput.frame = viewFrame

    self.pasteButton.frame = {  x: viewFrame.width-60,  y: viewFrame.height-30,  width: 60,  height: 30,};
    viewFrame.y = halfHeight - 10

    self.clearButton.frame = {  x: xRight-80,  y: self.closeButton.frame.y,  width: 45,  height: 30,};

    self.textviewOutput.frame = viewFrame

    self.copyButton.frame = {  x: viewFrame.width-60,  y: halfHeight+viewFrame.height-40,  width: 60,  height: 30};
    viewFrame.y = 15+halfHeight*2
    viewFrame.height = 45
    viewFrame.width = halfWidth-30

    self.textviewDelimeter.frame = {  x: viewFrame.x,  y: yBottom-125,  width: viewFrame.width-50,  height: 80}
    // 控制左侧按钮的范围，限制在 textviewPrefix 的右侧
    self.addSnipLeft.frame = {x:self.textviewDelimeter.frame.x + self.textviewDelimeter.frame.width,y:self.textviewDelimeter.frame.y-10,width:50,height:35}

    // 查找框的复制按钮和粘贴按钮放在 addSnipLeft 的下面
    self.copySearchButton.frame = {  x: self.addSnipLeft.frame.x,  y: self.addSnipLeft.frame.y+self.addSnipLeft.frame.height,  width: 50,  height: 30};
    self.pasteSearchButton.frame = {  x: self.addSnipLeft.frame.x,  y: self.copySearchButton.frame.y+self.copySearchButton.frame.height,  width: 50,  height: 30};

    self.textviewPrefix.frame = {  x: viewFrame.x- 23+ viewFrame.width + 70 ,  y: yBottom-125,  width: viewFrame.width-30,  height: 80}
    // 控制右侧按钮的范围,限制在textviewDelimeter的右侧
    self.addSnipRight.frame = {x:self.textviewPrefix.frame.x + self.textviewPrefix.frame.width,y:self.textviewPrefix.frame.y-10,width:50,height:35}
    // 替换框的复制按钮和粘贴按钮放在 addSnipRight 的下面
    self.copyReplacementButton.frame = {  x: self.addSnipRight.frame.x,  y: self.addSnipRight.frame.y+self.addSnipRight.frame.height,  width: 50,  height: 30};
    self.pasteReplacementButton.frame = {  x: self.addSnipRight.frame.x,  y: self.copyReplacementButton.frame.y+self.copyReplacementButton.frame.height,  width: 50,  height: 30};
    self.clearDelimeterButton.frame = {  x: self.textviewDelimeter.frame.x+self.textviewDelimeter.frame.width-50,  y: self.textviewDelimeter.frame.y+self.textviewDelimeter.frame.height-30,  width: 50,  height: 30};
    self.clearPrefixButton.frame = {  x: self.textviewPrefix.frame.x+self.textviewPrefix.frame.width-50,  y: self.textviewPrefix.frame.y+self.textviewPrefix.frame.height-30,  width: 50,  height: 30};

    self.transformReplacementToSearchButton.frame = {  x: self.textviewPrefix.frame.x - 45 ,  y: self.textviewPrefix.frame.y,  width: 45,  height: 40};

    self.transformSearchToReplacementButton.frame = {  x: self.textviewPrefix.frame.x - 45,  y: self.textviewPrefix.frame.y+40,  width: 45,  height: 40};

    self.transformButton.frame = {  x: xLeft+5,  y: yBottom-35,  width: viewFrame.width,  height: 30};
    viewFrame.x = 10+halfWidth

    self.optionButton.frame = {  x: viewFrame.x - 20,  y: yBottom-35,  width: viewFrame.width-40,  height: 30,}
  },
  scrollViewDidScroll: function() {
  },
  showSnippets: function (button) {//button就是触发这个函数的那个按钮
    //用try catch的方式获取报错
  try {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
      

    let type = button.type //分辨是left还是right
    //获取MNSnippets中存储的文本
    let snippets = NSUserDefaults.standardUserDefaults().objectForKey('MNSnippets_prompts')
    let config = NSUserDefaults.standardUserDefaults().objectForKey('MNSnippets_config')
    //config里的promptNames存储顺序
    let snipNames = config.promptNames


    // 菜单控制
    var menuController = MenuController.new();
    menuController.commandTable = snipNames.map(snipName=>{
      let snippet = snippets[snipName]
      switch (type) {
        case "left"://left调用setTextLeft函数，参数为snippet.context
          return {title:snippet.title, object:self, selector:'setTextLeft:', param:snippet.context}
        case "right"://right调用setTextRight函数，参数为snippet.context
          return {title:snippet.title, object:self, selector:'setTextRight:', param:snippet.context}
        default:
      }
    })
    menuController.rowHeight = 35;
    menuController.preferredContentSize = {
      width: 150,
      height: menuController.rowHeight * menuController.commandTable.length
    };
    var studyController = Application.sharedInstance().studyController(self.view.window);
    self.view.popoverController = new UIPopoverController(menuController);
    var r = button.convertRectToView(button.bounds,studyController.view);
    self.view.popoverController.presentPopoverFromRect(r, studyController.view, 1 << 0, true);  // 1 << 0 是指箭头朝下，1 << 1 是指箭头朝上，1 << 2 是指箭头朝左，1 << 3 是指箭头朝右
  } catch (error) {
    showHUD(error)
  }
  },
  setTextLeft: function(text) {
    self.textviewDelimeter.text = text;
    // 关闭弹窗
    if (self.view.popoverController) {
      self.view.popoverController.dismissPopoverAnimated(true);
    }
  },
  setTextRight: function(text) {
    self.textviewPrefix.text = text;
    // 关闭弹窗
    if (self.view.popoverController) {
      self.view.popoverController.dismissPopoverAnimated(true);
    }
  },
  showOption: function(sender) {
    self.optionButton.backgroundColor = UIColor.colorWithHexString("#5982c4");
    self.optionButton.layer.opacity = 1.0
    // self.pasteButton.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
    // self.pasteButton.layer.opacity = 0.5
    self.transformButton.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
    self.transformButton.layer.opacity = 0.5
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}

    // 菜单控制
    var menuController = MenuController.new();
    menuController.commandTable = [
      {title:'生成正则表达式', object:self, selector:'setOption:', param:6, checked:self.mode === 6},
      // {title:'处理旧卡片：只清除', object:self, selector:'setOption:', param:9, checked:self.mode === 9},
      // {title:'处理旧卡片：清除+合并标题', object:self, selector:'setOption:', param:11, checked:self.mode === 11},
      {title:"批量删除和添加指定评论", object:self, selector:'setOption:', param:8, checked:self.mode === 8},
      {title:'批量删除“模板：”', object:self, selector:'setOption:', param:12, checked:self.mode === 12},
      {title:'增加论文卡片', object:self, selector:'setOption:', param:15, checked:self.mode === 15},
      {title:'增加书作卡片', object:self, selector:'setOption:', param:16, checked:self.mode === 16},
      {title:'增加作者卡片', object:self, selector:'setOption:', param:14, checked:self.mode === 14},
      {title:'增加期刊卡片', object:self, selector:'setOption:', param:17, checked:self.mode === 17},
      {title:'增加出版社卡片', object:self, selector:'setOption:', param:18, checked:self.mode === 18},
      {title:'增加通讯地址卡片', object:self, selector:'setOption:', param:19, checked:self.mode === 19},
      // {title:'卡片→非摘录版本', object:self, selector:'setOption:', param:10, checked:self.mode === 10},
      // {title:"修改子卡片前缀", object:self, selector:'setOption:', param:7, checked:self.mode === 7},
      {title:'Title case convert', object:self, selector:'setOption:', param:1, checked:self.mode === 1},
      {title:'Split item', object:self, selector:'setOption:', param:2, checked:self.mode === 2},
      {title:'Convert to lower case', object:self, selector:'setOption:', param:3, checked:self.mode === 3},
      {title:'Find and replace', object:self, selector:'setOption:', param:5, checked:self.mode === 5},
      {title:'Keywords to MNtag', object:self, selector:'setOption:', param:4, checked:self.mode === 4},
      {title:'克隆卡片为自身的子卡片', object:self, selector:'setOption:', param:13, checked:self.mode === 13},
    ];
    menuController.rowHeight = 35;
    menuController.preferredContentSize = {
      width: 200,
      height: menuController.rowHeight * menuController.commandTable.length
    };
    var studyController = Application.sharedInstance().studyController(self.view.window);
    self.view.popoverController = new UIPopoverController(menuController);
    var r = sender.convertRectToView(sender.bounds,studyController.view);
    self.view.popoverController.presentPopoverFromRect(r, studyController.view, 1 << 0, true);
  },
  setOption: function (params) {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    self.mode = params
    
    let optionNames = [
      "Title case convert",
      "Split item",
      "Convert to lower case",
      "Keywords to MNtag",
      "Find and replace",
      "生成正则表达式",
      "修改子卡片前缀",
      "批量删除和添加指定评论",
      "处理旧卡片：只清除",
      "卡片→非摘录版本",
      "处理旧卡片：清除+合并标题",
      "批量删除“模板：”",
      "克隆卡片为自身的子卡片",
      "增加作者卡片",
      "增加论文卡片",
      "增加书作卡片",
      "增加期刊卡片",
      "增加出版社卡片",
      "增加通讯地址卡片"
    ]
    self.optionButton.setTitleForState(optionNames[params-1],0)

    // 把配置写到系统里
    NSUserDefaults.standardUserDefaults().setObjectForKey({mode:self.mode,delimiter:self.delimiter,prefix:self.prefix},"mnTextHandler")
  },
  transform: function() {
  try {//捕获异常信息
    
    let input = self.textviewInput.text
    switch (self.mode) {
      case 1:  // 转英文标题规范格式
        // 输出框的文本用 toTitleCase() 方法处理
        self.textviewOutput.text = input.toTitleCase()
        // 将 textviewOutput.text 的内容复制到剪切板
        UIPasteboard.generalPasteboard().string = self.textviewOutput.text
        noteTitleToTitleCase()
        break;
      case 2:  // 分割
        self.delimiter = self.textviewDelimeter.text
        self.prefix = self.textviewPrefix.text
        self.textviewOutput.text = input.splitItem(self.delimiter, self.prefix)
        UIPasteboard.generalPasteboard().string = self.textviewOutput.text
        // 把配置写到系统里
        NSUserDefaults.standardUserDefaults().setObjectForKey({mode:self.mode, delimiter:self.delimiter, prefix:self.prefix}, "mnTextHandler")
        break;
      case 3:  // 转小写
        // 输出框的文本用 toTitleCase() 方法处理
        self.textviewOutput.text = input.toLowerCase()
        // 将 textviewOutput.text 的内容复制到剪切板
        UIPasteboard.generalPasteboard().string = self.textviewOutput.text
        break;
      case 4:  // 转 MN 标签
        self.delimiter = self.textviewDelimeter.text
        self.prefix = self.textviewPrefix.text
        self.textviewOutput.text = input.keyWords2MNTag(self.delimiter, self.prefix)
        UIPasteboard.generalPasteboard().string = self.textviewOutput.text
        // 把配置写到系统里
        NSUserDefaults.standardUserDefaults().setObjectForKey({mode:self.mode, delimiter:self.delimiter, prefix:self.prefix}, "mnTextHandler")
        break;
      case 5: // 查找替换
        self.search = self.textviewDelimeter.text
        self.replacement = self.textviewPrefix.text
        self.textviewOutput.text = input.findReplace(self.search, self.replacement)
        UIPasteboard.generalPasteboard().string = self.textviewOutput.text
        // 把配置写到系统里
        NSUserDefaults.standardUserDefaults().setObjectForKey({mode:self.mode, search:self.search, replacement:self.replacement},"mnTextHandler")
        break;
      case 6: // 正则表达式
        self.search = self.textviewDelimeter.text
        self.replacement = self.textviewPrefix.text
        self.textviewOutput.text = input.regularExpression(self.search, self.replacement)
        UIPasteboard.generalPasteboard().string = self.textviewOutput.text
        break;
      case 7: // 修改子项标题
        // 获取当前激活的窗口
        let focusWindow = Application.sharedInstance().focusWindow
        // 获取笔记本控制器
        let notebookController = Application.sharedInstance().studyController(focusWindow).notebookController
        // 获取当前聚焦的笔记
        let focusNote = notebookController.focusNote
        // 获取当前笔记本id
        let notebookId = notebookController.notebookId
        setTitle(focusNote, notebookId)
        break;
      case 8:
      // 批量删除评论和增加评论，找到需要删除的评论才能增加评论
      // 而且不能删除文本摘录
        let focusNotes = getFocusNotes()
        // self.index = 
        let commentToRemove = self.textviewDelimeter.text
        let commentToAppend = self.textviewPrefix.text
        focusNotes.forEach(focusNote => {
          // copyJSON(focusNote)
          let index = getCommentIndex(focusNote, commentToRemove)
          if (index == -1) {
            return
          }
          deleteAndAddComment(focusNote, index, commentToAppend)
        })
        break;
      case 9: // 处理旧卡片：只清除不合并标题
        removeTextAndHtmlComments()
        break;
      case 10: // 卡片→非摘录版本
        newBrotherNoteAndMerge()
        break;
      case 11: // 处理旧卡片：清除+合并标题
        removeTextAndHtmlCommentsAndMerge()
        break;
      case 12: // 批量删除“模板：”
        deleteSpecialCommentOfLastLightYellowNote("模版：")
        deleteSpecialCommentOfLastLightYellowNote("模板：")
        break;
      case 13: // 克隆卡片为自身的子卡片（只能复制标题）
        cloneNoteSelf()
        break;
      case 14: // 生成作者卡片
        // title = self.textviewPrefix.text ? self.textviewPrefix.text : self.textviewDelimeter.text;
        if (self.textviewPrefix.text) {
          cloneNoteAsChild("A67469F8-FB6F-42C8-80A0-75EA1A93F746","20CE37FF-E556-476A-A22C-3951A1000D04", self.textviewPrefix.text, "【参考文献：文献作者】; ")
        }
        if (self.textviewDelimeter.text) {
          cloneNoteAsChild("A67469F8-FB6F-42C8-80A0-75EA1A93F746","20CE37FF-E556-476A-A22C-3951A1000D04", self.textviewDelimeter.text, "【参考文献：文献作者】; ")
        }
        break;
      case 15: // 生成论文卡片
        // title = self.textviewPrefix.text ? self.textviewPrefix.text : self.textviewDelimeter.text;
        title = self.textviewPrefix.text + "; " + self.textviewDelimeter.text;
        cloneNoteAsChild("785225AC-5A2A-41BA-8760-3FEF10CF4AE0","068CB9F2-1DD2-46F5-8E8F-782D394FD7E3",title, "【参考文献：论文】; ")
        break;
      case 16: // 生成书作卡片
        // title = self.textviewPrefix.text ? self.textviewPrefix.text : self.textviewDelimeter.text;
        title = self.textviewPrefix.text + "; " + self.textviewDelimeter.text;
        cloneNoteAsChild("49102A3D-7C64-42AD-864D-55EDA5EC3097","5B7C1498-5045-430D-A085-708565412A71",title, "【参考文献：书作】; ")
        break;
      case 17: // 生成期刊卡片
        // title = self.textviewPrefix.text ? self.textviewPrefix.text : self.textviewDelimeter.text;
        title = self.textviewPrefix.text + "; " + self.textviewDelimeter.text;
        cloneNoteAsChild("1D83F1FA-E54D-4E0E-9E74-930199F9838E","8C7B690C-48F8-4AC7-B990-C6FC96092133",title, "【参考文献：期刊】; ")
        break;
      case 18: // 生成出版社卡片
        // title = self.textviewPrefix.text ? self.textviewPrefix.text : self.textviewDelimeter.text;
        title = self.textviewPrefix.text + "; " + self.textviewDelimeter.text;
        cloneNoteAsChild("9FC1044A-F9D2-4A75-912A-5BF3B02984E6","2072CE8B-2BBE-463E-8EA4-8AC0088923DB",title, "【参考文献：出版社】; ")
        break;
      case 19: // 生成通讯地址卡片
        // title = self.textviewPrefix.text ? self.textviewPrefix.text : self.textviewDelimeter.text;
        title = self.textviewPrefix.text + "; " + self.textviewDelimeter.text;
        cloneNoteAsChild("D2D7DEEB-4A1D-4802-BA28-1FB73595B023","1C4379F4-0881-4B1F-A47C-DF74BF5313BD",title, "【参考文献：通讯地址】; ")
        break;
      default:
        self.textviewOutput.text = "no results"
        break;
    }
    // self.textviewOutput.text = input
    self.transformButton.backgroundColor = UIColor.colorWithHexString("#5982c4");
    self.transformButton.layer.opacity = 1.0
    // self.pasteButton.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
    // self.pasteButton.layer.opacity = 0.5
    self.optionButton.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
    self.optionButton.layer.opacity = 0.5
  } catch (error) {
    showHUD(error)
  }
  },
  pasteButtonTapped: function() {
    // 将剪切板的内容输出到 input 框
    self.textviewInput.text = UIPasteboard.generalPasteboard().string
  },
  copyButtonTapped: function() {
    // 将 output 框的内容复制到剪切板
    UIPasteboard.generalPasteboard().string = self.textviewOutput.text
  },
  copySearchButtonTapped: function() {
    // 将查找的内容复制到剪切板
    UIPasteboard.generalPasteboard().string = self.textviewDelimeter.text
  },
  copyReplacementButtonTapped: function() {
    // 将替换框内容复制到剪切板
    UIPasteboard.generalPasteboard().string = self.textviewPrefix.text
  },
  pasteSearchButtonTapped: function() {
    // 获取剪切板的内容
    var clipboardContent = UIPasteboard.generalPasteboard().string;

    // 匹配【xxx：yyy】形式的内容，并提取出yyy部分
    var match = clipboardContent.match(/【[^：]+：([^】]+)】/);
    if (match && match[1]) {
        // 如果存在匹配项，就更新剪切板内容为yyy部分
        clipboardContent = match[1];
    }

    // 将预处理后的或原始的剪切板内容输出到查找框
    self.textviewDelimeter.text = clipboardContent;
  },
  pasteReplacementButtonTapped: function() {
    // 获取剪切板的内容
    let clipboardContent = UIPasteboard.generalPasteboard().string;
    
    // 获取 self.textviewDelimeter.text 的内容
    let delimiterContent = self.textviewDelimeter.text;
  
    // 定义将要替换的文本
    let replacedContent;
  
    // 检测 self.textviewDelimeter.text 的内容是否为特定的字符串
    let skipProcessing = delimiterContent === '(/【.*】/g, "")' || delimiterContent === '【.*】';
  
    if (!skipProcessing) {
        // 匹配所有【xxx：yyy】形式的内容
        let extractedContent = clipboardContent.replace(/【[^：]+：([^】]+)】/g, function(match, p1) {
            // p1就是匹配到的yyy部分
            // 去掉“x级标题”
            return p1.replace(/(一|二|三|四|五|六|七|八|九)级标题/g, '');
        });
        // 设置去掉【】及“x级标题”后的文本到替换框
        self.textviewPrefix.text = extractedContent;
        return; // 提前结束函数
    }
  
    // 如果 self.textviewDelimeter.text 为指定字符串，或者没有匹配到【xxx：yyy】，则进行下面的操作
    // 匹配“x级标题”正则表达式
    let regex = /(一|二|三|四|五|六|七|八|九)级标题/g;
  
    // 如果有匹配，则删除所有的“x级标题”
    if (clipboardContent.match(regex)) {
        replacedContent = clipboardContent.replace(regex, '');
    } else {
        // 如果没有匹配到“x级标题”，原封不动地赋值
        replacedContent = clipboardContent;
    }
  
    // 将处理结果设置到替换框
    self.textviewPrefix.text = replacedContent;
  },
  transformSearchToReplacementButtonTapped: function() {
    // 将查找框的内容复制到替换框
    self.textviewPrefix.text = self.textviewDelimeter.text;
  },
  transformReplacementToSearchButtonTapped: function() {
    // 将替换框的内容复制到查找框
    self.textviewDelimeter.text = self.textviewPrefix.text;
  },
  clearButtonTapped: function() {
    // 清空 input 框和 output 框的内容
    self.textviewInput.text = ""
    self.textviewOutput.text = ""
    // 清空 self.textviewDelimeter.text 和 self.textviewPrefix.text
    self.textviewDelimeter.text = ""
    self.textviewPrefix.text = ""
  },
  clearDelimeterButtonTapped: function() {
    // 清空 self.textviewDelimeter.text
    self.textviewDelimeter.text = ""
  },
  clearPrefixButtonTapped: function() {
    // 清空 self.textviewPrefix.text
    self.textviewPrefix.text = ""
  },
  closeButtonTapped: function() {
    // 隐藏窗口
    self.view.hidden = true;
  },
  onMoveGesture:function (gesture) {
    let locationToMN = gesture.locationInView(self.appInstance.studyController(self.view.window).view)
    if ( (Date.now() - self.moveDate) > 100) {
      let translation = gesture.translationInView(self.appInstance.studyController(self.view.window).view)
      let locationToBrowser = gesture.locationInView(self.view)
      let locationToButton = gesture.locationInView(gesture.view)
      let buttonFrame = self.moveButton.frame
      let newY = locationToButton.y-translation.y 
      let newX = locationToButton.x-translation.x
      if (gesture.state !== 3 && (newY<buttonFrame.height && newY>0 && newX<buttonFrame.width && newX>0 && Math.abs(translation.y)<20 && Math.abs(translation.x)<20)) {
        self.locationToBrowser = {x:locationToBrowser.x-translation.x,y:locationToBrowser.y-translation.y}
      }
    }
    self.moveDate = Date.now()
    let location = {x:locationToMN.x - self.locationToBrowser.x,y:locationToMN.y -self.locationToBrowser.y}
    let frame = self.view.frame
    var viewFrame = self.view.bounds;
    let studyFrame = self.appInstance.studyController(self.view.window).view.bounds
    let y = location.y
    if (y<=0) {
      y = 0
    }
    if (y>=studyFrame.height-15) {
      y = studyFrame.height-15
    }
    let x = location.x
    self.view.frame = {x:x,y:y,width:frame.width,height:frame.height}
    self.currentFrame  = self.view.frame
  },
  onResizeGesture:function (gesture) {
    self.custom = false;
    self.dynamic = false;
    let baseframe = gesture.view.frame
    let locationInView = gesture.locationInView(gesture.view)
    let frame = self.view.frame
    let width = locationInView.x+baseframe.x+baseframe.width*0.5
    let height = locationInView.y+baseframe.y+baseframe.height*0.5
    // 最小宽度
    if (width <= 200) {
      width = 200
    }
    // 最小高度
    if (height <= 100) {
      height = 100
    }
    self.view.frame = {x:frame.x,y:frame.y,width:width,height:height}
    self.currentFrame  = self.view.frame
  },
});

mnTextHandlerController.prototype.setButtonLayout = function (button, targetAction) {
    button.autoresizingMask = (1 << 0 | 1 << 3);
    button.setTitleColorForState(UIColor.whiteColor(),0);
    button.setTitleColorForState(this.highlightColor, 1);
    button.backgroundColor = UIColor.colorWithHexString("#9bb2d6").colorWithAlphaComponent(0.8);
    button.layer.cornerRadius = 10;
    button.layer.masksToBounds = true;
    if (targetAction) {
      button.addTargetActionForControlEvents(this, targetAction, 1 << 6);
    }
    this.view.addSubview(button);
}


// 需求：将英文标题转化为规范格式
String.prototype.toTitleCase = function () {
  'use strict'
  let smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|v.?|vs.?|via)$/i;
  let alphanumericPattern = /([A-Za-z0-9\u00C0-\u00FF])/;
  /* note there is a capturing group, so the separators will also be included in the returned list */
  let wordSeparators = /([ :–—-])/;
  let lowerBar = /_/g;
  /* regular expression: remove the space character, punctuation (.,;:!?), 
     dash and lower bar at both ends of the string */
  let trimBeginEndPattern = /^[\s.,;:!?_\-]*([a-zA-Z0-9].*[a-zA-Z0-9])[\s.,;:!?_\-]*$/g;
  let romanNumberPattern = /^(I|II|III|IV|V|VI|VII|VIII|IX|X)$/i;

  return this.toLowerCase().replace(trimBeginEndPattern,"$1")
    .replace(lowerBar, " ")
    .split(wordSeparators)
    .map(function (current, index, array) {
      if (
        /* Check for small words */
        current.search(smallWords) > -1 &&
        /* Skip first and last word */
        index !== 0 &&
        index !== array.length - 1 &&
        /* cope with the situation such as: 1. the conjugation operator */
        array.slice(0,index-1).join('').search(/[a-zA-Z]/) > -1 &&
        /* Ignore title end and subtitle start */
        array[index - 3] !== ':' &&
        array[index + 1] !== ':' &&
        /* Ignore small words that start a hyphenated phrase */
        (array[index + 1] !== '-' ||
          (array[index - 1] === '-' && array[index + 1] === '-'))
      ) {
        return current.toLowerCase()
      }
      
      /* Uppercase roman numbers */
      if (current.search(romanNumberPattern) > -1) {
        return current.toUpperCase();
      }

      /* Ignore intentional capitalization */
      if (current.substring(1).search(/[A-Z]|\../) > -1) {
        return current;
      }

      /* Ignore URLs */
      if (array[index + 1] === ':' && array[index + 2] !== '') {
        return current;
      }

      /* Capitalize the first letter */
      return current.replace(alphanumericPattern, function (match) {
        return match.toUpperCase();
      })
    })
    .join('') // convert the list into a string
}
function noteTitleToTitleCase() {
  // 获取当前激活的窗口
  let focusWindow = Application.sharedInstance().focusWindow
  // 获取笔记本控制器
  let notebookController = Application.sharedInstance().studyController(focusWindow).notebookController
  // 获取当前聚焦的笔记
  let focusNotes = getFocusNotes()
  // 获取当前笔记本id
  let notebookId = notebookController.notebookId

  for (note of focusNotes) {
    note.noteTitle = note.noteTitle.toTitleCase()
  }
  // 更新数据库后刷新界面
  Application.sharedInstance().refreshAfterDBChanged(notebookId)
}


// 需求：关键词分割，并转换为无序列表
// 参数说明：
//   splitLabel 输入“分割点”
//   preLabel 输入“前缀”
// 效果：
//   1. 将输入的文本按照 splitLabel 分割为多个 items
//   2. item => preLabel + item
//   3. 将多个 item 用 \n 连接并输出
String.prototype.splitItem = function (splitLabel, preLabel) {
  let splitLabelPattern = RegExp(`${splitLabel}`)
  // 要注意匹配 - 的时候如果不放在 [] 的首尾，需要用 \- 转义
  let punctuationDeletePattern = /^[\s.,;:–\-_!?]*([a-zA-Z0-9].*[a-zA-Z0-9])[\s.,;:–\-_!?]*$/g;
  // 去掉首位的标点符号
  let thisHandleVersion = this.replace(punctuationDeletePattern, "$1")
  // 再去掉一次空格（防止标点符号附近有空格）
  thisHandleVersion = thisHandleVersion.trimStart().trimEnd();
  if (splitLabelPattern.test(this)) {
    let items = thisHandleVersion.split(splitLabel).map(item=>preLabel+item.trimStart().trimEnd()).join('\n')  // 用换行符链接
    return items
  }else{
    return "No delimiter found"
  }
}

// 需求：将关键词转化为 MN 标签形式（即 #xxx），并转换为无序列表形式
// MN 标签的语法：
//   - 不能有空格 => 用下划线 _ 代替
//   - 不能有 -  => 用下划线 _ 代替
// 设计思路
// - 先分割
// - 将空格和 - 替换为下划线
// - 再转换为 MN 标签

String.prototype.keyWords2MNTag = function (splitLabel, preLabel) {
  let splitLabelPattern = RegExp(`${splitLabel}`)
  let mnTagPattern = /[\s–\-]/g
  // 要注意匹配 - 的时候如果不放在 [] 的首尾，需要用 \- 转义
  let punctuationDeletePattern = /^[\s.,;:–\-_!?]*([a-zA-Z0-9].*[a-zA-Z0-9])[\s.,;:–\-_!?]*$/g;
  // 去掉首位的标点符号
  let thisHandleVersion = this.replace(punctuationDeletePattern, "$1")
  // 再去掉一次空格（防止标点符号附近有空格）
  thisHandleVersion = thisHandleVersion.trimStart().trimEnd();
  if (splitLabelPattern.test(this)) {
    let items = thisHandleVersion.split(splitLabel).map(item => preLabel + "#" + item.replace(mnTagPattern, "_")).join('\n')  // 用换行符链接
    // 将多个下划线合并为一个
    items = items.replace(/_+/g, "_")
    items = "- 关键词(keywords)：\n" + items
    return items
  }else{
    return "No delimiter found"
  }
}

// 查找替换
String.prototype.findReplace = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
}

// 转义正则表达式中的特殊字符
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

String.prototype.regularExpression = function (search, replacement) {
  let trimmedSearch = search.replace(/\s/g, '');
  let isSpecialSearchPattern = trimmedSearch === '(/【.*】/g,"")';

  if (isSpecialSearchPattern) {
    search = '【.*】';
  } else {
    // 提取【xxxx：yyyyy】格式
    let searchPattern = search.match(/【(.*?)：(.*?)】/);
    if (searchPattern) {
      search = searchPattern[2];  // 直接使用未转义的特殊部分
    }

    // 现在进行转义处理
    search = escapeRegExp(search);

    // 预处理 replacement
    let replacementPattern = replacement.match(/【(.*?)：(.*?)】/);
    if (replacementPattern) {
      replacement = replacementPattern[2];
    }
  }

  return `(/${search}/g, "${replacement}")`;
};


// TODO:如果从父父节点使用，会使用父父节点的内容，而不是父节点
// TODO:不能多选处理
/**
 * @param {Number} colorIndex
 */
function setTitle(parentNote, notebookId) {
  // 获取当前笔记标题，用于提取 `text`
  let title = parentNote.noteTitle
  // 正则表达式提取 `text`
  let text = title.replace(/“(.+)”：“(.+)”\s*相关(.+)/g, "$3：$2")
  let textMatchResult = title.match(/“(.+)”：“(.+)”\s*相关(.+)/g, "$3：$2")
  let descendants = getAllDescendants(parentNote)
  // 使用 UndoManager 的 undoGrouping 功能方便之后的撤销操作
  UndoManager.sharedInstance().undoGrouping(
    String(Date.now()),
    notebookId,
    () => {
      // 先处理非黄色卡片
      // DONE: 避免处理同级黄色卡片下的子卡片
      //   想法是对同级黄色卡片再处理一遍子卡片的标题
      //   问题应该出在顺序上，最后处理的子卡片的标题会覆盖之前处理的子卡片的标题
      for (descendant of descendants) {
        if (descendant.noteTitle) {
          if (descendant.colorIndex !== 0 && descendant.colorIndex !== 4) {
            // 有标题且不是黄色卡片才处理
            setTitleAux(descendant, text, textMatchResult)
          } 
        }
      }
      for (descendant of descendants) {
        if (descendant.noteTitle) {
          if (descendant.colorIndex == 0 || descendant.colorIndex == 4) {
            // setTitle(descendant, notebookId)
            descendant.childNotes.forEach(child=>{
              setTitle(child, notebookId)
            })
          }
        }
      }
    }
  );

  // 更新数据库后刷新界面
  Application.sharedInstance().refreshAfterDBChanged(notebookId)
}

function setTitleAux(note, text, textMatchResult) {
  let oldTitle = note.noteTitle;
  let newTitle;

  // if (textMatchResult) {
    // 检查【xxx】格式，并捕获xxx内容
    let matchResult = oldTitle.match(/^【([^】]*)/);

    if (matchResult) { // 如果有匹配结果
      let capturedText = matchResult[1];
      // 检查是否包含text并且是否需要补上】
      if (capturedText.includes(text) && !oldTitle.includes("】")) {
        note.noteTitle = oldTitle + "】";
      } else if (!capturedText.includes(text)) {
        // 如果不包含text，替换原有【】内容
        if (note.colorIndex == 2) {
          newTitle = oldTitle.replace(/^【.*?】/, "【" + text + "】; ");
        } else {
          newTitle = oldTitle.replace(/^【.*?】/, "【" + text + "】");
        }
        note.noteTitle = newTitle;
      }
    } else { // 如果标题不是以【xxx开头
      if (note.colorIndex == 2) {
        newTitle = "【" + text + "】; " + oldTitle;
      } else {
        newTitle = "【" + text + "】" + oldTitle;
      }
      note.noteTitle = newTitle;
    }
  // } else {
  //   // 如果没有匹配结果，直接添加【xxx】
  //   if (note.colorIndex == 2) {
  //     newTitle = "【" + text + "】; " + oldTitle;
  //   } else {
  //     newTitle = "【" + text + "】" + oldTitle;
  //   }
  //   note.noteTitle = newTitle;
  // }
}


/**
 * 
 * @param {MbBookNote} note 
 * @param {String} comment 
 */
function getCommentIndex(note,commentToSearch) {
  let comments = note.comments

  let index = comments.findIndex(comment=>{
    return ((comment.type === "TextNote" || comment.type === "HtmlNote")&& comment.text === commentToSearch)
  })
  return index
}
/**
 * 
 * @param {MbBookNote} note 
 * @param {Number} index 
 * @param {String} comment 
 */
function deleteAndAddComment(note, index, comment) {
  // 获取当前激活的窗口
  let notebookId = note.notebookId
  // 使用 UndoManager 的 undoGrouping 功能方便之后的撤销操作
  UndoManager.sharedInstance().undoGrouping(
    String(Date.now()),
    notebookId,
    () => {
      note.removeCommentByIndex(index)
      if (comment !== "") {
        note.appendTextComment(comment)
      }
    }
  );

  // 更新数据库后刷新界面
  Application.sharedInstance().refreshAfterDBChanged(notebookId)
}


/**
 * 
 * @param {MbBookNote} note 
 * @returns {MbBookNote[]}
 */
function getAllDescendants(note) {
  let descendants = [];
  /**
   * 
   * @param {MbBookNote} currentnote 
   * @returns 
   */
  function traverse(currentnote) {
    if (!currentnote.childNotes) {
      return;
    }
    currentnote.childNotes.forEach(child => {
      descendants.push(child);
      traverse(child);
    });
  }

  traverse(note);

  return descendants;
}


// function removeTextAndHtmlComments() {
//   let focusNotes = getFocusNotes()
//   let notebookId = focusNotes[0].notebookId
//   focusNotes.forEach(note=>{
//     let textNoteIndex = []
//     note.comments.map((comment,index)=>{
//       if(comment.type === "TextNote" || comment.type === "HtmlNote"){
//         textNoteIndex.unshift(index)
//       }
//     })
//     UndoManager.sharedInstance().undoGrouping(
//       String(Date.now()),
//       notebookId,
//       ()=>{
//         UIPasteboard.generalPasteboard().string = note.noteTitle
//         note.noteTitle = ""
//         textNoteIndex.forEach(index=>{
//           note.removeCommentByIndex(index)
//         })
//       }
//     )
//   })
//   Application.sharedInstance().refreshAfterDBChanged(notebookId)
// }
function removeTextAndHtmlComments() {
  // 获取当前激活的窗口
  let focusWindow = Application.sharedInstance().focusWindow
  // 获取笔记本控制器
  let notebookController = Application.sharedInstance().studyController(focusWindow).notebookController
  // 获取当前聚焦的笔记
  let note = notebookController.focusNote
  // 获取当前笔记本id
  let notebookId = notebookController.notebookId
  UndoManager.sharedInstance().undoGrouping(
    String(Date.now()),
    notebookId,
    ()=>{
      let textNoteIndex = []
      note.comments.map((comment,index)=>{
        if(comment.type === "TextNote" || comment.type === "HtmlNote"){
          textNoteIndex.unshift(index)
        }
      })
      note.noteTitle = ""
      textNoteIndex.forEach(index=>{
        note.removeCommentByIndex(index)
      })
    }
  )
  Application.sharedInstance().refreshAfterDBChanged(notebookId)
}

/**
 * 
 * @param {MbBookNote} parent 
 * @param {String} title 
 * @param {Number} colorIndex
 */
function removeTextAndHtmlCommentsAndMerge() {
  // 获取当前激活的窗口
  let focusWindow = Application.sharedInstance().focusWindow
  // 获取笔记本控制器
  let notebookController = Application.sharedInstance().studyController(focusWindow).notebookController
  // 获取当前笔记本id
  let notebookId = notebookController.notebookId
  let focusNotes = getFocusNotes()
  focusNotes.forEach(
    note=>{
      let textNoteIndex = []
      note.comments.map((comment,index)=>{
        if(comment.type === "TextNote" || comment.type === "HtmlNote"){
          textNoteIndex.unshift(index)
        }
      })
      // 获取旧卡片的标题
      let oldtitle = note.noteTitle
      // 获取旧卡片的颜色
      let oldNoteColorIndex = note.colorIndex
      // 获取旧卡片的父卡片
      let parent = note.parentNote
      // 创建新兄弟卡片，标题为旧卡片的标题
      newNote = creatNote(oldtitle, "", oldNoteColorIndex)
      parent.addChild(newNote)
      // 清除旧卡片的标题
      note.noteTitle = ""
      // 清除评论中非摘录部分
      textNoteIndex.forEach(index=>{
        note.removeCommentByIndex(index)
      })
      // 将旧卡片合并到新卡片中
      newNote.merge(note)
    }
  )
  Application.sharedInstance().refreshAfterDBChanged(notebookId)
}

/**
 * 
 * @param {MbBookNote|MbBookNote[]} note 
 * @param {Number} colorIndex
 * @returns {MbBookNote[]}
 */
function getAllLastDescendants(note, colorIndex = undefined) {
  let descendants = []
  if (Array.isArray(note)) {
    // showHUD("is array")
    note.forEach(n=>{
      let test = getAllDescendants(n)
      descendants = descendants.concat(test)
    })
    // showHUD("message"+descendants.length)
  }else{
    descendants = getAllDescendants(note)
  }
  let lastDescendants = descendants.filter(note=>{
    if (note.childNotes && note.childNotes.length) {
      return false
    }
    if (colorIndex !== undefined) {
      return note.colorIndex === colorIndex
    }
    return true
  })
  // showHUD("d:"+lastDescendants.length+":"+descendants.length)
  return lastDescendants;
}



// 需求：https://github.com/xkwxdyy/mnTextHandler/discussions/3
/**
 * 1. 复制卡片标题到剪切板
 * 2. 去掉卡片标题
 * 3. 生成卡片的兄弟卡片，标题为复制的内容
 * 4. 将旧卡片合并到新的兄弟卡片中
 */

/**
 * 
 * @param {MbBookNote} parent 
 * @param {String} title 
 * @param {Number} colorIndex
 */
function newBrotherNoteAndMerge() {
  // 获取当前激活的窗口
  let focusWindow = Application.sharedInstance().focusWindow
  // 获取笔记本控制器
  let notebookController = Application.sharedInstance().studyController(focusWindow).notebookController
  // 获取当前笔记本id
  let notebookId = notebookController.notebookId
  let focusNotes = getFocusNotes()
  focusNotes.forEach(
    note=>{
      // 获取旧卡片的标题
      let oldtitle = note.noteTitle
      // 获取旧卡片的颜色
      let oldNoteColorIndex = note.colorIndex
      // 获取旧卡片的父卡片
      let parent = note.parentNote
      // 创建新兄弟卡片，标题为旧卡片的标题
      newNote = creatNote(oldtitle, "", oldNoteColorIndex)
      parent.addChild(newNote)
      // 清除旧卡片的标题
      note.noteTitle = ""
      // 将旧卡片合并到新卡片中
      newNote.merge(note)
    }
  )
  Application.sharedInstance().refreshAfterDBChanged(notebookId)
}

function creatNote(title, content, color) {
  try {
    let notebook = currentNotebook()
    let note = Note.createWithTitleNotebookDocument(title, notebook, currentDocController().document)
    // if (content) {
      // try {
      //   note.appendMarkdownComment(content)
      // } catch (error) {
        note.appendTextComment(content)
      // }
    // }
    note.colorIndex = color
    return note
    } catch (error) {
    showHUD(error)
  }
}


// 批量删除最后层级的黄色卡片中的“模版：”
/**
 * @param {Number} colorIndex
 */
function deleteSpecialCommentOfLastLightYellowNote(comment = "模版：") {
  // 获取当前激活的窗口
  let focusWindow = Application.sharedInstance().focusWindow
  // 获取笔记本控制器
  let notebookController = Application.sharedInstance().studyController(focusWindow).notebookController
  // 获取当前聚焦的笔记
  let focusNotes = getFocusNotes()
  // 获取当前笔记本id
  let notebookId = notebookController.notebookId

  for (note of focusNotes) {
    // 如果 note 没有子卡片
    if (!note.childNotes || note.childNotes.length === 0) {
      // 检测 note 是不是浅黄色卡片
      if (note.colorIndex === 0) {
        let index = getCommentIndex(note, comment)
        if (index !== -1) {
          note.removeCommentByIndex(index)
        }
        continue
      }
    } else {
      // 如果 note 有子卡片
      let ifExistChildNoteIsLightYellow = false
      for (childNote of note.childNotes) {
        if (childNote.colorIndex === 0) {
          // 如果存在子卡片是浅黄色，则不处理 note
          ifExistChildNoteIsLightYellow = true
        }
      }
      if (ifExistChildNoteIsLightYellow) {
        continue
      } else {
        let index = getCommentIndex(note, comment)
        if (index !== -1) {
          note.removeCommentByIndex(index)
        }
      }
    }
  }
  // 更新数据库后刷新界面
  Application.sharedInstance().refreshAfterDBChanged(notebookId)
}


// 克隆卡片为自身的子卡片（只能复制标题）
/**
 * @param {Number} colorIndex
 */
function cloneNoteSelf() {
  // 获取当前激活的窗口
  let focusWindow = Application.sharedInstance().focusWindow
  // 获取笔记本控制器
  let notebookController = Application.sharedInstance().studyController(focusWindow).notebookController
  // 获取当前聚焦的笔记
  let focusNotes = getFocusNotes()
  // 获取当前笔记本id
  let notebookId = notebookController.notebookId

  for (note of focusNotes) {
    // 获取旧卡片的标题
    let oldtitle = note.noteTitle
    // 获取旧卡片的颜色
    let oldNoteColorIndex = note.colorIndex
    // 创建新卡片，标题为旧卡片的标题
    newNote = creatNote(oldtitle, "", oldNoteColorIndex)
    note.addChild(newNote)
  }
  // 更新数据库后刷新界面
  Application.sharedInstance().refreshAfterDBChanged(notebookId)
}


// 固定卡片添加某卡片的克隆作为子卡片并可以添加标题
function cloneNoteAsChild(parentNoteId,targetNoteId,title, prefix="") {
  // 获取当前激活的窗口
  let focusWindow = Application.sharedInstance().focusWindow
  // 获取笔记本控制器
  let notebookController = Application.sharedInstance().studyController(focusWindow).notebookController
  // 获取当前笔记本id
  let notebookId = notebookController.notebookId
  // 获取父卡片
  let parentNote  = getNoteById(parentNoteId)
  // 获取目标卡片
  let clonedNoteId = cloneNote(targetNoteId)
  let clonedNote = getNoteById(clonedNoteId)
  if (prefix) {
    clonedNote.noteTitle = prefix + title
  } else {
    clonedNote.noteTitle = title
  }
  // 对目标卡片的子卡片的进行处理
  let descendants = getAllDescendants(clonedNote)
  if (descendants.length) {
    for (descendant of descendants) {
      let oldTitle = descendant.noteTitle
      let newTitle = oldTitle.replace(/标题/g, title)
      descendant.noteTitle = newTitle
    }
  }
  parentNote.addChild(clonedNote)
  // 在小窗定位卡片
  // 更新数据库后刷新界面
  Application.sharedInstance().refreshAfterDBChanged(notebookId)
}