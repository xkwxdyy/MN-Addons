/** @return {browserController} */
const getBrowserController = ()=>self
var browserController = JSB.defineClass('browserController : UIViewController  <NSURLConnectionDelegate,UIWebViewDelegate>',{
  // /** @self {browserController} */
  viewDidLoad: function() {
  try {
    let self = getBrowserController()
    self.appInstance = Application.sharedInstance();
    self.custom = false;
    self.customMode = "None"
    self.miniMode = false;
    self.shouldCopy = false
    self.shouldComment = false
    self.preParseId = "123"
    self.selectedText = '';
    self.searchedText = '';
    self.webApp = "Bilibili"
    self.watchMode = false
    if (!(self.webApp in browserConfig.webAppEntries)) {
      self.webApp = browserConfig.webAppEntrieNames[0]
    }
    self.isLoading = false;
    self.view.frame = {x:50,y:50,width:(self.appInstance.osType !== 1) ? 419 : 365,height:450}
    self.lastFrame = self.view.frame;
    self.currentFrame = self.view.frame
    self.isMainWindow = true
    self.title = "main"
    self.test = [0]
    self.moveDate = Date.now()
    self.color = [true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true]
    self.view.layer.shadowOffset = {width: 0, height: 0};
    self.view.layer.shadowRadius = 15;
    self.view.layer.shadowOpacity = 0.5;
    self.view.layer.shadowColor = UIColor.colorWithWhiteAlpha(0.5, 1);
    self.view.layer.cornerRadius = 11
    self.view.layer.opacity = 1.0
    self.view.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
    self.view.layer.borderWidth = 0
    self.init()
  } catch (error) {
    browserUtils.addErrorLog(error, "viewDidLoad")
  }
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
  let self = getBrowserController()
    if (self.miniMode) {
      return
    }
    let buttonHeight = 28
    let buttonWidth = 35
    var viewFrame = self.view.bounds;
    var width    = viewFrame.width
    var height   = viewFrame.height
    self.closeButton.frame = MNUtil.genFrame(width-19,0,18,18)
    self.maxButton.frame = MNUtil.genFrame(width-44,0,18,18)
    self.minButton.frame = MNUtil.genFrame(width-69,0,18,18)
    let moveButtonHeight = 18

    if (browserConfig.toolbar) {
      self.toolbar.frame = MNUtil.genFrame(0, height-buttonHeight, width,buttonHeight)
      self.engineButton.frame = {x: width - 113,y: 0,width: 115,height: buttonHeight};
    }else{
      self.toolbar.frame = MNUtil.genFrame(0,height-buttonHeight-8,width,buttonHeight)
      self.engineButton.frame = {x: width - 45,y: 0,width: 40,height: buttonHeight};
    }
    self.buttonScrollview.frame = {x: 0,y: 0,width: width-116,height: buttonHeight};
    self.homeButton.frame = {  x: 114,  y: 0,  width:buttonWidth,  height: buttonHeight,};   
    self.webAppButton.frame = {  x: 152,  y: 0,  width: buttonWidth,  height: buttonHeight,};
    self.customButton1.frame = {  x: 190,  y: 0,  width: buttonWidth,  height: buttonHeight,};
    self.customButton2.frame = {  x: 228,  y: 0,  width: buttonWidth,  height: buttonHeight,};
    self.customButton3.frame = {  x: 266,  y: 0,  width: buttonWidth,  height: buttonHeight,};
    self.customButton4.frame = {  x: 304,  y: 0,  width: buttonWidth,  height: buttonHeight,};
    self.customButton5.frame = {  x: 342,  y: 0,  width: buttonWidth,  height: buttonHeight,};
    self.customButton6.frame = {  x: 380,  y: 0,  width: buttonWidth,  height: buttonHeight,};
    self.customButton7.frame = {  x: 418,  y: 0,  width: buttonWidth,  height: buttonHeight,};
    self.customButton8.frame = {  x: 456,  y: 0,  width: buttonWidth,  height: buttonHeight,};
    self.customButton9.frame = {  x: 494,  y: 0,  width: buttonWidth,  height: buttonHeight,};
    self.customButton10.frame = {  x: 532,  y: 0,  width: buttonWidth,  height: buttonHeight,};

    self.buttonScrollview.contentSize = {width: 570,height: buttonHeight};

    if (width <= 340) {
      // if (!self.onAnimate) {
      self.moveButton.frame = {x: width*0.5-75,y: 0,width: width*0.5,height: moveButtonHeight};
      // }
      self.moreButton.hidden = true
    }else if (width <= 375) {
      // if (!self.onAnimate) {
        self.moveButton.frame = {  x: width*0.5-75,  y: 0,  width: width*0.4,  height: moveButtonHeight};
      // }
      if (!self.onAnimate) {
        self.moreButton.hidden = false
      }
      self.moreButton.frame = {  x: width*0.9-70,  y: 0,  width: 25,  height: 18};
    }else{
        self.moveButton.frame = {  x: width*0.5-75,  y: 0,  width: 150,  height: moveButtonHeight};
      if (!self.onAnimate) {
        self.moreButton.hidden = false
      }
      self.moreButton.frame = {  x: width*0.5+80,  y: 0,  width: 25,  height: 18};
    }

    self.goBackButton.frame = {  x:0,  y: 0,  width: buttonWidth,  height: buttonHeight,};
    self.goForwardButton.frame = {  x:38,  y: 0,  width: buttonWidth,  height: buttonHeight,};
    self.refreshButton.frame = {  x: 76,  y: 0,  width: buttonWidth,  height: buttonHeight,};
    if (browserConfig.toolbar) {
      self.webview.frame = {x:0,y:9,width:width,height:height-42}
    }else{
      self.webview.frame = {x:0,y:9,width:width,height:height-12}
    }
    try {
      if (self.settingView) {
        self.settingViewLayout()
        self.refreshLayout()
      }
    } catch (error) {
      browserUtils.addErrorLog(error, "viewWillLayoutSubviews")
    }

  },

  webViewDidStartLoad: function(webView) {
    let currentURL = webView.request.URL().absoluteString();
    if (!currentURL) {return}
    let config = MNUtil.parseURL(webView.request.URL())
    // MNUtil.copy(config)
    if (config.url === "about:blank") {
      self.refreshButton.setImageForState(browserUtils.reloadImage,0)
      self.changeButtonOpacity(1.0)
      return
    }else{
      self.refreshButton.setImageForState(browserUtils.stopImage,0)
      self.changeButtonOpacity(0.5)
    }
    // MNUtil.showHUD("Start")
//         self.runJavaScript(`
// function clickButtonAfterVideoLoad(buttonSelector) {
// document.addEventListener('DOMContentLoaded', function () {
//     const button = document.querySelector(buttonSelector);
//     button.click();
// }
// clickButtonAfterVideoLoad('.bpx-player-ctrl-btn.bpx-player-ctrl-wide');
// `)
    if (/(notion.so)|(craft.do)/.test(currentURL)) {
      webView.url = currentURL
      self.refreshButton.setImageForState(browserUtils.reloadImage,0)
      self.changeButtonOpacity(1.0)
      return;
    }
    // var pasteBoard = UIPasteboard.generalPasteboard()
    // pasteBoard.string = currentURL
    if (/^https:\/\/www.thesaurus.com/.test(currentURL)) {
        self.updateThesaurusOffset()
      
    }
    // var pasteBoard = UIPasteboard.generalPasteboard()
    // pasteBoard.string = currentURL
    UIApplication.sharedApplication().networkActivityIndicatorVisible = true;
    // self.refreshButton.setTitleForState('✖️', 0);
  },
  /**
   * 
   * @param {UIWebView} webView 
   */
  webViewDidFinishLoad: async function(webView) {
    let self = getBrowserController()
    // MNUtil.log("webViewDidFinishLoad")
    MNUtil.stopHUD()

    // MNUtil.showHUD("message")
    // MNUtil.showHUD("Finish")
    self.webview.url = webView.request.URL().absoluteString();
    let currentURL = webView.request.URL().absoluteString()
    // MNUtil.log(currentURL)
    self.refreshButton.setImageForState(browserUtils.reloadImage,0)
    self.changeButtonOpacity(1.0)
    self.isLoading = false;
    UIApplication.sharedApplication().networkActivityIndicatorVisible = false;
    let config = MNUtil.parseURL(webView.request.URL())
    if (config.scheme === "about") {
      return
    }
    if (currentURL.startsWith("https://doc2x.noedgeai.com") && self.uploadOnDoc2X && self.uploadOnDoc2X.enabled) {
      let canDrop = await self.runJavaScript(`'ondrop' in document.createElement('div');`)
      if (!canDrop) {
        MNUtil.showHUD("Doc2X not support drag and drop")
        self.uploadOnDoc2X.enabled = true
        return
      }
      switch (self.uploadOnDoc2X.action) {
        case "uploadPDFToDoc2X":
          self.uploadOnDoc2X.enabled = false
          MNUtil.delay(1).then(()=>{
            self.uploadPDFToDoc2X()
          })
          break;
        case "uploadImageToDoc2X":
          self.uploadOnDoc2X.enabled = false
          MNUtil.delay(1).then(()=>{
            self.uploadImageToDoc2X()
          })
          break;
      }
      return
    }
    if (config.scheme === "https") {
      // MNUtil.copy(config)
      switch (config.host) {
        case "www.deepl.com":
          self.updateDeeplOffset()
          return;
        case "fanyi.baidu.com":
          self.updateDaiduTranslateOffset()
          return;
        case "zhuanlan.zhihu.com":
        case "www.zhihu.com":
          self.updateZhihuOffset()
          return;
        case "zhangyu1818.github.io":
          self.updateAppiconForgeOffset()
          return;
        case "m.bilibili.com":
          self.updateBilibiliOffset()
          return;
        case "www.bilibili.com":
          if (config.pathComponents[0] === "video") {
            self.currentBvid = config.pathComponents[1]
          }
          self.updateBilibiliOffset()
          return
        default:
          break;
      }
    }
    if (/https:\/\/www\.bilibili\.com\/.*/.test(self.webview.url)) {
      if (/https:\/\/www\.bilibili\.com\/video\/.*/.test(self.webview.url)) {
      // MNUtil.delay(1).then(()=>{
      //   self.runJavaScript(`document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-wide').click()`)
      // })
      
        // MNUtil.showHUD("message")
//         self.runJavaScript(`/**
//  * 在 video 标签加载完成后点击指定按钮
//  * @param {string} videoSelector - video 标签的选择器
//  * @param {string} buttonSelector - 按钮的选择器
//  */
// function clickButtonAfterVideoLoad(videoSelector, buttonSelector) {
//         // 监听 video 加载完成事件
//         document.addEventListener('loadeddata', () => {
//             console.log('视频加载完成，准备点击按钮');

//             // 获取按钮元素
//             const button = document.querySelector(buttonSelector);

//             if (button) {
//                 // 触发按钮的点击事件
//                 button.click();
//                 console.log('按钮已被点击');
//             } else {
//                 console.log('按钮未找到');
//             }
//         });
// }

// // 调用示例
// clickButtonAfterVideoLoad('video', '.bpx-player-ctrl-btn.bpx-player-ctrl-wide');

// `)

      }else{
        self.updateBilibiliOffset()
      }
      // let frame = self.view.frame
      // if (frame.width < 300) {
      //   frame.width = 720
      //   self.setFrame(frame)
      // }
      return;
    }
    if (/https\:\/\/.*\.bing\.com\/search.*/.test(self.webview.url)) {
        self.updateBingOffset()
    }
    if (self.webview.url === browserConfig.getConfig("homePage").url) {
      return
    }
    switch (browserConfig.engine) {
      case "Deepl":
        self.updateDeeplOffset()
        return
      case "BaiduTranslate":
        self.updateBaiduOffset()
        return
      case "ResearchGate":
        self.updateRGOffset()
        return
      case "Youdao":
        self.updateYoudaoOffset()
        return
      case "Thesaurus":
        self.updateThesaurusOffset()
        return
      default:
        break;
    }
  },
  webViewDidFailLoadWithError: function(webView, error) {
    // MNUtil.showHUD("789")
    self.refreshButton.setImageForState(browserUtils.reloadImage,0)
    // self.refreshButton.setTitleForState('🔄', 0);
    self.changeButtonOpacity(1.0)
    self.isLoading = false;
    // MNUtil.showHUD(error)
    // let errorInfo = {
    //   code:error.code,
    //   domain: error.domain,
    //   description: error.localizedDescription,
    //   userInfo: error.userInfo
    // }
    // MNUtil.copyJSON(errorInfo)

    // self.getCurrentURL()
    //UIApplication.sharedApplication().networkActivityIndicatorVisible = false;
    //var lan = NSLocale.preferredLanguages() ? NSLocale.preferredLanguages()[0].substring(0,2) : 'en';
    //if (lan == 'zh') {
    //  Application.sharedInstance().showHUD('错误', self.view.window, 2);
    //} else {
    //  Application.sharedInstance().showHUD('Failed to load DeepL translator, please try again later', self.view.window, 2);
    //}
  },
  /**
   * UIWebViewNavigationTypeLinkClicked   = 0,    // 用户点击链接,如下载文档
   * UIWebViewNavigationTypeFormSubmitted = 1,    // 表单提交
   * UIWebViewNavigationTypeBackForward   = 2,    // 前进/后退按钮操作
   * UIWebViewNavigationTypeReload        = 3,    // 刷新页面
   * UIWebViewNavigationTypeFormResubmitted = 4,  // 表单重新提交
   * UIWebViewNavigationTypeOther         = 5     // 其他方式
   * @param {UIWebView} webView 
   * @param {NSURLRequest} request 
   * @param {number} type
   * @returns 
   */
  webViewShouldStartLoadWithRequestNavigationType: function(webView,request,type){
  try {

    // MNUtil.log("webViewShouldStartLoadWithRequestNavigationType:"+type)
  //  https://qun.qq.com/universal-share/share?ac=1&authKey=7j5ESev4kHF%2BVOyv0MIP6xLGy7AxHqAv2aSo1zckqWUdLWKFloiCBbsmKsXAuvNY&busi_data=eyJncm91cENvZGUiOiI1MzkzMDUyMjciLCJ0b2tlbiI6IjA1c3R1azhjaVBvN1BmRUt6OGF5TXI0WEhzaEwrQ3IrN0k2ZklNU2tENnVjVzlRVlZSVFdFd3dPZGNCaG9LSlUiLCJ1aW4iOiIxNTE0NTAxNzY3In0%3D&data=g3UDk1OiVpEsWZsCg12Eau9l0pcVSSBZykMUIznWi8QSlSJfqWsr2m6VM4xiByyRC-t7sYSZmjr2z7s8dCsdxA&svctype=4&tempid=h5_group_info
  //  https://qm.qq.com/q/nuwBBTCwpi
    let currentURL = webView.request.URL().absoluteString()
    let requestURL = request.URL().absoluteString()
    // MNUtil.copy(requestURL)
    // MNUtil.log(requestURL)
    // if(requestURL === 'https://doc2x.noedgeai.com/markdownEdit'){
    //   MNUtil.log("reject")
    //   return false
    // }
    
    let config = MNUtil.parseURL(requestURL)
    switch (config.scheme) {
      case "zhihu":
        return false;
      case "bilibili":
        // MNUtil.log(config)
        self.runJavaScript(`document.getElementsByClassName("openapp-dialog")[0].style.display = "none";document.getElementsByClassName("openapp-btn")[0].style.display = "none";`)
        return false;
      case "blob":
        if (currentURL.startsWith("https://doc2x.noedgeai.com")) {
          self.base64FromBlob(requestURL)
          return false
        }
        if (currentURL.startsWith("https://moredraw.com") || currentURL.startsWith("http://moredraw.com")) {
          // MNUtil.showHUD("base64FromBlob")
          self.base64FromBlob(requestURL)
          return false
        }
        // MNUtil.copy(config)
        return false;
      case "http":
      case "https":
        self.inHomePage = false
        switch (config.host) {
            case "d.bilibili":
            case "d.bilibili.com":
              // MNUtil.log(config)
              if (config.params.preUrl){
                MNConnection.loadRequest(self.webview, config.params.preUrl)
              }
              // MNUtil.log("reject d.bilibili")
              return false
            case "oia.zhihu.com":
              return false
            case "oia.xiaohongshu.com":
              MNUtil.confirm("MN Utils", "Open Red Note?\n\n是否打开小红书？").then(async (confirm)=>{
                let deeplink = config.params.deeplink
                if (confirm) {
                  MNUtil.openURL(deeplink)
                }
              })
              return false
        
          default:
            break;
        }
        break;
      case "mqqapi":
        MNUtil.openURL(requestURL)
        return false;
      case "xhsdiscover":
      case "zhihu":
        return false
      case "zotero":
      case "marginnote3app":
      case "marginnote4app":
        MNUtil.openURL(requestURL)
        return false
      case "browser":
        switch (config.host) {
          case "showhud":
            self.showHUD(config.params.message)
            MNUtil.stopHUD()
            return false
          case "getpdfdata":
            // MNUtil.showHUD("getpdfdata")
            let tem = config.params.content.split(",")
            let type = self.fileTypeFromBase64(tem[0])
            switch (type) {
              case "pdf":
                if (currentURL.startsWith("https://doc2x.noedgeai.com")) {
                  self.importPDFFromBase64Doc2X(config.params.content,config.params.blobUrl)
                }
                if (currentURL.startsWith("https://moredraw.com") || currentURL.startsWith("http://moredraw.com")) {
                  self.importPDFFromBase64MoreDraw(config.params.content,config.params.blobUrl)
                }
                break;
              case "png":
              case "jpg":
                self.importImageFromBase64(config.params.content,config.params.blobUrl)
                break;
              default:
                self.showHUD("Unsupported file type: "+type)
                break;
            }
            // MNUtil.copy(tem[0])
            return false
          // MNUtil.copy(config)
//             self.runJavaScript(`// 手动使 Blob URL 失效
//             try {
              

// window.URL.revokeObjectURL("${config.params.blobUrl}");
//             } catch (error) {
//               error.message
//             }
// `).then(res => {
//   MNUtil.copy(res)
// })
            return false;
          case "downloadpdf":
            self.downloadPDF(config.params)
            return false
          case "openlink":
            MNConnection.loadRequest(webView, config.params.url)
            break;
          case "opensetting":
            self.openSetting()
            break;
          case "openshortcut":
            // let content = decodeURIComponent(requestURL.split("?content=")[1])
            let shortcutInfo = config.params
            self.setWebMode(shortcutInfo.desktop)
            self.inHomePage = false
            MNConnection.loadRequest(self.webview, shortcutInfo.url)
            break;
          case "changesearchengine":
            browserConfig.config.homePageEngine = config.params.content
            browserConfig.save("MNBrowser_config")
            break;
          case "copy":
            MNUtil.copy(config.params.content)
            break;
          case "search":
            let searchInfo = config.params
            self.search(searchInfo.text,searchInfo.engine)
            break;
          case "copyimage":
            let base64 = config.params.image
            let imageData = NSData.dataWithContentsOfURL(NSURL.URLWithString(base64))
            MNUtil.copyImage(imageData)
            MNUtil.postNotification("snipasteImage", {imageData:imageData})
            MNUtil.waitHUD("✅ Image copied")
            MNUtil.stopHUD()
            break;
          default:
            break;
        }
        return false
      default:
        break;
    }
    // MNUtil.copy(config)

    // MNUtil.showHUD("type:"+type)
    // MNUtil.copyJSON({currentURL:currentURL,requestURL:requestURL,type:type,time:Date.now()})
    let redirectInfo = browserUtils.checkRedirect(requestURL)
    if (redirectInfo.isRedirect) {
      // MNUtil.showHUD("Redirect to: "+redirectInfo.redirectURL)
      MNConnection.loadRequest(webView, redirectInfo.redirectURL)
      return false
    }
    // if (requestURL.startsWith("https://graph.qq.com/jsdkproxy/PMProxy.html")) {
    //   return false
    // }
    if (browserUtils.isAllowedIconLibrary(currentURL) && /data:image\/png;base64/.test(requestURL)) {
      //此时type为0
      MNUtil.postNotification("newIconImage", {imageBase64:requestURL})
      // let imageData = NSData.dataWithContentsOfURL(MNUtil.genNSURL(requestURL))
      // MNUtil.copyImage(imageData)
      return false
    }
    if (type === 0) {
      let isLink = browserUtils.parseLink(requestURL)
      if (isLink.isPdfDownload) {
        let fileName = isLink.fileName
        MNUtil.delay(0.1).then(async ()=>{
          let confirm = await MNUtil.confirm("Download doc ["+fileName+"]?", "是否要下载文档 ["+fileName+"]?")
          if (confirm) {
            MNUtil.showHUD("Downloading: "+fileName)
            await MNUtil.delay(0.1)
            let targetPath = browserUtils.mainPath+"/"+fileName
            let data = NSData.dataWithContentsOfURL(MNUtil.genNSURL(requestURL))
            data.writeToFileAtomically(targetPath, false)
            let docMd5 = MNUtil.importDocument(targetPath)
            if (typeof snipasteUtils !== 'undefined') {
              MNUtil.postNotification("snipastePDF", {docMd5:docMd5,currPageNo:1})
            }else{
              let confirm = await MNUtil.confirm("MN Browser", "Open document?\n\n是否直接打开该文档？\n\n"+fileName)
              if (confirm) {
                MNUtil.openDoc(md5,MNUtil.currentNotebookId)
                if (MNUtil.docMapSplitMode === 0) {
                  MNUtil.studyController.docMapSplitMode = 1
                }
              }
            }
            // MNUtil.openDoc(docMd5)
          }
        })
        // MNUtil.showHUD("Save to "+targetPath)
        return false
      }
    } 

    // MNUtil.copy(requestURL)
    if (requestURL.startsWith("https://s1.hdslb.com") && /https:\/\/www\.bilibili\.com\/video\/.*/.test(currentURL)) {
        self.runJavaScript(`
// 存储 interval ID
const intervalId = setInterval(() => {
  const wideButton = document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-wide');
  if (wideButton) {
    wideButton.click(); // 点击按钮
    clearInterval(intervalId); // 取消 interval
  }
}, 1000);

        `)
self.updateBilibiliOffset()
        // self.runJavaScript(`document.querySelector('.bpx-player-ctrl-btn.bpx-player-ctrl-wide').click()`)
      // MNUtil.showHUD("message")
    }
    // if (/^webaction\:\/\/showError/.test(requestURL)) {
    //   let error = decodeURIComponent(requestURL.split("showError=")[1])
    //   MNUtil.showHUD(error)
    //   return false
    // }

    if (browserUtils.shouldPrevent(currentURL,requestURL,type)) {
      // MNUtil.showHUD("prevent")
      MNConnection.loadRequest(self.webview, requestURL)
      return false
    }
    // if (requestURL.startsWith("https://www.bilibili.com")) {
    //   return false
    // }
    // MNUtil.copy(requestURL)
    return true;
    
  } catch (error) {
    browserUtils.addErrorLog(error, "webViewShouldStartLoadWithRequestNavigationType")
    return true 
  }
  },
  /**
   * 
   * @param {NSURLConnection} connection 
   * @param {NSURLResponse} response 
   * @returns 
   */
  connectionDidReceiveResponse: async function (connection,response) {
    MNUtil.showHUD("connectionDidReceiveResponse")
  },

  connectionDidReceiveData: async function (connection,data) {
    MNUtil.showHUD("connectionDidReceiveData")
  },
  connectionDidFinishLoading: function (connection) {
    MNUtil.showHUD("connectionDidFinishLoading")
  },
  connectionDidFailWithError: function (connection,error) {
    MNUtil.showHUD("connectionDidFailWithError")
  },
  changeScreen: function(sender) {
    if (sender.link) {
      MNConnection.loadRequest(self.webview, sender.link)
      return
    }
    var commandTable = [
        {title:'🌐 Copy as MD link',object:self,selector:'copyCurrentURLWithText:',param:'right'},
        {title:'🎚 Zoom',object:self,selector:'changeZoom:',param:sender}
      ];
    self.view.popoverController = MNUtil.getPopoverAndPresent(sender, commandTable,250,2)
  },
  moveButtonTapped: async function(sender) {
  
    if (self.miniMode) {
      let preFrame = self.view.frame
      self.view.hidden = true
      self.showAllButton()
      let studyFrame = MNUtil.studyView.bounds
      self.lastFrame.x = MNUtil.constrain(self.lastFrame.x, 0, studyFrame.width-self.lastFrame.width)
      self.lastFrame.y = MNUtil.constrain(self.lastFrame.y, 0, studyFrame.height-self.lastFrame.height)
      let color = this.desktop ? "#b5b5f5":"#9bb2d6"
      self.view.layer.backgroundColor = MNUtil.hexColorAlpha(color,0.8)
      self.view.layer.borderColor = MNUtil.hexColorAlpha(color,0.8)
      self.moveButton.setImageForState(undefined,0)
      self.setFrame(self.lastFrame)
      self.show(preFrame)
      return
    }
    let menu = new Menu(sender,self)
    menu.width = 250
    menu.preferredPosition = 1
    menu.addMenuItem('🎛  Setting', 'openSettingView:','right')
    menu.addMenuItem('📸  Screenshot', 'screenshot:',self.view.frame.width>1000?self.view.frame.width:1000)
    menu.addMenuItem('📸  Screenshot Full Page', 'screenshotFull:',self.view.frame.width>1000?self.view.frame.width:1000)
    menu.addMenuItem('📤  Export to PDF', 'exportToPDF:')
    menu.addMenuItem('🎬  VideoFrame → Clipboard', 'videoFrame:',self.view.frame.width>1000?self.view.frame.width:1000)
    menu.addMenuItem('🎬  VideoFrame → Snipaste', 'videoFrameToSnipaste:',self.view.frame.width>1000?self.view.frame.width:1000)
    menu.addMenuItem('🎬  VideoFrame → Editor', 'videoFrameToEditor:',self.view.frame.width>1000?self.view.frame.width:1000)
    menu.addMenuItem('🎬  VideoFrame → CurrentNote', 'videoFrameToNote:',false)
    menu.addMenuItem('🎬  VideoFrame → ChildNote', 'videoFrameToNote:',true)
    menu.addMenuItem('🎬  VideoFrame → NewNote', 'videoFrameToNewNote:',true)
    menu.addMenuItem('🎬  VideoFrame → NewComment', 'videoFrameToComment:',true)
    if ((await self.currentURLStartsWith("https://doc2x.noedgeai.com"))) {
      menu.addMenuItem('📤  Upload to Doc2X', 'uploadToDoc2X:',true)
    }
    menu.show()
    // var commandTable = [
    //     {title:'🎛  Setting',object:self,selector:'openSettingView:',param:'right'},
    //     {title:'📸  Screenshot',object:self,selector:'screenshot:',param:self.view.frame.width>1000?self.view.frame.width:1000},
    //     {title:'📸  Screenshot Full Page',object:self,selector:'screenshotFull:',param:self.view.frame.width>1000?self.view.frame.width:1000},
    //     {title:'🎬  VideoFrame → Clipboard',object:self,selector:'videoFrame:',param:self.view.frame.width>1000?self.view.frame.width:1000},
    //     {title:'🎬  VideoFrame → Snipaste',object:self,selector:'videoFrameToSnipaste:',param:self.view.frame.width>1000?self.view.frame.width:1000},
    //     {title:'🎬  VideoFrame → Editor',object:self,selector:'videoFrameToEditor:',param:self.view.frame.width>1000?self.view.frame.width:1000},
    //     {title:'🎬  VideoFrame → CurrentNote',object:self,selector:'videoFrameToNote:',param:false},
    //     {title:'🎬  VideoFrame → ChildNote',object:self,selector:'videoFrameToNote:',param:true},
    //     {title:'🎬  VideoFrame → NewNote',object:self,selector:'videoFrameToNewNote:',param:true},
    //     {title:'🎬  VideoFrame → NewComment',object:self,selector:'videoFrameToComment:',param:true},
    //     {title:'UploadToDoc2X',object:self,selector:'uploadToDoc2X:',param:true},
    //   ];
    // self.view.popoverController = MNUtil.getPopoverAndPresent(sender, commandTable,250,1)
  },
  changeBilibiliVideoPart: async function (button) {
    let self = getBrowserController()
    Menu.dismissCurrentMenu()
    self.changeBilibiliVideoPart(button)
    // let encodedPartInfo = await self.runJavaScript(`    
    // function getPartInfo() {
    //   let list = document.getElementsByClassName("video-pod__list multip list")[0]
    //   if (!list) {
    //     return []
    //   }
    //   let items = list.getElementsByClassName("simple-base-item video-pod__item")
    //   let partInfo = []
    //   for (let i = 0; i < items.length; i++) {
    //     let item = items[i]
    //     let title = item.getElementsByClassName("title")[0].textContent.trim()
    //     let time = item.getElementsByClassName("stats")[0].textContent.trim()
    //     let times = time.split(":")
    //     let minutes = parseInt(times[0])
    //     let seconds = parseInt(times[1])
    //     let totalSeconds = minutes*60+seconds

    //     if (item.classList.contains("active")) {
    //       partInfo.push({title:title,time:time,active:true,totalSeconds:totalSeconds})
    //     }else{
    //       partInfo.push({title:title,time:time,active:false,totalSeconds:totalSeconds})
    //     }
    //   }
    //   console.log(partInfo)
      
    //   return encodeURIComponent(JSON.stringify(partInfo))
    // }
    // getPartInfo()
    // `)
    // let partInfo = JSON.parse(decodeURIComponent(encodedPartInfo))
    // if (partInfo.length) {
    //   // MNUtil.copy(partInfo)
    //   let menu = new Menu(button,self)
    //   let selector = "changePart:"
    //   partInfo.forEach((part,index)=>{
    //     menu.addMenuItem(part.title+" ("+part.time+")", selector,index+1,part.active)
    //   })
    //   menu.show()
    // }else{
    //   MNUtil.showHUD("No video part found")
    // }


  },
  changePart: async function (params) {
  try {
    let self = getBrowserController()
    Menu.dismissCurrentMenu()
    if ("bvid" in params) {
      self.openOrJump(params.bvid,0,params.p)
    }else{
      self.openOrJump(self.currentBvid, 0, params.p)
    }
    
  } catch (error) {
    browserUtils.addErrorLog(error, "changePage")
  }
  },
  uploadToDoc2X: async function (params) {
    let self = getBrowserController()
    Menu.dismissCurrentMenu()
    let currentURL = await self.getCurrentURL()
    let currentImage = browserUtils.getCurrentImage()
    // MNUtil.copy(currentImage)
    if (currentImage) {
      self.uploadImageToDoc2X(currentImage)
      // self.waitHUD("Uploading file...")
      // await MNUtil.delay(0.1)
      // let fileName = "image.png"
      // let fileBase64 = currentImage.base64Encoding().replace(/"/g, '\\"')
      // self.uploadImageToDoc2X(fileBase64, fileName)
      // await MNUtil.stopHUD(0.5)
      // currentURL = await self.getCurrentURL()
      // while (!currentURL.startsWith("https://doc2x.noedgeai.com/ocr?parseId_0=")) {
      //   await MNUtil.delay(0.5)
      //   currentURL = await self.getCurrentURL()
      // }
      // await MNUtil.delay(0.5)
      // self.runJavaScript(`
      // async function hideOriginalView() {
      //   async function delay(seconds) {
      //     return new Promise(resolve => setTimeout(resolve, seconds * 1000));
      //   }
      //   await delay(0.5);
      //   document.getElementsByClassName("ant-splitter-panel")[0].style.display='none';
      //   await delay(0.5);
      //   document.getElementsByClassName("ant-splitter-panel")[0].style.display='none';
      //   await delay(0.5);
      //   document.getElementsByClassName("ant-splitter-panel")[0].style.display='none';
      //   await delay(0.5);
      //   document.getElementsByClassName("ant-splitter-panel")[0].style.display='none';
      // }
      // hideOriginalView();
      // `)
    }else{
      self.uploadPDFToDoc2X()
    }
    return
    // MNUtil.copy(currentURL)
    if (currentURL === "https://doc2x.noedgeai.com/") {

    }else if (currentURL === "https://doc2x.noedgeai.com/ocrUpload") {
      self.waitHUD("Uploading file...")
      await MNUtil.delay(0.1)
      let currentImage = MNUtil.currentSelection.image
      let fileName = "image.png"
      let fileBase64 = currentImage.base64Encoding().replace(/"/g, '\\"')
      self.uploadImageToDoc2X(fileBase64, fileName)
      MNUtil.stopHUD(0.5)
    }else{
      // await self.runJavaScript(`window.location.href = 'https://doc2x.noedgeai.com/ocrUpload'`)
      // currentURL = await self.getCurrentURL()
      // while (currentURL !== "https://doc2x.noedgeai.com/ocrUpload") {
      //   await MNUtil.delay(0.1)
      //   currentURL = await self.getCurrentURL()
      // }
      // MNUtil.copy(currentURL)
      await MNUtil.delay(0.1)
      let currentImage = MNUtil.currentSelection.image
      let fileName = "image.png"
      let fileBase64 = currentImage.base64Encoding().replace(/"/g, '\\"')
      self.uploadImageToDoc2X(fileBase64, fileName)
    }
    // if (!currentURL.startsWith("https://doc2x.noedgeai.com")) {
    //   MNUtil.showHUD("Please open Doc2X first")
    //   return
    // }
  },
  onLongPress: async function(gesture) {
    if (gesture.state === 1) {
      let url = await self.getCurrentURL()
      MNUtil.input("输入URL", url, ["Cancel","Open in mobile mode","Open in desktop mode","Copy current url","Open copied url"]).then((value)=>{
        let input = value.input
        let button = value.button
        switch (button) {
          case 0:
            break;
          case 1:
            self.setWebMode(false)
            if (/https?:/.test(input)) {
              MNConnection.loadRequest(self.webview, input)
            }else{
              MNConnection.loadRequest(self.webview, "https://"+input)
            }
            MNUtil.showHUD("Open: "+input)
            break;
          case 2:
            self.setWebMode(true)
            if (/https?:/.test(input)) {
              MNConnection.loadRequest(self.webview, input)
            }else{
              MNConnection.loadRequest(self.webview, "https://"+input)
            }
            MNUtil.showHUD("Open: "+input)
            break;
          case 3:
            MNUtil.copy(url)
            MNUtil.showHUD("Copied to clipboard")
            break;
          case 4:
            MNConnection.loadRequest(self.webview, MNUtil.clipboardText)
            break;
          default:
            break;
        }
      })
      // self.onAnimate = true
      // let frame = self.view.frame
      // self.moveButton.frame = MNUtil.genFrame(10,20,frame.width-20,40)

      // MNUtil.showHUD("LongPress begin")
    }
    // if (gesture.state === 3) {
    //   self.onAnimate = false
    //   MNUtil.showHUD("LongPress end")
    //   self.view.setNeedsLayout()
    // }
  },
  onLongPressSearch: async function(gesture) {
    if (gesture.state === 1) {
      var commandTable = browserConfig.entrieNames.map(entrieName => {
        return {title:browserConfig.entries[entrieName].title,object:self,selector:'searchWithEngine:',param:entrieName,checked:browserConfig.engine===entrieName}
      })
      commandTable.push({title:'🎛  Setting',object:self,selector:'openSettingView:',param:'engine'})
      self.view.popoverController = MNUtil.getPopoverAndPresent(gesture.view, commandTable,200,2)
    }
  },
  onLongPressRefresh: async function(gesture) {
    if (gesture.state === 1) {
      self.showHUD("Reload webview")
      self.createWebview()
      self.homePage()
      self.view.bringSubviewToFront(self.moveButton)
      self.view.bringSubviewToFront(self.moreButton)
      self.view.bringSubviewToFront(self.maxButton)
      self.view.bringSubviewToFront(self.minButton)
      self.view.bringSubviewToFront(self.closeButton)
    }
  },
  changeEngine: function(sender) {
    var commandTable = browserConfig.entrieNames.map(entrieName => {
      return {title:browserConfig.entries[entrieName].title,object:self,selector:'searchWithEngine:',param:entrieName,checked:browserConfig.engine===entrieName}
    })
    commandTable.push({title:'🎛  Setting',object:self,selector:'openSettingView:',param:'engine'})
    self.view.popoverController = MNUtil.getPopoverAndPresent(sender, commandTable,200,2)
  },
  changeWebApp: function(sender) {
    var commandTable = browserConfig.webAppEntrieNames.map(entrieName => {
      return {title:browserConfig.webAppEntries[entrieName].title,object:self,selector:'changeWebAppTo:',param:entrieName,checked:self.webApp === entrieName}
    })
    if (self.inHomePage) {
      commandTable.push({title:'🎛  Setting',object:self,selector:'openSettingView:',param:'webApp'})
    }else{
      commandTable.push({title:'➕  Add this page',object:self,selector:'addPageToWebApp:',param:'123'})
      commandTable.push({title:'🎛  Setting',object:self,selector:'openSettingView:',param:'webApp'})
    }
    self.view.popoverController = MNUtil.getPopoverAndPresent(sender, commandTable,200)
  },
  changeOpacity: function(slider) {
    self.view.layer.opacity = slider.value
    self.opacityButton.setTitleForState("Opacity: "+(slider.value*100).toFixed(1)+"%",0)
  },
  changeZoom: function(sender) {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    var commandTable = [
      {title:'175%',object:self,selector:'changeZoomTo:',param:1.75},
      {title:'150%',object:self,selector:'changeZoomTo:',param:1.5},
      {title:'125%',object:self,selector:'changeZoomTo:',param:1.25},
      {title:'100%',object:self,selector:'changeZoomTo:',param:1.0},
      {title:'75%', object:self,selector:'changeZoomTo:',param:0.75},
      {title:'50%', object:self,selector:'changeZoomTo:',param:0.5}
    ];
    self.view.popoverController = MNUtil.getPopoverAndPresent(sender, commandTable,100,1)
  },
  changeSearchOrder: function(sender) {
    var commandTable = [
      {title:'Title → Excerpt → Comment',object:self,selector:'setSearchOrder:',param:[1,2,3],checked:browserConfig.searchOrder==[1,2,3]},
      {title:'Title → Comment → Excerpt',object:self,selector:'setSearchOrder:',param:[1,3,2],checked:browserConfig.searchOrder==[1,3,2]},
      {title:'Excerpt → Title → Comment',object:self,selector:'setSearchOrder:',param:[2,1,3],checked:browserConfig.searchOrder==[2,1,3]},
      {title:'Excerpt → Comment → Title',object:self,selector:'setSearchOrder:',param:[2,3,1],checked:browserConfig.searchOrder==[2,3,1]},
      {title:'Comment → Title → Excerpt',object:self,selector:'setSearchOrder:',param:[3,1,2],checked:browserConfig.searchOrder==[3,1,2]},
      {title:'Comment → Excerpt → Title',object:self,selector:'setSearchOrder:',param:[3,2,1],checked:browserConfig.searchOrder==[3,2,1]},
    ];
    self.view.popoverController = MNUtil.getPopoverAndPresent(sender, commandTable,300)
  },
  changeCustomButton: function(button){
    if (browserUtils.checkSubscribe(false)) {
      var commandTable = browserConfig.allCustomActions.map(action=>{
        return {title:browserConfig.getCustomDescription(action),object:self,selector:'setCustomAction:',param:{index:button.index,action:action}}
      })
      self.view.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,300,1)
    }
  },
  setCustomAction: function(config){
    if (browserUtils.checkSubscribe(true)) {
      if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
      if (config.index === 1) {
        browserConfig.config.custom = config.action
        // self["setCustomButton"+config.index].setTitleForState("Custom"+config.index+": "+browserConfig.getConfig("custom"),0)
        self["setCustomButton"+config.index].setTitleForState("Custom"+config.index+": "+browserConfig.getCustomDescription(config.action),0)
      }else{
        browserConfig.config["custom"+config.index] = config.action
        self["setCustomButton"+config.index].setTitleForState("Custom"+config.index+": "+browserConfig.getCustomDescription(config.action),0)
      }
      browserConfig.save("MNBrowser_config")
      self["customButton"+config.index].setTitleForState(browserConfig.getCustomEmoji(config.index))
    }
  },
  toggleTimestampeDetail: function (params) {
    let timestampDetail = !browserConfig.getConfig("timestampDetail")
    browserConfig.config.timestampDetail = timestampDetail
    self.timestampDetail.setTitleForState("Timestamp Detail: "+(timestampDetail?"✅":"❌"),0)
    browserConfig.save("MNBrowser_config")
  },
  toggleAutoOpenVideoExcerpt: function (params) {
    if (!browserUtils.checkSubscribe(true)) {
      return undefined
    }
    let autoOpenVideoExcerpt = !browserConfig.getConfig("autoOpenVideoExcerpt")
    browserConfig.config.autoOpenVideoExcerpt = autoOpenVideoExcerpt
    self.autoOpenVideoExcerpt.setTitleForState("Auto Open Video Excerpt: "+(autoOpenVideoExcerpt?"✅":"❌"),0)
    browserConfig.save("MNBrowser_config")
  },
  toggleAutoExitWatchMode: function (params) {
    if (!browserUtils.checkSubscribe(true)) {
      return undefined
    }
    let autoExitWatchMode = !browserConfig.getConfig("autoExitWatchMode")
    browserConfig.config.autoExitWatchMode = autoExitWatchMode
    self.autoExitWatchMode.setTitleForState("Auto Exit Watch Mode: "+(autoExitWatchMode?"✅":"❌"),0)
    browserConfig.save("MNBrowser_config")
  },
  setSearchOrder:function (order) {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    browserConfig.searchOrder = order
    self.orderButton.setTitleForState(browserUtils.getOrderText(browserConfig.searchOrder),0)
    browserConfig.save("MNBrowser_searchOrder")
  },
  changeZoomTo:function (zoom) {
    self.runJavaScript(`document.body.style.zoom = ${zoom}`)
  },
  openSettingView:function (targetView) {
    Menu.dismissCurrentMenu()
    self.openSetting(targetView)
  },
  toggleToolbar:function (opacity) {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
try {
  

    browserConfig.toolbar = !browserConfig.toolbar
    self.buttonScrollview.hidden = !browserConfig.toolbar
    self.updateEngineButton()
} catch (error) {
  browserUtils.addErrorLog(error, "toggleToolbar")
}
    var viewFrame = self.view.bounds;
    MNUtil.animate(()=>{
      if (browserConfig.toolbar) {
        self.webview.frame = {x:viewFrame.x,y:viewFrame.y+10,width:viewFrame.width,height:viewFrame.height-40}
      }else{
        self.webview.frame = {x:viewFrame.x,y:viewFrame.y+10,width:viewFrame.width,height:viewFrame.height}
      }
    })
    browserConfig.save("MNBrowser_toolbar")
  },
  toggleWatchMode:function (param) {
    Menu.dismissCurrentMenu()
    self.watchMode = !self.watchMode
    if (self.watchMode) {
      self.showHUD("✅ Watch Mode: ON")
    }else{
      self.showHUD("❌ Watch Mode: OFF")
    }
  },
  toggleDesktop:function (param) {
    let self = getBrowserController()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    if (self.desktop) {
      self.setWebMode(false)
    }else{
      self.setWebMode(true)
    }
    if (!self.inHomePage) {
      let newURL = self.webview.url.replace("www.baidu","m.baidu")
      MNConnection.loadRequest(self.webview, newURL)
    }
    return;
    // // self.view.popoverController.dismissPopoverAnimated(true);
    // let desktop
    // switch (param) {
    //   case "engine":
    //     browserConfig.entries[browserConfig.engine].desktop = !browserConfig.entries[browserConfig.engine].desktop
    //     desktop = browserConfig.entries[browserConfig.engine].desktop;
    //     browserConfig.save("MNBrowser_entries")
    //     break;
    //   case "webApp":
    //     browserConfig.webAppEntries[self.webApp].desktop = !browserConfig.webAppEntries[self.webApp].desktop
    //     desktop = browserConfig.webAppEntries[self.webApp].desktop;
    //     browserConfig.save("MNBrowser_webAppEntries")
    //     break;
    //   default:
    //     break;
    // }
    // if (desktop) {
    //   self.setWebMode(true)
    //   if (param === "engine" && browserConfig.engine === "Baidu") {
    //     let newURL = self.webview.url.replace("m.baidu","www.baidu")
    //     MNConnection.loadRequest(self.webview, newURL)
    //     return;
    //   }
    // }else{
    //   self.setWebMode(false)
    //   if (param === "engine" && browserConfig.engine === "Baidu") {
    //     let newURL = self.webview.url.replace("www.baidu","m.baidu")
    //     MNConnection.loadRequest(self.webview, newURL)
    //     return;
    //   }
    // }

    // self.webview.reload();
  },
  searchWithEngine: function (engine) {
    browserConfig.engine = engine
    browserConfig.save("MNBrowser_engine")
    if (self.selectedText.length) {
      self.search(self.selectedText) 
    }else{
      self.search(self.searchedText)//用户可能只是想换个搜索引擎再次搜索
    }
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}

    // self.view.popoverController.dismissPopoverAnimated(true);
  },
  openInNewWindow: function (url) {
    self.checkPopover()
    Menu.dismissCurrentMenu()
    if (browserUtils.checkSubscribe()) {
      if (self.inHomePage) {
        MNUtil.postNotification('newWindow', {homePage:true})
      }else{
        MNUtil.postNotification('newWindow', {url:url,desktop:self.desktop,engine:browserConfig.engine,webApp:self.webApp})
        self.homePage();
      }
    }
  },
  openNewWindow: function (url) {
    self.checkPopover()
    Menu.dismissCurrentMenu()
    if (browserUtils.checkSubscribe()) {
      MNUtil.postNotification('newWindow', {homePage:true})
    }
  },
  openInBrowser: async function (engine) {
    Menu.dismissCurrentMenu()
    let url = await self.getCurrentURL()
    MNUtil.openURL(url)
  },
  copyCurrentURL: async function (engine) {
    Menu.dismissCurrentMenu()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    let url = await self.getCurrentURL()
    MNUtil.copy(url)
    self.showHUD("链接已复制")
  },
  copyCurrentURLWithText: async function(){
    Menu.dismissCurrentMenu()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    let url = await self.getCurrentURL()
    let text = await self.getSelectedTextInWebview()
    MNUtil.copy(`[${text}](${url})`)
    self.showHUD("链接已复制")
  },
  bigbang: async function(){
    Menu.dismissCurrentMenu()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    let url = await self.getCurrentURL()
    let text = await self.getTextInWebview()
    MNUtil.postNotification('bigbangText', {text:text,url:url})
  },
  openCopiedURL: function (engine) {
    Menu.dismissCurrentMenu()
    MNConnection.loadRequest(self.webview, MNUtil.clipboardText)
  },
  resetConfig: async function (engine) {
    let confirm = await MNUtil.confirm("Reset config?", "重置配置？")
    if (!confirm) {
      return
    }
    if (self.configMode===0) {
      browserConfig.entries = browserConfig.defaultEntries
      // MNUtil.copyJSON(browserConfig.defaultEntries)
      browserConfig.entrieNames = Object.keys(browserConfig.entries)
      browserConfig.engine = browserConfig.entrieNames[0]
      self.updateEngineButton()
      self.setButtonText(browserConfig.entrieNames,browserConfig.engine)
      self.refreshLayout()
      self.setTextview(browserConfig.engine)
      browserConfig.remove("MNBrowser_entrieNames")
      browserConfig.remove("MNBrowser_entries")
      browserConfig.remove("MNBrowser_engine")
    }else{
      browserConfig.webAppEntries = browserConfig.defaultWebAppEntries
      browserConfig.webAppEntrieNames = Object.keys(browserConfig.webAppEntries)
      self.webApp = browserConfig.webAppEntrieNames[0]
      self.setButtonText(browserConfig.webAppEntrieNames,self.webApp)
      self.refreshLayout()
      self.setTextview(self.webApp)
      browserConfig.remove("MNBrowser_webAppEntrieNames")
      browserConfig.remove("MNBrowser_webAppEntries")
      browserConfig.remove("MNBrowser_webApp")
    }
  },
  uploadConfig: function (engine) {

    let note = MNUtil.getNoteById(self.currentNoteId)
    let customEntries
    let commentsLength = note.comments.length
    if (commentsLength === 0) {
      Application.sharedInstance().showHUD("No comments found",self.view.window,2)
      return;
    }
    try {
      let comment = note.comments[0].text.replaceAll(`”`,`"`).replaceAll(`“`,`"`)
      customEntries = JSON.parse(comment)
      if (!Object.keys(customEntries).length) {
        Application.sharedInstance().showHUD("Invalid config",self.view.window,2)
        return;
      }
      // Application.sharedInstance().showHUD(Object.keys(customEntries).length,self.view.window,2)
    } catch (error) {
      browserUtils.addErrorLog(error, "uploadConfig")
      return;
    }
    let uploadLog = [];
    if (customEntries.Search) {
      uploadLog.push(`"Search"`)
      browserConfig.entries = customEntries.Search
      browserConfig.entrieNames = Object.keys(browserConfig.entries)
      browserConfig.engine = browserConfig.entrieNames[0]
      self.updateEngineButton()
      browserConfig.save("MNBrowser_entrieNames")
      browserConfig.save("MNBrowser_entries")
      browserConfig.save("MNBrowser_engine")
    }
    if (customEntries.WebApp) {
      uploadLog.push(`"WebApp"`)
      browserConfig.webAppEntries = customEntries.WebApp
      browserConfig.webAppEntrieNames = Object.keys(browserConfig.webAppEntries)
      self.webApp = browserConfig.webAppEntrieNames[0]
      browserConfig.save("MNBrowser_webAppEntrieNames")
      browserConfig.save("MNBrowser_webAppEntries")
    }
    if (uploadLog.length) {
      self.showHUD("Upload config of "+uploadLog.join(" and ")+" success!")
    }else{
      self.showHUD('Entries of "Search" or "WebApp" not found')
    }
  },
  screenshotTem: async function (width) {
    Menu.dismissCurrentMenu()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    MNUtil.waitHUD("Screenshot")
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
                window.location.href = 'browser://showhud?message=库尚未加载完成，请稍后再试'
                return;
            }

            console.log('开始截图...');

            // 使用 html2canvas 截取整个 body
            // 你可以根据需要调整截图的配置参数
            html2canvas(document.body, {
    scale: 3,
    allowTaint: true,
    useCORS: true,
    // 关键修改：使用视口尺寸而非整个文档尺寸
    windowWidth: window.innerWidth, 
    windowHeight: window.innerHeight,
    // 移除 scrollY 偏移（避免重复校正）
    scrollX: 0,  
    scrollY: 0,
    // 可选：精确截取视口区域
    x: window.scrollX, 
    y: window.scrollY,
    width: window.innerWidth,
    height: window.innerHeight
            }).then(canvas => {
                console.log('截图完成！');
                // 将 canvas 转换为图片
                const image = canvas.toDataURL('image/jpeg',0.8); // 压缩图片大小
                window.location.href = 'browser://copyimage?image='+image
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
  },
  exportToPDF: async function () {
    Menu.dismissCurrentMenu()
    self.waitHUD("Exporting PDF...")
    await MNUtil.delay(0.1)
self.runJavaScript(browserUtils.getSubFuncScript()+`
async function exportToPDF() {
    // 检查 html2canvas 是否已定义，如果未定义则加载
  if (typeof html2canvas === 'undefined') {
      console.log('html2canvas 未加载，正在动态加载...');
      loadHtml2CanvasScript( async () => {
          // 加载完成后执行截图
          let image = await screenshotToPNGBase64();
          if (typeof jsPDF === 'undefined') {
            loadJSPDFScript( async () => {
              const pdfBase64 = await convertPngBase64ToPdfBase64(image,true);
              postMessageToAddon("browser","downloadpdf",undefined,{"pdfBase64":pdfBase64})
            });
          }else{
            const pdfBase64 = await convertPngBase64ToPdfBase64(image,true);
            postMessageToAddon("browser","downloadpdf",undefined,{"pdfBase64":pdfBase64})
          }
      });
  } else {
      console.log('html2canvas 已加载，直接执行截图。');
      // 如果已加载，则直接执行截图
      let image = await screenshotToPNGBase64()
      if (typeof jsPDF === 'undefined') {
        loadJSPDFScript( async () => {
          const pdfBase64 = await convertPngBase64ToPdfBase64(image,true);
          postMessageToAddon("browser","downloadpdf",undefined,{"pdfBase64":pdfBase64})
        });
      }else{
        const pdfBase64 = await convertPngBase64ToPdfBase64(image,true);
        postMessageToAddon("browser","downloadpdf",undefined,{"pdfBase64":pdfBase64})
      }
  }
}
exportToPDF()
        `)
  },
  /**
   * 截取整个网页
   * @param {*} width 
   */
  screenshotFull: async function (width) {
    Menu.dismissCurrentMenu()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    MNUtil.waitHUD("Screenshot full page")
    // MNUtil.showHUD("screenshot")
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
            script.onerror = (e) => {
                window.location.href = 'browser://showhud?message='+encodeURIComponent('加载失败'+url)
                console.error(url + ' 加载失败');
            };
    

            document.head.appendChild(script); // 或者 document.body.appendChild(script);
        }

        // 截图函数
        function captureScreenshot() {
            // 检查 html2canvas 是否已加载
            if (typeof html2canvas === 'undefined') {
                window.location.href = 'browser://showhud?message='+encodeURIComponent('html2canvas库加载失败')
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
                const image = canvas.toDataURL('image/jpeg',1.0); // 压缩图片大小
                window.location.href = 'browser://copyimage?image='+image
            }).catch(error => {
                window.location.href = 'browser://showhud?message='+encodeURIComponent('截图失败:'+error.message)
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
//     self.runJavaScript(`
//      let url = 'https://unpkg.com/@zumer/snapdom@latest/dist/snapdom.min.js'
//             const script = document.createElement('script');
//             script.type = 'text/javascript';
//             script.src = url;
//             document.head.appendChild(script);
//     const image = await snapdom.toPng(document.body);
// document.body.appendChild(image);
//     `)
  },
  screenshot: async function (width) {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    let imageData = await self.screenshot(width)
    MNUtil.copyImage(imageData)
    self.showHUD('截图已复制到剪贴板')
    await MNUtil.delay(0.1)
    MNUtil.postNotification("snipasteImage", {imageData:imageData})

    // self.webview.takeSnapshotWithWidth(width,(snapshot)=>{
    //   MNUtil.copyImage(snapshot.pngData())
    //   MNUtil.showHUD('截图已复制到剪贴板')
    // })
  },
  videoFrame: async function (width) {
    let self = getBrowserController()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    self.videoFrameAction("clipboard")
  },
  videoFrameToSnipaste: async function (width) {
    let self = getBrowserController()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    self.videoFrameAction("snipaste")
  },
  videoFrameToEditor: async function (width) {
    let self = getBrowserController()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    self.videoFrameAction("editor")
  },
  videoFrameToNote: async function (childNote) {
    let self = getBrowserController()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    if (childNote) {
      self.videoFrameAction("childNote")
    }else{
      self.videoFrameAction("excerpt")
    }
  },
  videoFrameToNewNote: async function (childNote) {
    let self = getBrowserController()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    self.videoFrameAction("newNote")
  },
  videoFrameToComment: async function () {
      let self = getBrowserController()
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    self.videoFrameAction("comment")
  },
  homeButtonTapped: function() {
    if (self.inHomePage) {
      MNUtil.showHUD("Already in homepage")
      return
    }
    self.homePage()
  },
  loadCKEditor:function (params) {
    try {
      // MNUtil.copy(browserUtils.mainPath+"/ckeditor.html")
      self.webview.loadFileURLAllowingReadAccessToURL(
      NSURL.fileURLWithPath(browserUtils.mainPath+"/ckeditor.html"),
      NSURL.fileURLWithPath(browserUtils.mainPath+"/")
    )

    // MNConnection.loadFile(self.webview, browserUtils.mainPath+"/ckeditor.html", browserUtils.mainPath+"/")
          
    } catch (error) {
      browserUtils.addErrorLog(error, "loadCKEditor")
    }
  },
  customButtonTapped: async function(button){
    let self = getBrowserController()
    if (!browserUtils.checkSubscribe(true)) {
      return
    }
    try {
      

    let url
    let text
    let configName = (button.index === 1)?"custom":"custom"+button.index
    switch (browserConfig.getConfig(configName)) {
      case "uploadPDFToDoc2X":
        if (!(await self.currentURLStartsWith("https://doc2x.noedgeai.com"))) {
          MNUtil.waitHUD("Opening Doc2X...")
          self.setWebMode(true)
          MNConnection.loadRequest(self.webview, "https://doc2x.noedgeai.com")
          self.uploadOnDoc2X = {enabled:true,action:"uploadPDFToDoc2X"}
          return
        }
        self.uploadPDFToDoc2X()
        break;
      case "uploadImageToDoc2X":
        if (!(await self.currentURLStartsWith("https://doc2x.noedgeai.com"))) {
          MNUtil.waitHUD("Opening Doc2X...")
          self.setWebMode(true)
          MNConnection.loadRequest(self.webview, "https://doc2x.noedgeai.com")
          self.uploadOnDoc2X = {enabled:true,action:"uploadImageToDoc2X"}
          return
        }
        self.uploadImageToDoc2X()
        break;
      case "changeBilibiliVideoPart":
        self.changeBilibiliVideoPart(button)
        break;
      case "screenshot":
        let width = self.view.frame.width>1000?self.view.frame.width:1000
        let imageData = await self.screenshot(width)
        MNUtil.copyImage(imageData)
        self.showHUD('截图已复制到剪贴板')
        break;
      case "videoFrame2Clipboard":
        self.videoFrameAction("clipboard")
        break;
      case "videoFrame2Editor":
        self.videoFrameAction("editor")
        break;
      case "videoFrame2Note":
        self.videoFrameAction("excerpt")
        break;
      case "videoFrame2ChildNote":
        self.videoFrameAction("childNote")
        break;
      case "videoFrameToNewNote":
        self.videoFrameAction("newNote")
        break;
      case "videoFrameToComment":
        self.videoFrameAction("comment")
        break;
      case "videoTime2Clipboard":
        self.videoTimeAction("clipboard")
        break;
      case "videoTime2Editor":
        self.videoTimeAction("editor")
        break;
      case "videoTime2Note":
        self.videoTimeAction("excerpt")
        break;
      case "videoTime2ChildNote":
        self.videoTimeAction("childNote")
        break;
      case "videoFrameToSnipaste":
        self.videoFrameAction("snipaste")
        break;
      case "videoTimeToNewNote":
        self.videoTimeAction("newNote")
        break;
      case "videoTimeToComment":
        self.videoTimeAction("comment")
        break;
      case "bigbang":
        url = await self.getCurrentURL()
        text = await self.getTextInWebview()
        MNUtil.postNotification('bigbangText', {text:text,url:url})
        break;
      case "copyCurrentURL":
        url = await self.getCurrentURL()
        MNUtil.copy(url)
        self.showHUD("链接已复制")
        break;
      case "copyAsMDLink":
        url = await self.getCurrentURL()
        text = await self.getSelectedTextInWebview()
        MNUtil.copy(`[${text}](${url})`)
        self.showHUD("链接已复制")
        break;
      case "openInNewWindow":
        if (browserUtils.checkSubscribe()) {
          let agent = self.webview.customUserAgent
          url = await self.getCurrentURL()
          MNUtil.postNotification('newWindow', {url:url,desktop:browserConfig.entries[browserConfig.engine].desktop,engine:browserConfig.engine,webApp:self.webApp,agent:agent})
          self.homePage();
        }
        break;
      case "openNewWindow":
        if (browserUtils.checkSubscribe()) {
          MNUtil.postNotification('newWindow', {url:browserConfig.getConfig("homePage").url,desktop:browserConfig.entries[browserConfig.engine].desktop,engine:browserConfig.engine,webApp:self.webApp})
        }
        break;
      case "openCopiedURL":
        MNConnection.loadRequest(self.webview, MNUtil.clipboardText)
        break;
      case "pauseOrPlay":
        self.runJavaScript(`function togglePlayPause() {
    // 假设我们的video元素的id是'myVideo'
  const video = document.getElementsByTagName('video')[0];
    if (video.paused) {
        // 如果视频是暂停的，开始播放
        video.play();
    } else {
        // 如果视频正在播放，暂停它
        video.pause();
    }
};
togglePlayPause()
`)
        break;
      case "forward10s":
        self.runJavaScript(` function forward10Seconds() {
const video = document.getElementsByTagName('video')[0];
video.currentTime += 10;
};
forward10Seconds()`);
        break;
      case "backward10s":
        self.runJavaScript(` function backward10Seconds() {
const video = document.getElementsByTagName('video')[0];
video.currentTime -= 10;
};
backward10Seconds();`);
        break;
      default:
        break;
    }
    } catch (error) {
      browserUtils.addErrorLog(error, "customButtonTapped")
    }
  },
  searchButtonTapped: async function() {
  try {
      // self.view.superview.setNeedsLayout()
      
    if (self.webview.url !== browserConfig.entries[browserConfig.engine].link) {
      self.search(self.selectedText)
      return
    }

    if (browserConfig.engine === "ChatGLM") {
      let text  = decodeURIComponent(self.selectedText);
      if (text.length) {
        self.runJavaScript(`if (typeof(t) !== "undefined") {
            t.value='${text}';
            t.dispatchEvent(evt)
          }else{
            let t = document.getElementsByTagName('textarea')[0];
            let evt = document.createEvent('HTMLEvents');
            evt.initEvent('input', true, true);
            t.value='${text}';
            t.dispatchEvent(evt)
          }
          // setTimeout(() => {
          //     document.getElementsByClassName('button-right-inner')[0].click();
          //   }, 200)
          `)
      }
      return;
    }
    if (browserConfig.engine === "Yiyan") {
      let text  = decodeURIComponent(self.selectedText);
      if (text.length) {
        self.runJavaScript(`if (typeof(t) !== "undefined") {
            t.value='${text}';
            t.dispatchEvent(evt)
          }else{
            let t = document.getElementById('dialogue-input');
            let lastValue=t.value
            let evt = document.createEvent('HTMLEvents');
            evt.initEvent('input', true, true);
            t.value='${text}';
            let tracker = t._valueTracker;
            if (tracker) {
              tracker.setValue(lastValue)
            }
            t.dispatchEvent(evt)
          }
          `)
      }
      return;
    }
  } catch (error) {
      browserUtils.addErrorLog(error, "searchButtonTapped")
  }
  },
  goBackButtonTapped: function() {
    self.webview.goBack();
  },
  goForwardButtonTapµped: function() {
    self.webview.goForward();
  },
  refreshButtonTapped: async function(para) {
//   try {

// //  self.runJavaScript(`
// //   // 1. 获取页面的拖放区域
// //   const dropZone = document.body;

// //   // 2. 直接使用原始Base64数据
// //   const base64PDF = "${fileBase64Escape}";
  
// //   try {
// //     // 3. 正确解析Base64并重建文件
// //     const binaryString = atob(base64PDF);
// //     const bytes = new Uint8Array(binaryString.length);
    
// //     // 逐个字符转换为字节值
// //     for (let i = 0; i < binaryString.length; i++) {
// //       bytes[i] = binaryString.charCodeAt(i) & 0xFF;
// //     }
    
// //     // 4. 创建有效的PDF文件
// //     const blob = new Blob([bytes.buffer], { type: 'application/pdf' });
// //     const file = new File([blob], 'mockfile.pdf', { 
// //       type: 'application/pdf',
// //       lastModified: Date.now()
// //     });

// //     // 5. 创建自定义DataTransfer对象
// //     const dataTransfer = new DataTransfer();
// //     dataTransfer.items.add(file);

// //     // 6. 创建并触发拖拽事件序列
// //     const events = [
// //       new DragEvent('dragenter', { bubbles: true, dataTransfer, view: window }),
// //       new DragEvent('dragover', { 
// //         bubbles: true, 
// //         dataTransfer, 
// //         cancelable: true, 
// //         view: window 
// //       }),
// //       new DragEvent('drop', { 
// //         bubbles: true, 
// //         dataTransfer, 
// //         cancelable: true, 
// //         view: window 
// //       })
// //     ];
    
// //     events.forEach(event => dropZone.dispatchEvent(event));
    
// //     console.log('✅ PDF文件重建成功，拖拽事件已触发');
    
// //   } catch (error) {
// //     console.error('⚠️ 文件重建失败:', error);
// //     console.warn('Base64长度:', base64PDF.length);
// //     console.warn('前100字符:', base64PDF.substring(0, 100));
// //   }
// // `)

//   } catch (error) {
//     browserUtils.addErrorLog(error, "upload")
//   }
//     // MNUtil.copy(res)
//     return
    if (self.inHomePage) {
      self.homePage()
      return
    }
    if (self.webview.loading) {
      self.webview.stopLoading();
      self.refreshButton.setImageForState(browserUtils.reloadImage,0)
      self.changeButtonOpacity(1.0)
      self.isLoading = false;
    }else{
      self.webview.reload();
    }
  },
  dynamicButtonTapped: function() {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}

    // self.view.popoverController.dismissPopoverAnimated(true);
    // self.switchView();
    browserConfig.dynamic = !browserConfig.dynamic;
    if (browserConfig.dynamic) {
      browserConfig.toolbar = false
      self.custom = false;
      self.customMode = "None"
      self.buttonScrollview.hidden = true
      var viewFrame = self.view.bounds;
      self.webview.frame = MNUtil.genFrame(viewFrame.x, viewFrame.y+10, viewFrame.width, viewFrame.height)
    }
    browserConfig.save("MNBrowser_dynamic")
    self.updateEngineButton()
  },
  closeButtonTapped: function() {
    if (self.addonBar) {
      self.hide(self.addonBar.frame)
    }else{
      self.hide()
    }
    self.homePage()
    self.searchedText = ""
    self.blur(0.01)

  // Application.sharedInstance().showHUD(self.isMainWindow,self.view.window,2)

    if (self.isMainWindow && browserConfig.getConfig("autoExitWatchMode")) {
      self.addonController.watchMode = false;
    }
    browserConfig.save("MNBrowser_dynamic")
  },
 closeConfigTapped: function () {
  let preOpacity = self.settingView.layer.opacity
  UIView.animateWithDurationAnimationsCompletion(0.2,()=>{
    self.settingView.layer.opacity = 0
  },()=>{
    self.settingView.layer.opacity = preOpacity
    self.settingView.hidden = true
  })
 },
 splitScreen: function (mode) {
  if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
  self.lastFrame = self.view.frame
  self.custom = true;
  self.customMode = mode
  browserConfig.dynamic = false;
  self.webview.hidden = false
  self.hideAllButton()
  MNUtil.animate(()=>{
    self.setSplitScreenFrame(mode)
  },0.3).then(()=>{
    self.showAllButton()
  })
 },
  maxButtonTapped: function() {
    if (self.customMode === "full") {
      self.customMode = "none"
      self.custom = false;
      self.hideAllButton()
      MNUtil.animate(()=>{
        self.setFrame(self.lastFrame)
      },0.3).then(()=>{
        self.showAllButton()
      })
      return
    }
    const frame = MNUtil.studyView.bounds
    self.lastFrame = self.view.frame
    self.customMode = "full"
    self.custom = true;
    browserConfig.dynamic = false;
    self.webview.hidden = false
    self.hideAllButton()
    MNUtil.animate(()=>{
      self.setFrame(40,50,frame.width-80,frame.height-70)
    },0.3).then(()=>{
      self.showAllButton()
    })
  },
  minButtonTapped: function() {
    // browserConfig.dynamic = false;
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
  moreButtonTapped: function(button) {
    let self = getBrowserController()
    try {
    var commandTable 
    // MNUtil.showHUD("moreButtonTapped"+browserConfig.toolbar)
    let menu = new Menu(button,self)
    menu.width = 230
    menu.preferredPosition = 1
    menu.addMenuItem('🖥️  Desktop mode', 'toggleDesktop:','engine',self.desktop)
    menu.addMenuItem('🌗  Left', 'splitScreen:','left',self.customMode==="left")
    menu.addMenuItem('🌘  Left 1/3', 'splitScreen:','left13',self.customMode==="left13")
    menu.addMenuItem('🌓  Right', 'splitScreen:','right',self.customMode==="right")
    menu.addMenuItem('🌒  Right 1/3', 'splitScreen:','right13',self.customMode==="right13")
    menu.addMenuItem('🌟  Dynamic', 'dynamicButtonTapped:','right',browserConfig.dynamic)
    menu.addMenuItem('🌟  Toolbar', 'toggleToolbar:','right',browserConfig.toolbar)
    if (self.isMainWindow) {
      menu.addMenuItem('👀  Watch Mode', 'toggleWatchMode:','right',self.watchMode)
      menu.addMenuItem('➕  Open in new window', 'openInNewWindow:',self.webview.url)
      menu.addMenuItem('➕  Open new window', 'openNewWindow:',browserConfig.getConfig("homePage").url)
    }
    menu.addMenuItem('🌐  Open in browser', 'openInBrowser:')
    menu.addMenuItem('🌐  Copy as MD link', 'copyCurrentURLWithText:')
    menu.addMenuItem('🎚  Zoom', 'changeZoom:',button)
    menu.show()
    } catch (error) {
      browserUtils.addErrorLog(error, "moreButtonTapped")
    }
  },
  onMoveGesture:function (gesture) {
    browserConfig.dynamic = false;
    let locationToMN = gesture.locationInView(MNUtil.studyView)
    if (!self.locationToButton || !self.miniMode && (Date.now() - self.moveDate) > 100) {
      // self.appInstance.showHUD("state:"+gesture.state, self.view.window, 2);
      let translation = gesture.translationInView(MNUtil.studyView)
      let locationToBrowser = gesture.locationInView(self.view)
      let locationToButton = gesture.locationInView(gesture.view)
      let newY = locationToButton.y-translation.y 
      let newX = locationToButton.x-translation.x
      if (gesture.state === 1) {
        self.lastFrame = self.view.frame
        self.locationToBrowser = {x:locationToBrowser.x-translation.x,y:locationToBrowser.y-translation.y}
        self.locationToButton = {x:newX,y:newY}
      }
    }
    self.moveDate = Date.now()
    let location = {x:locationToMN.x - self.locationToButton.x-gesture.view.frame.x,y:locationToMN.y -self.locationToButton.y-gesture.view.frame.y}

    // let location = browserUtils.getNewLoc(gesture)
    let frame = self.view.frame
    var viewFrame = self.view.bounds;
    let studyFrame = MNUtil.studyView.bounds
    let y = MNUtil.constrain(location.y, 0, studyFrame.height-15)
    let x = location.x
    if (!self.miniMode) {
      if (locationToMN.x<40) {
        if (!self.settingView || self.settingView.hidden) {
          self.toMinimode(MNUtil.genFrame(0,locationToMN.y,40,40),self.lastFrame)
        }
        return
      }
      if (locationToMN.x>studyFrame.width-40) {
        if (!self.settingView || self.settingView.hidden) {
          self.toMinimode(MNUtil.genFrame(studyFrame.width-40,locationToMN.y,40,40),self.lastFrame)
        }
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
        self.onAnimate = true
        let color = this.desktop ? "#b5b5f5":"#9bb2d6"
        self.view.layer.backgroundColor = MNUtil.hexColorAlpha(color,0.8)
        self.view.layer.borderColor = MNUtil.hexColorAlpha(color,0.8)
        MNUtil.animate(()=>{
          self.view.layer.opacity = preOpacity
          self.setFrame(x,y,self.lastFrame.width,self.lastFrame.height)
        }).then(()=>{
          self.onAnimate = false
          self.moveButton.frame = MNUtil.genFrame(viewFrame.x + viewFrame.width*0.5-75,viewFrame.y+5,150,10)
          self.view.layer.borderWidth = 0
          self.view.layer.borderColor = MNUtil.hexColorAlpha(color,0.0)
          self.view.layer.backgroundColor = MNUtil.hexColorAlpha(color,0.0)
          self.view.hidden = false
          self.webview.hidden = false
          self.showAllButton()
          self.toolbar.hidden = false
          self.moveButton.setImageForState(undefined,0)
          if (browserConfig.toolbar) {
            self.homeButton.hidden = false
            self.engineButton.hidden = false
            self.webAppButton.hidden = false
          }
          self.updateEngineButton()
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
      })
    }else{
      self.setFrame(x, y, frame.width,frame.height)
    }
    self.custom = false;
    // MNUtil.copy(self.view.frame)
  },
  onResizeGesture:function (gesture) {
    self.custom = false;
    browserConfig.dynamic = false;
    self.customMode = "none"
    let frame = self.view.frame
    let locationToBrowser = gesture.locationInView(self.view)
    if (gesture.state === 1) {
      self.xDiff = MNUtil.constrain(frame.width-locationToBrowser.x, 0, frame.width)
      self.yDiff = MNUtil.constrain(frame.height-locationToBrowser.y, 0, frame.height)
    }
    let width = locationToBrowser.x+self.xDiff
    let height = locationToBrowser.y+self.yDiff
    if (width <= 265) {
      width = 265
    }
    if (height <= 150) {
      height = 150
    }
    if (self.settingView && !self.settingView.hidden) {
      if (height <= 420) {
        height = 420
      }
    }
    //  Application.sharedInstance().showHUD(`{x:${translation.x},y:${translation.y}}`, self.view.window, 2);
    //  self.view.frame = {x:frame.x,y:frame.y,width:frame.width+translationX,height:frame.height+translationY}
    self.setFrame(frame.x, frame.y, width,height)
    if (gesture.state === 3 && self.isMainWindow) {
      let size = {width:width,height:height}
      browserConfig.config.size = size
      browserConfig.save("MNBrowser_config")
      // MNUtil.showHUD("End")
    }
  },
  changeWebAppTo:function(webApp) {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}
    if (webApp) {
      self.webApp = webApp;
    }
    var url;
    url = browserConfig.webAppEntries[self.webApp].link
    self.setWebMode(browserConfig.webAppEntries[self.webApp].desktop)
    self.inHomePage = false
    if (self.webview.url !== url) {
      MNConnection.loadRequest(self.webview, url)
      self.webview.hidden = false
      return
    }
  },
  addPageToWebApp: async function (params) {
    if (self.view.popoverController) {self.view.popoverController.dismissPopoverAnimated(true);}

    let url = await self.getCurrentURL()
    let config = {title:"test",desktop:false,link:url}
    let title = await self.runJavaScript("document.title")
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      "Name for this page?",url,2,"Cancel",[title,"Add"],
      (alert, buttonIndex) => {
        switch (buttonIndex) {
          case 1:
            // self.appInstance.showHUD(title,self.view.window,2)
            config = {title:title,desktop:false,link:url}
            break;
          case 2:
            // self.appInstance.showHUD(alert.textFieldAtIndex(0).text,self.view.window,2)
            config = {title:alert.textFieldAtIndex(0).text,desktop:false,link:url}
            break;
          default:
            break;
        }
        let i = 0
        while (browserConfig.webAppEntries["customEWebApp"+i]) {
          i = i+1
        }
        browserConfig.webAppEntries["customEWebApp"+i] = config
        browserConfig.webAppEntrieNames = browserConfig.webAppEntrieNames.concat(("customEWebApp"+i))
        self.configEngine = "customEWebApp"+i
        browserConfig.save("MNBrowser_webAppEntrieNames")
        browserConfig.save("MNBrowser_webAppEntries")

      })
  },
  advancedButtonTapped: function (params) {
    self.configSearchView.hidden = true
    self.advanceView.hidden = false
    self.syncView.hidden = true
    self.customButtonView.hidden = true
    MNButton.setColor(self.advancedButton, "#457bd3")
    MNButton.setColor(self.configSearchButton, "#9bb2d6")
    MNButton.setColor(self.configWebappButton, "#9bb2d6")
    MNButton.setColor(self.syncConfig, "#9bb2d6")
    MNButton.setColor(self.configCustomButton, "#9bb2d6")
  },
  syncConfigTapped: function (params) {
    self.configSearchView.hidden = true
    self.advanceView.hidden = true
    self.syncView.hidden = false
    self.customButtonView.hidden = true
    MNButton.setColor(self.advancedButton, "#9bb2d6")
    MNButton.setColor(self.configSearchButton, "#9bb2d6")
    MNButton.setColor(self.configWebappButton, "#9bb2d6")
    MNButton.setColor(self.syncConfig, "#457bd3")
    MNButton.setColor(self.configCustomButton, "#9bb2d6")
    self.refreshView("syncView")
  },
  configSearchTapped: function (params) {
    self.configSearchView.hidden = false
    self.advanceView.hidden = true
    self.syncView.hidden = true
    self.customButtonView.hidden = true
    self.configMode = 0
    self.configEngine = browserConfig.engine
    MNButton.setColor(self.advancedButton, "#9bb2d6")
    MNButton.setColor(self.configSearchButton, "#457bd3")
    MNButton.setColor(self.configWebappButton, "#9bb2d6")
    MNButton.setColor(self.syncConfig, "#9bb2d6")
    MNButton.setColor(self.configCustomButton, "#9bb2d6")
    self.setButtonText( browserConfig.entrieNames,browserConfig.engine)
    self.setTextview(browserConfig.engine)
    self.refreshLayout()
  },
  configWebAppTapped: function (params) {
    self.configSearchView.hidden = false
    self.advanceView.hidden = true
    self.syncView.hidden = true
    self.customButtonView.hidden = true
    self.configMode = 1
    self.configEngine = self.webApp
    MNButton.setColor(self.advancedButton, "#9bb2d6")
    MNButton.setColor(self.configSearchButton, "#9bb2d6")
    MNButton.setColor(self.configWebappButton, "#457bd3")
    MNButton.setColor(self.syncConfig, "#9bb2d6")
    MNButton.setColor(self.configCustomButton, "#9bb2d6")
    self.setButtonText(browserConfig.webAppEntrieNames,self.webApp)
    self.setTextview(self.webApp)
    self.refreshLayout()

  },
  configCustomButtonTapped: function (params) {
    self.configSearchView.hidden = true
    self.advanceView.hidden = true
    self.syncView.hidden = true
    self.customButtonView.hidden = false
    MNButton.setColor(self.advancedButton, "#9bb2d6")
    MNButton.setColor(self.configSearchButton, "#9bb2d6")
    MNButton.setColor(self.configWebappButton, "#9bb2d6")
    MNButton.setColor(self.syncConfig, "#9bb2d6")
    MNButton.setColor(self.configCustomButton, "#457bd3")
  },
  configCopyTapped: function (button) {
    let config = self.textviewInput.text.replaceAll(`”`,`"`)
    MNUtil.copy(config)
    MNUtil.showHUD("Copy to clipboard")
  },
  configPasteTapped: function (button) {
    let configText = MNUtil.clipboardText
    if (MNUtil.isValidJSON(configText)) {
      let config = JSON.parse(configText)
      self.textviewInput.text = configText
      if (self.configMode === 0) {
        browserConfig.entries[self.configEngine] = config
        self.setButtonText(browserConfig.entrieNames,self.configEngine)
        browserConfig.save("MNBrowser_entries")
        MNUtil.showHUD("Saved engine: "+config.title)
      }else{
        browserConfig.webAppEntries[self.configEngine] = config
        self.setButtonText(browserConfig.webAppEntrieNames,self.configEngine)
        browserConfig.save("MNBrowser_webAppEntries")
        MNUtil.showHUD("Saved webapp: "+config.title)
      }
      self.refreshLayout(true)
    }else{
      MNUtil.confirm("MN Browser", "Invalid JSON format:\n\n"+configText)
    }
  },
  configSaveTapped: function (params) {
    // self.appInstance.showHUD(123, self.view.window, 2);
    try {
    self.textviewInput.text = self.textviewInput.text.replaceAll(`”`,`"`)
    if (MNUtil.isValidJSON(self.textviewInput.text)) {
      let config = JSON.parse(self.textviewInput.text)
      if (self.configMode === 0) {
        browserConfig.entries[self.configEngine] = config
        self.setButtonText(browserConfig.entrieNames,self.configEngine)
        browserConfig.save("MNBrowser_entries")
        MNUtil.showHUD("Saved engine: "+config.title)
      }else{
        browserConfig.webAppEntries[self.configEngine] = config
        self.setButtonText(browserConfig.webAppEntrieNames,self.configEngine)
        browserConfig.save("MNBrowser_webAppEntries")
        MNUtil.showHUD("Saved webapp: "+config.title)
      }
      self.refreshLayout(true)
    }else{
      MNUtil.confirm("MN Browser", "Invalid JSON format:\n\n"+self.textviewInput.text)
    }
    } catch (error) {
      browserUtils.addErrorLog(error, "configSaveTapped")
    }
  },
  configAddTapped: function (params) {
    if (self.configMode === 0) {
      self.textviewInput.text = 
`{
  "title":   "🔍 new engine",
  "symbol":  "🔍",
  "engine":  "engine name",
  "desktop": false,
  "link":    "https://www.bing.com/search?q=%s"
}`
    let i = 0
    while (browserConfig.entries["customEngine"+i]) {
      i = i+1
    }
    let entries = browserConfig.entries
    entries["customEngine"+i] = JSON.parse(self.textviewInput.text)
    browserConfig.entries = entries
    browserConfig.entrieNames = browserConfig.entrieNames.concat(("customEngine"+i))
    self.setButtonText(browserConfig.entrieNames,"customEngine"+i)
    self.configEngine = "customEngine"+i
    try {
    browserConfig.save("MNBrowser_entrieNames")
    NSUserDefaults.standardUserDefaults().setObjectForKey(browserConfig.entries,"MNBrowser_entries")
    entries = NSUserDefaults.standardUserDefaults().objectForKey("MNBrowser_entries")
    // self.appInstance.showHUD(Object.keys(entries),self.view.window,2)
    
    } catch (error) {
      browserUtils.addErrorLog(error, "configAddTapped")
    }
    }else{
      self.textviewInput.text = 
`{
  "title":   "📝 new webapp",
  "desktop": false,
  "link":    "https://www.bing.com"
}`
    let i = 0
    while (browserConfig.webAppEntries["customEWebApp"+i]) {
      i = i+1
    }
    browserConfig.webAppEntries["customEWebApp"+i] = JSON.parse(self.textviewInput.text)
    browserConfig.webAppEntrieNames = browserConfig.webAppEntrieNames.concat(("customEWebApp"+i))
    self.setButtonText(browserConfig.webAppEntrieNames,"customEWebApp"+i)
    self.configEngine = "customEWebApp"+i
    browserConfig.save("MNBrowser_webAppEntrieNames")
    browserConfig.save("MNBrowser_webAppEntries")
    }
  },
  configDeleteTapped: async function (params) {
  try {
    let confim = await MNUtil.confirm("Remove config?", "删除配置？")
    if (!confim) {
      return
    }
    if (self.configMode === 0) {
      delete browserConfig.entries[self.configEngine]
      browserConfig.entrieNames = browserConfig.entrieNames.filter(item=>item !== self.configEngine)
      if (self.configEngine === browserConfig.engine) {
        browserConfig.engine = browserConfig.entrieNames[0]
        self.updateEngineButton()
      }
      self.configEngine = browserConfig.entrieNames[0]
      self.setButtonText(browserConfig.entrieNames,self.configEngine)
      self.setTextview(self.configEngine)
      self.refreshLayout()
      browserConfig.save("MNBrowser_entrieNames")
      browserConfig.save("MNBrowser_entries")
      browserConfig.save("MNBrowser_engine")
      if (self.inHomePage && browserConfig.getConfig("useLocalHomePage")) {
        self.homePage()
      }
    }else{
      delete browserConfig.webAppEntries[self.configEngine]
      browserConfig.webAppEntrieNames = browserConfig.webAppEntrieNames.filter(item=>item !== self.configEngine)
      if (self.configEngine === self.webApp) {
        self.webApp = browserConfig.webAppEntrieNames[0]
      }
      self.configEngine = browserConfig.webAppEntrieNames[0]
      self.setButtonText(browserConfig.webAppEntrieNames,self.configEngine)
      self.setTextview(self.configEngine)
      self.refreshLayout()
      browserConfig.save("MNBrowser_webAppEntrieNames")
      browserConfig.save("MNBrowser_webAppEntries")
      if (self.inHomePage && browserConfig.getConfig("useLocalHomePage")) {
        self.homePage()
      }
    }
  } catch (error) {
    browserUtils.addErrorLog(error, "configDeleteTapped")
  }
  },
  configMoveUpTapped: function (params) {
    if (self.configMode === 0) {
      let index = browserConfig.entrieNames.indexOf(self.configEngine)
      if (index === 0) {
        self.showHUD("Already the top one!")
        return
      }
      let temp = browserConfig.entrieNames[index-1]
      browserConfig.entrieNames[index-1] = self.configEngine
      browserConfig.entrieNames[index] = temp
      self.setButtonText(browserConfig.entrieNames,self.configEngine)
      self.refreshLayout()
      browserConfig.save("MNBrowser_entrieNames")
    }else{
      let index = browserConfig.webAppEntrieNames.indexOf(self.configEngine)
      if (index === 0) {
        self.showHUD("Already the top one!")
        return
      }
      let temp = browserConfig.webAppEntrieNames[index-1]
      browserConfig.webAppEntrieNames[index-1] = self.configEngine
      browserConfig.webAppEntrieNames[index] = temp
      // showHUD("index:"+index)
      self.setButtonText(browserConfig.webAppEntrieNames,self.configEngine)
      self.refreshLayout()
      browserConfig.save("MNBrowser_webAppEntrieNames")

    }
  },
  configMoveDownTapped: function (params) {
    if (self.configMode === 0) {
      let index = browserConfig.entrieNames.indexOf(self.configEngine)
      if (index === browserConfig.entrieNames.length-1) {
        self.showHUD("Already the bottom one!")
        return
      }
      let temp = browserConfig.entrieNames[index+1]
      browserConfig.entrieNames[index+1] = self.configEngine
      browserConfig.entrieNames[index] = temp
      self.setButtonText(browserConfig.entrieNames,self.configEngine)
      self.refreshLayout()
      browserConfig.save("MNBrowser_entrieNames")
    }else{
      let index = browserConfig.webAppEntrieNames.indexOf(self.configEngine)
      if (index === browserConfig.webAppEntrieNames.length-1) {
        self.showHUD("Already the bottom one!")
        return
      }
      let temp = browserConfig.webAppEntrieNames[index+1]
      browserConfig.webAppEntrieNames[index+1] = self.configEngine
      browserConfig.webAppEntrieNames[index] = temp
      self.setButtonText(browserConfig.webAppEntrieNames,self.configEngine)
      self.refreshLayout()
      browserConfig.save("MNBrowser_webAppEntrieNames")

    }
  },
  openWebApp:function() {
    let self = getBrowserController()
    var url;
    url = browserConfig.webAppEntries[self.webApp].link
    self.setWebMode(browserConfig.webAppEntries[self.webApp].desktop)
    MNConnection.loadRequest(self.webview, url)
    self.webview.hidden = false
  },
  toggleSelected:function (sender) {
    if (sender.isSelected) {
      return;
    }
    sender.isSelected = !sender.isSelected
    // self.appInstance.showHUD(text,self.view.window,2)
    let title = sender.id
    self.configEngine = title
    self.words.forEach((entryName,index)=>{
      if (entryName !== title) {
        self["nameButton"+index].isSelected = false
        self["nameButton"+index].backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8);
      }
    })
    if (sender.isSelected) {
      self.setTextview(title)
      sender.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
    }else{
      sender.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8);
    }
  },
  exportConfig: async function (params) {
    let success = await browserConfig.export()
    if (success) {
      self.configNoteIdInput.text = browserConfig.getConfig("syncNoteId")
      browserConfig.save("MNBrowser_config")
      self.showHUD("Export Success!")
      let dateObj = new Date(browserConfig.getConfig("lastSyncTime"))
      MNButton.setTitle(self.syncTimeButton, "Last Sync Time: "+dateObj.toLocaleString())
    }
  },
  importConfig:async function (params) {
    try {
    let success = await browserConfig.import()
    if (success) {
      self.refreshView("syncView")
      self.refreshView("configSearchView")
      self.showHUD("Import Success!")
    }
    } catch (error) {
      browserUtils.addErrorLog(error, "importConfig")
    }
  },
  syncConfig: function (params) {
    let success = browserConfig.sync()
    if (success) {
      self.refreshView("syncView")
      self.showHUD("Sync Success!")
    }
  },
  restoreConfig:async function (params) {
    let modifiedTime = browserConfig.previousConfig?.config?.modifiedTime
    if (modifiedTime) {
      let dateObj = new Date(modifiedTime)
      let dateString = dateObj.toLocaleString()
      let confirm = await MNUtil.confirm("Restore Config", "恢复上次配置\n\n将会恢复到上次导入前的配置\n\n上次配置的修改时间："+dateString )
      if (confirm) {
        // let success = browserConfig.importConfig(browserConfig.previousConfig)
        // if (success) {
        //   browserConfig.save(undefined,true)
        //   MNUtil.showHUD("✅ Restore Success!")
        //   if (browserConfig.getConfig("autoExport")) {
        //     browserConfig.export(true,true)
        //   }
        // }
      }
    }else{
      MNUtil.showHUD("❌ No previous config to restore!")
    }
  },
  focusConfigNoteId:function (params) {
  try {
    let syncNoteId = browserConfig.getConfig("syncNoteId")
        let note = MNNote.new(syncNoteId)
        if (note) {
          note.focusInFloatMindMap()
        }else{
          MNUtil.showHUD("Note not exist!")
        }
  } catch (error) {
    MNUtil.showHUD("Error in focusConfigNoteId: "+error)
  }
  },
  toggleAutoExport: function (params) {
  try {
    browserConfig.config.autoExport = !browserConfig.getConfig("autoExport")
    MNButton.setTitle(self.autoExportButton, "Auto Export: "+(browserConfig.getConfig("autoExport")?"✅":"❌"))
    browserConfig.save("MNBrowser_config")
  } catch (error) {
    MNUtil.showHUD(error)
  }
  },
  toggleAutoImport: function (params) {
    browserConfig.config.autoImport = !browserConfig.getConfig("autoImport")
    MNButton.setTitle(self.autoImportButton, "Auto Import: "+(browserConfig.getConfig("autoImport")?"✅":"❌"))
    browserConfig.save("MNBrowser_config")
  },
  pasteConfigNoteId:function (params) {
    let noteId = MNUtil.clipboardText
    let note = MNNote.new(noteId)//MNUtil.getNoteById(noteId)
    if (note) {
      self.configNoteIdInput.text = note.noteId
      browserConfig.config.syncNoteId = noteId.noteId
      browserConfig.save("MNBrowser_config")
      MNUtil.showHUD("Save Config NoteId")
    }else{
      MNUtil.showHUD("Note not exist!")
    }
  },
  clearConfigNoteId:function (params) {
    self.configNoteIdInput.text = ""
    browserConfig.config.syncNoteId = ""
    browserConfig.save("MNBrowser_config")
    MNUtil.showHUD("Clear Config NoteId")
  },
  changeSyncSource: function (button) {
    let self = getBrowserController()
    let syncSource = browserConfig.getConfig("syncSource")
    let selector = 'setSyncSource:'
    let menu = new Menu(button,self)
    menu.addMenuItem('❌  None', selector,'None',syncSource =='None')
    menu.addMenuItem('☁️  iCloud', selector,'iCloud',syncSource =='iCloud')
    menu.addMenuItem('☁️  MNNote', selector,'MNNote',syncSource =='MNNote')
    menu.show()
    // var commandTable = [
    //     self.tableItem('❌  None', selector, 'None',syncSource =='None'),
    //     self.tableItem('☁️  iCloud', selector, 'iCloud',syncSource =='iCloud'),
    //     self.tableItem('☁️  MNNote', selector, 'MNNote',syncSource =='MNNote'),
    //     // self.tableItem('☁️  Cloudflare R2', selector, 'CFR2',syncSource =='CFR2'),
    //     // self.tableItem('☁️  InfiniCloud', selector, 'Infi',syncSource =='Infi'),
    //     // self.tableItem('☁️  Webdav', selector, 'Webdav',syncSource =='Webdav')
    // ]
    // self.popover(button, commandTable,200,1)
  },
  setSyncSource: async function (source) {
  try {

    let self = getBrowserController()
    self.checkPopover()
    Menu.dismissCurrentMenu()
    let currentSource = browserConfig.getConfig("syncSource")
    if (currentSource === source) {
      return
    }
    browserConfig.setSyncStatus(false)
    let file
    switch (source) {
      case "iCloud":
        // MNButton.setTitle(self.exportConfigButton, "Export to iCloud")
        // MNButton.setTitle(self.importConfigButton, "Import from iCloud")
        self.configNoteIdInput.text = file
        // self.focusConfigNoteButton.hidden = true
        break;
      case "CFR2":
        file = browserConfig.getConfig("r2file") ?? ""
        // MNButton.setTitle(self.exportConfigButton, "Export to R2")
        // MNButton.setTitle(self.importConfigButton, "Import from R2")
        MNButton.setTitle(self.focusConfigNoteButton, "Copy")
        self.configNoteIdInput.text = file
        // self.focusConfigNoteButton.hidden = true
        break;
      case "Infi":
        file = browserConfig.getConfig("InfiFile") ?? ""
        // MNButton.setTitle(self.exportConfigButton, "Export to Infini")
        // MNButton.setTitle(self.importConfigButton, "Import from Infini")
        MNButton.setTitle(self.focusConfigNoteButton, "Copy")
        self.configNoteIdInput.text = file
        // self.focusConfigNoteButton.hidden = true
        break;
      case "Webdav":
        file = browserConfig.getConfig("webdavFile") ?? ""
        // MNButton.setTitle(self.exportConfigButton, "Export to Webdav")
        // MNButton.setTitle(self.importConfigButton, "Import from Webdav")
        MNButton.setTitle(self.focusConfigNoteButton, "Copy")
        self.configNoteIdInput.text = file
        // self.focusConfigNoteButton.hidden = true
        break;
      case "MNNote":
        self.configNoteIdInput.text = browserConfig.getConfig("syncNoteId")
        self.focusConfigNoteButton.hidden = false
        // MNButton.setTitle(self.exportConfigButton, "Export to Note")
        // MNButton.setTitle(self.importConfigButton, "Import from Note")
        MNButton.setTitle(self.focusConfigNoteButton, "Focus")
        break;
      default:
        break;
    }
    browserConfig.config.syncSource = source
    MNButton.setTitle(self.syncSourceButton, "Sync Config: "+browserConfig.getSyncSourceString(),undefined,true)
    browserConfig.save("MNBrowser_config",true)
    self.refreshView("syncView")
    
  } catch (error) {
    browserUtils.addErrorLog(error, "setSyncSource")
  }
  },
  stopSync:function (params) {
    self.checkPopover()
    Menu.dismissCurrentMenu()
    browserConfig.setSyncStatus(false,false)
    MNUtil.showHUD("Stop Current Sync")
  },
  setHomepage:async function (params) {
    if (!browserUtils.checkSubscribe(false)) {
      return
    }
    let res = await MNUtil.userSelect("Choose Homepage", "选择主页", ["📱 Local HomePage (Mobile)","📱 Infinity Tab (Mobile)","💻 Local HomePage (Desktop)","💻 Infinity Tab (Desktop)","Custom / 自定义"])
    if(!res){return}
    // MNUtil.copy(res)
    switch (res) {
      case 1:
        browserConfig.config.useLocalHomePage = true
        browserConfig.config.homePage = {
          url:'https://m.inftab.com/',
          desktop:false
        }
        self.setHomepageButton.setTitleForState("HomePage: 📱 Local (Mobile)",0)
        MNUtil.showHUD("HomePage: 📱 Local HomePage (Mobile)")
        break;
      case 2:
        browserConfig.config.useLocalHomePage = false
        browserConfig.config.homePage = {
          url:'https://m.inftab.com/',
          desktop:false
        }
        self.setHomepageButton.setTitleForState("HomePage: 📱 Infinity Tab (Mobile)",0)
        MNUtil.showHUD("HomePage: 📱 Infinity Tab (Mobile)")
        break;
      case 3:
        browserConfig.config.useLocalHomePage = true
        browserConfig.config.homePage = {
          url:'https://m.inftab.com/',
          desktop:true
        }
        self.setHomepageButton.setTitleForState("HomePage: 💻 Local (Desktop)",0)
        MNUtil.showHUD("HomePage: 💻 Local HomePage (Desktop)")
        break;
      case 4:
        browserConfig.config.useLocalHomePage = false
        browserConfig.config.homePage = {
          url:'https://m.inftab.com/',
          desktop:true
        }
        self.setHomepageButton.setTitleForState("HomePage: 💻 Infinity Tab (Desktop)",0)
        MNUtil.showHUD("HomePage: 💻 Infinity Tab (Desktop)")
        break;
      case 5:
        self.customHomepage()
        break;
      default:
        break;
    }
    if (self.inHomePage && browserConfig.getConfig("useLocalHomePage")) {
      self.homePage()
    }
    browserConfig.save("MNBrowser_config")

    // let res = await MNUtil.input("New Homepage", "", ["Cancel","Desktop","Mobile","Default: Local HomePage","Infinity Tab"])
    // // MNUtil.copyJSON(res)

    // if (res.button) {
    //   if (res.button === 3) {//本地主页
    //     browserConfig.config.useLocalHomePage = true
    //     browserConfig.config.homePage = {
    //       url:'https://m.inftab.com/',
    //       desktop:false
    //     }
    //     self.setHomepageButton.setTitleForState("HomePage: Local",0)
    //     MNUtil.showHUD("New HomePage: Default")
    //     if (self.inHomePage && browserConfig.getConfig("useLocalHomePage")) {
    //       self.homePage()
    //     }
    //   }else if (res.button === 4) {//Infinity Tab
    //     browserConfig.config.useLocalHomePage = false
    //     browserConfig.config.homePage = {
    //       url:'https://m.inftab.com/',
    //       desktop:false
    //     }
    //     self.setHomepageButton.setTitleForState("HomePage: Infinity Tab",0)
    //     MNUtil.showHUD("New HomePage: Infinity Tab")
    //     if (self.inHomePage && browserConfig.getConfig("useLocalHomePage")) {
    //       self.homePage()
    //     }
    //   }else if (browserUtils.checkSubscribe(true)){
    //     browserConfig.config.useLocalHomePage = false
    //     let homePage = {url:res.input,desktop:res.button == 1}
    //     if (!/^https?\:\/\//.test(res.input)) {
    //       homePage.url = "https://"+res.input
    //     }
    //     browserConfig.config.homePage = homePage
    //     self.setHomepageButton.setTitleForState("HomePage: "+homePage.url,0)
    //     MNUtil.showHUD("New HomePage: "+res.input)
    //     if (self.inHomePage && browserConfig.getConfig("useLocalHomePage")) {
    //       self.homePage()
    //     }
    //   }
    //   browserConfig.save("MNBrowser_config")
    // }
  }
});
/** @this {browserController} */
browserController.prototype.createWebview = function () {
    if (this.webview) {
      this.webview.removeFromSuperview()
    }
    this.webview = new UIWebView(this.view.bounds);
    this.webview.backgroundColor = UIColor.whiteColor();
    this.webview.scalesPageToFit = true;
    this.webview.autoresizingMask = (1 << 1 | 1 << 4);
    this.webview.delegate = this;
    this.webview.scrollView.delegate = this;
    this.webview.layer.cornerRadius = 15;
    this.webview.layer.masksToBounds = true;
    this.webview.layer.borderColor = MNUtil.hexColorAlpha("#9bb2d6",0.8);
    this.webview.layer.borderWidth = 0
    this.highlightColor = UIColor.blendedColor( MNUtil.hexColorAlpha("#2c4d81",0.8),
      this.appInstance.defaultTextColor,
      0.8
    );

    this.webview.hidden = true;
    this.webview.lastOffset = 0;
    this.view.addSubview(this.webview);
}

/** @this {browserController} */
browserController.prototype.init = function(){
    this.desktop = false
    this.createWebview()
        // let dragInteraction = UIDragInteraction(this)
        // this.view.addInteraction(dragInteraction)
    this.createButton("toolbar")
    this.toolbar.backgroundColor = MNUtil.hexColorAlpha("#727f94",0.)




    this.createButton("closeButton","closeButtonTapped:")
    this.closeButton.setTitleForState('✖️', 0);
    this.closeButton.titleLabel.font = UIFont.systemFontOfSize(10);
    this.closeButton.layer.cornerRadius = 9

    this.createButton("maxButton","maxButtonTapped:")
    this.maxButton.setTitleForState('➕', 0);
    this.maxButton.titleLabel.font = UIFont.systemFontOfSize(10);
    this.maxButton.layer.cornerRadius = 9

    this.createButton("minButton","minButtonTapped:")
    this.minButton.setTitleForState('➖', 0);
    this.minButton.titleLabel.font = UIFont.systemFontOfSize(10);
    this.minButton.layer.cornerRadius = 9

    this.createButton("moreButton","moreButtonTapped:")
    this.moreButton.setImageForState(browserUtils.moreImage,0)
    this.moreButton.layer.cornerRadius = 9


    this.buttonScrollview = UIScrollView.new()
    this.toolbar.addSubview(this.buttonScrollview)
    this.buttonScrollview.hidden = false
    this.buttonScrollview.delegate = this
    this.buttonScrollview.bounces = true
    this.buttonScrollview.alwaysBounceVertical = false
    this.buttonScrollview.layer.cornerRadius = 8
    this.buttonScrollview.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.0)
    this.buttonScrollview.alwaysBounceHorizontal = true
    this.buttonScrollview.showsHorizontalScrollIndicator = false
    // this.buttonScrollview.

    this.createButton("webAppButton","changeWebApp:","buttonScrollview")
    // this.webAppButton.setTitleForState('📺', 0);
    this.webAppButton.setImageForState(browserUtils.webappImage,0)



    this.createButton("engineButton","searchButtonTapped:","toolbar")
    this.engineButton.titleLabel.font = UIFont.boldSystemFontOfSize(15);
    this.updateEngineButton()
    MNButton.addLongPressGesture(this.engineButton, this, "onLongPressSearch:")

    // this.createButton("homeButton","loadCKEditor:","buttonScrollview")
    this.createButton("homeButton","homeButtonTapped:","buttonScrollview")
    this.homeButton.setImageForState(browserUtils.homeImage,0)

    this.createButton("customButton1","customButtonTapped:","buttonScrollview")
    this.customButton1.index = 1
    this.customButton1.setTitleForState(browserConfig.getCustomEmoji(1), 0);
    this.customButton1.titleLabel.font = UIFont.boldSystemFontOfSize(14);
    // this.customButton.setImageForState(browserUtils.homeImage,0)

    this.createButton("customButton2","customButtonTapped:","buttonScrollview")
    this.customButton2.index = 2
    this.customButton2.setTitleForState(browserConfig.getCustomEmoji(2), 0);
    this.customButton2.titleLabel.font = UIFont.boldSystemFontOfSize(14);

    this.createButton("customButton3","customButtonTapped:","buttonScrollview")
    this.customButton3.index = 3
    this.customButton3.setTitleForState(browserConfig.getCustomEmoji(3), 0);
    this.customButton3.titleLabel.font = UIFont.boldSystemFontOfSize(14);

    this.createButton("customButton4","customButtonTapped:","buttonScrollview")
    this.customButton4.index = 4
    this.customButton4.setTitleForState(browserConfig.getCustomEmoji(4), 0);
    this.customButton4.titleLabel.font = UIFont.boldSystemFontOfSize(14);

    this.createButton("customButton5","customButtonTapped:","buttonScrollview")
    this.customButton5.index = 5
    this.customButton5.setTitleForState(browserConfig.getCustomEmoji(5), 0);
    this.customButton5.titleLabel.font = UIFont.boldSystemFontOfSize(14);

    this.createButton("customButton6","customButtonTapped:","buttonScrollview")
    this.customButton6.index = 6
    this.customButton6.setTitleForState(browserConfig.getCustomEmoji(6), 0);
    this.customButton6.titleLabel.font = UIFont.boldSystemFontOfSize(14);

    this.createButton("customButton7","customButtonTapped:","buttonScrollview")
    this.customButton7.index = 7
    this.customButton7.setTitleForState(browserConfig.getCustomEmoji(7), 0);
    this.customButton7.titleLabel.font = UIFont.boldSystemFontOfSize(14);

    this.createButton("customButton8","customButtonTapped:","buttonScrollview")
    this.customButton8.index = 8
    this.customButton8.setTitleForState(browserConfig.getCustomEmoji(8), 0);
    this.customButton8.titleLabel.font = UIFont.boldSystemFontOfSize(14);

    this.createButton("customButton9","customButtonTapped:","buttonScrollview")
    this.customButton9.index = 9
    this.customButton9.setTitleForState(browserConfig.getCustomEmoji(9), 0);
    this.customButton9.titleLabel.font = UIFont.boldSystemFontOfSize(14);

    this.createButton("customButton10","customButtonTapped:","buttonScrollview")
    this.customButton10.index = 10
    this.customButton10.setTitleForState(browserConfig.getCustomEmoji(10), 0);
    this.customButton10.titleLabel.font = UIFont.boldSystemFontOfSize(14);


    this.createButton("moveButton","moveButtonTapped:")
    MNButton.addLongPressGesture(this.moveButton, this, "onLongPress:")

    this.createButton("goForwardButton","goForwardButtonTapped:","buttonScrollview")
    this.goForwardButton.setImageForState(browserUtils.goforwardImage,0)

    this.createButton("goBackButton","goBackButtonTapped:","buttonScrollview")
    this.goBackButton.setImageForState(browserUtils.gobackImage,0)
    // <<< goBack button <<<
    // >>> refresh button >>>
    this.createButton("refreshButton","refreshButtonTapped:","buttonScrollview")
    this.refreshButton.setImageForState(browserUtils.reloadImage,0)
    MNButton.addLongPressGesture(this.refreshButton, this, "onLongPressRefresh:")

    // <<< refresh button <<<
    this.moveGesture = new UIPanGestureRecognizer(this,"onMoveGesture:")
    this.moveButton.addGestureRecognizer(this.moveGesture)
    this.moveGesture.view.hidden = false
    this.moveGesture.addTargetAction(this,"onMoveGesture:")

    MNButton.addPanGesture(this.engineButton, this, "onResizeGesture:")

    // this.resizeGesture = new UIPanGestureRecognizer(this,"onResizeGesture:")
    // this.resizeGesture.view.hidden = false
    // this.resizeGesture.addTargetAction(this,"onResizeGesture:")

}
/** @this {browserController} */
browserController.prototype.homePageCSS = function(){
  return `
body {
      margin: 0;
      padding: 0;
      background: url('https://vip.123pan.cn/1836303614/dl/win11.jpg') no-repeat center center fixed;
      background-size: cover;
      font-family: "PingFang SC", "Microsoft YaHei", Arial, sans-serif;
      min-height: 100vh;
      position: relative;
      user-select: none;
      -webkit-user-select: none;
    }
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      z-index: -1;
    }
    .container {
      height: 100vh;
      width: 100%;
      margin: 0;
      padding: 30px 5px;
      box-sizing: border-box;
      overflow-y: auto;
    }
    .search-box {
      padding-top: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;
      position: relative;
      gap: 5px;
      transition: all 0.3s ease;
    }

    .search-box input {
      width: 80%;
      padding: 14px 18px;
      border-radius: 25px;
      border: none;
      font-size: 18px;
      outline: none;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }
    .search-box input:hover {
      transform: scale(1.05);
    }
    .search-engine-selector {
      position: absolute;
      left: 1%;
      top: -20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px 12px;
      border-radius: 10px;
      transition: background-color 0.2s;
      background: rgba(255,255,255,0.7);
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }
    .search-engine-selector img {
      width: 20px;
      height: 20px;
    }
    .search-engine-selector span {
      font-size: 14px;
      color: #333;
    }
    .search-engine-dropdown {
      position: absolute;
      left: 1%;
      top: 10px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      display: none;
      z-index: 2;
      min-width: 120px;
      max-height: 200px;
      overflow-y: auto;
    }

    .search-engine-dropdown.show {
      display: block;
    }
    .search-engine-option {
      padding: 8px 12px;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #333;
    }
    .search-engine-option:hover {
      background-color:rgb(220, 220, 220);
    }
    .search-engine-option img {
      width: 20px;
      height: 20px;
    }
   .shortcut-list {
      padding-top: 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      justify-content: center;
      border-radius: 10px;
      width: 100%;
      margin: 0;
      box-sizing: border-box;
      overflow-y: auto;
    }

    @media screen and (min-width: 600px) {
      .shortcut-list {
        width: 85%;
        margin: 0 auto;
        background-color: rgba(255,255,255,0.2);
      }
    }
    .shortcut {
      width: 90px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0px;
      padding-bottom: 15px;
    }
    .shortcut-icon {
      width: 60px;
      height: 60px;
      background: rgba(255,255,255,0.7);
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      transition: transform 0.2s;
      cursor: pointer;
    }
    .shortcut:hover .shortcut-icon {
      background: rgba(255,255,255,0.9);
    }
    .shortcut img {
      width: 32px;
      height: 32px;
    }
    .shortcut span {
      display: block;
      font-size: 13px;
      color: #222;
      text-align: center;
    }
    .settings-button {
      position: fixed;
      right: 10px;
      bottom: 10px;
      width: 50px;
      height: 50px;
      background: rgba(255,255,255,0.7);
      border-radius: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }
    .settings-button:hover {
      background: rgba(255,255,255,0.9);
      transform: scale(1.05);
    }
    .settings-button img {
      width: 24px;
      height: 24px;
    }
  `
}
/** @this {browserController} */
browserController.prototype.homePageHtml = function(){
  return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
  <title>起始页</title>
  <style>
    ${this.homePageCSS()}
  </style>
</head>
<body>
  <div class="container">
    <div class="search-box">
      <div class="search-engine-selector" onclick="toggleSearchEngineDropdown()">
        <img src="https://img.icons8.com/color/48/000000/google.png" alt="搜索引擎" width="24" height="24">
        <span id="currentSearchEngineName" style="font-weight: bold;">Google</span>
      </div>
      <div class="search-engine-dropdown" id="searchEngineDropdown">
      </div>
      <input id="searchInput" type="text" placeholder="搜索或输入网址..." onkeydown="if(event.key==='Enter'){search()}">
    </div>
    <div class="shortcut-list" id="shortcutList">
      <!-- 快捷方式会通过JS插入 -->
    </div>
  </div>
  <div class="settings-button" onclick="openSetting()">
    <img src="https://img.icons8.com/ios/50/000000/settings.png" alt="设置">
  </div>
  <script>
    // 快捷方式数据
    const webapps = ${JSON.stringify(browserConfig.webAppEntries)};
    const webappOrder = ${JSON.stringify(browserConfig.webAppEntrieNames)};

    // 渲染快捷方式
    const shortcutList = document.getElementById('shortcutList');
    /**
     * (手动实现) 根据指定的 scheme、路径和参数生成一个 URL Scheme 字符串。
     * 此版本不使用 URLSearchParams。
     *
     * @param {string} scheme - URL scheme, 例如 'myapp'。
     * @param {string} [host] - 可选的路径或操作名。
     * @param {Object<string, string|number|boolean>} [params] - 查询参数对象。
     * @returns {string} - 生成的完整 URL 字符串。
     */
    function generateUrlScheme(scheme, host, params) {
      let url = \`\${scheme}://\${host || ''}\`;
      if (params && Object.keys(params).length > 0) {
        const queryParts = [];
        for (const key in params) {
          // 确保我们只处理对象自身的属性
          if (Object.prototype.hasOwnProperty.call(params, key)) {
            const value = params[key];
            const type = typeof value
            // 对键和值都进行编码，这是至关重要的！
            const encodedKey = encodeURIComponent(key);
            const encodedValue = encodeURIComponent(type === "object"? JSON.stringify(value):value);
            queryParts.push(\`\${encodedKey}=\${encodedValue}\`);
          }
        }
        if (queryParts.length > 0) {
          url += \`?\${queryParts.join('&')}\`;
        }
      }
      return url;
    }
    function postMessageToAddon(scheme, host, params) {
      let url = generateUrlScheme(scheme,host,params)
      window.location.href = url
    }
    function setShortcuts(config,order){
      shortcutList.innerHTML = '';
      
      order.forEach(item => {
        let webapp = config[item];
        const div = document.createElement('div');
        div.className = 'shortcut';
        div.onclick = () => {
          openShortcut(webapp.link,webapp.desktop);
        };
        console.log(webapp);
        shortcutList.appendChild(div);
        let name = webapp.name ?? webapp.title
        name = name.slice(0,10)
        let nameSpan = \`<span style="font-weight: bold; font-size: 14px;">\${name}</span>\`
        if ("icon" in webapp) {
          div.innerHTML = \`<div class="shortcut-icon"><img src="\${webapp.icon}" alt="\${name}"></div>\${nameSpan}\`;
        } else {
          div.innerHTML = \`<div class="shortcut-icon"><img src="https://vip.123pan.cn/1836303614/dl/icon/webapp.png" alt="\${name}"></div>\${nameSpan}\`;
          // 从URL中提取域名
          const url = new URL(webapp.link);
          const baseUrl = \`\${url.protocol}//\${url.hostname}\`;
          // 尝试多个高质量图标路径
          const iconPaths = [
            '/apple-touch-icon.png',
            '/apple-touch-icon-precomposed.png',
            '/apple-touch-icon-180x180.png',
            '/android-chrome-192x192.png',
            '/android-chrome-512x512.png',
            '/favicon-196x196.png',
            '/favicon-128x128.png',
            '/favicon-96x96.png',
            '/favicon-32x32.png',
            '/favicon.ico'
          ];
          
          // 创建一个图片元素来测试图标是否存在
          const img = new Image();
          let currentPathIndex = 0;
          
          function tryNextIcon() {
            if (currentPathIndex >= iconPaths.length) {
              // 如果所有路径都失败，使用默认图标
              div.innerHTML = \`<div class="shortcut-icon"><img src="https://vip.123pan.cn/1836303614/dl/icon/webapp.png" alt="\${name}"></div>\${nameSpan}\`;
              return;
            }
            
            img.src = baseUrl + iconPaths[currentPathIndex];
            
            img.onload = function() {
              // 找到可用的图标，使用它
              div.innerHTML = \`<div class="shortcut-icon"><img src="\${img.src}" alt="\${name}"></div>\${nameSpan}\`;
            };
            
            img.onerror = function() {
              // 当前图标加载失败，尝试下一个
              currentPathIndex++;
              tryNextIcon();
            };
          }
          
          tryNextIcon();
        }
      });
    }
    setShortcuts(webapps,webappOrder);


    // 搜索引擎配置
    const searchEngines = ${JSON.stringify(browserConfig.entries)};


    let currentSearchEngine = '${browserConfig.homePageEngine}';

    // 切换搜索引擎下拉菜单
    function toggleSearchEngineDropdown() {
      const dropdown = document.getElementById('searchEngineDropdown');
      dropdown.classList.toggle('show');
    }

    // 更改搜索引擎
    function changeSearchEngine(engine,save = true) {
      currentSearchEngine = engine;
      const selector = document.querySelector('.search-engine-selector img');
      const nameElement = document.getElementById('currentSearchEngineName');
      if (searchEngines[engine].icon) {
        selector.src = searchEngines[engine].icon;
      } else {
        selector.src = 'https://vip.123pan.cn/1836303614/dl/icon/search.png';
      }
      nameElement.textContent = searchEngines[engine].engine;
      document.getElementById('searchEngineDropdown').classList.remove('show');
      if (save) {
        // 保存到插件配置
        window.location.href = "browser://changesearchengine?content="+encodeURIComponent(engine)
      }
    }

    function setSearchEngine(engineConfig,currentEngine) {
      searchEngines = engineConfig;
      changeSearchEngine(currentEngine);
    }

    function updateSearchEngineDropdown(engineConfig) {
      const dropdown = document.getElementById('searchEngineDropdown');
      dropdown.innerHTML = '';
      let keys = Object.keys(engineConfig);
      keys.forEach(key => {
        let item = engineConfig[key];
        if (item.icon) {
          icon = item.icon;
        } else {
          icon = 'https://vip.123pan.cn/1836303614/dl/icon/search.png';
        }
        dropdown.innerHTML += \`<div class="search-engine-option" onclick="changeSearchEngine('\${key}')">
          <img src="\${icon}" alt="\${item.engine}">
          <span>\${item.engine}</span>
        </div>\`;
      });
    }

    // 点击其他地方关闭下拉菜单
    document.addEventListener('click', function(event) {
      const dropdown = document.getElementById('searchEngineDropdown');
      const selector = document.querySelector('.search-engine-selector');
      if (!selector.contains(event.target) && !dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
      }
    });

    // 修改搜索功能
    function search() {
      const val = document.getElementById('searchInput').value.trim();
      
      // if (!val) return;
      // const features = searchEngines[currentSearchEngine].desktop ? 'width=1920,height=1080' : '';
      if (val.startsWith('http://') || val.startsWith('https://')) {
        postMessageToAddon('browser','openlink',{url:val})
        //打开链接而不是搜索
      } else {
        let searchInfo = {text:val,engine:currentSearchEngine}
        console.log(searchInfo);
        postMessageToAddon('browser','search',{text:val,engine:currentSearchEngine})
        // window.location.href = "browser://search?content="+encodeURIComponent(JSON.stringify(searchInfo))

      }
    }

    // 打开快捷方式
    function openShortcut(url,desktop) {
      postMessageToAddon('browser','openshortcut',{url:url,desktop:desktop})
      // let shortcutInfo = {url:url,desktop:desktop}
      // window.location.href = "browser://openshortcut?content="+encodeURIComponent(JSON.stringify(shortcutInfo))
      // const features = desktop ? 'width=1920,height=1080' : '';
      // window.open(url, '_blank', features);
    }

    // 设置按钮点击事件处理函数
    function openSetting() {
      window.location.href = 'browser://opensetting';
    }
    updateSearchEngineDropdown(searchEngines);
    changeSearchEngine(currentSearchEngine,false);

  </script>
</body>
</html>
  `
}
/** @this {browserController} */
browserController.prototype.homePage = function() {
try {
  MNUtil.stopHUD()
  this.webview.stopLoading();
  let homePage = browserConfig.getConfig("homePage")
  this.setWebMode(homePage.desktop)
  let useLocalHomePage = browserConfig.getConfig("useLocalHomePage")
  if (useLocalHomePage) {
    let html = this.homePageHtml()
    this.webview.loadHTMLStringBaseURL(html)
  } else {
    MNConnection.loadRequest(this.webview, homePage.url)
  }
  // return
  this.inHomePage = true
  
  // this.webview.loadFileURLAllowingReadAccessToURL(
  //   NSURL.fileURLWithPath(browserUtils.mainPath + '/milkdown.html'),
  //   NSURL.fileURLWithPath(browserUtils.mainPath + '/')
  // );
  this.webview.hidden = false
  this.searchedText = "";
  // MNUtil.delay(0.5).then(()=>{
  //   this.runJavaScript("initMilkdown()")
  // })
  } catch (error) {
  browserUtils.addErrorLog(error, "homePage")
}
  // this.mdxDictView.hidden = false
  // var url = `${this.webview.url}#en/${this.webview.lanCode}/${encodeURIComponent(text.replaceAll('/', '\\/'))}`;
};

/** @this {browserController} */
browserController.prototype.search = function(text,engine=browserConfig.engine) {
try {
  this.inHomePage = false
  // this.webview.stopLoading();
  var url;
  url = browserConfig.entries[engine].link.replace('%s',text)
  // this.searchButton.setTitleForState(browserConfig.entries[engine].symbol, 0);
  this.updateEngineButton()
  if (!text || !text.trim()) {
    MNUtil.showHUD("No text to search")
    return
  }
  this.setWebMode(browserConfig.entries[engine].desktop)
  if (this.webview.url !== url ) {
    this.webview.stopLoading()
    // this.runJavaScript('window.location.href="'+url+'"')
    MNConnection.loadRequest(this.webview, url)

    this.webview.hidden = this.miniMode
    if (!this.miniMode) {
      this.showAllButton()
    }
    this.searchedText = text
    return
  }else{
    if (engine === "Youdao") {
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
  browserUtils.addErrorLog(error, "search")
}
};
/** @this {browserController} */
browserController.prototype.setToolbar = async function(state) {
  browserConfig.toolbar = state
  this.buttonScrollview.hidden = !browserConfig.toolbar

}

/** @this {browserController} */
browserController.prototype.updateDeeplOffset = async function() {
  // MNUtil.showHUD("updateDeeplOffset")
  try {

  if(!this.webview || !this.webview.window){

    return;
  }
  // if (Application.sharedInstance().osType !== 1) {
  await this.runJavaScript(browserUtils.getWebJS("updateDeeplOffset"))
  this.webview.scrollView.contentOffset = {x: 0, y: 100};          
    
  } catch (error) {
    browserUtils.addErrorLog(error, "updateDeeplOffset")
  }
  // this.shouldCopy = false
  // this.shouldComment = false
};
/** @this {browserController} */
browserController.prototype.updateAppiconForgeOffset = function() {
  if(!this.webview || !this.webview.window)return;
  this.runJavaScript(`
      // 兼容多个浏览器的完整解决方案
document.body.style.userSelect = "none";
document.body.style.webkitUserSelect = "none"; // Safari
document.body.style.msUserSelect = "none"; // IE
document.body.style.mozUserSelect = "none"; // Firefox
document.body.style.khtmlUserSelect = "none"; // KHTML browsers

// 禁止选择
document.onselectstart = function() {
    return false;
}`)
  this.shouldCopy = false
  this.shouldComment = false
};

/** @this {browserController} */
browserController.prototype.updateBaiduOffset = function() {
  if(!this.webview || !this.webview.window)return;
  this.runJavaScript(`document.getElementsByClassName("new-header")[0].style.display = "none";`)
  this.shouldCopy = false
  this.shouldComment = false
};

/** @this {browserController} */
browserController.prototype.updateDaiduTranslateOffset = function() {
  if(!this.webview || !this.webview.window)return;
  this.runJavaScript(`document.querySelector('[class^="AppTopSwiper__root"]').style.display='none';`)
  this.shouldCopy = false
  this.shouldComment = false
};

/** @this {browserController} */
browserController.prototype.updateBingOffset = function() {
  if(!this.webview || !this.webview.window)return;
  this.runJavaScript(`document.getElementById("bnp_container").style.display = "none";`)
};

/** @this {browserController} */
browserController.prototype.updateZhihuOffset = async function() {
  if(!this.webview || !this.webview.window)return;
  // await MNUtil.delay(1)
  this.runJavaScript(`
    function updateCSS() {
    // 获取文档中的第一个样式表，或者可以创建一个新的样式表
    const styleSheet = document.styleSheets[0];
    
    // 插入一条CSS规则
    styleSheet.insertRule('.OpenInAppButton {display: none !important;}', styleSheet.cssRules.length);
    styleSheet.insertRule('.Banner-link {display: none !important;\\npointer-events: none;\\nvisibility: hidden;}', styleSheet.cssRules.length);
styleSheet.insertRule('.TopstoryItem--advertCard {display: none !important;\\npointer-events: none;\\nvisibility: hidden;}', styleSheet.cssRules.length);
styleSheet.insertRule('.AdvertImg {display: none !important;\\npointer-events: none;\\nvisibility: hidden;}', styleSheet.cssRules.length);
styleSheet.insertRule('.GlobalSideBar-category {display: none !important;\\npointer-events: none;\\nvisibility: hidden;}', styleSheet.cssRules.length);
  }
  updateCSS()
  
  `)
  // await MNUtil.delay(1)
  // this.runJavaScript(`document.getElementsByClassName("OpenInAppButton")[0].style.display = 'none';`)
  // await MNUtil.delay(1)
  // this.runJavaScript(`document.getElementsByClassName("OpenInAppButton")[0].style.display = 'none';`)
  // await MNUtil.delay(1)
  // this.runJavaScript(`document.getElementsByClassName("OpenInAppButton")[0].style.display = 'none';`)
};

/** @this {browserController} */
browserController.prototype.updateYoudaoOffset = async function() {
  if(!this.webview || !this.webview.window)return;
  await this.runJavaScript(`document.getElementsByClassName("top-download")[0].style.display = "none";
    document.getElementsByClassName("m-top_vav")[0].style.display = "none";`)
  if (this.shouldCopy || this.shouldComment) {
    let result = await this.runJavaScript(`
    let containers = document.getElementsByClassName("trans-container")
    let explains = Array.from(document.getElementsByClassName("word-exp"))
    if (containers.length === 1) {
      containers[0].getElementsByClassName("trans-content")[0].textContent
    }else{
      explains.map(explain=>explain.textContent).join("\\n")
    }
    `)
    this.shouldCopy = false
    this.shouldComment = false
  }
};
/** @this {browserController} */
browserController.prototype.updateRGOffset = function() {
  if(!this.webview || !this.webview.window)return;
  this.runJavaScript(`document.getElementsByClassName("header")[0].style.display = "none"`)
  this.shouldCopy = false
  this.shouldComment = false
};


/** @this {browserController} */
browserController.prototype.runJavaScript = async function(script,delay) {
  if(!this.webview || !this.webview.window)return;
  if (delay) {
    await MNUtil.delay(delay)
  }
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
      browserUtils.addErrorLog(error, "runJavaScript")
      resolve(undefined)
    }
  })
};

/** @this {browserController} */
browserController.prototype.updateBilibiliOffset = async function() {
  if(!this.webview || !this.webview.window)return;
  // MNUtil.showHUD("updateBilibiliOffset")
  await MNUtil.delay(1)
  this.runJavaScript(`
  if (document.getElementsByClassName("recommended-swipe grid-anchor") && document.getElementsByClassName("recommended-swipe grid-anchor").length > 0) {
    document.getElementsByClassName("recommended-swipe grid-anchor")[0].style.display = "none";
  }
  if (document.getElementsByClassName("m-open-app fixed-openapp") && document.getElementsByClassName("m-open-app fixed-openapp").length > 0) {
    document.getElementsByClassName("m-open-app fixed-openapp")[0].style.display = "none";
  }
  if (document.getElementsByClassName("video-card-ad-small") && document.getElementsByClassName("video-card-ad-small").length > 0) {
    document.getElementsByClassName("video-card-ad-small")[0].style.display = "none";
  }
  if (document.getElementsByClassName("ad-report") && document.getElementsByClassName("ad-report").length > 0) {
    document.getElementsByClassName("ad-report")[0].style.display = "none";
  }
  if (document.getElementsByClassName("slide-ad-exp") && document.getElementsByClassName("slide-ad-exp").length > 0) {
    document.getElementsByClassName("slide-ad-exp")[0].style.display = "none";
  }
  `,0.5)
};

/** @this {browserController} */
browserController.prototype.updateBilibiliPCOffset = function() {
  if(!this.webview || !this.webview.window)return;
  this.runJavaScript(`document.getElementById("biliMainHeader").style.display = "none";`,1)
  this.shouldCopy = false
  this.shouldComment = false
};

/** @this {browserController} */
browserController.prototype.updateThesaurusOffset = function() {
  if(!this.webview || !this.webview.window)return;
  this.viewTimer = NSTimer.scheduledTimerWithTimeInterval(2, true, () => {
    this.runJavaScript(getWebJS("updateThesaurusOffset"))
    this.viewTimer.invalidate();
  });
  this.shouldCopy = false
  this.shouldComment = false
};

/** @this {browserController} */
browserController.prototype.getCurrentURL = async function() {
  if(!this.webview || !this.webview.window) return;
  let url = await this.runJavaScript(`window.location.href`)
  this.webview.url = url
  return url
};
/** @this {browserController} */
browserController.prototype.getSelectedTextInWebview = async function() {
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

/** @this {browserController} */
browserController.prototype.getTextInWebview = async function() {
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

/** @this {browserController} */
browserController.prototype.changeButtonOpacity = function(opacity) {
    this.toolbar.layer.opacity = opacity
    this.moveButton.layer.opacity = opacity
    this.maxButton.layer.opacity = opacity
    this.minButton.layer.opacity = opacity
    this.moreButton.layer.opacity = opacity
    this.closeButton.layer.opacity = opacity
}

/** @this {browserController} */
browserController.prototype.setButtonLayout = function (button,targetAction) {
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

/** @this {browserController} */
browserController.prototype.createButton = function (buttonName,targetAction,superview) {
    this[buttonName] = UIButton.buttonWithType(0);
    this[buttonName].autoresizingMask = (1 << 0 | 1 << 3);
    this[buttonName].setTitleColorForState(UIColor.whiteColor(),0);
    this[buttonName].setTitleColorForState(this.highlightColor, 1);
    this[buttonName].backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.8)
    this[buttonName].layer.cornerRadius = 10;
    this[buttonName].layer.masksToBounds = true;
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

/** @this {browserController} */
browserController.prototype.settingViewLayout = function (){
  try {
  

    let viewFrame = this.view.bounds
    let width = viewFrame.width
    let height = viewFrame.height
    width = width-16
    height = height -60
    MNFrame.set(this.settingView, 8, 20, width, height)
    MNFrame.set(this.configSearchView, 0, 40, width, height-10)
    MNFrame.set(this.customButtonView, 0, 40, width, height-40)
    MNFrame.set(this.advanceView, 0, 40, width, height-10)
    MNFrame.set(this.syncView, 0, 40, width, height-10)

    this.setCustomButton1.frame = MNUtil.genFrame(5,0,width-10,35)
    this.setCustomButton2.frame = MNUtil.genFrame(5,40,width-10,35)
    this.setCustomButton3.frame = MNUtil.genFrame(5,80,width-10,35)
    this.setCustomButton4.frame = MNUtil.genFrame(5,120,width-10,35)
    this.setCustomButton5.frame = MNUtil.genFrame(5,160,width-10,35)
    this.setCustomButton6.frame = MNUtil.genFrame(5,200,width-10,35)
    this.setCustomButton7.frame = MNUtil.genFrame(5,240,width-10,35)
    this.setCustomButton8.frame = MNUtil.genFrame(5,280,width-10,35)
    this.setCustomButton9.frame = MNUtil.genFrame(5,320,width-10,35)
    this.setCustomButton10.frame = MNUtil.genFrame(5,360,width-10,35)
    this.customButtonView.contentSize = {width:width-20,height:360+35}
    this.orderButton.frame = MNUtil.genFrame(5,0,width-10,35)
    this.setHomepageButton.frame = MNUtil.genFrame(5,40,width-10,35)
    this.timestampDetail.frame = MNUtil.genFrame(5,80,width-10,35)
    this.autoOpenVideoExcerpt.frame = MNUtil.genFrame(5,120,width-10,35)
    this.autoExitWatchMode.frame = MNUtil.genFrame(5,160,width-10,35)
    this.opacityButton.frame = MNUtil.genFrame(5,200,130,35)
    this.slider.frame = MNUtil.genFrame(145,202,width-160,35)
    MNFrame.set(this.textviewInput, 5, 185, width-10, height-230)
    this.saveConfigButton.frame = {x:width-70,y:height-80,width:60,height:30}
    this.pasteConfigButton.frame = {x:width-135,y:height-80,width:60,height:30}
    this.copyConfigButton.frame = {x:width-200,y:height-80,width:60,height:30}

    this.scrollview.frame = {x:5,y:0,width:width-10,height:180};
    this.scrollview.contentSize = {width:width-20,height:height};
    this.moveUpButton.frame = {x:width-40,y:5,width:30,height:30}
    this.moveDownButton.frame = {x:width-40,y:40,width:30,height:30}
    this.newEntryButton.frame = {x:width-40,y:75,width:30,height:30}
    this.configReset.frame = {x:width-40,y:110,width:30,height:30}
    this.deleteButton.frame = {x:width-40,y:145,width:30,height:30}
    //syncView
    this.syncSourceButton.frame = MNUtil.genFrame(10, 10, width-20, 35)
    this.configNoteIdInput.frame = MNUtil.genFrame(10,50,width-20,70)
    this.syncTimeButton.frame = MNUtil.genFrame(10,125,width-20,35)
    this.exportConfigButton.frame = MNUtil.genFrame(15+(width-25)*0.5,165,(width-25)*0.5,35)
    this.importConfigButton.frame = MNUtil.genFrame(10,165,(width-25)*0.5,35)
    this.autoExportButton.frame = MNUtil.genFrame(15+(width-25)*0.5,205,(width-25)*0.5,35)
    this.autoImportButton.frame = MNUtil.genFrame(10,205,(width-25)*0.5,35)
    this.pasteConfigNoteButton.frame = MNUtil.genFrame(width-75,85,60,30)
    this.clearConfigNoteButton.frame = MNUtil.genFrame(width-140,85,60,30)
    this.focusConfigNoteButton.frame = MNUtil.genFrame(width-205,85,60,30)
    this.restoreConfigButton.frame = MNUtil.genFrame(10, height-85, width-20, 35)

    let settingFrame = this.settingView.bounds
    settingFrame.x = 5
    settingFrame.y = 5
    settingFrame.height = 30
    settingFrame.width = this.configSearchButton.width
    this.configSearchButton.frame = settingFrame
    settingFrame.x = settingFrame.x + this.configSearchButton.width + 4.5
    settingFrame.width = this.configWebappButton.width
    this.configWebappButton.frame = settingFrame
    settingFrame.x = settingFrame.x + this.configWebappButton.width + 4.5
    settingFrame.width = this.configCustomButton.width
    this.configCustomButton.frame = settingFrame
    settingFrame.x = settingFrame.x + this.configCustomButton.width + 4.5
    settingFrame.width = this.syncConfig.width
    this.syncConfig.frame = settingFrame
    settingFrame.x = settingFrame.x + this.syncConfig.width + 4.5
    settingFrame.width = this.advancedButton.width
    this.advancedButton.frame = settingFrame
    MNFrame.set(this.closeConfig, width - 35, 5, 30, 30)

  } catch (error) {
    browserUtils.addErrorLog(error, "settingViewLayout")
  }
}

/** @this {browserController} */
browserController.prototype.createSettingView = function (){
try {
  let targetView = "settingView"

  this.configMode = 0
  this.configEngine = browserConfig.engine
  this.settingView = UIView.new()
  this.settingView.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0.8)
  this.settingView.layer.cornerRadius = 13
  this.settingView.hidden = true
  this.view.addSubview(this.settingView)

  this.configSearchView = UIView.new()
  this.configSearchView.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.0)
  this.configSearchView.layer.cornerRadius = 12
  this.settingView.addSubview(this.configSearchView)


  this.customButtonView = UIScrollView.new()
  this.settingView.addSubview(this.customButtonView)
  this.customButtonView.hidden = true
  this.customButtonView.delegate = this
  this.customButtonView.bounces = true
  this.customButtonView.alwaysBounceVertical = true
  this.customButtonView.layer.cornerRadius = 10
  this.customButtonView.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.0)


  this.advanceView = UIView.new()
  this.advanceView.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.0)
  this.advanceView.layer.cornerRadius = 12
  this.settingView.addSubview(this.advanceView)
  this.advanceView.hidden = true

  this.syncView = UIView.new()
  this.syncView.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.0)
  this.syncView.layer.cornerRadius = 12
  this.settingView.addSubview(this.syncView)
  this.syncView.hidden = true

  // this.creatView("syncView",targetView,"#9bb2d6",0.0)
  // this.syncView.hidden = true

  this.createButton("configSearchButton","configSearchTapped:",targetView)
  // this.configSearchButton.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  // this.configSearchButton.layer.opacity = 1.0
  MNButton.setConfig(this.configSearchButton, {title:"Search",font:17,bold:true,color:"#457bd3",alpha:0.8,opacity:1.0})
  let size = this.configSearchButton.sizeThatFits({width:100,height:100})
  this.configSearchButton.width = size.width+15


  this.createButton("configWebappButton","configWebAppTapped:",targetView)
  // this.configWebappButton.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  // this.configWebappButton.layer.opacity = 1.0
  MNButton.setConfig(this.configWebappButton, {title:"WebApp",font:17,bold:true,alpha:0.8,opacity:1.0})
  size = this.configWebappButton.sizeThatFits({width:100,height:100})
  this.configWebappButton.width = size.width+15

  this.createButton("configCustomButton","configCustomButtonTapped:",targetView)
  // this.configWebappButton.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  // this.configWebappButton.layer.opacity = 1.0
  MNButton.setConfig(this.configCustomButton, {title:"Button",font:17,bold:true,alpha:0.8,opacity:1.0})
  size = this.configCustomButton.sizeThatFits({width:100,height:100})
  this.configCustomButton.width = size.width+15

  this.createButton("advancedButton","advancedButtonTapped:",targetView)
  // this.advancedButton.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.advancedButton.layer.opacity = 1.0
  this.advancedButton.setTitleForState("More",0)
  MNButton.setConfig(this.advancedButton, {title:"More",font:17,bold:true})
  size = this.advancedButton.sizeThatFits({width:100,height:100})
  this.advancedButton.width = size.width+15

  this.createButton("closeConfig","closeConfigTapped:",targetView)
  this.closeConfig.setImageForState(browserUtils.stopImage,0)
  this.closeConfig.backgroundColor = MNUtil.hexColorAlpha("#e06c75",0.8)

  this.createButton("syncConfig","syncConfigTapped:",targetView)
  MNButton.setConfig(this.syncConfig, 
    {color:"#9bb2d6",alpha:0.8,opacity:1.0,title:"Sync",font:17,bold:true}
  )
  size = this.syncConfig.sizeThatFits({width:100,height:100})
  this.syncConfig.width = size.width+15
  

  targetView = "configSearchView"



  this.scrollview = UIScrollView.new()
  this.configSearchView.addSubview(this.scrollview)
  this.scrollview.hidden = false
  this.scrollview.delegate = this
  this.scrollview.bounces = true
  this.scrollview.alwaysBounceVertical = true
  this.scrollview.layer.cornerRadius = 10
  this.scrollview.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)



  this.textviewInput = UITextView.new()
  this.textviewInput.font = UIFont.systemFontOfSize(16);
  this.textviewInput.layer.cornerRadius = 10
  this.textviewInput.backgroundColor = MNUtil.hexColorAlpha("#c0bfbf",0.8)
  this.textviewInput.textColor = UIColor.blackColor()
  this.configSearchView.addSubview(this.textviewInput)
  this.textviewInput.text = `Input here`
  this.textviewInput.bounces = true

  // let entries           = NSUserDefaults.standardUserDefaults().objectForKey('MNBrowser_entries');
  this.createButton("saveConfigButton","configSaveTapped:",targetView)
  this.saveConfigButton.layer.opacity = 1.0
  MNButton.setColor(this.saveConfigButton, "#e06c75")
  MNButton.setTitle(this.saveConfigButton, "Save",undefined,true)

  this.createButton("copyConfigButton","configCopyTapped:",targetView)
  this.copyConfigButton.layer.opacity = 1.0
  // MNButton.setColor(this.copyConfigButton, "#e06c75")
  MNButton.setTitle(this.copyConfigButton, "Copy",undefined,true)

  this.createButton("pasteConfigButton","configPasteTapped:",targetView)
  this.pasteConfigButton.layer.opacity = 1.0
  // MNButton.setColor(this.pasteConfigButton, "#e06c75")
  MNButton.setTitle(this.pasteConfigButton, "Paste",undefined,true)

  this.createButton("deleteButton","configDeleteTapped:",targetView)
  this.deleteButton.layer.opacity = 1.0
  this.deleteButton.setTitleForState("🗑",0)
  MNButton.setColor(this.deleteButton, "#ffffff",0.8)

  this.createButton("moveUpButton","configMoveUpTapped:",targetView)
  this.moveUpButton.layer.opacity = 1.0
  this.moveUpButton.setTitleForState("🔼",0)
  MNButton.setColor(this.moveUpButton, "#ffffff",0.8)
  this.createButton("moveDownButton","configMoveDownTapped:",targetView)
  this.moveDownButton.layer.opacity = 1.0
  this.moveDownButton.setTitleForState("🔽",0)
  MNButton.setColor(this.moveDownButton, "#ffffff",0.8)

  this.createButton("newEntryButton","configAddTapped:",targetView)
  this.newEntryButton.layer.opacity = 1.0
  this.newEntryButton.setTitleForState("➕",0)
  MNButton.setColor(this.newEntryButton, "#ffffff",0.8)

  this.createButton("configReset","resetConfig:",targetView)
  this.configReset.layer.opacity = 1.0
  this.configReset.setTitleForState("🔄",0)
  MNButton.setColor(this.configReset, "#ffffff",0.8)

  this.createButton("orderButton","changeSearchOrder:","advanceView")
  this.orderButton.layer.opacity = 1.0
  this.orderButton.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.orderButton.setTitleForState(browserUtils.getOrderText(browserConfig.searchOrder),0)

  this.createButton("setHomepageButton","setHomepage:","advanceView")
  this.setHomepageButton.layer.opacity = 1.0
  this.setHomepageButton.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  if (browserConfig.getConfig("useLocalHomePage")) {
    this.setHomepageButton.setTitleForState("HomePage: Local",0)
  } else {
    this.setHomepageButton.setTitleForState("HomePage: "+browserConfig.getConfig("homePage").url,0)
  }

  this.createButton("setCustomButton1","changeCustomButton:","customButtonView")
  this.setCustomButton1.index = 1
  this.setCustomButton1.layer.opacity = 1.0
  this.setCustomButton1.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.setCustomButton1.setTitleForState("Custom1: "+browserConfig.getCustomDescription(browserConfig.getConfig("custom")),0)

  this.createButton("setCustomButton2","changeCustomButton:","customButtonView")
  this.setCustomButton2.index = 2
  this.setCustomButton2.layer.opacity = 1.0
  this.setCustomButton2.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.setCustomButton2.setTitleForState("Custom2: "+browserConfig.getCustomDescription(browserConfig.getConfig("custom2")),0)

  this.createButton("setCustomButton3","changeCustomButton:","customButtonView")
  this.setCustomButton3.index = 3
  this.setCustomButton3.layer.opacity = 1.0
  this.setCustomButton3.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.setCustomButton3.setTitleForState("Custom3: "+browserConfig.getCustomDescription(browserConfig.getConfig("custom3")),0)

  this.createButton("setCustomButton4","changeCustomButton:","customButtonView")
  this.setCustomButton4.index = 4
  this.setCustomButton4.layer.opacity = 1.0
  this.setCustomButton4.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.setCustomButton4.setTitleForState("Custom4: "+browserConfig.getCustomDescription(browserConfig.getConfig("custom4")),0)

  this.createButton("setCustomButton5","changeCustomButton:","customButtonView")
  this.setCustomButton5.index = 5
  this.setCustomButton5.layer.opacity = 1.0
  this.setCustomButton5.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.setCustomButton5.setTitleForState("Custom5: "+browserConfig.getCustomDescription(browserConfig.getConfig("custom5")),0)

  this.createButton("setCustomButton6","changeCustomButton:","customButtonView")
  this.setCustomButton6.index = 6
  this.setCustomButton6.layer.opacity = 1.0
  this.setCustomButton6.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.setCustomButton6.setTitleForState("Custom6: "+browserConfig.getCustomDescription(browserConfig.getConfig("custom6")),0)

  this.createButton("setCustomButton7","changeCustomButton:","customButtonView")

  this.setCustomButton7.index = 7
  this.setCustomButton7.layer.opacity = 1.0
  this.setCustomButton7.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.setCustomButton7.setTitleForState("Custom7: "+browserConfig.getCustomDescription(browserConfig.getConfig("custom7")),0)

  this.createButton("setCustomButton8","changeCustomButton:","customButtonView")
  this.setCustomButton8.index = 8
  this.setCustomButton8.layer.opacity = 1.0
  this.setCustomButton8.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.setCustomButton8.setTitleForState("Custom8: "+browserConfig.getCustomDescription(browserConfig.getConfig("custom8")),0)

  this.createButton("setCustomButton9","changeCustomButton:","customButtonView")
  this.setCustomButton9.index = 9
  this.setCustomButton9.layer.opacity = 1.0
  this.setCustomButton9.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.setCustomButton9.setTitleForState("Custom9: "+browserConfig.getCustomDescription(browserConfig.getConfig("custom9")),0)

  this.createButton("setCustomButton10","changeCustomButton:","customButtonView")
  this.setCustomButton10.index = 10
  this.setCustomButton10.layer.opacity = 1.0
  this.setCustomButton10.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.setCustomButton10.setTitleForState("Custom10: "+browserConfig.getCustomDescription(browserConfig.getConfig("custom10")),0)

  this.createButton("timestampDetail","toggleTimestampeDetail:","advanceView")
  this.timestampDetail.layer.opacity = 1.0
  this.timestampDetail.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.timestampDetail.setTitleForState("Timestamp Detail: "+(browserConfig.getConfig("timestampDetail")?"✅":"❌"),0)

  this.createButton("autoOpenVideoExcerpt","toggleAutoOpenVideoExcerpt:","advanceView")
  this.autoOpenVideoExcerpt.layer.opacity = 1.0
  this.autoOpenVideoExcerpt.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.autoOpenVideoExcerpt.setTitleForState("Auto Open Video Excerpt: "+(browserConfig.getConfig("autoOpenVideoExcerpt")?"✅":"❌"),0)

  this.createButton("autoExitWatchMode","toggleAutoExitWatchMode:","advanceView")
  this.autoExitWatchMode.layer.opacity = 1.0
  this.autoExitWatchMode.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.autoExitWatchMode.setTitleForState("Auto Exit Watch Mode: "+(browserConfig.getConfig("autoExitWatchMode")?"✅":"❌"),0)

  this.createButton("opacityButton","changeOpacity:","advanceView")
  this.opacityButton.layer.opacity = 1.0
  this.opacityButton.backgroundColor = MNUtil.hexColorAlpha("#457bd3",0.8)
  this.opacityButton.setTitleForState("Opacity: 100.0%",0)

  this.slider = UISlider.new()
  this.slider.minimumValue = 0.2
  this.slider.maximumValue = 1.0
  this.slider.value = 1.0
  this.slider.addTargetActionForControlEvents(this, "changeOpacity:",1<<6)
  this.advanceView.addSubview(this.slider)

  targetView = "syncView"

  this.createButton("syncSourceButton","changeSyncSource:",targetView)
  MNButton.setConfig(this.syncSourceButton, {title:"Sync Config: "+browserConfig.getSyncSourceString(),color:"#457bd3",font:17,alpha:0.8,bold:true,radius:11})

  this.creatTextView("configNoteIdInput",targetView)
  this.configNoteIdInput.editable = false

  this.createButton("syncTimeButton","syncConfig:",targetView)
  MNButton.setConfig(this.syncTimeButton, {color:"#457bd3",alpha:0.8})
  
  this.createButton("exportConfigButton","exportConfig:",targetView)
  MNButton.setConfig(this.exportConfigButton, {title:"Export To Note",color:"#457bd3",alpha:0.8})

  this.createButton("restoreConfigButton","restoreConfig:",targetView)
  MNButton.setConfig(this.restoreConfigButton, {title:"Restore Config"})

  this.createButton("importConfigButton","importConfig:",targetView)
  MNButton.setConfig(this.importConfigButton, {title:"Import From Note",color:"#457bd3",alpha:0.8})

  this.createButton("autoExportButton","toggleAutoExport:",targetView)
  MNButton.setConfig(this.autoExportButton, {color:"#457bd3",alpha:0.8})

  this.createButton("autoImportButton","toggleAutoImport:",targetView)
  MNButton.setConfig(this.autoImportButton, {color:"#457bd3",alpha:0.8})

  this.createButton("pasteConfigNoteButton","pasteConfigNoteId:",targetView)
  MNButton.setConfig(this.pasteConfigNoteButton, {title:"Paste",color:"#9bb2d6",alpha:0.8})

  this.createButton("clearConfigNoteButton","clearConfigNoteId:",targetView)
  MNButton.setConfig(this.clearConfigNoteButton, {title:"Clear",color:"#9bb2d6",alpha:0.8})

  this.createButton("focusConfigNoteButton","focusConfigNoteId:",targetView)
  MNButton.setConfig(this.focusConfigNoteButton, {title:"Focus",color:"#9bb2d6",alpha:0.8})
  this.refreshView(targetView)
} catch (error) {
  browserUtils.addErrorLog(error, "createSettingView")
}
try {
  let text  = browserConfig.entries[browserConfig.engine]
  if (!text.title) {
    if (browserConfig.engine in browserConfig.defaultEntries) {
      text = browserConfig.defaultEntries[browserConfig.engine]
      browserConfig.entries[browserConfig.engine] = text
    }else{
      browserConfig.engine = browserConfig.entrieNames[0]
      text  = browserConfig.entries[browserConfig.engine]
    }
  }
  this.textviewInput.text = `{
  "title":   "${text.title}",
  "symbol":  "${text.symbol}",
  "engine":  "${text.engine}",
  "desktop": ${text.desktop},
  "link":    "${text.link}"
}`
} catch (error) {
    browserUtils.addErrorLog(error, "textviewInput")
}

}

/** @this {browserController} */
browserController.prototype.setButtonText = function (names,highlight) {
try {

    this.words = names

    names.map((word,index)=>{
      if (!this["nameButton"+index]) {
        this.createButton("nameButton"+index,"toggleSelected:","scrollview")
        // this["nameButton"+index].index = index
        this["nameButton"+index].titleLabel.font = UIFont.systemFontOfSize(16);
      }
      this["nameButton"+index].hidden = false
      this["nameButton"+index].setTitleForState(this.configMode===0?browserConfig.entries[word].title:browserConfig.webAppEntries[word].title,0) 
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
} catch (error) {
    browserUtils.addErrorLog(error, "setButtonText")
}
}
/** @this {browserController} */
browserController.prototype.setTextview = function (name) {
    if (this.configMode === 0) {
      // let entries           = NSUserDefaults.standardUserDefaults().objectForKey('MNBrowser_entries');
      let text  = browserConfig.entries[name]
      let config = {
        title:text.title,
        symbol:text.symbol,
        engine:text.engine,
        desktop:text.desktop,
        link:text.link
      }
      if ("icon" in text) {
        config.icon = text.icon
      }
      this.textviewInput.text = JSON.stringify(config,null,2)
    }else{
      // let entries           = NSUserDefaults.standardUserDefaults().objectForKey('MNBrowser_webAppEntries');
      let text  = browserConfig.webAppEntries[name]
      let config = {
        title:text.title,
        desktop:text.desktop,
        link:text.link
      }
      if ("name" in text) {
        config.name = text.name
      }
      if ("icon" in text) {
        config.icon = text.icon
      }
      this.textviewInput.text = JSON.stringify(config,null,2)
    }

}
/** @this {browserController} */
browserController.prototype.setSplitScreenFrame = function (mode) {  
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
/** @this {browserController} */
browserController.prototype.toMinimode = function (frame,lastFrame) {
  this.miniMode = true 
  if (lastFrame) {
    this.lastFrame = lastFrame
  }else{
    this.lastFrame = this.view.frame 
  }
  this.webview.hidden = true
  this.currentFrame  = this.view.frame
  this.hideAllButton()
  this.view.layer.borderWidth = 0
  let color = this.desktop ? "#b5b5f5":"#9bb2d6"
  this.view.layer.backgroundColor = MNUtil.hexColorAlpha(color,0.8)
  this.view.layer.borderColor = MNUtil.hexColorAlpha(color,0.8)
  MNUtil.animate(()=>{
    this.setFrame(frame)
  }).then(()=>{
    this.moveButton.frame = MNUtil.genFrame(0,0,40,40)
    this.moveButton.hidden = false
    this.moveButton.setImageForState(browserUtils.homeImage,0)
  })
}
/** @this {browserController} */
browserController.prototype.refreshLayout = function (refreshHomepage = false) {
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
      // let title = this.configMode===0?browserConfig.entries[word].title:browserConfig.webAppEntries[word].title
      // let width = strCode(title.replaceAll(" ",""))*9+15
      let width = this["nameButton"+index].sizeThatFits({width:100,height:30}).width+15

      if (xLeft+initX+width > viewFrame.width-20) {
        initX = 8
        initY = initY+38
        initL = initL+1
      }
      this["nameButton"+index].frame = {  x: xLeft+initX,  y: initY,  width: width,  height: 30,};
      this.locs.push({
        x:xLeft+initX,
        y:initY,
        l:initL,
        i:index
      })
      initX = initX+width+8
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
    let initX = 8
    let initY = 8
    let initL = 0
    this.locs = [];
    this.words.map((word,index)=>{
      let title = this.configMode===0?browserConfig.entries[word].title:browserConfig.webAppEntries[word].title
      let width = this["nameButton"+index].sizeThatFits({width:100,height:30}).width+15
      if (xLeft+initX+width > viewFrame.width-20) {
        initX = 8
        initY = initY+38
        initL = initL+1
      }
      this["nameButton"+index].frame = {  x: xLeft+initX,  y: initY,  width: width,  height: 30,};
      this.locs.push({
        x:xLeft+initX,
        y:initY,
        l:initL,
        i:index
      })
      initX = initX+width+8
    })
    if (this.lastLength && this.lastLength>this.words.length) {
      for (let index = this.words.length; index < this.lastLength; index++) {
        this["nameButton"+index].hidden = true
      }
    }
    this.lastLength = this.words.length
    this.scrollview.contentSize= {width:viewFrame.width,height:initY+40}
  }
  if (refreshHomepage && this.inHomePage && browserConfig.getConfig("useLocalHomePage")) {
    this.homePage()
  }


}

/** @this {browserController} */
browserController.prototype.getColor = function (highlight = false) {
  if (this.desktop) {
    if (highlight) {
      return "#9e77ff"
    }
    return "#b5b5f5"
  }
  if (highlight) {
    return "#5483cd"
  }
  return "#9bb2d6"
}

/** @this {browserController} */
browserController.prototype.setWebMode = function (desktop = false) {
  if (desktop) {
    this.desktop = true
    this.webview.customUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15'
    this.setAllButtonColor("#b5b5f5")
  }else{
    this.desktop = false
    this.webview.customUserAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'
    this.setAllButtonColor("#9bb2d6")
  }
}

/** @this {browserController} */
browserController.prototype.setAllButtonColor = function (color = "#9bb2d6") {
  MNButton.setColor(this.moveButton, color,0.8)
  MNButton.setColor(this.closeButton, color,0.8)
  MNButton.setColor(this.maxButton, color, 0.8)
  MNButton.setColor(this.minButton, color, 0.8)
  MNButton.setColor(this.moreButton, color, 0.8)
  MNButton.setColor(this.goBackButton, color, 0.8)
  MNButton.setColor(this.goForwardButton, color, 0.8)
  MNButton.setColor(this.refreshButton, color, 0.8)
  MNButton.setColor(this.engineButton, color, 0.8)
  MNButton.setColor(this.customButton1, color, 0.8)
  MNButton.setColor(this.customButton2, color, 0.8)
  MNButton.setColor(this.customButton3, color, 0.8)
  MNButton.setColor(this.customButton4, color, 0.8)
  MNButton.setColor(this.customButton5, color, 0.8)
  MNButton.setColor(this.customButton6, color, 0.8)
  MNButton.setColor(this.customButton7, color, 0.8)
  MNButton.setColor(this.customButton8, color, 0.8)
  MNButton.setColor(this.customButton9, color, 0.8)
  MNButton.setColor(this.customButton10, color, 0.8)
  MNButton.setColor(this.homeButton, color, 0.8)
  MNButton.setColor(this.webAppButton, color, 0.8)


}
/** @this {browserController} */
browserController.prototype.hideAllButton = function (frame) {
  this.moveButton.hidden = true
  this.closeButton.hidden = true
  this.maxButton.hidden = true
  this.minButton.hidden = true
  this.moreButton.hidden = true
  this.toolbar.hidden = true
}
/** @this {browserController} */
browserController.prototype.showAllButton = function (frame) {
  this.moveButton.hidden = false
  this.closeButton.hidden = false
  this.maxButton.hidden = false
  this.minButton.hidden = false
  this.moreButton.hidden = false
  this.toolbar.hidden = false
}
/** @this {browserController} */
browserController.prototype.show = function (beginFrame,endFrame) {
  let preFrame = this.currentFrame //目标矩形
  let studyFrame = MNUtil.studyView.frame
  if (endFrame) {
    preFrame = endFrame
  }
  preFrame.height = MNUtil.constrain(preFrame.height, 100, studyFrame.height)
  preFrame.width = MNUtil.constrain(preFrame.width, 215, studyFrame.width)
  preFrame.x = MNUtil.constrain(preFrame.x, 0, studyFrame.width-preFrame.width)
  preFrame.y = MNUtil.constrain(preFrame.y, 0, studyFrame.height-preFrame.height)
  let preOpacity = this.view.layer.opacity
  // studyController().view.bringSubviewToFront(this.view)
  this.view.layer.opacity = 0.2
  if (beginFrame) {
    this.setFrame(beginFrame)
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
  this.updateEngineButton()
  this.moreButton.hidden = true
  this.onAnimate = true
  MNUtil.animate(()=>{
    this.view.layer.opacity = preOpacity
    this.setFrame(preFrame)
  }).then(()=>{
    MNUtil.studyView.bringSubviewToFront(this.view)
    this.webview.layer.borderWidth = 0
    this.view.layer.borderWidth = 0
    this.webview.hidden = false
    this.view.backgroundColor = MNUtil.hexColorAlpha("#9bb2d6",0.0)
    this.moveButton.setImageForState(undefined,0)
    this.onAnimate = false
    this.showAllButton()
    this.view.setNeedsLayout()
  })
}
/** @this {browserController} */
browserController.prototype.hide = function (frame) {
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
    // MNUtil.showHUD("message"+this.currentFrame.width)
    // MNUtil.copyJSON(this.view.currentFrame)
    this.webview.layer.borderWidth = 0
    this.custom = preCustom
  })
}
/** @this {browserController} */
browserController.prototype.setFrame = function(x,y,width,height){
    if (typeof x === "object") {
      this.view.frame = x
    }else{
      this.view.frame = MNUtil.genFrame(x, y, width, height)
    }
    this.currentFrame = this.view.frame
  }

/** @this {browserController} */
browserController.prototype.creatView = function (viewName,superview="view",color="#9bb2d6",alpha=0.8) {
  this[viewName] = UIView.new()
  this[viewName].backgroundColor = MNUtil.hexColorAlpha(color,alpha)
  this[viewName].layer.cornerRadius = 12
  this[superview].addSubview(this[viewName])
}

/** @this {browserController} */
browserController.prototype.creatTextView = function (viewName,superview="view",color="#c0bfbf",alpha=0.8) {
  this[viewName] = UITextView.new()
  this[viewName].font = UIFont.systemFontOfSize(15);
  this[viewName].layer.cornerRadius = 8
  this[viewName].backgroundColor = MNUtil.hexColorAlpha(color,alpha)
  this[viewName].textColor = UIColor.blackColor()
  this[viewName].delegate = this
  this[viewName].bounces = true
  this[superview].addSubview(this[viewName])
}

browserController.prototype.refreshView = function (targetView) {
try {

  switch (targetView) {
    case "syncView":
      let syncSource = browserConfig.getConfig("syncSource")
      switch (syncSource) {
        case "iCloud" :
          this.configNoteIdInput.hidden = true
          this.syncTimeButton.hidden = false
          this.importConfigButton.hidden = false
          this.exportConfigButton.hidden = false
          this.autoImportButton.hidden = false
          this.autoExportButton.hidden = false
          this.pasteConfigNoteButton.hidden = true
          this.clearConfigNoteButton.hidden = true
          this.focusConfigNoteButton.hidden = true
          MNButton.setTitle(this.importConfigButton, "Import from iCloud")
          MNButton.setTitle(this.exportConfigButton, "Export to iCloud")
          break;
        case "MNNote":
          this.configNoteIdInput.hidden = false
          this.syncTimeButton.hidden = false
          this.importConfigButton.hidden = false
          this.exportConfigButton.hidden = false
          this.autoImportButton.hidden = false
          this.autoExportButton.hidden = false
          this.pasteConfigNoteButton.hidden = false
          this.clearConfigNoteButton.hidden = false
          this.focusConfigNoteButton.hidden = false
          this.configNoteIdInput.text = browserConfig.getConfig("syncNoteId")
          MNButton.setTitle(this.importConfigButton, "Import from Note")
          MNButton.setTitle(this.exportConfigButton, "Export to Note")
          break;
        case "None":
          this.configNoteIdInput.hidden = true
          this.importConfigButton.hidden = true
          this.exportConfigButton.hidden = true
          this.autoImportButton.hidden = true
          this.autoExportButton.hidden = true
          this.pasteConfigNoteButton.hidden = true
          this.clearConfigNoteButton.hidden = true
          this.focusConfigNoteButton.hidden = true
          this.syncTimeButton.hidden = true
        default:
          break;
      }
      MNButton.setTitle(this.autoExportButton, "Auto Export: "+(browserConfig.getConfig("autoExport")?"✅":"❌"))
      MNButton.setTitle(this.autoImportButton, "Auto Import: "+(browserConfig.getConfig("autoImport")?"✅":"❌"))
      let dateObj = new Date(browserConfig.getConfig("lastSyncTime"))
      MNButton.setTitle(this.syncTimeButton, "Last Sync Time: "+dateObj.toLocaleString())
      break;
    case "configSearchView":
      if (this.configMode === 0) {
        this.setButtonText(browserConfig.entrieNames,browserConfig.engine)
        this.setTextview(browserConfig.engine)
      }else{
        this.setButtonText(browserConfig.webAppEntrieNames,this.webApp)
        this.setTextview(this.webApp)
      }
      break;
    default:
      break;
  }
  
} catch (error) {
  browserUtils.addErrorLog(error, "refreshView")
}
}
browserController.prototype.getCurrentURL = async function(url) {
  return new Promise((resolve, reject) => {
    if(!this.webview || !this.webview.window)return;
    this.webview.evaluateJavaScript(
      `window.location.href`,
      (ret) => {
        this.webview.url = ret
        resolve(ret)
      }
    );
  })
};
/** @this {browserController} */
browserController.prototype.openOrJump = async function(bvid,time = 0,p) {
try {
  

  if (this.view.hidden) {
    MNUtil.showHUD(`window is hidden`)
    return
  }
  let timestamp = await this.getTimestamp()

  // await this.getCurrentURL()

  // let res = this.webview.url.match(/(?<=bilibili.com\/video\/)\w+/);
  // // MNUtil.copy("bv:"+this.webview.url)
  // if (res) {
  //   this.currentBvid = res[0]
  // }else{
  //   this.currentBvid = ""
  // }
  let formatedVideoTime = browserUtils.formatSeconds(parseFloat(time))
  if (this.currentBvid && this.currentBvid === bvid && (this.currentP === p)) {
    MNUtil.showHUD(`Jump to ${formatedVideoTime}`)
    this.runJavaScript(`document.getElementsByTagName("video")[0].currentTime = ${time}`)
  }else{
    //  Application.sharedInstance().showHUD("should open", this.view.window, 2);
    this.currentBvid = bvid
    var url = `https://www.bilibili.com/`+bvid+`?t=`+time
    if (p) {
      url = url+"&p="+p
    }
    MNUtil.showHUD(url)
    this.setWebMode(true)
    // MNConnection.loadRequest(this.webview, url)
    this.runJavaScript(`window.location.href="${url}"`)
  }
} catch (error) {
  browserUtils.addErrorLog(error, "openOrJump")
}
};
/** @this {browserController} */
browserController.prototype.openOrJumpForYT = async function(Ytid,time) {
try {
  let parseTime = parseInt(time)
  if (this.view.hidden) {
     Application.sharedInstance().showHUD(`window is hidden`, this.view.window, 2);
    return
  }
  await this.getCurrentURL()
  let res = this.webview.url.match(/(?<=youtube.com\/watch\?t\=.*&v\=)\w+/);
  if (res) {
    this.currentYtid = res[0]
  }else{
    this.currentYtid = ""
  }
  let formatedVideoTime = browserUtils.formatSeconds(parseTime)
  // NSUserDefaults.standardUserDefaults().synchronize();
  // let object = NSUserDefaults.standardUserDefaults().objectForKey("UserAgent");
    //  Application.sharedInstance().showHUD(text, this.view.window, 2);
  if (this.currentYtid && this.currentYtid === Ytid) {
    MNUtil.showHUD(`Jump to ${formatedVideoTime}`)
    this.runJavaScript(`document.getElementsByTagName("video")[0].currentTime = ${parseTime}`)
  }else{
    //  Application.sharedInstance().showHUD("should open", this.view.window, 2);
    this.currentYtid = Ytid
    var url = `https://youtu.be/`+Ytid+`?t=`+parseTime
    MNUtil.showHUD(url)
    MNConnection.loadRequest(this.webview, url)
  }
} catch (error) {
  browserUtils.addErrorLog(error, "openOrJump")
}
};
/** @this {browserController} */
browserController.prototype.getTimestamp = async function(){
  let videoTime = await this.runJavaScript(`document.getElementsByTagName('video')[0].currentTime.toFixed(2);`)
  if (videoTime) {
    let url = await this.runJavaScript(`window.location.href`)
    let res = url.match(/(?<=bilibili.com\/video\/)\w+/);
    if (res) {
      let timestamp = {time:parseFloat(videoTime),bv:res[0]}
      this.currentBvid = timestamp.bv
      let testP = url.match(/(?<=bilibili.com\/video\/.+(\?|&)p\=)\d+/);
      if (testP) {
        timestamp.p = parseInt(testP[0])
        this.currentP = timestamp.p
      }else{
        this.currentP = 0
      }
      // https://www.bilibili.com/video/BV1F34y1h7so/?p=4
      // https://www.bilibili.com/video/BV1F34y1h7so?p=4
      return timestamp
    }
    this.currentBvid = ""
    this.currentP = 0
    return {time:parseFloat(videoTime)}
  }
  return undefined
}
/** @this {browserController} */
browserController.prototype.getVideoFrameInfo = async function(){
try {
    let imageBase64 = await this.runJavaScript(`
function getImage() {
// try {
  const video = document.getElementsByTagName('video')[0];
  video.crossOrigin = "anonymous"; // 尝试设置crossOrigin属性
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth*2;
  canvas.height = video.videoHeight*2;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/png');
// } catch (error) {
//   return error.toString()
// }
};
getImage();
`)
    if (browserUtils.isNSNull(imageBase64)) {
        MNUtil.showHUD("Capture video frame failed!")
      return undefined
      let width = this.view.frame.width>1000?this.view.frame.width:1000
      let image = await this.screenshot(width)
      if (!image) {
        MNUtil.showHUD("Capture video frame failed!")
        return undefined
      }
      imageBase64 = 'data:image/png;base64,'+image.base64Encoding()
    }
    // let videoTime = await this.runJavaScript(`document.getElementsByTagName('video')[0].currentTime.toFixed(2);`)
    let timestamp = await this.getTimestamp(this.webview.url)
    if (timestamp) {
      timestamp.image = imageBase64
    }
    return timestamp


    // let res = this.webview.url.match(/(?<=bilibili.com\/video\/)\w+/);
    // if (res) {
    // // https://www.bilibili.com/video/BV1F34y1h7so?p=2
    //   let testP = this.webview.url.match(/(?<=bilibili.com\/video\/\w+\?p\=)\d+/);
    //   // MNUtil.copyJSON(testP)
    //   if (testP) {
    //     return {
    //       image:imageBase64,
    //       time:parseFloat(videoTime),
    //       bv:res[0],
    //       p:testP[0]
    //     }
    //   }
    //   return {
    //     image:imageBase64,
    //     time:parseFloat(videoTime),
    //     bv:res[0]
    //   }
    // }else{
    //   res = this.webview.url.match(/(?<=youtube.com\/watch\?v\=)\w+/);
    //   if (res) {
    //     return {
    //       image:imageBase64,
    //       time:parseFloat(videoTime),
    //       yt:res[0]
    //     }
    //   }
    //   res = this.webview.url.match(/(?<=youtube.com\/watch\?t\=.*&v\=)\w+/);
    //   if (res) {
    //     return {
    //       image:imageBase64,
    //       time:parseFloat(videoTime),
    //       yt:res[0]
    //     }
    //   }
    // }
    // return {
    //   image:imageBase64,
    //   time:parseFloat(videoTime)
    // }
} catch (error) {
  browserUtils.addErrorLog(error, "getVideoFrameInfo")
  return undefined
}
}

/**
 * 
 * @param {*} width 
 * @returns {Promise<NSData>}
 */
browserController.prototype.screenshot = async function(width){
  return new Promise((resolve, reject) => {
    this.webview.takeSnapshotWithWidth(width,(snapshot)=>{
      resolve(snapshot.pngData())
    })
  })
}

browserController.prototype.videoFrameAction= async function(target){
    if (!browserUtils.checkSubscribe(true)) {
      return
    }
    let videoFrameInfo= await this.getVideoFrameInfo()
    if (!videoFrameInfo) {
      return
    }
    let focusNote = MNNote.getFocusNote()
try {
  
    switch (target) {
      case "clipboard":
        if ("image" in videoFrameInfo) {
          let imageData = NSData.dataWithContentsOfURL(MNUtil.genNSURL(videoFrameInfo.image))
          MNUtil.copyImage(imageData)
          MNUtil.showHUD('视频截图已复制到剪贴板')
        }
        break;
      case "snipaste":
        if ("image" in videoFrameInfo) {
          let imageData = NSData.dataWithContentsOfURL(MNUtil.genNSURL(videoFrameInfo.image))
          MNUtil.postNotification("snipasteImage", {imageData:imageData})
        }
        break;
      case "editor":
        if ("bv" in videoFrameInfo) {
          MNUtil.showHUD("videoframe → Editor")
          MNUtil.postNotification("editorInsert", {contents:[
            {type:"image",content:videoFrameInfo.image},
            {type:"text",content:browserUtils.videoTime2MD(videoFrameInfo)}
          ]})
        }
        break;
      case "excerpt":
        if (!focusNote) {
          MNUtil.showHUD("No note selected!")
          return
        }
        if ("bv" in videoFrameInfo) {
          MNUtil.showHUD("videoframe → Excerpt")
          if (focusNote.excerptPic && !focusNote.textFirst) {
            self.webview.endEditing(true)
            MNUtil.excuteCommand("EditTextMode")
          }
          let MDVideoInfo = browserUtils.videoInfo2MD(videoFrameInfo)
          let excerptText = (focusNote.excerptText??"")+`\n`+MDVideoInfo
            MNUtil.undoGrouping(()=>{
              focusNote.excerptText = excerptText
              focusNote.excerptTextMarkdown = true
              focusNote.processMarkdownBase64Images()
            })
        }
        break;
      case "childNote":
        if (!focusNote) {
          MNUtil.showHUD("No note selected!")
          return
        }
        if ("bv" in videoFrameInfo) {
          MNUtil.showHUD("videoframe → ChildNote")
          let MDVideoInfo = browserUtils.videoInfo2MD(videoFrameInfo)
          let config = {excerptText:MDVideoInfo,excerptTextMarkdown:true}
          let childNote = focusNote.createChildNote(config)
          if (childNote) {
            childNote.focusInMindMap(0.5)
          }else{
            MNUtil.showHUD("❌ Create note failed")
          }
        }
        break;
      case "comment":
        if (!focusNote) {
          MNUtil.showHUD("No note selected!")
          return
        }
        if ("bv" in videoFrameInfo) {
          MNUtil.showHUD("videoframe → Comment")
          let MDVideoInfo = browserUtils.videoInfo2MD(videoFrameInfo)
            MNUtil.undoGrouping(()=>{
              focusNote.excerptTextMarkdown = true
              focusNote.appendMarkdownComment(MDVideoInfo)
              focusNote.processMarkdownBase64Images()
            })
        }
        break;
      case "newNote":
        if ("bv" in videoFrameInfo) {
          MNUtil.showHUD("videoframe → ChildNote")
          let MDVideoInfo = browserUtils.videoInfo2MD(videoFrameInfo)
          let config = {excerptText:MDVideoInfo,excerptTextMarkdown:true}
          let mindmap = MNUtil.mindmapView.mindmapNodes[0].note.childMindMap
          // MNNote.new(mindmap).focusInMindMap()
          if (mindmap) {
            let childNote = MNNote.new(mindmap).createChildNote(config)
            childNote.focusInMindMap(0.5)
          }else{
            MNUtil.showHUD("Create in main mindmap")
            MNUtil.undoGrouping(()=>{
              let newNote = MNNote.new(config)
              if (!newNote) {
                MNUtil.showHUD("❌ Create note failed")
                return
              }
              newNote.focusInMindMap(0.5)
            })
          }
        }
        break;
      default:
        MNUtil.showHUD("Unsupported action: "+target)
        break;
    }
  } catch (error) {
  browserUtils.addErrorLog(error, "videoFrameAction",target)
}
  }

/**
 * @this {browserController}
 */
browserController.prototype.blur = async function (delay = 0) {
  if (delay) {
    MNUtil.delay(delay).then(()=>{
      this.runJavaScript(`document.activeElement.blur()`)
      this.webview.endEditing(true)
    })
  }else{
    this.runJavaScript(`document.activeElement.blur()`)
    this.webview.endEditing(true)
  }
}

/**
 * @this {browserController}
 * @param {string} target 
 * @returns 
 */
browserController.prototype.videoTimeAction= async function(target){
    if (!browserUtils.checkSubscribe(true)) {
      return
    }
    let videoFrameInfo = await this.getTimestamp(this.webview.url)
    // let videoFrameInfo= await this.getVideoFrameInfo()
    if (!videoFrameInfo) {
      return
    }
    let formatedLink = browserUtils.videoTime2MD(videoFrameInfo)
    if (!formatedLink) {
      return
    }
    let focusNote = MNNote.getFocusNote()
try {
    switch (target) {
      case "clipboard":
        MNUtil.copy(formatedLink)
        MNUtil.showHUD('视频时间戳已复制到剪贴板')
        break;
      case "editor":
        MNUtil.postNotification("editorInsert", {
          contents:[
            {type:"text",content:formatedLink}
          ]
        })
        break;
      case "excerpt":
        if (!focusNote) {
          MNUtil.showHUD("No note selected!")
          return
        }
        if ("bv" in videoFrameInfo) {
          MNUtil.showHUD("videoTime → Excerpt")
          if (focusNote.excerptPic && !focusNote.textFirst) {
            self.webview.endEditing(true)
            MNUtil.excuteCommand("EditTextMode")
          }
          let MDVideoInfo = formatedLink
          let excerptText = (focusNote.excerptText??"")+`\n`+MDVideoInfo
            MNUtil.undoGrouping(()=>{
              focusNote.excerptText = excerptText
              focusNote.excerptTextMarkdown = true
            })
        }
        break;
      case "childNote":
        if (!focusNote) {
          MNUtil.showHUD("No note selected!")
          return
        }
        if ("bv" in videoFrameInfo) {
          MNUtil.showHUD("videoTime → ChildNote")
          let MDVideoInfo = formatedLink
          let config = {excerptText:MDVideoInfo,excerptTextMarkdown:true}
          let childNote = focusNote.createChildNote(config)
          childNote.focusInMindMap(0.5)
        }
        break;
      case "comment":
        if (!focusNote) {
          MNUtil.showHUD("No note selected!")
          return
        }
        if ("bv" in videoFrameInfo) {
          MNUtil.showHUD("videoTime → Comment")
          let MDVideoInfo = formatedLink
            MNUtil.undoGrouping(()=>{
              focusNote.appendMarkdownComment(MDVideoInfo)
            })
        }
        break;
      case "newNote":
        if ("bv" in videoFrameInfo) {
          MNUtil.showHUD("videoTime → ChildNote")
          let MDVideoInfo = formatedLink
          let config = {excerptText:MDVideoInfo,excerptTextMarkdown:true}
          let mindmap = MNUtil.mindmapView.mindmapNodes[0].note.childMindMap
          // MNNote.new(mindmap).focusInMindMap()
          if (mindmap) {
            let childNote = MNNote.new(mindmap).createChildNote(config)
            childNote.focusInMindMap(0.5)
          }else{
            MNUtil.showHUD("Create in main mindmap")
            MNUtil.undoGrouping(()=>{
              let newNote = MNNote.new(config)
              newNote.focusInMindMap(0.5)
            })
          }
        }
        break;
      default:
        MNUtil.showHUD("Unsupported action: "+target)
        break;
    }
  } catch (error) {
  browserUtils.addErrorLog(error, "videoTimeAction",target)
}
}
browserController.prototype.animateTo = function(frame){
  this.onAnimate = true
  MNUtil.animate(()=>{
    this.view.frame = frame
    this.currentFrame = frame
  }).then(()=>{
    this.onAnimate = false
  })
}
browserController.prototype.checkPopover = function(){
  if (this.view.popoverController) {this.view.popoverController.dismissPopoverAnimated(true);}
}
browserController.prototype.refreshLastSyncTime = function () {
  let dateObj = new Date(browserConfig.getConfig("lastSyncTime"))
  MNButton.setTitle(this.syncTimeButton, "Last Sync Time: "+dateObj.toLocaleString())
  this.refreshView("syncView")
  this.refreshView("configSearchView")
}
/**
 * @this {browserController}
 */
browserController.prototype.updateEngineButton = function(){
  if (browserConfig.toolbar) {
    this.engineButton.setTitleForState(browserConfig.entries[browserConfig.engine].engine, 0);
  }else{
    this.engineButton.setTitleForState(browserConfig.entries[browserConfig.engine].symbol, 0);
  }
}
/**
 * 
 * @param {string} title 
 * @param {number} duration 
 * @param {UIView} view 
 */
browserController.prototype.showHUD = function (title,duration = 1.5,view = this.view) {
  MNUtil.showHUD(title,duration,view)
}


/**
 * @this {browserController}
 */
browserController.prototype.openSetting = function(targetView){
if (this.view.popoverController) {this.view.popoverController.dismissPopoverAnimated(true);}
    // this.settingController.view.hidden = false
    if (!this.settingView) {
      this.createSettingView()
    }
    this.settingView.hidden = false
    let frame = this.view.frame
    if (frame.height < 420) {
      frame.height = 420
    }
    this.view.frame = frame
    this.currentFrame = frame
    if (targetView === "webApp") {
      this.configSearchView.hidden = false
      this.advanceView.hidden = true
      this.syncView.hidden = true
      this.configMode = 1
      this.configEngine = this.webApp
      MNButton.setColor(this.advancedButton, "#9bb2d6")
      MNButton.setColor(this.configSearchButton, "#9bb2d6")
      MNButton.setColor(this.configWebappButton, "#457bd3")
      MNButton.setColor(this.syncConfig, "#9bb2d6")
      this.setButtonText(browserConfig.webAppEntrieNames,this.webApp)
      this.setTextview(this.webApp)
      this.refreshLayout()
      return
    }
    if (targetView === "engine") {
        this.configSearchView.hidden = false
      this.advanceView.hidden = true
      this.syncView.hidden = true
      this.configMode = 0
      this.configEngine = browserConfig.engine
      MNButton.setColor(this.advancedButton, "#9bb2d6")
      MNButton.setColor(this.configSearchButton, "#457bd3")
      MNButton.setColor(this.configWebappButton, "#9bb2d6")
      MNButton.setColor(this.syncConfig, "#9bb2d6")
      this.setButtonText( browserConfig.entrieNames,browserConfig.engine)
      this.setTextview(browserConfig.engine)
      this.refreshLayout()
      return
    }
    try {
      this.refreshView("configSearchView")
    } catch (error) {
      browserUtils.addErrorLog(error, "openSettingView")
    }
}
/**
 * @this {browserController}
 */
browserController.prototype.customHomepage = async function (params) {//需要订阅
    if (!browserUtils.checkSubscribe(true)) {
      return
    }
    let res = await MNUtil.input("New Homepage", "", ["Cancel / 取消","Desktop / 桌面端","Mobile / 移动端"])
    if (!res.button) {
      return
    }
    browserConfig.config.useLocalHomePage = false
    let homePage = {url:res.input,desktop:res.button == 1}
    if (!/^https?\:\/\//.test(res.input)) {
      homePage.url = "https://"+res.input
    }
    browserConfig.config.homePage = homePage
    self.setHomepageButton.setTitleForState("HomePage: "+homePage.url,0)
    MNUtil.showHUD("New HomePage: "+res.input)
}

/**
 * 
 * @param {string} title 
 * @param {number} duration 
 * @param {UIView} view 
 */
browserController.prototype.waitHUD = function (title,view = this.view) {
  MNUtil.waitHUD(title,view)
}
/**
 * @this {browserController}
 */
browserController.prototype.uploadPDFToDoc2XByBase64 = async function (fileBase64,fileName) {
self.runJavaScript(`
function uploadPDFBase64(filebase64,fileName) {
  // 1. 获取页面的拖放区域
  const dropZone = document.body;

  // 2. 直接使用原始Base64数据
  const base64PDF = filebase64;
  
  try {
    // 3. 正确解析Base64并重建文件
    const binaryString = atob(base64PDF);
    const bytes = new Uint8Array(binaryString.length);
    
    // 逐个字符转换为字节值
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i) & 0xFF;
    }
    
    // 4. 创建有效的PDF文件
    const blob = new Blob([bytes.buffer], { type: 'application/pdf' });
    const file = new File([blob], fileName, { 
      type: 'application/pdf',
      lastModified: Date.now()
    });

    // 5. 创建自定义DataTransfer对象
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    // 6. 创建并触发拖拽事件序列
    const events = [
      new DragEvent('dragenter', { bubbles: true, dataTransfer, view: window }),
      new DragEvent('dragover', { 
        bubbles: true, 
        dataTransfer, 
        cancelable: true, 
        view: window 
      }),
      new DragEvent('drop', { 
        bubbles: true, 
        dataTransfer, 
        cancelable: true, 
        view: window 
      })
    ];
    
    events.forEach(event => dropZone.dispatchEvent(event));
    
    console.log('✅ PDF文件重建成功，拖拽事件已触发');
    
  } catch (error) {
    console.error('⚠️ 文件重建失败:', error);
    console.warn('Base64长度:', base64PDF.length);
    console.warn('前100字符:', base64PDF.substring(0, 100));
  }
}
uploadPDFBase64("${fileBase64}","${fileName}")
`)
}
/**
 * @this {browserController}
 */
browserController.prototype.uploadImageToDoc2XByBase64 = async function (fileBase64,fileName) {
self.runJavaScript(`
function uploadPDFBase64(filebase64,fileName) {
  // 1. 获取页面的拖放区域
  const dropZone = document.body;

  // 2. 直接使用原始Base64数据
  const base64PDF = filebase64;
  
  try {
    // 3. 正确解析Base64并重建文件
    const binaryString = atob(base64PDF);
    const bytes = new Uint8Array(binaryString.length);
    
    // 逐个字符转换为字节值
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i) & 0xFF;
    }
    
    // 4. 创建有效的PDF文件
    const blob = new Blob([bytes.buffer], { type: 'image/png' });
    const file = new File([blob], fileName, { 
      type: 'image/png',
      lastModified: Date.now()
    });

    // 5. 创建自定义DataTransfer对象
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);

    // 6. 创建并触发拖拽事件序列
    const events = [
      new DragEvent('dragenter', { bubbles: true, dataTransfer, view: window }),
      new DragEvent('dragover', { 
        bubbles: true, 
        dataTransfer, 
        cancelable: true, 
        view: window 
      }),
      new DragEvent('drop', { 
        bubbles: true, 
        dataTransfer, 
        cancelable: true, 
        view: window 
      })
    ];
    
    events.forEach(event => dropZone.dispatchEvent(event));
    
    console.log('✅ PDF文件重建成功，拖拽事件已触发');
    
  } catch (error) {
    console.error('⚠️ 文件重建失败:', error);
    console.warn('Base64长度:', base64PDF.length);
    console.warn('前100字符:', base64PDF.substring(0, 100));
  }
}
uploadPDFBase64("${fileBase64}","${fileName}")
`)
}
/**
 * @this {browserController}
 */
browserController.prototype.fileTypeFromBase64 = function(prefix) {
  if (prefix.includes("octet-stream") || prefix.includes("application/pdf")) {
    return "pdf"
  }
  if (prefix.includes("html")) {
    return "html"
  }
  if (prefix.includes("image/png")) {
    return "png"
  }
  if (prefix.includes("image/jpeg")) {
    return "jpg"
  }
  if (prefix.includes("markdown")){
    return "markdown"
  }
  if (prefix.includes("zip")){
    return "zip"
  }

}
/**
 * @this {browserController}
 */
browserController.prototype.importImageFromBase64 = async function(imageBase64,blobUrl) {
  this.runJavaScript(`window.URL.revokeObjectURL("${blobUrl}");`)
  // let tem = base64PDF.split(",")
  let imageData = NSData.dataWithContentsOfURL(NSURL.URLWithString(imageBase64))
  MNUtil.postNotification("snipasteImage", {imageData:imageData})
  this.showHUD("Snipaste Image...")
  // MNUtil.copy(object)
  // let type = this.fileTypeFromBase64(tem[0])
}
/**
 * @this {browserController}
 */
browserController.prototype.importPDFFromBase64Doc2X = async function(base64PDF,blobUrl) {
  // MNUtil.copy(base64PDF)
  let tem = base64PDF.split(",")
  // let type = this.fileTypeFromBase64(tem[0])
  // if (type !== "pdf") {
  //   MNUtil.confirm("MN Browser","Not support file type: "+type)
  //   return
  // }
  this.runJavaScript(`window.URL.revokeObjectURL("${blobUrl}");`)
  MNUtil.waitHUD("Importing PDF...")
  await MNUtil.delay(0.1)
  let pdfData = NSData.dataWithContentsOfURL(NSURL.URLWithString("data:application/pdf;base64,"+tem[1]))
  let fileName = await this.runJavaScript(`document.getElementsByClassName("doc2x-cander-breadcrumbs-item")[0].childNodes[0].textContent;`)
  fileName = fileName.replace(".pdf","")+"_translated.pdf"
  let userInput = await MNUtil.input("MN Browser", `Please enter the file name or using Default.\n\n请输入下载的文件名,或使用默认名:\n\n${fileName}`, ["Cancel / 取消","Default / 默认","Confirm / 确认"])
  // MNUtil.copy(userInput)
  switch (userInput.button) {
    case 0:
      MNUtil.stopHUD()
      return
    case 1:
      if (userInput.input.trim()) {
        fileName = userInput.input.trim().replace(".pdf","").replace(" ","_")+".pdf"
      }
      break;
    case 2:
      break;
    default:
      break;
  }
  let targetPath = MNUtil.documentFolder+"/WebDownloads/"+fileName
  pdfData.writeToFileAtomically(targetPath, false)
  let docMd5 = MNUtil.importDocument(targetPath)
  if (typeof snipasteUtils !== 'undefined') {
    MNUtil.postNotification("snipastePDF", {docMd5:docMd5,currPageNo:1})
  }else{
    let confirm = await MNUtil.confirm("MN Browser", "Open document?\n\n是否直接打开该文档？\n\n"+fileName)
    if (confirm) {
      MNUtil.openDoc(md5,MNUtil.currentNotebookId)
      if (MNUtil.docMapSplitMode === 0) {
        MNUtil.studyController.docMapSplitMode = 1
      }
    }
  }
  MNUtil.stopHUD()
}

/**
 * @this {browserController}
 */
browserController.prototype.importPDFFromBase64MoreDraw = async function(base64PDF,blobUrl) {
  // MNUtil.copy(base64PDF)
  let tem = base64PDF.split(",")
  // let type = this.fileTypeFromBase64(tem[0])
  // if (type !== "pdf") {
  //   MNUtil.confirm("MN Browser","Not support file type: "+type)
  //   return
  // }

  this.runJavaScript(`window.URL.revokeObjectURL("${blobUrl}");`)
  MNUtil.waitHUD("Importing PDF...")
  await MNUtil.delay(0.1)
  let pdfData = NSData.dataWithContentsOfURL(NSURL.URLWithString("data:application/pdf;base64,"+tem[1]))
  let res = await this.runJavaScript(`  function getTtile() {
    let titles = []
    let elements = document.getElementsByClassName("n-card__content")
    elements.forEach(element=>{
      let title = element.textContent
      if (title.trim()) {
        if (/\\d+%/.test(title.trim())) {
          title = title.replace(/\\d/g,"")
        }else{
          titles.push(title.trim())
        }
      }
    })
    return titles[0]
  }
  getTtile()`)
  let fileName = res ? (res+".pdf") : ("moredraw_"+Date.now()+".pdf")
  let userInput = await MNUtil.input("MN Browser", `Please enter the file name or using Default.\n\n请输入下载的文件名,或使用默认名:\n\n${fileName}`, ["Cancel / 取消","Default / 默认","Confirm / 确认"])
  // MNUtil.copy(userInput)
  switch (userInput.button) {
    case 0:
      MNUtil.stopHUD()
      return
    case 1:
      if (userInput.input.trim()) {
        fileName = userInput.input.trim().replace(".pdf","").replace(" ","_")+".pdf"
      }
      break;
    case 2:
      break;
    default:
      break;
  }
  let targetPath = MNUtil.documentFolder+"/WebDownloads/"+fileName
  pdfData.writeToFileAtomically(targetPath, false)
  let docMd5 = MNUtil.importDocument(targetPath)
  if (typeof snipasteUtils !== 'undefined') {
    MNUtil.postNotification("snipastePDF", {docMd5:docMd5,currPageNo:1})
  }else{
    let confirm = await MNUtil.confirm("MN Browser", "Open document?\n\n是否直接打开该文档？\n\n"+fileName)
    if (confirm) {
      MNUtil.openDoc(md5,MNUtil.currentNotebookId)
      if (MNUtil.docMapSplitMode === 0) {
        MNUtil.studyController.docMapSplitMode = 1
      }
    }
  }
  MNUtil.stopHUD()
}
function name(params) {
  
}
/**
 * @this {browserController}
 */
browserController.prototype.base64FromBlob = function(requestURL) {
        this.runJavaScript(`
async function blobUrlToBase64(blobUrl) {
  try {
    // 1. 通过 Blob URL 获取 Blob 对象
    console.log("Fetching Blob from URL:", blobUrl);
    const response = await fetch(blobUrl);
    if (!response.ok) {
      throw new Error(\`Failed to fetch Blob: \${response.statusText}\`);
    }
    const blob = await response.blob();
    console.log("Blob object retrieved:", blob);

    // 2. 将 Blob 对象转换为 Base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          console.log("Data URL generated:", reader.result);
          const base64 = reader.result;
          resolve(base64);
        } else {
          reject(new Error("FileReader result is undefined or null."));
        }
      };
      reader.onerror = () => {
        reject(new Error("FileReader encountered an error."));
      };
      reader.readAsDataURL(blob); // 将 Blob 转换为 Data URL
    });
  } catch (error) {
    console.error("Error converting Blob URL to Base64:", error);
    throw error;
  }
};

// 使用示例
blobUrlToBase64("${requestURL}")
  .then(base64 => {
    window.location.href = "browser://getpdfdata?content=" + encodeURIComponent(base64)+"&blobUrl="+encodeURIComponent("${requestURL}");
  })
  .catch(error => {
    window.location.href = "browser://copy?content=" + encodeURIComponent(error.message);
  });
`);
}
/**
 * @this {browserController}
 */
browserController.prototype.uploadPDFToDoc2X = async function (document = MNUtil.currentDoc) {

  this.waitHUD("Uploading file...")
  await MNUtil.delay(0.1)
  let fileName = document.docTitle.replace(/"/g, '\\"')+".pdf"
  let fileBase64 = MNUtil.getFile(document.fullPathFileName).base64Encoding().replace(/"/g, '\\"')
  this.uploadPDFToDoc2XByBase64(fileBase64, fileName)
  MNUtil.stopHUD(0.5)
  // self.runJavaScript(`
  //   if(window.location.href !== 'https://doc2x.noedgeai.com/'){
  //     window.location.href = 'https://doc2x.noedgeai.com/';
  //   }
  // `)
}
/**
 * @this {browserController}
 */
browserController.prototype.uploadImageToDoc2X = async function (currentImage = browserUtils.getCurrentImage()) {
  if (!currentImage) {
    MNUtil.showHUD("No image selected")
    return
  }
      this.waitHUD("Uploading file...")
      await MNUtil.delay(0.1)
      let fileName = "image.png"
      let fileBase64 = currentImage.base64Encoding().replace(/"/g, '\\"')
      await this.uploadImageToDoc2XByBase64(fileBase64, fileName)
      await MNUtil.stopHUD(0.5)
      currentURL = await this.getCurrentURL()
      // MNUtil.log(currentURL)
      // MNUtil.log(self.preParseId)
      while (!currentURL.startsWith("https://doc2x.noedgeai.com/ocr?parseId_0=") || currentURL.includes(self.preParseId)) {
        // MNUtil.log("delay")
        await MNUtil.delay(0.5)
        currentURL = await this.getCurrentURL()
      }
      let config = MNUtil.parseURL(currentURL)
      self.preParseId = config.params.parseId_0
      // MNUtil.copy(config)
      await MNUtil.delay(0.5)
      this.runJavaScript(`
      async function hideOriginalView() {
        async function delay(seconds) {
          return new Promise(resolve => setTimeout(resolve, seconds * 1000));
        }
        await delay(0.5);
        document.getElementsByClassName("ant-splitter-panel")[0].style.display='none';
        await delay(0.5);
        document.getElementsByClassName("ant-splitter-panel")[0].style.display='none';
        await delay(0.5);
        document.getElementsByClassName("ant-splitter-panel")[0].style.display='none';
        await delay(0.5);
        document.getElementsByClassName("ant-splitter-panel")[0].style.display='none';
      }
      hideOriginalView();
      `)
      let res = await this.runJavaScript(`document.getElementById("txta_input").textContent`)
      MNUtil.copy(res)
      this.showHUD("识别结果已复制")
}
/**
 * 
 * @param {string} url 
 * @returns {Promise<boolean>}
 */
browserController.prototype.currentURLStartsWith = async function(url) {
  let currentURL = await this.getCurrentURL()
  return currentURL.startsWith(url);
}

browserController.prototype.downloadPDF = async function (params) {
try {

  // MNUtil.copy(params.pdfBase64)
  MNUtil.stopHUD()
  let pdfData = browserUtils.dataFromBase64(params.pdfBase64,"pdf")
  if (!pdfData) {
    MNUtil.showHUD("Invalid PDF")
    return
  }
  let fileSize = pdfData.length()/1000000
  MNUtil.stopHUD()
  let defaultName = "imported_"+Date.now()+".pdf"
  let title = await this.runJavaScript("document.title")
  if (title && title.trim()) {
    defaultName = title+".pdf"
  }
  let option = {}
  let userInput = await MNUtil.input("MN Browser","Please input the name of the document\n\n请输入文档名称\n\nDefault: "+defaultName+"\n\nFile Size: "+fileSize.toFixed(2)+"MB",["Cancel",defaultName,"Confirm"])
  if (userInput.button === 0) {
    return
  }
  if (userInput.button === 1) {
    option.fileName = defaultName
  }
  let input = userInput.text
  if (input && input.trim()) {
    if (input.endsWith(".pdf")) {
      option.fileName = input
    }else{
      option.fileName = input+".pdf"
    }
  }
  let md5 = browserUtils.importPDFFromData(pdfData,option)
  MNUtil.log(md5)
  if (md5) {
    MNUtil.openDoc(md5)
  }
  
} catch (error) {
  browserUtils.addErrorLog(error, "downloadPDF")
}
}

browserController.prototype.changeBilibiliVideoPart = async function (button) {
let encodedPartInfo = await this.runJavaScript(`    
    function getPartInfo() {
      let videoPod = document.getElementsByClassName("video-pod__body")[0]
      
      if (!videoPod) {
        console.log("No video pod found")
        return []
      }
      let list = document.getElementsByClassName("video-pod__list multip list")[0]
      if (list) {
        let items = list.getElementsByClassName("simple-base-item video-pod__item")
        let partInfo = []
        for (let i = 0; i < items.length; i++) {
          let item = items[i]
          let title = item.getElementsByClassName("title")[0].textContent.trim()
          let time = item.getElementsByClassName("stats")[0].textContent.trim()
          let times = time.split(":")
          let minutes = parseInt(times[0])
          let seconds = parseInt(times[1])
          let totalSeconds = minutes*60+seconds

          if (item.classList.contains("active")) {
            partInfo.push({title:title,time:time,active:true,totalSeconds:totalSeconds,p:i+1})
          }else{
            partInfo.push({title:title,time:time,active:false,totalSeconds:totalSeconds,p:i+1})
          }
        }
        console.log(partInfo)

        return encodeURIComponent(JSON.stringify(partInfo))
      }else{
        let list = videoPod.getElementsByClassName("video-pod__list section")[0]
        if (!list) {
          console.log("No video list found")
          return []
        }
        let partInfo = []
        let items = list.getElementsByClassName("pod-item video-pod__item simple")
        for (let i = 0; i < items.length; i++) {
          let item = items[i]
          let bvid = item.getAttribute("data-key")
          let isSingle = item.getElementsByClassName("single-p")[0]?true:false
          let isActive = item.getElementsByClassName("simple-base-item active normal")[0]?true:false
          if (isSingle) {
            let title = item.getElementsByClassName("title-txt")[0].textContent.trim()
            let time = item.getElementsByClassName("stats")[0].textContent.trim()
            let times = time.split(":")
            let minutes = parseInt(times[0])
            let seconds = parseInt(times[1])
            let totalSeconds = minutes*60+seconds
            partInfo.push({title:title,time:time,active:isActive,totalSeconds:totalSeconds,bvid:bvid})
          }else{
            let parts = item.getElementsByClassName("simple-base-item page-item")
            parts.forEach((part,index)=>{
              let isActivePart = part.classList.contains("active")
              let title = part.getElementsByClassName("title-txt")[0].textContent.trim()
              let time = part.getElementsByClassName("stats")[0].textContent.trim()
              let times = time.split(":")
              let minutes = parseInt(times[0])
              let seconds = parseInt(times[1])
              let totalSeconds = minutes*60+seconds
              partInfo.push({title:title,time:time,active:isActivePart,totalSeconds:totalSeconds,bvid:bvid,p:index+1})
            })
            

          }
        }
        console.log(partInfo)
        return encodeURIComponent(JSON.stringify(partInfo))
        
      }
    }
    getPartInfo()
    `)
    let partInfo = JSON.parse(decodeURIComponent(encodedPartInfo))
    if (partInfo.length) {
      // MNUtil.copy(partInfo)
      let menu = new Menu(button,this)
      let selector = "changePart:"
      partInfo.forEach((part,index)=>{
        if ("bvid" in part) {
          menu.addMenuItem(part.title+" ("+part.time+")", selector,part,part.active)
        }else{
          menu.addMenuItem(part.title+" ("+part.time+")", selector,part,part.active)
        }
      })
      menu.show(true)
    }else{
      MNUtil.showHUD("No video part found")
    }
}