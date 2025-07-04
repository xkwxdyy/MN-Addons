class SnipasteHistoryManager {
  constructor() {
    this.history = []; // 存储历史记录
    this.currentIndex = -1; // 当前索引位置
  }

  /**
   * 添加历史记录
   * @param {string} type - 记录类型
   * @param {string|number} id - 记录ID
   * @param {string} content
   */
  addRecord(type, id, content) {
    // 如果在历史记录中间添加新记录，则删除后面的记录
    if (this.currentIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.currentIndex + 1);
    }
    
    this.history.push({ type, id ,content});
    this.currentIndex = this.history.length - 1;
  }

  /**
   * 向前导航
   * @returns {object|null} 返回前一条记录，如果没有则返回null
   */
  goBack() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.history[this.currentIndex];
    }
    return null;
  }

  /**
   * 向后导航
   * @returns {object|null} 返回后一条记录，如果没有则返回null
   */
  goForward() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      return this.history[this.currentIndex];
    }
    return null;
  }

  /**
   * 获取当前记录
   * @returns {object|null} 返回当前记录，如果没有则返回null
   */
  getCurrent() {
    if (this.currentIndex >= 0 && this.currentIndex < this.history.length) {
      return this.history[this.currentIndex];
    }
    return null;
  }

  /**
   * 清空历史记录
   */
  clear() {
    this.history = [];
    this.currentIndex = -1;
  }
}

// // 使用示例
// const historyManager = new HistoryManager();

// // 添加记录
// historyManager.addRecord('page', 1);
// historyManager.addRecord('page', 2);
// historyManager.addRecord('product', 'abc123');

// // 导航测试
// console.log(historyManager.goBack()); // { type: 'page', id: 2 }
// console.log(historyManager.goBack()); // { type: 'page', id: 1 }
// console.log(historyManager.goForward()); // { type: 'page', id: 2 }
// console.log(historyManager.goForward()); // { type: 'product', id: 'abc123' }

// // 添加新记录会截断后面的历史
// historyManager.addRecord('category', 5);
// console.log(historyManager.goBack()); // { type: 'product', id: 'abc123' }
// console.log(historyManager.goForward()); // { type: 'category', id: 5 }

class snipasteUtils{
  static errorLog = []
  /**
   * 
   * @param {string} fullPath 
   * @returns {string}
   */
  static getExtensionFolder(fullPath) {
      // 找到最后一个'/'的位置
      let lastSlashIndex = fullPath.lastIndexOf('/');
      // 从最后一个'/'之后截取字符串，得到文件名
      let fileName = fullPath.substring(0,lastSlashIndex);
      return fileName;
  }
  static checkMNUtilsFolder(fullPath){
    let extensionFolder = this.getExtensionFolder(fullPath)
    let folderExists = NSFileManager.defaultManager().fileExistsAtPath(extensionFolder+"/marginnote.extension.mnutils/main.js")
    if (!folderExists) {
      snipasteUtils.showHUD("MN Snipaste: Please install 'MN Utils' first!",5)
    }
    return folderExists
  }
  static async delay (seconds) {
    return new Promise((resolve, reject) => {
      NSTimer.scheduledTimerWithTimeInterval(seconds, false, function () {
        resolve()
      })
    })
  }
  static showHUD(message,duration=2) {
    let app = Application.sharedInstance()
    app.showHUD(message,app.focusWindow,duration)
  }
  static async checkMNUtil(alert = false,delay = 0.01){
    if (typeof MNUtil === 'undefined') {//如果MNUtil未被加载，则执行一次延时，然后再检测一次
      //仅在MNUtil未被完全加载时执行delay
      await snipasteUtils.delay(delay)
      if (typeof MNUtil === 'undefined') {
        if (alert) {
          snipasteUtils.showHUD("MN Snipaste: Please install 'MN Utils' first!",5)
        }
        return false
      }
    }
    return true
  }
  static getDocImage(){
    let docMapSplitMode = MNUtil.studyController.docMapSplitMode
    if (docMapSplitMode) {//不为0则表示documentControllers存在
      let imageData
      let docControllers = MNUtil.docControllers
      let docNumber = docControllers.length
      for (let i = 0; i < docNumber; i++) {
        const docController = docControllers[i];
        imageData = docController.imageFromSelection()
        if (imageData) {
          return imageData
        }
      }
    }else{
      return undefined
    }
  }
  static checkLogo(){
    if (typeof MNUtil === 'undefined') return false
    if (typeof toolbarConfig !== 'undefined' && toolbarConfig.addonLogos && ("MNSnipaste" in toolbarConfig.addonLogos) && !toolbarConfig.addonLogos["MNSnipaste"]) {
        return false
    }
    return true
  }
  /**
   * 
   * @param {NSData} data 
   */
  static exportFile(data,fileName,UTI){
    data.writeToFileAtomically(MNUtil.tempFolder+"/"+fileName, false)
    MNUtil.saveFile(MNUtil.tempFolder+"/"+fileName, [UTI])
  }
  /**
   * 
   * @param {UIWebView} webview 
   * @param {number} width 
   * @returns {Promise<NSData>}
   */
  static async screenshot(webview,width=1000){
    return new Promise((resolve, reject) => {
      webview.takeSnapshotWithWidth(width,(snapshot)=>{
        try {
        resolve(snapshot.pngData())
          
        } catch (error) {
          MNUtil.showHUD(error)
        }
      })
    })
  }

  /**
   * 
   * @param {string} text 
   * @param {string} type 
   * @param {string} className 
   * @returns 
   */
  static wrapText(text,type,className) {
  if (className) {
    return `<${type} class="${className}" draggable="true" ondragstart="event.dataTransfer.setData('text/plain', this.innerText)" onclick="copyText(this.innerText)">${text}</${type}>`
  }else{
    return `<${type} draggable="true" ondragstart="event.dataTransfer.setData('text/plain', this.innerText)" onclick="copyText(this.innerText)">${text}</${type}>`
  }
}
  static getNewLoc(gesture,referenceView = MNUtil.studyView){
    let locationToMN = gesture.locationInView(referenceView)
    if (!gesture.moveDate) {
      gesture.moveDate = 0
    }
    if ((Date.now() - gesture.moveDate) > 100) {
      let translation = gesture.translationInView(referenceView)
      let locationToBrowser = gesture.locationInView(gesture.view.superview)
      // if (gesture.state !== 3 && Math.abs(translation.y)<20 && Math.abs(translation.x)<20) {
      if (gesture.state === 1) {
        gesture.locationToBrowser = {x:locationToBrowser.x-translation.x,y:locationToBrowser.y-translation.y}
        // MNUtil.showHUD(JSON.stringify(gesture.locationToBrowser))
      }
    }
    // MNUtil.showHUD(JSON.stringify(locationToMN))
    if (locationToMN.x <= 0) {
      locationToMN.x = 0
    }
    if (locationToMN.x > referenceView.frame.width) {
      locationToMN.x = referenceView.frame.width
    }
    gesture.moveDate = Date.now()
    // let location = {x:locationToMN.x - self.locationToButton.x-gesture.view.frame.x,y:locationToMN.y -self.locationToButton.y-gesture.view.frame.y}
    let location = {x:locationToMN.x - gesture.locationToBrowser.x,y:locationToMN.y -gesture.locationToBrowser.y}
    location.toMN = locationToMN
    if (location.y <= 0) {
      location.y = 0
    }
    if (location.y>=referenceView.frame.height-15) {
      location.y = referenceView.frame.height-15
    }
    return location
  }
  static addErrorLog(error,source,info){
    MNUtil.showHUD("MN Snipaste Error ("+source+"): "+error)
    let tem = {source:source,time:(new Date(Date.now())).toString()}
    if (error.detail) {
      tem.error = {message:error.message,detail:error.detail}
    }else{
      tem.error = error.message
    }
    if (info) {
      tem.info = info
    }
    this.errorLog.push(tem)
    MNUtil.copy(this.errorLog)
  }
}


function shouldPrevent(currentURL,requestURL,type) {
  let firstCheck = Application.sharedInstance().osType === 0 && (type===0 || /^https:\/\/m.inftab.com/.test(currentURL))
  if (firstCheck) {
    let blacklist = ["^https?://www.bilibili.com","^https?://m.bilibili.com","^https?://space.bilibili.com","^https?://t.bilibili.com","^https?://www.wolai.com","^https?://flowus.com","^https?://www.notion.so"]
    if (blacklist.some(url=>RegExp(url).test(requestURL))) {
      return true
    }
  }
  return false
}

function showHUD(message,duration=2) {
  let focusWindow = Application.sharedInstance().focusWindow
  Application.sharedInstance().showHUD(message,focusWindow,duration)
}
function getImage(path,scale=2) {
  return UIImage.imageWithDataScale(NSData.dataWithContentsOfFile(path), scale)
}

function setLocalDataByKey(value,key) {
  NSUserDefaults.standardUserDefaults().setObjectForKey(value,key)
  NSUserDefaults.standardUserDefaults().synchronize()
}

function getLocalDataByKey(key) {
  return NSUserDefaults.standardUserDefaults().objectForKey(key)
}

function getLocalDataByKeyDefault(key,defaultValue) {
  let value = NSUserDefaults.standardUserDefaults().objectForKey(key)
  if (value === undefined) {
    NSUserDefaults.standardUserDefaults().setObjectForKey(defaultValue,key)
    return defaultValue
  }
  return value
}

function addObserver(object,target,notification) {
  NSNotificationCenter.defaultCenter().addObserverSelectorName(object, target, notification);
}
function removeObservers(object,notifications) {
  notifications.forEach(notification=>{
    NSNotificationCenter.defaultCenter().removeObserverName(object, notification);
  })
}

function getPopoverAndPresent(sender,commandTable,width=100) {
  var menuController = MenuController.new();
  menuController.commandTable = commandTable
  menuController.rowHeight = 35;
  menuController.preferredContentSize = {
    width: width,
    height: menuController.rowHeight * menuController.commandTable.length
  };
  var popoverController = new UIPopoverController(menuController);
  let focusWindow = Application.sharedInstance().focusWindow
  var studyController = Application.sharedInstance().studyController(focusWindow);
  var r = sender.convertRectToView(sender.bounds,studyController.view);
  popoverController.presentPopoverFromRect(r, studyController.view, 1 << 1, true);
  return popoverController
}

function calcDistance(vec1,vec2) {
  let dis = 0
  for (let i = 0; i < 1024; i++) {
    dis = dis+Math.pow((vec1[i]-vec2[i]),2)
  }
  return Math.sqrt(dis)
} 

function getMindmapNodes() {
  let focusWindow = Application.sharedInstance().focusWindow
  return Application.sharedInstance().studyController(focusWindow).notebookController.mindmapView.mindmapNodes;
}

function getSelectedNotes() {
  let focusWindow = Application.sharedInstance().focusWindow
  return Application.sharedInstance().studyController(focusWindow).notebookController.mindmapView.selViewLst.map(item=>item.note.note);
}

function getNotebookNotes(notebookid) {
  let notebook = Database.sharedInstance().getNotebookById(notebookid)
  return notebook.notes
  // let focusWindow = Application.sharedInstance().focusWindow
  // return Application.sharedInstance().studyController(focusWindow).notebookController.mindmapView.mindmapNodes;
}

function getNotebookFlashCards(notebookid) {
  let notebook = Database.sharedInstance().getNotebookById(notebookid)
  return notebook.notes.filter(note=>Database.sharedInstance().hasFlashcardByNoteId(note.noteId))
  // let focusWindow = Application.sharedInstance().focusWindow
  // return Application.sharedInstance().studyController(focusWindow).notebookController.mindmapView.mindmapNodes;
}

function vectorFormatter(vector) {
  let formatted = vector.map(vec=>{
    if (vec.doubleValue) {
      return Number(vec.doubleValue().toFixed(2))
    }else{
      return Number(vec.toFixed(2))
    }
  })
  return formatted
}

/**
 * 在数据来源控制为两位小数即可，其他地方不需要再调用vectorFormatter，会明显降低速度
 * @param {String} apikey
 * @param {String} text
 * @returns {Promise<number[]>}
 */
async function getVec(apikey,text) {
  let final_sign = getAuthorization(apikey)
  let vector = await fetchEmbedding(final_sign,text)
  if (!vector) {
    showHUD("error")
    return undefined
  }
  let nums = vectorFormatter(vector)
  return nums
}


function hasVec(note) {
  let comments = note.comments.filter(comment=>comment.type == "HtmlNote" && /^vector:\/\//.test(comment.text))
  if (comments.length) {
    return true
  }else{
    return false
  }
}


function focusNote(note) {
  let focusWindow = Application.sharedInstance().focusWindow
  showHUD(note.noteId)
  return Application.sharedInstance().studyController(focusWindow).focusNoteInMindMapById(note.noteId)
}

function getTextForSearch (note,order) {
    let text
    for (let index = 0; index < order.length; index++) {
      const element = order[index];
      switch (element) {
        case 1:
          if (note.noteTitle && note.noteTitle !== "") {
            text = note.noteTitle
          }
          break;
        case 2:
          if (note.excerptText && note.excerptText !== "" && (!note.excerptPic || note.textFirst)) {
            text = note.excerptText
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
            // showHUD("comment")
            text = commentText
          }
          break;
        default:
          break;
      }
      if (text) {
        // showHUD(text)
        return text
      }
    }
  // showHUD("No text found")
  return ""
  }
async function delay(time) {
  return new Promise((resolve, reject) => {
    NSTimer.scheduledTimerWithTimeInterval(time, false, function () {
      resolve()
    })
  })
}

function studyController() {
  let focusWindow = Application.sharedInstance().focusWindow
  return Application.sharedInstance().studyController(focusWindow)
}