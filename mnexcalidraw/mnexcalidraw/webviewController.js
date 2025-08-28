/** @return {excalidrawController} */
const getExcalidrawController = ()=>self

var excalidrawController = JSB.defineClass('excalidrawController : UIViewController <UIWebViewDelegate>',{
  // /** @self {excalidrawController} */
  viewDidLoad: function() {
  try {
    

    let self = getExcalidrawController()
    self.appInstance = Application.sharedInstance();
    self.custom = false;
    self.customMode = "None"
    self.miniMode = false;
    self.shouldCopy = false
    self.shouldComment = false
    self.selectedText = '';
    self.searchedText = '';
    self.webApp = "Bilibili"
    self.isLoading = false;
    self.theme = "light"
    self.view.frame = {x:50,y:50,width:(self.appInstance.osType !== 1) ? 419 : 365,height:450}
    self.lastFrame = self.view.frame;
    self.currentFrame = self.view.frame
    self.isMainWindow = true
    self.title = "main"
    self.test = [0]
    self.imageMD5s = []
    self.moveDate = Date.now()
    self.color = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]
    self.view.layer.shadowOffset = {width: 0, height: 0};
    self.view.layer.shadowRadius = 15;
    self.view.layer.shadowOpacity = 0.5;
    self.view.layer.shadowColor = UIColor.colorWithWhiteAlpha(0.5, 1);
    self.view.layer.cornerRadius = 11
    self.view.layer.opacity = 1.0
    self.view.layer.borderColor = MNUtil.hexColorAlpha("#9390e1",0.8)
    self.view.layer.borderWidth = 0

    // >>> DeepL view >>>
    self.webview = new UIWebView(self.view.bounds);
    self.webview.backgroundColor = UIColor.whiteColor();
    self.webview.scalesPageToFit = true;
    self.webview.autoresizingMask = (1 << 1 | 1 << 4);
    self.webview.delegate = self;
    self.webview.scrollView.delegate = self;
    self.webview.layer.cornerRadius = 15;
    self.webview.layer.masksToBounds = true;
    self.webview.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8);
    self.webview.layer.borderWidth = 0
    self.webview.scrollView.bounces = false
    self.webview.scrollView.minimumZoomScale = 1.0
    self.webview.scrollView.maximumZoomScale = 1.0

    self.highlightColor = UIColor.blendedColor( MNUtil.hexColorAlpha("#2c4d81",0.8),
      self.appInstance.defaultTextColor,
      0.8
    );

    self.webview.hidden = true;
    self.webview.lastOffset = 0;
    self.view.addSubview(self.webview);

    self.createButton("toolbar")
    self.toolbar.backgroundColor = MNUtil.hexColorAlpha("#727f94",0.)


    self.createButton("webAppButton","scrollToContent:","toolbar")
    // self.webAppButton.setTitleForState('📺', 0);
    self.webAppButton.setImageForState(excalidrawUtils.locImage,0)

    self.createButton("closeButton","closeButtonTapped:")
    self.closeButton.setTitleForState('✖️', 0);
    self.closeButton.titleLabel.font = UIFont.systemFontOfSize(10);

    self.createButton("maxButton","maxButtonTapped:")
    self.maxButton.setTitleForState('➕', 0);
    self.maxButton.titleLabel.font = UIFont.systemFontOfSize(10);

    self.createButton("minButton","minButtonTapped:")
    self.minButton.setTitleForState('➖', 0);
    self.minButton.titleLabel.font = UIFont.systemFontOfSize(10);

    // self.createButton("screenButton","changeScreen:","toolbar")
    self.createButton("screenButton","changeTheme0:","toolbar")
    // self.screenButton.setTitleForState('🤖', 0);
    // self.screenButton.titleLabel.font = UIFont.boldSystemFontOfSize(15);

    self.screenButton.setImageForState(excalidrawUtils.robotImage,0)

    self.createButton("engineButton","OCRTarget:","toolbar")
    self.engineButton.setTitleForState('OCR', 0);
    self.engineButton.titleLabel.font = UIFont.boldSystemFontOfSize(16);

    self.createButton("homeButton","refreshButtonTapped:","toolbar")
    // self.homeButton.setImageForState(excalidrawUtils.homeImage,0)
    self.homeButton.setImageForState(excalidrawUtils.reloadImage,0)

    self.createButton("searchButton","export:","toolbar")
    self.searchButton.setImageForState(excalidrawUtils.screenImage,0)
    // self.searchButton.setTitleForState('🎬', 0);
    // self.searchButton.titleLabel.font = UIFont.boldSystemFontOfSize(15);

    self.createButton("moveButton","moveButtonTapped:")

    self.createButton("goForwardButton","changeTheme:","toolbar")
    // self.goForwardButton.setTitleForState('🌗', 0);
    // self.goForwardButton.titleLabel.font = UIFont.boldSystemFontOfSize(15);
    self.goForwardButton.setImageForState(excalidrawUtils.themeImage,0)

    self.createButton("goBackButton","changeOpacity:","toolbar")
    self.goBackButton.setImageForState(excalidrawUtils.opacityImage,0)
    // self.goBackButton.setTitleForState('🫧', 0);
    // self.goBackButton.titleLabel.font = UIFont.boldSystemFontOfSize(15);

    // self.goBackButton.setImageForState(excalidrawUtils.gobackImage,0)
    // <<< goBack button <<<
    // >>> refresh button >>>
    self.createButton("refreshButton","changeZoom:","toolbar")
    // self.refreshButton.setTitleForState('🎚️', 0);
    // self.refreshButton.titleLabel.font = UIFont.boldSystemFontOfSize(15);

    self.refreshButton.setImageForState(excalidrawUtils.zoomImage,0)
    // <<< refresh button <<<

    self.moveGesture = new UIPanGestureRecognizer(self,"onMoveGesture:")
    self.moveButton.addGestureRecognizer(self.moveGesture)
    self.moveGesture.view.hidden = false
    // self.moveGesture.addTargetAction(self,"onMoveGesture:")

    self.resizeGesture = new UIPanGestureRecognizer(self,"onResizeGesture:")
    self.screenButton.addGestureRecognizer(self.resizeGesture)
    self.resizeGesture.view.hidden = false
    // self.resizeGesture.addTargetAction(self,"onResizeGesture:")
  } catch (error) {
    MNUtil.showHUD("Error in viewDidLoad: "+error)
  }
  },
  viewWillAppear: function(animated) {
    self.webview.delegate = self;
  },
  viewWillDisappear: function(animated) {
    self.webview.stopLoading();
    self.webview.delegate = null;
  },

viewWillLayoutSubviews: function() {
  let self = getExcalidrawController()
    if (self.miniMode) {
      return
    }
    let buttonHeight = 25
    var viewFrame = self.view.bounds;
    var width    = viewFrame.width
    var height   = viewFrame.height
    self.closeButton.frame = MNUtil.genFrame(width-18,0,18,18)
    self.maxButton.frame = MNUtil.genFrame(width-43,0,18,18)
    self.minButton.frame = MNUtil.genFrame(width-68,0,18,18)

    if (excalidrawConfig.toolbar) {
      self.toolbar.frame = MNUtil.genFrame(14, height-28, width-28,buttonHeight)
      self.screenButton.frame = MNUtil.genFrame(width-66,0,38,buttonHeight)
    }else{
      self.toolbar.frame = MNUtil.genFrame(1,height-30,width-2,buttonHeight)
      self.screenButton.frame = MNUtil.genFrame(width-40,0,33,buttonHeight)
    }
    self.engineButton.frame = {x: width - 120,y: 0,width: 50,height: buttonHeight};

    if (width <= 300) {
      self.goBackButton.hidden = true
      self.goForwardButton.hidden = true
      self.refreshButton.hidden = true
      self.moveButton.frame = {x: width*0.5-75,y: 0,width: width*0.35,height: 16};
      self.homeButton.frame = {  x: 0,  y: 0,  width: 47,  height: buttonHeight,};    
      self.webAppButton.frame = {  x: 52,  y: 0,  width: 47,  height: buttonHeight,};
      if (excalidrawConfig.toolbar) {
        self.searchButton.frame = {  x: width-93,  y: 0,  width: 47,  height: buttonHeight,};
      }else{
        self.searchButton.frame = {  x: width - 75,  y: 0,  width: 30,  height: buttonHeight,};
      }
    }else if (width <= 380) {
      self.moveButton.frame = {  x: width*0.5-75,  y: 0,  width: width*0.35,  height: 16};
      self.refreshButton.hidden = !excalidrawConfig.toolbar
      self.goBackButton.hidden = !excalidrawConfig.toolbar
      self.homeButton.hidden = !excalidrawConfig.toolbar
      self.goForwardButton.hidden = !excalidrawConfig.toolbar
      self.engineButton.hidden = true
      self.homeButton.frame = {  x: 106,  y: 0,  width: 47,  height: buttonHeight,};  
      self.webAppButton.frame = {  x: 157,  y: 0,  width: 47,  height: buttonHeight,};
      self.searchButton.frame = {  x: width-90,  y: 0,  width: 40,  height: buttonHeight,};
    }else{
      self.moveButton.frame = {  x: width*0.5-75,  y: 0,  width: 150,  height: 16};
      self.refreshButton.hidden = !excalidrawConfig.toolbar
      self.goBackButton.hidden = !excalidrawConfig.toolbar
      self.goForwardButton.hidden = !excalidrawConfig.toolbar
      self.engineButton.hidden = !excalidrawConfig.toolbar
      self.homeButton.hidden = !excalidrawConfig.toolbar
      self.webAppButton.hidden = !excalidrawConfig.toolbar
      self.screenButton.hidden = false
      self.homeButton.frame = {  x: 133,  y: 0,  width:40,  height: buttonHeight,};   
      self.webAppButton.frame = {  x: 177,  y: 0,  width: 40,  height: buttonHeight,};
      self.searchButton.frame = {  x: width - 164,  y: 0,  width: 40,  height: buttonHeight};
    }
    self.goBackButton.frame = {  x:1,  y: 0,  width: 40,  height: buttonHeight,};
    self.goForwardButton.frame = {  x:45,  y: 0,  width: 40,  height: buttonHeight,};
    self.refreshButton.frame = {  x: 89,  y: 0,  width: 40,  height: buttonHeight,};
    self.webview.frame = {x:1,y:0,width:width-2,height:height}

  },

  webViewDidStartLoad: function(webView) {
  },
  webViewDidFinishLoad: async function(webView) {
  },
  webViewDidFailLoadWithError: function(webView, error) {
  },
  webViewShouldStartLoadWithRequestNavigationType: function(webView,request,type){
    return true;
  },
  changeScreen: function(sender) {
    var commandTable = [
        {title:'🫧 Opacity',object:self,selector:'changeOpacity:',param:sender},
        {title:'🌗 Theme',object:self,selector:'changeTheme:',param:sender}
      ];
    self.view.popoverController = MNUtil.getPopoverAndPresent(sender, commandTable,150,2)
  },
  moveButtonTapped: function(sender) {
    if (self.miniMode) {
      let preFrame = self.view.frame
      self.view.hidden = true
      self.showAllButton()
      let studyFrame = MNUtil.studyView.bounds
      if (self.view.frame.x < studyFrame.width*0.5) {
        self.lastFrame.x = 0
      }else{
        self.lastFrame.x = studyFrame.width-self.lastFrame.width
      }
      self.setFrame(self.lastFrame)
      self.show(preFrame)
      return
    }
    var commandTable = [
        {title:'🌗 Left',object:self,selector:'splitScreen:',param:'left',checked:self.customMode==="left"},
        {title:'🌘 Left 1/3',object:self,selector:'splitScreen:',param:'left13',checked:self.customMode==="left13"},
        {title:'🌓 Right',object:self,selector:'splitScreen:',param:'right',checked:self.customMode==="right"},
        {title:'🌒 Right 1/3',object:self,selector:'splitScreen:',param:'right13',checked:self.customMode==="right13"},
        {title:'🎬 From Selection',object:self,selector:'loadFromSelection:',param:'right13'},
        {title:'🎬 From Clipboard',object:self,selector:'loadFromClipboard:',param:'right13'},
        {title:'🎬 From FocusNote',object:self,selector:'loadFromFocusNote:',param:'right13'},
      ];
    self.view.popoverController = MNUtil.getPopoverAndPresent(sender, commandTable,250,1)
  },
  OCRTarget: function(sender) {

    var commandTable = [
        {title:'🎬 → Clipboard',object:self,selector:'beginOCR:',param:"copy"},
        {title:'🎬 → Comment',object:self,selector:'beginOCR:',param:"toComment"},
        {title:'🎬 → Excerpt',object:self,selector:'beginOCR:',param:"toExcerpt"},
        {title:'🎬 → ChildNote',object:self,selector:'beginOCR:',param:"toChild"},
        {title:'🎬 → NewNote',object:self,selector:'beginOCR:',param:"toNewNote"},
      ];
    self.view.popoverController = MNUtil.getPopoverAndPresent(sender, commandTable,250,2)
  },
  beginOCR: async function (action) {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    if (typeof ocrUtils === 'undefined') {
      MNUtil.showHUD("MN Excalidraw: Please install 'MN OCR' first!")
      return
    }
    try {
    let foucsNote = MNNote.getFocusNote()
    let imageData = await self.exportToImage()
    if (!imageData) {
      return
    }
    self.currentTime = Date.now()
    let res = await ocrNetwork.OCR(imageData)
    // MNUtil.copyJSON(res)
    if (res) {
      MNUtil.showHUD("Time usage: "+(Date.now()-self.currentTime)+" ms")
      switch (action) {
        case "toComment":
          if (foucsNote) {
            MNUtil.undoGrouping(()=>{
              foucsNote.appendMarkdownComment(res)
              MNUtil.showHUD("Append to comment")
            })
          }else{
            MNUtil.copy(res)
          }
          break;
        case "copy":
          MNUtil.copy(res)
          MNUtil.showHUD("Save to clipboard")
          break;
        case "toExcerpt":
          if (foucsNote) {
            MNUtil.undoGrouping(()=>{
              foucsNote.excerptText =  res
              foucsNote.excerptTextMarkdown = true
              MNUtil.showHUD("Set to excerpt")
            })
          }else{
            MNUtil.copy(res)
          }
          break;
        case "toChild":
          MNUtil.undoGrouping(()=>{
            let child = foucsNote.createChildNote({excerptText:res,excerptTextMarkdown:true})
            child.focusInMindMap(0.5)
          })
          break;
        case "toNewNote":
          let mindmapView = MNUtil.mindmapView
          let notebookController = MNUtil.notebookController
          if (!notebookController.view.hidden && mindmapView && mindmapView.mindmapNodes && mindmapView.mindmapNodes.length) {
            MNUtil.undoGrouping(()=>{
            let childMindMap = mindmapView.mindmapNodes[0].note.childMindMap
            if (childMindMap) {
              let note = MNNote.new(childMindMap)
              let child = note.createChildNote({excerptText:res,excerptTextMarkdown:true})
              child.focusInMindMap(0.5)
            }else{
              let note = MNNote.new({excerptText:res,excerptTextMarkdown:true})
              note.focusInMindMap(0.5)
            }
            })
          }
          break;
        default:
          break;
      }

    }
      
    } catch (error) {
      MNUtil.showHUD(error)
      MNUtil.copy(error)
    }
  },
  changeOpacity: function(sender) {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    var commandTable = [
      {title:'100%',object:self,selector:'changeOpacityTo:',param:1.0},
      {title:'90%',object:self,selector:'changeOpacityTo:',param:0.9},
      {title:'80%',object:self,selector:'changeOpacityTo:',param:0.8},
      {title:'70%',object:self,selector:'changeOpacityTo:',param:0.7},
      {title:'60%',object:self,selector:'changeOpacityTo:',param:0.6},
      {title:'50%',object:self,selector:'changeOpacityTo:',param:0.5}
    ];
    self.view.popoverController = MNUtil.getPopoverAndPresent(sender, commandTable,100)
  },
  changeTheme: function (params) {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    self.runJavaScript(`toggleTheme()`)
  },
  scrollToContent: function (params) {
    self.runJavaScript(`Excalidraw.scrollToContent()`)
    
  },
  changeZoom: function(sender) {
    // self.runJavaScript(`Excalidraw.scrollToContent()`)
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    var commandTable = [
      {title:'  ➕',object:self,selector:'changeZoomTo:',param:1},
      {title:'  ➖', object:self,selector:'changeZoomTo:',param:-1},
      {title:'100%', object:self,selector:'changeZoomTo:',param:0}
    ];
    self.view.popoverController = MNUtil.getPopoverAndPresent(sender, commandTable,75)
  },
  changeOpacityTo:function (opacity) {
    self.view.layer.opacity = opacity
  },
  changeZoomTo:function (param) {
    switch (param) {
      case 0:
        self.runJavaScript(`resetZoom()`)
        break;
      case 1:
        self.runJavaScript(`zoomIn()`)
        break;
      case -1:
        self.runJavaScript(`zoomOut()`)
        break;
      default:
        break;
    }
  },
  toggleToolbar:function (opacity) {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    
    self.webAppButton.hidden = !excalidrawConfig.toolbar
    // self.searchButton.hidden = !excalidrawConfig.toolbar
    self.homeButton.hidden = !excalidrawConfig.toolbar
    self.goBackButton.hidden = !excalidrawConfig.toolbar
    self.goForwardButton.hidden = !excalidrawConfig.toolbar
    self.refreshButton.hidden = !excalidrawConfig.toolbar
    self.engineButton.hidden = !excalidrawConfig.toolbar
    excalidrawConfig.toolbar = !excalidrawConfig.toolbar
    var viewFrame = self.view.bounds;
    MNUtil.animate(()=>{
      if (excalidrawConfig.toolbar) {
        self.webview.frame = {x:viewFrame.x+1,y:viewFrame.y+10,width:viewFrame.width-2,height:viewFrame.height-40}
      }else{
        self.webview.frame = {x:viewFrame.x+1,y:viewFrame.y+10,width:viewFrame.width-2,height:viewFrame.height}
      }
    })
    excalidrawConfig.save("MNBrowser_toolbar"+excalidrawConfig.toolbar)
  },

  loadFromSelection: async function (button) {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    let imageData = MNUtil.getDocImage()
    if (!imageData) {
      MNUtil.showHUD("No image found!")
      return
    }
    self.addImage(imageData)
    // let imageSize = UIImage.imageWithData(imageData).size
    // let imageUUID = NSUUID.UUID().UUIDString()
    // let elementUUID = NSUUID.UUID().UUIDString()
    // // MNUtil.copy(imageData.base64Encoding())
    // self.runJavaScript(`
    // Excalidraw.addImage(\`${imageUUID}\`,\`data:image/png;base64,${imageData.base64Encoding()}\`)
    // Excalidraw.updateScene(\`${elementUUID}\`,\`${imageUUID}\`,${imageSize.width*0.5},${imageSize.height*0.5})
    // `)
    // self.runJavaScript(`Excalidraw.scrollToContent()`)
  },
  loadFromClipboard: async function (button) {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    let image = UIPasteboard.generalPasteboard().image
    let imageData = image.pngData()
    let imageSize = image.size
    let imageUUID = NSUUID.UUID().UUIDString()
    let elementUUID = NSUUID.UUID().UUIDString()
    // MNUtil.copy(imageData.base64Encoding())
    self.runJavaScript(`
    Excalidraw.addImage(\`${imageUUID}\`,\`data:image/png;base64,${imageData.base64Encoding()}\`)
    Excalidraw.updateScene(\`${elementUUID}\`,\`${imageUUID}\`,${imageSize.width*0.5},${imageSize.height*0.5})
    `)
    self.runJavaScript(`Excalidraw.scrollToContent()`)
  },
  loadFromFocusNote: async function (button) {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    let focusNote = MNNote.getFocusNote()
    if (!focusNote) {
      MNUtil.showHUD("No focus note!")
      return
    }
    let imageData = excalidrawUtils.getImageFromNote(focusNote)
    if (!imageData) {
      MNUtil.showHUD("No image found!")
      return
    }
    self.addImage(imageData)
    // let imageSize = UIImage.imageWithData(imageData).size
    // let imageUUID = NSUUID.UUID().UUIDString()
    // let elementUUID = NSUUID.UUID().UUIDString()
    // // MNUtil.copy(imageData.base64Encoding())
    // self.runJavaScript(`
    // Excalidraw.addImage(\`${imageUUID}\`,\`data:image/png;base64,${imageData.base64Encoding()}\`)
    // Excalidraw.updateScene(\`${elementUUID}\`,\`${imageUUID}\`,${imageSize.width*0.5},${imageSize.height*0.5})
    // `)
    // self.runJavaScript(`Excalidraw.scrollToContent()`)
  },
  export: async function (button) {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    if (button.date && (Date.now()-button.date)<500) {
      MNNote.getFocusNote().paste()
      return
    }
    button.date = Date.now()
    let imageData = await self.exportToImage()
    if (imageData) {
      MNUtil.copyImage(imageData)
      MNUtil.showHUD('截图已复制, 双击粘贴到卡片')
    }
  },
  homeButtonTapped: function() {
  },
  searchButtonTapped: async function() {
  },
  goBackButtonTapped: function() {
  },
  goForwardButtonTapped: function() {
  },
  refreshButtonTapped: function(para) {
    self.runJavaScript(`Excalidraw.resetScene();switchToPencil();`)
    MNUtil.showHUD("Clear canvas")
    self.imageMD5s = []
    // self.webview.loadFileURLAllowingReadAccessToURL(
    //   NSURL.fileURLWithPath(excalidrawUtils.mainPath + '/editor.html'),
    //   NSURL.fileURLWithPath(excalidrawUtils.mainPath + '/')
    // );
  },
  closeButtonTapped: function() {
    if (self.addonBar) {
      self.hide(self.addonBar.frame)
    }else{
      self.hide()
    }
  },
 splitScreen: function (mode) {
  if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
  self.lastFrame = self.view.frame
  self.custom = true;
  self.customMode = mode
  excalidrawConfig.dynamic = false;
  self.webview.hidden = false
  self.hideAllButton()
  MNUtil.animate(()=>{
    self.setSplitScreenFrame(mode)
  },0.3).then(()=>{
    self.showAllButton()
    self.runJavaScript(`Excalidraw.scrollToContent()`)
  })
 },
  maxButtonTapped: function() {
    if (self.customMode === "full") {
      self.customMode = "none"
      self.custom = false;
      // self.screenButton.hidden = false
      self.hideAllButton()
      MNUtil.animate(()=>{
        self.setFrame(self.lastFrame)
      },0.3).then(()=>{
        self.showAllButton()
        self.runJavaScript(`Excalidraw.scrollToContent()`)
      })
      return
    }
    const frame = MNUtil.studyView.bounds
    self.lastFrame = self.view.frame
    self.customMode = "full"
    self.custom = true;
    excalidrawConfig.dynamic = false;
    self.webview.hidden = false
    self.hideAllButton()
    MNUtil.animate(()=>{
      self.setFrame(40,50,frame.width-80,frame.height-70)
    },0.3).then(()=>{
      self.showAllButton()
      self.runJavaScript(`Excalidraw.scrollToContent()`)
    })
  },
  minButtonTapped: function() {
    excalidrawConfig.dynamic = false;
    self.miniMode = true
    let studyFrame = MNUtil.studyView.bounds
    let studyCenter = MNUtil.studyView.center.x
    let viewCenter = self.view.center.x
    if (viewCenter>studyCenter) {
      self.toMinimode(MNUtil.genFrame(studyFrame.width-40,self.view.frame.y,40,40))
    }else{
      self.toMinimode(MNUtil.genFrame(0,self.view.frame.y,40,40))
    }
  },
  onMoveGesture:function (gesture) {
    excalidrawConfig.dynamic = false;
    let locationToMN = gesture.locationInView(MNUtil.studyView)
    if (!self.locationToButton || !self.miniMode && (Date.now() - self.moveDate) > 100) {
      // self.appInstance.showHUD("state:"+gesture.state, self.view.window, 2);
      let translation = gesture.translationInView(MNUtil.studyView)
      let locationToBrowser = gesture.locationInView(self.view)
      let locationToButton = gesture.locationInView(gesture.view)
      let buttonFrame = self.moveButton.frame
      let newY = locationToButton.y-translation.y 
      let newX = locationToButton.x-translation.x
      if (gesture.state !== 3 && (newY<buttonFrame.height+5 && newY>-5 && newX<buttonFrame.width+5 && newX>-5 && Math.abs(translation.y)<20 && Math.abs(translation.x)<20)) {
        self.locationToBrowser = {x:locationToBrowser.x-translation.x,y:locationToBrowser.y-translation.y}
        self.locationToButton = {x:newX,y:newY}
      }
    }
    self.moveDate = Date.now()
    let location = {x:locationToMN.x - self.locationToButton.x-gesture.view.frame.x,y:locationToMN.y -self.locationToButton.y-gesture.view.frame.y}

    // let location = excalidrawUtils.getNewLoc(gesture)
    let frame = self.view.frame
    var viewFrame = self.view.bounds;
    let studyFrame = MNUtil.studyView.bounds
    let y = location.y
    if (y<=0) {
      y = 0
    }
    if (y>=studyFrame.height-15) {
      y = studyFrame.height-15
    }
    let x = location.x
    if (!self.miniMode) {
      if (locationToMN.x<40) {
        self.toMinimode(MNUtil.genFrame(0,locationToMN.y,40,40))
        return
      }
      if (locationToMN.x>studyFrame.width-40) {
        self.toMinimode(MNUtil.genFrame(studyFrame.width-40,locationToMN.y,40,40))
        return
      }
    }else{
      if (locationToMN.x<50) {
        self.view.frame = MNUtil.genFrame(0,locationToMN.y-20,40,40)
        return
      }else if (locationToMN.x>studyFrame.width-50) {
        self.view.frame = MNUtil.genFrame(studyFrame.width-40,locationToMN.y-20,40,40)
        return
      }else if (locationToMN.x>50) {
        let preOpacity = self.view.layer.opacity
        self.view.layer.opacity = 0
        self.hideAllButton()
        MNUtil.animate(()=>{
          self.view.layer.opacity = preOpacity
          self.setFrame(x,y,self.lastFrame.width,self.lastFrame.height)
        }).then(()=>{
          self.moveButton.setImageForState(undefined,0)
          // self.runJavaScript(`Excalidraw.scrollToContent()`)
          self.moveButton.frame = MNUtil.genFrame(viewFrame.x + viewFrame.width*0.5-75,viewFrame.y+5,150,10)
          self.view.layer.borderWidth = 0
          // self.view.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
          self.view.hidden = false
          self.webview.hidden = false
          self.showAllButton()
          self.toolbar.hidden = false
          if (excalidrawConfig.toolbar) {
            self.homeButton.hidden = false
            self.engineButton.hidden = false
            self.webAppButton.hidden = false
          }
        })
        self.miniMode = false
        return
      }
    }
    
    if (self.custom) {
      // Application.sharedInstance().showHUD(self.custom, self.view.window, 2);
      self.customMode = "None"
      MNUtil.animate(()=>{
        self.setFrame(x,y,self.lastFrame.width,self.lastFrame.height)
      }).then(()=>{
        self.runJavaScript(`Excalidraw.scrollToContent()`)
      })
    }else{
      self.setFrame(x, y, frame.width,frame.height)
    }
    self.custom = false;
  },
  onResizeGesture:function (gesture) {
    self.custom = false;
    excalidrawConfig.dynamic = false;
    self.customMode = "none"
    let baseframe = gesture.view.frame
    let locationToBrowser = gesture.locationInView(self.view)
    let frame = self.view.frame
    let width = locationToBrowser.x+baseframe.width*0.5
    let height = locationToBrowser.y+baseframe.height*0.5
    if (width <= 385) {
      width = 385
    }
    if (height <= 200) {
      height = 200
    }
    //  Application.sharedInstance().showHUD(`{x:${translation.x},y:${translation.y}}`, self.view.window, 2);
    //  self.view.frame = {x:frame.x,y:frame.y,width:frame.width+translationX,height:frame.height+translationY}
    self.setFrame(frame.x, frame.y, width,height)
  }
});

/** @this {excalidrawController} */
excalidrawController.prototype.search = function(text) {
try {
  

  var url;
  url = excalidrawConfig.entries[excalidrawConfig.engine].link.replace('%s',text)
  this.searchButton.setTitleForState(excalidrawConfig.entries[excalidrawConfig.engine].symbol, 0);
  this.engineButton.setTitleForState(excalidrawConfig.entries[excalidrawConfig.engine].engine, 0);
  if (excalidrawConfig.entries[excalidrawConfig.engine].desktop) {
    this.webview.customUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15'
  }else{
    this.webview.customUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
  };
  if (this.webview.url !== url ) {
    MNConnection.loadRequest(this.webview, url)
    this.webview.hidden = this.miniMode
    if (!this.miniMode) {
      this.showAllButton()
    }
    this.searchedText = text
    return
  }else{
    if (excalidrawConfig.engine === "Youdao") {
      this.runJavaScript(`
      let containers = document.getElementsByClassName("trans-container")
      if (containers.length === 1) {
        containers[0].getElementsByClassName("trans-content")[0].textContent
      }else{
        containers[1].getElementsByClassName("basic")[0].textContent
      }`)
    }

  }
} catch (error) {
  MNUtil.showHUD(error)
}
};
/** @this {excalidrawController} */
excalidrawController.prototype.setToolbar = async function(state) {
  excalidrawConfig.toolbar = state
  this.webAppButton.hidden = !excalidrawConfig.toolbar
  // this.searchButton.hidden = !excalidrawConfig.toolbar
  this.homeButton.hidden = !excalidrawConfig.toolbar
  this.goBackButton.hidden = !excalidrawConfig.toolbar
  this.goForwardButton.hidden = !excalidrawConfig.toolbar
  this.refreshButton.hidden = !excalidrawConfig.toolbar
  // this.webAppEntriesButton.hidden = !excalidrawConfig.toolbar
  // this.screenButton.hidden = !excalidrawConfig.toolbar
  this.engineButton.hidden = !excalidrawConfig.toolbar

}

/** @this {excalidrawController} */
excalidrawController.prototype.updateDeeplOffset = async function() {
  if(!this.webview || !this.webview.window)return;
  // if (Application.sharedInstance().osType !== 1) {
  await this.runJavaScript(getWebJS("updateDeeplOffset"))
  // } else {
  //   this.webview.evaluateJavaScript(
  //     `document.querySelector("#gatsby-focus-wrapper > header").style.display = "none";
  //      document.querySelector("#gatsby-focus-wrapper > footer").style.display = "none";
  //      document.getElementsByClassName("TranslatorPage-module--otherSections--3cbQ7")[0].style.display = "none";`,
  //     (ret) => {}
  //   );
  // }
  let ret = await this.runJavaScript('document.getElementsByClassName("lmt__side_container--target")[0].getBoundingClientRect().top + document.body.scrollTop+document.documentElement.scrollTop;')
  if (ret && !isNaN(parseFloat(ret))) {
    this.webview.scrollView.contentOffset = {x: 0, y: parseFloat(ret) + 0};          
  } else {
    this.webview.scrollView.contentOffset = {x: 0, y: 130};          
  }
  // this.shouldCopy = false
  // this.shouldComment = false
};


/** @this {excalidrawController} */
excalidrawController.prototype.runJavaScript = async function(script,delay) {
  if(!this.webview || !this.webview.window)return;
  return new Promise((resolve, reject) => {
    if (delay) {
      this.viewTimer = NSTimer.scheduledTimerWithTimeInterval(delay, true, () => {
        this.webview.evaluateJavaScript(script,(result) => {resolve(result)});
      })
    }else{
      this.webview.evaluateJavaScript(script,(result) => {resolve(result)});
    }
  })
};
/**
 * 
 * @param {MNNote|MbBookNote} note 
 */
excalidrawController.prototype.setContent = function (note) {
  if (note) {
    this.editorNoteId = note.noteId
  }else{
    return
  }
  let title = note.noteTitle ?? ""
  if (title.trim()) {
    title = title.split(";").filter(t=>{
      if (/{{.*}}/.test(t)) {
        return false
      }
      return true
    }).join(";")
  }
  let excerptText = note.excerptText ?? ""
  let content = "# "+title+"\n\n"+excerptText
  // MNUtil.copy(MNUtil.notebookController.focusNote.noteTitle)
  this.runJavaScript(`setValue(\`${encodeURIComponent(content)}\`)`)
}
/**
 * 
 * @param {MNNote|MbBookNote} note 
 */
excalidrawController.prototype.clearContent = function () {
  this.editorNoteId = undefined
  this.runJavaScript(`setValue("")`)
  this.imageMD5s = []
}
/** @this {excalidrawController} */
excalidrawController.prototype.updateBilibiliOffset = function() {
  if(!this.webview || !this.webview.window)return;
  this.runJavaScript(`document.getElementsByClassName("recommended-swipe grid-anchor")[0].style.display = "none";`,0.5)
  this.shouldCopy = false
  this.shouldComment = false
};

/** @this {excalidrawController} */
excalidrawController.prototype.updateBilibiliPCOffset = function() {
  if(!this.webview || !this.webview.window)return;
  this.runJavaScript(`document.getElementById("biliMainHeader").style.display = "none";`,1)
  this.shouldCopy = false
  this.shouldComment = false
};

/** @this {excalidrawController} */
excalidrawController.prototype.updateThesaurusOffset = function() {
  if(!this.webview || !this.webview.window)return;
  this.viewTimer = NSTimer.scheduledTimerWithTimeInterval(2, true, () => {
    this.runJavaScript(getWebJS("updateThesaurusOffset"))
    this.viewTimer.invalidate();
  });
  this.shouldCopy = false
  this.shouldComment = false
};

/** @this {excalidrawController} */
excalidrawController.prototype.getCurrentURL = async function() {
  if(!this.webview || !this.webview.window) return;
  let url = await this.runJavaScript(`window.location.href`)
  this.webview.url = url
  return url
};
/** @this {excalidrawController} */
excalidrawController.prototype.getSelectedTextInWebview = async function() {
  let ret = await this.runJavaScript(`
      function getCurrentSelect(){

      let selectionObj = null, rangeObj = null;
      let selectedText = "", selectedHtml = "";

      if(window.getSelection){
        selectionObj = window.getSelection();
        selectedText = selectionObj.toString();
      }
      return selectedText
    };
      getCurrentSelect()
    `)
  return ret
}

/** @this {excalidrawController} */
excalidrawController.prototype.getTextInWebview = async function() {
  let ret = await this.runJavaScript(`
      function getSelectOrWholeText(){

      let selectionObj = null, rangeObj = null;
      let selectedText = "", selectedHtml = "";

      if(window.getSelection){
        selectionObj = window.getSelection();
        selectedText = selectionObj.toString();
        return selectedText === ""?document.body.innerText:selectedText
      }else{
        return document.body.innerText;
      }
    };
    getSelectOrWholeText()
    // document.body.innerHTML;
    `)
  return ret
}

/** @this {excalidrawController} */
excalidrawController.prototype.setButtonLayout = function (button,targetAction) {
    button.autoresizingMask = (1 << 0 | 1 << 3);
    button.setTitleColorForState(UIColor.whiteColor(),0);
    button.setTitleColorForState(this.highlightColor, 1);
    button.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8);
    button.layer.cornerRadius = 8;
    button.layer.masksToBounds = true;
    if (targetAction) {
      button.addTargetActionForControlEvents(this, targetAction, 1 << 6);
    }
    this.view.addSubview(button);
}

/** @this {excalidrawController} */
excalidrawController.prototype.createButton = function (buttonName,targetAction,superview) {
    this[buttonName] = UIButton.buttonWithType(0);
    this[buttonName].autoresizingMask = (1 << 0 | 1 << 3);
    this[buttonName].setTitleColorForState(MNUtil.hexColorAlpha("#5B57D1",1.0),0);
    this[buttonName].setTitleColorForState(this.highlightColor, 1);
    this[buttonName].backgroundColor = MNUtil.hexColorAlpha("#E3E2FE",1.0)
    this[buttonName].layer.cornerRadius = 8;
    this[buttonName].layer.masksToBounds = true;
    this[buttonName].layer.opacity = 0.8;
    this[buttonName].titleLabel.font = UIFont.systemFontOfSize(16);

    if (targetAction) {
      this[buttonName].addTargetActionForControlEvents(this, targetAction, 1 << 6);
    }
    if (superview) {
      this[superview].addSubview(this[buttonName])
    }else{
      this.view.addSubview(this[buttonName]);
    }
}

/** @this {excalidrawController} */
excalidrawController.prototype.settingViewLayout = function (){
    let viewFrame = this.view.bounds
    let width = viewFrame.width
    let height = viewFrame.height
    this.settingView.frame = {x:1,y:20,width:width-2,height:height-50}
    this.configView.frame = MNUtil.genFrame(0,40,width-2,height-60)
    this.advanceView.frame = MNUtil.genFrame(0,40,width-2,height-60)


    this.orderButton.frame = MNUtil.genFrame(10,20,width-20,35)
    this.textviewInput.frame = {x:10,y:height-255,width:width-22,height:155}
    this.uploadButton.frame = {x:width-87,y:height-130,width:70,height:25}
    this.deleteButton.frame = {x:width-162,y:height-130,width:70,height:25}
    this.moveUpButton.frame = {x:width-232,y:height-130,width:30,height:25}
    this.moveDownButton.frame = {x:width-197,y:height-130,width:30,height:25}

    this.scrollview.frame = {x:10,y:50,width:width-22,height:height-310}
    this.scrollview.contentSize = {width:width-22,height:height};
    this.newEntryButton.frame = {x:width-47,y:height-290,width:30,height:25}

    let settingFrame = this.settingView.bounds
    settingFrame.x = 5
    settingFrame.y = 5
    settingFrame.height = 40
    settingFrame.width = settingFrame.width-10
    this.tabView.frame = settingFrame
    settingFrame.width = 80
    settingFrame.y = 10
    settingFrame.x = 10
    settingFrame.height = 30
    this.configButton.frame = settingFrame
    settingFrame.x = 95
    settingFrame.width = 90
    this.advancedButton.frame = settingFrame
    settingFrame.x = width - 45
    settingFrame.width = 30
    this.closeConfig.frame = settingFrame
    settingFrame.width = 80
    settingFrame.x = 10
    settingFrame.y = 15
    this.configSearch.frame = settingFrame
    settingFrame.x = 95
    this.configWebApp.frame = settingFrame
    settingFrame.x = width-92
    this.configReset.frame = settingFrame
}

/** @this {excalidrawController} */
excalidrawController.prototype.createSettingView = function (){
try {
  

  this.configMode = 0
  this.configEngine = excalidrawConfig.engine
  this.settingView = UIView.new()
  this.settingView.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0.8)
  this.settingView.layer.cornerRadius = 13
  this.settingView.hidden = true
  this.view.addSubview(this.settingView)
  this.tabView = UIView.new()
  this.tabView.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
  this.tabView.layer.cornerRadius = 12
  this.settingView.addSubview(this.tabView)

  this.configView = UIView.new()
  this.configView.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.0)
  this.configView.layer.cornerRadius = 12
  this.settingView.addSubview(this.configView)

  this.advanceView = UIView.new()
  this.advanceView.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.0)
  this.advanceView.layer.cornerRadius = 12
  this.settingView.addSubview(this.advanceView)
  this.advanceView.hidden = true


  this.createButton("configButton","configButtonTapped:","settingView")
  this.configButton.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.configButton.layer.opacity = 1.0
  this.configButton.setTitleForState("Config",0)

  this.createButton("advancedButton","advancedButtonTapped:","settingView")
  // this.advancedButton.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.advancedButton.layer.opacity = 1.0
  this.advancedButton.setTitleForState("Advanced",0)

  this.createButton("closeConfig","closeConfigTapped:","settingView")
  this.closeConfig.setImageForState(excalidrawUtils.stopImage,0)
  this.closeConfig.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
  this.createButton("configSearch","configSearchTapped:","configView")
  this.configSearch.layer.opacity = 1.0
  this.configSearch.setTitleForState("Search",0)
  this.configSearch.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)

  this.createButton("configWebApp","configWebAppTapped:","configView")
  this.configWebApp.layer.opacity = 1.0
  this.configWebApp.setTitleForState("WebApp",0)

  this.createButton("configReset","resetConfig:","configView")
  this.configReset.layer.opacity = 1.0
  this.configReset.setTitleForState("Reset",0)

  this.createButton("orderButton","changeSearchOrder:","advanceView")
  this.orderButton.layer.opacity = 1.0
  this.orderButton.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.orderButton.setTitleForState(excalidrawUtils.getOrderText(excalidrawConfig.searchOrder),0)

  this.scrollview = UIScrollView.new()
  let viewFrame = this.view.bounds;
  this.configView.addSubview(this.scrollview)
  this.scrollview.hidden = false
  this.scrollview.delegate = this
  this.scrollview.bounces = true
  this.scrollview.alwaysBounceVertical = true
  this.scrollview.layer.cornerRadius = 8
  this.scrollview.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)
  this.textviewInput = UITextView.new()
  this.textviewInput.font = UIFont.systemFontOfSize(16);
  this.textviewInput.layer.cornerRadius = 8
  this.textviewInput.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)
  this.textviewInput.textColor = UIColor.blackColor()
  this.configView.addSubview(this.textviewInput)
  this.textviewInput.text = `Input here`
  this.textviewInput.bounces = true

  // let entries           = NSUserDefaults.standardUserDefaults().objectForKey('MNBrowser_entries');
  MNUtil.copyJSON(excalidrawConfig.engine)
  let text  = excalidrawConfig.entries[excalidrawConfig.engine]
      this.textviewInput.text = `{
  "title":   "${text.title}",
  "symbol":  "${text.symbol}",
  "engine":  "${text.engine}",
  "desktop": ${text.desktop},
  "link":    "${text.link}"
}`
  this.createButton("uploadButton","configSaveTapped:","configView")
  this.uploadButton.layer.opacity = 1.0
  this.uploadButton.setTitleForState("Save",0)
  this.createButton("deleteButton","configDeleteTapped:","configView")
  this.deleteButton.layer.opacity = 1.0
  this.deleteButton.setTitleForState("Delete",0)
  this.createButton("moveUpButton","configMoveUpTapped:","configView")
  this.moveUpButton.layer.opacity = 1.0
  this.moveUpButton.setTitleForState("⬆",0)
  this.createButton("moveDownButton","configMoveDownTapped:","configView")
  this.moveDownButton.layer.opacity = 1.0
  this.moveDownButton.setTitleForState("⬇",0)
  this.createButton("newEntryButton","configAddTapped:","configView")
  this.newEntryButton.layer.opacity = 1.0
  this.newEntryButton.setTitleForState("➕",0)
} catch (error) {
  MNUtil.showHUD(error)
}

}

/** @this {excalidrawController} */
excalidrawController.prototype.setButtonText = function (names,highlight) {
    this.words = names

    names.map((word,index)=>{
      if (!this["nameButton"+index]) {
        this.createButton("nameButton"+index,"toggleSelected:","scrollview")
        // this["nameButton"+index].index = index
        this["nameButton"+index].titleLabel.font = UIFont.systemFontOfSize(16);
      }
      this["nameButton"+index].hidden = false
      this["nameButton"+index].setTitleForState(this.configMode===0?excalidrawConfig.entries[word].title:excalidrawConfig.webAppEntries[word].title,0) 
      this["nameButton"+index].id = word

      if (word === highlight) {
        this["nameButton"+index].backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
      }else{
        this["nameButton"+index].backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8);
      }
      // this["nameButton"+index].titleEdgeInsets = {top:0,left:-100,bottom:0,right:-50}
      // this["nameButton"+index].setTitleForState(this.imagePattern[index]===this.textPattern[index]?` ${this.imagePattern[index]} `:"-1",0) 
    })
    // this.refreshLayout()
}
/** @this {excalidrawController} */
excalidrawController.prototype.setTextview = function (name) {
    if (this.configMode === 0) {
      // let entries           = NSUserDefaults.standardUserDefaults().objectForKey('MNBrowser_entries');
      let text  = excalidrawConfig.entries[name]
      this.textviewInput.text = `{
  "title":   "${text.title}",
  "symbol":  "${text.symbol}",
  "engine":  "${text.engine}",
  "desktop": ${text.desktop},
  "link":    "${text.link}"
}`
    }else{
      // let entries           = NSUserDefaults.standardUserDefaults().objectForKey('MNBrowser_webAppEntries');
      let text  = excalidrawConfig.webAppEntries[name]
      this.textviewInput.text = `{
  "title":   "${text.title}",
  "desktop": ${text.desktop},
  "link":    "${text.link}"
}`
    }

}
/** @this {excalidrawController} */
excalidrawController.prototype.setSplitScreenFrame = function (mode) {  
  let studyFrame = MNUtil.studyView.bounds
  let height = studyFrame.height;
  let width = studyFrame.width;
  let splitLine = MNUtil.splitLine ?? width/2.
  let targetFrame
  switch (mode) {
  case "left":
    this.view.frame = MNUtil.genFrame(40,0,splitLine-40,height)
    break;
  case "left13":
    this.view.frame = MNUtil.genFrame(40,0,width/3.+40,height)
    break;
  case "right":
    this.view.frame = MNUtil.genFrame(splitLine,0,width-splitLine-40,height)
    break;
  case "right13":
    this.view.frame = MNUtil.genFrame(width*2/3.-40,0,width/3.,height)
    break;
  case "full":
    this.view.frame = MNUtil.genFrame(40,0,width-80,height)
    break;
  default:
    break;
  }
  this.currentFrame = this.view.frame
}
/** @this {excalidrawController} */
excalidrawController.prototype.toMinimode = function (frame) {
  this.miniMode = true 
  excalidrawConfig.dynamic = false    
  this.lastFrame = this.view.frame 
  this.webview.hidden = true
  this.currentFrame  = this.view.frame
  this.hideAllButton()
  this.view.layer.borderWidth = 3
  this.view.layer.borderColor = MNUtil.hexColorAlpha("#9390e1",0.8)
  MNUtil.animate(()=>{
    this.setFrame(frame)
  }).then(()=>{
    this.moveButton.frame = MNUtil.genFrame(0,0,40,40)
    this.moveButton.hidden = false
    this.moveButton.setImageForState(excalidrawUtils.logo,0)
  })
}
/** @this {excalidrawController} */
excalidrawController.prototype.refreshLayout = function () {
  if (this.settingView.hidden) {
    let preOpacity = this.settingView.layer.opacity
    this.settingView.layer.opacity = 0.2
    // this.settingView.hidden = false
    this.settingView.layer.opacity = preOpacity
    var viewFrame = this.scrollview.bounds;
    var xLeft     = 0
    let initX = 10
    let initY = 10
    let initL = 0
    this.locs = [];
    this.words.map((word,index)=>{
      let title = this.configMode===0?excalidrawConfig.entries[word].title:excalidrawConfig.webAppEntries[word].title
      let width = strCode(title.replaceAll(" ",""))*9+15
      if (xLeft+initX+width > viewFrame.width-10) {
        initX = 10
        initY = initY+40
        initL = initL+1
      }
      this["nameButton"+index].frame = {  x: xLeft+initX,  y: initY,  width: width,  height: 30,};
      this.locs.push({
        x:xLeft+initX,
        y:initY,
        l:initL,
        i:index
      })
      initX = initX+width+10
    })
    if (this.lastLength && this.lastLength>this.words.length) {
      for (let index = this.words.length; index < this.lastLength; index++) {
        MNUtil.showHUD("index:"+index)
        this["nameButton"+index].hidden = true
      }
    }
    this.lastLength = this.words.length
    this.scrollview.contentSize= {width:viewFrame.width,height:initY+40}
  }else{
    var viewFrame = this.scrollview.bounds;
    var xLeft     = 0
    let initX = 10
    let initY = 10
    let initL = 0
    this.locs = [];
    this.words.map((word,index)=>{
      let title = this.configMode===0?excalidrawConfig.entries[word].title:excalidrawConfig.webAppEntries[word].title
      let width = strCode(title.replaceAll(" ",""))*9+15
      if (xLeft+initX+width > viewFrame.width-10) {
        initX = 10
        initY = initY+40
        initL = initL+1
      }
      this["nameButton"+index].frame = {  x: xLeft+initX,  y: initY,  width: width,  height: 30,};
      this.locs.push({
        x:xLeft+initX,
        y:initY,
        l:initL,
        i:index
      })
      initX = initX+width+10
    })
    if (this.lastLength && this.lastLength>this.words.length) {
      for (let index = this.words.length; index < this.lastLength; index++) {
        this["nameButton"+index].hidden = true
      }
    }
    this.lastLength = this.words.length
    this.scrollview.contentSize= {width:viewFrame.width,height:initY+40}
  
  }


}
/** @this {excalidrawController} */
excalidrawController.prototype.hideAllButton = function (frame) {
  this.moveButton.hidden = true
  this.closeButton.hidden = true
  this.maxButton.hidden = true
  this.minButton.hidden = true
  this.toolbar.hidden = true
}
/** @this {excalidrawController} */
excalidrawController.prototype.showAllButton = function (frame) {
  this.moveButton.hidden = false
  this.closeButton.hidden = false
  this.maxButton.hidden = false
  this.minButton.hidden = false
  this.toolbar.hidden = false
}
/** @this {excalidrawController} */
excalidrawController.prototype.show = function (frame,checkImage = false) {
  let preFrame = this.view.frame
  let studyFrame = MNUtil.studyView.frame
  if (preFrame.width > studyFrame.width) {
    preFrame.width = studyFrame.width
  }
  let preOpacity = this.view.layer.opacity
  // studyController().view.bringSubviewToFront(this.view)
  this.view.layer.opacity = 0.2
  if (frame) {
    this.setFrame(frame)
  }
  this.view.hidden = false
  if (this.miniMode) {
    this.webview.layer.borderWidth = 0
  }else{
    this.webview.layer.borderWidth = 3
  }
  this.miniMode = false
  this.webview.hidden = false
  this.hideAllButton()
  if (excalidrawConfig.toolbar) {
    this.engineButton.hidden = false
  }
  MNUtil.animate(()=>{
    this.view.layer.opacity = preOpacity
    this.setFrame(preFrame)
  }).then(()=>{
    MNUtil.studyView.bringSubviewToFront(this.view)
    this.moveButton.setImageForState(undefined,0)
    this.webview.layer.borderWidth = 0
    this.view.layer.borderWidth = 0
    this.webview.hidden = false
    this.showAllButton()
    if (!checkImage) {
      return;
    }
    let scrollToContent = false
    let focusNote = MNNote.getFocusNote()
    if (focusNote) {
      let imageData = excalidrawUtils.getImageFromNote(focusNote)
      if (imageData) {
        scrollToContent = true
        this.addImage(imageData,false)
      }
    }
    let imageData = MNUtil.getDocImage()
    if (imageData) {
      scrollToContent = true
      this.addImage(imageData,false)
    }
    if (scrollToContent) {
      this.scrollToContent()
    }
  })
}
/** @this {excalidrawController} */
excalidrawController.prototype.hide = function (frame) {
  let preFrame = this.view.frame
  let preOpacity = this.view.layer.opacity
  let preCustom = this.custom
  // let preFrame = this.view.frame
  this.webview.hidden = false
  if (this.settingView) {
    this.settingView.hidden = true
  }
  this.hideAllButton()
  this.custom = false
  if (frame) {
    this.webview.layer.borderWidth = 3
  }
  MNUtil.animate(()=>{
    this.view.layer.opacity = 0.2
    if (frame) {
      this.setFrame(frame)
    }
  }).then(()=>{
    this.view.hidden = true;
    this.view.layer.opacity = preOpacity      
    this.setFrame(preFrame)
    this.webview.layer.borderWidth = 0
    this.custom = preCustom
  })
}
/** @this {excalidrawController} */
excalidrawController.prototype.setFrame = function(x,y,width,height){
    if (typeof x === "object") {
      this.view.frame = x
    }else{
      this.view.frame = MNUtil.genFrame(x, y, width, height)
    }
    this.currentFrame = this.view.frame
  }

/** @this {excalidrawController} */
excalidrawController.prototype.exportToImage = async function (params) {
    let elements = await this.runJavaScript(`excalidrawAPI.getSceneElements()`)
    if (!excalidrawUtils.isNSNull(elements) && elements!="[]") {
      await this.runJavaScript(`
            (async function() {
              const result = await Excalidraw.getCanvas();
              window.myResult = result;
            })()`
      )
      let imageBase64 = await this.runJavaScript(`window.myResult`)
      let imageData = NSData.dataWithContentsOfURL(MNUtil.genNSURL(imageBase64))
      return imageData
    }
    MNUtil.showHUD("Capture image failed!")
    return undefined
}

/** @this {excalidrawController} */
excalidrawController.prototype.addImage = async function (imageData,scrollToContent) {
  if (!imageData) {
    return
  }
    let imageSize = UIImage.imageWithData(imageData).size
    let elementUUID = NSUUID.UUID().UUIDString()
    let imageBase64 = imageData.base64Encoding()
    let imageUUID = MNUtil.MD5(imageBase64)
    if (this.imageMD5s.includes(imageUUID)) {
      return
    }
    this.imageMD5s.push(imageUUID)
    // MNUtil.copy(imageData.base64Encoding())
    this.runJavaScript(`
    Excalidraw.addImage(\`${imageUUID}\`,\`data:image/png;base64,${imageBase64}\`)
    Excalidraw.updateScene(\`${elementUUID}\`,\`${imageUUID}\`,${imageSize.width*0.5},${imageSize.height*0.5})
    `)
    if (scrollToContent) {
      this.runJavaScript(`Excalidraw.scrollToContent()`)
    }
}
excalidrawController.prototype.scrollToContent = function () {
  this.runJavaScript(`Excalidraw.scrollToContent()`)
}