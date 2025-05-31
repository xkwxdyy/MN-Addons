// JSB.require('utils')
// JSB.require('settingController');
/** @return {toolbarController} */
const getToolbarController = ()=>self

var toolbarController = JSB.defineClass('toolbarController : UIViewController <UIImagePickerControllerDelegate,UINavigationControllerDelegate>', {
  viewDidLoad: function() {
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
    let dynamicOrder = toolbarConfig.getWindowState("dynamicOrder")
    let useDynamic = dynamicOrder && self.dynamicWindow

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
  self.setToolbarLayout()

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
    var studyView = MNUtil.studyView
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
      // 夏大鱼羊 - begin
      commandTable.unshift(self.tableItem('🗂️   卡片预处理模式',"togglePreprocess:", toolbarConfig.windowState.preprocess))
      // 夏大鱼羊 - end
    }else{
      if (toolbarConfig.vertical()) {
        commandTable.unshift(self.tableItem('🛠️  Direction   ↕️', selector,"fixed"))
      }else{
        commandTable.unshift(self.tableItem('🛠️  Direction   ↔️', selector,"fixed"))
      }
      // 夏大鱼羊 - begin
      commandTable.unshift(self.tableItem('🗂️   卡片预处理模式',"togglePreprocess:", toolbarConfig.windowState.preprocess))
      // 夏大鱼羊 - end
    }
    commandTable.push()
    self.popoverController = MNUtil.getPopoverAndPresent(sender, commandTable,200)
  },
  // 夏大鱼羊 - begin
  // dynamic 这里还需要再写一次下面的 togglePreprocess 函数
  togglePreprocess: function () {
    self.checkPopover()
    toolbarConfig.togglePreprocess()
  },
  // 夏大鱼羊 - end
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
    let des = toolbarConfig.getDescriptionByName(actionName)
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
    let des = toolbarConfig.getDescriptionByName(actionName)
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
    let des = toolbarConfig.getDescriptionByName("timer")
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
    self.onClick = true
    let des = toolbarConfig.getDescriptionByName("copy")
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
    let des = toolbarConfig.getDescriptionByName("searchInEudic")
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


    //   // let des = toolbarConfig.getDescriptionByName("searchInEudic")
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
    let des = toolbarConfig.getDescriptionByName("chatglm")
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
    let des = toolbarConfig.getDescriptionByName("search")
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
    let focusNote = MNNote.getFocusNote()
    if (focusNote) {
      noteId = focusNote.noteId
    }
    let studyFrame = MNUtil.studyView.bounds
    let beginFrame = self.view.frame
    if (button.menu) {
      button.menu.dismissAnimated(true)
      let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
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
    let des = toolbarConfig.getDescriptionByName("sidebar")
    des.action = "toggleSidebar"
    toolbarUtils.toggleSidebar(des)
  },
  /**
   * 
   * @param {UIButton} button 
   * @returns 
   */
  edit: function (button) {
    let noteId = undefined
    if (self.dynamicWindow && toolbarUtils.currentNoteId) {
      noteId = toolbarUtils.currentNoteId
    }else{
      let focusNote = MNNote.getFocusNote()
      if (focusNote) {
        noteId = focusNote.noteId
      }
    }
    if (!noteId && MNUtil.currentSelection.onSelection) {
      noteId = MNNote.fromSelection().realGroupNoteForTopicId().noteId
    }
    if (!noteId) {
      MNUtil.showHUD("No note")
      return
    }
    let studyFrame = MNUtil.studyView.bounds
    if (button.menu) {
      button.menu.dismissAnimated(true)
      let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
      let endFrame = Frame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
      endFrame.y = toolbarUtils.constrain(endFrame.y, 0, studyFrame.height-500)
      endFrame.x = toolbarUtils.constrain(endFrame.x, 0, studyFrame.width-500)
      MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
      return
    }
    let beginFrame = self.view.frame
    beginFrame.y = beginFrame.y-10
    if (beginFrame.x+490 > studyFrame.width) {
      let endFrame = Frame.gen(beginFrame.x-450, beginFrame.y-10, 450, 500)
      if (beginFrame.y+490 > studyFrame.height) {
        endFrame.y = studyFrame.height-500
      }
      MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
    }else{
      let endFrame = Frame.gen(beginFrame.x+40, beginFrame.y-10, 450, 500)
      if (beginFrame.y+490 > studyFrame.height) {
        endFrame.y = studyFrame.height-500
      }
      MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
    }
    self.hideAfterDelay()
  },
  ocr: async function (button) {
    // if (typeof ocrUtils === 'undefined') {
    //   MNUtil.showHUD("MN Toolbar: Please install 'MN OCR' first!")
    //   return
    // }
    let des = toolbarConfig.getDescriptionByName("ocr")
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
    let des = toolbarConfig.getDescriptionByName("pasteAsTitle")
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
      self.initLocation = gesture.locationInView(MNUtil.studyView)
      self.initFrame = self.view.frame
      return
    }
    if (gesture.state === 3) {
      // self.resi
      MNUtil.studyView.bringSubviewToFront(self.view)
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
      let studyFrame = MNUtil.studyView.bounds
      let locationInView = gesture.locationInView(MNUtil.studyView)
      let y = MNUtil.constrain(self.initFrame.y+locationInView.y - self.initLocation.y, 0, studyFrame.height-15)
      let x = self.initFrame.x+locationInView.x - self.initLocation.x
      self.sideMode = ""
      if (toolbarConfig.vertical()) {
        let splitLine = MNUtil.splitLine
        let docMapSplitMode = MNUtil.studyController.docMapSplitMode
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
      self.setFrame(MNUtil.genFrame(x, y, 40, toolbarUtils.checkHeight(height,self.maxButtonNumber)))

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
        let des = toolbarConfig.getDescriptionByName(actionName)
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
    preFrame.y = toolbarUtils.constrain(preFrame.y, 0, MNUtil.studyView.frame.height-40)
  }else{
    preFrame.width = 40
    preFrame.height = toolbarUtils.checkHeight(preFrame.height,this.maxButtonNumber)
    preFrame.x = toolbarUtils.constrain(preFrame.x, 0, MNUtil.studyView.frame.width-40)
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
    if (actionName){
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
  MNUtil.showHUD("Error in setToolbarButton: "+error)
}
}
/**
 * 
 * @param {*} frame 
 * @this {toolbarController}
 */
toolbarController.prototype.refresh = function (frame) {
  if (!frame) {
    frame = this.view.frame
  }
  this.setFrame(frame,true)
  this.setToolbarLayout()
}

toolbarController.prototype.setToolbarLayout = function () {
  if (this.onAnimate) {
    return
  }
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
toolbarController.prototype.customActionByDes = async function (button,des,checkSubscribe = true) {//这里actionName指的是key
  try {
    if (checkSubscribe && !toolbarUtils.checkSubscribe(true)) {
      return
    }
    // MNUtil.copyJSON(des)
    if (this.customActionMenu(button,des)) {
      // MNUtil.showHUD("reject")
      //如果返回true则表示菜单弹出已执行，则不再执行下面的代码
      return
    }
    let targetNotes = []
    let success = true
    let focusNote = MNNote.getFocusNote() ? MNNote.getFocusNote():undefined
    let focusNotes = MNNote.getFocusNotes() ? MNNote.getFocusNotes():undefined
    // MNUtil.showHUD("message"+(focusNote instanceof MNNote))
    let color,config
    let targetNoteId
    let parentNote
    let focusNoteType
    let focusNoteColorIndex = focusNote? focusNote.note.colorIndex : 0
    let copyTitlePart
    let userInput
    let bibTextIndex, bibContent
    let bibContentArr = []
    let currentDocmd5
    let path, UTI
    let currentDocName
    let pinnedNote
    let htmlSetting = [
      { title: "= 同级", type: "sameLevel" },
      { title: "⬇️ 下一级", type: "nextLevel" },
      { title: "⬆️ 上一级", type: "lastLevel" },
      { title: "🏆 最高级", type: "topestLevel" },
      { title: "goal: 🎯", type: "goal" },
      { title: "step: 🚩", type: "step" },
      { title: "point: ▸", type: "point" },
      { title: "subpoint: ▪", type: "subpoint" },
      { title: "subsubpoint: •", type: "subsubpoint" },
      { title: "key: 🔑", type: "key" },
      { title: "question: ❓", type: "question" },
      { title: "remark: 📝", type: "remark" },
      { title: "alert: ⚠️", type: "alert" },
      { title: "danger: ❗❗❗", type: "danger" },
      { title: "none", type: "none" }
    ];
    let htmlSettingTitles = htmlSetting.map(config => config.title);
    let levelHtmlSetting = [
      { title: "goal: 🎯", type: "goal" },
      { title: "step: 🚩", type: "step" },
      { title: "point: ▸", type: "point" },
      { title: "subpoint: ▪", type: "subpoint" },
      { title: "subsubpoint: •", type: "subsubpoint" },
    ];
    let levelHtmlSettingTitles = levelHtmlSetting.map(config => config.title);
    switch (des.action) {
      case "undo":
        UndoManager.sharedInstance().undo()
        MNUtil.app.refreshAfterDBChanged(MNUtil.currentNotebookId)
        await MNUtil.delay(0.1)
        break;
      case "redo":
        UndoManager.sharedInstance().redo()
        MNUtil.app.refreshAfterDBChanged(MNUtil.currentNotebookId)
        await MNUtil.delay(0.1)
        break;
      case "copy":
        if (des.target || des.content) {
          success = await toolbarUtils.copy(des)
        }else{
          success = toolbarUtils.smartCopy()
        }
        break;
      case "paste":
        toolbarUtils.paste(des)
        await MNUtil.delay(0.1)
        break;
      case "markdown2Mindmap":
        toolbarUtils.markdown2Mindmap(des)
        break;
      case "webSearch":
        await toolbarUtils.webSearch(des)
        break;
      case "setTimer":
        toolbarUtils.setTimer(des)
        break;
      case "switchTitleOrExcerpt":
        toolbarUtils.switchTitleOrExcerpt()
        await MNUtil.delay(0.1)
        break;
      case "cloneAndMerge":
      try {
        if (!des.hideMessage) {
          MNUtil.showHUD("cloneAndMerge")
        }
        targetNoteId= MNUtil.getNoteIdByURL(des.target)
        MNUtil.undoGrouping(()=>{
          try {
          MNNote.getFocusNotes().forEach(focusNote=>{
            toolbarUtils.cloneAndMerge(focusNote.note, targetNoteId)
          })
          } catch (error) {
            MNUtil.showHUD(error)
          }
        })
        await MNUtil.delay(0.1)
      } catch (error) {
        MNUtil.showHUD(error)
      }
        break;
      case "cloneAsChildNote":
        if (!des.hideMessage) {
          MNUtil.showHUD("cloneAsChildNote")
        }
        targetNoteId= MNUtil.getNoteIdByURL(des.target)
        MNUtil.undoGrouping(()=>{
          MNNote.getFocusNotes().forEach(focusNote=>{
            toolbarUtils.cloneAsChildNote(focusNote, targetNoteId)
          })
        })
        await MNUtil.delay(0.1)
        break;
      case "addTags":
        toolbarUtils.addTags(des)
        break;
      case "removeTags":
        toolbarUtils.removeTags(des)
        break;
      case "ocr":
        await toolbarUtils.ocr(des,button)
        break;
      case "searchInDict":
        // MNUtil.showHUD("searchInDict")
        toolbarUtils.searchInDict(des,button)
        break;
      case "insertSnippet":
        success = toolbarUtils.insertSnippet(des)
        break;
      case "importDoc":
        let docPath = await MNUtil.importFile(["com.adobe.pdf","public.text"])
        if (docPath.endsWith(".pdf")) {
          let docMd5 = MNUtil.importDocument(docPath)
          MNUtil.openDoc(docMd5)
        }else{
          let fileName = MNUtil.getFileName(docPath).split(".")[0]
          let content = MNUtil.readText(docPath)
          if (focusNote) {
            let child = focusNote.createChildNote({title:fileName,excerptText:content,excerptTextMarkdown:true})
            await child.focusInMindMap(0.5)
          }else{
            let newNote = toolbarUtils.newNoteInCurrentChildMap({title:fileName,excerptText:content,excerptTextMarkdown:true})
            await newNote.focusInMindMap(0.5)
          }
        }
        break;
      case "noteHighlight":
        let newNote = await toolbarUtils.noteHighlight(des)
        if (newNote && newNote.notebookId === MNUtil.currentNotebookId) {
          let focusInFloatWindowForAllDocMode = des.focusInFloatWindowForAllDocMode ?? false
          let delay = des.focusAfterDelay ?? 0.5
          if (MNUtil.studyController.docMapSplitMode === 2) {
            if (focusInFloatWindowForAllDocMode) {
              await newNote.focusInFloatMindMap(delay)
            }
          }
        }
        // if ("parentNote" in des) {
        //   await MNUtil.delay(5)
        //   let parentNote = MNNote.new(des.parentNote)
        //   parentNote.focusInMindMap()
        //   MNUtil.showHUD("as childNote of "+parentNote.noteId)
        //   MNUtil.undoGrouping(()=>{
        //     parentNote.addChild(newNote)
        //   })
        // }

        break;
      case "moveNote":
        toolbarUtils.moveNote(des)
        await MNUtil.delay(0.1)
        break;
      case "addChildNote"://不支持多选
        if (!des.hideMessage) {
          MNUtil.showHUD("addChildNote")
        }
        config = {}
        if (des.title) {
          config.title = toolbarUtils.detectAndReplace(des.title)
        }
        if (des.content) {
          config.content = toolbarUtils.detectAndReplace(des.content)
        }
        if (des.markdown) {
          config.markdown = des.content
        }
        color = undefined
        if (des.color) {
          switch (des.color) {
            case "{{parent}}":
            case "parent":
              color = focusNote.colorIndex
              break;
            default:
              if (typeof des.color === "number") {
                color = des.color
              }else{
                color = parseInt(des.color.trim())
              }
              break;
          }
          config.color = color
        }
        let childNote = focusNote.createChildNote(config)
        await childNote.focusInMindMap(0.5)
        break;
      case "file2base64":
        let file = await MNUtil.importFile(["public.data"])
        let data = NSData.dataWithContentsOfFile(file)
        MNUtil.copy(data.base64Encoding())
        break;
      case "addBrotherNote":
        if (!des.hideMessage) {
          MNUtil.showHUD("addBrotherNote")
        }
        config = {}
        if (des.title) {
          config.title = toolbarUtils.detectAndReplace(des.title)
        }
        if (des.content) {
          config.content = toolbarUtils.detectAndReplace(des.content)
        }
        if (des.markdown) {
          config.markdown = des.markdown
        }
        color = undefined
        if (des.color) {
          switch (des.color) {
            case "{{parent}}":
            case "parent":
              color = focusNote.parentNote.colorIndex
              break;
            case "{{current}}":
            case "current":
              color = focusNote.colorIndex
              break;
            default:
              if (typeof des.color === "number") {
                color = des.color
              }else{
                color = parseInt(des.color.trim())
              }
              break;
          }
          config.color = color
        }
        let brotherNote = focusNote.createBrotherNote(config)
        await brotherNote.focusInMindMap(0.5)
        break;

      case "crash":
        if (!des.hideMessage) {
          MNUtil.showHUD("crash")
        }
        MNUtil.studyView.frame = {x:undefined}
        await MNUtil.delay(0.1)
        break;
      case "addComment":
        if (!des.hideMessage) {
          MNUtil.showHUD("addComment")
        }
        let comment = des.content?.trim()
        if (comment) {
          let focusNotes = MNNote.getFocusNotes()
          let markdown = des.markdown ?? true
          let commentIndex = des.index ?? 999
          // MNUtil.copy("text"+focusNotes.length)
          MNUtil.undoGrouping(()=>{
            if (markdown) {
              focusNotes.forEach(note => {
                let replacedText = toolbarUtils.detectAndReplace(comment,undefined,note)
                if (replacedText.trim()) {
                  note.appendMarkdownComment(replacedText,commentIndex)
                }
              })
            }else{
              focusNotes.forEach(note => {
                let replacedText = toolbarUtils.detectAndReplace(comment,undefined,note)
                if (replacedText.trim()) {
                  note.appendTextComment(replacedText,commentIndex)
                }
              })
            }
          })
        }
        await MNUtil.delay(0.1)
        break;
      case "addMarkdownLink":
        if (!des.hideMessage) {
          MNUtil.showHUD("addMarkdownLink")
        }
        let title = des.title
        let link = des.link
        if (title && link) {
          let replacedTitle = toolbarUtils.detectAndReplace(title)
          let replacedLink = toolbarUtils.detectAndReplace(link)
          // MNUtil.copy("text"+focusNotes.length)
          MNUtil.undoGrouping(()=>{
            focusNote.appendMarkdownComment(`[${replacedTitle}](${replacedLink})`)
          })
        }
        await MNUtil.delay(0.1)
        break;
      case "removeComment":
        if (!des.hideMessage) {
          MNUtil.showHUD("removeComment")
        }
        toolbarUtils.removeComment(des)
        await MNUtil.delay(0.1)
        break;
      case "moveComment":
        if (!des.hideMessage) {
          MNUtil.showHUD("moveComment")
        }
        toolbarUtils.moveComment(des)
        await MNUtil.delay(0.1)
        break;
      case "link":
        let linkType = des.linkType ?? "Both"
        let targetUrl = des.target
        if (targetUrl === "{{clipboardText}}") {
          targetUrl = MNUtil.clipboardText
        }
        // MNUtil.showHUD(targetUrl)
        let targetNote = MNNote.new(targetUrl)
        MNUtil.undoGrouping(()=>{
          if (targetNote) {
            MNNote.getFocusNotes().forEach(note=>{
              note.appendNoteLink(targetNote,linkType)
            })
          }else{
            MNUtil.showHUD("Invalid target note!")
          }
        })
        await MNUtil.delay(0.1)
        break;
      case "clearContent":
        toolbarUtils.clearContent(des)
        break;
      case "setContent":
          toolbarUtils.setContent(des)
        break;
      case "showInFloatWindow":
        toolbarUtils.showInFloatWindow(des)
        // MNUtil.copy(focusNote.noteId)
        await MNUtil.delay(0.1)
        break;
      case "openURL":
        if (des.url) {
          let url = toolbarUtils.detectAndReplace(des.url)
          MNUtil.openURL(url)
          break;
          // MNUtil.showHUD("message")
        }
        MNUtil.showHUD("No valid argument!")
        break;
      case "command":
        let urlPre = "marginnote4app://command/"
        let delay = des.commandDelay ?? 0.1
        if (des.commands) {
          for (let i = 0; i < des.commands.length; i++) {
            const command = des.commands[i];
            let url = urlPre+command
            MNUtil.openURL(url)
            await MNUtil.delay(delay)
          }
          break
        }
        if (des.command) {
          let url = urlPre+des.command
          MNUtil.openURL(url)
          break
        }
        MNUtil.showHUD("No valid argument!")
        break
      case "shortcut":
        let shortcutName = des.name
        let url = "shortcuts://run-shortcut?name="+encodeURIComponent(shortcutName)
        if (des.input) {
          url = url+"&input="+encodeURIComponent(des.input)
        }
        if (des.text) {
          let text = toolbarUtils.detectAndReplace(des.text)
          url = url+"&text="+encodeURIComponent(text)
        }
        MNUtil.openURL(url)
        break
      case "toggleTextFirst":
        if (!des.hideMessage) {
          MNUtil.showHUD("toggleTextFirst")
        }
        targetNotes = toolbarUtils.getNotesByRange(des.range ?? "currentNotes")
        MNUtil.undoGrouping(()=>{
          targetNotes.forEach(note=>{
            note.textFirst = !note.textFirst
          })
        })
        await MNUtil.delay(0.1)
        break
      case "toggleMarkdown":
        if (!des.hideMessage) {
          MNUtil.showHUD("toggleMarkdown")
        }
        targetNotes = toolbarUtils.getNotesByRange(des.range ?? "currentNotes")
        MNUtil.undoGrouping(()=>{
          targetNotes.forEach(note=>{
            note.excerptTextMarkdown = !note.excerptTextMarkdown
          })
        })
        await MNUtil.delay(0.1)
        break
      case "toggleSidebar":
        toolbarUtils.toggleSidebar(des)
        break;
      case "replace":
        toolbarUtils.replaceAction(des)
        break;
      case "mergeText":
        let noteRange = des.range ?? "currentNotes"
        targetNotes = toolbarUtils.getNotesByRange(noteRange)
        MNUtil.undoGrouping(()=>{
          targetNotes.forEach((note,index)=>{
            let mergedText = toolbarUtils.getMergedText(note, des, index)
            if (mergedText === undefined) {
              return new Promise((resolve, reject) => {
                resolve()
              })
            }
            switch (des.target) {
              case "excerptText":
                note.excerptText = mergedText
                if ("markdown" in des) {
                  note.excerptTextMarkdown = des.markdown
                }
                break;
              case "title":
                note.noteTitle = mergedText
                break;
              case "newComment":
                if ("markdown" in des && des.markdown) {
                  note.appendMarkdownComment(mergedText)
                }else{
                  note.appendTextComment(mergedText)
                }
                break;
              case "clipboard":
                MNUtil.copy(mergedText)
                break;
              default:
                break;
            }
          })
        })
        if (toolbarUtils.sourceToRemove.length) {
          MNUtil.undoGrouping(()=>{
            // MNUtil.showHUD("remove")
            toolbarUtils.sourceToRemove.forEach(note=>{
              note.excerptText = ""
            })
            MNUtil.delay(1).then(()=>{
              toolbarUtils.sourceToRemove = []
            })
          })
        }
        if (Object.keys(toolbarUtils.commentToRemove).length) {
          MNUtil.undoGrouping(()=>{
            let commentInfos = Object.keys(toolbarUtils.commentToRemove)
            commentInfos.forEach(noteId => {
              let note = MNNote.new(noteId)
              let sortedIndex = MNUtil.sort(toolbarUtils.commentToRemove[noteId],"decrement")
              sortedIndex.forEach(commentIndex=>{
                if (commentIndex < 0) {
                  note.noteTitle = ""
                }else{
                  note.removeCommentByIndex(commentIndex)
                }
              })
            })
            MNUtil.delay(1).then(()=>{
              toolbarUtils.commentToRemove = {}
            })
          })
        }
        await MNUtil.delay(0.1)
        break;
      /* 夏大鱼羊定制 - start */
      case "test":
        const name = "鱼羊";
        // MNUtil.showHUD(Pinyin.pinyin(name))
        MNUtil.showHUD(toolbarUtils.getAbbreviationsOfName("Kangwei Xia"))
        break;
      // case "":
      //   break;
      // case "":
      //   UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      //     "输入文献号",
      //     "",
      //     2,
      //     "取消",
      //     ["确定"],
      //     (alert, buttonIndex) => {
      //       try {
      //         MNUtil.undoGrouping(()=>{
      //           let refNum = alert.textFieldAtIndex(0).text;
    //             if (buttonIndex == 1) {
                  
    //             }
      //         })
      //       } catch (error) {
      //         MNUtil.showHUD(error);
      //       }
      //     }
      //   )
      //   break;
      /**
       * 更新归类卡片情况
       */
      case "getNewClassificationInformation":
        MNUtil.undoGrouping(()=>{
          try {
            focusNote.toBeClassificationInfoNote()
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
      /**
       * 把证明的内容移到最下方
       */
      case "moveProofDown":
        MNUtil.undoGrouping(()=>{
          try {
            focusNote.moveProofDown()
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * MN 原生的一些功能
       */
      case "MNFocusNote": // 焦点
        MNUtil.excuteCommand("FocusNote")
        break;
      case "MNEditDeleteNote": // 删除卡片
        let confirm = await MNUtil.confirm("删除卡片", "确定要删除这张卡片吗？")
        if (confirm) {
          MNUtil.excuteCommand("EditDeleteNote")
        }
        break;
      /**
       * 移动摘录
       */
      case "moveToExcerptPartTop":
        MNUtil.undoGrouping(()=>{
          try {
            let newContentsIndexArr = focusNote.getNewContentIndexArr()
            focusNote.moveCommentsByIndexArrTo(newContentsIndexArr, "excerpt", false)
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "moveToExcerptPartBottom":
        MNUtil.undoGrouping(()=>{
          try {
            let newContentsIndexArr = focusNote.getNewContentIndexArr()
            focusNote.moveCommentsByIndexArrTo(newContentsIndexArr, "excerpt")
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 进度标记
       */
      case "toBeProgressNote":
        MNUtil.undoGrouping(()=>{
          try {
            focusNote.toBeProgressNote()
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
      /**
       * 卡片独立出来
       */
      case "toBeIndependent":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              focusNote.toBeIndependent()
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
        * 移动卡片到「输入」区
        */
      case "moveToInput":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              focusNote.moveToInput()
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
        * 移动卡片到「备考」区
        */
      case "moveToPreparationForExam":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              focusNote.moveToPreparationForExam()
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 移动卡片到「内化」区
       */
      case "moveToInternalize":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              focusNote.moveToInternalize()
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 移动卡片到「待归类」区
       */
      case "moveToBeClassified":
        MNUtil.undoGrouping(()=>{
          try {
            if (MNUtil.currentNotebookId == "A07420C1-661A-4C7D-BA06-C7035C18DA74") {
              UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                "移动到「待归类」区",
                "请选择科目",
                0,
                "取消",
                [
                  "数学基础",
                  "泛函分析",
                  "实分析",
                  "复分析",
                  "数学分析",
                  "高等代数"
                ],
                (alert, buttonIndex) => {
                  let targetNoteId
                  switch (buttonIndex) {
                    case 1: // 数学基础
                      targetNoteId = "EF75F2C8-2655-4BAD-92E1-C9C11D1A37C3"
                      break;
                    case 2: // 泛函分析
                      targetNoteId = "23E0024A-F2C9-4E45-9F64-86DD30C0D497"
                      break;
                    case 3: // 实分析
                      targetNoteId = "97672F06-1C40-475D-8F44-16759CCADA8C"
                      break;
                    case 4: // 复分析
                      targetNoteId = "16920F8B-700E-4BA6-A7EE-F887F28A502B"
                      break;
                    case 5: // 数学分析
                      targetNoteId = "9AAE346D-D7ED-472E-9D30-A7E1DE843F83"
                      break;
                    case 6: // 高等代数
                      targetNoteId = "B9B3FB57-AAC0-4282-9BFE-3EF008EA2085"
                      break;
                  }
                  MNUtil.undoGrouping(()=>{
                    focusNotes.forEach(focusNote=>{
                      focusNote.moveToBeClassified(targetNoteId)
                    })
                  })
                }
              )
            } else {
              focusNotes.forEach(focusNote=>{
                focusNote.moveToBeClassified()
              })
            }
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 通过弹窗选择，移动最后三个评论到指定位置
       */
      case "moveLastThreeCommentByPopupTo":
        MNUtil.undoGrouping(()=>{
          try {
            let newContentsIndexArr = [
              focusNote.comments.length-3,
              focusNote.comments.length-2,
              focusNote.comments.length-1
            ]
            focusNote.moveCommentsByIndexArrAndButtonTo(newContentsIndexArr, "移动「最后3️⃣条」评论到", "")
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 通过弹窗选择，移动最后两个评论到指定位置
       */
      case "moveLastTwoCommentByPopupTo":
        MNUtil.undoGrouping(()=>{
          try {
            let newContentsIndexArr = [
              focusNote.comments.length-2,
              focusNote.comments.length-1
            ]
            focusNote.moveCommentsByIndexArrAndButtonTo(newContentsIndexArr, "移动「最后2️⃣条」评论到", "")
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 通过弹窗选择，移动最后一个评论到指定位置
       */
      case "moveLastOneCommentByPopupTo":
        MNUtil.undoGrouping(()=>{
          try {
            let newContentsIndexArr = [
              focusNote.comments.length-1
            ]
            focusNote.moveCommentsByIndexArrAndButtonTo(newContentsIndexArr, "移动「最后1️⃣条」评论到", "")
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 自动识别新内容，并通过弹窗选择，移动到指定位置
       */
      case "moveNewContentsByPopupTo":  // new
        MNUtil.undoGrouping(()=>{
          try {
            focusNote.moveCommentsByIndexArrAndButtonTo(focusNote.getNewContentIndexArr(), "移动「新增」评论到", "")
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
        
      case "AddToReview":  // new
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            focusNote.addToReview()
          })
        })
        break;
      /**
       * 删除评论
       */
      case "deleteCommentsByPopup": // new
        MNUtil.undoGrouping(()=>{
          try {
            focusNote.deleteCommentsByPopup()
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 删除某些评论后移动摘录到摘录区底部
       */
      case "deleteCommentsByPopupAndMoveNewContentToExcerptAreaBottom":
        MNUtil.undoGrouping(()=>{
          try {
            focusNote.deleteCommentsByPopupAndMoveNewContentTo("excerpt")
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 删除某些评论后移动摘录到摘录区顶部
       */
      case "deleteCommentsByPopupAndMoveNewContentToExcerptAreaTop":
        MNUtil.undoGrouping(()=>{
          try {
            focusNote.deleteCommentsByPopupAndMoveNewContentTo("excerpt", false)
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 增加 Html 语法的 Markdown 评论
       */
      case "addHtmlMarkdownComment":
        MNUtil.undoGrouping(()=>{
          try {
            UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
              "输入评论内容",
              "然后选择 Html 类型",
              2,
              "取消",
              htmlSettingTitles,
              (alert, buttonIndex) => {
                MNUtil.undoGrouping(()=>{
                  const inputCommentText = alert.textFieldAtIndex(0).text;
                  // 按钮索引从1开始（0是取消按钮）
                  const selectedIndex = buttonIndex - 1;
                  if (selectedIndex >= 0 && selectedIndex < htmlSetting.length) {
                    switch (htmlSetting[selectedIndex].type) {
                      case "sameLevel":
                        HtmlMarkdownUtils.autoAddLevelHtmlMDComment(focusNote, inputCommentText, "same")
                        break;
                      case "nextLevel":
                        HtmlMarkdownUtils.autoAddLevelHtmlMDComment(focusNote, inputCommentText, "next")
                        break;
                      case "lastLevel":
                        HtmlMarkdownUtils.autoAddLevelHtmlMDComment(focusNote, inputCommentText, "last")
                        break;
                      case "topestLevel":
                        HtmlMarkdownUtils.autoAddLevelHtmlMDComment(focusNote, inputCommentText, "topest")
                        break;
                      default:
                        focusNote.appendMarkdownComment(HtmlMarkdownUtils.createHtmlMarkdownText(inputCommentText, htmlSetting[selectedIndex].type));
                        break;
                    }
                  }
                })
              }
            );
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 复制批量选中的卡片的 ID 到剪贴板
       */
      case "copyFocusNotesIdArr":
        MNUtil.undoGrouping(()=>{
          try {
            if (focusNotes.length == 1) {
              MNUtil.copy(focusNote.noteId)
              MNUtil.showHUD(focusNote.noteId)
            } else {
              let idsArr = toolbarUtils.getNoteIdArr(focusNotes)
              MNUtil.copy(idsArr)
              MNUtil.showHUD(idsArr)
            }
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 复制批量选中的卡片的 URL 到剪贴板
       */
      case "copyFocusNotesURLArr":    // new
        MNUtil.undoGrouping(()=>{
          try {
            let idsArr = toolbarUtils.getNoteURLArr(focusNotes)
            MNUtil.copy(idsArr)
            MNUtil.showHUD(idsArr)
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "copyMarkdownVersionFocusNoteURL":
        MNUtil.undoGrouping(()=>{
          try {
            UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
              "复制 Markdown 类型链接",
              "输入引用词",
              2,
              "取消",
              ["确定"],
              (alert, buttonIndex) => {
                MNUtil.undoGrouping(()=>{
                  if (buttonIndex == 1) {
                    let refContent = alert.textFieldAtIndex(0).text?alert.textFieldAtIndex(0).text:focusNote.getFirstTitleLinkWord()
                    let mdLink = "["+ refContent +"](" + focusNote.noteURL + ")"
                    MNUtil.copy(mdLink)
                    MNUtil.showHUD(mdLink)
                  }
                })
              }
            );
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "generateCustomTitleLink":
        MNUtil.undoGrouping(()=>{
          toolbarUtils.generateCustomTitleLink()
        })
        break;
      case "generateCustomTitleLinkFromFocusNote":
        MNUtil.undoGrouping(()=>{
          toolbarUtils.generateCustomTitleLinkFromFocusNote(focusNote)
        })
        break;
      case "pasteNoteAsChildNote":
        MNUtil.undoGrouping(()=>{
          try {
            toolbarUtils.pasteNoteAsChildNote(focusNote)
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "moveLastCommentToProofStart":
        MNUtil.undoGrouping(()=>{
          try {
            let targetIndex = toolbarUtils.getProofHtmlCommentIndex(focusNote) + 1
            focusNote.moveComment(focusNote.comments.length-1,targetIndex)
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "moveProofToStart":
        MNUtil.undoGrouping(()=>{
          try {
            let targetIndex = toolbarUtils.getProofHtmlCommentIndex(focusNote) + 1
            toolbarUtils.moveProofToIndex(focusNote, targetIndex)
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "renewProofContentPoints":
        MNUtil.undoGrouping(()=>{
          try {
            UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
              "选择“-“评论修改的类型",
              "",
              0,
              "取消",
              htmlSettingTitles,
              (alert, buttonIndex) => {
                try {
                  MNUtil.undoGrouping(() => {
                    // 按钮索引从1开始（0是取消按钮）
                    const selectedIndex = buttonIndex - 1;
                    
                    if (selectedIndex >= 0 && selectedIndex < htmlSetting.length) {
                      const selectedType = htmlSetting[selectedIndex].type;
                      // focusNote.mergeInto(focusNote.parentNote, selectedType)
                      focusNote.renewProofContentPointsToHtmlType(selectedType)
                    }
                  });
                } catch (error) {
                  MNUtil.showHUD(error);
                }
              }
            );
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "renewContentPointsToHtmlType":
        MNUtil.undoGrouping(()=>{
          try {
            UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
              "选择“-“评论修改的类型",
              "",
              0,
              "取消",
              htmlSettingTitles,
              (alert, buttonIndex) => {
                try {
                  MNUtil.undoGrouping(() => {
                    // 按钮索引从1开始（0是取消按钮）
                    const selectedIndex = buttonIndex - 1;
                    
                    if (selectedIndex >= 0 && selectedIndex < htmlSetting.length) {
                      const selectedType = htmlSetting[selectedIndex].type;
                      // focusNote.mergeInto(focusNote.parentNote, selectedType)
                      focusNote.renewContentPointsToHtmlType(selectedType)
                    }
                  });
                } catch (error) {
                  MNUtil.showHUD(error);
                }
              }
            );
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "htmlMDCommentsToNextLevelType":
        MNUtil.undoGrouping(()=>{
          try {
            let commentsObjArr = HtmlMarkdownUtils.getHtmlMDCommentIndexAndTypeObjArr(focusNote)
            let comments = focusNote.MNComments
            commentsObjArr.forEach((commentObj) => {
              let commentType = commentObj.type
              if (HtmlMarkdownUtils.isLevelType(commentType)) { // 防止对其它类型进行处理
                let comment = comments[commentObj.index]
                let commentContent = HtmlMarkdownUtils.getSpanTextContent(comment)
                let nextCommentType = HtmlMarkdownUtils.getSpanNextLevelType(commentType)
                comment.text = HtmlMarkdownUtils.createHtmlMarkdownText(commentContent, nextCommentType)
              }
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "htmlMDCommentsToLastLevelType":
        MNUtil.undoGrouping(()=>{
          try {
            let commentsObjArr = HtmlMarkdownUtils.getHtmlMDCommentIndexAndTypeObjArr(focusNote)
            let comments = focusNote.MNComments
            commentsObjArr.forEach((commentObj) => {
              let commentType = commentObj.type
              if (HtmlMarkdownUtils.isLevelType(commentType)) {
                let comment = comments[commentObj.index]
                let commentContent = HtmlMarkdownUtils.getSpanTextContent(comment)
                let lastCommentType = HtmlMarkdownUtils.getSpanLastLevelType(commentType)
                comment.text = HtmlMarkdownUtils.createHtmlMarkdownText(commentContent, lastCommentType)
              }
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "renewProofContentPointsToSubpointType":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(
              focusNote => {
                focusNote.renewProofContentPointsToHtmlType("subpoint")
              }
            )
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "linkRemoveDuplicatesAfterApplication":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(
              focusNote=>{
                let applicationHtmlCommentIndex = Math.max(
                  focusNote.getIncludingCommentIndex("应用：", true),
                  focusNote.getIncludingCommentIndex("的应用")
                )
                toolbarUtils.linkRemoveDuplicatesAfterIndex(focusNote,applicationHtmlCommentIndex)
              }
            )
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "moveOneCommentToLinkNote":
        MNUtil.undoGrouping(()=>{
          try {
            let proofHtmlCommentIndex = Math.max(
              focusNote.getCommentIndex("原理：", true),
              focusNote.getCommentIndex("反例及证明：", true),
              focusNote.getCommentIndex("证明：", true)
            )
            let targetIndex = (proofHtmlCommentIndex == -1)?focusNote.getCommentIndex("相关思考：",true):proofHtmlCommentIndex
            focusNote.moveComment(focusNote.comments.length-1,targetIndex)
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "htmlCommentToProofTop":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入注释",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let comment = alert.textFieldAtIndex(0).text;
                if (buttonIndex == 1) {
                  let targetIndex = focusNote.getCommentIndex("证明：",true) + 1
                  focusNote.appendMarkdownComment(
                    '<span style="font-weight: bold; color: #1A6584; background-color: #e8e9eb; font-size: 1.18em; padding-top: 5px; padding-bottom: 5px">'+ comment +'</span>',
                    targetIndex
                  )
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "htmlCommentToProofFromClipboard":
        MNUtil.undoGrouping(()=>{
          try {
            let dotCommentIndex = (focusNote.getCommentIndex("-") == -1)?focusNote.getCommentIndex("- "):focusNote.getCommentIndex("-")
            if (dotCommentIndex !== -1) {
              focusNote.removeCommentByIndex(dotCommentIndex)
              focusNote.appendMarkdownComment(
                '<span style="font-weight: bold; color: #1A6584; background-color: #e8e9eb; font-size: 1.18em; padding-top: 5px; padding-bottom: 5px">'+ MNUtil.clipboardText +'</span>'
                , dotCommentIndex
              )
            } else {
              focusNote.appendMarkdownComment(
                '<span style="font-weight: bold; color: #1A6584; background-color: #e8e9eb; font-size: 1.18em; padding-top: 5px; padding-bottom: 5px">'+ MNUtil.clipboardText +'</span>'
                , focusNote.getCommentIndex("相关思考：",true)
              )
            }
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "htmlCommentToBottom":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入注释",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let comment = alert.textFieldAtIndex(0).text;
                if (buttonIndex == 1) {
                  focusNote.appendMarkdownComment(
                    '<span style="font-weight: bold; color: #1A6584; background-color: #e8e9eb; font-size: 1.18em; padding-top: 5px; padding-bottom: 5px">'+ comment +'</span>'
                  )
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "htmlCommentToProofBottom":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入注释",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let comment = alert.textFieldAtIndex(0).text;
                if (buttonIndex == 1) {
                  let targetIndex = focusNote.getCommentIndex("相关思考：",true)
                  focusNote.appendMarkdownComment(
                    '<span style="font-weight: bold; color: #1A6584; background-color: #e8e9eb; font-size: 1.18em; padding-top: 5px; padding-bottom: 5px">'+ comment +'</span>',
                    targetIndex
                  )
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "addOldNoteKeyword":
        MNUtil.undoGrouping(()=>{
          let keywordsHtmlCommentIndex = focusNote.getCommentIndex("关键词：",true)
          focusNote.appendMarkdownComment("-",keywordsHtmlCommentIndex+1)
        })
        break;
      case "addProofToStartFromClipboard":
        try {
          MNUtil.undoGrouping(()=>{
            MNUtil.excuteCommand("EditPaste")
            MNUtil.delay(0.1).then(()=>{
              let targetIndex = toolbarUtils.getProofHtmlCommentIndex(focusNote) + 1
              focusNote.moveComment(focusNote.comments.length-1,targetIndex)
            })
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "addProofFromClipboard":
        try {
          MNUtil.undoGrouping(()=>{
            MNUtil.excuteCommand("EditPaste")
            MNUtil.delay(0.1).then(()=>{
              toolbarUtils.moveLastCommentToProof(focusNote)
            })
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "selectionTextHandleSpaces":
        MNUtil.showHUD(Pangu.spacing(MNUtil.selectionText))
        MNUtil.copy(Pangu.spacing(MNUtil.selectionText))
        break;
      case "copiedTextHandleSpaces":
        MNUtil.showHUD(Pangu.spacing(MNUtil.clipboardText))
        MNUtil.copy(Pangu.spacing(MNUtil.clipboardText))
        break;
      case "handleTitleSpaces":
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(
              focusNote => {
                focusNote.noteTitle = Pangu.spacing(focusNote.noteTitle)
                focusNote.refresh()
                focusNote.refreshAll()
              }
            )
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "focusInMindMap":
        MNUtil.undoGrouping(()=>{
          focusNote.focusInMindMap()
        })
        break;
      case "focusInFloatMindMap":
        MNUtil.undoGrouping(()=>{
          focusNote.focusInFloatMindMap()
        })
        break;
      case "selectionTextToLowerCase":
        MNUtil.showHUD(MNUtil.selectionText.toLowerCase())
        MNUtil.copy(MNUtil.selectionText.toLowerCase())
        break;
      case "selectionTextToTitleCase":
        MNUtil.showHUD(MNUtil.selectionText.toTitleCasePro())
        MNUtil.copy(MNUtil.selectionText.toTitleCasePro())
        break;
      case "copiedTextToTitleCase":
        MNUtil.showHUD(MNUtil.clipboardText.toTitleCasePro())
        MNUtil.copy(MNUtil.clipboardText.toTitleCasePro())
        break;
      case "copiedTextToLowerCase":
        MNUtil.showHUD(MNUtil.clipboardText.toLowerCase())
        MNUtil.copy(MNUtil.clipboardText.toLowerCase())
        break;
      case "proofAddMethodComment":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入方法数",
          "",
          2,
          "取消",
          ["确定"],
          (alertI, buttonIndexI) => {
            try {
              MNUtil.undoGrouping(()=>{
                let methodNum = alertI.textFieldAtIndex(0).text;
                let findMethod = false
                let methodIndex = -1
                if (buttonIndexI == 1) {
                  for (let i = 0; i < focusNote.comments.length; i++) {
                    let comment = focusNote.comments[i];
                    if (
                      comment.text &&
                      comment.text.startsWith("<span") &&
                      comment.text.includes("方法"+toolbarUtils.numberToChinese(methodNum))
                    ) {
                      methodIndex = i
                      findMethod = true
                      break
                    }
                  }
                  if (!findMethod) {
                    MNUtil.showHUD("没有此方法！")
                  } else {
                    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                      "输入此方法的注释",
                      "",
                      2,
                      "取消",
                      ["确定"],
                      (alert, buttonIndex) => {
                        try {
                          MNUtil.undoGrouping(()=>{
                            let methodComment = alert.textFieldAtIndex(0).text;
                            if (methodComment == "") {
                              methodComment = "- - - - - - - - - - - - - - -"
                            }
                            if (buttonIndex == 1) {
                              focusNote.removeCommentByIndex(methodIndex)
                              focusNote.appendMarkdownComment(
                                '<span style="font-weight: bold; color: #014f9c; background-color: #ecf5fc; font-size: 1.15em; padding-top: 5px; padding-bottom: 5px"> 方法'+ toolbarUtils.numberToChinese(methodNum) +'：'+ methodComment +'</span>',
                                methodIndex
                              )
                            }
                          })
                        } catch (error) {
                          MNUtil.showHUD(error);
                        }
                      }
                    )
                  }
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "proofAddNewAntiexampleWithComment":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入此反例的注释",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let antiexampleComment = alert.textFieldAtIndex(0).text;
                if (antiexampleComment == "") {
                  antiexampleComment = "- - - - - - - - - - - - - - -"
                }
                if (buttonIndex == 1) {
                  let antiexampleNum = 0
                  focusNote.comments.forEach(comment=>{
                    if (
                      comment.text &&
                      comment.text.startsWith("<span") &&
                      comment.text.includes("反例")
                    ) {
                      antiexampleNum++
                    }
                  })
                  let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：",true)
                  let proofHtmlCommentIndex = focusNote.getCommentIndex("证明：",true)
                  let targetIndex = (antiexampleNum == 0)?proofHtmlCommentIndex+1:thoughtHtmlCommentIndex
                  focusNote.appendMarkdownComment(
                    '<span style="font-weight: bold; color: #081F3C; background-color: #B9EDD0; font-size: 1.15em; padding-top: 5px; padding-bottom: 5px"> 反例'+ toolbarUtils.numberToChinese(antiexampleNum+1) +'：'+ antiexampleComment +'</span>',
                    targetIndex
                  )
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break
      case "proofAddNewMethodWithComment":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入此方法的注释",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let methodComment = alert.textFieldAtIndex(0).text;
                if (methodComment == "") {
                  methodComment = "- - - - - - - - - - - - - - -"
                }
                if (buttonIndex == 1) {
                  let methodNum = 0
                  focusNote.comments.forEach(comment=>{
                    if (
                      comment.text &&
                      comment.text.startsWith("<span") &&
                      comment.text.includes("方法")
                    ) {
                      methodNum++
                    }
                  })
                  let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：",true)
                  let proofHtmlCommentIndex = focusNote.getCommentIndex("证明：",true)
                  let targetIndex = (methodNum == 0)?proofHtmlCommentIndex+1:thoughtHtmlCommentIndex
                  focusNote.appendMarkdownComment(
                    '<span style="font-weight: bold; color: #081F3C; background-color: #B9EDD0; font-size: 1.15em; padding-top: 5px; padding-bottom: 5px"> 方法'+ toolbarUtils.numberToChinese(methodNum+1) +'：'+ methodComment +'</span>',
                    targetIndex
                  )
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break
      case "proofAddNewAntiexample":
        try {
          MNUtil.undoGrouping(()=>{
            let antiexampleNum = 0
            focusNote.comments.forEach(comment=>{
              if (
                comment.text &&
                comment.text.startsWith("<span") &&
                comment.text.includes("反例")
              ) {
                antiexampleNum++
              }
            })
            let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：",true)
            let proofHtmlCommentIndex = focusNote.getCommentIndex("证明：",true)
            let targetIndex = (antiexampleNum == 0)?proofHtmlCommentIndex+1:thoughtHtmlCommentIndex
            focusNote.appendMarkdownComment(
              '<span style="font-weight: bold; color: #081F3C; background-color: #B9EDD0; font-size: 1.15em; padding-top: 5px; padding-bottom: 5px"> 反例'+ toolbarUtils.numberToChinese(antiexampleNum+1) +'：- - - - - - - - - - - - - - - </span>',
              targetIndex
            )
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "proofAddNewMethod":
        try {
          MNUtil.undoGrouping(()=>{
            let methodNum = 0
            focusNote.comments.forEach(comment=>{
              if (
                comment.text &&
                comment.text.startsWith("<span") &&
                comment.text.includes("方法")
              ) {
                methodNum++
              }
            })
            let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：",true)
            let proofHtmlCommentIndex = focusNote.getCommentIndex("证明：",true)
            let targetIndex = (methodNum == 0)?proofHtmlCommentIndex+1:thoughtHtmlCommentIndex
            focusNote.appendMarkdownComment(
              '<span style="font-weight: bold; color: #081F3C; background-color: #B9EDD0; font-size: 1.15em; padding-top: 5px; padding-bottom: 5px"> 方法'+ toolbarUtils.numberToChinese(methodNum+1) +'：- - - - - - - - - - - - - - - </span>',
              targetIndex
            )
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "renewLinksBetweenClassificationNoteAndKnowledegeNote":
        try {
          toolbarUtils.renewLinksBetweenClassificationNoteAndKnowledegeNote(focusNote)
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "referenceRefByRefNumAddFocusInFloatMindMap":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入文献号",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let refNum = alert.textFieldAtIndex(0).text;
                if (buttonIndex == 1) {
                  let refNote = toolbarUtils.referenceRefByRefNum(focusNote, refNum)[0]
                  let classificationNote = toolbarUtils.referenceRefByRefNum(focusNote, refNum)[1]
                  classificationNote.addChild(refNote.note)
                  refNote.focusInFloatMindMap(0.3)
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceRefByRefNumAndFocusInMindMap":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入文献号",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let refNum = alert.textFieldAtIndex(0).text;
                if (buttonIndex == 1) {
                  let refNote = toolbarUtils.referenceRefByRefNum(focusNote, refNum)[0]
                  let classificationNote = toolbarUtils.referenceRefByRefNum(focusNote, refNum)[1]
                  classificationNote.addChild(refNote.note)
                  refNote.focusInMindMap(0.3)
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceRefByRefNum":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入文献号",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let refNum = alert.textFieldAtIndex(0).text;
                if (buttonIndex == 1) {
                  toolbarUtils.referenceRefByRefNum(focusNote, refNum)
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;

      /**
       * 【文献】选中参考文献摘录后增加「具体引用情况」汇总卡片
       * 
       * 参考文献摘录：[12] Kangwei Xia. Functional Analysis. 2025.
       * 
       * 变量说明：
       * refNum：参考文献摘录对应的摘录的文献号 12
       * currentDocmd5: 当前文档模式打开的文档的 md5
       * findClassificationNote：是否已经有「具体引用情况」汇总卡片了
       * classificationNote：「具体引用情况」汇总卡片
       * refSourceNoteId，refSourceNote，refSourceNoteTitle,refSourceNoteAuthor：当前文档的 ID，note，title 和第一个作者，i.e. 「谁」引用的
       * refedNoteId，refedNote，refedNoteTitle,refedNoteAuthor：被引用的文档的 ID，note，title 和第一个作者，i.e. 谁「被」引用
       * refedNoteIdIndexInClassificationNote：被引用的卡片的链接在「具体引用情况」汇总卡片中的 Index
       * refSourceNoteIdIndexInClassificationNote：引用主体的卡片的链接在「具体引用情况」汇总卡片中的 Index
       * classificationNoteIdIndexInRefSourceNote：「具体引用情况」汇总卡片在引用主体文献卡片中的链接评论 Index
       * classificationNoteIdIndexInRefedNote：「具体引用情况」汇总卡片在被引用文献卡片中的链接评论 Index
       */
      case "referenceCreateClassificationNoteByIdAndFocusNote":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入文献号",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                if (buttonIndex == 1) {
                  let refNum = alert.textFieldAtIndex(0).text
                  let currentDocmd5 = MNUtil.currentDocmd5
                  let findClassificationNote = false
                  let classificationNote
                  if (toolbarConfig.referenceIds.hasOwnProperty(currentDocmd5) || toolbarConfig.referenceIds[currentDocmd5][0] == undefined) {
                    if (toolbarConfig.referenceIds[currentDocmd5].hasOwnProperty(refNum)) {
                      let refSourceNoteId = toolbarConfig.referenceIds[currentDocmd5][0]
                      let refSourceNote = MNNote.new(refSourceNoteId)
                      // let refSourceNoteTitle = toolbarUtils.getFirstKeywordFromTitle(refSourceNote.noteTitle)
                      let refSourceNoteTitle = refSourceNote.getFirstTitleLinkWord()
                      let refSourceNoteAuthor = toolbarUtils.getFirstAuthorFromReferenceById(refSourceNoteId)
                      let refedNoteId = toolbarConfig.referenceIds[currentDocmd5][refNum]
                      let refedNote = MNNote.new(refedNoteId)
                      // let refedNoteTitle = toolbarUtils.getFirstKeywordFromTitle(refedNote.noteTitle)
                      let refedNoteTitle = refedNote.getFirstTitleLinkWord()
                      let refedNoteAuthor = toolbarUtils.getFirstAuthorFromReferenceById(refedNoteId)


                      // 先看看 refedNote 有没有「具体引用情况」汇总卡片了
                      for (let i = 0; i < refedNote.childNotes.length; i++) {
                        let childNote = refedNote.childNotes[i]
                        if (
                          childNote.noteTitle &&
                          childNote.noteTitle.includes("[" + refNum + "] " + refedNoteTitle)
                        ) {
                          classificationNote = refedNote.childNotes[i]
                          findClassificationNote = true
                          break
                        }
                      }
                      if (!findClassificationNote) {
                        // 没有的话就创建一个
                        classificationNote = MNNote.clone("C24C2604-4B3A-4B6F-97E6-147F3EC67143")
                        classificationNote.noteTitle = 
                          "「" + refSourceNoteTitle + " - " + refSourceNoteAuthor +"」引用" + "「[" + refNum + "] " + refedNoteTitle + " - " + refedNoteAuthor + "」情况"
                      } else {
                        // 如果找到的话就更新一下标题
                        // 因为可能会出现偶尔忘记写作者导致的 No author 
                        classificationNote.noteTitle = 
                          "「" + refSourceNoteTitle + " - " + refSourceNoteAuthor +"」引用" + "「[" + refNum + "] " + refedNoteTitle + " - " + refedNoteAuthor + "」情况"
                      }

                      refedNote.addChild(classificationNote) // 把「具体引用情况」汇总卡片添加到被引用的文献卡片的子卡片

                      
                      /**
                       * 移动链接
                       */

                      /**
                       * 移动「被引用文献卡片」在「具体引用情况」汇总卡片中的链接
                       */
                      let refedNoteIdIndexInClassificationNote = classificationNote.getCommentIndex("marginnote4app://note/" + refedNoteId)
                      if (refedNoteIdIndexInClassificationNote == -1){
                        classificationNote.appendNoteLink(refedNote, "To")
                        classificationNote.moveComment(classificationNote.comments.length-1,classificationNote.getHtmlCommentIndex("具体引用："))  // 移动到“具体引用：”的上面
                      } else {
                        classificationNote.moveComment(refedNoteIdIndexInClassificationNote,classificationNote.getHtmlCommentIndex("具体引用："))
                      }


                      /**
                       * 移动「引用主体文献卡片」在「具体引用情况」汇总卡片中的链接
                       */
                      let refSourceNoteIdIndexInClassificationNote = classificationNote.getCommentIndex("marginnote4app://note/" + refSourceNoteId)
                      if (refSourceNoteIdIndexInClassificationNote == -1){
                        classificationNote.appendNoteLink(refSourceNote, "To")
                        classificationNote.moveComment(classificationNote.comments.length-1,classificationNote.getHtmlCommentIndex("引用："))  // 移动到“引用：”上面
                      } else {
                        classificationNote.moveComment(refSourceNoteIdIndexInClassificationNote,classificationNote.getHtmlCommentIndex("引用："))
                      }

                      /**
                       * 移动「具体引用情况」汇总卡片在引用主体文献卡片中的链接
                       */
                      let classificationNoteIdIndexInRefSourceNote = refSourceNote.getCommentIndex("marginnote4app://note/" + classificationNote.noteId)
                      if (classificationNoteIdIndexInRefSourceNote == -1){
                        refSourceNote.appendNoteLink(classificationNote, "To")
                        refSourceNote.moveComment(refSourceNote.comments.length-1, refSourceNote.getHtmlCommentIndex("被引用情况："))
                      }



                      /**
                       * 移动「具体引用情况」汇总卡片在被引用参考文献卡片中的链接
                       */
                      let classificationNoteIdIndexInRefedNote = refedNote.getCommentIndex("marginnote4app://note/" + classificationNote.noteId)
                      if (classificationNoteIdIndexInRefedNote == -1){
                        refedNote.appendNoteLink(classificationNote, "To")
                        // refedNote.moveComment(refedNote.comments.length-1,refedNote.getCommentIndex("被引用情况：", true))
                      } else {
                        refedNote.moveComment(classificationNoteIdIndexInRefedNote,refedNote.comments.length-1)
                      }



                      classificationNote.merge(focusNote.note)
                      classificationNote.moveComment(
                        classificationNote.comments.length-1,
                        classificationNote.getHtmlCommentIndex("引用：") + 1  // 把参考文献摘录移动到“引用：”下方
                      )
                      classificationNote.focusInFloatMindMap(0.5)
                    } else {
                      MNUtil.showHUD("["+refNum+"] 未进行 ID 绑定")
                    }
                  } else {
                    MNUtil.showHUD("当前文档未绑定 ID")
                  }
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceCreateClassificationNoteById":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入文献号",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                if (buttonIndex == 1) {
                  let refNum = alert.textFieldAtIndex(0).text
                  let currentDocmd5 = MNUtil.currentDocmd5
                  let findClassificationNote = false
                  let classificationNote
                  if (toolbarConfig.referenceIds.hasOwnProperty(currentDocmd5)) {
                    if (toolbarConfig.referenceIds[currentDocmd5].hasOwnProperty(refNum)) {
                      if (toolbarConfig.referenceIds[currentDocmd5][0] == undefined) {
                        MNUtil.showHUD("文档未绑定 ID")
                      } else {
                        let refSourceNoteId = toolbarConfig.referenceIds[currentDocmd5][0]
                        let refSourceNote = MNNote.new(refSourceNoteId)
                        let refSourceNoteTitle = toolbarUtils.getFirstKeywordFromTitle(refSourceNote.noteTitle)
                        let refSourceNoteAuthor = toolbarUtils.getFirstAuthorFromReferenceById(refSourceNoteId)
                        let refedNoteId = toolbarConfig.referenceIds[currentDocmd5][refNum]
                        let refedNote = MNNote.new(refedNoteId)
                        let refedNoteTitle = toolbarUtils.getFirstKeywordFromTitle(refedNote.noteTitle)
                        let refedNoteAuthor = toolbarUtils.getFirstAuthorFromReferenceById(refedNoteId)
                        // 先看 refedNote 有没有归类的子卡片了
                        for (let i = 0; i < refedNote.childNotes.length; i++) {
                          let childNote = refedNote.childNotes[i]
                          if (
                            childNote.noteTitle &&
                            childNote.noteTitle.includes("[" + refNum + "] " + refedNoteTitle)
                          ) {
                            classificationNote = refedNote.childNotes[i]
                            findClassificationNote = true
                            break
                          }
                        }
                        if (!findClassificationNote) {
                          // 没有的话就创建一个
                          classificationNote = MNNote.clone("C24C2604-4B3A-4B6F-97E6-147F3EC67143")
                          classificationNote.noteTitle = 
                            "「" + refSourceNoteTitle + " - " + refSourceNoteAuthor +"」引用" + "「[" + refNum + "] " + refedNoteTitle + " - " + refedNoteAuthor + "」情况"
                        } else {
                          // 如果找到的话就更新一下标题
                          // 因为可能会出现偶尔忘记写作者导致的 No author 
                          classificationNote.noteTitle = 
                            "「" + refSourceNoteTitle + " - " + refSourceNoteAuthor +"」引用" + "「[" + refNum + "] " + refedNoteTitle + " - " + refedNoteAuthor + "」情况"
                        }
                        refedNote.addChild(classificationNote.note)
                        // 移动链接到“引用：”
                        let refedNoteIdIndexInClassificationNote = classificationNote.getCommentIndex("marginnote4app://note/" + refedNoteId)
                        if (refedNoteIdIndexInClassificationNote == -1){
                          classificationNote.appendNoteLink(refedNote, "To")
                          classificationNote.moveComment(classificationNote.comments.length-1,classificationNote.getCommentIndex("具体引用：", true))
                        } else {
                          classificationNote.moveComment(refedNoteIdIndexInClassificationNote,classificationNote.getCommentIndex("具体引用：", true))
                        }
                        // 移动链接到“原文献”
                        let refSourceNoteIdIndexInClassificationNote = classificationNote.getCommentIndex("marginnote4app://note/" + refSourceNoteId)
                        if (refSourceNoteIdIndexInClassificationNote == -1){
                          classificationNote.appendNoteLink(refSourceNote, "To")
                          classificationNote.moveComment(classificationNote.comments.length-1,classificationNote.getCommentIndex("引用：", true))
                        } else {
                          classificationNote.moveComment(refSourceNoteIdIndexInClassificationNote,classificationNote.getCommentIndex("引用：", true))
                        }
                        // 链接归类卡片到 refSourceNote
                        let classificationNoteIdIndexInRefSourceNote = refSourceNote.getCommentIndex("marginnote4app://note/" + classificationNote.noteId)
                        if (classificationNoteIdIndexInRefSourceNote == -1){
                          refSourceNote.appendNoteLink(classificationNote, "To")
                        }
                        // 链接归类卡片到 refedNote
                        let classificationNoteIdIndexInRefedNote = refedNote.getCommentIndex("marginnote4app://note/" + classificationNote.noteId)
                        if (classificationNoteIdIndexInRefedNote == -1){
                          refedNote.appendNoteLink(classificationNote, "To")
                          refedNote.moveComment(refedNote.comments.length-1,refedNote.getCommentIndex("参考文献：", true))
                        } else {
                          refedNote.moveComment(classificationNoteIdIndexInRefedNote,refedNote.getCommentIndex("参考文献：", true))
                        }
                        classificationNote.focusInFloatMindMap(0.5)
                      }
                    } else {
                      MNUtil.showHUD("["+refNum+"] 未进行 ID 绑定")
                    }
                  } else {
                    MNUtil.showHUD("当前文档并未开始绑定 ID")
                  }
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "refreshNotes":
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(focusNote=>{
              focusNote.refresh()
            })
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "refreshCardsAndAncestorsAndDescendants":
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(focusNote=>{
              focusNote.refreshAll()
            })
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "referenceTestIfIdInCurrentDoc":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入文献号",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                if (buttonIndex == 1) {
                  let refNum = alert.textFieldAtIndex(0).text
                  let currentDocmd5 = MNUtil.currentDocmd5
                  if (toolbarConfig.referenceIds.hasOwnProperty(currentDocmd5)) {
                    if (toolbarConfig.referenceIds[currentDocmd5].hasOwnProperty(refNum)) {
                      MNUtil.showHUD("["+refNum+"] 与「" + MNNote.new(toolbarConfig.referenceIds[currentDocmd5][refNum]).noteTitle + "」绑定")
                    } else {
                      MNUtil.showHUD("["+refNum+"] 未进行 ID 绑定")
                    }
                  } else {
                    MNUtil.showHUD("当前文档并未开始绑定 ID")
                  }
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceStoreOneIdForCurrentDocByFocusNote":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入文献号",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                if (buttonIndex == 1) {
                  let refNum = alert.textFieldAtIndex(0).text
                  let refId = focusNote.noteId
                  let currentDocmd5 = MNUtil.currentDocmd5
                  if (toolbarConfig.referenceIds.hasOwnProperty(currentDocmd5)) {
                    toolbarConfig.referenceIds[currentDocmd5][refNum] = refId
                  } else {
                    toolbarConfig.referenceIds[currentDocmd5] = {}
                    toolbarConfig.referenceIds[currentDocmd5][refNum] = refId
                  }
                  MNUtil.showHUD("Save: [" + refNum + "] -> " + refId);
                  toolbarConfig.save("MNToolbar_referenceIds")
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceStoreOneIdForCurrentDoc":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "绑定参考文献号和对应文献卡片 ID",
          "格式：num@ID\n比如：1@11-22--33",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let input = alert.textFieldAtIndex(0).text
                if (buttonIndex == 1) {
                  toolbarUtils.referenceStoreOneIdForCurrentDoc(input)
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceStoreIdsForCurrentDoc":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "绑定参考文献号和对应文献卡片 ID",
          "格式：num@ID\n比如：1@11-22--33\n\n多个 ID 之间用\n- 中文分号；\n- 英文分号;\n- 中文逗号，\n- 英文逗号,\n之一隔开",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let idsArr = toolbarUtils.splitStringByFourSeparators(alert.textFieldAtIndex(0).text)
                if (buttonIndex == 1) {
                  idsArr.forEach(id=>{
                    toolbarUtils.referenceStoreOneIdForCurrentDoc(id)
                  })
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceStoreIdsForCurrentDocFromClipboard":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "确定要从剪切板导入所有参考文献 ID 吗？",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            if (buttonIndex == 1) {
              try {
                MNUtil.undoGrouping(()=>{
                  let idsArr = toolbarUtils.splitStringByFourSeparators(MNUtil.clipboardText)
                  idsArr.forEach(id=>{
                    toolbarUtils.referenceStoreOneIdForCurrentDoc(id)
                  })
                })
              } catch (error) {
                MNUtil.showHUD(error);
              }
            }
          }
        )
        break;
      case "referenceExportReferenceIdsToClipboard":
        MNUtil.copy(
          JSON.stringify(toolbarConfig.referenceIds, null, 2)
        )
        MNUtil.showHUD("Copy successfully!")
        break;
      case "referenceExportReferenceIdsToFile":
        // 导出到 .JSON 文件
        path = MNUtil.cacheFolder+"/exportReferenceIds.json"
        MNUtil.writeText(path, JSON.stringify(toolbarConfig.referenceIds, null, 2))
        UTI = ["public.json"]
        MNUtil.saveFile(path, UTI)
        break;
      case "referenceInputReferenceIdsFromClipboard":
        // MNUtil.copy(
        //   JSON.stringify(toolbarConfig.referenceIds, null, 2)
        // )
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "确定要从剪切板导入所有参考文献 ID 吗？",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            if (buttonIndex == 1) {
              try {
                MNUtil.undoGrouping(()=>{
                  toolbarConfig.referenceIds = JSON.parse(MNUtil.clipboardText)
                  toolbarConfig.save("MNToolbar_referenceIds")
                })
              } catch (error) {
                MNUtil.showHUD(error);
              }
            }
          }
        )
        break;
      case "referenceInputReferenceIdsFromFile":
        try {
          // MNUtil.undoGrouping(()=>{
            UTI = ["public.json"]
            path = await MNUtil.importFile(UTI)
            toolbarConfig.referenceIds = MNUtil.readJSON(path)
            toolbarConfig.save("MNToolbar_referenceIds")
          // })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        // MNUtil.copy(
        //   JSON.stringify(toolbarConfig.referenceIds, null, 2)
        // )
        break;
      case "referenceClearIdsForCurrentDoc":
        try {
          // MNUtil.undoGrouping(()=>{
            currentDocmd5 = MNUtil.currentDocmd5
            currentDocName = MNUtil.currentDocController.document.docTitle
            toolbarConfig.referenceIds[currentDocmd5] = {}
            toolbarConfig.save("MNToolbar_referenceIds")
            MNUtil.showHUD("已清空文档「"+currentDocName+"」的所有参考文献 ID");
          // })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        // MNUtil.copy(
        //   JSON.stringify(toolbarConfig.referenceIds, null, 2)
        // )
        break;
      case "referenceStoreIdForCurrentDocByFocusNote":
        try {
          // MNUtil.undoGrouping(()=>{
            let refNum = 0
            let refId = focusNote.noteId
            currentDocmd5 = MNUtil.currentDocmd5
            currentDocName = MNUtil.currentDocController.document.docTitle
            if (toolbarConfig.referenceIds.hasOwnProperty(currentDocmd5)) {
              toolbarConfig.referenceIds[currentDocmd5][refNum] = refId
            } else {
              toolbarConfig.referenceIds[currentDocmd5] = {}
              toolbarConfig.referenceIds[currentDocmd5][refNum] = refId
            }
            MNUtil.showHUD("文档「" +currentDocName+ "」与 "+refId + "绑定");
            toolbarConfig.save("MNToolbar_referenceIds")
          // })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        // MNUtil.copy(
        //   JSON.stringify(toolbarConfig.referenceIds, null, 2)
        // )
        break;
      case "referenceAuthorInfoFromClipboard":
        MNUtil.undoGrouping(()=>{
          // let infoHtmlCommentIndex = focusNote.getCommentIndex("个人信息：", true)
          let referenceHtmlCommentIndex = focusNote.getCommentIndex("文献：", true)
          focusNote.appendMarkdownComment(
            MNUtil.clipboardText, referenceHtmlCommentIndex
          )
        })
        break;
      case "referenceAuthorRenewAbbreviation":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(
            focusNote => {
              let authorName = toolbarUtils.getFirstKeywordFromTitle(focusNote.noteTitle)
              let abbreviations = toolbarUtils.getAbbreviationsOfName(authorName)
              abbreviations.forEach(abbreviation => {
                if (!focusNote.noteTitle.includes(abbreviation)) {
                  focusNote.noteTitle += "; " + abbreviation
                }
              })
            }
          )
        })
        break;
      case "renewAuthorNotes":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            for (let i = focusNote.comments.length-1; i >= 0; i--) {
              let comment = focusNote.comments[i]
              if (
                !comment.text ||
                !comment.text.includes("marginnote")
              ) {
                focusNote.removeCommentByIndex(i)
              }
            }
            toolbarUtils.cloneAndMerge(focusNote, "782A91F4-421E-456B-80E6-2B34D402911A")
            focusNote.moveComment(focusNote.comments.length-1,0)
            focusNote.moveComment(focusNote.comments.length-1,0)
            focusNote.moveComment(focusNote.comments.length-1,0)
            focusNote.moveComment(focusNote.comments.length-1,0)
          })
        })
        break 
      case "referencePaperMakeCards":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            if (focusNote.excerptText) {
              toolbarUtils.convertNoteToNonexcerptVersion(focusNote)
            }
            focusNote.note.colorIndex = 15
            if (focusNote.noteTitle.startsWith("【文献：")) {
              // 把  focusNote.noteTitle 开头的【.*】 删掉
              let reg = new RegExp("^【.*】")
              focusNote.noteTitle = focusNote.noteTitle.replace(reg, "【文献：论文】")
            } else {
              focusNote.noteTitle = "【文献：论文】; " + focusNote.noteTitle
            }
            let referenceInfoHtmlCommentIndex = focusNote.getCommentIndex("文献信息：", true)
            if (referenceInfoHtmlCommentIndex == -1) {
              toolbarUtils.cloneAndMerge(focusNote, "F09C0EEB-4FB5-476C-8329-8CC5AEFECC43")
            }
            let paperLibraryNote = MNNote.new("785225AC-5A2A-41BA-8760-3FEF10CF4AE0")
            paperLibraryNote.addChild(focusNote.note)
            focusNote.focusInMindMap(0.5)
          })
        })
        break;
      case "referenceBookMakeCards":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            if (focusNote.excerptText) {
              toolbarUtils.convertNoteToNonexcerptVersion(focusNote)
            }
            focusNote.note.colorIndex = 15
            if (focusNote.noteTitle.startsWith("【文献：")) {
              // 把  focusNote.noteTitle 开头的【.*】 删掉
              let reg = new RegExp("^【.*】")
              focusNote.noteTitle = focusNote.noteTitle.replace(reg, "【文献：书作】")
            } else {
              focusNote.noteTitle = "【文献：书作】; " + focusNote.noteTitle
            }
            let referenceInfoHtmlCommentIndex = focusNote.getCommentIndex("文献信息：", true)
            if (referenceInfoHtmlCommentIndex == -1) {
              toolbarUtils.cloneAndMerge(focusNote, "F09C0EEB-4FB5-476C-8329-8CC5AEFECC43")
            }
            let bookLibraryNote = MNNote.new("49102A3D-7C64-42AD-864D-55EDA5EC3097")
            bookLibraryNote.addChild(focusNote.note)
            focusNote.focusInMindMap(0.5)
          })
        })
        break;
      case "referenceSeriesBookMakeCard":
        try {
          MNUtil.undoGrouping(()=>{
            UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
              "系列书作",
              "输入系列名",
              2,
              "取消",
              ["确定"],
              (alert, buttonIndex) => {
                if (buttonIndex === 1) {
                  let seriesName = alert.textFieldAtIndex(0).text;
                  UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                    "系列号",
                    "",
                    2,
                    "取消",
                    ["确定"],
                    (alertI, buttonIndexI) => {
                      if (buttonIndex == 1) {
                        let seriesNum = alertI.textFieldAtIndex(0).text;
                        try {
                          toolbarUtils.referenceSeriesBookMakeCard(focusNote, seriesName, seriesNum)
                        } catch (error) {
                          MNUtil.showHUD(error);
                        }
                      }
                    }
                  )
                }
              }
            )
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "referenceOneVolumeJournalMakeCards":
        try {
          MNUtil.undoGrouping(()=>{
            let journalVolNum
            let journalName
            if (focusNote.excerptText) {
              toolbarUtils.convertNoteToNonexcerptVersion(focusNote)
            } else {
              focusNote.note.colorIndex = 15
              UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                "整卷期刊",
                "输入期刊名",
                2,
                "取消",
                ["确定"],
                (alert, buttonIndex) => {
                  MNUtil.undoGrouping(()=>{
                    journalName = alert.textFieldAtIndex(0).text;
                    if (buttonIndex === 1) {
                      let journalLibraryNote = MNNote.new("1D83F1FA-E54D-4E0E-9E74-930199F9838E")
                      let findJournal = false
                      let targetJournalNote
                      let focusNoteIndexInTargetJournalNote
                      for (let i = 0; i <= journalLibraryNote.childNotes.length-1; i++) {
                        if (journalLibraryNote.childNotes[i].noteTitle.includes(journalName)) {
                          targetJournalNote = journalLibraryNote.childNotes[i]
                          journalName = toolbarUtils.getFirstKeywordFromTitle(targetJournalNote.noteTitle)
                          findJournal = true
                          break;
                        }
                      }
                      if (!findJournal) {
                        targetJournalNote = MNNote.clone("129EB4D6-D57A-4367-8087-5C89864D3595")
                        targetJournalNote.note.noteTitle = "【文献：期刊】; " + journalName
                        journalLibraryNote.addChild(targetJournalNote.note)
                      }
                      let journalInfoHtmlCommentIndex = focusNote.getCommentIndex("文献信息：", true)
                      if (journalInfoHtmlCommentIndex == -1) {
                        toolbarUtils.cloneAndMerge(focusNote, "1C976BDD-A04D-46D0-8790-34CE0F6671A4")
                      }
                      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                        "卷号",
                        "",
                        2,
                        "取消",
                        ["确定"],
                        (alertI, buttonIndex) => {
                          if (buttonIndex == 1) {
                            journalVolNum = alertI.textFieldAtIndex(0).text;
                            let journalTextIndex = focusNote.getIncludingCommentIndex("- 整卷期刊：", true)
                            // let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
                            let includingHtmlCommentIndex = focusNote.getCommentIndex("包含：", true)
                            focusNote.noteTitle = toolbarUtils.replaceStringStartWithSquarebracketContent(
                              focusNote.noteTitle,
                              "【文献：整卷期刊："+ journalName + " - Vol. "+ journalVolNum + "】"
                            )
                            if (journalTextIndex == -1) {
                              focusNote.appendMarkdownComment("- 整卷期刊：Vol. " + journalVolNum, includingHtmlCommentIndex)
                              focusNote.appendNoteLink(targetJournalNote, "To")
                              focusNote.moveComment(focusNote.comments.length-1,includingHtmlCommentIndex+1)
                            } else {
                              // focusNote.appendNoteLink(targetJournalNote, "To")
                              // focusNote.moveComment(focusNote.comments.length-1,journalTextIndex + 1)
                              focusNote.removeCommentByIndex(journalTextIndex)
                              focusNote.appendMarkdownComment("- 整卷期刊：Vol. " + journalVolNum, journalTextIndex)
                              if (focusNote.getCommentIndex("marginnote4app://note/" + targetJournalNote.noteId) == -1) {
                                focusNote.appendNoteLink(targetJournalNote, "To")
                                focusNote.moveComment(focusNote.comments.length-1,journalTextIndex + 1)
                              }
                            }
                            focusNoteIndexInTargetJournalNote = targetJournalNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                            let singleInfoIndexInTargetJournalNote = targetJournalNote.getIncludingCommentIndex("**单份**")
                            if (focusNoteIndexInTargetJournalNote == -1){
                              targetJournalNote.appendNoteLink(focusNote, "To")
                              targetJournalNote.moveComment(targetJournalNote.comments.length-1,singleInfoIndexInTargetJournalNote)
                            } else {
                              targetJournalNote.moveComment(focusNoteIndexInTargetJournalNote,singleInfoIndexInTargetJournalNote)
                            }
                            // toolbarUtils.sortNoteByVolNum(targetJournalNote, 1)
                            let bookLibraryNote = MNNote.new("49102A3D-7C64-42AD-864D-55EDA5EC3097")
                            MNUtil.undoGrouping(()=>{
                              bookLibraryNote.addChild(focusNote.note)
                              focusNote.focusInMindMap(0.5)
                            })
                          }
                        }
                      )
                    }
                  })
                }
              )
            }
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "referenceAuthorNoteMake":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(
              focusNote => {
                toolbarUtils.referenceAuthorNoteMake(focusNote)
              }
            )
          } catch (error) {
            MNUtil.showHUD(error);
            MNUtil.copy(error);
          }
        })
        break;
      case "referenceBibInfoCopy":
        bibContentArr = []
        focusNotes.forEach(focusNote=>{
          bibContentArr.push(toolbarUtils.extractBibFromReferenceNote(focusNote))
        })
        if (bibContentArr.length > 0) {
          if (bibContentArr.length == 1) {
            bibContent = bibContentArr[0]
            MNUtil.copy(bibContent)
            MNUtil.showHUD("已复制 1 条 .bib 条目到剪贴板")
          } else {
            if (bibContentArr.length > 1) {
              bibContent = bibContentArr.join("\n\n")
              MNUtil.copy(bibContent)
              MNUtil.showHUD("已复制" + bibContentArr.length + "条 .bib 条目到剪贴板")
            }
          }
        }
        break;
      case "referenceBibInfoExport":
        bibContentArr = []
        focusNotes.forEach(focusNote=>{
          bibContentArr.push(toolbarUtils.extractBibFromReferenceNote(focusNote))
        })
        if (bibContentArr.length > 0) {
          if (bibContentArr.length == 1) {
            bibContent = bibContentArr[0]
            MNUtil.copy(bibContent)
            // MNUtil.showHUD("已复制 1 条 .bib 条目到剪贴板")
          } else {
            if (bibContentArr.length > 1) {
              bibContent = bibContentArr.join("\n\n")
              MNUtil.copy(bibContent)
              // MNUtil.showHUD("已复制" + bibContentArr.length + "条 .bib 条目到剪贴板")
            }
          }
          // 导出到 .bib 文件
          let docPath = MNUtil.cacheFolder+"/exportBibItems.bib"
          MNUtil.writeText(docPath, bibContent)
          let UTI = ["public.bib"]
          MNUtil.saveFile(docPath, UTI)
        }
        break;
      case "referenceBibInfoInitialize":
        break;
      case "referenceBibInfoPasteFromClipboard":
        MNUtil.undoGrouping(()=>{
          bibTextIndex = focusNote.getIncludingCommentIndex("- `.bib`")
          if (bibTextIndex !== -1) {
            focusNote.removeCommentByIndex(bibTextIndex)
          }
          let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
          let bibContent = "- `.bib` 条目：\n  ```bib\n  ";
          // 为MNUtil.clipboardText中的每一行增加四个空格的预处理
          let processedClipboardText = MNUtil.clipboardText.replace(/\n/g, "\n  "); // 在每个换行符前添加四个空格
          bibContent += processedClipboardText; // 将处理后的文本添加到bibContent中
          bibContent += "\n  ```"; // 继续构建最终字符串
          focusNote.appendMarkdownComment(bibContent, thoughtHtmlCommentIndex)
        })
        break;
      case "renewJournalNotes":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            focusNote.removeCommentByIndex(0)
            focusNote.removeCommentByIndex(0)
            focusNote.removeCommentByIndex(0)
            focusNote.removeCommentByIndex(0)
            focusNote.removeCommentByIndex(0)
            toolbarUtils.cloneAndMerge(focusNote, "129EB4D6-D57A-4367-8087-5C89864D3595")
            focusNote.moveComment(focusNote.comments.length-1,0)
            focusNote.moveComment(focusNote.comments.length-1,0)
            focusNote.moveComment(focusNote.comments.length-1,0)
            focusNote.moveComment(focusNote.comments.length-1,0)
          })
        })
        break;
      case "renewPublisherNotes":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            focusNote.removeCommentByIndex(0)
            focusNote.removeCommentByIndex(0)
            focusNote.removeCommentByIndex(0)
            focusNote.removeCommentByIndex(0)
            focusNote.removeCommentByIndex(0)
            toolbarUtils.cloneAndMerge(focusNote, "1E34F27B-DB2D-40BD-B0A3-9D47159E68E7")
            focusNote.moveComment(focusNote.comments.length-1,0)
            focusNote.moveComment(focusNote.comments.length-1,0)
            focusNote.moveComment(focusNote.comments.length-1,0)
            focusNote.moveComment(focusNote.comments.length-1,0)
          })
        })
        break;
      case "renewBookSeriesNotes":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            let title = focusNote.noteTitle
            let seriesName = title.match(/【文献：系列书作：(.*) - (\d+)】/)[1]
            let seriesNum = title.match(/【文献：系列书作：(.*) - (\d+)】/)[2]
            // MNUtil.showHUD(seriesName,seriesNum)
            toolbarUtils.referenceSeriesBookMakeCard(focusNote, seriesName, seriesNum)
          })
        })
        break;
      case "renewBookNotes":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            let title = focusNote.noteTitle
            let yearMatch = toolbarUtils.isFourDigitNumber(toolbarUtils.getFirstKeywordFromTitle(title))
            if (yearMatch) {
              // MNUtil.showHUD(toolbarUtils.getFirstKeywordFromTitle(title))
              let year = toolbarUtils.getFirstKeywordFromTitle(title)
              toolbarUtils.referenceYear(focusNote, year)
              focusNote.noteTitle = title.replace("; "+year, "")
            }
          })
        })
        break;
      case "referenceInfoDoiFromClipboard":
        try {
          MNUtil.undoGrouping(()=>{
            const doiRegex = /(?<=doi:|DOI:|Doi:)\s*(\S+)/i; // 正则表达式匹配以 "doi:" 开头的内容，后面可能有空格或其他字符
            const doiMatch = MNUtil.clipboardText.match(doiRegex); // 使用正则表达式进行匹配
            let doi = doiMatch ? doiMatch[1] : MNUtil.clipboardText.trim(); // 如果匹配成功，取出匹配的内容，否则取出原始输入的内容
            let doiTextIndex = focusNote.getIncludingCommentIndex("- DOI", true)
            if (doiTextIndex !== -1) {
              focusNote.removeCommentByIndex(doiTextIndex)
            }
            let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
            focusNote.appendMarkdownComment("- DOI（Digital Object Identifier）："+doi, thoughtHtmlCommentIndex)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "referenceInfoDoiFromTyping":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "增加 Doi",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                userInput = alert.textFieldAtIndex(0).text;
                const doiRegex = /(?<=doi:|DOI:|Doi:)\s*(\S+)/i; // 正则表达式匹配以 "doi:" 开头的内容，后面可能有空格或其他字符
                const doiMatch = userInput.match(doiRegex); // 使用正则表达式进行匹配
                let doi = doiMatch ? doiMatch[1] : userInput.trim(); // 如果匹配成功，取出匹配的内容，否则取出原始输入的内容
                  if (buttonIndex === 1) {
                    let doiTextIndex = focusNote.getIncludingCommentIndex("- DOI", true)
                    if (doiTextIndex !== -1) {
                      focusNote.removeCommentByIndex(doiTextIndex)
                    }
                    let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
                    focusNote.appendMarkdownComment("- DOI（Digital Object Identifier）："+doi, thoughtHtmlCommentIndex)
                  }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceInfoJournal":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "增加期刊",
          "",
          2,
          "取消",
          ["单份","整期/卷"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                journalName = alert.textFieldAtIndex(0).text;
                let journalLibraryNote = MNNote.new("1D83F1FA-E54D-4E0E-9E74-930199F9838E")
                let findJournal = false
                let targetJournalNote
                let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
                let focusNoteIndexInTargetJournalNote
                let singleInfoIndexInTargetJournalNote
                for (let i = 0; i <= journalLibraryNote.childNotes.length-1; i++) {
                  if (journalLibraryNote.childNotes[i].noteTitle.includes(journalName)) {
                    targetJournalNote = journalLibraryNote.childNotes[i]
                    findJournal = true
                    break;
                  }
                }
                if (!findJournal) {
                  targetJournalNote = MNNote.clone("129EB4D6-D57A-4367-8087-5C89864D3595")
                  targetJournalNote.note.noteTitle = "【文献：期刊】; " + journalName
                  journalLibraryNote.addChild(targetJournalNote.note)
                }
                let journalTextIndex = focusNote.getIncludingCommentIndex("- 期刊", true)
                if (journalTextIndex == -1) {
                  focusNote.appendMarkdownComment("- 期刊（Journal）：", thoughtHtmlCommentIndex)
                  focusNote.appendNoteLink(targetJournalNote, "To")
                  focusNote.moveComment(focusNote.comments.length-1,thoughtHtmlCommentIndex+1)
                } else {
                  // focusNote.appendNoteLink(targetJournalNote, "To")
                  // focusNote.moveComment(focusNote.comments.length-1,journalTextIndex + 1)
                  if (focusNote.getCommentIndex("marginnote4app://note/" + targetJournalNote.noteId) == -1) {
                    focusNote.appendNoteLink(targetJournalNote, "To")
                    focusNote.moveComment(focusNote.comments.length-1,journalTextIndex + 1)
                  } else {
                    focusNote.moveComment(focusNote.getCommentIndex("marginnote4app://note/" + targetJournalNote.noteId),journalTextIndex + 1)
                  }
                }
                focusNoteIndexInTargetJournalNote = targetJournalNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                singleInfoIndexInTargetJournalNote = targetJournalNote.getIncludingCommentIndex("**单份**")
                if (focusNoteIndexInTargetJournalNote == -1){
                  targetJournalNote.appendNoteLink(focusNote, "To")
                  if (buttonIndex !== 1) {
                    // 非单份
                    targetJournalNote.moveComment(targetJournalNote.comments.length-1, singleInfoIndexInTargetJournalNote)
                  } 
                } else {
                  if (buttonIndex !== 1) {
                    // 非单份
                    targetJournalNote.moveComment(focusNoteIndexInTargetJournalNote, singleInfoIndexInTargetJournalNote)
                  } else {
                    targetJournalNote.moveComment(focusNoteIndexInTargetJournalNote, targetJournalNote.comments.length-1)
                  }
                }
                // if (buttonIndex == 1) {
                // }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceInfoPublisher":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "增加出版社",
          "",
          2,
          "取消",
          ["单份","系列"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                publisherName = alert.textFieldAtIndex(0).text;
                let publisherLibraryNote = MNNote.new("9FC1044A-F9D2-4A75-912A-5BF3B02984E6")
                let findPublisher = false
                let targetPublisherNote
                let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
                let focusNoteIndexInTargetPublisherNote
                let singleInfoIndexInTargetPublisherNote
                for (let i = 0; i <= publisherLibraryNote.childNotes.length-1; i++) {
                  if (publisherLibraryNote.childNotes[i].noteTitle.includes(publisherName)) {
                    targetPublisherNote = publisherLibraryNote.childNotes[i]
                    findPublisher = true
                    break;
                  }
                }
                if (!findPublisher) {
                  targetPublisherNote = MNNote.clone("1E34F27B-DB2D-40BD-B0A3-9D47159E68E7")
                  targetPublisherNote.note.noteTitle = "【文献：出版社】; " + publisherName
                  publisherLibraryNote.addChild(targetPublisherNote.note)
                }
                let publisherTextIndex = focusNote.getIncludingCommentIndex("- 出版社", true)
                if (publisherTextIndex == -1) {
                  focusNote.appendMarkdownComment("- 出版社（Publisher）：", thoughtHtmlCommentIndex)
                  focusNote.appendNoteLink(targetPublisherNote, "To")
                  focusNote.moveComment(focusNote.comments.length-1,thoughtHtmlCommentIndex+1)
                } else {
                  if (focusNote.getCommentIndex("marginnote4app://note/" + targetPublisherNote.noteId) == -1) {
                    focusNote.appendNoteLink(targetPublisherNote, "To")
                    focusNote.moveComment(focusNote.comments.length-1,publisherTextIndex + 1)
                  } else {
                    focusNote.moveComment(focusNote.getCommentIndex("marginnote4app://note/" + targetPublisherNote.noteId),publisherTextIndex + 1)
                  }
                }
                focusNoteIndexInTargetPublisherNote = targetPublisherNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                singleInfoIndexInTargetPublisherNote = targetPublisherNote.getIncludingCommentIndex("**单份**")
                if (focusNoteIndexInTargetPublisherNote == -1){
                  targetPublisherNote.appendNoteLink(focusNote, "To")
                  if (buttonIndex !== 1) {
                    // 非单份
                    targetPublisherNote.moveComment(targetPublisherNote.comments.length-1, singleInfoIndexInTargetPublisherNote)
                  } 
                } else {
                  if (buttonIndex !== 1) {
                    // 非单份
                    targetPublisherNote.moveComment(focusNoteIndexInTargetPublisherNote, singleInfoIndexInTargetPublisherNote)
                  } else {
                    targetPublisherNote.moveComment(focusNoteIndexInTargetPublisherNote, targetPublisherNote.comments.length-1)
                  }
                }
                // if (buttonIndex == 1) {
                // }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceInfoKeywords":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "增加关键词",
          "若多个关键词，用\n- 中文分号；\n- 英文分号;\n- 中文逗号，\n- 英文逗号,\n之一隔开",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                userInput = alert.textFieldAtIndex(0).text;
                let keywordArr = toolbarUtils.splitStringByFourSeparators(userInput)
                let findKeyword = false
                let targetKeywordNote
                let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
                let focusNoteIndexInTargetKeywordNote
                if (buttonIndex === 1) {
                  let keywordLibraryNote = MNNote.new("3BA9E467-9443-4E5B-983A-CDC3F14D51DA")
                  // MNUtil.showHUD(keywordArr)
                  keywordArr.forEach(keyword=>{
                    findKeyword = false
                    for (let i = 0; i <= keywordLibraryNote.childNotes.length-1; i++) {
                      if (
                        keywordLibraryNote.childNotes[i].noteTitle.includes(keyword) ||
                        keywordLibraryNote.childNotes[i].noteTitle.includes(keyword.toLowerCase())
                      ) {
                        targetKeywordNote = keywordLibraryNote.childNotes[i]
                        findKeyword = true
                        // MNUtil.showHUD("存在！" + targetKeywordNote.noteTitle)
                        // MNUtil.delay(0.5).then(()=>{
                        //   targetKeywordNote.focusInFloatMindMap()
                        // })
                        break;
                      }
                    }
                    if (!findKeyword) {
                      // 若不存在，则添加关键词卡片
                      targetKeywordNote = MNNote.clone("D1EDF37C-7611-486A-86AF-5DBB2039D57D")
                      if (keyword.toLowerCase() !== keyword) {
                        targetKeywordNote.note.noteTitle += "; " + keyword + "; " + keyword.toLowerCase()
                      } else {
                        targetKeywordNote.note.noteTitle += "; " + keyword
                      }
                      keywordLibraryNote.addChild(targetKeywordNote.note)
                    } else {
                      if (targetKeywordNote.noteTitle.includes(keyword)) {
                        if (!targetKeywordNote.noteTitle.includes(keyword.toLowerCase())) {
                          targetKeywordNote.note.noteTitle += "; " + keyword.toLowerCase()
                        }
                      } else {
                        // 存在小写版本，但没有非小写版本
                        // 获取 noteTitle 中 【文献：关键词】部分后面的内容（假设这部分内容是固定的格式）
                        let noteTitleAfterKeywordPrefixPart = targetKeywordNote.noteTitle.split('【文献：关键词】')[1]; // 这会获取到"; xxx; yyy"这部分内容

                        // 在关键词后面添加新的关键词和对应的分号与空格
                        let newKeywordPart = '; ' + keyword; // 添加分号和空格以及新的关键词

                        // 重新组合字符串，把新的关键词部分放到原来位置
                        let updatedNoteTitle = `【文献：关键词】${newKeywordPart}${noteTitleAfterKeywordPrefixPart}`; // 使用模板字符串拼接新的标题

                        // 更新 targetKeywordNote 的 noteTitle 属性或者给新的变量赋值
                        targetKeywordNote.note.noteTitle = updatedNoteTitle; // 如果 noteTitle 是对象的一个属性的话
                      }
                    }
                    // MNUtil.delay(0.5).then(()=>{
                    //   targetKeywordNote.focusInFloatMindMap()
                    // })
                    let keywordTextIndex = focusNote.getIncludingCommentIndex("- 关键词", true)
                    if (keywordTextIndex == -1) {
                      focusNote.appendMarkdownComment("- 关键词（Keywords）：", thoughtHtmlCommentIndex)
                    }
                    let keywordIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + targetKeywordNote.noteId)
                    if (keywordIndexInFocusNote == -1) {
                      // 关键词卡片还没链接过来
                      focusNote.appendNoteLink(targetKeywordNote, "To")
                      let keywordLinksArr = []
                      focusNote.comments.forEach((comment,index)=>{
                        if (
                          comment.text && 
                          (
                            comment.text.includes("- 关键词") ||
                            comment.text.includes("marginnote4app://note/") ||
                            comment.text.includes("marginnote3app://note/")
                          )
                        ) {
                          keywordLinksArr.push(index)
                        }
                      })
                      keywordTextIndex = focusNote.getIncludingCommentIndex("- 关键词", true)
                      let keywordContinuousLinksArr = toolbarUtils.getContinuousSequenceFromNum(keywordLinksArr, keywordTextIndex)
                      focusNote.moveComment(focusNote.comments.length-1,keywordContinuousLinksArr[keywordContinuousLinksArr.length-1]+1)
                    } else {
                      // 已经有关键词链接
                      let keywordLinksArr = []
                      focusNote.comments.forEach((comment,index)=>{
                        if (
                          comment.text && 
                          (
                            comment.text.includes("- 关键词") ||
                            comment.text.includes("marginnote4app://note/") ||
                            comment.text.includes("marginnote3app://note/")
                          )
                        ) {
                          keywordLinksArr.push(index)
                        }
                      })
                      // MNUtil.showHUD(nextBarCommentIndex)
                      keywordTextIndex = focusNote.getIncludingCommentIndex("- 关键词", true)
                      let keywordContinuousLinksArr = toolbarUtils.getContinuousSequenceFromNum(keywordLinksArr, keywordTextIndex)
                      focusNote.moveComment(keywordIndexInFocusNote,keywordContinuousLinksArr[keywordContinuousLinksArr.length-1])
                    }

                    // 处理关键词卡片
                    focusNoteIndexInTargetKeywordNote = targetKeywordNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                    if (focusNoteIndexInTargetKeywordNote == -1){
                      targetKeywordNote.appendNoteLink(focusNote, "To")
                    }
                  })

                  targetKeywordNote.refresh()
                  focusNote.refresh()
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceInfoYear":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "增加年份",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                year = alert.textFieldAtIndex(0).text;
                if (buttonIndex === 1) {
                  toolbarUtils.referenceInfoYear(focusNote, year)
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceGetRelatedReferencesByKeywords":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "根据关键词进行文献筛选",
          "若多个关键词，用\n- 中文分号；\n- 英文分号;\n- 中文逗号，\n- 英文逗号,\n之一隔开",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                userInput = alert.textFieldAtIndex(0).text;
                let keywordArr = toolbarUtils.splitStringByFourSeparators(userInput)
                let findKeyword = false
                let targetKeywordNoteArr = []
                if (buttonIndex === 1) {
                  let keywordLibraryNote = MNNote.new("3BA9E467-9443-4E5B-983A-CDC3F14D51DA")
                  // MNUtil.showHUD(keywordArr)
                  for (let j = 0; j <= keywordArr.length-1; j++) {
                    let keyword = keywordArr[j]
                    findKeyword = false
                    for (let i = 0; i <= keywordLibraryNote.childNotes.length-1; i++) {
                      if (
                        keywordLibraryNote.childNotes[i].noteTitle.includes(keyword) ||
                        keywordLibraryNote.childNotes[i].noteTitle.includes(keyword.toLowerCase())
                      ) {
                        targetKeywordNoteArr.push(keywordLibraryNote.childNotes[i])
                        findKeyword = true
                        break;
                      }
                    }
                    if (!findKeyword) {
                      MNUtil.showHUD("关键词：「" + keyword + "」不存在！")
                      break;
                    } 
                  }
                  
                  try {
                    MNUtil.undoGrouping(()=>{
                      if (findKeyword) {
                        // MNUtil.showHUD(toolbarUtils.findCommonComments(targetKeywordNoteArr, "相关文献："))
                        let idsArr = toolbarUtils.findCommonComments(targetKeywordNoteArr, "相关文献：")
                        if (idsArr.length > 0) {
                          // 找到了共有的链接
                          let resultLibraryNote = MNNote.new("F1FAEB86-179E-454D-8ECB-53C3BB098701")
                          if (!resultLibraryNote) {
                            // 没有的话就放在“关键词库”下方
                            resultLibraryNote = MNNote.new("3BA9E467-9443-4E5B-983A-CDC3F14D51DA")
                          }
                          let findResultNote = false
                          let resultNote
                          let combinations = toolbarUtils.generateArrayCombinations(keywordArr," + "); // 生成所有可能的组合
                          // MNUtil.showHUD(combinations)
                          for (let i = 0; i <= resultLibraryNote.childNotes.length-1; i++) {
                            let childNote = resultLibraryNote.childNotes[i]
                            
                            findResultNote = false; // 用于标记是否找到匹配的笔记
                            
                            // 遍历所有组合进行匹配
                            for (let combination of combinations) {
                              if (childNote.noteTitle.match(/【.*】(.*)/)[1] === combination) { // 这里假设childNote已经定义且存在noteTitle属性
                                resultNote = childNote; // 更新匹配的笔记对象
                                findResultNote = true; // 设置找到匹配的笔记标记为true
                                break; // 如果找到了匹配项则跳出循环
                              }
                            }
                          }
                          // if (!findResultNote){
                          //   MNUtil.showHUD("false")
                          // } else {
                          //   MNUtil.showHUD("true")
                          // }
                          try {
                            if (!findResultNote) {
                              resultNote = MNNote.clone("DE4455DB-5C55-49F8-8C83-68D6D958E586")
                              resultNote.noteTitle = "【根据关键词筛选文献】" + keywordArr.join(" + ")
                              resultLibraryNote.addChild(resultNote.note)
                            } else {
                              // 清空 resultNote 的所有评论
                              // resultNote.comments.forEach((comment, index)=>{
                              //   resultNote.removeCommentByIndex(0)
                              // })
                              for (let i = resultNote.comments.length-1; i >= 0; i--) {
                                focusNote.removeCommentByIndex(i)
                              }
                              // 重新合并模板
                              toolbarUtils.cloneAndMerge(resultNote,"DE4455DB-5C55-49F8-8C83-68D6D958E586")
                            }
                            idsArr.forEach(
                              id => {
                                resultNote.appendNoteLink(MNNote.new(id), "To")
                              }
                            )
                            resultNote.focusInFloatMindMap(0.5)
                          } catch (error) {
                            MNUtil.showHUD(error);
                          }
                        } else {
                          MNUtil.showHUD("没有文献同时有关键词「" + keywordArr.join("; ") + "」")
                        }
                      }
                    })
                  } catch (error) {
                    MNUtil.showHUD(error);
                  }
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceKeywordsAddRelatedKeywords":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "增加相关关键词",
          "若多个关键词，用\n- 中文分号；\n- 英文分号;\n- 中文逗号，\n- 英文逗号,\n之一隔开",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                userInput = alert.textFieldAtIndex(0).text;
                let keywordArr = toolbarUtils.splitStringByFourSeparators(userInput)
                let findKeyword = false
                let targetKeywordNote
                let focusNoteIndexInTargetKeywordNote
                if (buttonIndex === 1) {
                  let keywordLibraryNote = MNNote.new("3BA9E467-9443-4E5B-983A-CDC3F14D51DA")
                  // MNUtil.showHUD(keywordArr)
                  keywordArr.forEach(keyword=>{
                    findKeyword = false
                    for (let i = 0; i <= keywordLibraryNote.childNotes.length-1; i++) {
                      if (
                        keywordLibraryNote.childNotes[i].noteTitle.includes(keyword) ||
                        keywordLibraryNote.childNotes[i].noteTitle.includes(keyword.toLowerCase())
                      ) {
                        targetKeywordNote = keywordLibraryNote.childNotes[i]
                        findKeyword = true
                        // MNUtil.showHUD("存在！" + targetKeywordNote.noteTitle)
                        // MNUtil.delay(0.5).then(()=>{
                        //   targetKeywordNote.focusInFloatMindMap()
                        // })
                        break;
                      }
                    }
                    if (!findKeyword) {
                      // 若不存在，则添加关键词卡片
                      targetKeywordNote = MNNote.clone("D1EDF37C-7611-486A-86AF-5DBB2039D57D")
                      if (keyword.toLowerCase() !== keyword) {
                        targetKeywordNote.note.noteTitle += "; " + keyword + "; " + keyword.toLowerCase()
                      } else {
                        targetKeywordNote.note.noteTitle += "; " + keyword
                      }
                      keywordLibraryNote.addChild(targetKeywordNote.note)
                    } else {
                      if (targetKeywordNote.noteTitle.includes(keyword)) {
                        if (!targetKeywordNote.noteTitle.includes(keyword.toLowerCase())) {
                          targetKeywordNote.note.noteTitle += "; " + keyword.toLowerCase()
                        }
                      } else {
                        // 存在小写版本，但没有非小写版本
                        // 获取 noteTitle 中 【文献：关键词】部分后面的内容（假设这部分内容是固定的格式）
                        let noteTitleAfterKeywordPrefixPart = targetKeywordNote.noteTitle.split('【文献：关键词】')[1]; // 这会获取到"; xxx; yyy"这部分内容

                        // 在关键词后面添加新的关键词和对应的分号与空格
                        let newKeywordPart = '; ' + keyword; // 添加分号和空格以及新的关键词

                        // 重新组合字符串，把新的关键词部分放到原来位置
                        let updatedNoteTitle = `【文献：关键词】${newKeywordPart}${noteTitleAfterKeywordPrefixPart}`; // 使用模板字符串拼接新的标题

                        // 更新 targetKeywordNote 的 noteTitle 属性或者给新的变量赋值
                        targetKeywordNote.note.noteTitle = updatedNoteTitle; // 如果 noteTitle 是对象的一个属性的话
                      }
                    }
                    let keywordIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + targetKeywordNote.noteId)
                    if (keywordIndexInFocusNote == -1) {
                      // 关键词卡片还没链接过来
                      focusNote.appendNoteLink(targetKeywordNote, "To")
                      let keywordLinksArr = []
                      focusNote.comments.forEach((comment,index)=>{
                        if (
                          comment.text && 
                          (
                            comment.text.includes("相关关键词") ||
                            comment.text.includes("marginnote4app://note/") ||
                            comment.text.includes("marginnote3app://note/")
                          )
                        ) {
                          keywordLinksArr.push(index)
                        }
                      })
                      let keywordContinuousLinksArr = toolbarUtils.getContinuousSequenceFromNum(keywordLinksArr, 0)
                      focusNote.moveComment(focusNote.comments.length-1,keywordContinuousLinksArr[keywordContinuousLinksArr.length-1]+1)
                    } else {
                      // 已经有关键词链接
                      let keywordLinksArr = []
                      focusNote.comments.forEach((comment,index)=>{
                        if (
                          comment.text && 
                          (
                            comment.text.includes("相关关键词") ||
                            comment.text.includes("marginnote4app://note/") ||
                            comment.text.includes("marginnote3app://note/")
                          )
                        ) {
                          keywordLinksArr.push(index)
                        }
                      })
                      // MNUtil.showHUD(nextBarCommentIndex)
                      let keywordContinuousLinksArr = toolbarUtils.getContinuousSequenceFromNum(keywordLinksArr, 0)
                      focusNote.moveComment(keywordIndexInFocusNote,keywordContinuousLinksArr[keywordContinuousLinksArr.length-1]+1)
                    }

                    // 处理关键词卡片
                    focusNoteIndexInTargetKeywordNote = targetKeywordNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                    if (focusNoteIndexInTargetKeywordNote == -1){
                      targetKeywordNote.appendNoteLink(focusNote, "To")
                      targetKeywordNote.moveComment(targetKeywordNote.comments.length-1,targetKeywordNote.getCommentIndex("相关文献：", true))
                    } else {
                      targetKeywordNote.moveComment(focusNoteIndexInTargetKeywordNote,targetKeywordNote.getCommentIndex("相关文献：", true))
                    }
                  })
                  targetKeywordNote.refresh()
                  focusNote.refresh()
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceInfoAuthor":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "增加文献作者",
          "若多个作者，用\n- 中文分号；\n- 英文分号;\n- 中文逗号，\n之一隔开", // 因为有些作者是缩写，包含西文逗号，所以不适合用西文逗号隔开
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let userInput = alert.textFieldAtIndex(0).text;
                let authorArr = toolbarUtils.splitStringByThreeSeparators(userInput)
                let findAuthor = false
                let targetAuthorNote
                let referenceInfoHtmlCommentIndex = focusNote.getCommentIndex("文献信息：", true)
                let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
                let focusNoteIndexInTargetAuthorNote
                let paperInfoIndexInTargetAuthorNote
                if (buttonIndex === 1) {
                  let authorLibraryNote = MNNote.new("A67469F8-FB6F-42C8-80A0-75EA1A93F746")
                  authorArr.forEach(author=>{
                    findAuthor = false
                      let possibleAuthorFormatArr = [
                        ...new Set(
                          Object.values(
                            toolbarUtils.getAbbreviationsOfName(author)
                          )
                        )
                      ]
                    for (let i = 0; i <= authorLibraryNote.childNotes.length-1; i++) {
                      let findPossibleAuthor = possibleAuthorFormatArr.some(
                        possibleAuthor => authorLibraryNote.childNotes[i].noteTitle.includes(possibleAuthor)
                      )
                      if (findPossibleAuthor) {
                        targetAuthorNote = authorLibraryNote.childNotes[i]
                        findAuthor = true
                        break;
                      }
                    }
                    if (!findAuthor) {
                      // MNUtil.showHUD(possibleAuthorFormatArr)
                      // 若不存在，则添加作者卡片
                      targetAuthorNote = MNNote.clone("BBA8DDB0-1F74-4A84-9D8D-B04C5571E42A")
                      possibleAuthorFormatArr.forEach(possibleAuthor=>{
                        targetAuthorNote.note.noteTitle += "; " + possibleAuthor
                      })
                      authorLibraryNote.addChild(targetAuthorNote.note)
                    } else {
                      // 如果有的话就把 possibleAuthorFormatArr 里面 targetAuthorNote 的 noteTitle 里没有的加进去
                      for (let possibleAuthor of possibleAuthorFormatArr) {
                        if (!targetAuthorNote.note.noteTitle.includes(possibleAuthor)) {
                          targetAuthorNote.note.noteTitle += "; " + possibleAuthor
                        }
                      }
                    }
                    let authorTextIndex = focusNote.getIncludingCommentIndex("- 作者", true)
                    if (authorTextIndex == -1) {
                      focusNote.appendMarkdownComment("- 作者（Authors）：", referenceInfoHtmlCommentIndex + 1)
                    }
                    let authorIndexInFocusNote = focusNote.getCommentIndex("marginnote4app://note/" + targetAuthorNote.noteId)
                    if (authorIndexInFocusNote == -1) {
                      // 作者卡片还没链接过来
                      focusNote.appendNoteLink(targetAuthorNote, "To")
                      let authorLinksArr = []
                      focusNote.comments.forEach((comment,index)=>{
                        if (
                          comment.text && 
                          (
                            comment.text.includes("- 作者") ||
                            comment.text.includes("marginnote4app://note/") ||
                            comment.text.includes("marginnote3app://note/")
                          )
                        ) {
                          authorLinksArr.push(index)
                        }
                      })
                      let authorContinuousLinksArr = toolbarUtils.getContinuousSequenceFromNum(authorLinksArr, referenceInfoHtmlCommentIndex + 1)
                      focusNote.moveComment(focusNote.comments.length-1,authorContinuousLinksArr[authorContinuousLinksArr.length-1]+1)
                    } else {
                      let authorLinksArr = []
                      focusNote.comments.forEach((comment,index)=>{
                        if (
                          comment.text && 
                          (
                            comment.text.includes("- 作者") ||
                            comment.text.includes("marginnote4app://note/") ||
                            comment.text.includes("marginnote3app://note/")
                          )
                        ) {
                          authorLinksArr.push(index)
                        }
                      })
                      // MNUtil.showHUD(nextBarCommentIndex)
                      let authorContinuousLinksArr = toolbarUtils.getContinuousSequenceFromNum(authorLinksArr, referenceInfoHtmlCommentIndex + 1)
                      focusNote.moveComment(authorIndexInFocusNote,authorContinuousLinksArr[authorContinuousLinksArr.length-1])
                    }

                    // 处理作者卡片
                    focusNoteIndexInTargetAuthorNote = targetAuthorNote.getCommentIndex("marginnote4app://note/" + focusNote.noteId)
                    paperInfoIndexInTargetAuthorNote = targetAuthorNote.getIncludingCommentIndex("**论文**")
                    if (focusNoteIndexInTargetAuthorNote == -1){
                      targetAuthorNote.appendNoteLink(focusNote, "To")
                      if (toolbarUtils.getReferenceNoteType(focusNote) == "book") {
                        targetAuthorNote.moveComment(targetAuthorNote.comments.length-1, paperInfoIndexInTargetAuthorNote)
                      }
                    } else {
                      if (toolbarUtils.getReferenceNoteType(focusNote) == "book") {
                        if (focusNoteIndexInTargetAuthorNote > paperInfoIndexInTargetAuthorNote) {
                          targetAuthorNote.moveComment(focusNoteIndexInTargetAuthorNote, paperInfoIndexInTargetAuthorNote)
                        }
                      }
                    }
                  })

                  targetAuthorNote.refresh()
                  focusNote.refresh()
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceInfoInputRef":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "增加引用样式",
          "即文献的参考文献部分对该文献的具体引用样式",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let referenceContent = toolbarUtils.extractRefContentFromReference(alert.textFieldAtIndex(0).text)
                referenceContent = toolbarUtils.formatEnglishStringPunctuationSpace(referenceContent)
                  if (buttonIndex == 1) {
                    let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
                    let refTextIndex = focusNote.getIncludingCommentIndex("- 引用样式", true)
                    if (refTextIndex == -1) {
                      focusNote.appendMarkdownComment("- 引用样式：", thoughtHtmlCommentIndex)
                      focusNote.appendMarkdownComment(referenceContent, thoughtHtmlCommentIndex+1)
                    } else {
                      focusNote.appendMarkdownComment(referenceContent, refTextIndex+1)
                    }
                  }
                }
              )
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceInfoRefFromInputRefNum":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入文献号",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                if (buttonIndex == 1) {
                  if (focusNote.noteTitle !== "") {
                    MNUtil.showHUD("选错卡片了！应该选参考文献引用的摘录卡片！")
                  } else {
                    let referenceContent = toolbarUtils.extractRefContentFromReference(focusNote.excerptText)
                    referenceContent = toolbarUtils.formatEnglishStringPunctuationSpace(referenceContent)
                    let refNum = alert.textFieldAtIndex(0).text
                    if (refNum == 0) {
                      MNUtil.showHUD("当前文档没有绑定卡片 ID")
                    } else {
                      currentDocmd5 = MNUtil.currentDocmd5
                      let targetNoteId = toolbarConfig.referenceIds[currentDocmd5]?referenceIds[currentDocmd5][refNum]:undefined
                      if (targetNoteId == undefined) {
                        MNUtil.showHUD("卡片 ID 还没绑定")
                      } else {
                        let targetNote = MNNote.new(targetNoteId)
                        let thoughtHtmlCommentIndex = targetNote.getCommentIndex("相关思考：", true)
                        let refTextIndex = targetNote.getCommentIndex("- 引用样式：", true)
                        if (refTextIndex == -1) {
                          targetNote.appendMarkdownComment("- 引用样式：", thoughtHtmlCommentIndex)
                          targetNote.merge(focusNote)
                          targetNote.appendMarkdownComment(referenceContent)
                          targetNote.moveComment(targetNote.comments.length-1,thoughtHtmlCommentIndex+1)
                          targetNote.moveComment(targetNote.comments.length-1,thoughtHtmlCommentIndex+2)
                        } else {
                          targetNote.merge(focusNote)
                          targetNote.appendMarkdownComment(referenceContent)
                          targetNote.moveComment(targetNote.comments.length-1,refTextIndex+1)
                          targetNote.moveComment(targetNote.comments.length-1,refTextIndex+2)
                        }
                      }
                    }
                  }
                }
              })
            } catch (error) {
              MNUtil.showHUD(error);
            }
          }
        )
        break;
      case "referenceInfoRefFromFocusNote":
        try {
          MNUtil.undoGrouping(()=>{
            if (focusNote.noteTitle !== "") {
              MNUtil.showHUD("选错卡片了！应该选参考文献引用的摘录卡片！")
            } else {
              let referenceContent = toolbarUtils.extractRefContentFromReference(focusNote.excerptText)
              referenceContent = toolbarUtils.formatEnglishStringPunctuationSpace(referenceContent)
              let refNum = toolbarUtils.extractRefNumFromReference(focusNote.excerptText)
              if (refNum == 0) {
                MNUtil.showHUD("当前文档没有绑定卡片 ID")
              } else {
                currentDocmd5 = MNUtil.currentDocmd5
                let targetNoteId = toolbarConfig.referenceIds[currentDocmd5]?referenceIds[currentDocmd5][refNum]:undefined
                if (targetNoteId == undefined) {
                  MNUtil.showHUD("卡片 ID 还没绑定")
                } else {
                  let targetNote = MNNote.new(targetNoteId)
                  let thoughtHtmlCommentIndex = targetNote.getCommentIndex("相关思考：", true)
                  let refTextIndex = targetNote.getCommentIndex("- 引用样式：", true)
                  if (refTextIndex == -1) {
                    targetNote.appendMarkdownComment("- 引用样式：", thoughtHtmlCommentIndex)
                    targetNote.merge(focusNote)
                    targetNote.appendMarkdownComment(referenceContent)
                    targetNote.moveComment(targetNote.comments.length-1,thoughtHtmlCommentIndex+1)
                    targetNote.moveComment(targetNote.comments.length-1,thoughtHtmlCommentIndex+2)
                  } else {
                    targetNote.merge(focusNote)
                    targetNote.appendMarkdownComment(referenceContent)
                    targetNote.moveComment(targetNote.comments.length-1,refTextIndex+1)
                    targetNote.moveComment(targetNote.comments.length-1,refTextIndex+2)
                  }
                }
              }
            }
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "cardCopyNoteId":
        MNUtil.copy(focusNote.noteId)
        MNUtil.showHUD(focusNote.noteId)
        break;
      case "findDuplicateTitles":
        const repeatedTitles = toolbarUtils.findDuplicateTitles(focusNote.childNotes);
        MNUtil.showHUD(repeatedTitles);
        if (repeatedTitles.length > 0) {
          MNUtil.copy(repeatedTitles[0]);
        }
        break;
      case "moveLastLinkToProof":
        let thoughtHtmlCommentIndex = focusNote.getCommentIndex("相关思考：", true)
        MNUtil.undoGrouping(()=>{
          focusNote.moveComment(focusNote.comments.length-1,thoughtHtmlCommentIndex)
        })
        break;
      case "moveLastCommentToProof":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            toolbarUtils.moveLastCommentToProof(focusNote)
          })
        })
        break;
      case "moveLastCommentToThought":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            focusNote.moveCommentsByIndexArrTo([focusNote.comments.length-1], "think")
          })
        })
        break;
      case "referenceMoveLastCommentToThought":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            toolbarUtils.referenceMoveLastCommentToThought(focusNote)
          })
        })
        break;
      case "moveLastTwoCommentsToProof":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            toolbarUtils.moveLastTwoCommentsToProof(focusNote)
          })
        })
        break;
      case "moveLastTwoCommentsToThought":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            toolbarUtils.moveLastTwoCommentsToThought(focusNote)
          })
        })
        break;
      case "moveLastTwoCommentsInBiLinkNotesToThought":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            let targetNoteId = focusNote.comments[focusNote.comments.length-1].text.ifNoteIdorURL()?focusNote.comments[focusNote.comments.length-1].text.toNoteId():undefined
            if (targetNoteId!==undefined) {
              let targetNote = MNNote.new(targetNoteId)
              targetNote.moveCommentsByIndexArrTo(targetNote.getNewContentIndexArr(), "think")
              focusNote.moveCommentsByIndexArrTo(focusNote.getNewContentIndexArr(), "think")
            }
          })
        })
        break;
      case "moveLastTwoCommentsInBiLinkNotesToDefinition":  // new
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            let targetNoteId = focusNote.comments[focusNote.comments.length-1].text.ifNoteIdorURL()?focusNote.comments[focusNote.comments.length-1].text.toNoteId():undefined
            if (targetNoteId!==undefined) {
              let targetNote = MNNote.new(targetNoteId)
              targetNote.moveCommentsByIndexArrTo(targetNote.getNewContentIndexArr(), "def")
              focusNote.moveCommentsByIndexArrTo(focusNote.getNewContentIndexArr(), "def")
            }
          })
        })
        break;
      case "referenceMoveLastTwoCommentsToThought":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            toolbarUtils.referenceMoveLastTwoCommentsToThought(focusNote)
          })
        })
        break;
      case "addThoughtPointAndMoveLastCommentToThought":
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(focusNote=>{
              focusNote.addMarkdownTextCommentTo("- ", "think")
              focusNote.moveCommentsByIndexArrTo([focusNote.comments.length-1], "think")
            })
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "addThoughtPointAndMoveNewCommentsToThought":
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(focusNote=>{
              focusNote.addMarkdownTextCommentTo("- ", "think")
              focusNote.moveCommentsByIndexArrTo(focusNote.getNewContentIndexArr(), "think")
            })
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "referenceAddThoughtPointAndMoveLastCommentToThought":
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(focusNote=>{
              toolbarUtils.referenceAddThoughtPoint(focusNote)
              toolbarUtils.referenceMoveLastCommentToThought(focusNote)
            })
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "copyWholeTitle":
        copyTitlePart = focusNote.noteTitle
        MNUtil.copy(copyTitlePart)
        MNUtil.showHUD(copyTitlePart)
        break;
      case "copyTitleSecondPart":
        if ([2, 3, 9, 10, 15].includes(focusNoteColorIndex)) {
          copyTitlePart = focusNote.noteTitle.match(/【.*】(.*)/)[1]
          MNUtil.copy(copyTitlePart)
          MNUtil.showHUD(copyTitlePart)
        }
        break;
      case "copyTitleFirstKeyword":
        if ([2, 3, 9, 10, 15].includes(focusNoteColorIndex)) {
          copyTitlePart = focusNote.noteTitle.match(/【.*】;\s*([^;]*?)(?:;|$)/)[1]
          MNUtil.copy(copyTitlePart)
          MNUtil.showHUD(copyTitlePart)
        }
        break;
      case "copyTitleFirstQuoteContent":
        if ([0,1,4].includes(focusNoteColorIndex)) {
          if (focusNoteColorIndex == 1) {
            copyTitlePart = focusNote.noteTitle.match(/“(.*)”相关.*/)[1]
          } else {
            copyTitlePart = focusNote.noteTitle.match(/“(.*)”：“.*”相关.*/)[1]
          }
          MNUtil.copy(copyTitlePart)
          MNUtil.showHUD(copyTitlePart)
        }
        break;
      case "copyTitleSecondQuoteContent":
        if ([0,1,4].includes(focusNoteColorIndex)) {
          if (focusNoteColorIndex == 1) {
            copyTitlePart = focusNote.noteTitle.match(/“(.*)”相关.*/)[1]
          } else {
            copyTitlePart = focusNote.noteTitle.match(/“.*”：“(.*)”相关.*/)[1]
          }
          MNUtil.copy(copyTitlePart)
          MNUtil.showHUD(copyTitlePart)
        }
        break;
      case "pasteInTitle":
        // MNUtil.undoGrouping(()=>{
        //   focusNote.noteTitle = MNUtil.clipboardText
        // })
        // focusNote.refreshAll()
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            focusNote.noteTitle = MNUtil.clipboardText
            focusNote.refreshAll()
          })
        })
        break;
      case "pasteAfterTitle":
        // MNUtil.undoGrouping(()=>{
        //   focusNote.noteTitle = focusNote.noteTitle + "; " + MNUtil.clipboardText
        // })
        // focusNote.refreshAll()
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            focusNote.noteTitle = focusNote.noteTitle + "; " + MNUtil.clipboardText
            focusNote.refreshAll()
          })
        })
        break;
      case "extractTitle":
        if (focusNote.noteTitle.match(/【.*】.*/)) {
          MNUtil.copy(focusNote.noteTitle.match(/【.*】;?(.*)/)[1])
          MNUtil.showHUD(focusNote.noteTitle.match(/【.*】;?(.*)/)[1])
        }
        break;
      case "convertNoteToNonexcerptVersion":
        // MNUtil.showHUD("卡片转化为非摘录版本")
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(focusNote=>{
              if (focusNote.excerptText) {
                focusNote.toNoExceptVersion()
              }
            })
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
        break;
      case "ifExceptVersion":
        if (focusNote.excerptText) {
          MNUtil.showHUD("摘录版本")
        } else {
          MNUtil.showHUD("非摘录版本")
        }
        break;
      case "showColorIndex":
        MNUtil.showHUD("ColorIndex: " + focusNote.note.colorIndex)
        break;
      case "showCommentType":
        let focusNoteComments = focusNote.comments
        let chosenComment = focusNoteComments[des.index-1]
        MNUtil.showHUD("CommentType: " + chosenComment.type)
        break;
      case "convetHtmlToMarkdown":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.convetHtmlToMarkdown(focusNote)
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
        break;
      case "linksConvertToMN4Type":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              toolbarUtils.linksConvertToMN4Type(focusNote)
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "addThought":
        MNUtil.undoGrouping(()=>{
          try {
            toolbarUtils.addThought(focusNotes)
          } catch (error) {
            MNUtil.showHUD(error)
          }
        })
        break;
      case "addThoughtPoint":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              focusNote.addMarkdownTextCommentTo("- ", "think")
            })
          } catch (error) {
            MNUtil.showHUD(error)
          }
        })
        break;
      case "referenceAddThoughtPoint":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              toolbarUtils.referenceAddThoughtPoint(focusNote)
            })
          } catch (error) {
            MNUtil.showHUD(error)
          }
        })
        break;
      case "moveUpThoughtPointsToBottom":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              // let newContentsIndexArr = focusNote.getNewContentIndexArr()
              // focusNote.moveCommentsByIndexArrTo(newContentsIndexArr, "think")
              toolbarUtils.moveUpThoughtPointsToBottom(focusNote)
            })
          } catch (error) {
            MNUtil.showHUD(error)
          }
        })
        break;
      case "moveUpThoughtPointsToTop":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              let newContentsIndexArr = focusNote.getNewContentIndexArr()
              focusNote.moveCommentsByIndexArrTo(newContentsIndexArr, "think", false)
            })
          } catch (error) {
            MNUtil.showHUD(error)
          }
        })
        break;
      case "referenceMoveUpThoughtPoints":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              toolbarUtils.referenceMoveUpThoughtPoints(focusNote)
            })
          } catch (error) {
            MNUtil.showHUD(error)
          }
        })
        break;
      case "clearContentKeepMarkdownText":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.clearContentKeepMarkdownText(focusNote)
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
        break;
      case "clearAllLinks":
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(focusNote=>{
              // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
              for (let i = focusNote.comments.length-1; i >= 0; i--) {
                let comment = focusNote.comments[i]
                if (
                  comment.type == "TextNote" &&
                  (
                    comment.text.includes("marginnote3") ||
                    comment.text.includes("marginnote4")
                  )
                ) {
                  focusNote.removeCommentByIndex(i)
                }
              }
            })
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
        break;
      case "clearAllFailedMN3Links":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              toolbarUtils.linksConvertToMN4Type(focusNote)
              // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
              for (let i = focusNote.comments.length-1; i >= 0; i--) {
                let comment = focusNote.comments[i]
                if (
                  comment.type == "TextNote" &&
                  comment.text.includes("marginnote3app://note/")
                ) {
                  focusNote.removeCommentByIndex(i)
                }
              }
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "clearAllFailedLinks":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              toolbarUtils.clearAllFailedLinks(focusNote)
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "reappendAllLinksInNote":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              toolbarUtils.reappendAllLinksInNote(focusNote)
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 向上合并
       */
      case "upwardMergeWithStyledComments":
        MNUtil.undoGrouping(()=>{
          try {
            UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
              "选择「当前卡片」下一层的层级",
              "然后会依次递减",
              0,
              "取消",
              levelHtmlSettingTitles,
              (alert, buttonIndex) => {
                try {
                  MNUtil.undoGrouping(() => {
                    // 按钮索引从1开始（0是取消按钮）
                    const selectedIndex = buttonIndex - 1;
                    
                    if (selectedIndex >= 0 && selectedIndex < levelHtmlSetting.length) {
                      const selectedType = levelHtmlSetting[selectedIndex].type;
                      HtmlMarkdownUtils.upwardMergeWithStyledComments(focusNote, selectedType)
                    }
                  });
                } catch (error) {
                  MNUtil.showHUD(error);
                }
              }
            );
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "mergeInParentNoteWithPopup":
        MNUtil.undoGrouping(()=>{
          try {
            UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
              "选择合并后标题变成评论后的类型",
              "",
              0,
              "取消",
              htmlSettingTitles,
              (alert, buttonIndex) => {
                try {
                  MNUtil.undoGrouping(() => {
                    // 按钮索引从1开始（0是取消按钮）
                    const selectedIndex = buttonIndex - 1;
                    
                    if (selectedIndex >= 0 && selectedIndex < htmlSetting.length) {
                      const selectedType = htmlSetting[selectedIndex].type;
                      switch (selectedType) {
                        case "sameLevel":
                          HtmlMarkdownUtils.autoAddLevelHtmlMDComment(focusNote.parentNote, focusNote.title.toNoBracketPrefixContent(), "same")
                          focusNote.title = ""
                          focusNote.mergeInto(focusNote.parentNote)
                          break;
                        case "nextLevel":
                          HtmlMarkdownUtils.autoAddLevelHtmlMDComment(focusNote.parentNote, focusNote.title.toNoBracketPrefixContent(), "next")
                          focusNote.title = ""
                          focusNote.mergeInto(focusNote.parentNote)
                          break;
                        case "lastLevel":
                          HtmlMarkdownUtils.autoAddLevelHtmlMDComment(focusNote.parentNote, focusNote.title.toNoBracketPrefixContent(), "last")
                          focusNote.title = ""
                          focusNote.mergeInto(focusNote.parentNote)
                          break;
                        case "topestLevel":
                          HtmlMarkdownUtils.autoAddLevelHtmlMDComment(focusNote.parentNote, focusNote.title.toNoBracketPrefixContent(), "topest")
                          focusNote.title = ""
                          focusNote.mergeInto(focusNote.parentNote)
                          break;
                        default:
                          focusNote.mergeInto(focusNote.parentNote, selectedType)
                          break;
                      }
                    }
                  });
                } catch (error) {
                  MNUtil.showHUD(error);
                }
              }
            );
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "mergeInParentNote":
        MNUtil.undoGrouping(()=>{
          try {
            focusNote.mergeInto(focusNote.parentNote)
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "mergIntoParenNoteAndRenewReplaceholder":
        MNUtil.undoGrouping(()=>{
          try {
            focusNote.mergIntoAndRenewReplaceholder(focusNote.parentNote)
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "mergIntoParenNoteAndRenewReplaceholderWithPopup":
        MNUtil.undoGrouping(()=>{
          try {
            UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
              "选择合并后标题变成评论后的类型",
              "",
              0,
              "取消",
              htmlSettingTitles,
              (alert, buttonIndex) => {
                try {
                  MNUtil.undoGrouping(() => {
                    // 按钮索引从1开始（0是取消按钮）
                    const selectedIndex = buttonIndex - 1;
                    
                    if (selectedIndex >= 0 && selectedIndex < htmlSetting.length) {
                      const selectedType = htmlSetting[selectedIndex].type;
                      focusNote.mergIntoAndRenewReplaceholder(focusNote.parentNote, selectedType)
                    }
                  });
                } catch (error) {
                  MNUtil.showHUD(error);
                }
              }
            )
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "clearContentKeepExcerptAndHandwritingAndImage":
        try {
          MNUtil.undoGrouping(()=>{
            MNUtil.copy(focusNote.noteTitle)
            focusNote.noteTitle = ""
            // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
            for (let i = focusNote.comments.length-1; i >= 0; i--) {
              let comment = focusNote.comments[i]
              if (
                (comment.type == "TextNote")
                ||
                (comment.type == "HtmlNote")
              ) {
                focusNote.removeCommentByIndex(i)
              }
            }
          })
        } catch (error) {
          MNUtil.showHUD(error)
        }
        break;
      case "clearContentKeepExcerptWithTitle":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(
              focusNote=>{
                 // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
                for (let i = focusNote.comments.length-1; i >= 0; i--) {
                  let comment = focusNote.comments[i]
                  if (
                    (comment.type !== "LinkNote")
                  ) {
                    focusNote.removeCommentByIndex(i)
                  }
                }

                focusNote.title = focusNote.title.toNoBracketPrefixContent()
              }
            )
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "clearContentKeepExcerpt":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(
              focusNote=>{
                MNUtil.copy(focusNote.noteTitle)
                focusNote.noteTitle = ""
                // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
                for (let i = focusNote.comments.length-1; i >= 0; i--) {
                  let comment = focusNote.comments[i]
                  if (
                    (comment.type !== "LinkNote")
                  ) {
                    focusNote.removeCommentByIndex(i)
                  }
                }
              }
            )
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "clearContentKeepHandwritingAndImage":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(
              focusNote=>{
                MNUtil.copy(focusNote.noteTitle)
                focusNote.noteTitle = ""
                // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
                for (let i = focusNote.comments.length-1; i >= 0; i--) {
                  let comment = focusNote.comments[i]
                  if (
                    (comment.type !== "PaintNote")
                  ) {
                    focusNote.removeCommentByIndex(i)
                  }
                }
              }
            )
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "clearContentKeepHtmlText":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(
              focusNote=>{
                MNUtil.copy(focusNote.noteTitle)
                focusNote.noteTitle = ""
                // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
                for (let i = focusNote.comments.length-1; i >= 0; i--) {
                  let comment = focusNote.comments[i]
                  if (
                    (comment.type !== "HtmlNote")
                  ) {
                    focusNote.removeCommentByIndex(i)
                  }
                }
              }
            )
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "clearContentKeepText":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(
              focusNote=>{
                MNUtil.copy(focusNote.noteTitle)
                focusNote.noteTitle = ""
                // 从最后往上删除，就不会出现前面删除后干扰后面的 index 的情况
                for (let i = focusNote.comments.length-1; i >= 0; i--) {
                  let comment = focusNote.comments[i]
                  if (
                    (comment.type !== "HtmlNote") &&
                    (comment.type !== "TextNote") 
                  ) {
                    focusNote.removeCommentByIndex(i)
                  }
                }
              }
            )
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "addTopic":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.addTopic(focusNote)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "addTemplate":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.addTemplate(focusNote,focusNoteColorIndex)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "achieveCards":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.achieveCards(focusNote)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "renewCards":
        try {
          MNUtil.undoGrouping(()=>{
            focusNotes.forEach(focusNote=>{
              toolbarUtils.renewCards(focusNote)
            })
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "changeChildNotesPrefix":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.changeChildNotesPrefix(focusNote)
            focusNote.descendantNodes.descendant.forEach(descendantNote => {
              if ([0, 1, 4].includes(descendantNote.note.colorIndex)) {
                try {
                  // MNUtil.undoGrouping(()=>{
                    toolbarUtils.changeChildNotesPrefix(descendantNote)
                  // })
                } catch (error) {
                  MNUtil.showHUD(error);
                }
              }
            })
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "renewChildNotesPrefix":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.renewChildNotesPrefix(focusNote)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "moveUpLinkNotes":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.moveUpLinkNotes(focusNotes)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "renewProof":
        try {
          MNUtil.undoGrouping(()=>{
            toolbarUtils.renewProof(focusNotes)
          })
        } catch (error) {
          MNUtil.showHUD(error);
        }
        break;
      case "hideAddonBar":
        MNUtil.postNotification("toggleMindmapToolbar", {target:"addonBar"})
        break;
      case "moveProofToMethod":
        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
          "输入方法数",
          "",
          2,
          "取消",
          ["确定"],
          (alert, buttonIndex) => {
            try {
              MNUtil.undoGrouping(()=>{
                let methodNum = alert.textFieldAtIndex(0).text;
                let findMethod = false
                if (buttonIndex == 1) {
                  for (let i = 0; i < focusNote.comments.length; i++) {
                    let comment = focusNote.comments[i];
                    if (
                      comment.text &&
                      comment.text.startsWith("<span") &&
                      comment.text.includes("方法"+toolbarUtils.numberToChinese(methodNum))
                    ) {
                      findMethod = true
                      break
                    }
                  }
                  if (!findMethod) {
                    MNUtil.showHUD("没有此方法！")
                  } else {
                    toolbarUtils.moveProofToMethod(focusNote,methodNum)
                  }
                }
              })
            } catch (error) {
              MNUtil.showHUD(error)
            }
          }
        )
        break
      case "mergeTemplateNotes": // new
        if (MNUtil.currentNotebookId !== "9BA894B4-3509-4894-A05C-1B4BA0A9A4AE" ) {
          MNUtil.undoGrouping(()=>{
            try {
              if (focusNote.ifIndependentNote()) {
                // 独立卡片双击时把父卡片的标题作为前缀
                if (!focusNote.title.ifWithBracketPrefix()) {
                  focusNote.title = focusNote.parentNote.noteTitle.toBracketPrefixContentArrowSuffix() + focusNote.title
                } else {
                  // 有前缀的话，就更新前缀
                  focusNote.title = focusNote.parentNote.noteTitle.toBracketPrefixContentArrowSuffix() + focusNote.title.toNoBracketPrefixContent()
                }
              } else {
                // 非独立卡片
                if (toolbarConfig.windowState.preprocess) {
                  focusNotes.forEach(focusNote=>{
                    toolbarUtils.TemplateMakeNote(focusNote)
                  })
                } else {
                  UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                    "撤销制卡","去掉所有「文本」和「链接」",0,"点错了",["确认"],
                    (alert, buttonIndex) => {
                      if (buttonIndex == 1) {
                        MNUtil.undoGrouping(()=>{
                          focusNote.removeCommentsByTypes(["text","links"])
                        })
                      }
                    }
                  )
                }
              }

            } catch (error) {
              MNUtil.showHUD(error);
            }
          })
        }
        break;
      /**
       * 批量制卡
       * 
       * 因为单击制卡现在支持了一键处理，但这个的弊端就是不支持批量制卡了
       */
      case "multiTemplateMakeNotes":
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            toolbarUtils.TemplateMakeNote(focusNote)
            if (!focusNote.ifIndependentNote() && !focusNote.ifReferenceNote()) {
              focusNote.addToReview()
            }
          })
        })
        break;
      case "TemplateMakeNotes": // new
        switch (MNUtil.currentNotebookId) {
          case "9BA894B4-3509-4894-A05C-1B4BA0A9A4AE":  // 任务管理学习集
            MNUtil.undoGrouping(()=>{
              focusNotes.forEach(focusNote=>{
                toolbarUtils.OKRNoteMake(focusNote)
              })
            })
            break;
          case "014E76CA-94D6-48D5-82D2-F98A2F017219":  // 英语学习集
            MNUtil.undoGrouping(()=>{
              try {
                focusNotes.forEach(focusNote=>{
                  if (focusNote.colorIndex == 13) {  // 暂时先通过颜色判断
                    // 此时表示是单词卡片
                    /**
                     * 目前采取的暂时方案是：只要制卡就复制新卡片，删除旧卡片
                     * 因为一张单词卡片不会多次点击制卡，只会后续修改评论，所以这样问题不大
                     */
                    let vocabularyLibraryNote = MNNote.new("55C7235C-692E-44B4-BD0E-C1AF2A4AE805")
                    // TODO：判断卡片是否在单词库里了，在的话就不移动
                    // 通过判断有没有 originNoteId 来判断是否需要复制新卡片
                    if (focusNote.originNoteId) {
                      let newNote = focusNote.createDuplicatedNoteAndDelete()
                      vocabularyLibraryNote.addChild(newNote)
                      // newNote.addToReview()
                      // newNote.focusInMindMap(0.3)
                    } else {
                      if (focusNote.parentNote.noteId !== "55C7235C-692E-44B4-BD0E-C1AF2A4AE805") {
                        vocabularyLibraryNote.addChild(focusNote)
                      }
                      // focusNote.addToReview()
                      // focusNote.focusInMindMap(0.3)
                    }
                  } else {
                    if (!focusNote.title.ifWithBracketPrefix()) {
                      focusNote.title = focusNote.parentNote.noteTitle.toBracketPrefixContentArrowSuffix() + focusNote.title
                    } else {
                      // 有前缀的话，就更新前缀
                      focusNote.title = focusNote.parentNote.noteTitle.toBracketPrefixContentArrowSuffix() + focusNote.title.toNoBracketPrefixContent()
                    }
                    if (focusNote.excerptText) {
                      focusNote.toNoExceptVersion()
                    }
                  }
                })
              } catch (error) {
                MNUtil.showHUD(error);
              }
            })
            break;
          default:
            MNUtil.undoGrouping(()=>{
              try {
                if (focusNote.ifIndependentNote() && focusNote.title.includes("引用") && focusNote.title.includes("情况")) {
                  // 此时为参考文献的具体引用情况的制卡，此时只需要把新的摘录内容移动到「被引用的具体内容」下方
                  let newContentsIndexArr = focusNote.getHtmlBlockContinuousExcerptToEndContentIndexArr("相关思考：")
                  focusNote.moveCommentsByIndexArr(newContentsIndexArr, focusNote.getHtmlCommentIndex("相关思考："))
                } else {
                  if (toolbarConfig.windowState.preprocess) {
                    // 预处理模式
                    focusNotes.forEach(focusNote=>{
                      if (focusNote.ifIndependentNote()) {
                        focusNote.toNoExceptVersion()
                      } else {
                        // toolbarUtils.TemplateMakeNote(focusNote)
                        if (focusNote.excerptText) {
                          focusNote.changeTitle()
                          focusNote.toNoExceptVersion()
                        }
                        focusNote.changeTitle()
                        focusNote.changeColorByType()
                        focusNote.refreshAll()
                      }
                      focusNote.focusInMindMap(0.5)
                    })
                  } else {
                    // 非预处理模式，即正常制卡模式
                    if (focusNote.ifIndependentNote()) {
                      focusNote.toNoExceptVersion()
                      focusNote.refresh()
                      focusNote.focusInMindMap(0.5)
                    } else {
                      if (HtmlMarkdownUtils.hasHtmlMDComment(focusNote) && (!focusNote.ifMergedTemplate())) {
                        UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
                          "卡片中含有 HtmlMarkdown 评论", "确认要制卡？",0,"点错了",["确认"],
                          (alert, buttonIndex) => {
                            if (buttonIndex == 1) {
                              MNUtil.undoGrouping(()=>{
                                if (!focusNote.excerptText) {
                                  toolbarUtils.TemplateMakeNote(focusNote)
                                  if (!focusNote.ifReferenceNote()) {
                                    focusNote.addToReview()
                                  }
                                  focusNote.focusInMindMap(0.3) 
                                } else {
                                  focusNote.toNoExceptVersion()
                                  focusNote.focusInMindMap(0.3)             
                                  MNUtil.delay(0.3).then(()=>{
                                    focusNote = MNNote.getFocusNote()
                                    MNUtil.delay(0.3).then(()=>{
                                      toolbarUtils.TemplateMakeNote(focusNote)
                                    })
                                    MNUtil.delay(0.5).then(()=>{
                                      MNUtil.undoGrouping(()=>{
                                        focusNote.refresh()
                                        if (!focusNote.excerptText && !focusNote.ifIndependentNote() && !focusNote.ifReferenceNote()) {
                                          focusNote.addToReview()
                                        }
                                      })
                                    })
                                  })
                                }
                              })
                            }
                          }
                        )
                      } else {
                        if (!focusNote.excerptText) {
                          toolbarUtils.TemplateMakeNote(focusNote)
                          if (!focusNote.ifReferenceNote()) {
                            focusNote.addToReview()
                          }
                          focusNote.focusInMindMap(0.3) 
                        } else {
                          focusNote.toNoExceptVersion()
                          focusNote.focusInMindMap(0.3)             
                          MNUtil.delay(0.3).then(()=>{
                            focusNote = MNNote.getFocusNote()
                            MNUtil.delay(0.3).then(()=>{
                              toolbarUtils.TemplateMakeNote(focusNote)
                            })
                            MNUtil.delay(0.5).then(()=>{
                              MNUtil.undoGrouping(()=>{
                                focusNote.refresh()
                                if (!focusNote.excerptText && !focusNote.ifIndependentNote() && !focusNote.ifReferenceNote()) {
                                  focusNote.addToReview()
                                }
                              })
                            })
                          })
                        }
                      }
                    }
                  }
                }
              } catch (error) {
                MNUtil.showHUD(error);
              }
            })
            break;
        }
        break;
      /**
       * 撤回上一个任务状态
       */
      case "undoOKRNoteMake": // new
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            toolbarUtils.OKRNoteMake(focusNote, true)
          })
        })
        break;
      /**
       * 更新卡片的标签为当天
       */
      case "updateTodayTimeTag": // new
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            toolbarUtils.updateTodayTimeTag(focusNote)
          })
        })
        break;
      /**
       * 增加今日时间标签
       */
      case "addTodayTimeTag": // new
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            toolbarUtils.addTodayTimeTag(focusNote)
          })
        })
        break;
      /**
       * 更新时间标签
       */
      case "updateTimeTag": // new
        MNUtil.undoGrouping(()=>{
          focusNotes.forEach(focusNote=>{
            toolbarUtils.updateTimeTag(focusNote)
          })
        })
        break;
      /**
       * 修改子卡片标题（仅子卡片，不包含子卡片的子卡片）
       */
      case "changeChildNotesTitles": // new
        MNUtil.undoGrouping(()=>{
          focusNote.childNotes.forEach(childNote => {
            if (childNote.ifIndependentNote()) {
              // 独立卡片双击时把父卡片的标题作为前缀
              if (!childNote.title.ifWithBracketPrefix()) {
                childNote.title = childNote.parentNote.noteTitle.toBracketPrefixContentArrowSuffix() + childNote.title
              } else {
                // 有前缀的话，就更新前缀
                childNote.title = childNote.parentNote.noteTitle.toBracketPrefixContentArrowSuffix() + childNote.title.toNoBracketPrefixContent()
              }
            } else {
              childNote.changeTitle()
              childNote.refreshAll()
            }
          })
        })
        break;
      /**
       * 修改子孙卡片标题（包含子卡片的子卡片）
       */
      case "changeDescendantNotesTitles": // new
        MNUtil.undoGrouping(()=>{
          focusNote.descendantNodes.descendant.forEach(descendantNote => {
            // descendantNote.changeTitle()
            // descendantNote.refreshAll()
            if (descendantNote.ifIndependentNote()) {
              // 独立卡片双击时把父卡片的标题作为前缀
              if (!descendantNote.title.ifWithBracketPrefix()) {
                descendantNote.title = descendantNote.parentNote.noteTitle.toBracketPrefixContentArrowSuffix() + descendantNote.title
              } else {
                // 有前缀的话，就更新前缀
                descendantNote.title = descendantNote.parentNote.noteTitle.toBracketPrefixContentArrowSuffix() + descendantNote.title.toNoBracketPrefixContent()
              }
            } else {
              descendantNote.changeTitle()
              descendantNote.refreshAll()
            }
          })
        })
        break;
      /**
       * 子卡片制卡（仅子卡片）
       */
      case "TemplateMakeChildNotes": // new
        MNUtil.undoGrouping(()=>{
          focusNote.childNotes.forEach(childNote => {
            toolbarUtils.TemplateMakeNote(childNote)
            childNote.refreshAll()
          })
        })
        break;
      /**
       * 子孙卡片制卡（包含子卡片的子卡片）
       */
      case "TemplateMakeDescendantNotes": // new
        MNUtil.undoGrouping(()=>{
          focusNote.descendantNodes.descendant.forEach(descendantNote => {
            toolbarUtils.TemplateMakeNote(descendantNote)
            descendantNote.refreshAll()
          })
        })
        break;
      /**
       * 打开任务管理学习集到浮动脑图
       */
      case "openTasksFloatMindMap": // new
        let OKRNote = MNNote.new("690ABF82-339C-4AE1-8BDB-FA6796204B27")
        OKRNote.focusInFloatMindMap()
        break;
      /**
       * 把卡片加入 Inbox
       */
      case "moveToInbox": // new
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              MNMath.moveNoteToInbox(focusNote)
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /**
       * 卡片固定和储存
       */
      case "openPinnedNote-1": 
        pinnedNote = MNNote.new("1346BDF1-7F58-430F-874E-B814E7162BDF") // Hᵖ(D)
        pinnedNote.focusInFloatMindMap()
        break;
      case "openPinnedNote-2":
        pinnedNote = MNNote.new("89042A37-CC80-4FFC-B24F-F8E86CB764DC") // Lᵖ(T)
        pinnedNote.focusInFloatMindMap()
        break;
      case "openPinnedNote-3":
        pinnedNote = MNNote.new("D7DEDE97-1B87-4BB6-B607-4FB987F230E4") // Hᵖ(T)
        pinnedNote.focusInFloatMindMap()
        break;
      case "splitMarkdownTextInFocusNote": 
        toolbarUtils.markdown2Mindmap({source:"currentNote"})
        break;
      case "renewExcerptInParentNoteByFocusNote":
        MNUtil.undoGrouping(()=>{
          try {
            toolbarUtils.renewExcerptInParentNoteByFocusNote(focusNote)
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "changeTitlePrefix":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              focusNote.title = focusNote.title.toNoBracketPrefixContent()
              focusNote.changeTitle()
              focusNote.refreshAll()
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      case "removeTitlePrefix":
        MNUtil.undoGrouping(()=>{
          try {
            focusNotes.forEach(focusNote=>{
              focusNote.title = focusNote.title.toNoBracketPrefixContent()
              focusNote.refreshAll()
            })
          } catch (error) {
            MNUtil.showHUD(error);
          }
        })
        break;
      /* 夏大鱼羊定制 - end */
      case "chatAI":
        toolbarUtils.chatAI(des,button)
        break
      case "search":
        toolbarUtils.search(des,button)
        break;
      case "openWebURL":
        toolbarUtils.openWebURL(des)
        break;
      case "addImageComment":
        let source = des.source ?? "photo"
        this.compression = des.compression ?? true
        this.currentNoteId = focusNote.noteId
        switch (source) {
          case "camera":
            this.imagePickerController = UIImagePickerController.new()
            this.imagePickerController.delegate = this  // 设置代理
            this.imagePickerController.sourceType = 1  // 设置图片源为相机
            // this.imagePickerController.allowsEditing = true  // 设置图片源为相册
            MNUtil.studyController.presentViewControllerAnimatedCompletion(this.imagePickerController,true,undefined)
            break;
          case "photo":
            this.imagePickerController = UIImagePickerController.new()
            this.imagePickerController.delegate = this  // 设置代理
            this.imagePickerController.sourceType = 0  // 设置图片源为相册
            // this.imagePickerController.allowsEditing = true  // 设置图片源为相册
            MNUtil.studyController.presentViewControllerAnimatedCompletion(this.imagePickerController,true,undefined)
            break;
          case "file":
            let UTI = ["public.image"]
            let path = await MNUtil.importFile(UTI)
            let imageData = MNUtil.getFile(path)
            MNUtil.showHUD("Import: "+MNUtil.getFileName(path))
            MNUtil.copyImage(imageData)
            focusNote.paste()
            break;
          default:
            MNUtil.showHUD("unknown source")
            break;
        }
        // this.presentViewControllerAnimatedCompletion(this.imagePickerController,true,undefined)
        // 展示图片选择器
        // present(imagePickerController, animated: true, completion: nil)
        break;
      case "focus":
        await toolbarUtils.focus(des)
        break 
      case "showMessage":
        toolbarUtils.showMessage(des)
        break
      case "confirm":
        let targetDes = await toolbarUtils.userConfirm(des)
        if (targetDes) {
          success = await this.customActionByDes(button, targetDes) 
        }else{
          success = false
          MNUtil.showHUD("No valid argument!")
        }
        break
      case "userSelect":
        let selectDes = await toolbarUtils.userSelect(des)
        if (selectDes) {
          success = await this.customActionByDes(button, selectDes) 
        }else{
          success = false
          MNUtil.showHUD("No valid argument!")
        }
        break
      case "toggleView":
        if ("targets" in des) {
          des.targets.map(target=>{
            MNUtil.postNotification("toggleMindmapToolbar", {target:target})
          })
        }else{
          MNUtil.postNotification("toggleMindmapToolbar", {target:des.target})
        }
        break
      case "export":
        toolbarUtils.export(des)
        // let exportTarget = des.target ?? "auto"
        // let docPath = MNUtil.getDocById(focusNote.note.docMd5).fullPathFileName
        // MNUtil.saveFile(docPath, ["public.pdf"])
        break;
      case "setButtonImage":
        if (!des.hideMessage) {
          MNUtil.showHUD("setButtonImage...")
        }
        await MNUtil.delay(0.01)
        if ("imageConfig" in des) {
          let config = des.imageConfig
          let keys = Object.keys(config)
          for (let i = 0; i < keys.length; i++) {
            let url = config[keys[i]].url
            let scale = config[keys[i]].scale??3
            MNUtil.showHUD("setButtonImage: "+keys[i])
            toolbarConfig.setImageByURL(keys[i], url,false,scale)
          }
          // await Promise.all(asyncActions)
          MNUtil.postNotification("refreshToolbarButton", {})
        }else{
          MNUtil.showHUD("Missing imageConfig")
        }
        break;
      case "setColor":
        await toolbarUtils.setColor(des)
        break;
      case "triggerButton":
        let targetButtonName = des.buttonName
        success = await this.customActionByButton(button, targetButtonName)
        break;
      default:
        MNUtil.showHUD("Not supported yet...")
        break;
    }
    if (button.delay) {
      this.hideAfterDelay()
      toolbarUtils.dismissPopupMenu(button.menu,true)
    }else{
      toolbarUtils.dismissPopupMenu(button.menu)
    }
    let delay = des.delay ?? 0.5
    if (success && "onSuccess" in des) {
      let finishAction = des.onSuccess
      await MNUtil.delay(delay)
      await this.customActionByDes(button, finishAction)
      return new Promise((resolve, reject) => {
        resolve()
      })
    } 
    if (!success && "onFailed" in des) {
      let finishAction = des.onFailed
      await MNUtil.delay(delay)
      await this.customActionByDes(button, finishAction)
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
    if ("onFinish" in des) {
      let finishAction = des.onFinish
      await MNUtil.delay(delay)
      await this.customActionByDes(button, finishAction)
      return new Promise((resolve, reject) => {
        resolve()
      })
    }
    return new Promise((resolve, reject) => {
      resolve()
    })
    // if (this.dynamicWindow) {
    //   this.hideAfterDelay()
    // }
    // copyJSON(des)
  } catch (error) {
    toolbarUtils.addErrorLog(error, "customActionByDes")
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
  if (menu) {
    let ids = menu.items.map(item=>{
      if (item.actionString) {
        return item.actionString.replace(":", "")
      }
      return ""
    })
    let maxButtonNumber = (ids.length == menu.subviews.length)?ids.length:menu.subviews.length-1
    // MNUtil.showHUD("message"+ids.length+";"+menu.subviews.length)
    // MNUtil.showHUD(message)
    for (let i = 0; i < maxButtonNumber; i++) {
      if (!ids[i]) {
        continue
      }
      let popupButton = menu.subviews[i].subviews[0]
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
      let popupButton = menu.subviews[i].subviews[0]
      let popupConfig = toolbarConfig.getPopupConfig(ids[i])
      // MNUtil.showHUD("message"+menu.subviews.length)

      if (!popupConfig) {
        MNUtil.showHUD("Unknown popup button: "+ids[i])
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
      let popupButton = menu.subviews[i].subviews[0]
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
        if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
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
      if (MNUtil.studyView.bounds.width - buttonX < (width+40)) {
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
    if (frame.x + width > MNUtil.studyView.bounds.width) {
      width = MNUtil.studyView.bounds.width - frame.x
    }
    width = toolbarUtils.checkHeight(width,this.maxButtonNumber)
    targetFrame.width = width
    targetFrame.height = 40
    targetFrame.x = toolbarUtils.constrain(targetFrame.x, 0, MNUtil.studyView.bounds.width-width)
    targetFrame.y = toolbarUtils.constrain(targetFrame.y, 0, MNUtil.studyView.bounds.height-40)
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
    if (frame.y + height > MNUtil.studyView.bounds.height) {
      height = MNUtil.studyView.bounds.height - frame.y
    }
    height = toolbarUtils.checkHeight(height,this.maxButtonNumber)
    targetFrame.height = height
  }
  this.view.frame = targetFrame
  this.currentFrame = targetFrame
}