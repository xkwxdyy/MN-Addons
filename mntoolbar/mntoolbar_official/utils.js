

class Frame{
  static gen(x,y,width,height){
    return MNUtil.genFrame(x, y, width, height)
  }
  /**
   * 
   * @param {UIView} view 
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
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
  static sameFrame(frame1,frame2){
    if (frame1.x === frame2.x && frame1.y === frame2.y && frame1.width === frame2.width && frame1.height === frame2.height) {
      return true
    }
    return false
  }
  /**
   * 
   * @param {UIView} view 
   * @param {number} x
   */
  static setX(view,x){
    let frame = view.frame
    frame.x = x
    view.frame = frame
  }
  /**
   * 
   * @param {UIView} view 
   * @param {number} y
   */
  static setY(view,y){
    let frame = view.frame
    frame.y = y
    view.frame = frame
  }
  /**
   * 
   * @param {UIView} view
   * @param {number} x 
   * @param {number} y 
   */
  static setLoc(view,x,y){
    let frame = view.frame
    frame.x = x
    frame.y = y
    if (view.width) {
      frame.width = view.width
    }
    if (view.height) {
      frame.height = view.height
    }
    view.frame = frame
  }
  /**
   * 
   * @param {UIView} view 
   * @param {number} width 
   * @param {number} height 
   */
  static setSize(view,width,height){
    let frame = view.frame
    frame.width = width
    frame.height = height
    view.frame = frame
  }
  /**
   * 
   * @param {UIView} view 
   * @param {number} width
   */
  static setWidth(view,width){
    let frame = view.frame
    frame.width = width
    view.frame = frame
  }
  /**
   * 
   * @param {UIView} view 
   * @param {number} height
   */
  static setHeight(view,height){
    let frame = view.frame
    frame.height = height
    view.frame = frame
  }
  /**
   * 
   * @param {UIView} view 
   * @param {number} xDiff
   */
  static moveX(view,xDiff){
    let frame = view.frame
    frame.x = frame.x+xDiff
    view.frame = frame
  }
  /**
   * 
   * @param {UIView} view 
   * @param {number} yDiff
   */
  static moveY(view,yDiff){
    let frame = view.frame
    frame.y = frame.y+yDiff
    view.frame = frame
  }
}



// 获取UITextView实例的所有属性
function getAllProperties(obj) {
    var props = [];
    var proto = obj;
    while (proto) {
        props = props.concat(Object.getOwnPropertyNames(proto));
        proto = Object.getPrototypeOf(proto);
    }
    return props;
}
// 定义一个类
class toolbarUtils {
  // 构造器方法，用于初始化新创建的对象
  constructor(name) {
    this.name = name;
  }
  /**@type {string} */
  static previousNoteId
  static errorLog = []
  static version
  static currentNoteId
  static currentSelection
  static isSubscribe = false
  static mainPath
  static studylist = []
  static settingViewOpened = false
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
  static init(mainPath){
  try {
    this.app = Application.sharedInstance()
    this.data = Database.sharedInstance()
    this.focusWindow = this.app.focusWindow
    this.mainPath = mainPath
    this.version = this.appVersion()
    this.errorLog = [this.version]
    this.topOffset = MNUtil.isMacOS()?30:22
    this.bottomOffset = MNUtil.isMacOS()?0:10
      } catch (error) {
    this.addErrorLog(error, "init")
  }
  }
  static showHUD(message,duration=2) {
    this.app.showHUD(message,this.focusWindow,2)
  }
  static refreshSubscriptionStatus(){
    this.isSubscribe = this.checkSubscribe(false,false,true)
  }

  static appVersion() {
    let info = {}
    let version = parseFloat(this.app.appVersion)
    if (version >= 4) {
      info.version = "marginnote4"
    }else{
      info.version = "marginnote3"
    }
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
    if (this.mainPath) {
      let toolbarVersion = MNUtil.readJSON(this.mainPath+"/mnaddon.json").version
      info.toolbarVersion = toolbarVersion
    }
    return info
  }
  static  getNoteColors() {
    return ["#ffffb4","#ccfdc4","#b4d1fb","#f3aebe","#ffff54","#75fb4c","#55bbf9","#ea3323","#ef8733","#377e47","#173dac","#be3223","#ffffff","#dadada","#b4b4b4","#bd9fdc"]
  }
  static getNoteById(noteid) {
    let note = this.data.getNoteById(noteid)
    return note
  }
  static getNoteBookById(notebookId) {
    let notebook = this.data.getNotebookById(notebookId)
    return notebook
  }
  static getUrlByNoteId(noteid) {
    let ver = this.appVersion()
    return ver.version+'app://note/'+noteid
  }
  /**
   * 
   * @param {String} url 
   * @returns {String}
   */
  static getNoteIdByURL(url) {
    let targetNoteId = url.trim()
    if (/^marginnote\dapp:\/\/note\//.test(targetNoteId)) {
      targetNoteId = targetNoteId.slice(22)
    }
    return targetNoteId
  }
  static clipboardText() {
    return UIPasteboard.generalPasteboard().string
  }
  static getActionOptions(des,prefix = undefined){
    let actionName = des.action
    let keys = Object.keys(des)
    let menuItems = []
    switch (actionName) {
      case "toggleTextFirst":
        menuItems = ["range"]
        break;
      case "command":
        menuItems = ["command","commands"]
        break;
      case "toggleMarkdown":
        menuItems = ["targetMode","range"]
        break;
      case "copy":
        menuItems = ["target","index","content","varName"]
        break;
      case "addComment":
        menuItems = ["content","markdown","index"]
        break;
      case "markdown2Mindmap":
        menuItems = ["source","method"]
        break;
      case "addMarkdownLink":
        menuItems = ["title","link"]
        break;
      case "addImageComment":
        menuItems = ["target","source","compression"]
        break;
      case "addChildNote":
        menuItems = ["title","content","markdown","color"]
        break;
      case "addBrotherNote":
        menuItems = ["title","content","markdown","color"]
        break;
      case "addTags":
        menuItems = ["tag","tags"]
        break;
      case "mergeText":
        menuItems = ["target","source","range","varName"]
        break;
      case "ocr":
        menuItems = ["target","ocrSource","method","followParentColor","varName"]
        break;
      case "toggleSidebar":
        menuItems = ["target"]
        break;
      case "toggleView":
        menuItems = ["target","targets"]
        break;
      case "menu":
        menuItems = ["menuItems","menuWidth"]
        break;
      case "shortcut":
        menuItems = ["name"]
        break;
      case "replace":
        menuItems = ["target","content","from","to","reg","steps","range","varName"]
        break;
      case "showInFloatWindow":
        menuItems = ["noteURL","target","varName"]
        break;
      case "export":
        menuItems = ["source","target"]
        break;
      case "removeComment":
        menuItems = ["type","types","multi"]
        break;
      case "paste":
        menuItems = ["target"]
        break;
      case "setContent":
        menuItems = ["target","content","range","varName"]
        break;
      case "clearContent":
        menuItems = ["target","type","allowDeleteNote","range","index"]
        break;
      case "openURL":
        menuItems = ["url"]
        break;
      case "setTimer":
        menuItems = ["target","timerMode","minutes","annotation"]
        break;
      case "removeTags":
        menuItems = ["target","tags","tag"]
        break;
      case "searchInDict":
        menuItems = ["target"]
        break;
      case "setColor":
        menuItems = ["color","fillPattern","followAutoStyle","usingCommand","asTitleForNewNote","wordThreshold"]
        break;
      case "userSelect":
        menuItems = ["title","subTitle","selectItems"]
        break;
      case "showMessage":
        menuItems = ["content"]
        break;
      case "confirm":
        menuItems = ["title","subTitle","onCancel","onConfirm"]
        break;
      case "tirggerButton":
        menuItems = ["buttonName"]
        break;
      case "focus":
        menuItems = ["source","target","noteURL","forceToFocus","varName"]
        break;
      case "insertSnippet":
        menuItems = ["content","target"]
        break;
      case "moveNote":
        menuItems = ["mainMindMap","noteURL"]
        break;
      case "noteHighlight":
        menuItems = ["color","fillPattern","asTitle","title","ocr","tags","tag","parentNote","mainMindMap","textFirst","focusAfterDelay","focusInFloatWindowForAllDocMode","markdown","continueExcerpt","wordThreshold"]
        break;
      case "snipaste":
        menuItems = ["target","page","audioAction","audioAutoPlay"]
        break;
      case "search":
        menuItems = ["target","engine","followButton"]
        break;
      case "openInEditor":
        menuItems = ["followButton"]
        break;
      case "chatAI":
        menuItems = ["target","prompt","user","system","numberOfPrompts"]
        break;
      default:
        break;
    }
    if (prefix) {
      if (!("onFinish" in des)) {
        menuItems = menuItems.concat(["onFinish"])
      }
      menuItems = menuItems.filter(item=>!keys.includes(item))
      return menuItems.map(item=>prefix+item)
    }else{
      menuItems = menuItems.concat(["onLongPress","onFinish","description"])
      menuItems = menuItems.filter(item=>!keys.includes(item))
      return menuItems
    }
  }
  static addActionOption(config,item){
    switch (item) {
      case "onLongPress":
        config.onLongPress = {action:""}
        break;
      case "onFinish":
        config.onFinish = {action:""}
        break;
      case "onCancel":
        config.onCancel = {action:""}
        break;
      case "onConfirm":
        config.onConfirm = {action:""}
        break;
      case "markdown":
      case "compression":
      case "followParentColor":
      case "multi":
      case "allowDeleteNote":
      case "followAutoStyle":
      case "forceToFocus":
      case "textFirst":
      case "focusInFloatWindowForAllDocMode":
      case "mainMindMap":
      case "ocr":
      case "asTitle":
      case "asTitleForNewNote":
      case "usingCommand":
      case "audioAutoPlay":
        config[item] = true
        break;
      case "wordThreshold":
        config.wordThreshold = 30
        break;
      case "numberOfPrompts":
        config.numberOfPrompts = 20
        break;
      default:
        config[item] = ""
        break;
    }
    return config
  }
  static mergeWhitespace(str) {
      if (!str) {
        return ""
      }
      // 先将多个连续的换行符替换为双换行符
      var tempStr = str.replace(/\n+/g, '\n\n');
      // 再将其它的空白符（除了换行符）替换为单个空格
      return tempStr.replace(/[\r\t\f\v ]+/g, ' ').trim();
  }
static replaceAction(des){
try {
  if (des.target === "globalVar") {
    if (!des.varName) {
      MNUtil.showHUD("❌ varName not found")
      return
    }
    let content = des.content ?? toolbarSandbox.getValue(des.varName)
    content = this.detectAndReplace(content)

    if ("steps" in des) {//如果有steps则表示是多步替换,优先执行
      let nSteps = des.steps.length
      for (let i = 0; i < nSteps; i++) {
        let step = des.steps[i]
        let ptt = this._replace_get_ptt_(step)
        content = content.replace(ptt, step.to)
      }
      toolbarSandbox.setValue(des.varName, content)
      return;
    }
    let ptt = this._replace_get_ptt_(des)
    content = content.replace(ptt, des.to)
    toolbarSandbox.setValue(des.varName, content)
    return
  }
  if (des.target === "clipboardText") {
    let content = des.content ?? MNUtil.clipboardText
    content = this.detectAndReplace(content)
    if ("steps" in des) {//如果有steps则表示是多步替换,优先执行
      let nSteps = des.steps.length
      for (let i = 0; i < nSteps; i++) {
        let step = des.steps[i]
        let ptt = this._replace_get_ptt_(step)
        content = content.replace(ptt, step.to)
      }
      MNUtil.copy(content)
      return;
    }
    let ptt = this._replace_get_ptt_(des)
    content = content.replace(ptt, des.to)
    MNUtil.copy(content)
    return
  }

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
static isPureMNImages(markdown) {
  try {
    // 匹配 base64 图片链接的正则表达式
    const MNImagePattern = /!\[.*?\]\((marginnote4app\:\/\/markdownimg\/png\/.*?)(\))/g;
    let res = markdown.match(MNImagePattern)
    if (res) {
      return markdown === res[0]
    }else{
      return false
    }
  } catch (error) {
    toolbarUtils.addErrorLog(error, "isPureMNImages")
    return false
  }
}
static hasMNImages(markdown) {
  try {
    // 匹配 base64 图片链接的正则表达式
    const MNImagePattern = /!\[.*?\]\((marginnote4app\:\/\/markdownimg\/png\/.*?)(\))/g;
    let link = markdown.match(MNImagePattern)[0]
    // MNUtil.copyJSON({"a":link,"b":markdown})
    return markdown.match(MNImagePattern)?true:false
  } catch (error) {
    toolbarUtils.addErrorLog(error, "hasMNImages")
    return false
  }
}
  /**
   * 
   * @param {string} markdown 
   * @returns {NSData}
   */
static getMNImagesFromMarkdown(markdown) {
  try {
    const MNImagePattern = /!\[.*?\]\((marginnote4app\:\/\/markdownimg\/png\/.*?)(\))/g;
    let link = markdown.match(MNImagePattern)[0]
    // MNUtil.copyJSON(link)
    let hash = link.split("markdownimg/png/")[1].slice(0,-1)
    let imageData = MNUtil.getMediaByHash(hash)
    return imageData
  } catch (error) {
    toolbarUtils.addErrorLog(error, "replaceBase64ImagesWithR2")
    return undefined
  }
}
/**
 * 
 * @param {string} text 
 * @param {UITextView} textView
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
  let pre = textView.text.slice(0,selectedRange.location)
  let post = textView.text.slice(selectedRange.location+selectedRange.length)
  textView.text = pre+text+post
  textView.selectedRange = {location:selectedRange.location+cursorLocation,length:0}
  return true
  } catch (error) {
    this.addErrorLog(error, "insertSnippetToTextView")
    return false
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
    if (location.y <= 0) {
      location.y = 0
    }
    if (location.y>=referenceView.frame.height-15) {
      location.y = referenceView.frame.height-15
    }
    return location
  }
  static strCode(str) {  //获取字符串的字节数
    var count = 0;  //初始化字节数递加变量并获取字符串参数的字符个数
    var cn = [8211, 8212, 8216, 8217, 8220, 8221, 8230, 12289, 12290, 12296, 12297, 12298, 12299, 12300, 12301, 12302, 12303, 12304, 12305, 12308, 12309, 65281, 65288, 65289, 65292, 65294, 65306, 65307, 65311]
    var half = [32, 33, 34, 35, 36, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 123, 124, 125, 126,105,108,8211]
    if (str) {  //如果存在字符串，则执行
      let len = str.length;
        for (var i = 0; i < len; i++) {  //遍历字符串，枚举每个字符
        let charCode = str.charCodeAt(i)
            if (charCode>=65 && charCode<=90) {
              count += 1.5;  //大写
        } else if (half.includes(charCode)) {
              count +=0.45
        } else if (cn.includes(charCode)) {
              count +=0.8
            }else if (charCode > 255) {  //字符编码大于255，说明是双字节字符(即是中文)
                count += 2;  //则累加2个
            }else{
                count++;  //否则递加一次
            }
        }
        return count;  //返回字节数
    } else {
        return 0;  //如果参数为空，则返回0个
    }
  }
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
  static async copy(des) {
    try {
    let focusNote = MNNote.getFocusNote()
    let target = des.target ?? "auto"
    let element = undefined
    if (target) {
      switch (target) {
        case "auto":
          if (!des.content) {
            toolbarUtils.smartCopy()
            return
          }
          break
        case "chatAIOutput":
          if (typeof chatAIUtils === "undefined") {
            MNUtil.showHUD("Install MN ChatAI First!")
            element = ""
          }else{
            element = await chatAIUtils.notifyController.getTextForAction()
          }
          break;
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
        case "textComments":
          if (focusNote && focusNote.comments.length) {
            let textCommentIndices = focusNote.getCommentIndicesByCondition({types:["blankTextComment","mergedTextComment","markdownComment","textComment"]})
            let comments = focusNote.MNComments
            let textComments = textCommentIndices.map(index=>comments[index])
            element = textComments.map(comment=>comment.text).join("\n")
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
        case "globalVar":
          if (des.varName) {
            element = toolbarSandbox.getValue(des.varName)
          }else{
            MNUtil.showHUD("❌ varName not found")
          }
          break;
        default:
          MNUtil.showHUD("Invalid target")
          break;
      }
    }
    let copyContent = des.content
    if (copyContent) {
      let replacedText = ""
      // let replacedText = this.detectAndReplace(copyContent,element)
      if (focusNote) {
        replacedText = await this.render(copyContent,{element:element,noteId:focusNote.noteId})
      }else{
        replacedText = await this.render(copyContent,{element:element})
      }
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
      toolbarUtils.addErrorLog(error, "copy")
      return false
    }
  }
  static copyJSON(object) {
    UIPasteboard.generalPasteboard().string = JSON.stringify(object,null,2)
  }
  /**
   * 
   * @param {NSData} imageData 
   */
  static copyImage(imageData) {
    UIPasteboard.generalPasteboard().setDataForPasteboardType(imageData,"public.png")
  }
  static studyController() {
    return this.app.studyController(this.focusWindow)
  }
  static studyView() {
    return this.app.studyController(this.focusWindow).view
  }
  static currentDocController() {
    return this.studyController().readerController.currentDocumentController
  }
  static get currentNotebookId() {
    return this.studyController().notebookController.notebookId
  }
  static currentNotebook() {
    return this.getNoteBookById(this.currentNotebookId)
  }
  static undoGrouping(f,notebookId = this.currentNotebookId){
    UndoManager.sharedInstance().undoGrouping(
      String(Date.now()),
      notebookId,
      f
    )
    this.app.refreshAfterDBChanged(notebookId)
  }
  static openURL(url){
    if (!this.app) {
      this.app = Application.sharedInstance()
    }
    this.app.openURL(NSURL.URLWithString(url));
  }
  static async checkMNUtil(alert = false,delay = 0.01){
    if (typeof MNUtil === 'undefined') {//如果MNUtil未被加载，则执行一次延时，然后再检测一次
      //仅在MNUtil未被完全加载时执行delay
      await this.delay(delay)
      if (typeof MNUtil === 'undefined') {
        if (alert) {
          let res = await this.confirm("MN Toolbar:", "Install 'MN Utils' first\n\n请先安装'MN Utils'",["Cancel","Open URL"])
          if (res) {
            this.openURL("https://bbs.marginnote.com.cn/t/topic/49699")
          }
        }else{
          this.showHUD("MN Toolbar: Please install 'MN Utils' first!",5)
        }
        return false
      }
    }
    return true
  }
  /**
   * 
   * @param {MbBookNote|MNNote} currentNote 
   * @param {string|MNNote} targetNote 
   */
  static cloneAndMerge(currentNote,targetNote) {
    let cloneNote = MNNote.clone(targetNote)
    currentNote.merge(cloneNote.note)
  }
  /**
   * 
   * @param {MbBookNote|MNNote} currentNote 
   * @param {string} targetNoteId 
   */
  static cloneAsChildNote(currentNote,targetNoteId) {
    let cloneNote = MNNote.clone(targetNoteId)
    currentNote.addChild(cloneNote.note)
  }
  static postNotification(name,userInfo) {
    NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(name, this.focusWindow, userInfo)
  }
  /**
   * 
   * @param {string[]} arr 
   * @param {string} element 
   * @param {string} direction 
   * @returns 
   */
  static moveElement(arr, element, direction) {
      // 获取元素的索引
      var index = arr.indexOf(element);
      if (index === -1) {
          this.showHUD('Element not found in array');
          return;
      }
      switch (direction) {
          case 'up':
              if (index === 0) {
                  this.showHUD('Element is already at the top');
                  return;
              }
              // 交换元素位置
              [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
              break;
          case 'down':
              if (index === arr.length - 1) {
                  this.showHUD('Element is already at the bottom');
                  return;
              }
              // 交换元素位置
              [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
              break;
          case 'top':
              // 移除元素
              arr.splice(index, 1);
              // 添加到顶部
              arr.unshift(element);
              break;
          default:
              this.showHUD('Invalid direction');
              break;
      }
  }
/**
 * 
 * @param {string} text 
 * @param {MNNote|MbBookNote|undefined} note 
 * @returns 
 */
  static async getVarInfo(text,preConfig = {}) {//对通用的部分先写好对应的值
    let config = preConfig
    let hasClipboardText = text.includes("{{clipboardText}}")
    let hasSelectionText = text.includes("{{selectionText}}")
    let hasCurrentDocName = text.includes("{{currentDocName}}")
    let hasCurrentDocAttach = text.includes("{{currentDocAttach}}")
    let hasChatAIOutput = text.includes("{{chatAIOutput}}")
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
    if (hasChatAIOutput && chatAIUtils) {
      config.chatAIOutput = await chatAIUtils.notifyController.getTextForAction()
    }
    return config
  }
  /**
   * 
   * @param {string} text 
   * @param {MbBookNote|MNNote} note 
   * @returns 
   */
  static getVarInfoWithNote(text,note) {
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
  static escapeStringRegexp(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d")
  }
  static string2Reg(str) {
    str = str.trim()
    if (!str.startsWith("/")) return new RegExp(toolbarUtils.escapeStringRegexp(str))
    const regParts = str.match(/^\/(.+?)\/([gimsuy]*)$/)
    if (!regParts) throw ""
    return new RegExp(regParts[1], regParts[2])
  }
/**
 * 
 * @param {MNNote[]} notes 
 * @returns 
 */
static buildHierarchy(notes) {
try {

  const tree = [];
  const map = {}; // Helper to quickly find notes by their ID

  // First pass: Create a map of notes and initialize a 'children' array for each.
  notes.forEach(note => {
    map[note.id] = { id:note.id, children: [] }; // Store a copy and add children array
  });
  // Second pass: Populate the 'children' arrays and identify root nodes.
  notes.forEach(note => {
    let parentId = note.parentNoteId
    if (parentId && map[parentId]) {
      // If it has a parent and the parent exists in our map, add it to parent's children
      map[parentId].children.push(map[note.id]);
    } else {
      // Otherwise, it's a root node (or an orphan if parentId is invalid but present)
      tree.push(map[note.id]);
    }
  });

  return tree;
  
} catch (error) {
  return []
}
}
  /**
   * 
   * @param {*} range 
   * @returns {MNNote[]}
   */
  static getNotesByRange(range){
    if (range === undefined) {
      return [MNNote.getFocusNote()]
    }
    switch (range) {
      case "currentNotes":
        return MNNote.getFocusNotes()
      case "childNotes":
        let childNotes = []
        MNNote.getFocusNotes().map(note=>{
          childNotes = childNotes.concat(note.childNotes)
        })
        return childNotes
      case "descendants":
      case "descendantNotes"://所有后代节点
        let descendantNotes = []
        // let descendantNotes = []
        let focusNotes = MNNote.getFocusNotes()
        if (focusNotes.length === 0) {
          MNUtil.showHUD("No notes found")
          return []
        }
        let topLevelNotes = this.buildHierarchy(focusNotes).map(o=>MNNote.new(o.id))
        // let notesWithoutDescendants = focusNotes.filter(note=>!note.hasDescendantNodes)
        topLevelNotes.map(note=>{
          descendantNotes = descendantNotes.concat(note.descendantNodes.descendant)
        })
        MNUtil.log("descendantNotes:"+descendantNotes.length)
        return descendantNotes
      default:
        return [MNNote.getFocusNote()]
    }
  }
  /**
   * 
   * @param {MNNote} note 
   * @param {{target:string,type:string,index:number}} des 
   */
  static clearNoteContent(note,des){
    try {

    let target = des.target ?? "title"
    switch (target) {
      case "title":
        note.noteTitle = ""
        break;
      case "excerptText":
        note.excerptText = ""
        break;
      case "excerptTextAndComments":
        note.excerptText = ""
      case "comments"://todo: 改进type检测,支持未添加index参数时移除所有评论
        // this.removeComment(des)
        if ("type" in des) {
          let indices = note.getCommentIndicesByCondition({type:des.type})
          note.removeCommentsByIndices(indices)
        }else if ("index" in des){
          note.removeCommentByIndex(des.index)
        }else{
          let commentLength = note.comments.length
          for (let i = commentLength-1; i >= 0; i--) {
              // MNUtil.log("Removing comment at index: "+i)
              note.removeCommentByIndex(i)
          }
        }
        break;
      default:
        break;
    }
      
    } catch (error) {
      this.addErrorLog(error, "clearNoteContent")
    }
  }
  /**
   * 
   * @param {MNNote|MbBookNote} note 
   * @param {{target:string,type:string,index:number}} des 
   */
  static setNoteContent(note,content,des){
    let target = des.target ?? "title"
    let replacedText = this.detectAndReplace(content,undefined,note)
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
      case "globalVar":
        let varName = des.varName
        if (!varName) {
          MNUtil.showHUD("❌ varName not found!")
          return
        }
        //将句号和空格都替换成下划线
        varName = varName.trim().replace(/\.|\s/g, "_")
        toolbarSandbox.setValue(varName, replacedText)
        break;
      default:
        MNUtil.showHUD("Invalid target: "+target)
        break;
    }
  }
  /**
   * 
   * @param {MNNote} note 
   * @returns 
   */
  static isEmptyNote(note){
    if (note.title) {
      return false
    }
    if (note.excerptText || note.excerptPic) {
      return false
    }
    if (note.comments && note.comments.length) {
      return false
    }
    return true
  }
  static clearContent(des){
    let range = des.range ?? "currentNotes"
    let targetNotes = this.getNotesByRange(range)
    MNUtil.undoGrouping(()=>{
      targetNotes.forEach(note=>{
        this.clearNoteContent(note, des)
        if (des.allowDeleteNote && this.isEmptyNote(note)) {
          note.delete()
        }
      })
    })
  }
  static setContent(des){
    try {
    let range = des.range ?? "currentNotes"
    let targetNotes = this.getNotesByRange(range)
    if (targetNotes.length) {
      MNUtil.undoGrouping(()=>{
        targetNotes.forEach(note=>{
          let content = des.content ?? "content"
          this.setNoteContent(note, content,des)
        })
      })
    }else{
      let content = des.content
      if (content && content.trim()) {
        let replacedText = this.detectAndReplace(content)
        switch (des.target) {
          case "globalVar":
            let varName = des.varName
            if (!varName) {
              MNUtil.showHUD("❌ varName not found!")
              return
            }
            //将句号和空格都替换成下划线
            varName = varName.trim().replace(/\.|\s/g, "_")
            toolbarSandbox.setValue(varName, replacedText)
            break;
        
          default:
            break;
        }
      }

    }
    } catch (error) {
      this.addErrorLog(error, "setContent")
    }
  }
  static replace(note,ptt,des){
    let content = this._replace_get_content_(note,des)
    switch (des.target) {
      case "title":
        note.noteTitle = content.replace(ptt, des.to)
        break;
      case "excerpt":
        note.excerptText = content.replace(ptt, des.to)
        break;
      case "clipboardText":
        MNUtil.copy(content.replace(ptt, des.to))
        break;
      default:
        break;
    }
  }
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
  static _replace_get_content_(note,des) {
    if (des.content) {
      return this.detectAndReplace(des.content,note)
    }
    let content = ""
    switch (des.target) {
      case "title":
        content = note.noteTitle
        break;
      case "excerpt":
        content = note.excerptText ?? ""
        break;
      case "clipboardText":
        content = MNUtil.clipboardText
        break;
      default:
        break;
    }
    return content
  }
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
   * 关闭弹出菜单,如果delay为true则延迟0.5秒后关闭
   * @param {PopupMenu} menu 
   * @param {boolean} delay 
   * @returns 
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
          targetNoteid = targetNote.noteId
        }else{
          MNUtil.showHUD("No Note found!")
        }
        break;
      case "globalVar":
        if (des.varName) {
          let noteId = toolbarSandbox.getValue(des.varName)
          let tem = MNNote.new(noteId)
          if (tem) {
            targetNoteid = tem.noteId
          }else{
            MNUtil.showHUD("❌ note not valid")
          }
        }else{
          MNUtil.showHUD("❌ varName not found")
        }
        break;
      default:
        break;
    }
    if (targetNoteid) {
      MNNote.focusInFloatMindMap(targetNoteid)
    }else{
      MNUtil.showHUD("No Note found!")
    }
  }
  static async delay (seconds) {
    return new Promise((resolve, reject) => {
      NSTimer.scheduledTimerWithTimeInterval(seconds, false, function () {
        resolve()
      })
    })
  }
  static currentChildMap() {
    if (MNUtil.mindmapView && MNUtil.mindmapView.mindmapNodes[0].note?.childMindMap) {
      return MNNote.new(MNUtil.mindmapView.mindmapNodes[0].note.childMindMap.noteId)
    }else{
      return undefined
    }
  }
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
  static replaceNoteIndex(text,index,des){ 
    let noteIndices = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'] 
    if (des.noteIndices && des.noteIndices.length) {
      noteIndices = des.noteIndices
    }
    MNUtil.log(text)
    MNUtil.log("replaceNoteIndex:"+noteIndices[index])
    let tem = text.replace("{{noteIndex}}",noteIndices[index])
    MNUtil.log(tem)
    return tem
  
  }
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
  static emojiNumber(index){
    let emojiIndices = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"]
    return emojiIndices[index]
  }

  /**
   * 
   * @param {MNNote} note 
   * @param {*} des 
   * @returns 
   */
  static getMergedText(note,des,noteIndex){
  try {
    let textList = []
    des.source.map(text=>{
      if (text.includes("{{note.title}}") && des.removeSource) {
        if (note.noteId in toolbarUtils.commentToRemove) {
          toolbarUtils.commentToRemove[note.noteId].push(-1)
        }else{
          toolbarUtils.commentToRemove[note.noteId] = [-1]
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
              if (note.noteId in toolbarUtils.commentToRemove) {
                toolbarUtils.commentToRemove[note.noteId].push(index)
              }else{
                toolbarUtils.commentToRemove[note.noteId] = [index]
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
              if (note.noteId in toolbarUtils.commentToRemove) {
                toolbarUtils.commentToRemove[note.noteId].push(index)
              }else{
                toolbarUtils.commentToRemove[note.noteId] = [index]
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
      let tem = this.replaceNoteIndex(text, noteIndex, des)
      tem = this.detectAndReplace(tem,undefined,note)
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
    mergedText = this.detectAndReplace(mergedText,undefined,note)
    return mergedText
  } catch (error) {
    this.addErrorLog(error, "getMergedText")
    return undefined
  }
  }
  static mergeText(des){
    try {

      let noteRange = des.range ?? "currentNotes"
      let targetNotes = this.getNotesByRange(noteRange)
      if (!targetNotes.length) {
        MNUtil.showHUD("MergeText: no note found")
        return
      }
        MNUtil.undoGrouping(()=>{
          targetNotes.forEach((note,index)=>{
            let mergedText = this.getMergedText(note, des, index)
            if (mergedText === undefined) {
              return
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
              case "globalVar":
                let varName = des.varName
                if (!varName) {
                  MNUtil.showHUD("❌ varName not found!")
                  return
                }
                //将句号和空格都替换成下划线
                varName = varName.trim().replace(/\.|\s/g, "_")
                toolbarSandbox.setValue(varName, mergedText)
                break;
              default:
                break;
            }
          })
        })
        if (this.sourceToRemove.length) {
          MNUtil.undoGrouping(()=>{
            // MNUtil.showHUD("remove")
            this.sourceToRemove.forEach(note=>{
              note.excerptText = ""
            })
            MNUtil.delay(1).then(()=>{
              this.sourceToRemove = []
            })
          })
        }
        if (Object.keys(this.commentToRemove).length) {
          MNUtil.undoGrouping(()=>{
            let commentInfos = Object.keys(this.commentToRemove)
            commentInfos.forEach(noteId => {
              let note = MNNote.new(noteId)
              let sortedIndex = MNUtil.sort(this.commentToRemove[noteId],"decrement")
              sortedIndex.forEach(commentIndex=>{
                if (commentIndex < 0) {
                  note.noteTitle = ""
                }else{
                  note.removeCommentByIndex(commentIndex)
                }
              })
            })
            MNUtil.delay(1).then(()=>{
              this.commentToRemove = {}
            })
          })
        }
        
    } catch (error) {
      this.addErrorLog(error, 'mergeText')
    }
  }
  /**
   * 
   * @param {string} text 
   * @param {string} userInput 
   * @returns 
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
    let hasChatAIOutput = text.includes("{{chatAIOutput}}")
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
    if (hasChatAIOutput && this.chatAIOutput) {
      config.chatAIOutput = this.chatAIOutput
    }
    if (toolbarSandbox.hasGlobalVar()) {
      config.globalVar = toolbarSandbox.getGlobalVarObject()
    }
    let output = MNUtil.render(text, config)
    return output
  }
  /**
   * 递归解析列表项及其子列表
   * @param {object[]} items 
   * @returns 
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
static getUnformattedText(token) {
  if ("tokens" in token && token.tokens.length === 1) {
    return this.getUnformattedText(token.tokens[0])
  }else{
    return token.text
  }
}
/**
 * 构建树结构（整合标题和列表解析）
 * @param {object[]} tokens 
 * @returns 
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
  static markdown2AST(markdown){
    let tokens = marked.lexer(markdown)
    // MNUtil.copy(tokens)
    return this.buildTree(tokens)
  }
static  containsMathFormula(markdownText) {
    // 正则表达式匹配单美元符号包裹的公式
    const inlineMathRegex = /\$[^$]+\$/;
    // 正则表达式匹配双美元符号包裹的公式
    const blockMathRegex = /\$\$[^$]+\$\$/;
    // 检查是否包含单美元或双美元符号包裹的公式
    return inlineMathRegex.test(markdownText) || blockMathRegex.test(markdownText);
}
static  containsUrl(markdownText) {
    // 正则表达式匹配常见的网址格式
    const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+/i;
    
    // 使用正则表达式测试文本
    return urlPattern.test(markdownText);
}

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
 * 
 * @param {MNNote} note 
 * @param {Object} ast 
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
          let childNote = note.createChildNote(config,false)
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
      let childNote = note.createChildNote(config,false)
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
 * 
 * @param {MNNote} note 
 * @param {Object} ast 
 */
static AST2MindmapOnlyHeadingFirstLevel(note,ast,level = "all") {
try {
  if (ast.children && ast.children.length) {
    ast.children.forEach((c,index)=>{
      if (c.type === 'hr') {
        return
      }
      if (c.type == "heading") {
        let config = {title:c.name,excerptTextMarkdown:true}
        let subHeadings = c.children.filter(child=>child.type === "heading")
        if (subHeadings.length) {
          let childNote = note.createChildNote(config,false)
          this.AST2MindmapOnlyHeading(childNote,c)
        }else{
          config.excerptText = c.children.map(p=>{
            let texts = [p.raw ?? p.name]
            if (p.hasList) {
              texts.push(p.listText)
            }
            return texts.join("\n")
          }).join("\n\n")
          let childNote = note.createChildNote(config,false)
        }
      }else{
        let texts = [c.raw ?? c.name]
        if (c.hasList) {
          texts.push(c.listText)
        }
        let config = {excerptText:texts.join("\n"),excerptTextMarkdown:true}
        let childNote = note.createChildNote(config,false)
        // this.AST2MindmapOnlyHeading(childNote,c)
      }
    })
  }else{
    // MNUtil.showHUD("No children found")
  }
  } catch (error) {
  this.addErrorLog(error, "AST2Mindmap")
}
}

/**
 * 
 * @param {MNNote} note 
 * @param {Object} ast 
 */
static AST2MindmapOnlyHeading(note,ast,level = "all") {
try {
  let excerptTexts = []
  if (ast.children && ast.children.length) {
    ast.children.forEach((c,index)=>{
      if (c.type === 'hr') {
        return
      }
      if (c.type == "heading") {
        let config = {title:c.name,excerptTextMarkdown:true}
        let subHeadings = c.children.filter(child=>child.type === "heading")
        if (subHeadings.length) {
          let childNote = note.createChildNote(config,false)
          this.AST2MindmapOnlyHeading(childNote,c)
        }else{
          config.excerptText = c.children.map(p=>{
            let texts = [p.raw ?? p.name]
            if (p.hasList) {
              texts.push(p.listText)
            }
            return texts.join("\n")
          }).join("\n\n")
          let childNote = note.createChildNote(config,false)
        }
      }else{
        let texts = [c.raw ?? c.name]
        if (c.hasList) {
          texts.push(c.listText)
        }
        excerptTexts.push(texts.join("\n"))
        // let config = {}
        // let childNote = note.createChildNote(config,false)
        // this.AST2MindmapOnlyHeading(childNote,c)
      }
    })
    if (excerptTexts.length) {
      if (note.excerptText) {
        note.excerptText = note.excerptText+"\n"+excerptTexts.join("\n")
      }else{
        note.excerptText = excerptTexts.join("\n")
      }
    }
  }else{
    // MNUtil.showHUD("No children found")
  }
  } catch (error) {
  this.addErrorLog(error, "AST2Mindmap")
}
}
 static async markdown2Mindmap(des){
 try {
  

    let markdown = ``
    let source = des.source ?? "currentNote"
    let method = des.method ?? "auto"//支持onlyHeading
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
      case "chatAIOutput":
        if (typeof chatAIUtils === "undefined") {
          MNUtil.showHUD("Install MN ChatAI First!")
          return
        }
        markdown = await chatAIUtils.notifyController.getTextForAction()
        break;
      default:
        break;
    }
    // let markdown = des.markdown
    MNUtil.showHUD("Creating Mindmap...")
    await MNUtil.delay(0.1)
    let res = toolbarUtils.markdown2AST(markdown)
    if (method === "onlyHeading" && !res.children.some(c=>c.type == "heading")) {
      MNUtil.showHUD("No Heading Found")
      return
    }
    MNUtil.undoGrouping(()=>{
      if (!focusNote) {
        focusNote = this.newNoteInCurrentChildMap({title:newNoteTitle})
        focusNote.focusInFloatMindMap(0.5)
      }
      if (method === "onlyHeading") {
        toolbarUtils.AST2MindmapOnlyHeadingFirstLevel(focusNote,res)
      }else{
        toolbarUtils.AST2Mindmap(focusNote,res)
      }
    })
    return
 } catch (error) {
  this.addErrorLog(error, "markdown2Mindmap")
  return
 }
  }
  static async getStudylist(key){
        let options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": key
          }}
        let res = await MNConnection.fetch("https://api.frdic.com/api/open/v1/studylist/category?language=en",options)
        if (res.data) {
          return res.data
        }
        return []
  }
  static async getWordIndo(word,key){
        let options = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": key
          }}
        let res = await MNConnection.fetch("https://api.frdic.com/api/open/v1/studylist/word?language=en&word="+word,options)
        return res
  }
  static async addWordsToEurdic(words,option = {}){
    let studylistId = option.studylistId
    if (!studylistId && option.studylistName) {
      let targetStudylist = this.studylist.find(item=>item.name === option.studylistName)
      if (targetStudylist) {
        studylistId = targetStudylist.id
      }else{
        this.studylist = await this.getStudylist(option.APIKey)
        studylistId = this.studylist.find(item=>item.name === option.studylistName)?.id
      }
    }
    let targetWords = []
    let noteId = MNNote.getFocusNote()?.noteId
    for (let index = 0; index < words.length; index++) {
      const element = await this.render(words[index],{noteId:noteId});
      targetWords.push(element)
    }
      let options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": option.APIKey
          },
          body: JSON.stringify({
  "id": studylistId,
  "language": "en",
  "words": targetWords
  })
        }
        // let res = await MNConnection.fetch("https://api.frdic.com/api/open/v1/studylist/category?language=en",options)
        let res = await MNConnection.fetch("https://api.frdic.com/api/open/v1/studylist/words",options)
        if (res.data && res.data.message) {
          MNUtil.showHUD(res.data.message)
          // await MNUtil.delay(1)
          // let infos = await Promise.all(targetWords.map(item=>this.getWordIndo(item,option.APIKey)))
          // MNUtil.copy(infos)
        }else{
          MNUtil.copy(res)
        }
        return res
  }
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
  static addErrorLog(error,source,info){
    MNUtil.showHUD("MN Toolbar Error ("+source+"): "+error)
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
    MNUtil.copyJSON(this.errorLog)
    if (typeof MNUtil.log !== undefined) {
      MNUtil.log({
        source:"MN Toolbar",
        message:source,
        level:"ERROR",
        detail:JSON.stringify(tem,null,2)
      })
    }
  }
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
   * 
   * @param {object} des 
   * @param {UIButton|undefined} button 
   * @returns 
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
        if (button && button.menu) {
          button.menu.dismissAnimated(true)
          let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
          let endFrame = Frame.gen(beginFrame.x-225, beginFrame.y-50, 500, 500)
          endFrame.y = MNUtil.constrain(endFrame.y, 0, studyFrame.height-500)
          endFrame.x = MNUtil.constrain(endFrame.x, 0, studyFrame.width-500)
          MNUtil.postNotification("lookupText"+target,{text:textSelected,beginFrame:beginFrame,endFrame:endFrame})
          return
        }
        let endFrame
        beginFrame.y = beginFrame.y-10
        if (beginFrame.x+490 > studyFrame.width) {
          endFrame = Frame.gen(beginFrame.x-450, beginFrame.y-10, 500, 500)
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
          endFrame = Frame.gen(beginFrame.x+40, beginFrame.y-10, 500, 500)
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


      // let des = toolbarConfig.getDescriptionById("searchInEudic")
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
  static showMessage(des){
    let content = this.detectAndReplace(des.content)
    MNUtil.showHUD(content)
  }
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
  static async userSelect(des){
    if (des.title && des.selectItems) {
      let confirmTitle = toolbarUtils.detectAndReplace(des.title)
      let confirmSubTitle = des.subTitle ? toolbarUtils.detectAndReplace(des.subTitle) : ""
      let selectTitles = des.selectItems.map(item=>{
        return toolbarUtils.detectAndReplace(item.selectTitle)
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
   * 
   * @param {object} des 
   * @param {UIButton|undefined} button 
   * @returns 
   */
  static chatAI(des,button){
    switch (des.target) {
      case "openFloat":
        MNUtil.postNotification("chatAIOpenFloat", {beginFrame:button.convertRectToView(button.bounds,MNUtil.studyView)})
        return;
      case "openFloat":
        MNUtil.postNotification("chatAIOpenFloat", {beginFrame:button.convertRectToView(button.bounds,MNUtil.studyView)})
        return;
      case "currentPrompt":
        MNUtil.postNotification("customChat",{})
        return;
      case "stopOutput":
        if (typeof chatAIUtils === "undefined") {
          return;
        }
        let notifyController = chatAIUtils.notifyController
        if (notifyController.connection) {
          notifyController.connection.cancel()
          delete notifyController.connection
          notifyController.showHUD("Stop output")
        }else{
          notifyController.showHUD("Not on output")
        }
        notifyController.setButtonOpacity(1.0)
        return;
      default:
        break;
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
   * 
   * @param {object} des 
   * @param {UIButton|undefined} button 
   * @returns 
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
    let followButton = des.followButton ?? true
    if (button && followButton) {
      let studyFrame = MNUtil.studyView.bounds
      let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
      if (button.menu) {
        button.menu.dismissAnimated(true)
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
    }else{
      if (des.engine) {
        if (selectionText) {
          // MNUtil.showHUD("Text:"+selectionText)
          MNUtil.postNotification("searchInBrowser",{text:selectionText,engine:des.engine})
        }else{
          // MNUtil.showHUD("NoteId:"+noteId)
          MNUtil.postNotification("searchInBrowser",{noteid:noteId,engine:des.engine})
        }
        return
      }
      if (selectionText) {
        // MNUtil.showHUD("Text:"+selectionText)
        MNUtil.postNotification("searchInBrowser",{text:selectionText})
      }else{
        // MNUtil.showHUD("NoteId:"+noteId)
        MNUtil.postNotification("searchInBrowser",{noteid:noteId})
      }
    }

  }
  /**
   * @param {NSData} image 
   * @returns 
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
 * Initializes a request for ChatGPT using the provided configuration.
 * 
 * @param {Array} history - An array of messages to be included in the request.
 * @param {string} apikey - The API key for authentication.
 * @param {string} url - The URL endpoint for the API request.
 * @param {string} model - The model to be used for the request.
 * @param {number} temperature - The temperature parameter for the request.
 * @param {Array<number>} funcIndices - An array of function indices to be included in the request.
 * @returns {Promise<{content:string,media:string,title:string,link:string,refer:string,icon:string,index:number}[]>}
 * @throws {Error} If the API key is empty or if there is an error during the request initialization.
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
   * 
   * @param {{buffer:boolean,target:string,method:string}} des 
   * @param {UIButton} button 
   * @returns 
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
      // MNUtil.showHUD("MN Toolbar: Please install 'MN OCR' first!")
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
                if (button) {
                  let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
                  let endFrame = Frame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
                  endFrame.y = toolbarUtils.constrain(endFrame.y, 0, studyFrame.height-500)
                  endFrame.x = toolbarUtils.constrain(endFrame.x, 0, studyFrame.width-500)
                  MNUtil.postNotification("openInEditor",{content:res,beginFrame:beginFrame,endFrame:endFrame})
                }else{
                  MNUtil.postNotification("openInEditor",{content:res})
                }
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
                if (button) {
                  let studyFrame = MNUtil.studyView.bounds
                  let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
                  let endFrame = Frame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
                  endFrame.y = toolbarUtils.constrain(endFrame.y, 0, studyFrame.height-500)
                  endFrame.x = toolbarUtils.constrain(endFrame.x, 0, studyFrame.width-500)
                  MNUtil.postNotification("openInEditor",{content:res,beginFrame:beginFrame,endFrame:endFrame})
                }else{
                  MNUtil.postNotification("openInEditor",{content:res})
                }
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
          if (button) {
            let studyFrame = MNUtil.studyView.bounds
            let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
            let endFrame = Frame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
            endFrame.y = toolbarUtils.constrain(endFrame.y, 0, studyFrame.height-500)
            endFrame.x = toolbarUtils.constrain(endFrame.x, 0, studyFrame.width-500)
            MNUtil.postNotification("openInEditor",{content:res,beginFrame:beginFrame,endFrame:endFrame})
          }else{
            MNUtil.postNotification("openInEditor",{content:res})
          }
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
        case "globalVar":
          let varName = des.varName
          if (!varName) {
            MNUtil.showHUD("❌ varName not found!")
            return
          }
          //将句号和空格都替换成下划线
          varName = varName.trim().replace(/\.|\s/g, "_")
          toolbarSandbox.setValue(varName, res)
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
 * Initializes a request for ChatGPT using the provided configuration.
 * 
 * @param {Array} history - An array of messages to be included in the request.
 * @param {string} apikey - The API key for authentication.
 * @param {string} url - The URL endpoint for the API request.
 * @param {string} model - The model to be used for the request.
 * @param {number} temperature - The temperature parameter for the request.
 * @param {Array<number>} funcIndices - An array of function indices to be included in the request.
 * @throws {Error} If the API key is empty or if there is an error during the request initialization.
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
 * 
 * @returns {Promise<Object>}
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
   * @param {NSData} image 
   * @returns 
   */
  static async freeOCR(image){
    let res = await this.ChatGPTVision(image)
    MNUtil.stopHUD()
    return res
  }
  
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
   * 
   * @param {MNNote} note 
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
      create:note.createDate?.toLocaleString(),
      modify:note.modifiedDate?.toLocaleString(),
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
  var TYPES = 'Object Function Boolean Symbol MNUtil MNNote toolbarUtils toolbarConfig';

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
   * count为true代表本次check会消耗一次免费额度（如果当天未订阅），如果为false则表示只要当天免费额度没用完，check就会返回true
   * 开启ignoreFree则代表本次check只会看是否订阅，不管是否还有免费额度
   * @returns {Boolean}
   */
  static checkSubscribe(count = true, msg = true,ignoreFree = false){
    // return true

    if (typeof subscriptionConfig !== 'undefined') {
      let res = subscriptionConfig.checkSubscribed(count,ignoreFree,msg)
      return res
    }else{
      if (msg) {
        this.showHUD("Please install 'MN Utils' first!")
      }
      return false
    }
  }
  static isSubscribed(msg = true){
    if (typeof subscriptionConfig !== 'undefined') {
      return subscriptionConfig.isSubscribed()
    }else{
      if (msg) {
        this.showHUD("Please install 'MN Utils' first!")
      }
      return false
    }
  }
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
      this.showHUD("MN Toolbar: Please install 'MN Utils' first!")
    }
    return folderExists
  }
  /**
   * 
   * @param {MNNote} note 
   * @param {*} des 
   */
  static async focus(des){
    let targetNote = des.noteURL? MNNote.new(des.noteURL):MNNote.getFocusNote()
    if (!targetNote) {
      MNUtil.showHUD("No targetNote!")
      return
    }
    if (des.source) {
      switch (des.source) {
        case "currentNote":
          break;
        case "childMindMap":
          targetNote = targetNote.childMindMap
          break;
        case "parentNote":
          targetNote = targetNote.parentNote
          if (!targetNote) {
            MNUtil.showHUD("No parentNote!")
            return
          }
          break;
        case "globalVar":
          if (des.varName) {
            let noteId = toolbarSandbox.getValue(des.varName)
            let tem = MNNote.new(noteId)
            if (tem) {
              targetNote = tem
            }else{
              MNUtil.showHUD("❌ note not valid")
            }
          }else{
            MNUtil.showHUD("❌ varName not found")
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
   * 
   * @param {*} des 
   * @returns {Promise<MNNote|undefined>}
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
    let wordThreshold = des.wordThreshold ?? 30
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
        if ("markdown" in des) {
          focusNote.excerptTextMarkdown = des.markdown
        }
        if ("asTitle" in des && des.asTitle) {
          let wordsNumber = MNUtil.wordCountBySegmentit(focusNote.excerptText)
          if (wordsNumber > 0 && wordsNumber < wordThreshold) {
            focusNote.noteTitle = focusNote.excerptText
            focusNote.excerptText = ""
            focusNote.excerptTextMarkdown = false
          }
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
          toolbarUtils.addErrorLog(error, "noteHighlight")
          resolve(undefined)
        }
      })
    })
  }
  static openInEditor(des,button,controller){
    try {
    let noteId = toolbarUtils.currentNoteId
    if (!noteId) {
      let foucsNote = MNNote.getFocusNote()
      if (foucsNote) {
        noteId = foucsNote.noteId
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
    let followButton = des.followButton??true
    if (followButton && button && button.menu) {
      button.menu.dismissAnimated(true)
      let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
      let endFrame = Frame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
      endFrame.y = toolbarUtils.constrain(endFrame.y, 0, studyFrame.height-500)
      endFrame.x = toolbarUtils.constrain(endFrame.x, 0, studyFrame.width-500)
      MNUtil.postNotification("openInEditor",{noteId:noteId,beginFrame:beginFrame,endFrame:endFrame})
      return
    }
    if (followButton && button) {
      let beginFrame = button.frame
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
      if (controller) {
        controller.hideAfterDelay()
      }
    }else{
        MNUtil.postNotification("openInEditor",{noteId:noteId})
    }
    } catch (error) {
      this.addErrorLog(error, "openInEditor")
    }
  }
  static insertSnippet(des){
    let target = des.target ?? "textview"
    let success = true
    switch (target) {
      case "textview":
        let textView = toolbarUtils.textView
        if (!textView || textView.hidden) {
          MNUtil.showHUD("No textView")
          success = false
          break;
        }
        let textContent = toolbarUtils.detectAndReplace(des.content)
        success = toolbarUtils.insertSnippetToTextView(textContent,textView)
        break;
      case "editor":
        let contents = [
          {
            type:"text",
            content:toolbarUtils.detectAndReplace(des.content)
          }
        ]
        MNUtil.postNotification("editorInsert", {contents:contents})
        break;
      default:
        break;
    }
    return success
  }
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
   *
   * @param {UIView} view
   */
  static isDescendantOfCurrentWindow(view){
    return view.isDescendantOfView(MNUtil.currentWindow)
  }
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
              toolbarUtils.addErrorLog(error, "openSideBar")
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
  static getSplitLine(studyController) {
    let study = studyController
    let studyFrame = study.view.bounds
    let readerFrame = study.readerController.view.frame
    let hidden = study.readerController.view.hidden//true代表脑图全屏
    let rightMode = study.rightMapMode
    let fullWindow = readerFrame.width == studyFrame.width
    if (hidden || fullWindow) {
      return undefined
    }
    if (rightMode) {
      let splitLine = readerFrame.x+readerFrame.width
      return splitLine
    }else{
      let splitLine = readerFrame.x
      return splitLine
    }
  }
  static async setColor(des){
  try {
    let fillIndex = -1
    let colorIndex = des.color
    let changeColorByCommand = des.usingCommand ?? false
    let asTitle = false
    let wordThreshold = des.wordThreshold ?? 30
    if ("fillPattern" in des) {
      fillIndex = des.fillPattern
    }
    if ("followAutoStyle" in des && des.followAutoStyle && (typeof autoUtils !== 'undefined')) {
      let focusNotes
      let selection = MNUtil.currentSelection
      if (selection.onSelection) {
        let focusNote = MNNote.fromSelection()
        await MNUtil.delay(0.5)
        if ("asTitleForNewNote" in des && des.asTitleForNewNote) {
          asTitle = true
        }
        // MNUtil.log(focusNote.notebook.title)
        if (focusNote.notebookId !== MNUtil.currentNotebookId) {
          if (focusNote.realGroupNoteIdForTopicId(MNUtil.currentNotebookId)) {
            focusNote = focusNote.realGroupNoteForTopicId(MNUtil.currentNotebookId)
            // focusNote.focusInMindMap()
          }
        }

        focusNotes = [focusNote]
        // focusNotes = [MNNote.new(selection.docController.highlightFromSelection())]
      }else{
        focusNotes = MNNote.getFocusNotes()
      }
      if (changeColorByCommand) {
        MNUtil.excuteCommand("EditColorNoteIndex"+colorIndex)
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
          this.setNoteColor(note,{colorIndex:colorIndex,fillIndex:fillIndex,asTitle:asTitle,wordThreshold:wordThreshold})

        })
        } catch (error) {
          toolbarUtils.addErrorLog(error, "setColor")
        }
      })
      return
    }

    // MNUtil.copy(description+fillIndex)
    let focusNotes
    let selection = MNUtil.currentSelection
    if (selection.onSelection) {
      let focusNote = MNNote.fromSelection()
      await MNUtil.delay(0.5)
      if ("asTitleForNewNote" in des && des.asTitleForNewNote) {
        asTitle = true
      }
      if (focusNote.notebookId !== MNUtil.currentNotebookId) {
        if (focusNote.realGroupNoteIdForTopicId(MNUtil.currentNotebookId)) {
          focusNote = focusNote.realGroupNoteForTopicId(MNUtil.currentNotebookId)
          // focusNote.focusInMindMap()
        }
      }

      focusNotes = [focusNote]
      // focusNotes[0].focusInMindMap()
      // focusNotes = [MNNote.new(selection.docController.highlightFromSelection())]
    }else{
      focusNotes = MNNote.getFocusNotes()
    }
      if (changeColorByCommand) {
        MNUtil.excuteCommand("EditColorNoteIndex"+colorIndex)
      }
    // await MNUtil.delay(1)
    MNUtil.undoGrouping(()=>{
      focusNotes.map(note=>{
        this.setNoteColor(note,{colorIndex:colorIndex,fillIndex:fillIndex,asTitle:asTitle,wordThreshold:wordThreshold})
      })
    })
  } catch (error) {
    toolbarUtils.addErrorLog(error, "setColor")
  }
  }
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
   * 
   * @param {MNNote} note 
   * @param {{colorIndex:number,fillIndex:number,asTitle:boolean,wordThreshold:number}} option 
   */
  static setNoteColor(note,option,colorIndex,fillIndex){
    if (note.note.groupNoteId) {//有合并卡片
      let originNote = MNNote.new(note.note.groupNoteId)
      originNote.notes.forEach(n=>{
        if ("colorIndex" in option) {
          n.colorIndex = option.colorIndex
        }
        if ("fillIndex" in option && option.fillIndex !== -1) {
          n.fillIndex = option.fillIndex
        }
        if ("asTitle" in option && option.asTitle) {
          let wordsNumber = MNUtil.wordCountBySegmentit(n.excerptText)
          if (wordsNumber > 0 && wordsNumber < option.wordThreshold) {
            n.noteTitle = n.excerptText
            n.excerptText = ""
          }
        }
      })
    }else{
      note.notes.forEach(n=>{
        if ("colorIndex" in option) {
          n.colorIndex = option.colorIndex
        }
        if ("fillIndex" in option && option.fillIndex !== -1) {
          n.fillIndex = option.fillIndex
        }
        if ("asTitle" in option && option.asTitle) {
          let wordsNumber = MNUtil.wordCountBySegmentit(n.excerptText)
          if (wordsNumber > 0 && wordsNumber < option.wordThreshold) {
            n.noteTitle = n.excerptText
            n.excerptText = ""
          }
        }
      })
    }
  }
  /**
   * 
   * @param {UITextView} textView 
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
  static isHexColor(str) {
    // 正则表达式匹配 3 位或 6 位的十六进制颜色代码
    const hexColorPattern = /^#([A-Fa-f0-9]{6})$/;
    return hexColorPattern.test(str);
  }
  static parseWinRect(winRect){
    let rectArr = winRect.replace(/{/g, '').replace(/}/g, '').replace(/\s/g, '').split(',')
    let X = Number(rectArr[0])
    let Y = Number(rectArr[1])
    let H = Number(rectArr[3])
    let W = Number(rectArr[2])
    let studyFrame = MNUtil.studyView.frame
    let studyFrameX = studyFrame.x
    let frame = Frame.gen(X-studyFrameX, Y, W, H)
    return frame
  }
  static getButtonColor(){
    if (!this.isSubscribed(false)) {
      return MNUtil.hexColorAlpha("#ffffff", 0.85)
    }
    // let color = MNUtil.app.defaultBookPageColor.hexStringValue
    // MNUtil.copy(color)
    let varColors = ["defaultBookPageColor","defaultHighlightBlendColor","defaultDisableColor","defaultTextColor","defaultNotebookColor","defaultTintColor","defaultTintColorForSelected","defaultTintColorForDarkBackground"]
    if (varColors.includes(toolbarConfig.buttonConfig.color)) {
      return MNUtil.app[toolbarConfig.buttonConfig.color].colorWithAlphaComponent(toolbarConfig.buttonConfig.alpha)
    }
    // if () {
      
    // }
    return MNUtil.hexColorAlpha(toolbarConfig.buttonConfig.color, toolbarConfig.buttonConfig.alpha)
  }
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
   * 
   * @param {string} content 
   */
  static exportMD(content,target = "auto"){
    switch (target) {
      case "file":
        MNUtil.writeText(toolbarConfig.mainPath+"/export.md",content)
        MNUtil.saveFile(toolbarConfig.mainPath+"/export.md", ["public.md"])
        break;
      case "auto":
      case "clipboard":
        MNUtil.copy(content)
        break;
      default:
        break;
    }
  }
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
      toolbarUtils.addErrorLog(error, "export")
  }
  }
  /**
   * 
   * @param {MNNote} note 
   * @param {number} level 
   * @returns {Promise<string>}
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
  static highlightEqualsContentReverse(markdown) {
      // 使用正则表达式匹配==xxx==的内容并替换为<mark>xxx</mark>
      return markdown.replace(/<mark>(.+?)<\/mark>/g, '==\$1==');
  }
  static constrain(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
/**
 * 
 * @param {UIButton} button 
 * @returns {CGRect}
 */
static getButtonFrame(button){
  let buttonFrame = button.convertRectToView(button.frame, MNUtil.studyView)
  return buttonFrame
}
  static getTempelateNames(item){
    if (!toolbarConfig.checkCouldSave(item)) {
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
            "🔨 chatAI in current prompt",
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
      "🔨 add note index",
      "🔨 copy with menu",
      "🔨 copy markdown link",
      "🔨 chatAI with menu",
      "🔨 chatAI in prompt",
      "🔨 chatAI in current prompt",
      "🔨 chatAI in custom prompt",
      "🔨 create & move to main mindmap",
      "🔨 create & move as child note",
      "🔨 create & set branch style",
      "🔨 focus note",
      "🔨 focus in float window",
      "🔨 import mindmap from markdown file",
      "🔨 import mindmap from clipboard",
      "🔨 insert snippet",
      "🔨 insert snippet with menu",
      "🔨 merge text of merged notes",
      "🔨 move note to main mindmap",
      "🔨 menu with actions",
      "🔨 OCR with menu",
      "🔨 OCR to clipboard",
      "🔨 OCR as chat mode reference",
      "🔨 smart copy",
      "🔨 show message",
      "🔨 search with menu",
      "🔨 search in Baidu",
      "🔨 split note to mindmap",
      "🔨 toggle mindmap",
      "🔨 toggle markdown",
      "🔨 toggle textFirst",
      "🔨 toggle full doc and tab bar",
      "🔨 trigger button",
      "🔨 user confirm",
      "🔨 user select"
    ]
  }
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
  static extractUrls(text) {
  // 定义匹配URL的正则表达式
  const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/g;
  // 使用正则表达式匹配所有的URL
  const urls = text.match(urlRegex);
  // 如果没有匹配的URL则返回空数组
  return urls ? urls : [];
}
  /**
   * 
   * @param {MNNote} note 
   */
  static noteHasWebURL(note){
    let content = note.allNoteText()
    return this.extractUrls(content)
  }
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
  static async getNoteVarInfo(noteid,text,userInput) {
    try {
    let replaceText= text
    let note = MNNote.new(noteid)
    let noteConfig = this.getNoteObject(note)
    let config = await this.getVarInfo(text,{userInput:userInput,note:noteConfig})
    // MNUtil.copy(noteConfig)
    if (toolbarSandbox.hasGlobalVar()) {
      config.globalVar = toolbarSandbox.getGlobalVarObject()
    }
    let prompt = MNUtil.render(replaceText, config)
    return prompt
      
    } catch (error) {
      this.addErrorLog(error, "getNoteVarInfo")
      throw error;
    }
  }

static async getTextVarInfo(text,userInput) {
  try {
  let replaceText= text
  let noteConfig = this.getNoteObject(MNNote.getFocusNote())
  let config = await this.getVarInfo(text,{note:noteConfig,userInput:userInput})
  if (toolbarSandbox.hasGlobalVar()) {
    config.globalVar = toolbarSandbox.getGlobalVarObject()
  }
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
   * Displays a confirmation dialog with a main title and a subtitle.
   * 
   * This method shows a confirmation dialog with the specified main title and subtitle.
   * It returns a promise that resolves with the button index of the button clicked by the user.
   * 
   * @param {string} mainTitle - The main title of the confirmation dialog.
   * @param {string} subTitle - The subtitle of the confirmation dialog.
   * @param {string[]} items - The items of the confirmation dialog.
   * @returns {Promise<number|undefined>} A promise that resolves with the button index of the button clicked by the user.
   */
  static async confirm(mainTitle,subTitle,items = ["Cancel","Confirm"]){
    if (MNOnAlert) {
      return
    }
    MNOnAlert = true
    return new Promise((resolve, reject) => {
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        mainTitle,subTitle,0,items[0],items.slice(1),
        (alert, buttonIndex) => {
          MNOnAlert = false
          // MNUtil.copyJSON({alert:alert,buttonIndex:buttonIndex})
          resolve(buttonIndex)
        }
      )
    })
  }
  static snipaste(des){
    try {

    let selection = MNUtil.currentSelection
    let target = des.target ?? "auto"
    // MNUtil.log(target)
    switch (target) {
      case "auto":
        if (selection.onSelection && !selection.isText) {
          let imageData = selection.image
          MNUtil.postNotification("snipasteImage", {imageData:imageData})
        }else if (MNNote.getFocusNote()) {
          if ("audioAutoPlay" in des) {
            MNUtil.postNotification("snipasteNote",{noteid:MNNote.getFocusNote().noteId,audioAutoPlay:des.audioAutoPlay})
          }else{
            MNUtil.postNotification("snipasteNote",{noteid:MNNote.getFocusNote().noteId})
          }
        }else{
          MNUtil.showHUD("No note found")
        }
        break;
      case "selectionImage":
        if (selection.onSelection) {
          let imageData = selection.image
          MNUtil.postNotification("snipasteImage", {imageData:imageData})
        }else{
          MNUtil.showHUD("No selection found")
        }
        break;
      case "selectionText":
        if (selection.onSelection) {
          let text = selection.text
          MNUtil.postNotification("snipasteHtml",{text:text})
        }else{
          MNUtil.showHUD("No selection found")
        }
        break;
      case "note":
        if (MNNote.getFocusNote()) {
          if ("audioAutoPlay" in des) {
            MNUtil.postNotification("snipasteNote",{noteid:MNNote.getFocusNote().noteId,audioAutoPlay:des.audioAutoPlay})
          }else{
            MNUtil.postNotification("snipasteNote",{noteid:MNNote.getFocusNote().noteId})
          }
        }else{
          MNUtil.showHUD("No note found")
        }
        break;
      case "pdf":
        let page = des.page ?? "current"
        // let doc = des.doc ?? "current"
        let doc = MNUtil.currentDocController
        switch (page) {
          case "current":
            MNUtil.postNotification("snipastePDF",{docMd5:doc.docMd5,currPageNo:doc.currPageNo})
            break;
          case "first":
            MNUtil.postNotification("snipastePDF",{docMd5:doc.docMd5,currPageNo:0})
            break;
          case "last":
            MNUtil.postNotification("snipastePDF",{docMd5:doc.docMd5,currPageNo:doc.document.pageCount-1})
            break;
          default:
            break;
        }
        break;
      case "audioControl":
        let action = des.audioAction ?? "playOrPause"
        MNUtil.postNotification("snipasteAudioAction", {action:action})
        break;
      default:
        break;
    }
      
    } catch (error) {
      this.addErrorLog(error, "snipaste")
      return
    }
  }
/**
 * 根据动作名在配置中查找符合的动作并执行（不是根据id/key）
 * @param {string} actionName 
 * @returns 
 */
static async executeAction(actionName,useId=false) {
  try {
    let actionDes
    if (useId) {//直接根据key获取配置
      actionDes = toolbarConfig.getDescriptionById(actionName)
    }else{
      let actionKey = toolbarConfig.getAllActions().find(key=>{
        let name
        if (key in toolbarConfig.actions) {
          name = toolbarConfig.actions[key].name
        }else{
          name = toolbarConfig.getActions()[key].name
        }
        return name === actionName
      })
      if (!actionKey) {
        MNUtil.showHUD("Missing action: "+actionName)
        return
      }
      actionDes = toolbarConfig.getDescriptionById(actionKey)
    }

        if (!("action" in actionDes)) {
          self.showHUD("Missing action")
          return
        }
        // MNUtil.copy(actionDes)
        await toolbarUtils.customActionByDes(actionDes)
        while ("onFinish" in actionDes) {
          let delay = actionDes.delay ?? 0.5
          actionDes = actionDes.onFinish
          await MNUtil.delay(delay)
          await toolbarUtils.customActionByDes(actionDes)
        }
  
  } catch (error) {
    this.addErrorLog(error, "executeAction")
    throw error;
  }
}
/**
 * @param {object} des 
 * @returns 
 */
static async customActionByDes(des,button,controller,checkSubscribe = true) {//这里actionName指的是key
  try {
    if (checkSubscribe && !this.checkSubscribe(true)) {
      return
    }
    if (typeof chatAIUtils !== "undefined") {
      this.chatAIOutput = await chatAIUtils.notifyController.getTextForAction()
    }
    let focusNote = MNNote.getFocusNote()
    let targetNotes = []
    let success = true
    // MNUtil.showHUD("message"+(focusNote instanceof MNNote))
    let notebookid = focusNote ? focusNote.notebookId : MNUtil.currentNotebookId
    let title,content,color,config
    let targetNoteId
    MNUtil.log(des.action)
    switch (des.action) {
      case "switchTitleorExcerpt":
      case "switchTitleOrExcerpt":
        this.switchTitleOrExcerpt()
        await MNUtil.delay(0.1)
        break;
      case "bigbang":
        MNUtil.postNotification("bigbangNote",{noteid:focusNote.noteId})
        await MNUtil.delay(0.1)
        break;
      case "clearFormat":
        let focusNotes = MNNote.getFocusNotes()
        MNUtil.undoGrouping(()=>{
          focusNotes.map(note=>{
            note.clearFormat()
          })
        })
        await MNUtil.delay(0.1)
        break;
      case "snipaste":
        this.snipaste(des)
        // let selection = MNUtil.currentSelection
        // if (selection.onSelection && !selection.isText) {
        //   let imageData = selection.image
        //   MNUtil.postNotification("snipasteImage", {imageData:imageData})
        // }else{
        //   MNUtil.postNotification("snipasteNote",{noteid:focusNote.noteId})
        // }
        await MNUtil.delay(0.1)
        break;
      case "openSetting":
        MNUtil.postNotification("openToolbarSetting", {})
        await MNUtil.delay(0.1)
        break;
      case "undo":
        UndoManager.sharedInstance().undo()
        MNUtil.refreshAfterDBChanged(notebookid)
        await MNUtil.delay(0.1)
        break;
      case "redo":
        UndoManager.sharedInstance().redo()
        MNUtil.refreshAfterDBChanged(notebookid)
        await MNUtil.delay(0.1)
        break;
      case "openInEditor":
        this.openInEditor(des, button, controller)
        await MNUtil.delay(0.1)
        break;
      case "copy":
        if (des.target || des.content) {
          success = await this.copy(des)
        }else{
          success = this.smartCopy()
        }
        break;
      case "paste":
        this.paste(des)
        await MNUtil.delay(0.1)
        break;
      case "markdown2Mindmap":
        this.markdown2Mindmap(des)
        break;
      case "webSearch":
        await this.webSearch(des)
        break;
      case "setTimer":
        this.setTimer(des)
        break;
      case "cloneAndMerge":
      try {
        if (!des.hideMessage) {
          MNUtil.showHUD("cloneAndMerge")
        }
        MNUtil.undoGrouping(()=>{
          try {
          MNNote.getFocusNotes().forEach(focusNote=>{
            this.cloneAndMerge(focusNote.note, des.target)
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
            this.cloneAsChildNote(focusNote, targetNoteId)
          })
        })
        await MNUtil.delay(0.1)
        break;
      case "addTags":
        this.addTags(des)
        break;
      case "removeTags":
        this.removeTags(des)
        break;
      case "ocr":
        await this.ocr(des,button)
        break;
      case "searchInDict":
        // MNUtil.showHUD("searchInDict")
        this.searchInDict(des,button)
        break;
      case "insertSnippet":
        success = this.insertSnippet(des)
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
            let newNote = this.newNoteInCurrentChildMap({title:fileName,excerptText:content,excerptTextMarkdown:true})
            await newNote.focusInMindMap(0.5)
          }
        }
        break;
      case "noteHighlight":
        let newNote = await this.noteHighlight(des)
        if (newNote && newNote.notebookId === MNUtil.currentNotebookId) {
          if ("continueExcerpt" in des && des.continueExcerpt) {
            //如果是继续摘录，则不需要focus
            MNUtil.excuteCommand("ContinueExcerpt")
          }
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
        this.moveNote(des)
        await MNUtil.delay(0.1)
        break;
      case "addChildNote"://不支持多选
        if (!des.hideMessage) {
          MNUtil.showHUD("addChildNote")
        }
        config = {}
        if (des.title) {
          config.title = this.detectAndReplace(des.title)
        }
        if (des.content) {
          config.content = this.detectAndReplace(des.content)
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
          config.title = this.detectAndReplace(des.title)
        }
        if (des.content) {
          config.content = this.detectAndReplace(des.content)
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
                let replacedText = this.detectAndReplace(comment,undefined,note)
                if (replacedText.trim()) {
                  note.appendMarkdownComment(replacedText,commentIndex)
                }
              })
            }else{
              focusNotes.forEach(note => {
                let replacedText = this.detectAndReplace(comment,undefined,note)
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
          let replacedTitle = this.detectAndReplace(title)
          let replacedLink = this.detectAndReplace(link)
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
        this.removeComment(des)
        await MNUtil.delay(0.1)
        break;
      case "moveComment":
        if (!des.hideMessage) {
          MNUtil.showHUD("moveComment")
        }
        this.moveComment(des)
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
        this.clearContent(des)
        await MNUtil.delay(0.1)
        break;
      case "setContent":
        this.setContent(des)
        await MNUtil.delay(0.1)
        break;
      case "showInFloatWindow":
        this.showInFloatWindow(des)
        // MNUtil.copy(focusNote.noteId)
        await MNUtil.delay(0.1)
        break;
      case "openURL":
        if (des.url) {
          let url = this.detectAndReplace(des.url)
          MNUtil.openURL(url)
          break;
          // MNUtil.showHUD("message")
        }
        MNUtil.showHUD("No valid argument!")
        await MNUtil.delay(0.1)
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
        }else if (des.command) {
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
          let text = this.detectAndReplace(des.text)
          url = url+"&text="+encodeURIComponent(text)
        }
        MNUtil.openURL(url)
        await MNUtil.delay(0.1)
        break
      case "toggleTextFirst":
        if (!des.hideMessage) {
          MNUtil.showHUD("toggleTextFirst")
        }
        targetNotes = this.getNotesByRange(des.range ?? "currentNotes")
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
        let targetMode = des.targetMode ?? "toggle"
        targetNotes = this.getNotesByRange(des.range ?? "currentNotes")
        MNUtil.undoGrouping(()=>{
          targetNotes.forEach(note=>{
            switch (targetMode) {
              case "toggle":
                note.excerptTextMarkdown = !note.excerptTextMarkdown
                break;
              case "disable":
                note.excerptTextMarkdown = false
                break;
              case "enable":
                note.excerptTextMarkdown = true
                break;
              default:
                break;
            }
          })
        })
        await MNUtil.delay(0.1)
        break
      case "toggleSidebar":
        this.toggleSidebar(des)
        await MNUtil.delay(0.1)
        break;
      case "replace":
        this.replaceAction(des)
        await MNUtil.delay(0.1)
        break;
      case "mergeText":
        this.mergeText(des)
        await MNUtil.delay(0.1)
        break;
      case "chatAI":
        this.chatAI(des,button)
        await MNUtil.delay(0.1)
        break
      case "search":
        this.search(des,button)
        await MNUtil.delay(0.1)
        break;
      case "openWebURL":
        this.openWebURL(des)
        await MNUtil.delay(0.1)
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
        await this.focus(des)
        await MNUtil.delay(0.1)
        break 
      case "showMessage":
        this.showMessage(des)
        await MNUtil.delay(0.1)
        break
      case "addWordsToEurdic":
        let words = des.words ?? [des.word]
        let option = {
          APIKey:des.APIKey
        }
        if (des.studylistId) {
          option.studylistId = des.studylistId
        }
        if (des.studylistName) {
          option.studylistName = des.studylistName
        }
        await this.addWordsToEurdic(words,option)
        await MNUtil.delay(0.1)
        break
      case "confirm":
        let targetDes = await this.userConfirm(des)
        if (targetDes) {
          success = await this.customActionByDes(targetDes,button) 
        }else{
          success = false
          MNUtil.showHUD("No valid argument!")
        }
        break
      case "userSelect":
        let selectDes = await this.userSelect(des)
        if (selectDes) {
          success = await this.customActionByDes(selectDes,button) 
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
        this.export(des)
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
        await this.setColor(des)
        await MNUtil.delay(0.1)
        break;
      case "triggerButton":
        let targetButtonName = des.buttonName
        let description = toolbarConfig.getDesByButtonName(targetButtonName)
        success = await this.customActionByDes(description)
        await MNUtil.delay(0.1)
        break;
      default:
        MNUtil.showHUD("Not supported yet...")
        break;
    }
    return new Promise((resolve, reject) => {
      resolve()
    })
    // if (this.dynamicWindow) {
    //   this.hideAfterDelay()
    // }
    // copyJSON(des)
  } catch (error) {
    this.addErrorLog(error, "toolbarUtils.customActionByDes")
    // MNUtil.showHUD(error)
  }
}
  static parseURL(urlString){
    let url
    if (typeof urlString === "string") {
      url = NSURL.URLWithString(urlString)
    }else{
      if (urlString instanceof NSURL) {
        url = urlString
      }else if (urlString instanceof NSURLRequest) {
        url = urlString.URL()
      }
    }
    let absoluteString = url.absoluteString()
    if (absoluteString === "about:blank") {
      return {
        url:absoluteString,
        scheme:"about",
        params:{},
        isBlank:true
      }
    }
    let config = {
      url:absoluteString,
      scheme:url.scheme,
      host:url.host,
      query:url.query,
      pathComponents:url.pathComponents().filter(k=>k !== "/")
    }
    let pathComponents = url.pathComponents()
    if (pathComponents && pathComponents.length > 0) {
      config.pathComponents = pathComponents.filter(k=>k !== "/")
    }
    // 解析查询字符串
    const params = {};
    let queryString = url.query;
    if (queryString) {
      const pairs = queryString.split('&');
      for (const pair of pairs) {
        // 跳过空的参数对 (例如 'a=1&&b=2' 中的第二个 '&')
        if (!pair) continue;
        const eqIndex = pair.indexOf('=');
        let key, value;

        if (eqIndex === -1) {
          // 处理没有值的参数，例如 '...&readonly&...'
          key = decodeURIComponent(pair);
          value = ''; // 通常将无值的 key 对应的值设为空字符串
        } else {
          key = decodeURIComponent(pair.substring(0, eqIndex));
          let tem = decodeURIComponent(pair.substring(eqIndex + 1));
          if (MNUtil.isValidJSON(tem)) {
            value = JSON.parse(tem)
          }else if (tem === "true") {
            value = true
          }else if (tem === "false") {
            value = false
          }else{
            value = tem
          }
        }
        params[key] = value;
      }
    }
    config.params = params
    return config
  }
}

class toolbarConfig {
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
  "dragDrop",
  "exportCards",
  "newGroupMenu",
  "showInlineChatForNote",
  "showInlineChat",
  "selectBranch",
  "ocrForNote",
  "textFirstForNote",
  "aiMenuPlaceholder"
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
    exportCards:{enabled:false,target:"",name:"exportCards"},
    newGroupMenu:{enabled:false,target:"",name:"newGroupMenu"},
    showInlineChatForNote:{enabled:false,target:"",name:"showInlineChatForNote"},
    showInlineChat:{enabled:false,target:"",name:"showInlineChat"},
    selectBranch:{enabled:false,target:"",name:"selectBranch"},
    ocrForNote:{enabled:false,target:"",name:"ocrForNote"},
    textFirstForNote:{enabled:false,target:"",name:"textFirstForNote"},
    aiMenuPlaceholder:{enabled:false,target:"",name:"aiMenuPlaceholder"},
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
  static init(mainPath){
    // this.config = this.getByDefault("MNToolbar_config",this.defaultConfig)
    try {
    this.mainPath = mainPath
    this.dynamic = this.getByDefault("MNToolbar_dynamic",false)
    this.addonLogos = this.getByDefault("MNToolbar_addonLogos",{})
    this.windowState = this.getByDefault("MNToolbar_windowState",this.defaultWindowState)
    this.buttonNumber = this.getDefaultActionKeys().length
    //数组格式,存的是每个action的key,代表顺序
    this.action = this.getByDefault("MNToolbar_action", this.getDefaultActionKeys())
    this.action = this.action.map(a=>{
      if (a === "excute") {
        return "execute"
      }
      return a
    })
    //数组格式,存的是每个action的key,代表顺序
    this.dynamicAction = this.getByDefault("MNToolbar_dynamicAction", this.action)
    if (this.dynamicAction.length === 0) {
      this.dynamicAction = this.action
    }
    //不要直接使用这个属性,请使用getAction
    this.actions = this.getByDefault("MNToolbar_actionConfig", this.getActions())
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
    this.buttonConfig = this.getByDefault("MNToolbar_buttonConfig", this.defalutButtonConfig)
    // MNUtil.copyJSON(this.buttonConfig)
    this.highlightColor = UIColor.blendedColor(
      UIColor.colorWithHexString("#2c4d81").colorWithAlphaComponent(0.8),
      toolbarUtils.app.defaultTextColor,
      0.8
    );
      let editorConfig = this.getDescriptionById("edit")
      if ("showOnNoteEdit" in editorConfig) {
        this.showEditorOnNoteEdit = editorConfig.showOnNoteEdit
      }
      
    } catch (error) {
      toolbarUtils.addErrorLog(error, "init")
    }
    this.buttonImageFolder = MNUtil.dbFolder+"/buttonImage"
    NSFileManager.defaultManager().createDirectoryAtPathAttributes(this.buttonImageFolder, undefined)
    // this.popupConfig = this.getByDefault("MNToolbar_popupConfig", this.defaultPopupReplaceConfig)
    // this.popupConfig = this.defaultPopupReplaceConfig
    this.popupConfig = this.getByDefault("MNToolbar_popupConfig", this.defaultPopupReplaceConfig)
    this.syncConfig = this.getByDefault("MNToolbar_syncConfig", this.defaultSyncConfig)
    this.initImage()
    this.checkCloudStore(false)
  }
  static checkCloudStore(notification = true){//用于替代initCloudStore
    if (!this.cloudStore) {
      this.cloudStore = NSUbiquitousKeyValueStore.defaultStore()
      if (notification) {
        MNUtil.postNotification("NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI", {}) 
      }
    }
  }
  static initCloudStore(){
    this.cloudStore = NSUbiquitousKeyValueStore.defaultStore()
    MNUtil.postNotification("NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI", {})
    // this.readCloudConfig(false)
  }
  static get iCloudSync(){//同时考虑订阅情况
    if (toolbarUtils.checkSubscribe(false,false,true)) {
      return this.syncConfig.iCloudSync
    }
    return false
  }
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
  static getPopupConfig(key){
    if (this.popupConfig[key] !== undefined) {
      return this.popupConfig[key]
    }else{
      return this.defaultPopupReplaceConfig[key]
    }
  }
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
          //iOS端不参与"MNToolbar_windowState"的云同步,因此比较时忽略该参数
          continue
        }
        if (!this.deepEqual(obj1[key], obj2[key])) {
          return false;
        }
    }
    return true;
  }
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
  static importConfig(config){
    try {
    if (!MNUtil.isIOS()) { //iOS端不参与"MNToolbar_windowState"的云同步
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
      toolbarUtils.addErrorLog(error, "importConfig")
      return false
    }
  }
  static getLocalLatestTime(){
    let lastSyncTime = this.syncConfig.lastSyncTime ?? 0
    let lastModifyTime = this.syncConfig.lastModifyTime ?? 0
    return Math.max(lastSyncTime,lastModifyTime)
  }
  static async readCloudConfig(msg = true,alert = false,force = false){
    try {
    if (force) {
      this.checkCloudStore(false)
      let cloudConfig = this.cloudStore.objectForKey("MNToolbar_totalConfig")
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
      // this.cloudStore.removeObjectForKey("MNToolbar_totalConfig")
      let cloudConfig = this.cloudStore.objectForKey("MNToolbar_totalConfig")
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
            let confirm = await MNUtil.confirm("MN Toolbar: Import from iCloud?","MN Toolbar: 是否导入iCloud配置？")
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
            let confirm = await MNUtil.confirm("MN Toolbar: Uploading to iCloud?","MN Toolbar: 是否上传配置到iCloud？")
            if (!confirm) {
              return false
            }
          }
          this.writeCloudConfig()
          return false
        }
        let userSelect = await MNUtil.userSelect("MN Toolbar\nConflict config, import or export?","配置冲突，请选择操作",["📥 Import / 导入","📤 Export / 导出"])
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
        let confirm = await MNUtil.confirm("MN Toolbar: Empty config in iCloud, uploading?","MN Toolbar: iCloud配置为空,是否上传？")
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
      toolbarUtils.addErrorLog(error, "readCloudConfig")
      return false
    }
  }
  static writeCloudConfig(msg = true,force = false){
  try {
    if (force) {//force下不检查订阅(由更上层完成)
      this.checkCloudStore()
      this.syncConfig.lastSyncTime = Date.now()
      this.syncConfig.lastModifyTime = Date.now()
      let cloudConfig = this.cloudStore.objectForKey("MNToolbar_totalConfig")
      let config = this.getAllConfig()
      if (MNUtil.isIOS() && cloudConfig && cloudConfig.windowState) {
        //iOS端不参与"MNToolbar_windowState"的云同步
        config.windowState = cloudConfig.windowState
      }
      if (msg) {
        MNUtil.showHUD("Uploading...")
      }
      this.cloudStore.setObjectForKey(config,"MNToolbar_totalConfig")
      return true
    }
    if(!this.iCloudSync){
      return false
    }
    let iCloudSync = this.syncConfig.iCloudSync
    this.checkCloudStore()
    let cloudConfig = this.cloudStore.objectForKey("MNToolbar_totalConfig")
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
      //iOS端不参与"MNToolbar_windowState"的云同步
      config.windowState = cloudConfig.windowState
    }
    // MNUtil.copyJSON(config)
    if (msg) {
      MNUtil.showHUD("Uploading...")
    }
    config.syncConfig.iCloudSync = iCloudSync
    this.cloudStore.setObjectForKey(config,"MNToolbar_totalConfig")
    this.syncConfig.lastSyncTime = Date.now()
    this.save("MNToolbar_syncConfig",undefined,false)
    return true
  } catch (error) {
    toolbarUtils.addErrorLog(error, "writeCloudConfig")
    return false
  }
  }
  static initImage(){
    try {
    let keys = this.getDefaultActionKeys()
    this.imageScale = toolbarConfig.getByDefault("MNToolbar_imageScale",{})
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
        if (key in toolbarConfig.defalutImageScale) {
          scale = toolbarConfig.defalutImageScale[key]
        }
        this.imageConfigs[key] = MNUtil.getImage(this.mainPath+"/"+this.getAction(key).image+".png",scale)
      }
    })
    this.curveImage = MNUtil.getImage(this.mainPath+"/curve.png",2)
    this.runImage = MNUtil.getImage(this.mainPath+"/run.png",2.)
    this.templateImage = MNUtil.getImage(this.mainPath+"/template.png",2.2)
    // MNUtil.copyJSON(this.imageConfigs)
      } catch (error) {
      toolbarUtils.addErrorLog(error, "initImage")
    }
  }
  // static setImageByURL(action,url,refresh = false) {
  //   this.imageConfigs[action] = toolbarUtils.getOnlineImage(url)
  //   if (refresh) {
  //     MNUtil.postNotification("refreshToolbarButton", {})
  //   }
  // }
  static setImageByURL(action,url,refresh = false,scale = 3) {
    let md5 = MNUtil.MD5(url)
    // let imagePath = this.mainPath+"/"+this.getAction(action).image+".png"
    // MNUtil.getImage(this.mainPath+"/"+this.getAction(key).image+".png",scale)
    let localPath = this.buttonImageFolder+"/"+md5+".png"
    this.imageScale[action] = {path:md5+".png",scale:scale}
    this.save("MNToolbar_imageScale")
    let image = undefined
    let imageData = undefined
    if (MNUtil.isfileExists(localPath)) {
      image = MNUtil.getImage(localPath,scale)
      // image.pngData().writeToFileAtomically(imagePath, false)
      this.imageConfigs[action] = image
      if (refresh) {
        MNUtil.postNotification("refreshToolbarButton", {})
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
          MNUtil.postNotification("refreshToolbarButton", {})
        }
      }
      return
    }
    if (/^https?:\/\//.test(url)) {
      image = toolbarUtils.getOnlineImage(url,scale)
      this.imageConfigs[action] = image
      imageData = image.pngData()
      // imageData.writeToFileAtomically(imagePath, false)
      imageData.writeToFileAtomically(localPath, false)
      if (refresh) {
        MNUtil.postNotification("refreshToolbarButton", {})
      }
      return
    }
    // }
    if (refresh) {
      MNUtil.postNotification("refreshToolbarButton", {})
    }
  }
  /**
   * 
   * @param {string} action 
   * @param {UIImage} image 
   * @param {boolean} refresh 
   * @param {number} scale 
   * @returns 
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
    this.save("MNToolbar_imageScale")
    if (MNUtil.isfileExists(localPath)) {
      this.imageConfigs[action] = image
      if (refresh) {
        MNUtil.postNotification("refreshToolbarButton", {})
      }
      return
    }else{
      this.imageConfigs[action] = image
      image.pngData().writeToFileAtomically(localPath, false)
      if (refresh) {
        MNUtil.postNotification("refreshToolbarButton", {})
      }
    }
    // }
    if (refresh) {
      MNUtil.postNotification("refreshToolbarButton", {})
    }
  } catch (error) {
    toolbarUtils.addErrorLog(error, "setButtonImage")
  }
  }
  /**
   * 只是返回数组,代表所有按钮的顺序,数组元素为每个动作的key
   * @param {boolean} dynamic
   * @returns {string[]}
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
  static getDesByButtonName(targetButtonName){
    let allActions = this.action.concat(this.getDefaultActionKeys().slice(this.action.length))
    let allButtonNames = allActions.map(action=>this.getAction(action).name)
    let buttonIndex = allButtonNames.indexOf(targetButtonName)
    if (buttonIndex === -1) {
      MNUtil.showHUD("Button not found: "	+ targetButtonName)
      MNUtil.log("Button not found: "	+ targetButtonName)
      return undefined
    }
    let action = allActions[buttonIndex]
    let actionDes = toolbarConfig.getDescriptionById(action)
    return actionDes
  
  }
  static getWindowState(key){
    //用户已有配置可能不包含某些新的key，用这个方法做兼容性处理
    if (this.windowState[key] !== undefined) {
      return this.windowState[key]
    }else{
      return this.defaultWindowState[key]
    }
  }
  static direction(dynamic = false){
    if (dynamic) {
      return this.getWindowState("dynamicDirection")
    }else{
      return this.getWindowState("direction")
    }
  }
  static horizontal(dynamic = false){
    if (dynamic) {
      return this.getWindowState("dynamicDirection") === "horizontal"
    }else{
      return this.getWindowState("direction") === "horizontal"
    }
  }
  static vertical(dynamic = false){
    if (dynamic) {
      return this.getWindowState("dynamicDirection") === "vertical"
    }else{
      return this.getWindowState("direction") === "vertical"
    }
  }
  static toggleToolbarDirection(source){
    if (!toolbarUtils.checkSubscribe(true)) {
      return
    }
    switch (source) {
      case "fixed":
        if (toolbarConfig.getWindowState("direction") === "vertical") {
          toolbarConfig.windowState.direction = "horizontal"
          toolbarConfig.save("MNToolbar_windowState")
          MNUtil.showHUD("Set fixed direction to horizontal")

        }else{
          toolbarConfig.windowState.direction = "vertical"
          toolbarConfig.save("MNToolbar_windowState")
          MNUtil.showHUD("Set fixed direction to vertical")
        }
        break;
      case "dynamic":
        if (toolbarConfig.getWindowState("dynamicDirection") === "vertical") {
          toolbarConfig.windowState.dynamicDirection = "horizontal"
          toolbarConfig.save("MNToolbar_windowState")
          MNUtil.showHUD("Set dynamic direction to horizontal")
        }else{
          toolbarConfig.windowState.dynamicDirection = "vertical"
          toolbarConfig.save("MNToolbar_windowState")
          MNUtil.showHUD("Set dynamic direction to vertical")
        }
        break;
      default:
        break;
    }
    MNUtil.postNotification("refreshToolbarButton",{})
  }
  /**
   * 
   * @param {MbBookNote} note
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
        let child = toolbarUtils.createChildNote(note,key)
        this.expandesConfig(child, subConfig,undefined,exclude)
      }else{
        if (exclude) {
          if (key !== exclude) {
            toolbarUtils.createChildNote(note,key,config[key])
          }
        }else{
          toolbarUtils.createChildNote(note,key,config[key])
        }
      }
    })
  }
  static checkLogoStatus(addon){
  // try {
    if (this.addonLogos && (addon in this.addonLogos)) {
      return this.addonLogos[addon]
    }else{
      return true
    }
  // } catch (error) {
  //   toolbarUtils.addErrorLog(error, "checkLogoStatus")
  //   return true
  // }
  }
static template(action) {
  let config = {action:action}
  switch (action) {
    case "cloneAndMerge":
      config.target = toolbarUtils.version.version+"app://note/xxxx"
      break
    case "link":
      config.target = toolbarUtils.version.version+"app://note/xxxx"
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
      config.target = toolbarUtils.version+"app://note/xxxx"
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
 * 用这个API获取每个按钮的配置,不要直接用actions
 * @param {string} actionKey 
 * @returns {object}
 */
static getAction(actionKey){
  let action = {}
  if (actionKey in this.actions) {
    action = this.actions[actionKey]
    if (!MNUtil.isValidJSON(action.description)) {//兼容旧版本的description问题
      action.description = this.getActions()[actionKey].description
      //这里的description是字符串而非json对象
    }
    return action
  }
  return this.getActions()[actionKey]
}

static getActions() {//默认值
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
    "ocr":{name:"OCR",image:"ocr",description:JSON.stringify({target:"comment",source:"default"})},
    "edit":{name:"Edit Note",image:"edit",description:JSON.stringify({showOnNoteEdit:false})},
    "timer":{name:"Timer",image:"timer",description:JSON.stringify({target:"menu"})},
    "execute":{name:"Execute",image:"execute",description:"MNUtil.showHUD('Hello world')"},
    "sidebar":{name:"Sidebar",image:"sidebar",description:"{}"},
    "undo":{name:"Undo",image:"undo",description:"{}"},
    "redo":{name:"Redo",image:"redo",description:"{}"},
  }
}
static execute(){


}
static getDefaultActionKeys() {
  let actions = this.getActions()
  // MNUtil.copyJSON(actions)
  // MNUtil.copyJSON(Object.keys(actions))
  return Object.keys(actions)
}
static save(key = undefined,value = undefined,upload = true) {
  // MNUtil.showHUD("save")
  if(key === undefined){
    let defaults = NSUserDefaults.standardUserDefaults()
    defaults.setObjectForKey(this.windowState,"MNToolbar_windowState")
    defaults.setObjectForKey(this.dynamic,"MNToolbar_dynamic")
    defaults.setObjectForKey(this.action,"MNToolbar_action")
    defaults.setObjectForKey(this.dynamicAction,"MNToolbar_dynamicAction")
    defaults.setObjectForKey(this.actions,"MNToolbar_actionConfig")
    defaults.setObjectForKey(this.addonLogos,"MNToolbar_addonLogos")
    defaults.setObjectForKey(this.buttonConfig,"MNToolbar_buttonConfig")
    defaults.setObjectForKey(this.popupConfig,"MNToolbar_popupConfig")
    defaults.setObjectForKey(this.imageScale,"MNToolbar_imageScale")
    defaults.setObjectForKey(this.syncConfig,"MNToolbar_syncConfig")
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
      case "MNToolbar_windowState":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.windowState,key)
        if (MNUtil.isIOS()) { //iOS端不参与"MNToolbar_windowState"的云同步
          return
        }
        break;
      case "MNToolbar_dynamic":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.dynamic,key)
        break;
      case "MNToolbar_dynamicAction":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.dynamicAction,key)
        break;
      case "MNToolbar_action":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.action,key)
        break;
      case "MNToolbar_actionConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.actions,key)
        break;
      case "MNToolbar_addonLogos":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.addonLogos,key)
        break;
      case "MNToolbar_buttonConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.buttonConfig,key)
        break;
      case "MNToolbar_popupConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.popupConfig,key)
        break;
      case "MNToolbar_imageScale":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.imageScale,key)
        break;
      case "MNToolbar_syncConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.syncConfig,key)
        break;
      default:
        toolbarUtils.showHUD("Not supported")
        break;
    }
    this.syncConfig.lastModifyTime = Date.now()
    if (upload && this.iCloudSync) {
      this.writeCloudConfig(false)
    }
  }
  // NSUserDefaults.standardUserDefaults().synchronize()
}

static get(key) {
  return NSUserDefaults.standardUserDefaults().objectForKey(key)
}

static getByDefault(key,defaultValue) {
  let value = NSUserDefaults.standardUserDefaults().objectForKey(key)
  if (value === undefined) {
    NSUserDefaults.standardUserDefaults().setObjectForKey(defaultValue,key)
    return defaultValue
  }
  return value
}

static remove(key) {
  NSUserDefaults.standardUserDefaults().removeObjectForKey(key)
}
static reset(target){
  switch (target) {
    case "config":
      this.actions = this.getActions()
      this.save("MNToolbar_actionConfig")
      break;
    case "order":
      this.action = this.getDefaultActionKeys()
      this.save("MNToolbar_action")
      break;  
    case "dynamicOrder":
      this.dynamicAction = this.getDefaultActionKeys()
      this.save("MNToolbar_dynamicAction")
      break;
    default:
      break;
  }
}
static getDescriptionByIndex(index){
  let actionName = toolbarConfig.action[index]
  if (actionName in toolbarConfig.actions) {
    return JSON.parse(toolbarConfig.actions[actionName].description)
  }else{
    return JSON.parse(toolbarConfig.getActions()[actionName].description)
  }
}
static getExecuteCode(){
  let actionName = "execute"
  if (actionName in toolbarConfig.actions) {
    return toolbarConfig.actions[actionName].description
  }else{
    return toolbarConfig.getActions()[actionName].description
  }
}
/**
 * 
 * @param {string} actionKey 
 * @returns {object} json对象,而非字符串
 */
static getDescriptionById(actionKey){
  let des
  if (actionKey in toolbarConfig.actions) {
    des = toolbarConfig.actions[actionKey].description
  }else{
    des = toolbarConfig.getActions()[actionKey].description
  }
  if (MNUtil.isValidJSON(des)) {
    let desObject = JSON.parse(des)
    if (actionKey.startsWith("color")) {
      desObject.action = "setColor"
      desObject.color = parseInt(actionKey.replace("color",""))
    }else{
      switch (actionKey) {
        case "bigbang":
          desObject.action = "bigbang"
          break;
        case "switchTitleorExcerpt":
          desObject.action = "switchTitleOrExcerpt"
          break;
        case "clearFormat":
          desObject.action = "clearFormat"
          break;
        case "snipaste":
          desObject.action = "snipaste"
          break;
        case "copyAsMarkdownLink":
          desObject.action = "copy"
          desObject.content = "[{{note.title}}]({{note.url}})"
          break;
        case "sidebar":
          desObject.action = "toggleSidebar"
          break;
        case "ocr":
          desObject.action = "ocr"
          break;
        case "copy":
          desObject.action = "copy"
          break;
        case "timer":
          desObject.action = "setTimer"
          break;
        case "undo":
          desObject.action = "undo"
          break;
        case "redo":
          desObject.action = "redo"
          break;
        case "edit":
          desObject.action = "openInEditor"
          break;
        case "searchInEudic":
          desObject.action = "searchInDict"
          break;
        case "search":
          desObject.action = "search"
          break;
        case "chatglm":
          desObject.action = "chatAI"
          break;
        case "setting":
          desObject.action = "openSetting"
          break;
        case "pasteAsTitle":
          desObject.action = "paste"
          desObject.target = "title"
          desObject.content = "{{clipboardText}}"
          break;
        default:
          break;
      }
    }
    return desObject
  }
  return {}
}
  static checkCouldSave(actionName){
    if (actionName.includes("custom")) {
      return true
    }
    if (actionName.includes("color")) {
      return true
    }
    let whiteNamelist = ["timer","search","copy","chatglm","ocr","edit","searchInEudic","pasteAsTitle","sidebar","snipaste"]
    if (whiteNamelist.includes(actionName)) {
      return true
    }
    MNUtil.showHUD("Only available for Custom Action!")
    return false
  }

}
class toolbarSandbox{
  static globalVar = {}
  static hasGlobalVar(){
    if (Object.keys(this.globalVar).length) {
      return true
    }
    return false
  }
  static setValue(key,value){
    MNUtil.log("setValue:"+key)
    this.globalVar[key] = value
  }
  static getValue(key){
    return this.globalVar[key]
  }
  static getGlobalVarObject(){
    return this.globalVar
  }
  static copyGlobalVar(){
    MNUtil.copy(this.globalVar)
  }
  static async execute(code){
    'use strict';
    if (!toolbarUtils.checkSubscribe(true)) {
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
      toolbarUtils.addErrorLog(error, "executeInSandbox",code)
    }
  }
}