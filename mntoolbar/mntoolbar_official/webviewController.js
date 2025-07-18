// JSB.require('utils')
// JSB.require('settingController');
/** @return {toolbarController} */
const getToolbarController = ()=>self

var toolbarController = JSB.defineClass('toolbarController : UIViewController <UIImagePickerControllerDelegate,UINavigationControllerDelegate>', {
  viewDidLoad: async function() {
  try {
    
    let self = getToolbarController()
    self.custom = false;
    self.customMode = "None"
    self.miniMode = false;
    self.isLoading = false;
    self.lastFrame = self.view.frame;
    self.currentFrame = self.view.frame
    self.maxButtonNumber = 30
    self.buttonNumber = 9
    self.isMac = MNUtil.version.type === "macOS"
    if (self.dynamicWindow) {
      // self.maxButtonNumber = 9
      self.buttonNumber = toolbarConfig.getWindowState("dynamicButton");
    }else{
      let lastFrame = toolbarConfig.getWindowState("frame")
      if (lastFrame) {
        // MNUtil.copyJSON(lastFrame)
        //兼容两个方向的工具栏
        self.buttonNumber = Math.floor(Math.max(lastFrame.width,lastFrame.height)/45)
      }
    }
    // self.buttonNumber = 9
    self.mode = 0
    self.sideMode = toolbarConfig.getWindowState("sideMode")
    self.splitMode = toolbarConfig.getWindowState("splitMode")
    self.moveDate = Date.now()
    self.settingMode = false
    self.view.layer.shadowOffset = {width: 0, height: 0};
    self.view.layer.shadowRadius = 15;
    self.view.layer.shadowOpacity = 0.5;
    self.view.layer.shadowColor = MNUtil.hexColorAlpha(toolbarConfig.buttonConfig.color, toolbarConfig.buttonConfig.alpha)
    self.view.layer.opacity = 1.0
    self.view.layer.cornerRadius = 5
    self.view.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0)
    self.view.mntoolbar = true

    

    // >>> max button >>>
    self.maxButton = UIButton.buttonWithType(0);
    // self.setButtonLayout(self.maxButton,"maxButtonTapped:")
    self.maxButton.setTitleForState('➕', 0);
    self.maxButton.titleLabel.font = UIFont.systemFontOfSize(10);
    // <<< max button <<<


    // <<< search button <<<
    // >>> move button >>>
    // self.moveButton = UIButton.buttonWithType(0);
    // self.setButtonLayout(self.moveButton)
    // <<< move button <<<
    // self.imageModeButton.setTitleForState('🔍', 0);
    // self.tabButton      = UIButton.buttonWithType(0);
        // >>> screen button >>>
    self.screenButton = UIButton.buttonWithType(0);
    self.setButtonLayout(self.screenButton,"changeScreen:")
    self.screenButton.layer.cornerRadius = 7;
    self.screenButton.width = 40//竖向下的宽度
    self.screenButton.height = 15//竖向下的高度
    // let command = self.keyCommandWithInputModifierFlagsAction('d',1 << 0,'test:')
    // let command = UIKeyCommand.keyCommandWithInputModifierFlagsAction('d',1 << 0,'test:')
    // <<< screen button <<<
    // if (self.isMac) {
      self.addPanGesture(self.view, "onMoveGesture:")
    // }else{
      // self.addLongPressGesture(self.screenButton, "onLongPressGesture:")
    // }
    self.addPanGesture(self.screenButton, "onResizeGesture:")
    // self.addSwipeGesture(self.screenButton, "onSwipeGesture:")
    let dynamicOrder = toolbarConfig.getWindowState("dynamicOrder")
    let useDynamic = dynamicOrder && self.dynamicWindow
    // await MNUtil.delay(0.01)
    if (self.dynamicWindow) {
      if (toolbarConfig.dynamicAction.length == 27) {
        toolbarConfig.dynamicAction = toolbarConfig.dynamicAction.concat(["custom1","custom2","custom3","custom4","custom5","custom6","custom7","custom8","custom9"])
      }
      self.setToolbarButton(useDynamic ? toolbarConfig.dynamicAction:toolbarConfig.action)
    }else{
      if (toolbarConfig.action.length == 27) {
        toolbarConfig.action = toolbarConfig.action.concat(["custom1","custom2","custom3","custom4","custom5","custom6","custom7","custom8","custom9"])
      }
      self.setToolbarButton(toolbarConfig.action)
    }

    // self.resizeGesture.addTargetAction(self,"onResizeGesture:")
  } catch (error) {
    toolbarUtils.addErrorLog(error, "viewDidLoad")
  }
  },
  viewWillAppear: function(animated) {
  },
  viewWillDisappear: function(animated) {
  },
// onPencilDoubleTap(){
//   MNUtil.showHUD("message")
// },
// onPencilDoubleTapPerform(perform){
//   MNUtil.showHUD("message")
// },
viewWillLayoutSubviews: function() {
  let self = getToolbarController()
  if (self.onAnimate) {
    return
  }
  if (self.view) {
    self.setToolbarLayout()
  }

  },
  scrollViewDidScroll: function() {
  },
  changeOpacity: function(sender) {
    self.checkPopover()
    // if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
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
    var studyView = self.studyView
    self.popoverController = new UIPopoverController(menuController);
    var r = sender.convertRectToView(sender.bounds,studyView);
    self.popoverController.presentPopoverFromRect(r, studyView, 1 << 1, true);
  },
  changeOpacityTo:function (opacity) {
    self.view.layer.opacity = opacity
    // self.webAppButton.setTitleForState(`${opacity*100}%`, 0);
  },
  changeScreen: function(sender) {
    let self = getToolbarController()
    let clickDate = Date.now()
    // if (self.dynamicWindow) {
    //   return
    // }
    self.checkPopover()
    let selector = "toggleToolbarDirection:"
    // if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    var commandTable = [
      self.tableItem('⚙️  Setting', 'setting:')
    ];
    if (self.dynamicWindow) {
      if (toolbarConfig.vertical(true)) {
        commandTable.unshift(self.tableItem('🌟  Direction   ↕️', selector,"dynamic"))
      }else{
        commandTable.unshift(self.tableItem('🌟  Direction   ↔️', selector,"dynamic"))
      }
    }else{
      if (toolbarConfig.vertical()) {
        commandTable.unshift(self.tableItem('🛠️  Direction   ↕️', selector,"fixed"))
      }else{
        commandTable.unshift(self.tableItem('🛠️  Direction   ↔️', selector,"fixed"))
      }
    }
    commandTable.push()
    self.popoverController = MNUtil.getPopoverAndPresent(sender, commandTable,200)
  },
  toggleToolbarDirection: function (source) {
    self.checkPopover()
    toolbarConfig.toggleToolbarDirection(source)
  },
  toggleDynamic: function () {
try {
  

    // MNUtil.showHUD("message")
    self.onClick = true
    self.checkPopover()
    // if (self.popoverController) {self.popoverController.dismissPopoverAnimated(true);}
    // MNUtil.postNotification('toggleDynamic', {test:123})
    if (typeof MNUtil === 'undefined') return
    toolbarConfig.dynamic = !toolbarConfig.dynamic
    if (toolbarConfig.dynamic) {
      MNUtil.showHUD("Dynamic ✅")
    }else{
      MNUtil.showHUD("Dynamic ❌")
      if (self.dynamicToolbar) {
        self.dynamicToolbar.view.hidden = true
      }
      // self.testController.view.hidden = true
    }
    toolbarConfig.save("MNToolbar_dynamic")
    // NSUserDefaults.standardUserDefaults().setObjectForKey(toolbarConfig.dynamic,"MNToolbar_dynamic")
    if (self.dynamicToolbar) {
      self.dynamicToolbar.dynamic = toolbarConfig.dynamic
    }
    MNUtil.refreshAddonCommands()
} catch (error) {
  MNUtil.showHUD(error)
}
  },
  /**
   * 
   * @param {UIButton} button 
   */
  setColor: async function (button) {
    let self = getToolbarController()
    // let tem = {
    // }
    // let note = MNNote.getFocusNote()
    // if (note) {
    //   tem.noteid = note.noteId
    //   tem.origin = note.originNoteId
    // }
    // MNUtil.copy(tem)
    // return
    let actionName = "color"+button.color
    let delay = false
    let des = toolbarConfig.getDescriptionById(actionName)
    if ("doubleClick" in des) {
      delay = true
      self.onClick = true
      button.delay = true //让菜单延迟关闭,保证双击可以被执行
      self.onClick = true
      if (button.menu) {
        button.menu.stopHide = true
      }
      if (button.doubleClick) {
        button.doubleClick = false
        let doubleClick = des.doubleClick
        if (!("action" in doubleClick)) {
          doubleClick.action = des.action
        }
        self.customActionByDes(button, doubleClick)
        return
      }
    }
    des.color = button.color
    des.action = "setColor"
    MNUtil.delay(0.1).then(async ()=>{
      await self.customActionByDes(button, des, false)
    })
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    if (!self.dynamicWindow) {
      return
    }
    if (delay) {
      self.hideAfterDelay()
    }else{
      self.hide()
    }
  },
  execute: async function (button) {
    MNUtil.showHUD("Action disabled")
  },
  /**
   * @param {UIButton} button 
   * @returns 
   */
  customAction: async function (button) {
    let self = getToolbarController()
    // eval("MNUtil.showHUD('123')")
    // return
    let dynamicOrder = toolbarConfig.getWindowState("dynamicOrder")
    let useDynamic = dynamicOrder && self.dynamicWindow
    let actionName = button.target ?? (useDynamic?toolbarConfig.dynamicAction[button.index]:toolbarConfig.action[button.index])//这个是key
    let des = toolbarConfig.getDescriptionById(actionName)
    if ("doubleClick" in des) {
      button.delay = true //让菜单延迟关闭,保证双击可以被执行
      self.onClick = true
      if (button.menu) {
        button.menu.stopHide = true
      }
      if (button.doubleClick) {
        button.doubleClick = false
        let doubleClick = des.doubleClick
        if (!("action" in doubleClick)) {
          doubleClick.action = des.action
        }
        self.customActionByDes(button, doubleClick)
        return
      }
    }
    self.customActionByDes(button,des)
  },
  customActionByMenu: async function (param) {
    let des = param.des
    if (typeof des === "string" || !("action" in des)) {
      return
    }
    let button = param.button
    if (des.action === "menu") {
      self.onClick = true
      self.checkPopover()
      if (("autoClose" in des) && des.autoClose) {
        self.hideAfterDelay(0.1)
      }
      let menuItems = des.menuItems
      let width = des.menuWidth??200
      if (menuItems.length) {
        var commandTable = menuItems.map(item=>{
          let title = (typeof item === "string")?item:(item.menuTitle ?? item.action)
          return {title:title,object:self,selector:'customActionByMenu:',param:{des:item,button:button}}
        })
        commandTable.unshift({title:toolbarUtils.emojiNumber(self.commandTables.length)+" 🔙",object:self,selector:'lastPopover:',param:button})
        self.commandTables.push(commandTable)
        self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
      }
      return
    }
    if (!("autoClose" in des) || des.autoClose) {
      self.checkPopover()
      self.hideAfterDelay(0.1)
    }else{
      self.checkPopover()
    }
    // MNUtil.copyJSON(des)
    // return
    self.commandTables = []
    self.customActionByDes(button,des)
  },
lastPopover: function (button) {
      self.checkPopover()
      self.commandTables.pop()
      let commandTable = self.commandTables.at(-1)
      self.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,200,4)
},
  imagePickerControllerDidFinishPickingMediaWithInfo:async function (UIImagePickerController,info) {
    try {
      
    let image = info.UIImagePickerControllerOriginalImage
    // MNUtil.copy(image.pngData().base64Encoding())
    // MNUtil.copyJSON(info)
    MNUtil.studyController.dismissViewControllerAnimatedCompletion(true,undefined)
    if (self.compression) {
      MNUtil.copyImage(image.jpegData(0.0))
    }else{
      MNUtil.copyImage(image.pngData())
    }
    await MNUtil.delay(0.1)
    MNNote.new(self.currentNoteId).paste()
    // MNNote.getFocusNote().paste()
    } catch (error) {
      MNUtil.showHUD(error)
    }
  },
  imagePickerControllerDidCancel:function (params) {
    // MNUtil.copy("text")
    MNUtil.studyController.dismissViewControllerAnimatedCompletion(true,undefined)
    
  },
  timer: function (button) {
    self.onClick = true
    let des = toolbarConfig.getDescriptionById("timer")
    des.action = "setTimer"
    self.customActionByDes(button,des,false)
  },
  undo: function (button) {
    if (UndoManager.sharedInstance().canUndo()) {
      UndoManager.sharedInstance().undo()
      MNUtil.app.refreshAfterDBChanged(MNUtil.currentNotebookId)
    }else{
      MNUtil.showHUD("No Change to Undo")
    }
  },
  redo: function (button) {
    if (UndoManager.sharedInstance().canRedo()) {
      UndoManager.sharedInstance().redo()
      MNUtil.app.refreshAfterDBChanged(MNUtil.currentNotebookId)
    }else{
      MNUtil.showHUD("No Change to Redo")
    }
  },

  
  copy:function (button) {
    let self = getToolbarController()
    // MNUtil.copy(MNNote.focusNote.excerptText)
    // return
    self.onClick = true
    let des = toolbarConfig.getDescriptionById("copy")
    if (button.doubleClick) {
      // self.onClick = true
      button.doubleClick = false
      if (button.menu) {
        button.menu.stopHide = true
      }
      if ("doubleClick" in des) {
        let doubleClick = des.doubleClick
        doubleClick.action = "copy"
        self.customActionByDes(button, doubleClick, false)
        return
      }
      let focusNote = MNNote.getFocusNote()
      if (focusNote) {
        let text = focusNote.noteTitle
        if (text) {
          MNUtil.copy(text)
          MNUtil.showHUD('标题已复制')
        }else{
          MNUtil.showHUD('无标题')
        }
        button.doubleClick = false
      }else{
        MNUtil.showHUD('无选中卡片')
      }
      self.onClick = false
      if (button.menu) {
        button.menu.dismissAnimated(true)
      }
      self.hideAfterDelay()
      return
    }
    if (des && Object.keys(des).length) {
      des.action = "copy"
      button.delay = true
      self.customActionByDes(button, des, false)
      if (self.dynamicWindow) {
        self.hideAfterDelay()
      }
      return
    }
    toolbarUtils.smartCopy()
    self.hideAfterDelay()
    toolbarUtils.dismissPopupMenu(button.menu,self.onClick)
  },
  copyAsMarkdownLink(button) {
    MNUtil.currentWindow.becomeFirstResponder()
    self.onClick = true
try {

    const nodes = MNNote.getFocusNotes()

    let text = ""
    if (button.doubleClick) {
      button.doubleClick = false
      for (const note of nodes) {
        text = text+note.noteURL+'\n'
      }
      MNUtil.showHUD("链接已复制")

    }else{
      for (const note of nodes) {
        let noteTitle = note.noteTitle??"noTitle"
        text = text+'['+noteTitle+']('+note.noteURL+')'+'\n'
      }
      MNUtil.showHUD("Markdown链接已复制")
    }
    MNUtil.copy(text.trim())
} catch (error) {
  MNUtil.showHUD(error)
}
  if (button.menu) {
    button.menu.dismissAnimated(true)
    return
  }
    self.hideAfterDelay()
  },

  searchInEudic:async function (button) {
  try {
    self.onClick = true
    let des = toolbarConfig.getDescriptionById("searchInEudic")
    des.action = "searchInDict"
    await self.customActionByDes(button, des, false)
    // let target = des.target ?? "eudic"
    // let textSelected = MNUtil.selectionText
    // if (!textSelected) {
    //   let focusNote = MNNote.getFocusNote()
    //   if (focusNote) {
    //     if (focusNote.excerptText) {
    //       textSelected = focusNote.excerptText
    //     }else if (focusNote.noteTitle) {
    //       textSelected = focusNote.noteTitle
    //     }else{
    //       let firstComment = focusNote.comments.filter(comment=>comment.type === "TextNote")[0]
    //       if (firstComment) {
    //         textSelected = firstComment.text
    //       }
    //     }
    //   }
    // }
    // if (textSelected) {
    //   if (target === "eudic") {
    //     let textEncoded = encodeURIComponent(textSelected)
    //     let url = "eudic://dict/"+textEncoded
    //     MNUtil.openURL(url)
    //   }else{
    //     let studyFrame = MNUtil.studyView.bounds
    //     let beginFrame = self.view.frame
    //     if (button.menu) {
    //       button.menu.dismissAnimated(true)
    //       let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
    //       let endFrame = Frame.gen(beginFrame.x-225, beginFrame.y-50, 500, 500)
    //       endFrame.y = MNUtil.constrain(endFrame.y, 0, studyFrame.height-500)
    //       endFrame.x = MNUtil.constrain(endFrame.x, 0, studyFrame.width-500)
    //       MNUtil.postNotification("lookupText"+target,{text:textSelected,beginFrame:beginFrame,endFrame:endFrame})
    //       return
    //     }
    //     let endFrame
    //     beginFrame.y = beginFrame.y-10
    //     if (beginFrame.x+490 > studyFrame.width) {
    //       endFrame = Frame.gen(beginFrame.x-450, beginFrame.y-10, 500, 500)
    //       if (beginFrame.y+490 > studyFrame.height) {
    //         endFrame.y = studyFrame.height-500
    //       }
    //       if (endFrame.x < 0) {
    //         endFrame.x = 0
    //       }
    //       if (endFrame.y < 0) {
    //         endFrame.y = 0
    //       }
    //     }else{
    //       endFrame = Frame.gen(beginFrame.x+40, beginFrame.y-10, 500, 500)
    //       if (beginFrame.y+490 > studyFrame.height) {
    //         endFrame.y = studyFrame.height-500
    //       }
    //       if (endFrame.x < 0) {
    //         endFrame.x = 0
    //       }
    //       if (endFrame.y < 0) {
    //         endFrame.y = 0
    //       }
    //     }
    //     MNUtil.postNotification("lookupText"+target, {text:textSelected,beginFrame:beginFrame,endFrame:endFrame})
    //   }


    //   // let des = toolbarConfig.getDescriptionById("searchInEudic")
    //   // if (des && des.source) {
    //   //   // MNUtil.copyJSON(des)
    //   //   switch (des.source) {
    //   //     case "eudic":
    //   //       //donothing
    //   //       break;
    //   //     case "yddict":
    //   //       MNUtil.copy(textSelected)
    //   //       url = "yddict://"
    //   //       break;
    //   //     case "iciba":
    //   //       url = "iciba://word="+textEncoded
    //   //       break;
    //   //     case "sogodict":
    //   //       url = "bingdict://"+textEncoded
    //   //       break;
    //   //     case "bingdict":
    //   //       url = "sogodict://"+textEncoded
    //   //       break;
    //   //     default:
    //   //       MNUtil.showHUD("Invalid source")
    //   //       return
    //   //   }
    //   // }
    //   // showHUD(url)
    // }else{
    //   MNUtil.showHUD('未找到有效文字')
    // }
    // if (button.menu) {
    //   button.menu.dismissAnimated(true)
    //   return
    // }
    self.hideAfterDelay()
    
  } catch (error) {
    toolbarUtils.addErrorLog(error, "searchInEudic")
  }
  },
  switchTitleorExcerpt(button) {
    self.onClick = true
    toolbarUtils.switchTitleOrExcerpt()
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  bigbang: function (button) {
    self.onClick = true
    let focusNote = MNNote.getFocusNote()
    MNUtil.postNotification("bigbangNote",{noteid:focusNote.noteId})
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  snipaste: function (button) {
    self.onClick = true
    let selection = MNUtil.currentSelection
    if (selection.onSelection && !selection.isText) {
      let imageData = selection.image
      MNUtil.postNotification("snipasteImage", {imageData:imageData})
    }else{
      let focusNote = MNNote.getFocusNote()
      MNUtil.postNotification("snipasteNote",{noteid:focusNote.noteId})
    }
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  chatglm: function (button) {
    let des = toolbarConfig.getDescriptionById("chatglm")
    if (des) {
      des.action = "chatAI"
      self.customActionByDes(button, des,false)
    }else{
      MNUtil.postNotification("customChat",{})
    }
    // toolbarUtils.chatAI(des)
    if (button.menu && !self.onClick) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  search: function (button) {
    let self = getToolbarController()
    let des = toolbarConfig.getDescriptionById("search")
    if (des) {
      des.action = "search"
      self.customActionByDes(button, des,false)
      return
    }else{
      // MNUtil.postNotification("customChat",{})
    }
    self.onClick = true
    let selectionText = MNUtil.selectionText
    let noteId = undefined
    let foucsNote = MNNote.getFocusNote()
    if (foucsNote) {
      noteId = foucsNote.noteId
    }
    let studyFrame = self.studyView.bounds
    let beginFrame = self.view.frame
    if (button.menu) {
      button.menu.dismissAnimated(true)
      let beginFrame = button.convertRectToView(button.bounds,self.studyView)
      let endFrame = Frame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
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
    let endFrame
    beginFrame.y = beginFrame.y-10
    if (beginFrame.x+490 > studyFrame.width) {
      endFrame = Frame.gen(beginFrame.x-450, beginFrame.y-10, 450, 500)
      if (beginFrame.y+490 > studyFrame.height) {
        endFrame.y = studyFrame.height-500
      }
    }else{
      endFrame = Frame.gen(beginFrame.x+40, beginFrame.y-10, 450, 500)
      if (beginFrame.y+490 > studyFrame.height) {
        endFrame.y = studyFrame.height-500
      }
    }
    if (selectionText) {
      // MNUtil.showHUD("Text:"+selectionText)
      MNUtil.postNotification("searchInBrowser",{text:selectionText,beginFrame:beginFrame,endFrame:endFrame})
    }else{
      // MNUtil.showHUD("NoteId:"+noteId)
      MNUtil.postNotification("searchInBrowser",{noteid:noteId,beginFrame:beginFrame,endFrame:endFrame})
    }
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  sidebar: async function (button) {
    if (button.menu) {
      button.menu.dismissAnimated(true)
    }
    let des = toolbarConfig.getDescriptionById("sidebar")
    des.action = "toggleSidebar"
    toolbarUtils.toggleSidebar(des)
  },
  /**
   * 
   * @param {UIButton} button 
   * @returns 
   */
  edit: function (button) {
    // MNUtil.showHUD("edit")
    try {
      let des = toolbarConfig.getDescriptionById("edit")
      des.action = "openInEditor"
      self.customActionByDes(button, des)
    } catch (error) {
      toolbarUtils.addErrorLog(error, "edit")
    }
  },
  ocr: async function (button) {
    // if (typeof ocrUtils === 'undefined') {
    //   MNUtil.showHUD("MN Toolbar: Please install 'MN OCR' first!")
    //   return
    // }
    let des = toolbarConfig.getDescriptionById("ocr")
    des.action = "ocr"

    // await toolbarUtils.ocr(des)
    self.customActionByDes(button, des,false)
    // if ("onFinish" in des) {
    //   let finishAction = des.onFinish
    //   await MNUtil.delay(0.5)
    // }
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  setting: function (button) {
    self.checkPopover()
    MNUtil.postNotification("openToolbarSetting", {})
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  pasteAsTitle:function (button) {
    let self = getToolbarController()
    let des = toolbarConfig.getDescriptionById("pasteAsTitle")
    if (des && "doubleClick" in des) {
      self.onClick = true
    }
    if (button.doubleClick) {
      // self.onClick = true
      button.doubleClick = false
      if (button.menu) {
        button.menu.stopHide = true
      }
      if ("doubleClick" in des) {
        let doubleClick = des.doubleClick
        doubleClick.action = "paste"
        self.customActionByDes(button, doubleClick, false)
      }
      return
    }
    if (des && des.target && Object.keys(des).length) {
      des.action = "paste"
      button.delay = true
      self.customActionByDes(button, des, false)
      if (self.dynamicWindow) {
        MNUtil.showHUD("hide")
        self.hideAfterDelay()
      }
      return
    }
    let focusNote = MNNote.getFocusNote()
    let text = MNUtil.clipboardText
    MNUtil.undoGrouping(()=>{
      focusNote.noteTitle = text
    })
    self.hideAfterDelay()
    toolbarUtils.dismissPopupMenu(button.menu,self.onClick)
  },
  clearFormat:function (button) {
    let self = getToolbarController()
    self.onClick = true
    let focusNotes = MNNote.getFocusNotes()
    MNUtil.undoGrouping(()=>{
      focusNotes.map(note=>{
        note.clearFormat()
      })
    })
    // let focusNote = MNNote.getFocusNote()
    // MNUtil.undoGrouping(()=>{
    //   focusNote.clearFormat()
    // })
    if (button.menu) {
      button.menu.dismissAnimated(true)
      return
    }
    self.hideAfterDelay()
  },
  doubleClick:function (button) {
    button.doubleClick = true
  },
  onMoveGesture:function (gesture) {
  try {
    let self = getToolbarController()
    if (self.dynamicWindow) {
      // self.hideAfterDelay()
      self.hide()
      return
    }
    self.onAnimate = false
    self.onClick = true
    if (gesture.state === 1) {//触发
      self.initLocation = gesture.locationInView(self.studyView)
      self.initFrame = self.view.frame
      return
    }
    if (gesture.state === 3) {
      // self.resi
      self.studyView.bringSubviewToFront(self.view)
      toolbarConfig.windowState.open = true
      toolbarConfig.windowState.frame.x = self.view.frame.x
      toolbarConfig.windowState.frame.y = self.view.frame.y
      // toolbarConfig.windowState.frame = self.view.frame
      toolbarConfig.windowState.splitMode = self.splitMode
      toolbarConfig.windowState.sideMode = self.sideMode
      toolbarConfig.save("MNToolbar_windowState")
      self.setToolbarLayout()
      return
    }
    if (gesture.state === 2) {
      let studyFrame = self.studyView.bounds
      let locationInView = gesture.locationInView(self.studyView)
      let y = MNUtil.constrain(self.initFrame.y+locationInView.y - self.initLocation.y, 0, studyFrame.height-15)
      let x = self.initFrame.x+locationInView.x - self.initLocation.x
      self.sideMode = ""
      if (toolbarConfig.vertical()) {
        let splitLine = toolbarUtils.getSplitLine(self.studyController)
        let docMapSplitMode = self.studyController.docMapSplitMode
        if (x<20) {
          x = 0
          self.sideMode = "left"
          self.splitMode = false
        }
        if (x>studyFrame.width-60) {
          x = studyFrame.width-40
          self.sideMode = "right"
          self.splitMode = false
        }
        if (splitLine && docMapSplitMode===1) {
          if (x<splitLine && x>splitLine-40) {
            x = splitLine-20
            self.splitMode = true
            self.sideMode = ""
          }else{
            self.splitMode = false
          }
        }else{
          self.splitMode = false
        }
      }else{
        self.splitMode = false
      }
      let height = 45*self.buttonNumber+15
      self.setFrame(MNUtil.genFrame(x, y, 40, height))

      self.custom = false;
    }
  } catch (error) {
    toolbarUtils.addErrorLog(error, "onMoveGesture")
  }
  },
  onLongPressGesture:async function (gesture) {
    if (gesture.state === 1) {
      let button = gesture.view
      let actionName = button.target ?? (self.dynamicWindow?toolbarConfig.dynamicAction[button.index]:toolbarConfig.action[button.index])//这个是key
      if (actionName) {
        let des = toolbarConfig.getDescriptionById(actionName)
        if ("onLongPress" in des) {
          let onLongPress = des.onLongPress
          if (!("action" in onLongPress)) {
            onLongPress.action = des.action
          }
          await self.customActionByDes(button, onLongPress)
          return
        }else{
          MNUtil.showHUD("No long press action")
        }
      }
    }
    // if (gesture.state === 1) {//触发
    //   self.initLocation = gesture.locationInView(MNUtil.studyView)
    //   self.initFrame = self.view.frame
    //   MNUtil.showHUD("Move mode ✅")
    //   MNButton.setColor(self.screenButton, "#9898ff",1.0)
    //   // self.view.layer.backgroundColor = MNUtil.hexColorAlpha("#b5b5f5",1.0)
    //   // self.view.layer.borderWidth = 2
    //   return
    // }
    // if (gesture.state === 3) {//停止
    //   MNUtil.showHUD("Move mode ❌")
    //   MNButton.setColor(self.screenButton, "#9bb2d6",0.8)
    //   return
    // }
    // if (gesture.state === 2) {
    //   let studyFrame = MNUtil.studyView.bounds
    //   let locationInView = gesture.locationInView(MNUtil.studyView)
    //   let y = MNUtil.constrain(self.initFrame.y+locationInView.y - self.initLocation.y, 0, studyFrame.height-15)
    //   let x = self.initFrame.x+locationInView.x - self.initLocation.x
    //   let splitLine = MNUtil.splitLine
    //   let docMapSplitMode = MNUtil.studyController.docMapSplitMode
    //   if (x<20) {
    //     x = 0
    //     self.sideMode = "left"
    //     self.splitMode = false
    //   }
    //   if (x>studyFrame.width-60) {
    //     x = studyFrame.width-40
    //     self.sideMode = "right"
    //     self.splitMode = false
    //   }
    //   if (splitLine && docMapSplitMode===1) {
    //     if (x<splitLine && x>splitLine-40) {
    //       x = splitLine-20
    //       self.splitMode = true
    //       self.sideMode = ""
    //     }else{
    //       self.splitMode = false
    //     }
    //   }else{
    //     self.splitMode = false
    //   }
    //   let frame = {x:x,y:y,width:self.initFrame.width,height:self.initFrame.height}
    //   Frame.set(self.view,frame.x,frame.y,frame.width,frame.height)
    // }
    // MNUtil.showHUD("message"+gesture.state)

  },
  onSwipeGesture:function (gesture) {
    if (gesture.state === 1) {
      MNUtil.showHUD("Swipe mode ✅")
    }
    // MNUtil.showHUD("message"+gesture.state)
  },
  onResizeGesture:function (gesture) {
    let self = getToolbarController()
    try {
      

    self.onClick = true
    self.custom = false;
    self.onResize = true
    let baseframe = gesture.view.frame
    let locationInView = gesture.locationInView(gesture.view)
    let frame = self.view.frame
    let height = locationInView.y+baseframe.y+baseframe.height*0.5
    let width = locationInView.x+baseframe.x+baseframe.width*0.5
    self.setFrame(MNUtil.genFrame(frame.x, frame.y, width, height))
    if (gesture.state === 3) {
      self.view.bringSubviewToFront(self.screenButton)
      let windowState = toolbarConfig.windowState
      if (self.dynamicWindow) {
        windowState.dynamicButton = self.buttonNumber
        self.hide()
        // toolbarConfig.save("MNToolbar_windowState",{open:toolbarConfig.windowState.open,frame:self.view.frame})
      }else{
        windowState.frame = self.view.frame
        windowState.open = true
      }
      toolbarConfig.save("MNToolbar_windowState",windowState)
      self.onResize = false
    }
    } catch (error) {
      toolbarUtils.addErrorLog(error, "onResizeGesture")
    }
  },
});
toolbarController.prototype.setButtonLayout = function (button,targetAction) {
    button.autoresizingMask = (1 << 0 | 1 << 3);
    button.setTitleColorForState(UIColor.whiteColor(),0);
    button.setTitleColorForState(toolbarConfig.highlightColor, 1);
    button.backgroundColor = UIColor.colorWithHexString("#9bb2d6").colorWithAlphaComponent(0.8);
    button.layer.cornerRadius = 5;
    button.layer.masksToBounds = true;
    if (targetAction) {
      button.addTargetActionForControlEvents(this, targetAction, 1 << 6);
    }
    this.view.addSubview(button);
}

/**
 * 
 * @param {UIButton} button 
 * @param {*} targetAction 
 * @param {*} color 
 */
toolbarController.prototype.setColorButtonLayout = function (button,targetAction,color) {
    button.autoresizingMask = (1 << 0 | 1 << 3);
    button.setTitleColorForState(UIColor.blackColor(),0);
    button.setTitleColorForState(toolbarConfig.highlightColor, 1);
    button.backgroundColor = color
    button.layer.cornerRadius = 10;
    button.layer.masksToBounds = true;
    if (targetAction) {
      //1，3，4按下就触发，不用抬起
      //64按下再抬起
      let number = 64
      button.removeTargetActionForControlEvents(this, targetAction, number)
      button.addTargetActionForControlEvents(this, targetAction, number);
      button.addTargetActionForControlEvents(this, "doubleClick:", 1 << 1);
    }
    this.view.addSubview(button);
}

/**
 * @this {toolbarController}
 */
toolbarController.prototype.show = async function (frame) {
  let preFrame = this.view.frame
  if (toolbarConfig.horizontal(this.dynamicWindow)) {
    preFrame.width = toolbarUtils.checkHeight(preFrame.width,this.maxButtonNumber)
    preFrame.height = 40
    preFrame.y = toolbarUtils.constrain(preFrame.y, 0, this.studyView.frame.height-40)
  }else{
    preFrame.width = 40
    preFrame.height = toolbarUtils.checkHeight(preFrame.height,this.maxButtonNumber)
    preFrame.x = toolbarUtils.constrain(preFrame.x, 0, this.studyView.frame.width-40)
  }
  this.onAnimate = true
  // preFrame.width = 40
  let yBottom = preFrame.y+preFrame.height
  let preOpacity = this.view.layer.opacity
  this.view.layer.opacity = 0.2
  if (frame) {
    frame.width = 40
    frame.height = toolbarUtils.checkHeight(frame.height,this.maxButtonNumber)
    this.view.frame = frame
    this.currentFrame = frame
  }
  this.view.hidden = false
  // this.moveButton.hidden = true
  this.screenButton.hidden = true
  let useDynamic = toolbarConfig.getWindowState("dynamicOrder") && this.dynamicWindow
  this.setToolbarButton(useDynamic?toolbarConfig.dynamicAction:toolbarConfig.action)

  // showHUD(JSON.stringify(preFrame))
  MNUtil.animate(()=>{
    this.view.layer.opacity = preOpacity
    this.view.frame = preFrame
    this.currentFrame = preFrame
  }).then(()=>{
    try {
      this.view.layer.borderWidth = 0
      // this.moveButton.hidden = false
      this.screenButton.hidden = false
      let number = preFrame.height/40
      if (number > 9) {
        number = 9
      }
      this.onAnimate = false
      this.setToolbarLayout()
    } catch (error) {
      MNUtil.showHUD("Error in show: "+error)

    }
  })
  // UIView.animateWithDurationAnimationsCompletion(0.2,()=>{
  //   this.view.layer.opacity = preOpacity
  //   this.view.frame = preFrame
  //   this.currentFrame = preFrame
  // },
  // ()=>{
  // try {
    
  //   this.view.layer.borderWidth = 0
  //   this.moveButton.hidden = false
  //   this.screenButton.hidden = false
  //   let number = preFrame.height/40
  //   if (number > 9) {
  //     number = 9
  //   }
  //   // showHUD("number:"+number)
  //   for (let index = 0; index < number-1; index++) {
  //     this["ColorButton"+index].hidden = false
  //   }
  //   this.onAnimate = false
  //   this.setToolbarLayout()
  // } catch (error) {
  //   MNUtil.showHUD(error)
  // }
  // })
}
/**
 * @this {toolbarController}
 */
toolbarController.prototype.hide = function (frame) {
  let preFrame = this.currentFrame
  this.onAnimate = true
  this.view.frame = this.currentFrame
  // copy(JSON.stringify(preFrame))
  let preOpacity = 1.0
  // for (let index = 0; index < this.buttonNumber; index++) {
  //   this["ColorButton"+index].hidden = true
  // }
  // this.moveButton.hidden = true
  this.screenButton.hidden = true
  // return
  // showHUD("frame:"+JSON.stringify(this.currentFrame))
  MNUtil.animate(()=>{
    this.view.layer.opacity = 0.2
    if (frame) {
      this.view.frame = frame
      this.currentFrame = frame
    }
  },0.2).then(()=>{
    if (this.notHide) {
      MNUtil.animate(()=>{
        this.view.layer.opacity = preOpacity      
      })
      this.view.hidden = false;
      this.onAnimate = false
      this.notHide = undefined
    }else{
      this.view.hidden = true;
      this.view.layer.opacity = preOpacity      
    }
    this.view.frame = preFrame
    this.currentFrame = preFrame
    this.onAnimate = false
  })
}

/**
 * @this {toolbarController}
 * @param {number} delay
 * @param {UIButton|undefined} button
 */
toolbarController.prototype.hideAfterDelay = function (delay = 0.5) {
  if (this.view.hidden) {
    return
  }
  if (this.dynamicWindow) {
    this.onAnimate = true
    if (this.notHide) {
      this.onAnimate = false
      return
    }
    MNUtil.delay(delay).then(()=>{
      this.hide()
    })
  }
}

/**
 * @this {toolbarController}
 */
toolbarController.prototype.setToolbarButton = function (actionNames = toolbarConfig.action,newActions=undefined) {
try {
  // MNUtil.showHUD("setToolbarButton")
  let buttonColor = toolbarUtils.getButtonColor()
  let dynamicOrder = toolbarConfig.getWindowState("dynamicOrder")
  let useDynamic = dynamicOrder && this.dynamicWindow
  this.view.layer.shadowColor = buttonColor
  
  let actions
  if (newActions) {
    toolbarConfig.actions = newActions
  }
  actions = toolbarConfig.actions
  let defaultActionNames = toolbarConfig.getDefaultActionKeys()
  if (!actionNames) {
    actionNames = defaultActionNames
    if (useDynamic) {
      toolbarConfig.dynamicAction = actionNames
    }else{
      toolbarConfig.action = actionNames
    }
  }else{
    if (useDynamic) {
      toolbarConfig.dynamicAction = actionNames
    }else{
      toolbarConfig.action = actionNames
    }
  }

  // MNUtil.copyJSON(actionNames)
  // let activeActionNumbers = actionNames.length
  for (let index = 0; index < this.maxButtonNumber; index++) {
    let actionName = actionNames[index]
    let colorButton
    if (this["ColorButton"+index]) {
      colorButton = this["ColorButton"+index]
      colorButton.index = index
    }else{
      this["ColorButton"+index] = UIButton.buttonWithType(0);
      colorButton = this["ColorButton"+index]
      colorButton.height = 40
      colorButton.width = 40
      colorButton.index = index
      // if (this.isMac) {
        this.addPanGesture(colorButton, "onMoveGesture:")  
      // }else{
        this.addLongPressGesture(colorButton, "onLongPressGesture:")
        // this.addSwipeGesture(colorButton, "onSwipeGesture:")
      // }

      // this["moveGesture"+index] = new UIPanGestureRecognizer(this,"onMoveGesture:")
      // colorButton.addGestureRecognizer(this["moveGesture"+index])
      // this["moveGesture"+index].view.hidden = false
    }
    if (actionName.includes("color")) {
      colorButton.color = parseInt(actionName.slice(5))
      this.setColorButtonLayout(colorButton,"setColor:",buttonColor)
    }else if(actionName.includes("custom")){
      this.setColorButtonLayout(colorButton,"customAction:",buttonColor)
    }else{
      this.setColorButtonLayout(colorButton,actionName+":",buttonColor)
    }
    // MNButton.setImage(colorButton, toolbarConfig.imageConfigs[actionName])
    // let image = (actionName in actions)?actions[actionName].image+".png":defaultActions[actionName].image+".png"
    // colorButton.setImageForState(MNUtil.getImage(toolbarConfig.mainPath + `/`+image),0)
    colorButton.setImageForState(toolbarConfig.imageConfigs[actionName],0)
    // self["ColorButton"+index].setTitleForState("",0) 
    // self["ColorButton"+index].contentHorizontalAlignment = 1
  }
  if (this.dynamicToolbar) {
    if (dynamicOrder) {
      // MNUtil.showHUD("useDynamic: "+useDynamic)
      this.dynamicToolbar.setToolbarButton(toolbarConfig.dynamicAction,newActions)
    }else{
      // MNUtil.showHUD("useDynamic: "+useDynamic)
      this.dynamicToolbar.setToolbarButton(toolbarConfig.action,newActions)
    }
  }
  this.refresh()
} catch (error) {
  toolbarUtils.addErrorLog(error, "setToolbarButton")
}
}
/**
 * 
 * @param {*} frame 
 * @this {toolbarController}
 */
toolbarController.prototype.refresh = function (frame) {
try {
  

  if (!frame) {
    frame = this.view.frame
  }
  this.setFrame(frame,true)
  this.setToolbarLayout()
} catch (error) {
  toolbarUtils.addErrorLog(error, "refresh")
}
}

toolbarController.prototype.setToolbarLayout = function () {
  if (this.onAnimate) {
    return
  }
  try {
  // MNUtil.showHUD("setToolbarLayout")
    

  // MNUtil.copyJSON(this.view.frame)
  if (toolbarConfig.horizontal(this.dynamicWindow)) {
    var viewFrame = this.view.bounds;
    var xLeft     = viewFrame.x
    var xRight    = xLeft + viewFrame.width
    var yTop      = viewFrame.y
    var yBottom   = yTop + 40
    // this.moveButton.frame = {x: 0 ,y: 0,width: 40,height: 15};
    if (this.screenButton) {
      Frame.set(this.screenButton, xRight-15, 0,this.screenButton.height,this.screenButton.width)
      this.view.bringSubviewToFront(this.screenButton)
    }
    let initX = 0
    let initY = 0
    for (let index = 0; index < this.maxButtonNumber; index++) {
      initY = 0
      Frame.set(this["ColorButton"+index], xLeft+initX, initY)
      initX = initX+45
      this["ColorButton"+index].hidden = (initX > xRight+5)
    }
  }else{
    var viewFrame = this.view.bounds;
    var xLeft     = viewFrame.x
    var xRight    = xLeft + 40
    var yTop      = viewFrame.y
    var yBottom   = yTop + viewFrame.height
    // this.moveButton.frame = {x: 0 ,y: 0,width: 40,height: 15};
    if (this.screenButton) {
      Frame.set(this.screenButton, 0, yBottom-15,this.screenButton.width,this.screenButton.height)
      this.view.bringSubviewToFront(this.screenButton)
    }
    let initX = 0
    let initY = 0
    for (let index = 0; index < this.maxButtonNumber; index++) {
      initX = 0
      Frame.set(this["ColorButton"+index], xLeft+initX, initY)
      initY = initY+45
      this["ColorButton"+index].hidden = (initY > yBottom+5)
    }
  }
  } catch (error) {
    toolbarUtils.addErrorLog(error, "setToolbarLayout")
  }
}
toolbarController.prototype.checkPopover = function () {
  if (this.popoverController) {this.popoverController.dismissPopoverAnimated(true);}
}
/**
 * @this {toolbarController}
 * @param {UIButton} button 
 * @param {object} des 
 * @returns 
 */
toolbarController.prototype.customActionByDes = async function (button,actionDes,checkSubscribe = true) {//这里actionName指的是key
  try {
    if (!("action" in actionDes)) {
      MNUtil.confirm("MNToolbar", "❌ Action is not found!")
      return
    }
    if (checkSubscribe && !toolbarUtils.checkSubscribe(true)) {
      return
    }
    if (this.customActionMenu(button,actionDes)) {
      // MNUtil.showHUD("reject")
      //如果返回true则表示菜单弹出已执行，则不再执行下面的代码
      return
    }
    await toolbarUtils.customActionByDes(actionDes,button,this,false)

    // let focusNote = MNNote.getFocusNote()
    // let targetNotes = []
    // let success = true
    // // MNUtil.showHUD("message"+(focusNote instanceof MNNote))
    // let notebookid = focusNote ? focusNote.notebookId : undefined
    // let title,content,color,config
    // let targetNoteId
    // switch (des.action) {
    //   case "undo":
    //     UndoManager.sharedInstance().undo()
    //     MNUtil.app.refreshAfterDBChanged(MNUtil.currentNotebookId)
    //     await MNUtil.delay(0.1)
    //     break;
    //   case "redo":
    //     UndoManager.sharedInstance().redo()
    //     MNUtil.app.refreshAfterDBChanged(MNUtil.currentNotebookId)
    //     await MNUtil.delay(0.1)
    //     break;
    //   case "copy":
    //     if (des.target || des.content) {
    //       success = await toolbarUtils.copy(des)
    //     }else{
    //       success = toolbarUtils.smartCopy()
    //     }
    //     break;
    //   case "paste":
    //     toolbarUtils.paste(des)
    //     await MNUtil.delay(0.1)
    //     break;
    //   case "markdown2Mindmap":
    //     toolbarUtils.markdown2Mindmap(des)
    //     break;
    //   case "webSearch":
    //     await toolbarUtils.webSearch(des)
    //     break;
    //   case "setTimer":
    //     toolbarUtils.setTimer(des)
    //     break;
    //   case "switchTitleOrExcerpt":
    //     toolbarUtils.switchTitleOrExcerpt()
    //     await MNUtil.delay(0.1)
    //     break;
    //   case "cloneAndMerge":
    //   try {
    //     if (!des.hideMessage) {
    //       MNUtil.showHUD("cloneAndMerge")
    //     }
    //     targetNoteId= MNUtil.getNoteIdByURL(des.target)
    //     MNUtil.undoGrouping(()=>{
    //       try {
    //       MNNote.getFocusNotes().forEach(focusNote=>{
    //         toolbarUtils.cloneAndMerge(focusNote.note, targetNoteId)
    //       })
    //       } catch (error) {
    //         MNUtil.showHUD(error)
    //       }
    //     })
    //     await MNUtil.delay(0.1)
    //   } catch (error) {
    //     MNUtil.showHUD(error)
    //   }
    //     break;
    //   case "cloneAsChildNote":
    //     if (!des.hideMessage) {
    //       MNUtil.showHUD("cloneAsChildNote")
    //     }
    //     targetNoteId= MNUtil.getNoteIdByURL(des.target)
    //     MNUtil.undoGrouping(()=>{
    //       MNNote.getFocusNotes().forEach(focusNote=>{
    //         toolbarUtils.cloneAsChildNote(focusNote, targetNoteId)
    //       })
    //     })
    //     await MNUtil.delay(0.1)
    //     break;
    //   case "addTags":
    //     toolbarUtils.addTags(des)
    //     break;
    //   case "removeTags":
    //     toolbarUtils.removeTags(des)
    //     break;
    //   case "ocr":
    //     await toolbarUtils.ocr(des,button)
    //     break;
    //   case "searchInDict":
    //     // MNUtil.showHUD("searchInDict")
    //     toolbarUtils.searchInDict(des,button)
    //     break;
    //   case "insertSnippet":
    //     success = toolbarUtils.insertSnippet(des)
    //     break;
    //   case "importDoc":
    //     let docPath = await MNUtil.importFile(["com.adobe.pdf","public.text"])
    //     if (docPath.endsWith(".pdf") || docPath.endsWith(".doc") || docPath.endsWith(".docx")) {
    //       let docMd5 = MNUtil.importDocument(docPath)
    //       MNUtil.openDoc(docMd5)
    //     }else{
    //       let fileName = MNUtil.getFileName(docPath).split(".")[0]
    //       let content = MNUtil.readText(docPath)
    //       if (focusNote) {
    //         let child = focusNote.createChildNote({title:fileName,excerptText:content,excerptTextMarkdown:true})
    //         await child.focusInMindMap(0.5)
    //       }else{
    //         let newNote = toolbarUtils.newNoteInCurrentChildMap({title:fileName,excerptText:content,excerptTextMarkdown:true})
    //         await newNote.focusInMindMap(0.5)
    //       }
    //     }
    //     break;
    //   case "noteHighlight":
    //     let newNote = await toolbarUtils.noteHighlight(des)
    //     if (newNote && newNote.notebookId === MNUtil.currentNotebookId) {
    //       if ("continueExcerpt" in des && des.continueExcerpt) {
    //         //如果是继续摘录，则不需要focus
    //         MNUtil.excuteCommand("ContinueExcerpt")
    //       }
    //       let focusInFloatWindowForAllDocMode = des.focusInFloatWindowForAllDocMode ?? false
    //       let delay = des.focusAfterDelay ?? 0.5
    //       if (MNUtil.studyController.docMapSplitMode === 2) {
    //         if (focusInFloatWindowForAllDocMode) {
    //           await newNote.focusInFloatMindMap(delay)
    //         }
    //       }
    //     }
    //     // if ("parentNote" in des) {
    //     //   await MNUtil.delay(5)
    //     //   let parentNote = MNNote.new(des.parentNote)
    //     //   parentNote.focusInMindMap()
    //     //   MNUtil.showHUD("as childNote of "+parentNote.noteId)
    //     //   MNUtil.undoGrouping(()=>{
    //     //     parentNote.addChild(newNote)
    //     //   })
    //     // }

    //     break;
    //   case "moveNote":
    //     toolbarUtils.moveNote(des)
    //     await MNUtil.delay(0.1)
    //     break;
    //   case "addChildNote"://不支持多选
    //     if (!des.hideMessage) {
    //       MNUtil.showHUD("addChildNote")
    //     }
    //     config = {}
    //     if (des.title) {
    //       config.title = toolbarUtils.detectAndReplace(des.title)
    //     }
    //     if (des.content) {
    //       config.content = toolbarUtils.detectAndReplace(des.content)
    //     }
    //     if (des.markdown) {
    //       config.markdown = des.content
    //     }
    //     color = undefined
    //     if (des.color) {
    //       switch (des.color) {
    //         case "{{parent}}":
    //         case "parent":
    //           color = focusNote.colorIndex
    //           break;
    //         default:
    //           if (typeof des.color === "number") {
    //             color = des.color
    //           }else{
    //             color = parseInt(des.color.trim())
    //           }
    //           break;
    //       }
    //       config.color = color
    //     }
    //     let childNote = focusNote.createChildNote(config)
    //     await childNote.focusInMindMap(0.5)
    //     break;
    //   case "file2base64":
    //     let file = await MNUtil.importFile(["public.data"])
    //     let data = NSData.dataWithContentsOfFile(file)
    //     MNUtil.copy(data.base64Encoding())
    //     break;
    //   case "addBrotherNote":
    //     if (!des.hideMessage) {
    //       MNUtil.showHUD("addBrotherNote")
    //     }
    //     config = {}
    //     if (des.title) {
    //       config.title = toolbarUtils.detectAndReplace(des.title)
    //     }
    //     if (des.content) {
    //       config.content = toolbarUtils.detectAndReplace(des.content)
    //     }
    //     if (des.markdown) {
    //       config.markdown = des.markdown
    //     }
    //     color = undefined
    //     if (des.color) {
    //       switch (des.color) {
    //         case "{{parent}}":
    //         case "parent":
    //           color = focusNote.parentNote.colorIndex
    //           break;
    //         case "{{current}}":
    //         case "current":
    //           color = focusNote.colorIndex
    //           break;
    //         default:
    //           if (typeof des.color === "number") {
    //             color = des.color
    //           }else{
    //             color = parseInt(des.color.trim())
    //           }
    //           break;
    //       }
    //       config.color = color
    //     }
    //     let brotherNote = focusNote.createBrotherNote(config)
    //     await brotherNote.focusInMindMap(0.5)
    //     break;

    //   case "crash":
    //     if (!des.hideMessage) {
    //       MNUtil.showHUD("crash")
    //     }
    //     MNUtil.studyView.frame = {x:undefined}
    //     await MNUtil.delay(0.1)
    //     break;
    //   case "addComment":
    //     if (!des.hideMessage) {
    //       MNUtil.showHUD("addComment")
    //     }
    //     let comment = des.content?.trim()
    //     if (comment) {
    //       let focusNotes = MNNote.getFocusNotes()
    //       let markdown = des.markdown ?? true
    //       let commentIndex = des.index ?? 999
    //       // MNUtil.copy("text"+focusNotes.length)
    //       MNUtil.undoGrouping(()=>{
    //         if (markdown) {
    //           focusNotes.forEach(note => {
    //             let replacedText = toolbarUtils.detectAndReplace(comment,undefined,note)
    //             if (replacedText.trim()) {
    //               note.appendMarkdownComment(replacedText,commentIndex)
    //             }
    //           })
    //         }else{
    //           focusNotes.forEach(note => {
    //             let replacedText = toolbarUtils.detectAndReplace(comment,undefined,note)
    //             if (replacedText.trim()) {
    //               note.appendTextComment(replacedText,commentIndex)
    //             }
    //           })
    //         }
    //       })
    //     }
    //     await MNUtil.delay(0.1)
    //     break;
    //   case "addMarkdownLink":
    //     if (!des.hideMessage) {
    //       MNUtil.showHUD("addMarkdownLink")
    //     }
    //     let title = des.title
    //     let link = des.link
    //     if (title && link) {
    //       let replacedTitle = toolbarUtils.detectAndReplace(title)
    //       let replacedLink = toolbarUtils.detectAndReplace(link)
    //       // MNUtil.copy("text"+focusNotes.length)
    //       MNUtil.undoGrouping(()=>{
    //         focusNote.appendMarkdownComment(`[${replacedTitle}](${replacedLink})`)
    //       })
    //     }
    //     await MNUtil.delay(0.1)
    //     break;
    //   case "removeComment":
    //     if (!des.hideMessage) {
    //       MNUtil.showHUD("removeComment")
    //     }
    //     toolbarUtils.removeComment(des)
    //     await MNUtil.delay(0.1)
    //     break;
    //   case "moveComment":
    //     if (!des.hideMessage) {
    //       MNUtil.showHUD("moveComment")
    //     }
    //     toolbarUtils.moveComment(des)
    //     await MNUtil.delay(0.1)
    //     break;
    //   case "link":
    //     let linkType = des.linkType ?? "Both"
    //     let targetUrl = des.target
    //     if (targetUrl === "{{clipboardText}}") {
    //       targetUrl = MNUtil.clipboardText
    //     }
    //     // MNUtil.showHUD(targetUrl)
    //     let targetNote = MNNote.new(targetUrl)
    //     MNUtil.undoGrouping(()=>{
    //       if (targetNote) {
    //         MNNote.getFocusNotes().forEach(note=>{
    //           note.appendNoteLink(targetNote,linkType)
    //         })
    //       }else{
    //         MNUtil.showHUD("Invalid target note!")
    //       }
    //     })
    //     await MNUtil.delay(0.1)
    //     break;
    //   case "clearContent":
    //     toolbarUtils.clearContent(des)
    //     break;
    //   case "setContent":
    //       toolbarUtils.setContent(des)
    //     break;
    //   case "showInFloatWindow":
    //     toolbarUtils.showInFloatWindow(des)
    //     // MNUtil.copy(focusNote.noteId)
    //     await MNUtil.delay(0.1)
    //     break;
    //   case "openURL":
    //     if (des.url) {
    //       let url = toolbarUtils.detectAndReplace(des.url)
    //       MNUtil.openURL(url)
    //       break;
    //       // MNUtil.showHUD("message")
    //     }
    //     MNUtil.showHUD("No valid argument!")
    //     break;
    //   case "command":
    //     let urlPre = "marginnote4app://command/"
    //     let delay = des.commandDelay ?? 0.1
    //     if (des.commands) {
    //       for (let i = 0; i < des.commands.length; i++) {
    //         const command = des.commands[i];
    //         let url = urlPre+command
    //         MNUtil.openURL(url)
    //         await MNUtil.delay(delay)
    //       }
    //       break
    //     }
    //     if (des.command) {
    //       let url = urlPre+des.command
    //       MNUtil.openURL(url)
    //       break
    //     }
    //     MNUtil.showHUD("No valid argument!")
    //     break
    //   case "shortcut":
    //     let shortcutName = des.name
    //     let url = "shortcuts://run-shortcut?name="+encodeURIComponent(shortcutName)
    //     if (des.input) {
    //       url = url+"&input="+encodeURIComponent(des.input)
    //     }
    //     if (des.text) {
    //       let text = toolbarUtils.detectAndReplace(des.text)
    //       url = url+"&text="+encodeURIComponent(text)
    //     }
    //     MNUtil.openURL(url)
    //     break
    //   case "toggleTextFirst":
    //     if (!des.hideMessage) {
    //       MNUtil.showHUD("toggleTextFirst")
    //     }
    //     targetNotes = toolbarUtils.getNotesByRange(des.range ?? "currentNotes")
    //     MNUtil.undoGrouping(()=>{
    //       targetNotes.forEach(note=>{
    //         note.textFirst = !note.textFirst
    //       })
    //     })
    //     await MNUtil.delay(0.1)
    //     break
    //   case "toggleMarkdown":
    //     if (!des.hideMessage) {
    //       MNUtil.showHUD("toggleMarkdown")
    //     }
    //     targetNotes = toolbarUtils.getNotesByRange(des.range ?? "currentNotes")
    //     MNUtil.undoGrouping(()=>{
    //       targetNotes.forEach(note=>{
    //         note.excerptTextMarkdown = !note.excerptTextMarkdown
    //       })
    //     })
    //     await MNUtil.delay(0.1)
    //     break
    //   case "toggleSidebar":
    //     toolbarUtils.toggleSidebar(des)
    //     break;
    //   case "replace":
    //     toolbarUtils.replaceAction(des)
    //     break;
    //   case "mergeText":
    //     let noteRange = des.range ?? "currentNotes"
    //     targetNotes = toolbarUtils.getNotesByRange(noteRange)
    //     MNUtil.undoGrouping(()=>{
    //       targetNotes.forEach((note,index)=>{
    //         let mergedText = toolbarUtils.getMergedText(note, des, index)
    //         if (mergedText === undefined) {
    //           return new Promise((resolve, reject) => {
    //             resolve()
    //           })
    //         }
    //         switch (des.target) {
    //           case "excerptText":
    //             note.excerptText = mergedText
    //             if ("markdown" in des) {
    //               note.excerptTextMarkdown = des.markdown
    //             }
    //             break;
    //           case "title":
    //             note.noteTitle = mergedText
    //             break;
    //           case "newComment":
    //             if ("markdown" in des && des.markdown) {
    //               note.appendMarkdownComment(mergedText)
    //             }else{
    //               note.appendTextComment(mergedText)
    //             }
    //             break;
    //           case "clipboard":
    //             MNUtil.copy(mergedText)
    //             break;
    //           default:
    //             break;
    //         }
    //       })
    //     })
    //     if (toolbarUtils.sourceToRemove.length) {
    //       MNUtil.undoGrouping(()=>{
    //         // MNUtil.showHUD("remove")
    //         toolbarUtils.sourceToRemove.forEach(note=>{
    //           note.excerptText = ""
    //         })
    //         MNUtil.delay(1).then(()=>{
    //           toolbarUtils.sourceToRemove = []
    //         })
    //       })
    //     }
    //     if (Object.keys(toolbarUtils.commentToRemove).length) {
    //       MNUtil.undoGrouping(()=>{
    //         let commentInfos = Object.keys(toolbarUtils.commentToRemove)
    //         commentInfos.forEach(noteId => {
    //           let note = MNNote.new(noteId)
    //           let sortedIndex = MNUtil.sort(toolbarUtils.commentToRemove[noteId],"decrement")
    //           sortedIndex.forEach(commentIndex=>{
    //             if (commentIndex < 0) {
    //               note.noteTitle = ""
    //             }else{
    //               note.removeCommentByIndex(commentIndex)
    //             }
    //           })
    //         })
    //         MNUtil.delay(1).then(()=>{
    //           toolbarUtils.commentToRemove = {}
    //         })
    //       })
    //     }
    //     await MNUtil.delay(0.1)
    //     break;
    //   case "chatAI":
    //     toolbarUtils.chatAI(des,button)
    //     break
    //   case "search":
    //     toolbarUtils.search(des,button)
    //     break;
    //   case "openWebURL":
    //     toolbarUtils.openWebURL(des)
    //     break;
    //   case "addImageComment":
    //     let source = des.source ?? "photo"
    //     this.compression = des.compression ?? true
    //     this.currentNoteId = focusNote.noteId
    //     switch (source) {
    //       case "camera":
    //         this.imagePickerController = UIImagePickerController.new()
    //         this.imagePickerController.delegate = this  // 设置代理
    //         this.imagePickerController.sourceType = 1  // 设置图片源为相机
    //         // this.imagePickerController.allowsEditing = true  // 设置图片源为相册
    //         MNUtil.studyController.presentViewControllerAnimatedCompletion(this.imagePickerController,true,undefined)
    //         break;
    //       case "photo":
    //         this.imagePickerController = UIImagePickerController.new()
    //         this.imagePickerController.delegate = this  // 设置代理
    //         this.imagePickerController.sourceType = 0  // 设置图片源为相册
    //         // this.imagePickerController.allowsEditing = true  // 设置图片源为相册
    //         MNUtil.studyController.presentViewControllerAnimatedCompletion(this.imagePickerController,true,undefined)
    //         break;
    //       case "file":
    //         let UTI = ["public.image"]
    //         let path = await MNUtil.importFile(UTI)
    //         let imageData = MNUtil.getFile(path)
    //         MNUtil.showHUD("Import: "+MNUtil.getFileName(path))
    //         MNUtil.copyImage(imageData)
    //         focusNote.paste()
    //         break;
    //       default:
    //         MNUtil.showHUD("unknown source")
    //         break;
    //     }
    //     // this.presentViewControllerAnimatedCompletion(this.imagePickerController,true,undefined)
    //     // 展示图片选择器
    //     // present(imagePickerController, animated: true, completion: nil)
    //     break;
    //   case "focus":
    //     await toolbarUtils.focus(des)
    //     break 
    //   case "showMessage":
    //     toolbarUtils.showMessage(des)
    //     break
    //   case "addWordsToEurdic":
    //     let words = des.words ?? [des.word]
    //     let option = {
    //       APIKey:des.APIKey
    //     }
    //     if (des.studylistId) {
    //       option.studylistId = des.studylistId
    //     }
    //     if (des.studylistName) {
    //       option.studylistName = des.studylistName
    //     }
    //     await toolbarUtils.addWordsToEurdic(words,option)
    //     break
    //   case "confirm":
    //     let targetDes = await toolbarUtils.userConfirm(des)
    //     if (targetDes) {
    //       success = await this.customActionByDes(button, targetDes) 
    //     }else{
    //       success = false
    //       MNUtil.showHUD("No valid argument!")
    //     }
    //     break
    //   case "userSelect":
    //     let selectDes = await toolbarUtils.userSelect(des)
    //     if (selectDes) {
    //       success = await this.customActionByDes(button, selectDes) 
    //     }else{
    //       success = false
    //       MNUtil.showHUD("No valid argument!")
    //     }
    //     break
    //   case "toggleView":
    //     if ("targets" in des) {
    //       des.targets.map(target=>{
    //         MNUtil.postNotification("toggleMindmapToolbar", {target:target})
    //       })
    //     }else{
    //       MNUtil.postNotification("toggleMindmapToolbar", {target:des.target})
    //     }
    //     break
    //   case "export":
    //     toolbarUtils.export(des)
    //     // let exportTarget = des.target ?? "auto"
    //     // let docPath = MNUtil.getDocById(focusNote.note.docMd5).fullPathFileName
    //     // MNUtil.saveFile(docPath, ["public.pdf"])
    //     break;
    //   case "setButtonImage":
    //     if (!des.hideMessage) {
    //       MNUtil.showHUD("setButtonImage...")
    //     }
    //     await MNUtil.delay(0.01)
    //     if ("imageConfig" in des) {
    //       let config = des.imageConfig
    //       let keys = Object.keys(config)
    //       for (let i = 0; i < keys.length; i++) {
    //         let url = config[keys[i]].url
    //         let scale = config[keys[i]].scale??3
    //         MNUtil.showHUD("setButtonImage: "+keys[i])
    //         toolbarConfig.setImageByURL(keys[i], url,false,scale)
    //       }
    //       // await Promise.all(asyncActions)
    //       MNUtil.postNotification("refreshToolbarButton", {})
    //     }else{
    //       MNUtil.showHUD("Missing imageConfig")
    //     }
    //     break;
    //   case "setColor":
    //     await toolbarUtils.setColor(des)
    //     break;
    //   case "triggerButton":
    //     let targetButtonName = des.buttonName
    //     success = await this.customActionByButton(button, targetButtonName)
    //     break;
    //   default:
    //     MNUtil.showHUD("Not supported yet...")
    //     break;
    // }
    if (button.delay) {
      this.hideAfterDelay()
      toolbarUtils.dismissPopupMenu(button.menu,true)
    }else{
      toolbarUtils.dismissPopupMenu(button.menu)
    }
    let delay = actionDes.delay ?? 0.5
    // if (success && "onSuccess" in des) {
    //   let finishAction = des.onSuccess
    //   await MNUtil.delay(delay)
    //   await toolbarUtils.customActionByDes(button, finishAction)
    //   return new Promise((resolve, reject) => {
    //     resolve()
    //   })
    // } 
    // if (!success && "onFailed" in des) {
    //   let finishAction = des.onFailed
    //   await MNUtil.delay(delay)
    //   await toolbarUtils.customActionByDes(button, finishAction)
    //   return new Promise((resolve, reject) => {
    //     resolve()
    //   })
    // }

    while ("onFinish" in actionDes) {
      actionDes = actionDes.onFinish
      await MNUtil.delay(delay)
      await toolbarUtils.customActionByDes(actionDes,button)
    }
    return new Promise((resolve, reject) => {
      resolve()
    })
    // if (this.dynamicWindow) {
    //   this.hideAfterDelay()
    // }
    // copyJSON(des)
  } catch (error) {
    toolbarUtils.addErrorLog(error, "toolbarController.customActionByDes")
    // MNUtil.showHUD(error)
  }
}

/**
 * @this {toolbarController}
 * @param {UIButton} button 
 * @param {object} des 
 * @returns {Promise<boolean>}
 */
toolbarController.prototype.customActionByButton = async function (button,targetButtonName,checkSubscribe = true) {//这里actionName指的是key
  try {
    

  let des = toolbarConfig.getDesByButtonName(targetButtonName)
  if (des) {
    await this.customActionByDes(button, des)
    return true
  }else{
    return false
  }
    } catch (error) {
    toolbarUtils.addErrorLog(error, "customActionByButton")
    return false
  }
}
/**
 * @this {toolbarController}
 * @param {UIButton} button 
 * @param {string} target 
 */
toolbarController.prototype.replaceButtonTo = async function (button,target) {
  button.removeTargetActionForControlEvents(undefined, undefined, 1 << 6);
  button.setTitleForState("", 0)
  button.setTitleForState("", 1)
  button.addTargetActionForControlEvents(this, target, 1 << 6);
  this.addLongPressGesture(button, "onLongPressGesture:")

}
/**
 * @this {toolbarController}
 */
toolbarController.prototype.popupReplace = async function (button) {

  let hasReplace = toolbarConfig.hasPopup()
  if (!hasReplace) {
    return
  }
  await MNUtil.delay(0.01)//需要延迟一下才能拿到当前的popupMenu
  try {
  // MNUtil.showHUD("message")
  let menu = PopupMenu.currentMenu()
  // MNUtil.log("Menuheight:"+menu.frame.height)
  if (menu) {
    let ids = menu.items.map(item=>{
      if (item.actionString) {
        return item.actionString.replace(":", "")
      }
      return ""
    })
    let beginIndex = menu.frame.height > 45 ? 1 : 0
    // MNUtil.copy(ids)
    // MNUtil.log("subviews:"+menu.subviews.length)
    let maxButtonNumber = (ids.length == menu.subviews.length)?ids.length:menu.subviews.length-1
    // MNUtil.showHUD("message"+ids.length+";"+menu.subviews.length)
    // MNUtil.showHUD(message)
    for (let i = 0; i < maxButtonNumber; i++) {
      if (!ids[i]) {
        continue
      }
      let popupButton = menu.subviews[i+beginIndex].subviews[0]
      let popupConfig = toolbarConfig.getPopupConfig(ids[i])
      // MNUtil.showHUD("message"+menu.subviews.length)
      if (!popupConfig) {
        // MNUtil.showHUD("Unknown popup button: "+ids[i])
        continue
      }
      // MNUtil.showHUD("popupReplace:"+ids[i]+":"+toolbarConfig.getPopupConfig(ids[i]).enabled)
      if (popupConfig.enabled) {
        // MNUtil.showHUD(toolbarConfig.getPopupConfig(ids[i]).target)
        let target = popupConfig.target
        if (target) {
        try {
          popupButton.menu = menu
          popupButton.target = target
          popupButton.setImageForState(toolbarConfig.imageConfigs[target],0)
          popupButton.setImageForState(toolbarConfig.imageConfigs[target],1)
        } catch (error) {
          toolbarUtils.addErrorLog(error, "popupReplaceImage", ids[i])
        }
        }else{
          // MNUtil.showHUD("message"+ids[i])
          // toolbarUtils.addErrorLog(error, "popupReplace", ids[i])
        }
      }
    }
    for (let i = 0; i < maxButtonNumber; i++) {
      if (!ids[i]) {
        continue
      }
      let popupButton = menu.subviews[i+beginIndex].subviews[0]
      let popupConfig = toolbarConfig.getPopupConfig(ids[i])
      // MNUtil.showHUD("message"+menu.subviews.length)

      if (!popupConfig) {
        MNUtil.showHUD("Unknown popup button: "+ids[i])
        MNUtil.log(ids[i])
        
        continue
      }
      // MNUtil.showHUD("popupReplace:"+ids[i]+":"+toolbarConfig.getPopupConfig(ids[i]).enabled)
      if (popupConfig.enabled) {
        // MNUtil.showHUD(toolbarConfig.getPopupConfig(ids[i]).target)
        let target = popupConfig.target
        if (target) {
        try {
          popupButton.menu = menu
          popupButton.target = target
          if (toolbarConfig.builtinActionKeys.includes(target)) {
            if (target.includes("color")) {
              popupButton.color = parseInt(target.slice(5))
              this.replaceButtonTo(popupButton, "setColor:")
            }else{
              this.replaceButtonTo(popupButton, target+":")
            }
          }else{
            this.replaceButtonTo(popupButton, "customAction:")
          }
        } catch (error) {
          toolbarUtils.addErrorLog(error, "popupReplaceSelector", ids[i])
        }
        }else{
          MNUtil.showHUD("message"+ids[i])
          // toolbarUtils.addErrorLog(error, "popupReplace", ids[i])
        }
      }
    }
    await MNUtil.delay(0.01)

    // MNUtil.copy("number: "+targetsNumber)
    for (let i = 0; i < maxButtonNumber; i++) {
      if (!ids[i]) {
        continue
      }
      let popupButton = menu.subviews[i+beginIndex].subviews[0]
      let popupConfig = toolbarConfig.getPopupConfig(ids[i])
      // MNUtil.showHUD("message"+menu.subviews.length)
      if (!popupConfig) {
        MNUtil.showHUD("Unknown popup button: "+ids[i])
        continue
      }
      // MNUtil.showHUD("popupReplace:"+ids[i]+":"+toolbarConfig.getPopupConfig(ids[i]).enabled)
      if (popupConfig.enabled) {
          // let tem = getAllProperties(temButton)
          let targetsNumber = popupButton.allTargets().count()
          // let action = temButton.allControlEvents.length
          if (targetsNumber === 1) {
            MNUtil.showHUD("可能存在按钮替换失败: "+i)
          }else{
            // MNUtil.showHUD("Number: "+targetsNumber)
          }
      }
    }
    return menu
  }else{
    return undefined
    // MNUtil.showHUD("popupReplaceError")
  }
  } catch (error) {
    toolbarUtils.addErrorLog(error, "popupReplace")
  }
}
/**
 * 检测是否需要弹出菜单,如果需要弹出菜单则返回true,否则返回false
 * @this {toolbarController}
 * @param {UIButton} button 
 * @param {object} des 
 * @returns {boolean}
 */
toolbarController.prototype.customActionMenu =  function (button,des) {
  let buttonX = toolbarUtils.getButtonFrame(button).x//转化成相对于studyview的
  try {
    let selector = "customActionByMenu:"
    let object = this
    function tableItem(title,params,checked=false) {
      let des = {des:params,button:button}
      return {title:title,object:object,selector:"customActionByMenu:",param:des,checked:checked}
    }
    //先处理menu这个自定义动作
    if (des.action === "menu") {
      this.onClick = true
      if ("autoClose" in des) {
        this.onClick = !des.autoClose
      }
      let menuItems = des.menuItems
      let width = des.menuWidth??200
      if (menuItems.length) {
        var commandTable = menuItems.map(item=>{
          let title = (typeof item === "string")?item:(item.menuTitle ?? item.action)
          return tableItem(title, item)
          // return {title:title,object:this,selector:'customActionByMenu:',param:{des:item,button:button}}
        })
        this.commandTables = [commandTable]
        if (this.studyView.bounds.width - buttonX < (width+40)) {
          this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
        }else{
          this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
        }
      }
      return true
    }


    // if (des.action === "chatAI" && des.target) {
    //   if (des.target === "menu") {
    //     this.onClick = true
    //     let promptKeys = chatAIConfig.getConfig("promptNames")
    //     let prompts = chatAIConfig.prompts
    //     var commandTable = promptKeys.map(promptKey=>{
    //       let title = prompts[promptKey].title.trim()
    //       return {title:"🚀   "+title,object:this,selector:'customActionByMenu:',param:{des:{action:"chatAI",prompt:title},button:button}}
    //     })
    //     let width = 250
    //     if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
    //       this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    //     }else{
    //       this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    //     }
    //     return true
    //   }
    // }
    if (des.target && des.target === "menu") {
      this.onClick = true
      var commandTable
      let width = 250
      let selector = "customActionByMenu:"
      switch (des.action) {
        case "chatAI":
          let promptKeys = chatAIConfig.getConfig("promptNames")
          let prompts = chatAIConfig.prompts
          var commandTable = promptKeys.map(promptKey=>{
            let title = prompts[promptKey].title.trim()
            return tableItem("🚀   "+title, {action:"chatAI",prompt:title})
          })
          break;
        case "insertSnippet":
          commandTable = des.menuItems.map(item => {
            item.action = "insertSnippet"
            return tableItem(item.menuTitle,item)
            // return this.tableItem(item.menuTitle, selector,{des:item,button:button})
            // return {title:item.menuTitle,object:this,selector:'customActionByMenu:',param:{des:item,button:button}}
          })
          break;
        case "paste":
          commandTable = [
            tableItem("default",{action:"paste",target:"default"}),
            tableItem("title",{action:"paste",target:"title"}),
            tableItem("excerpt",{action:"paste",target:"excerpt"}),
            tableItem("appendTitle",{action:"paste",target:"appendTitle"}),
            tableItem("appendExcerpt",{action:"paste",target:"appendExcerpt"}),
          ]
          break;
        case "ocr":
          commandTable = [
            tableItem("option", {action:"ocr",target:"option"}),
            tableItem("clipboard", {action:"ocr",target:"clipboard"}),
            tableItem("comment", {action:"ocr",target:"comment"}),
            tableItem("excerpt", {action:"ocr",target:"excerpt"}),
            tableItem("editor", {action:"ocr",target:"editor"}),
            tableItem("chatModeReference", {action:"ocr",target:"chatModeReference"})
          ]
          break;
        case "setTimer":
          commandTable = [
            tableItem("⏰  Clock Mode", {action:"setTimer",timerMode:"clock"}),
            tableItem("⏱️  Count Up", {action:"setTimer",timerMode:"countUp"}),
            tableItem("⏱️  Countdown: 5mins", {action:"setTimer",timerMode:"countdown",minutes:5}),
            tableItem("⏱️  Countdown: 10mins", {action:"setTimer",timerMode:"countdown",minutes:10}),
            tableItem("⏱️  Countdown: 15mins", {action:"setTimer",timerMode:"countdown",minutes:15}),
            tableItem("🍅  Countdown: 25mins", {action:"setTimer",timerMode:"countdown",minutes:25}),
            tableItem("⏱️  Countdown: 40mins", {action:"setTimer",timerMode:"countdown",minutes:40}),
            tableItem("⏱️  Countdown: 60mins", {action:"setTimer",timerMode:"countdown",minutes:60}),
          ]
          break;
        case "search":
          let names = browserConfig.entrieNames
          let entries = browserConfig.entries
          var commandTable = names.map(name=>{
            let title = entries[name].title
            let engine = entries[name].engine
            return tableItem(title, {action:"search",engine:engine})
            // return {title:title,object:this,selector:'customActionByMenu:',param:{des:{action:"search",engine:engine},button:button}}
          })
          break;
        case "copy":
          commandTable = [
            tableItem("selectionText", {action:"copy",target:"selectionText"}),
            tableItem("selectionImage", {action:"copy",target:"selectionImage"}),
            tableItem("title", {action:"copy",target:"title"}),
            tableItem("excerpt", {action:"copy",target:"excerpt"}),
            tableItem("excerpt (OCR)", {action:"copy",target:"excerptOCR"}),
            tableItem("notesText", {action:"copy",target:"notesText"}),
            tableItem("comment", {action:"copy",target:"comment"}),
            tableItem("noteId", {action:"copy",target:"noteId"}),
            tableItem("noteURL", {action:"copy",target:"noteURL"}),
            tableItem("noteMarkdown", {action:"copy",target:"noteMarkdown"}),
            tableItem("noteMarkdown (OCR)", {action:"copy",target:"noteMarkdownOCR"}),
            tableItem("noteWithDecendentsMarkdown", {action:"copy",target:"noteWithDecendentsMarkdown"}),
          ]
          break;
        case "showInFloatWindow":
          commandTable = [
            tableItem("noteInClipboard", {action:"showInFloatWindow",target:"noteInClipboard"}),
            tableItem("currentNote", {action:"showInFloatWindow",target:"currentNote"}),
            tableItem("currentChildMap", {action:"showInFloatWindow",target:"currentChildMap"}),
            tableItem("parentNote", {action:"showInFloatWindow",target:"parentNote"}),
            tableItem("currentNoteInMindMap", {action:"showInFloatWindow",target:"currentNoteInMindMap"}),
          ]
          break;
        case "addImageComment":
          commandTable = [
            tableItem("photo", {action:"addImageComment",source:"photo"}),
            tableItem("camera", {action:"addImageComment",source:"camera"}),
            tableItem("file", {action:"addImageComment",source:"file"}),
          ]
          break;
        case "removeTags":
          let focusNote = MNNote.getFocusNote()
          if (!focusNote) {
            MNUtil.showHUD("No focus note")
            return true
          }
          if (!focusNote.tags.length) {
            MNUtil.showHUD("No tags")
            return true
          }
          commandTable = focusNote.tags.map(tag=>{
            return tableItem("#"+tag, {action:"removeTags",tag:tag})
          })
          break;
        default:
          return false;
      }
      if (this.studyView.bounds.width - buttonX < (width+40)) {
        this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
      }else{
        this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
      }
      return true
    }
    // if (des.action === "insertSnippet" && des.target && des.target === "menu") {
    //   this.onClick = true
    //   var commandTable = des.menuItems.map(item => {
    //     item.action = "insertSnippet"
    //     return {title:item.menuTitle,object:this,selector:'customActionByMenu:',param:{des:item,button:button}}
    //   })
    //   let width = 250
    //   if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    //   }else{
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    //   }
    //   return true
    // }
    // if (des.action === "paste" && des.target && des.target === "menu") {
    //   this.onClick = true
    //   var commandTable = [
    //     {title:"default",object:this,selector:'customActionByMenu:',param:{des:{action:"paste",target:"default"},button:button}},
    //     {title:"title",object:this,selector:'customActionByMenu:',param:{des:{action:"paste",target:"title"},button:button}},
    //     {title:"excerpt",object:this,selector:'customActionByMenu:',param:{des:{action:"paste",target:"excerpt"},button:button}},
    //     {title:"appendTitle",object:this,selector:'customActionByMenu:',param:{des:{action:"paste",target:"appendTitle"},button:button}},
    //     {title:"appendExcerpt",object:this,selector:'customActionByMenu:',param:{des:{action:"paste",target:"appendExcerpt"},button:button}}
    //   ]
    //   let width = 250
    //   if ((MNUtil.studyView.bounds.width - buttonX) < (width+40)) {
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    //   }else{
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    //   }
    //   return true
    // }

    // if (des.action === "ocr" && des.target && des.target === "menu") {
    //   this.onClick = true
    //   var commandTable = [
    //     {title:"clipboard",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"clipboard"},button:button}},
    //     {title:"comment",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"comment"},button:button}},
    //     {title:"excerpt",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"excerpt"},button:button}},
    //     {title:"editor",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"editor"},button:button}},
    //     {title:"chatModeReference",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"chatModeReference"},button:button}}
    //   ]
    //   let width = 250
    //   if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    //   }else{
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    //   }
    //   return true
    // }

    // if (des.action === "setTimer" && des.target && des.target === "menu") {
    //   this.onClick = true
    //   var commandTable = [
    //     // {title:'📝  Annotation',object:self,selector:'inputAnnotation:',param:'left'},
    //     // {title:'⚙️  Setting',object:self,selector:'openSetting:',param:'left'},
    //     {title:'⏰  Clock Mode',object:self,selector:'customActionByMenu:',param:{des:{action:"setTimer",timerMode:"clock"},button:button}},
    //     {title:'⏱️  Count Up',object:self,selector:'customActionByMenu:',param:{des:{action:"setTimer",timerMode:"countUp"},button:button}},
    //     {title:'⌛  Countdown: 5mins',object:self,selector:'customActionByMenu:',param:{des:{action:"setTimer",timerMode:"countdown",minutes:5},button:button}},
    //     {title:'⌛  Countdown: 10mins',object:self,selector:'customActionByMenu:',param:{des:{action:"setTimer",timerMode:"countdown",minutes:10},button:button}},
    //     {title:'⌛  Countdown: 15mins',object:self,selector:'customActionByMenu:',param:{des:{action:"setTimer",timerMode:"countdown",minutes:15},button:button}},
    //     {title:'🍅  Countdown: 25mins',object:self,selector:'customActionByMenu:',param:{des:{action:"setTimer",timerMode:"countdown",minutes:25},button:button}},
    //     {title:'⌛  Countdown: 40mins',object:self,selector:'customActionByMenu:',param:{des:{action:"setTimer",timerMode:"countdown",minutes:40},button:button}},
    //     {title:'⌛  Countdown: 60mins',object:self,selector:'customActionByMenu:',param:{des:{action:"setTimer",timerMode:"countdown",minutes:60},button:button}},
    //   ];
    //   // var commandTable = [
    //   //   {title:"clipboard",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"clipboard"},button:button}},
    //   //   {title:"comment",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"comment"},button:button}},
    //   //   {title:"excerpt",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"excerpt"},button:button}},
    //   //   {title:"editor",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"editor"},button:button}},
    //   //   {title:"chatModeReference",object:this,selector:'customActionByMenu:',param:{des:{action:"ocr",target:"chatModeReference"},button:button}}
    //   // ]
    //   let width = 250
    //   if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    //   }else{
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    //   }
    //   return true
    // }

    // if (des.action === "search" && des.target && des.target === "menu") {
    //   this.onClick = true
    //   let names = browserConfig.entrieNames
    //   let entries = browserConfig.entries
    //   var commandTable = names.map(name=>{
    //     let title = entries[name].title
    //     let engine = entries[name].engine
    //     return {title:title,object:this,selector:'customActionByMenu:',param:{des:{action:"search",engine:engine},button:button}}
    //   })
    //   let width = 250
    //   if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    //   }else{
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    //   }
    //   return true
    // }
    // if (des.action === "copy" && des.target && des.target === "menu") {
    //   this.onClick = true
    //   var commandTable = [
    //     {title:"selectionText",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"selectionText"},button:button}},
    //     {title:"selectionImage",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"selectionImage"},button:button}},
    //     {title:"title",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"title"},button:button}},
    //     {title:"excerpt",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"excerpt"},button:button}},
    //     {title:"excerpt (OCR)",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"excerptOCR"},button:button}},
    //     {title:"notesText",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"notesText"},button:button}},
    //     {title:"comment",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"comment"},button:button}},
    //     {title:"noteId",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"noteId"},button:button}},
    //     {title:"noteURL",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"noteURL"},button:button}},
    //     {title:"noteMarkdown",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"noteMarkdown"},button:button}},
    //     {title:"noteMarkdown (OCR)",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"noteMarkdownOCR"},button:button}},
    //     {title:"noteWithDecendentsMarkdown",object:this,selector:'customActionByMenu:',param:{des:{action:"copy",target:"noteWithDecendentsMarkdown"},button:button}},
    //   ]
    //   let width = 250
    //   if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    //   }else{
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    //   }
    //   return true
    // }
    // if (des.action === "showInFloatWindow" && des.target && des.target === "menu") {
    //   this.onClick = true
    //   // MNUtil.showHUD("showInFloatWindow")
    //   var commandTable = [
    //     {title:"noteInClipboard",object:this,selector:'customActionByMenu:',param:{des:{action:"showInFloatWindow",target:"noteInClipboard"},button:button}},
    //     {title:"currentNote",object:this,selector:'customActionByMenu:',param:{des:{action:"showInFloatWindow",target:"currentNote"},button:button}},
    //     {title:"currentChildMap",object:this,selector:'customActionByMenu:',param:{des:{action:"showInFloatWindow",target:"currentChildMap"},button:button}},
    //     {title:"parentNote",object:this,selector:'customActionByMenu:',param:{des:{action:"showInFloatWindow",target:"parentNote"},button:button}},
    //     {title:"currentNoteInMindMap",object:this,selector:'customActionByMenu:',param:{des:{action:"showInFloatWindow",target:"currentNoteInMindMap"},button:button}}
    //   ]
    //   let width = 250
    //   if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    //   }else{
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    //   }
    //   return true
    // }
    // if (des.action === "addImageComment" && des.target === "menu") {
    //   this.onClick = true
    //   var commandTable = [
    //     {title:"photo",object:this,selector:'customActionByMenu:',param:{des:{action:"addImageComment",source:"photo"},button:button}},
    //     {title:"camera",object:this,selector:'customActionByMenu:',param:{des:{action:"addImageComment",source:"camera"},button:button}},
    //     {title:"file",object:this,selector:'customActionByMenu:',param:{des:{action:"addImageComment",source:"file"},button:button}},
    //   ]
    //   let width = 250
    //   if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,0)
    //   }else{
    //     this.popoverController = MNUtil.getPopoverAndPresent(button, commandTable,width,4)
    //   }
    //   return true
    // }
    // MNUtil.showHUD("shouldShowMenu: false")
    return false
  } catch (error) {
    // toolbarUtils.addErrorLog(error, "customActionMenu")
    return false
  }
}

/**
 * 
 * @param {UIView} view 
 * @param {string} selector 
 * @this {toolbarController}
 */
toolbarController.prototype.addPanGesture = function (view,selector) {
  let gestureRecognizer = new UIPanGestureRecognizer(this,selector)
  view.addGestureRecognizer(gestureRecognizer)
}

/**
 * 
 * @param {UIView} view 
 * @param {string} selector 
 * @this {toolbarController}
 */
toolbarController.prototype.addLongPressGesture = function (view,selector) {
  let gestureRecognizer = new UILongPressGestureRecognizer(this,selector)
  gestureRecognizer.minimumPressDuration = 0.3
  // if (view.target !== undefined) {
  //   gestureRecognizer.target = view.target
  // }
  // if (view.index !== undefined) {
  //   gestureRecognizer.index = view.index
  // }
  view.addGestureRecognizer(gestureRecognizer)
}
/**
 * 
 * @param {UIView} view 
 * @param {string} selector 
 * @this {toolbarController}
 */
toolbarController.prototype.addSwipeGesture = function (view,selector) {
  let gestureRecognizer = new UISwipeGestureRecognizer(this,selector)
  view.addGestureRecognizer(gestureRecognizer)
}

/**
 * 
 * @param {string} title 
 * @param {string} selector 
 * @param {any} param 
 * @param {boolean|undefined} checked 
 * @this {toolbarController}
 * @returns 
 */
toolbarController.prototype.tableItem = function (title,selector,param = "",checked = false) {
  return {title:title,object:this,selector:selector,param:param,checked:checked}
}
/**
 * 根据工具栏的方向,对frame做调整
 * @this {toolbarController}
 * @returns 
 */
toolbarController.prototype.setFrame = function (frame,maximize = false) {
  let targetFrame = {x:frame.x,y:frame.y}
  if(toolbarConfig.horizontal(this.dynamicWindow)){
    let width = Math.max(frame.width,frame.height)
    if (maximize) {
      width = 45*this.buttonNumber+15
    }else{
      this.buttonNumber = Math.floor(width/45)
    }
    if ((frame.x + width+15) > this.studyView.bounds.width) {
      width = this.studyView.bounds.width - frame.x-15
    }
    width = toolbarUtils.checkHeight(width,this.maxButtonNumber)
    targetFrame.width = width
    targetFrame.height = 40
    targetFrame.x = toolbarUtils.constrain(targetFrame.x, 0, this.studyView.bounds.width-width)
    targetFrame.y = toolbarUtils.constrain(targetFrame.y, 0, this.studyView.bounds.height-40)
  }else{
    targetFrame.width = 40
    let height = Math.max(frame.width,frame.height)
    if (maximize) {
      height = 45*this.buttonNumber+15
    }else{
      this.buttonNumber = Math.floor(height/45)
    }
    if (height > 420 && !toolbarUtils.isSubscribed(false)) {
      height = 420
    }
    if (frame.y + height > this.studyView.bounds.height) {
      height = this.studyView.bounds.height - frame.y
    }
    height = toolbarUtils.checkHeight(height,this.maxButtonNumber)
    targetFrame.height = height
  }
  this.view.frame = targetFrame
  this.currentFrame = targetFrame
}