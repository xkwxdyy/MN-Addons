/** @return {snipasteController} */
const getSnipasteController = ()=>self

var snipasteController = JSB.defineClass('snipasteController : UIViewController <UIWebViewDelegate>', {
  viewDidLoad: function() {
    let self = getSnipasteController()
    self.appInstance = Application.sharedInstance();
    self.init()
    self.custom = false;
    self.customMode = "None"
    self.mode = "None"
    self.dynamic = true;
    self.miniMode = false;
    self.isLoading = false;
    self.lastFrame = self.view.frame;
    self.currentFrame = self.view.frame
    self.moveDate = Date.now()

    // >>> DeepL view >>>
    self.webview = new UIWebView(self.view.bounds);
    // NSUserDefaults.standardUserDefaults().setObjectForKey('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15',"UserAgent")

    self.webview.backgroundColor = UIColor.clearColor()
    self.webview.scalesPageToFit = true;
    self.webview.autoresizingMask = (1 << 1 | 1 << 4);
    self.webview.delegate = self;
    // self.webview.setValueForKey("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15","User-Agent")
    self.webview.scrollView.delegate = self;
    self.webview.layer.cornerRadius = 15;
    self.webview.layer.masksToBounds = true;

    // >>> DeepL langauge button >>>
    // self.webview.lanButton = UIButton.buttonWithType(0);
    // <<< DeepL langauge button <<<
    self.webview.hidden = true;
    self.webview.lastOffset = 0;
    self.view.addSubview(self.webview);
    // <<< DeepL view <<<

// >>> opacity button >>>
    // self.webAppButton.titleLabel.font = UIFont.systemFontOfSize(12);
    // <<< opacity button <<<
    // >>> close button >>>
    self.closeButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.closeButton,"closeButtonTapped:")
    self.closeButton.setTitleForState('✖️', 0);
    self.closeButton.titleLabel.font = UIFont.systemFontOfSize(10);
    // <<< close button <<<
    // >>> max button >>>
    self.maxButton = self.createButton("maxButtonTapped:")
    self.maxButton.setTitleForState('➕', 0);
    self.maxButton.titleLabel.font = UIFont.systemFontOfSize(10);
    // <<< max button <<<

    // >>> min button >>>
    self.minButton = self.createButton("minButtonTapped:")
    self.minButton.setTitleForState('➖', 0);
    self.minButton.titleLabel.font = UIFont.systemFontOfSize(10);
    // <<< min button <<<

    // >>> screen button >>>
    self.screenButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.screenButton,"changeScreen:")
    self.screenButton.setImageForState(self.screenImage,0)
    // <<< screen button <<<
    // >>> search button >>>
    self.searchButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.searchButton,"searchButtonTapped:")
    self.searchButton.setImageForState(self.snipasteImage,0)

    self.locButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.locButton,"locButtonTapped:")
    self.locButton.setImageForState(self.locImage,0)

    self.linkButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.linkButton,"linkButtonTapped:")
    self.linkButton.setImageForState(self.linkImage,0)

    // self.searchButton.setTitleForState('🔍', 0);
    // <<< search button <<<
    // >>> move button >>>
    // self.moveButton = UIButton.buttonWithType(0);
    self.moveButton = self.createButton("moveButtonTapped:")
    self.setButtonLayout(self.moveButton)
    // <<< move button <<<
    // >>> goForward button >>>
    self.goForwardButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.goForwardButton,"goForwardButtonTapped:")
    self.goForwardButton.setImageForState(self.goforwardImage,0)
    // <<< goForward button <<<
      // >>> goBack button >>>
    self.goBackButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.goBackButton,"goBackButtonTapped:")
    self.goBackButton.setImageForState(self.gobackImage,0)
    // <<< goBack button <<<

    self.firstPageButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.firstPageButton,"firstPageButtonTapped:")
    self.firstPageButton.setImageForState(self.firstPageImage,0)

    self.prevPageButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.prevPageButton,"prevPageButtonTapped:")
    self.prevPageButton.setImageForState(self.prevPageImage,0)

    self.nextPageButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.nextPageButton,"nextPageButtonTapped:")
    self.nextPageButton.setImageForState(self.nextPageImage,0)

    self.lastPageButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.lastPageButton,"lastPageButtonTapped:")
    self.lastPageButton.setImageForState(self.lastPageImage,0)

    self.pageIndexButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.pageIndexButton,"choosePageIndex:")

    self.moveGesture = new UIPanGestureRecognizer(self,"onMoveGesture:")
    self.moveButton.addGestureRecognizer(self.moveGesture)
    self.moveGesture.view.hidden = false
    self.moveGesture.addTargetAction(self,"onMoveGesture:")

    self.resizeGesture = new UIPanGestureRecognizer(self,"onResizeGesture:")
    self.screenButton.addGestureRecognizer(self.resizeGesture)
    self.resizeGesture.view.hidden = false
    self.resizeGesture.addTargetAction(self,"onResizeGesture:")
  },
  viewWillAppear: function(animated) {
    self.webview.delegate = self;
  },
  viewWillDisappear: function(animated) {

    self.webview.stopLoading();
    self.webview.delegate = null;
    UIApplication.sharedApplication().networkActivityIndicatorVisible = false;
  },
viewWillLayoutSubviews: function() {
    if (self.miniMode) {
      // self.webview.hidden = true
      return
    }

    var viewFrame = self.view.bounds;
    var xLeft     = viewFrame.x
    var xRight    = xLeft + viewFrame.width
    var yTop      = viewFrame.y
    var yBottom   = yTop + viewFrame.height
    self.closeButton.frame = {x: xRight-19,y: yTop,width: 19,height: 19};
    self.maxButton.frame   = {x: xRight-43,y: yTop,width: 19,height: 19};
    self.minButton.frame   = {x: xRight-67,y: yTop,width: 19,height: 19};
    self.firstPageButton.frame = {x: xRight- 35,y: yBottom - 205,width: 30,height: 30};
    self.prevPageButton.frame = {x: xRight- 35,y: yBottom - 170,width: 30,height: 30};
    self.pageIndexButton.frame = {x: xRight- 35,y: yBottom - 135,width: 30,height: 30};
    self.nextPageButton.frame = {x: xRight- 35,y: yBottom - 100,width: 30,height: 30};
    self.lastPageButton.frame = {x: xRight- 35,y: yBottom - 65,width: 30,height: 30};
    self.firstPageButton.hidden = self.mode !== "pdf"
    self.prevPageButton.hidden = self.mode !== "pdf"
    self.nextPageButton.hidden = self.mode !== "pdf"
    self.lastPageButton.hidden = self.mode !== "pdf"
    self.pageIndexButton.hidden = self.mode !== "pdf"
    self.locButton.hidden = (self.mode !== "pdf") && (self.mode !== "note") && !self.docMd5
    self.linkButton.hidden = (self.mode !== "note")
    self.screenButton.frame = {x: xRight - 35,y: yBottom - 30,width: 30,height: 25};
    self.moveButton.frame = {  x: xRight*0.5-75,  y: yTop,  width: 150,  height: 18};
    self.searchButton.frame = {  x: xRight - 70,  y: yBottom - 30,  width: 30,  height: 25}
    self.locButton.frame = {  x: xRight - 105,  y: yBottom - 30,  width: 30,  height: 25,}
    self.linkButton.frame = {  x: xRight - 140,  y: yBottom - 30,  width: 30,  height: 25,}

    self.goBackButton.frame = {  x: xLeft+6,  y: yBottom - 30,  width: 30,  height: 25,};
    self.goForwardButton.frame = {  x: xLeft+41,  y: yBottom - 30,  width: 30,  height: 25,};
    self.webview.frame = {x:xLeft,y:yTop+8,width:viewFrame.width,height:viewFrame.height-8}
  },
  scrollViewDidScroll: function() {
  },
  webViewDidStartLoad: function(webView) {
  },
  webViewDidFinishLoad: function(webView) {
    let currentURL = webView.request.URL().absoluteString()
    self.goBackButton.hidden = !webView.canGoBack
    self.goForwardButton.hidden = !webView.canGoForward
    if (self.focusNoteId) {
      self.locButton.hidden = false
      self.linkButton.hidden = false
    }else{
      if (self.docMd5) {
        self.locButton.hidden = false
      }else{
        self.locButton.hidden = true
      }
      self.linkButton.hidden = true
    }
    // if (!self.htmlMode) {
    //   return
    // }
    webView.evaluateJavaScript(`
      document.getElementsByClassName("body")[0].offsetHeight
    `,ret=>{
      if (ret !== NSNull.new()) {
        let viewFrame = self.view.frame
        let windowHeight = MNUtil.studyView.bounds.height
        if (viewFrame.y+parseFloat(ret)+40 >= windowHeight) {
          viewFrame.height = windowHeight-viewFrame.y
        }else{
          viewFrame.height = parseFloat(ret)+40
        }
        self.view.frame = viewFrame
        self.currentFrame = viewFrame

        if (self.view.hidden) {
          self.show()
        }
      }
    })
  },
  webViewDidFailLoadWithError: function(webView, error) {
  },
  webViewShouldStartLoadWithRequestNavigationType: function(webView,request,type){
    let currentURL = webView.request.URL().absoluteString()
    let requestURL = request.URL().absoluteString()
    if (/^https?:\/\//.test(requestURL)) {
      MNUtil.confirm("Open URL", requestURL).then((confirm)=>{
        if (confirm) {
          MNUtil.postNotification("openInBrowser", {url:requestURL})
        }
      
      })
      return false
    }
    if (/^marginnote\dapp/.test(requestURL)) {
      MNUtil.showHUD("Return to source...")
      MNUtil.openURL(requestURL)
      return false
    }
    if (/^snipaste:\/\/copyimage2childnote/.test(requestURL)) {
      let base64 = requestURL.split("?image=")[1]
      // MNUtil.copy(base64)
      let imageData = NSData.dataWithContentsOfURL(NSURL.URLWithString(base64))
      MNUtil.copyImage(imageData)
      let focusNote = MNNote.getFocusNote()
      let child = focusNote.createChildNote({title:""},true)
      MNUtil.showHUD("copyimage2childnote")
      MNUtil.delay(0.5).then(()=>{
        child.paste()
        child.focusInMindMap()
      })
      return false
    }
    if (/^snipaste:\/\/copyimage/.test(requestURL)) {
      let base64 = requestURL.split("?image=")[1]
      // MNUtil.copy(base64)
      let imageData = NSData.dataWithContentsOfURL(NSURL.URLWithString(base64))
      MNUtil.showHUD("copyimage")
      MNUtil.copyImage(imageData)
      return false
    }

    if (/^snipaste:\/\//.test(requestURL)) {
      let noteid = requestURL.split("snipaste://")[1]
      let note = MNNote.new(noteid)
      self.snipasteNote(note)
      return false
    }
    if (/^snipasteaction/.test(requestURL)) {
      // let action = requestURL.split("://")[1]
      // let actionArg = action.split("?text=")
      // if (actionArg[0] === "copy") {
        MNUtil.showHUD("已复制")
        
      // }
      // Application.sharedInstance().openURL(NSURL.URLWithString(requestURL));
      return false
    }
    return true;
  },
  changeScreen: function(button) {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    // MNUtil.copy(self.history)
    let menu = new Menu(button,self)
    menu.width = 250
    menu.rowHeight = 35
    menu.preferredPosition = 0
    menu.addMenuItem('🌗  Left', 'leftButtonTapped:', 'left', self.customMode==="left")
    menu.addMenuItem('🌘  Left 1/3', 'left13ButtonTapped:', 'left', self.customMode==="left13")
    menu.addMenuItem('🌓  Right', 'rightButtonTapped:', 'right', self.customMode==="right")
    menu.addMenuItem('🌒  Right 1/3', 'right13ButtonTapped:', 'right', self.customMode==="right13")
    menu.addMenuItem('📋  From Clipboard', 'snipasteFromClipboard:')
    menu.addMenuItem("📄  PDF (Current Page)", "snipasteFromPDF:","Current")
    menu.addMenuItem("📄  PDF (First Page)", "snipasteFromPDF:","First")
    menu.addMenuItem("📄  PDF (Last Page)", "snipasteFromPDF:","Last")
    menu.addMenuItem('🫧  Opacity', 'changeOpacity:', button)
    menu.addMenuItem('📤  Export', 'export:')
    menu.addMenuItem('🎬  Screenshot', 'screenshot:', self.view.frame.width>1000?self.view.frame.width:1000)
    menu.addMenuItem('🎬  Screenshot ➡️ ChildNote', 'screenshot2ChildNote:', self.view.frame.width>1000?self.view.frame.width:1000)
    menu.addMenuItem('🌐  HTML ➡️ ChildNote', 'html2ChildNote:')
    menu.addMenuItem('🌐  HTML ➡️ Clipboard', 'html2Clipboard:')
    menu.addMenuItem('🌐  Edit HTML', 'editHTML:')
    menu.show()
  },
  screenshot: async function (width) {
    Menu.dismissCurrentMenu()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    MNUtil.showHUD("screenshot")
    self.runJavaScript(`
           // 动态加载脚本的函数
        function loadScript( callback) {
            let url = 'https://vip.123pan.cn/1836303614/dl/cdn/html2canvas.js'
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;

            // 监听脚本加载完成事件 (现代浏览器)
            script.onload = () => {
                console.log(url + ' 加载成功');
                if (callback) {
                    callback();
                }
            };

            // 兼容旧版 IE
            script.onreadystatechange = () => {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null; // 避免重复执行
                    console.log(url + ' 加载成功 (IE)');
                    if (callback) {
                        callback();
                    }
                }
            };

            // 监听脚本加载失败事件
            script.onerror = () => {
                console.error(url + ' 加载失败');
            };

            document.head.appendChild(script); // 或者 document.body.appendChild(script);
        }

        // 截图函数
        function captureScreenshot() {
            // 检查 html2canvas 是否已加载
            if (typeof html2canvas === 'undefined') {
                window.location.href = 'snipaste://showhud?message=库尚未加载完成，请稍后再试'
                return;
            }

            console.log('开始截图...');

            // 使用 html2canvas 截取整个 body
            // 你可以根据需要调整截图的配置参数
            html2canvas(document.body, {
                scale: 3,
                allowTaint: true, // 允许跨域图片，但可能会污染 canvas
                useCORS: true,    // 尝试使用 CORS 加载图片，避免污染
                scrollY: -window.scrollY, // 确保从页面顶部开始截图
                windowWidth: document.documentElement.scrollWidth, // 使用完整的文档宽度
                windowHeight: document.documentElement.scrollHeight // 使用完整的文档高度
            }).then(canvas => {
                console.log('截图完成！');
                // 将 canvas 转换为图片
                const image = canvas.toDataURL('image/png'); // 也可以是 'image/jpeg'
                window.location.href = 'snipaste://copyimage?image='+image
            }).catch(error => {
                console.error('截图失败:', error);
            });
        }


        // 检查 html2canvas 是否已定义，如果未定义则加载
        if (typeof html2canvas === 'undefined') {
            console.log('html2canvas 未加载，正在动态加载...');
            loadScript( () => {
                // 加载完成后执行截图
                captureScreenshot();
            });
        } else {
            console.log('html2canvas 已加载，直接执行截图。');
            // 如果已加载，则直接执行截图
            captureScreenshot();
        }
    `)

    // let imageData = await snipasteUtils.screenshot(self.webview,width)
    // MNUtil.copyImage(imageData)
    // MNUtil.showHUD('截图已复制到剪贴板')
  },

  html2ChildNote: async function (params) {
    Menu.dismissCurrentMenu()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    let html = self.currentHTMLString
    if (!html) {
      MNUtil.showHUD("❌ Unavailable")
      return
    }
    let focusNote = MNNote.getFocusNote()
    let htmlSizeString = await self.runJavaScript(`
    function getFullDocumentSize() {
  // 兼容标准模式和怪异模式
  const body = document.body;
  const html = document.documentElement;
  // 计算最大宽度
  const width = Math.max(
    body.scrollWidth, html.scrollWidth,
    body.offsetWidth, html.offsetWidth,
    html.clientWidth
  );
  // 计算最大高度
  //const height = Math.max(
  //  body.scrollHeight, html.scrollHeight,
  //  body.offsetHeight, html.offsetHeight,
  //  html.clientHeight
  //);
  const height = body.scrollHeight
  return { width:width, height:height };
}
getFullDocumentSize()
    `)
    let htmlSize = JSON.parse(htmlSizeString)
    MNUtil.undoGrouping(()=>{
      let child = focusNote.createChildNote({title:""})
      child.appendHtmlComment(html, html, htmlSize, "")
      child.focusInMindMap()
    })
  },
  html2Clipboard: async function (params) {
    Menu.dismissCurrentMenu()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    let html = self.currentHTMLString
    if (!html) {
      MNUtil.showHUD("❌ Unavailable")
      return
    }
    MNUtil.copy(html)
  },
  editHTML: async function (params) {
    Menu.dismissCurrentMenu()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    MNUtil.showHUD("Open in Monaco")
    MNUtil.postNotification("openInMonaco", {html:self.currentHTMLString})
  },
  screenshot2ChildNote: async function (width) {
    Menu.dismissCurrentMenu()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    self.runJavaScript(`
           // 动态加载脚本的函数
        function loadScript( callback) {
            let url = 'https://vip.123pan.cn/1836303614/dl/cdn/html2canvas.js'
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = url;

            // 监听脚本加载完成事件 (现代浏览器)
            script.onload = () => {
                console.log(url + ' 加载成功');
                if (callback) {
                    callback();
                }
            };

            // 兼容旧版 IE
            script.onreadystatechange = () => {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null; // 避免重复执行
                    console.log(url + ' 加载成功 (IE)');
                    if (callback) {
                        callback();
                    }
                }
            };

            // 监听脚本加载失败事件
            script.onerror = () => {
                console.error(url + ' 加载失败');
            };

            document.head.appendChild(script); // 或者 document.body.appendChild(script);
        }

        // 截图函数
        function captureScreenshot() {
            // 检查 html2canvas 是否已加载
            if (typeof html2canvas === 'undefined') {
                window.location.href = 'snipaste://showhud?message=库尚未加载完成，请稍后再试'
                return;
            }

            console.log('开始截图...');

            // 使用 html2canvas 截取整个 body
            // 你可以根据需要调整截图的配置参数
            html2canvas(document.body, {
                scale: 3,
                allowTaint: true, // 允许跨域图片，但可能会污染 canvas
                useCORS: true,    // 尝试使用 CORS 加载图片，避免污染
                scrollY: -window.scrollY, // 确保从页面顶部开始截图
                windowWidth: document.documentElement.scrollWidth, // 使用完整的文档宽度
                windowHeight: document.documentElement.scrollHeight // 使用完整的文档高度
            }).then(canvas => {
                console.log('截图完成！');
                // 将 canvas 转换为图片
                const image = canvas.toDataURL('image/png'); // 也可以是 'image/jpeg'
                window.location.href = 'snipaste://copyimage2childnote?image='+image
            }).catch(error => {
                console.error('截图失败:', error);
            });
        }


        // 检查 html2canvas 是否已定义，如果未定义则加载
        if (typeof html2canvas === 'undefined') {
            console.log('html2canvas 未加载，正在动态加载...');
            loadScript( () => {
                // 加载完成后执行截图
                captureScreenshot();
            });
        } else {
            console.log('html2canvas 已加载，直接执行截图。');
            // 如果已加载，则直接执行截图
            captureScreenshot();
        }
    `)
    // let imageData = await snipasteUtils.screenshot(self.webview,width)
    // MNUtil.copyImage(imageData)
    // let focusNote = MNNote.getFocusNote()
    // let child = focusNote.createChildNote({title:""})
    // await MNUtil.delay(0.5)
    // child.paste()
    // child.focusInMindMap()
  },
  export: async function (width) {
    Menu.dismissCurrentMenu()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    if (self.currentHTMLString) {
      MNUtil.writeText(MNUtil.tempFolder+"/export.html", self.currentHTMLString)
      MNUtil.saveFile(MNUtil.tempFolder+"/export.html", ["public.html"])
    }else{
      let imageData = await snipasteUtils.screenshot(self.webview,width)
      snipasteUtils.exportFile(imageData, "image.png", "public.png")
    }
  },
  changeOpacity: function(sender) {
    Menu.dismissCurrentMenu()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    var menuController = MenuController.new();
    menuController.commandTable = [
      {title:'100%',object:self,selector:'changeOpacityTo:',param:1.0},
      {title:'90%',object:self,selector:'changeOpacityTo:',param:0.9},
      {title:'80%',object:self,selector:'changeOpacityTo:',param:0.8},
      {title:'70%',object:self,selector:'changeOpacityTo:',param:0.7},
      {title:'60%',object:self,selector:'changeOpacityTo:',param:0.6},
      {title:'50%',object:self,selector:'changeOpacityTo:',param:0.5}
    ];
    menuController.rowHeight = 35;
    menuController.preferredContentSize = {
      width: 100,
      height: menuController.rowHeight * menuController.commandTable.length
    };
    var studyController = Application.sharedInstance().studyController(self.view.window);
    self.view.popoverController = new UIPopoverController(menuController);
    var r = sender.convertRectToView(sender.bounds,studyController.view);
    self.view.popoverController.presentPopoverFromRect(r, studyController.view, 1 << 1, true);
  },
  changeOpacityTo:function (opacity) {
    Menu.dismissCurrentMenu()
    self.view.layer.opacity = opacity
    // self.webAppButton.setTitleForState(`${opacity*100}%`, 0);
  },
  snipasteFromClipboard:function (opacity) {
    let self = getSnipasteController()
    Menu.dismissCurrentMenu()
    self.snipasteFromClipboard()
  },
  searchButtonTapped: function() {
    let self = getSnipasteController()
    self.focusNoteId = undefined
    self.docMd5 = undefined
    self.pageIndex = undefined
    let selection = MNUtil.currentSelection
    if (selection.onSelection && !selection.isText) {
      //优先选择图片
      self.focusNoteId = undefined
      self.docMd5 = selection.docMd5
      self.pageIndex = selection.pageIndex
      let imageData = selection.image
      let image = UIImage.imageWithData(imageData)
      let wholeFrame = MNUtil.currentWindow.bounds
      // let rotateImage = UIImage.imageWithCGImageScaleOrientation(image.CGImage,1.5,UIImage.orientation)
      // rotateImage.imageOrientation = 1
      // let rotateImageData = rotateImage.pngData()
      let imageSize = image.size
      let widthScale = wholeFrame.width/imageSize.width*0.5
      let heightScale = wholeFrame.height/imageSize.height*0.5
      let scale = Math.min(widthScale,heightScale)
      if (scale > 1) {
        scale = 1
      }
      let viewFrame = self.view.frame
      self.view.frame = {x:viewFrame.x,y:viewFrame.y,width:imageSize.width*scale,height:imageSize.height*scale}
      self.currentFrame = {x:viewFrame.x,y:viewFrame.y,width:imageSize.width*scale,height:imageSize.height*scale}
      // style="transform:rotate(7deg)"
      self.htmlMode = false
      self.snipasteFromImage(imageData)
      // self.webview.loadHTMLStringBaseURL(`
      // self.webview.loadHTMLStringBaseURL(`<a href="marginnote3app://note/C08E37FD-AC36-42BB-A8AB-739296E62F23">test</a>`)
      self.view.hidden = false
      self.webview.hidden = false
      return
    }
    let focusNote = MNNote.getFocusNote()
    if (focusNote) {
      if (focusNote.excerptPic && !focusNote.noteTitle && !focusNote.comments.length) {
        let imageData = MNUtil.getMediaByHash(focusNote.excerptPic.paint)
        self.focusNoteId = focusNote.noteId
        self.snipasteFromImage(imageData)
      }else{//摘录中无图片，直接贴卡片
        self.snipasteNote(focusNote)
        return
      }
    }else{//即没有imageData，也没有focusNote，直接返回
      MNUtil.showHUD("No image or note selected")
      return
    }
  },
  locButtonTapped: async function() {
    let self = getSnipasteController()
    if (self.focusNoteId) {
      if (!MNUtil.currentNotebookId) {
        MNUtil.showHUD("Not in notebook")
        return
      }
      let docMapSplitMode = MNUtil.studyController.docMapSplitMode
      let focusNote = MNNote.new(self.focusNoteId)
      if (focusNote.notebookId === MNUtil.currentNotebookId) {
        switch (docMapSplitMode) {
          case 0:
            focusNote.focusInMindMap()
            break;
          case 1:
            focusNote.focusInMindMap()
            focusNote.focusInDocument()
            break;
          case 2:
            focusNote.focusInDocument()
            break;
          default:
            break;
        }
      }else{
        focusNote.focusInFloatMindMap()
        // switch (docMapSplitMode) {
        //   case 1:
        //     focusNote.focusInDocument()
        //     break;
        //   case 2:
        //     focusNote.focusInDocument()
        //     break;
        //   default:
        //     break;
        // }
      }
    }
    if (self.docMd5) {
      // MNUtil.showHUD(self.docMd5)
      if (self.docMd5 !== MNUtil.currentDocMd5) {
        MNUtil.openDoc(self.docMd5)
        await MNUtil.delay(0.01)
      }
      let docController = MNUtil.currentDocController
      if (docController.currPageIndex !== self.pageIndex) {
        // MNUtil.showHUD("message"+self.pageIndex)
        docController.setPageAtIndex(self.pageIndex)
      }


    }
  },
  linkButtonTapped: function (params) {
    if (!self.focusNoteId) {
      MNUtil.showHUD("Unavailable")
    }
    try {
    let pasteNote  = MNNote.new(self.focusNoteId)
    let focusNote
    let docMapSplitMode = MNUtil.docMapSplitMode
    if (docMapSplitMode===0) {
      focusNote = MNUtil.notebookController.focusNote
    }else{
      focusNote = MNUtil.currentDocController.focusNote
      if (!focusNote) {
        focusNote = MNUtil.notebookController.focusNote
      }
    }
    MNUtil.undoGrouping(()=>{
      pasteNote.appendNoteLink(focusNote)
      focusNote.appendNoteLink(pasteNote)
    })
    
    } catch (error) {
      snipasteUtils.addErrorLog(error, "linkButtonTapped")
    }
  },

  snipasteFromPDF:function (target) {
    let self = getSnipasteController()
        Menu.dismissCurrentMenu()
        let docController = MNUtil.currentDocController
        self.docController = docController
        if (target === "Current") {
          self.pageIndex = docController.currPageIndex
          // MNUtil.showHUD("PageIndex: "+self.pageIndex)
          self.snipastePDF(docController.docMd5,docController.currPageNo)
        }else if (target === "First") {
          self.pageIndex = 0
          let pageNo = docController.pageNoFromIndex(0)
          self.snipastePDF(docController.docMd5,pageNo)
        }else if (target === "Last") {
          let pageNo = docController.document.pageCount
          self.pageIndex = docController.indexFromPageNo(pageNo)
          // MNUtil.showHUD("PageIndex: "+self.pageIndex)
          // let tem = {pageNo:pageNo,pageIndex:self.pageIndex,newPageNo:docController.pageNoFromIndex(self.pageIndex),pageIndices:docController.indicesFromPageNo(docController.currPageNo)}
          // MNUtil.copy(tem)
          self.snipastePDF(docController.docMd5,pageNo)
        }
  },
  goBackButtonTapped: function() {
    self.webview.goBack();
  },
  goForwardButtonTapped: function() {
    self.webview.goForward();
  },
  closeButtonTapped: function() {
    self.hide()
    // self.view.hidden = true;
    },
  leftButtonTapped: function() {
    Menu.dismissCurrentMenu()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}

    // self.view.popoverController.dismissPopoverAnimated(true);
    self.lastFrame = self.view.frame
    let studyFrame = MNUtil.studyView.bounds
    let height = studyFrame.height;
    let splitLine = MNUtil.splitLine()
    self.view.frame = {x:40,y:50,width:splitLine-40,height:height-50}
    self.custom = true;
    self.customMode = "left"
    self.dynamic = false;
    self.webview.hidden = false
    self.moveButton.hidden = false
    self.maxButton.hidden = false
    self.minButton.hidden = false
    self.closeButton.hidden = false
  },
  left13ButtonTapped: function() {
    Menu.dismissCurrentMenu()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    self.customMode = "left13"
    self.dynamic = false;
    self.lastFrame = self.view.frame

    // self.view.popoverController.dismissPopoverAnimated(true);
    let studyFrame = Application.sharedInstance().studyController(this.window).view.bounds
    let height = studyFrame.height;
    self.view.frame = {x:40,y:60,width:studyFrame.width/3.+40,height:height-60}
    self.custom = true;
    self.webview.hidden = false
    self.moveButton.hidden = false
    self.maxButton.hidden = false
    self.minButton.hidden = false
    self.closeButton.hidden = false
  },
  rightButtonTapped: function() {
    Menu.dismissCurrentMenu()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    self.customMode = "right"
    self.dynamic = false;
    self.lastFrame = self.view.frame
    // self.view.popoverController.dismissPopoverAnimated(true);
    let studyFrame = Application.sharedInstance().studyController(this.window).view.bounds
    let height = studyFrame.height;
    let splitLine = getSplitLine()
    self.view.frame = {x:splitLine,y:50,width:studyFrame.width-splitLine-40,height:height-50}
    self.custom = true;
    self.webview.hidden = false
    self.moveButton.hidden = false
    self.maxButton.hidden = false
    self.minButton.hidden = false
    self.closeButton.hidden = false
  },
  right13ButtonTapped: function() {
    Menu.dismissCurrentMenu()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    self.custom = true;
    self.customMode = "right13"
    self.dynamic = false;
    self.lastFrame = self.view.frame
    // self.view.popoverController.dismissPopoverAnimated(true);
    let studyFrame = Application.sharedInstance().studyController(this.window).view.bounds
    let height = studyFrame.height;
    let splitLine = getSplitLine()
    self.view.frame = {x:splitLine,y:50,width:studyFrame.width-splitLine-40,height:height-50}
    self.webview.hidden = false
    self.moveButton.hidden = false
    self.maxButton.hidden = false
    self.minButton.hidden = false
    self.closeButton.hidden = false
  },

  maxButtonTapped: function() {
    if (self.customMode === "full") {
      self.customMode = "none"
      self.custom = false;
      self.view.frame = self.lastFrame
      return
    }
    const frame = MNUtil.currentWindow.bounds
    self.lastFrame = self.view.frame
    self.view.frame = {x:40,y:50,width:frame.width-80,height:frame.height-70}
    self.customMode = "full"
    self.custom = true;
    self.dynamic = false;
    self.webview.hidden = false
  },
  moveButtonTapped: function() {
    let self = getSnipasteController()
    if (self.miniMode) {
      let preFrame = self.view.frame
      self.view.hidden = true
      self.showAllButton()
      let studyFrame = MNUtil.currentWindow.bounds
      // if (self.view.frame.x < studyFrame.width*0.5) {
      //   self.lastFrame.x = 0
      // }else{
      //   self.lastFrame.x = studyFrame.width-self.lastFrame.width
      // }
      if (self.lastFrame.x < 0) {
        self.lastFrame.x = 0
      }
      if (self.lastFrame.x+self.lastFrame.width > studyFrame.width) {
        self.lastFrame.x = studyFrame.width-self.lastFrame.width
      }
      self.setFrame(self.lastFrame)
      self.show(preFrame)
      self.miniMode = false
      return
    }
  },
  minButtonTapped: function() {
    self.miniMode = true
    let studyFrame = MNUtil.currentWindow.bounds
    let studyCenter = MNUtil.currentWindow.center.x
    let viewCenter = self.view.center.x
    if (viewCenter>studyCenter || (self.customMode === "full" && self.custom)) {
      self.toMinimode(MNUtil.genFrame(studyFrame.width-40,self.view.frame.y,40,40))
    }else{
      self.toMinimode(MNUtil.genFrame(0,self.view.frame.y,40,40))
    }
    self.customMode = "none"
    self.custom = false;
  },

  onMoveGesture:async function (gesture) {
    let self = getSnipasteController()
    let location = snipasteUtils.getNewLoc(gesture,MNUtil.currentWindow)
    self.dynamic = false;
    let locationToMN = location.toMN
    let xToMN = location.toMN.x
    let yToMN = location.toMN.y
    self.moveDate = Date.now()
    // let location = {x:locationToMN.x - self.locationToBrowser.x,y:locationToMN.y -self.locationToBrowser.y}
    let frame = self.view.frame
    let studyFrame = MNUtil.currentWindow.bounds
    let y = location.y
    let x = location.x
    if (!self.miniMode) {
      if (xToMN<40) {
        let targetFrame = MNUtil.genFrame(0, yToMN, 40, 40)
        self.toMinimode(targetFrame)
        return
      }
      if (xToMN>studyFrame.width-40) {
        let targetFrame = MNUtil.genFrame(studyFrame.width-40, frame.y, 40, 40)
        self.toMinimode(targetFrame)
        return
      }
    }else{
      if (xToMN<50) {
        self.view.frame = MNUtil.genFrame(0, yToMN-20, 40, 40)
        return
      }else if (xToMN>studyFrame.width-50) {
        self.view.frame = MNUtil.genFrame(studyFrame.width-40, yToMN-20, 40, 40)
        return
      }else if (xToMN>50) {
        let preOpacity = self.view.layer.opacity
        self.view.layer.opacity = 0
        self.moveButton.hidden = true
        self.closeButton.hidden = true
        self.maxButton.hidden = true
        self.minButton.hidden = true
        let targetFrame = MNUtil.genFrame(x, y, self.lastFrame.width, self.lastFrame.height)
        MNUtil.animate(()=>{
          self.view.frame = targetFrame
          self.view.layer.opacity = preOpacity
          self.currentFrame = self.view.frame
        }).then(()=>{
          self.moveButton.frame = MNUtil.genFrame(targetFrame.width*0.5-75, 0, 150, 18)
          self.moveButton.hidden = false
          self.view.layer.borderWidth = 0
          self.moveButton.setImageForState(undefined,0)
          self.view.hidden = false
          self.webview.hidden = false
          self.closeButton.hidden = false
          self.maxButton.hidden = false
          self.minButton.hidden = false
          self.screenButton.hidden = false
          self.searchButton.hidden = false
          self.goBackButton.hidden = true//!self.webview.canGoBack
          self.goForwardButton.hidden = true//!self.webview.canGoForward
          self.view.setNeedsLayout()
        })
        self.miniMode = false
        return
      }
    }
    
    if (self.custom) {

      self.customMode = "None"
      MNUtil.animate(()=>{
        self.view.frame = MNUtil.genFrame(x, y, self.lastFrame.width, self.lastFrame.height)
        self.currentFrame  = self.view.frame
      })

    }else{
      self.view.frame = MNUtil.genFrame(x, y, frame.width, frame.height)
      self.currentFrame  = self.view.frame
    }
    self.custom = false;
  },
  onResizeGesture:function (gesture) {
    self.custom = false;
    self.dynamic = false;
    let baseframe = gesture.view.frame
    let locationInView = gesture.locationInView(gesture.view)
    let frame = self.view.frame
    let width = locationInView.x+baseframe.x+baseframe.width*0.5
    let height = locationInView.y+baseframe.y+baseframe.height*0.5
    if (width <= 300) {
      width = 300
    }
    if (height <= 200) {
      height = 200
    }
    self.view.frame = {x:frame.x,y:frame.y,width:width,height:height}
    self.currentFrame  = self.view.frame
  },
  firstPageButtonTapped: function() {
    self.pageIndex = 0
    self.pageNo = self.pageNoFromIndex(self.pageIndex)
    // if (self.hasDocController()) {
    //   self.pageNo = self.docController.pageNoFromIndex(self.pageIndex)
    // }else{
    //   self.pageNo = 1
    // }
    if (self.pageNo > 20000) {
      MNUtil.showHUD("Unspported pageNo: "+self.pageNo)
      return
    }
    self.runJavaScript(`
      window.renderPageDev(${self.pageNo})
    `)
    self.pageIndexButton.setTitleForState(self.pageIndex+1,0)
    // self.snipastePDF(self.docMd5,self.pageIndex)
  },
  prevPageButtonTapped: function() {
    let prevPageIndex = self.pageIndex - 1
    let prevPageNo = self.pageNoFromIndex(prevPageIndex)

    // let prevPageNo = prevPageIndex+1
    // if (self.hasDocController()) {
    //   prevPageNo = self.docController.pageNoFromIndex(prevPageIndex)
    // }
    // let prevPageNo = self.docController.pageNoFromIndex(prevPageIndex)
    if (prevPageNo <= 0) {
      self.showHUD("Already at the first page")
      return
    }
    if (prevPageNo > 20000) {
      self.showHUD("Unspported pageNo: "+prevPageNo)
      return
    }
    self.pageIndex = prevPageIndex
    self.pageNo = prevPageNo
    self.runJavaScript(`
      window.renderPageDev(${self.pageNo})
    `)
    self.pageIndexButton.setTitleForState(self.pageIndex+1,0)
    // self.snipastePDF(self.docMd5,self.pageIndex)
  },
  nextPageButtonTapped: function() {
    let nextPageIndex = self.pageIndex + 1
    let nextPageNo = self.pageNoFromIndex(nextPageIndex)

    // let nextPageNo = nextPageIndex+1
    // if (self.hasDocController()) {
    //   nextPageNo = self.docController.pageNoFromIndex(nextPageIndex)
    // }
    // let nextPageNo = self.docController.pageNoFromIndex(nextPageIndex)
    if (nextPageNo > 20000) {
      self.showHUD("Unspported pageNo: "+nextPageNo)
      return
    }
    if (nextPageNo > self.pageCount) {
      self.showHUD("Already at the last page")
      return
    }
    self.pageIndex = nextPageIndex
    self.pageNo = nextPageNo

    self.runJavaScript(`
      window.renderPageDev(${self.pageNo})
    `)
    self.pageIndexButton.setTitleForState(self.pageIndex+1,0)
    // self.snipastePDF(self.docMd5,self.pageIndex)
  },
  lastPageButtonTapped: function() {
    let doc = MNUtil.getDocById(self.docMd5)
    self.pageIndex = doc.pageCount - 1
    if (self.hasDocController()) {
      self.pageNo = self.docController.pageNoFromIndex(self.pageIndex)
      self.pageIndex = self.docController.indexFromPageNo(self.pageNo)
    }else{
      self.pageNo = pageIndex+1
    }
    if (self.pageNo > 20000) {
      MNUtil.showHUD("Unspported pageNo: "+self.pageNo)
      return
    }
    self.runJavaScript(`
      window.renderPageDev(${self.pageNo})
    `)
    self.pageIndexButton.setTitleForState(self.pageIndex+1,0)
    // self.snipastePDF(self.docMd5,self.pageIndex)
  },
  choosePageIndex: function(button) {
    try {
    let menu = new Menu(button,self)
    let firstPage = 0
    let pageCount = self.pageCount
    let lastPage = self.pageCount
    // MNUtil.copy("object"+lastPage)
    if (self.hasDocController()) {
      pageCount = self.docController.document.pageCount
      lastPage = self.docController.indexFromPageNo(pageCount)
    }
    let selector = "setPageIndex:"
    // menu.addMenuItem("Current",selector)
    for (let i = firstPage; i <= lastPage; i++) {
      menu.addMenuItem("Page "+i,selector,i)
    }
    menu.preferredPosition = 0
    menu.show()
    return
    } catch (error) {
      snipasteUtils.addErrorLog(error, "choosePageIndex")
    }
  },
  setPageIndex: function(index) {
    Menu.dismissCurrentMenu()
    self.pageIndex = index
    self.pageNo = self.pageNoFromIndex(self.pageIndex)
    // if (self.hasDocController()) {
    //   self.pageNo = self.docController.pageNoFromIndex(self.pageIndex)
    // }else{
    //   self.pageNo = index+1
    // }
    self.runJavaScript(`
      window.renderPageDev(${self.pageNo})
    `)
    self.pageIndexButton.setTitleForState(index+1,0)
  }
});

/**
 * @this {snipasteController}
 */
snipasteController.prototype.init =function () {
  this.history = []
  this.homeImage = MNUtil.getImage(this.mainPath + `/home.png`,2)
  this.gobackImage = MNUtil.getImage(this.mainPath + `/goback.png`,2)
  this.goforwardImage = MNUtil.getImage(this.mainPath + `/goforward.png`,2)
  this.screenImage = MNUtil.getImage(this.mainPath + `/screen.png`,2)
  this.snipasteImage = MNUtil.getImage(this.mainPath + `/snipaste.png`,2)
  this.locImage = MNUtil.getImage(this.mainPath + `/loc.png`,2)
  this.linkImage = MNUtil.getImage(this.mainPath + `/link.png`,2)
  this.firstPageImage = MNUtil.getImage(this.mainPath + `/top.png`,2.1)
  this.prevPageImage = MNUtil.getImage(this.mainPath + `/up.png`,2.1)
  this.nextPageImage = MNUtil.getImage(this.mainPath + `/down.png`,2.1)
  this.lastPageImage = MNUtil.getImage(this.mainPath + `/bottom.png`,2.1)
  this.view.layer.shadowOffset = {width: 0, height: 0};
  this.view.layer.shadowRadius = 15;
  this.view.layer.shadowOpacity = 0.5;
  this.view.layer.shadowColor = UIColor.colorWithWhiteAlpha(0.5, 1);
  this.view.layer.opacity = 1.0
  this.view.layer.cornerRadius = 12;
  this.view.backgroundColor = UIColor.clearColor()
  this.highlightColor = UIColor.blendedColor(
    UIColor.colorWithHexString("#2c4d81").colorWithAlphaComponent(0.8),
    Application.sharedInstance().defaultTextColor,
    0.8
  );
}

/** @this {snipasteController} */
snipasteController.prototype.createButton = function (targetAction,superview) {
    let button = UIButton.buttonWithType(0);
    button.autoresizingMask = (1 << 0 | 1 << 3);
    button.setTitleColorForState(UIColor.whiteColor(),0);
    button.setTitleColorForState(this.highlightColor, 1);
    button.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
    button.layer.cornerRadius = 8;
    button.layer.masksToBounds = true;
    button.titleLabel.font = UIFont.systemFontOfSize(16);

    if (targetAction) {
      button.addTargetActionForControlEvents(this, targetAction, 1 << 6);
    }
    if (superview) {
      this[superview].addSubview(button)
    }else{
      this.view.addSubview(button);
    }
    return button
}

snipasteController.prototype.setButtonLayout = function (button,targetAction) {
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
/** @this {snipasteController} */
snipasteController.prototype.hideAllButton = function () {
  this.closeButton.hidden = true
  this.maxButton.hidden = true
  this.minButton.hidden = true
  this.moveButton.hidden = true
  this.screenButton.hidden = true
  this.searchButton.hidden = true
  this.locButton.hidden = true
  this.linkButton.hidden = true
  this.goBackButton.hidden = true
  this.goForwardButton.hidden = true
  this.firstPageButton.hidden = true
  this.pageIndexButton.hidden = true
  this.prevPageButton.hidden = true
  this.nextPageButton.hidden = true
  this.lastPageButton.hidden = true
}

/** @this {snipasteController} */
snipasteController.prototype.showAllButton = function () {
  this.closeButton.hidden = false
  this.maxButton.hidden = false
  this.minButton.hidden = false
  this.moveButton.hidden = false
  this.screenButton.hidden = false
  this.searchButton.hidden = false
  // this.locButton.hidden = false
  // this.linkButton.hidden = false
  this.goBackButton.hidden = true
  this.goForwardButton.hidden = true
}

/** @this {snipasteController} */
snipasteController.prototype.toMinimode = async function (frame) {
  this.miniMode = true  
  this.lastFrame = this.view.frame 
  // MNUtil.showHUD("message"+this.lastFrame.x)
  this.webview.hidden = true
  this.currentFrame  = this.view.frame
  this.hideAllButton()
  this.view.layer.borderWidth = 3
  this.view.layer.borderColor = UIColor.colorWithHexString("#9bb2d6").colorWithAlphaComponent(0.8)
  // let scale = parseFloat(await this.runJavaScript(`
  //   getZoomLevel()
  // `))
  // MNUtil.showHUD("scale: "+scale)
  // this.view.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
  MNUtil.animate(()=>{
    this.setFrame(frame)
  }).then(()=>{
    this.moveButton.frame = MNUtil.genFrame(0,0,40,40)
    this.moveButton.hidden = false
    this.closeButton.hidden = true
    this.maxButton.hidden = true
    this.minButton.hidden = true
    this.moveButton.setImageForState(this.snipasteImage,0)
  })
}
/** @this {snipasteController} */
snipasteController.prototype.setFrame = function(x,y,width,height){
    if (typeof x === "object") {
      this.view.frame = x
    }else{
      this.view.frame = MNUtil.genFrame(x, y, width, height)
    }
    this.currentFrame = this.view.frame
  }
/**
 * 
 * @param {string} html 
 * @this {snipasteController}
 */
snipasteController.prototype.snipasteHtml = async function (html,force = false) {
  // MNUtil.showHUD("snipasteHtml")
  this.history.push({type:"html",content:html,id:MNUtil.MD5(html)})
  this.htmlMode = true
  this.focusNoteId = undefined
  this.onSnipaste = true
  this.currentHTMLString = html
  this.mode = "html"
  if (this.onRendering && !force) {
    return
  }
  this.onRendering = true
  this.webview.loadHTMLStringBaseURL(html)
  if (this.view.hidden) {
    this.show()
  }
    let htmlSizeString = await this.runJavaScript(`
    document.body.scrollHeight
    `)
    if (!htmlSizeString) {
      this.onRendering = false
      return
    }
    let htmlSize = parseFloat(htmlSizeString)
    if (htmlSize < 100) {
      htmlSize = 100
    }
    let viewFrame = this.view.frame
    let windowHeight = MNUtil.studyHeight
    if (viewFrame.y+htmlSize+40 >= windowHeight) {
      viewFrame.height = windowHeight-viewFrame.y
    }else{
      viewFrame.height = htmlSize+40
    }
    this.view.frame = viewFrame
    this.currentFrame = viewFrame
    this.onRendering = false
  // this.runJavaScript(`
  //   document.body.scrollIntoView(false);
  // `)
  // this.webview.context["hide"] = (message)=>{
  //   Application.sharedInstance().showHUD("123", this.view.window, 2);
  // }

}

/**
 * @this {snipasteController}
 * @param {string} path 
 */
snipasteController.prototype.snipastePDF = async function (md5,pageNo = 0,docController = undefined) {
try {
        if (pageNo > 20000) {
          MNUtil.showHUD("Unspported pageNo: "+pageNo)
          return
        }
        let document = MNUtil.getDocById(md5)
        let path = document.fullPathFileName
        this.pageCount = document.pageCount
        // MNUtil.copy("object"+this.pageCount)
        this.mode = "pdf"
        this.pageNo = pageNo
        this.docMd5 = md5
        
        let pdfData = MNUtil.getFile(path)
        // let pdfData = NSData.dataWithContentsOfURL(NSURL.fileURLWithPath(path))
        let size = pdfData.length()/1024/1024
        this.pdfSize = size
        if (size > 50) {
          MNUtil.waitHUD("Open PDF with "+size+"MB")
          await MNUtil.delay(0.01)
        }
        this.webview.loadHTMLStringBaseURL(`
<!DOCTYPE html>
<html>
<head>
    <title>优化版PDF预览</title>
    <link rel="stylesheet" href="https://vip.123pan.cn/1836303614/dl/cdn/notyf.css">
    <script src="https://vip.123pan.cn/1836303614/dl/cdn/notyf.js" defer></script>
    <style>
        .page-container { 
          margin: 0px auto;
        }
    </style>
</head>
<body>
    <script src="https://vip.123pan.cn/1836303614/dl/cdn/pdf.js" type="module"></script>
    <script type="module">
      const workerSrc = 'https://vip.123pan.cn/1836303614/dl/cdn/pdf.worker.js';
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
      let parsePDF
      const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
      const notyf = new Notyf({position: {x: 'center', y: 'top'}, duration: 1000,ripple:false});
/**
 * 根据安全的最大画布面积计算PDF页面的最大缩放比例。
 * @param {PDFPageProxy} page - PDF.js的页面对象.
 * @returns {number} - 计算出的最大安全scale值.
 */
function calculateMaxScale(page) {
    // 1. 定义一个在所有主流浏览器中都相对安全的最大画布面积常量。
    // 16,777,216 是 4096 * 4096，这是iOS Safari的一个常见限制，非常安全。
    const SAFE_MAX_CANVAS_AREA = 16777216;

    // 2. 获取页面在 scale: 1 时的原始尺寸
    const viewport = page.getViewport({ scale: 1.0 });
    const originalWidth = viewport.width;
    const originalHeight = viewport.height;
    const originalArea = originalWidth * originalHeight;

    // 3. 计算最大缩放比例
    // scale^2 * originalArea <= SAFE_MAX_CANVAS_AREA
    // scale <= sqrt(SAFE_MAX_CANVAS_AREA / originalArea)
    const maxScale = Math.sqrt(SAFE_MAX_CANVAS_AREA / originalArea);

    // 返回一个稍微向下取整的值以增加保险系数，比如保留两位小数
    return Math.floor(maxScale * 100) / 100;
}
      const renderPageDev = async (pageNum) => {

        const numPages = parsePDF.numPages;
        if (pageNum > numPages) {
          notyf.error("Already at the last page")
          return
        }else{
          notyf.success("Render page "+pageNum)
          await delay(10)
        }
        const page = await parsePDF.getPage(pageNum);
        const maxScale = calculateMaxScale(page);
        let baseScale = 4; // 基础缩放级别
        const pixelRatio = window.devicePixelRatio || 1;
        if (baseScale * pixelRatio > maxScale) {
          baseScale = maxScale / pixelRatio;
        }
        const viewport = page.getViewport({ 
            scale: baseScale * pixelRatio 
        });

        const canvas = document.createElement('canvas');
        // const div = document.createElement('div');
        // div.className = 'page-container';
        // div.appendChild(canvas);
        // document.body.appendChild(div);

        // 设置canvas物理像素
        canvas.width = viewport.width;
        canvas.height = viewport.height;
                    
        // 设置CSS显示尺寸
        canvas.style.width = (viewport.width / pixelRatio)+"px";
        canvas.style.height = (viewport.height / pixelRatio)+"px";

        // 配置渲染上下文
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;

          // 高质量渲染参数
          const renderContext = {
              canvasContext: ctx,
              viewport: viewport,
              enableWebGL: true,
          };
          await page.render(renderContext).promise;
          const pngDataURL = canvas.toDataURL('image/png');
          const preImg = document.querySelector('img')

          const img = document.createElement('img');
          img.src = pngDataURL;
          img.style.width = '100%';
          document.body.appendChild(img);
          await delay(10)
          if (preImg) {
            preImg.remove()
          }
          // document.body.innerHTML = \`<img class="body" width="100%" src="\${pngDataURL}"/>\`
      };
      window.renderPageDev = renderPageDev;
  const base64PDF = "${pdfData.base64Encoding()}"; // 完整的Base64字符串
  const rawData = atob(base64PDF); // 解码Base64
  const buffer = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    buffer[i] = rawData.charCodeAt(i);
  }
      parsePDF = await pdfjsLib.getDocument(buffer).promise;
      await renderPageDev(${pageNo});
    </script>
</body>
</html>
`)
  this.pageIndexButton.setTitleForState(this.pageIndex+1,0)
  if (this.view.hidden) {
    this.show()
  }
  if (docController) {
    this.docController = docController
  }else{
    if (this.docController && (this.docController.docMd5 !== this.docMd5)) {
      this.docController = undefined
    }
  }
  this.view.setNeedsLayout()
  MNUtil.stopHUD()
} catch (error) {
  snipasteUtils.addErrorLog(error, "snipastePDF", "snipastePDF")
}
    // MNUtil.copy(this.moveButton.frame)

}

/**
 * @this {snipasteController}
 * @param {string} path 
 */
snipasteController.prototype.snipastePDFDev = async function (md5,pageNo = 0) {
try {
        if (pageNo > 20000) {
          MNUtil.showHUD("Unspported pageNo: "+pageNo)
          return
        }
        let document = MNUtil.getDocById(md5)
        let path = document.fullPathFileName
        this.pageCount = document.pageCount
        this.mode = "pdf"
        this.pageNo = pageNo
        this.docMd5 = md5
        
        // let 

        let pdfData = NSData.dataWithContentsOfURL(NSURL.fileURLWithPath(path))
        let size = pdfData.length()/1024/1024
        this.pdfSize = size
        if (size > 50) {
          MNUtil.waitHUD("Open PDF with "+size+"MB")
          await MNUtil.delay(0.01)
        }
        this.webview.loadHTMLStringBaseURL(`
<!DOCTYPE html>
<html>
<head>
    <title>自定义 PDF 渲染</title>
    <style>
        #pdf-canvas {
            border: 1px solid black;
        }
    </style>
</head>
<body>
    <div>
        <button id="prev-page">上一页</button>
        <button id="next-page">下一页</button>
        <span>Page: <span id="page-num"></span> / <span id="page-count"></span></span>
    </div>
    <canvas id="pdf-canvas"></canvas>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.0.375/pdf.min.mjs" type="module"></script>

    <script type="module">
        // 指定 workerSrc
        const workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.0.375/pdf.worker.min.mjs';
        pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

        const url = 'https://vip.123pan.cn/1836303614/dl/test.pdf'; // 使用一个在线的 PDF 文件作为例子
        const canvas = document.getElementById('pdf-canvas');
        const ctx = canvas.getContext('2d');

        let pdfDoc = null;
        let pageNum = 1;
        let pageRendering = false;
        let pageNumPending = null;

        const scale = 1.5;

        /**
         * 渲染指定页码
         */
        async function renderPage(num) {
            pageRendering = true;
            // 获取页面
            const page = await pdfDoc.getPage(num);
            const viewport = page.getViewport({ scale });
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            // 渲染到 canvas 上下文
            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };
            await page.render(renderContext).promise;
            pageRendering = false;

            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }

            // 更新页码显示
            document.getElementById('page-num').textContent = num;
        }

        /**
         * 处理翻页请求
         */
        function queueRenderPage(num) {
            if (pageRendering) {
                pageNumPending = num;
            } else {
                renderPage(num);
            }
        }

        // 上一页
        document.getElementById('prev-page').addEventListener('click', () => {
            if (pageNum <= 1) {
                return;
            }
            pageNum--;
            queueRenderPage(pageNum);
        });

        // 下一页
        document.getElementById('next-page').addEventListener('click', () => {
            if (pageNum >= pdfDoc.numPages) {
                return;
            }
            pageNum++;
            queueRenderPage(pageNum);
        });


        /**
         * 异步加载 PDF
         */
        try {
            pdfDoc = await pdfjsLib.getDocument(url).promise;
            document.getElementById('page-count').textContent = pdfDoc.numPages;
            renderPage(pageNum);
        } catch (error) {
            console.error('Error loading PDF: ' + error);
        }

    </script>
</body>
</html>
`)
  this.pageIndexButton.setTitleForState(this.pageIndex+1,0)
  if (this.view.hidden) {
    this.show()
  }
  this.view.setNeedsLayout()
  MNUtil.stopHUD()
} catch (error) {
  snipasteUtils.addErrorLog(error, "snipastePDF", "snipastePDF")
}
    // MNUtil.copy(this.moveButton.frame)

}


/**
 * 
 * @param {MNNote} focusNote 
 * @this {snipasteController}
 */
snipasteController.prototype.snipasteNote = function (focusNote) {
  this.htmlMode = true
  this.mode = "note"
  MNUtil.studyView.bringSubviewToFront(this.view)
  if (!focusNote.excerptText && focusNote.comments.length === 1 && focusNote.comments[0].type === "HtmlNote") {
    let html = focusNote.comments[0].html
    this.snipasteHtml(html)
    return
  }
  this.history.push({type:"note",noteId:focusNote.noteId})
  this.focusNoteId = focusNote.noteId
  let title = focusNote.noteTitle?focusNote.noteTitle:"..."
  if (title.trim()) {
    title = title.split(";").filter(t=>{
      if (/{{.*}}/.test(t)) {
        return false
      }
      return true
    }).join(";")
  }
  let excerpt = ""
  if (focusNote.excerptPic && !focusNote.textFirst) {
    imageData = MNUtil.getMediaByHash(focusNote.excerptPic.paint)
    excerpt = `<p class="excerpt"><img width="100%" src="data:image/jpeg;base64,${imageData.base64Encoding()}"/></p>`
  }else if (focusNote.excerptText) {
    if (focusNote.excerptTextMarkdown) {
      excerpt = MNUtil.md2html(focusNote.excerptText)
    }else{
      excerpt = snipasteUtils.wrapText(focusNote.excerptText,"p","excerpt")
    }
  }
  let noteColorHexes = ["#ffffb4","#ccfdc4","#b4d1fb","#f3aebe","#ffff54","#75fb4c","#55bbf9","#ea3323","#ef8733","#377e47","#173dac","#be3223","#ffffff","#dadada","#b4b4b4","#bd9edc"]
  let theme = MNUtil.app.currentTheme
  let textColor = `rgb(0, 0, 0)`
  let themeHtml = ``
  if (theme === "Gray") {
    noteColorHexes = ["#d2d294","#a8d1a1","#94accf","#c88f9d","#d2d244","#5fcf3d","#459acd","#c0281b","#c46f28","#2c683a","#12328e","#9c281c","#d2d2d2","#b4b4b4","#949494","#9c82b5"]
    themeHtml = `      
    body{
      background-color: #414141;
    }`
    textColor = `rgb(255, 255, 255)`
  }else if (theme === "Dark") {
    noteColorHexes = ["#a0a071","#809f7b","#71839e","#986d77","#a0a032","#479e2c","#33759c","#921c12","#96551c","#204f2c","#0c266c","#771e14","#a0a0a0","#898989","#717171","#77638a"]
    themeHtml = `      
    body{
      background-color: #121212;
    }`
    textColor = `rgb(233, 232, 232)`
  }
  let comments = focusNote.comments.map(comment=>{
    try {
      switch (comment.type) {
        case "TextNote":
          if (/^marginnote\dapp:\/\//.test(comment.text)) {
            let noteid = comment.text.split("note/")[1]
            let note = MNNote.new(noteid)
            if (note) {
              return `<br><a class="link" href="snipaste://${noteid}"> Snipaste </a> <a class="link" href="marginnote3app://note/${noteid}"> Focus </a>${this.getDataFromNote(note)}`
            }else{
              return ""
            }
          }
          if (comment.markdown) {
            // copy(marked.parse(comment.text))
            return "<br>"+snipasteUtils.wrapText(MNUtil.md2html(comment.text),"div")
          }
          return "<br>"+snipasteUtils.wrapText(comment.text,"div")
        case "PaintNote":
          if (comment.paint) {
            let commentImage = MNUtil.getMediaByHash(comment.paint)
            return `<br><img width="100%" src="data:image/jpeg;base64,${commentImage.base64Encoding()}"/>`
          }else{
            return ""
          }
        case "HtmlNote":                  
          return "<br>"+snipasteUtils.wrapText(comment.html,"div")
        case "LinkNote":
          if ((!comment.q_hpic || focusNote.textFirst) && comment.q_htext) {
            return "<br>"+snipasteUtils.wrapText(comment.q_htext,'div')
          }else{
            let imageData = MNUtil.getMediaByHash(comment.q_hpic.paint)
            return `<br><img width="100%" src="data:image/jpeg;base64,${imageData.base64Encoding()}"/>`
          }
        default:
          return "";
      }
    } catch (error) {
      snipasteUtils.addErrorLog(error, "snipasteNote", "snipasteNote")
      return ""
    }
  }).join("")
  let noteid  = focusNote.noteId
  let excerptHtml = excerpt?excerpt:""
  let html = `
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
      ${themeHtml}
      .body {
        border: 3px solid ${noteColorHexes[focusNote.colorIndex]};
        border-radius: 10px 10px 10px 10px;
        font-size: large;
      }
      .link {
        padding-bottom: 5px;
        white-space: pre-wrap;
        border-radius: 5px;
        background-color: ${noteColorHexes[focusNote.colorIndex]};
      }
      .head {
        background-color: ${noteColorHexes[focusNote.colorIndex]};
        border-radius: 6px 6px 0px 0px;
        line-height: 30px;
      }
      img {
        width: 100%;
      }
      .tail {
        height: 10px;
      }
      .title {
        padding-left: 10px;
        padding-bottom: 5px;
        cursor: grab;
        -webkit-text-fill-color: ${textColor};
      }
      .excerpt {
        white-space: pre-line;
        padding-left: 5px;;
        padding-right: 5px;
        cursor: grab;
        -webkit-text-fill-color: ${textColor};
      }
      .comment {
        padding-left: 10px;
        padding-right: 10px;
        cursor: grab;
        -webkit-text-fill-color: ${textColor};
      }
    </style>
  </head>

  <body>
    <div class="body">
      <div class="head">
        <div class="title" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', this.innerText)" onclick="copyText(this.innerText)">${title}</div>
      </div>
      <div class="excerpt">${excerptHtml.trim()}</div>
      <div class="comment">${comments.trim()}</div>
      <div class="tail"></div>
    </div> 
  <script>
      MathJax = {
          tex: {
              inlineMath: [ ['$','$'], ["\\(","\\)"] ]
          }
      };
function copyText(text) {   
 const textarea = document.createElement('textarea');  
 textarea.value = text;  
 textarea.style.position = 'absolute';  
 textarea.style.top = '-9999px';  
 textarea.style.left = '-9999px';  
 document.body.appendChild(textarea);  
 textarea.select();  
 document.execCommand('copy');  
 textarea.remove();  
 window.location = "snipasteaction://copy"
}
  </script>
  <script id="MathJax-script" async src="https://vip.123pan.cn/1836303614/dl/cdn/es5/tex-svg-full.js"></script>
  </body>
  </html>
            `
  // MNUtil.copy(html)
  this.onSnipaste = true
  this.currentHTMLString = html
  this.webview.loadHTMLStringBaseURL(html)
  // this.webview.context["hide"] = (message)=>{
  //   Application.sharedInstance().showHUD("123", this.view.window, 2);
  // }
  if (this.view.hidden) {
    this.show()
  }
}
snipasteController.prototype.test = function () {
try {
  this.webview.loadFileURLAllowingReadAccessToURL(NSURL.fileURLWithPath())
  

  this.webview.loadHTMLStringBaseURL(`
<!DOCTYPE html>
<html>
<head>
    <title>PDF.js 预览示例</title>
    <!-- 通过 CDN 引入 pdf.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body>
    <!-- 用于显示 PDF 的容器 -->
    <canvas id="pdf-canvas"></canvas>

    <script>
        // PDF 文件路径（可以是本地或远程 URL）
        const pdfUrl = 'https://vip.123pan.cn/1836303614/dl/docs/The%20Little%20Prince.pdf';

        // 获取 Canvas 元素和上下文
        const canvas = document.getElementById('pdf-canvas');
        const ctx = canvas.getContext('2d');

        // 加载 PDF 文档
        pdfjsLib.getDocument(pdfUrl).promise
            .then(pdf => {
                // 获取第一页
                return pdf.getPage(1);
            })
            .then(page => {
                // 设置渲染比例（根据需求调整）
                const viewport = page.getViewport({ scale: 1.5 });
                
                // 调整 Canvas 尺寸以匹配 PDF 页面
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                // 渲染页面到 Canvas
                return page.render({
                    canvasContext: ctx,
                    viewport: viewport
                }).promise;
            })
            .catch(error => {
                console.error('加载 PDF 失败:', error);
            });
    </script>
</body>
</html>
  `,NSURL.fileURLWithPath(this.mainPath))
  } catch (error) {
  snipasteUtils.addErrorLog(error, "test")
}
  // MNConnection.loadFile(this.webview, "pdfPreview.html", this.mainPath)
  if (this.view.hidden) {
    this.show()
  }
}
snipasteController.prototype.showHUD = function (message,duration = 2,view = this.view) {
  MNUtil.showHUD(message,duration,view)
}
snipasteController.prototype.show = async function () {
  let preFrame = this.view.frame
  let preOpacity = this.view.layer.opacity
  this.view.layer.opacity = 0.2
  this.view.hidden = false
  this.moveButton.hidden = true
  this.closeButton.hidden = true
  this.maxButton.hidden = true
  this.minButton.hidden = true
  this.webview.hidden = false
  if (this.toolbarOn) {
    this.engineButton.hidden = true
  }
  MNUtil.animate(()=>{
    this.view.layer.opacity = preOpacity
    this.view.frame = preFrame
    this.currentFrame = preFrame
    this.moveButton.frame = MNUtil.genFrame(preFrame.width*0.5-75, 0, 150, 18)
  }).then(()=>{
    this.view.layer.borderWidth = 0
    this.moveButton.hidden = false
    this.closeButton.hidden = false
    this.maxButton.hidden = false
    this.minButton.hidden = false
    this.webview.hidden = false
    this.moveButton.setImageForState(undefined,0)
    // this.runJavaScript(`
    //   setZoomLevel(1)
    // `)
  })
}
snipasteController.prototype.hide = function () {
  let preFrame = this.view.frame
  let preOpacity = this.view.layer.opacity
  // let preFrame = this.view.frame
  this.onSnipaste = false

  this.webview.hidden = false
  this.moveButton.hidden = true
  this.closeButton.hidden = true
  this.maxButton.hidden = true
  this.minButton.hidden = true
  UIView.animateWithDurationAnimationsCompletion(0.2,()=>{
    this.view.layer.opacity = 0.2
  },
  ()=>{
    this.view.hidden = true;
    this.view.layer.opacity = preOpacity      
    this.view.frame = preFrame
    this.currentFrame = preFrame
  })
}
snipasteController.prototype.snipasteFromClipboard = function () {
  try {
    

    let image = MNUtil.clipboardImage
    if (image) {
      let wholeFrame = MNUtil.studyView.bounds
      let imageSize = image.size
      let widthScale = wholeFrame.width/imageSize.width*0.5
      let heightScale = wholeFrame.height/imageSize.height*0.5
      let scale = Math.min(widthScale,heightScale)
      if (scale > 1) {
        scale = 1
      }
      let viewFrame = this.view.frame
      this.view.frame = {x:viewFrame.x,y:viewFrame.y,width:imageSize.width*scale,height:imageSize.height*scale}
      this.currentFrame = {x:viewFrame.x,y:viewFrame.y,width:imageSize.width*scale,height:imageSize.height*scale}
      let imageData = image.pngData()
      this.onSnipaste = true
      this.snipasteFromImage(imageData)
      this.htmlMode = false
    }else{
      if (MNUtil.clipboardText) {
        let centeredText = `
        <!DOCTYPE html>
<html>
<head>
    <style>
        body {
            margin: 10px;
            height: 100vh; /* 让body占满整个视口高度 */
            display: flex;
            justify-content: center; /* 水平居中 */
            align-items: center;     /* 垂直居中 */
            font-size: larger;
        }
    </style>
</head>
<body>
    <p>${MNUtil.clipboardText}</p>
</body>
</html>
        `
        this.snipasteHtml(centeredText)
      }else{
        MNUtil.showHUD("No image in pasteboard")
      }
      return
    }
    if (this.view.hidden) {
      this.show(this.addonBar.frame)
    }
  } catch (error) {
    MNUtil.showHUD(error)
  }
  },
snipasteController.prototype.getDataFromNote = function (note) {
    let order = [1,2,3]
    let text
    for (let index = 0; index < order.length; index++) {
      const element = order[index];
      switch (element) {
        case 1:
          if (note.noteTitle && note.noteTitle !== "") {
            text = snipasteUtils.wrapText(note.noteTitle,'div')
          }
          break;
        case 2:
          if (note.excerptText && note.excerptText !== "" && (!note.excerptPic || note.textFirst)) {
            text = snipasteUtils.wrapText(note.excerptText,'div')
          }else{
            if (note.excerptPic && note.excerptPic.paint) {
              let imageData = Database.sharedInstance().getMediaByHash(note.excerptPic.paint)
              text = `<img width="100%" src="data:image/jpeg;base64,${imageData.base64Encoding()}"/>`
            }
          }
          break;
        case 3:
          let commentText
          let comment = note.comments.find(comment=>{
            switch (comment.type) {
              case "TextNote":
                if (/^marginnote\dapp:\/\//.test(comment.text)) {
                  return false
                }else{
                  commentText = comment.text
                  return true
                }
              case "HtmlNote":
                commentText = comment.text
                return true
              case "LinkNote":
                if (comment.q_hpic && !note.textFirst) {
                  return false
                }else{
                  commentText = comment.q_htext
                  return true
                }
              default:
                return false
            }
          })
          // let noteText  = note.comments.filter(comment=>comment.type === "TextNote" && !/^marginnote3app:\/\//.test(comment.text))
          // if (noteText.length) {
          //   text =  noteText[0].text
          // }
          if (commentText && commentText.length) {
            text = snipasteUtils.wrapText(commentText,'div')
          }
          break;
        default:
          break;
      }
      if (text) {
        return text
      }
    }
  return "\nEmpty note"
  }
snipasteController.prototype.snipasteFromImage = function (imageData) {
  let base64 = imageData.base64Encoding()
  let html = `<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body {
      background-color: transparent; /* 设置背景颜色为透明 */
      margin: 0; /* 移除默认的 margin */
    }
  </style>
</head>
<body><img class="body" width="100%" src="data:image/jpeg;base64,${base64}"/></body>
</html>`
this.mode = "image"
try {
this.webview.loadHTMLStringBaseURL(html)
this.history.push({type:"image",base64:base64,id:MNUtil.MD5(base64)})
} catch (error) {
  MNUtil.showHUD(error)
}
}

/** @this {snipasteController} */
snipasteController.prototype.runJavaScript = async function(script) {
  return new Promise((resolve, reject) => {
    try {
      this.webview.evaluateJavaScript(script,(result) => {
        if (MNUtil.isNSNull(result)) {
          resolve(undefined)
        }else{
          resolve(result)
        }
      });
    } catch (error) {
      chatAIUtils.addErrorLog(error, "runJavaScript")
      resolve(undefined)
    }
  })
};

/** @this {snipasteController} */
snipasteController.prototype.hasDocController = function () {
  return (this.docController && (this.docController.docMd5 === this.docMd5))
}

snipasteController.prototype.pageNoFromIndex = function (index) {
  if (this.hasDocController()) {
    return this.docController.indexFromPageNo(index)
  }
  return index+1
}

