
JSB.newAddon = function (mainPath) {
  JSB.require("utils")
  if (!snipasteUtils.checkMNUtilsFolder(mainPath)) {return undefined}
  JSB.require('webviewController');
  var temSender;
  var MNSnipasteClass = JSB.defineClass(
    'MNSnipaste : JSExtension',
    { /* Instance members */
      sceneWillConnect: async function () { //Window initialize
        if (!(await snipasteUtils.checkMNUtil(true))) return
        self.appInstance = Application.sharedInstance();
        self.addonController = snipasteController.new();
        self.addonController.mainPath = mainPath;
        self.isNewWindow = false;
        self.watchMode = false;
        self.textSelected = ""
        self.textProcessed = false;
        self.dateGetText = Date.now();
        self.dateNow = Date.now();
        self.rect = '{{0, 0}, {10, 10}}';
        self.arrow = 1;
        self.isFirst = true
        // Application.sharedInstance().showHUD(self.addonController.appearOnNewExcerpt,self.window,2)
        MNUtil.addObserver(self, 'OnReceivedSnipasteNote:', 'snipasteNote');
        MNUtil.addObserver(self, 'OnReceivedSnipasteImage:', 'snipasteImage');
        MNUtil.addObserver(self, 'OnReceivedSnipastePDF:', 'snipastePDF');
        MNUtil.addObserver(self, 'OnReceivedSnipasteHtml:', 'snipasteHtml');
        MNUtil.addObserver(self, 'OnReceivedSnipasteMermaid:', 'snipasteMermaid');
        MNUtil.addObserver(self, 'OnReceivedAudioAction:', 'snipasteAudioAction');
        MNUtil.addObserver(self, 'onPopupMenuOnSelection:', 'PopupMenuOnSelection')
        MNUtil.addObserver(self, 'onPopupMenuOnNote:', 'PopupMenuOnNote');

        // NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'trst:', 'onReciveTrst');
        // NSNotificationCenter.defaultCenter().addObserverSelectorName(self, 'onClosePopupMenuOnSelection:', 'ClosePopupMenuOnSelection');
      },

      sceneDidDisconnect: function () { // Window disconnect
        MNUtil.removeObserver(self, "snipasteNote")
        MNUtil.removeObserver(self, "snipasteImage")
        MNUtil.removeObserver(self, "snipastePDF")
        MNUtil.removeObserver(self, "snipasteHtml")
        MNUtil.removeObserver(self, "snipasteMermaid")
        MNUtil.removeObserver(self, "snipasteNote")
        MNUtil.removeObserver(self, "snipasteImage")
      },

      sceneWillResignActive: function () { // Window resign active
      },

      sceneDidBecomeActive: function () { // Window become active
      },

      notebookWillOpen: async function (notebookid) {
        if (!(await snipasteUtils.checkMNUtil(false,0.1))) return
        try {
        if (MNUtil.studyMode < 3 && !self.addonController.onSnipaste) {
          MNUtil.refreshAddonCommands()
          MNUtil.currentWindow.addSubview(self.addonController.view)
          self.addonController.view.hidden = true;
          self.addonController.notebookid = notebookid
          self.addonController.goBackButton.hidden = false
          self.addonController.goForwardButton.hidden = false
          self.addonController.view.frame = { x: 50, y: 10, width: 500, height: 500 }
          self.addonController.webview.frame = { x: 50, y: 10, width: 500, height: 500 }
          self.addonController.currentFrame = { x: 50, y: 10, width: 500, height: 500 }
          self.customLayoutAddonController();
        }
        // if (dynamic !== undefined) {
        //   self.addonController.dynamic = dynamic
        // }
        if (self.addonController.onSnipaste) {
          self.addonController.view.hidden = false
        }
        } catch (error) {
          snipasteUtils.addErrorLog(error, "notebookWillOpen")
        }
      },

      notebookWillClose: function (notebookid) {
        // Application.sharedInstance().showHUD("close",self.window,2)
        // self.addonController.homePage()
        // self.watchMode = false;
        // self.textSelected = '';
        // NSNotificationCenter.defaultCenter().removeObserverName(self, 'PopupMenuOnSelection');
        // NSNotificationCenter.defaultCenter().removeObserverName(self, 'ClosePopupMenuOnSelection');
        // NSNotificationCenter.defaultCenter().removeObserverName(self, 'ProcessNewExcerpt');
      },

      documentDidOpen: function (docmd5) {
      },

      documentWillClose: function (docmd5) {
      },

      controllerWillLayoutSubviews: function (controller) {
        if (typeof MNUtil === 'undefined') return
        if (controller !== MNUtil.studyController) {
          return;
        };
        if (!self.addonController.view.hidden) {
          let studyFrame = MNUtil.currentWindow.bounds
          if (self.addonController.miniMode) {
            let oldFrame = self.addonController.view.frame
            if (oldFrame.x < studyFrame.width*0.5) {
            // self.addonController.view.frame = self.addonController.currentFrame
              self.addonController.view.frame = { x: 0, y: oldFrame.y, width: 40, height: 40 }
            } else {
              self.addonController.view.frame = { x: studyFrame.width - 40, y: oldFrame.y, width: 40, height: 40 }
            }
          } else if (self.addonController.custom) {
            let height = studyFrame.height-10;
            let splitLine = MNUtil.splitLine
            switch (self.addonController.customMode) {
              case "left":
                self.addonController.view.frame = { x: 40, y: 10, width: splitLine - 45, height: height }
                break;
              case "left13":
                self.addonController.view.frame = { x: 40, y: 10, width: studyFrame.width / 3. + 40, height: height}
                break;
              case "right":
                self.addonController.view.frame = { x: splitLine + 5, y: 10, width: studyFrame.width - splitLine - 45, height: height }
                break;
              case "right13":
                self.addonController.view.frame = { x: studyFrame.width * 2 / 3. - 40, y: 10, width: studyFrame.width / 3., height: height }
                break;
              case "full":
                self.addonController.view.frame = { x: 40, y: 10, width: studyFrame.width - 80, height: height }
                break;
              default:
                break;
            }
            self.addonController.webview.frame = self.addonController.view.bounds
          }else{
            let currentFrame = self.addonController.currentFrame
            currentFrame.width = MNUtil.constrain(currentFrame.width, 300, studyFrame.width)
            currentFrame.height = MNUtil.constrain(currentFrame.height, 200, studyFrame.height)
            if (currentFrame.x+currentFrame.width*0.5 >= studyFrame.width) {
              currentFrame.x = studyFrame.width-currentFrame.width*0.5              
            }
            if (currentFrame.y >= studyFrame.height) {
              currentFrame.y = studyFrame.height-20              
            }
            // MNUtil.copy(currentFrame)
            MNUtil.log(currentFrame.width)
            self.addonController.view.frame = currentFrame
            self.addonController.currentFrame = currentFrame
            // MNUtil.copy(currentFrame)
          }
        }
      },

      queryAddonCommandStatus: function () {
        if (!snipasteUtils.checkLogo()) {
          return null
        }
        if (MNUtil.studyMode < 3) {
          return {
            image: 'logo.png',
            object: self,
            selector: 'toggleAddon:',
            checked: false
          };
        } else {
          return null;
        }
      },
      OnReceivedSnipastePDF: function (sender) {
        if (typeof MNUtil === 'undefined') return
        if (self.window!==MNUtil.currentWindow) {
          return
        }
        let userInfo = sender.userInfo
        self.addonController.pageIndex = 0
        self.addonController.snipastePDFDev(userInfo.docMd5,userInfo.currPageNo)
      },
      OnReceivedSnipasteHtml: function (sender) {
        if (typeof MNUtil === 'undefined') return
        if (self.window!==MNUtil.currentWindow) {
          return
        }
        let html = sender.userInfo.html
        let force = sender.userInfo.force
        // MNUtil.copy(html)
        self.addonController.snipasteHtml(html,force)
      },
      OnReceivedSnipasteMermaid: function (sender) {
        if (typeof MNUtil === 'undefined') return
        if (self.window!==MNUtil.currentWindow) {
          return
        }
        let content = sender.userInfo.content
        let force = sender.userInfo.force
        self.addonController.snipasteMermaid(content,force)
      },
      OnReceivedAudioAction: function (sender) {
        if (typeof MNUtil === 'undefined') return
        if (self.window!==MNUtil.currentWindow) {
          return
        }
        let action = sender.userInfo.action
        self.addonController.audioControl(action)
        // MNUtil.showHUD("OnReceivedAudioAction")
      },
      OnReceivedSnipasteNote: function (sender) {
        if (typeof MNUtil === 'undefined') return
        if (self.window!==MNUtil.currentWindow) {
          return
        }
        let userInfo = sender.userInfo
        // showHUD("snipaste")
        // Application.sharedInstance().showHUD(sender.userInfo.noteid,self.window,5)
        let focusNote = MNNote.new(sender.userInfo.noteid)
        if ("audioAutoPlay" in userInfo) {
          self.addonController.snipasteNote(focusNote,true)
        }else{
          self.addonController.snipasteNote(focusNote)
        }
      },
      OnReceivedSnipasteImage:function (sender) {
        let imageData = sender.userInfo.imageData
        if (imageData) {
          let image = UIImage.imageWithData(imageData)
          let wholeFrame = MNUtil.studyView.bounds
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
          // let scale = (imageSize.width < 600 || imageSize.height < 200)?1.0:0.5
          // Application.sharedInstance().showHUD("width: "+imageSize.width+" hiehgt: "+imageSize.height, self.window, 2)
          let viewFrame = self.addonController.view.frame
          if (self.isFirst) {
            let width = MNUtil.constrain(imageSize.width*scale, 300, MNUtil.windowWidth)
            let height = MNUtil.constrain(imageSize.height*scale, 200, MNUtil.windowHeight)
            self.addonController.view.frame = {x:viewFrame.x,y:viewFrame.y,width:width,height:height}
            self.addonController.currentFrame = self.addonController.view.frame
            self.isFirst = false
          }
          // style="transform:rotate(7deg)"
          self.addonController.htmlMode = false
          self.addonController.onSnipaste = true
          self.addonController.snipasteFromImage(imageData)
//           self.addonController.webview.loadHTMLStringBaseURL(html)
          // self.addonController.webview.loadHTMLStringBaseURL(`<a href="marginnote3app://note/C08E37FD-AC36-42BB-A8AB-739296E62F23">test</a>`)
          if (self.addonController.view.hidden) {
            self.addonController.show()
          }
        }
      },
      onPopupMenuOnSelection: function (sender) { // Selecting text on pdf or epub
        if (typeof MNUtil === 'undefined') return
        if (!self.appInstance.checkNotifySenderInWindow(sender, self.window)) return; // Don't process message from other window
          //  Application.sharedInstance().showHUD(sender.userInfo.winRect, self.window, 2);
        if (!self.addonController.view.hidden) {
          self.addonController.blur(0.01)
        }
      },
      onProcessNewExcerpt:function (sender) {
        if (typeof MNUtil === 'undefined') return
        if (!self.appInstance.checkNotifySenderInWindow(sender, self.window)) return; // Don't process message from other window
      },
      onPopupMenuOnNote: function (sender) { // Clicking note
        if (typeof MNUtil === 'undefined') return
        if (!self.appInstance.checkNotifySenderInWindow(sender, self.window)) return; // Don't process message from other window
        if (!self.addonController.view.hidden) {
          self.addonController.blur(0.01)
        }
        // const frame = self.addonController.view.frame
        // const frameText = `{x:${frame.x},y:${frame.y},width:${frame.width},height:${frame.height}}`
        // Application.sharedInstance().showHUD(frameText,self.window,5
        // self.addonController.view.frame = {x:0,y:0,width:100,height:100}
      },
      toggleAddon:function (sender) {
        if (typeof MNUtil === 'undefined') return
        // self.addonController.snipasteMermaid("test")
        // return
        if (!self.addonBar) {
          self.addonBar = sender.superview.superview
          self.addonController.addonBar = self.addonBar
        }
        if (Date.now() - self.dateNow < 500) {
          self.addonController.snipasteFromClipboard()
          return;
        }else{
          self.dateNow = Date.now()
        }
        // let html = MNUtil.readText(self.addonController.mainPath + "/test.html")
        // MNUtil.copy(html)
        // self.addonController.snipasteHtml(html)
        // return

        let selection = MNUtil.currentSelection
        if (selection.onSelection && !selection.isText) {
          //优先选择图片
          self.addonController.focusNoteId = undefined
          // MNUtil.showHUD(selection.docMd5)
          self.addonController.docMd5 = selection.docMd5
          self.addonController.pageIndex = selection.pageIndex
          let imageData = selection.image
          let image = UIImage.imageWithData(imageData)
          let wholeFrame = MNUtil.studyView.bounds
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
          // let scale = (imageSize.width < 600 || imageSize.height < 200)?1.0:0.5
          // Application.sharedInstance().showHUD("width: "+imageSize.width+" hiehgt: "+imageSize.height, self.window, 2)
          let viewFrame = self.addonController.view.frame
          if (self.isFirst) {
            self.addonController.view.frame = {x:viewFrame.x,y:viewFrame.y,width:imageSize.width*scale,height:imageSize.height*scale}
            self.addonController.currentFrame = {x:viewFrame.x,y:viewFrame.y,width:imageSize.width*scale,height:imageSize.height*scale}
          }
          // style="transform:rotate(7deg)"
          self.addonController.htmlMode = false
          self.addonController.onSnipaste = true
          self.addonController.snipasteFromImage(imageData)
//           self.addonController.webview.loadHTMLStringBaseURL(html)
          // self.addonController.webview.loadHTMLStringBaseURL(`<a href="marginnote3app://note/C08E37FD-AC36-42BB-A8AB-739296E62F23">test</a>`)
          if (self.addonController.view.hidden) {
            self.addonController.show()
          }
          return
        }else{
          //无图片下选择卡片
          let focusNote = MNNote.getFocusNote()
          if (focusNote) {
            self.addonController.docMd5 = undefined
            self.addonController.pageIndex = undefined
            if (focusNote.excerptPic && !focusNote.noteTitle && !focusNote.comments.length) {
              imageData = MNUtil.getMediaByHash(focusNote.excerptPic.paint)
              self.addonController.focusNoteId = focusNote.noteId
              self.addonController.snipasteFromImage(imageData)
              return;
            }else{//摘录中无图片，直接贴卡片
              if (self.isFirst) {
                let frame = self.addonController.view.frame
                frame.width = 500
                self.addonController.view.frame = frame
                self.addonController.currentFrame = frame
                self.isFirst = false
              }
              self.addonController.snipasteNote(focusNote)
              return;
            }
          }else if (selection.onSelection) {//尝试贴文字
              self.addonController.focusNoteId = undefined
              // MNUtil.showHUD(selection.docMd5)
              self.addonController.docMd5 = selection.docMd5
              self.addonController.pageIndex = selection.pageIndex
              let imageData = selection.image
              let image = UIImage.imageWithData(imageData)
              let wholeFrame = MNUtil.studyView.bounds
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
              // let scale = (imageSize.width < 600 || imageSize.height < 200)?1.0:0.5
              // Application.sharedInstance().showHUD("width: "+imageSize.width+" hiehgt: "+imageSize.height, self.window, 2)
              let viewFrame = self.addonController.view.frame
              if (self.isFirst) {
                self.addonController.view.frame = {x:viewFrame.x,y:viewFrame.y,width:imageSize.width*scale,height:imageSize.height*scale}
                self.addonController.currentFrame = {x:viewFrame.x,y:viewFrame.y,width:imageSize.width*scale,height:imageSize.height*scale}
              }
              // style="transform:rotate(7deg)"
              self.addonController.htmlMode = false
              self.addonController.onSnipaste = true
              self.addonController.snipasteFromImage(imageData)
//               self.addonController.webview.loadHTMLStringBaseURL(html)
              // self.addonController.webview.loadHTMLStringBaseURL(`<a href="marginnote3app://note/C08E37FD-AC36-42BB-A8AB-739296E62F23">test</a>`)
              if (self.addonController.view.hidden) {
                self.addonController.show()
              }
              return
            }
        }
        let menu = new Menu(sender,self)
        menu.width = 250
        menu.addMenuItem("📋  Clipboard Image", "snipasteFromClipboard:")
        menu.addMenuItem("📄  PDF (Current Page)", "snipasteFromPDF:","Current")
        menu.addMenuItem("📄  PDF (First Page)", "snipasteFromPDF:","First")
        menu.addMenuItem("📄  PDF (Last Page)", "snipasteFromPDF:","Last")
        if (self.addonBar.frame.x < 100) {
          menu.preferredPosition = 4
        }else{
          menu.preferredPosition = 0
        }
        menu.show()
        return
      },
      snipasteFromPDF: function (target) {
        Menu.dismissCurrentMenu()
        let docController = MNUtil.currentDocController
        if (target === "Current") {
          self.addonController.pageIndex = docController.currPageIndex
          // MNUtil.showHUD("PageIndex: "+self.addonController.pageIndex)
          self.addonController.snipastePDFDev(docController.docMd5,docController.currPageNo,docController)
        }else if (target === "First") {
          self.addonController.pageIndex = 0
          let pageNo = docController.pageNoFromIndex(0)
          self.addonController.snipastePDFDev(docController.docMd5,pageNo,docController)
        }else if (target === "Last") {
          let pageNo = docController.document.pageCount
          self.addonController.pageIndex = docController.indexFromPageNo(pageNo)
          self.addonController.snipastePDFDev(docController.docMd5,pageNo,docController)
        }
      },
      snipasteFromClipboard: function (sender) {
        Menu.dismissCurrentMenu()
        self.addonController.snipasteFromClipboard(sender)
      }
    },
    { /* Class members */
      addonDidConnect: function () {
      },

      addonWillDisconnect: function () {
      },

      applicationWillEnterForeground: function () {
      },

      applicationDidEnterBackground: function () {
      },

      applicationDidReceiveLocalNotification: function (notify) {
      }
    }
  );

  MNSnipasteClass.prototype.layoutAddonController = function (rectStr, arrowNum, custom = false) {

    this.rect = rectStr || this.rect;
    this.arrow = arrowNum || this.arrow;
    var x, y
    w = (this.appInstance.osType !== 1) ? 500 :500, // this.addonController.view.frame.width
      h = 500, // this.addonController.view.frame.height
      fontSize = 15,
      margin = 10,
      padding = 20,
      frame = MNUtil.studyView.bounds,
      W = frame.width,
      H = frame.height,
      rectArr = this.rect.replace(/{/g, '').replace(/}/g, '').replace(/\s/g, '').split(','),
      X = Number(rectArr[0]),
      Y = Number(rectArr[1]),
      studyMode = MNUtil.studyMode,
      contextMenuWidth = studyMode === 0 ? 225 : 435,
      contextMenuHeight = 35,
      textMenuPadding = 40;

    // this.addonController.view.frame.x
    if (w >= contextMenuWidth) {
      if (X - w / 2 - margin <= 0) {
        x = margin;
      } else if (X + w / 2 + margin >= W) {
        x = W - margin - w;
      } else {
        x = X - w / 2;
      }
    } else {
      if (X - contextMenuWidth / 2 - margin <= 0) {
        x = margin + contextMenuWidth / 2 - w / 2;
      } else if (X + contextMenuWidth / 2 + margin >= W) {
        x = W - margin - contextMenuWidth / 2 - w / 2;
      } else {
        x = X - w / 2;
      }
    }

    // this.addonController.view.frame.[y, height]
    if (this.arrow === 1) {
      let upperBlankHeight = Y - textMenuPadding - fontSize - padding,
        lowerBlankHeight = H - Y - contextMenuHeight - padding;
      if (upperBlankHeight >= lowerBlankHeight) {
        h = (upperBlankHeight >= h) ? h : upperBlankHeight;
        y = upperBlankHeight - h;
      } else {
        y = H - lowerBlankHeight;
        h = (H - y >= h) ? h : H - y;
      }
    } else {
      let upperBlankHeight = Y - textMenuPadding - contextMenuHeight - padding,
        lowerBlankHeight = H - Y - fontSize - padding;
      if (upperBlankHeight >= lowerBlankHeight) {
        h = (upperBlankHeight >= h) ? h : upperBlankHeight;
        y = upperBlankHeight - h;
      } else {
        y = H - lowerBlankHeight;
        h = (H - y >= h) ? h : H - y;
      }
    }
    this.addonController.view.frame = { x: x, y: y, width: w, height: h };
    this.addonController.currentFrame = { x: x, y: y, width: w, height: h };

  };
  MNSnipasteClass.prototype.customLayoutAddonController = function (rectStr, arrowNum, custom = false) {

    this.rect = rectStr || this.rect;
    this.arrow = arrowNum || this.arrow;
    var x, y
    w = (this.appInstance.osType !== 1) ? 500 : 500, // this.addonController.view.frame.width
      h = 450, // this.addonController.view.frame.height
      fontSize = 15,
      margin = 10,
      padding = 20,
      frame = MNUtil.studyView.bounds,
      W = frame.width,
      H = frame.height,
      rectArr = this.rect.replace(/{/g, '').replace(/}/g, '').replace(/\s/g, '').split(','),
      X = Number(rectArr[0]),
      Y = Number(rectArr[1]),
      studyMode = MNUtil.studyMode,
      contextMenuWidth = studyMode === 0 ? 225 : 435,
      contextMenuHeight = 35,
      textMenuPadding = 40;

    // this.addonController.view.frame.x
    if (w >= contextMenuWidth) {
      if (X - w / 2 - margin <= 0) {
        x = margin;
      } else if (X + w / 2 + margin >= W) {
        x = W - margin - w;
      } else {
        x = X - w / 2;
      }
    } else {
      if (X - contextMenuWidth / 2 - margin <= 0) {
        x = margin + contextMenuWidth / 2 - w / 2;
      } else if (X + contextMenuWidth / 2 + margin >= W) {
        x = W - margin - contextMenuWidth / 2 - w / 2;
      } else {
        x = X - w / 2;
      }
    }

    // this.addonController.view.frame.[y, height]
    if (this.arrow === 1) {
      let upperBlankHeight = Y - textMenuPadding - fontSize - padding,
        lowerBlankHeight = H - Y - contextMenuHeight - padding;
      if (upperBlankHeight >= lowerBlankHeight) {
        h = (upperBlankHeight >= h) ? h : upperBlankHeight;
        y = upperBlankHeight - h;
      } else {
        y = H - lowerBlankHeight;
        h = (H - y >= h) ? h : H - y;
      }
    } else {
      let upperBlankHeight = Y - textMenuPadding - contextMenuHeight - padding,
        lowerBlankHeight = H - Y - fontSize - padding;
      if (upperBlankHeight >= lowerBlankHeight) {
        h = (upperBlankHeight >= h) ? h : upperBlankHeight;
        y = upperBlankHeight - h;
      } else {
        y = H - lowerBlankHeight;
        h = (H - y >= h) ? h : H - y;
      }
    }
    this.addonController.view.frame = { x: x, y: y + 50, width: w, height: h };
    this.addonController.currentFrame = { x: x, y: y + 50 , width: w, height: h };
  };
  return MNSnipasteClass;
};