

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
  static errorLog = []
  static version
  static currentNoteId
  static currentSelection
  static isSubscribe = false
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
  static template = {
      "🔨 trigger button":{
        "action": "triggerButton",
        "target": "Custom 3"
      },
      "🔨 user confirm":{
        "action": "confirm",
        "title": "请点击确认",
        "onConfirm": {
          "action": "",
        },
        "onCancel": {
          "action": "",
        }
      },
      "🔨 show message":{
        "action": "showMessage",
        "content": "Hello world"
      },
      "🔨 empty action":{
          "description": "空白动作",
          "action": "xxx",
      },
      "🔨 empty action with double click":{
        "description": "空白动作 带双击动作",
        "action": "xxx",
        "doubleClick": {
          "action": "xxx"
        }
      },
      "🔨 empty action with finish action":{
        "description": "空白动作 带结束动作",
        "action": "xxx",
        "onFinish": {
          "action": "xxx"
        }
      },
      "🔨 setColor default":{},
      "🔨 with fillpattern: both":{
        "fillPattern":-1
      },
      "🔨 with fillpattern: fill":{
        "fillPattern":-1
      },
      "🔨 with fillpattern: border":{
        "fillPattern":-1
      },
      "🔨 with followAutoStyle":{
        "followAutoStyle":true
      },
      "🔨 insert snippet":{
        "description": "在输入框中插入文本片段",
        "action": "insertSnippet",
        "content": "test"
      },
      "🔨 insert snippet with menu":{
        "description": "弹出菜单,选择要在输入框中插入的文本片段",
        "action": "insertSnippet",
        "target": "menu",
        "menuItems": [
          {
            "menuTitle": "插入序号1️⃣",
            "content": "1️⃣ "
          },
          {
            "menuTitle": "插入序号2️⃣",
            "content": "2️⃣ "
          },
          {
            "menuTitle": "插入序号3️⃣",
            "content": "3️⃣ "
          },
          {
            "menuTitle": "插入序号4️⃣",
            "content": "4️⃣ "
          },
          {
            "menuTitle": "插入序号5️⃣",
            "content": "5️⃣ "
          },
          {
            "menuTitle": "插入序号6️⃣",
            "content": "6️⃣ "
          },
          {
            "menuTitle": "插入序号7️⃣",
            "content": "7️⃣ "
          },
          {
            "menuTitle": "插入序号8️⃣",
            "content": "8️⃣ "
          },
          {
            "menuTitle": "插入序号9️⃣",
            "content": "9️⃣ "
          }
        ]
      },
      "🔨 add note index":{
          "description": "多选状态下,给选中的卡片标题加序号",
          "action": "mergeText",
          "target": "title",
          "source": [
              "{{noteIndex}}、{{title}}"
          ]
      },
      "🔨 toggle mindmap":{
          "description": "开关脑图界面",
          "action": "command",
          "command": "ToggleMindMap"
      },
      "🔨 smart copy":{
        "description": "智能复制",
        "action": "copy",
        "target": "auto"
      },
      "🔨 copy with menu":{
          "description": "弹出菜单以选择需要复制的内容",
          "action": "copy",
          "target": "menu"
      },
      "🔨 copy markdown link":{
        "description": "复制markdown链接, 以卡片内容为标题,卡片url为链接",
        "action": "copy",
        "content": "[{{note.allText}}]({{{note.url}}})"
      },
      "🔨 toggle markdown":{
        "description": "切换摘录markdown渲染",
        "action": "toggleMarkdown"
      },
      "🔨 toggle textFirst":{
        "description": "切换摘录文本优先",
        "action": "toggleTextFirst"
      },
      "🔨 chatAI with menu":{
        "description": "弹出菜单选择需要执行的prompt",
        "action": "chatAI",
        "target": "menu"
      },
      "🔨 chatAI in prompt":{
        "description": "执行预定好的prompt",
        "action": "chatAI",
        "target": "翻译"
      },
      "🔨 chatAI in custom prompt":{
        "description": "指定user和system",
        "action": "chatAI",
        "user": "test",
        "system": "test"
      },
      "🔨 search with menu":{
        "description": "弹出菜单选择需要在Browser中搜索的内容",
        "action": "search",
        "target": "menu"
      },
      "🔨 search in Baidu":{
        "description": "弹出菜单选择搜索的目的",
        "action": "search",
        "target": "Baidu"
      },
      "🔨 OCR with menu":{
        "description": "弹出菜单选择OCR的目的",
        "action": "ocr",
        "target": "menu"
      },
      "🔨 OCR as chat mode reference":{
        "description": "OCR 结果作为聊天模式引用",
        "action": "ocr",
        "target": "chatModeReference"
      },
      "🔨 OCR to clipboard":{
        "description": "OCR 到剪贴板",
        "action": "ocr",
        "target": "clipboard"
      },
      "🔨 OCR with onFinish":{
        "description": "OCR结束后执行特定动作",
        "action": "ocr",
        "target": "excerpt",
        "onFinish":{
          "action": "xxx"
        }
      },
      "🔨 toggle full doc and tab bar":{
          "description": "开关文档全屏和标签页",
          "action": "command",
          "commands": [
              "ToggleFullDoc",
              "ToggleTabsBar"
          ]
      },
      "🔨 merge text of merged notes":{
          "description": "把合并的卡片的文本合并到主卡片的摘录中",
          "action": "mergeText",
          "target": "excerptText",
          "source": [
              "{{excerptTexts}},"
          ],
          "removeSource": true
      },
      "🔨 create & move to main mindmap":{
        "description": "创建摘录并移动到主脑图",
        "action": "noteHighlight",
        "mainMindMap": true
      },
      "🔨 create & move as child note":{
        "description": "创建摘录并移动到指定卡片下",
        "action": "noteHighlight",
        "parentNote": "marginnote4app://note/xxx"
      },
      "🔨 move note to main mindmap":{
        "description": "将当前笔记移动到主脑图中",
        "action": "moveNote",
        "target": "mainMindMap"
      },
    	"🔨 menu with actions":{
        "description": "弹出菜单以选择要执行的动作",
        "action": "menu",
        "menuItems": [
            "🔽 我是标题",
            {
                "action": "copy",
                "menuTitle": "123",
                "content": "test"
            },
            {
                "action": "toggleView",
                "targets": [
                    "mindmapToolbar",
                    "addonBar"
                ],
                "autoClose": false,
                "menuTitle": "toggle"
            }
        ]
      },
      "🔨 focus in float window":{
        "description": "在浮动窗口中显示当前笔记",
        "action": "showInFloatWindow",
        "target": "currentNoteInMindMap"
      }
    }
  static init(){
  try {
    this.app = Application.sharedInstance()
    this.data = Database.sharedInstance()
    this.focusWindow = this.app.focusWindow
    this.version = this.appVersion()
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
    let version = parseFloat(this,this.app.appVersion)
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
    editorUtils.addErrorLog(error, "isPureMNImages")
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
    editorUtils.addErrorLog(error, "hasMNImages")
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
    // let images = []
    // 处理 Markdown 字符串，替换每个 base64 图片链接
    // const result = markdown.replace(MNImagePattern, (match, MNImageURL,p2) => {
    //   // 你可以在这里对 base64Str 进行替换或处理
    //   // shouldOverWritten = true
    //   let hash = MNImageURL.split("markdownimg/png/")[1]
    //   let base64 = MNUtil.getMediaByHash(hash).base64Encoding()
    //   return match.replace(MNImageURL, `test`);
    // });
    // MNUtil.copy(result)
    // return result;
  } catch (error) {
    editorUtils.addErrorLog(error, "replaceBase64ImagesWithR2")
    return undefined
  }
}
/**
 * 
 * @param {string} text 
 * @param {UITextView} textView
 */
static insertSnippetToTextView(text, textView) {

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
    let target = des.target
    let element = undefined
    if (target) {
      switch (target) {
        case "auto":
          toolbarUtils.smartCopy()
          return
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
        default:
          MNUtil.showHUD("Invalid target")
          break;
      }
    }
    let copyContent = des.content
    if (copyContent) {
      let replacedText = this.detectAndReplace(copyContent,element)
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
  static async checkMNUtil(alert = false,delay = 0.01){
    if (typeof MNUtil === 'undefined') {//如果MNUtil未被加载，则执行一次延时，然后再检测一次
      //仅在MNUtil未被完全加载时执行delay
      await toolbarUtils.delay(delay)
      if (typeof MNUtil === 'undefined') {
        if (alert) {
          toolbarUtils.showHUD("MN ChatAI: Please install 'MN Utils' first!",5)
        }
        return false
      }
    }
    return true
  }
  /**
   * 
   * @param {MbBookNote|MNNote} currentNote 
   * @param {string} targetNoteId 
   */
  static cloneAndMerge(currentNote,targetNoteId) {
    let cloneNote = MNNote.clone(targetNoteId)
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
  static getVarInfo(text) {//对通用的部分先写好对应的值
    let config = {}
    let hasClipboardText = text.includes("{{clipboardText}}")
    let hasSelectionText = text.includes("{{selectionText}}")
    let hasCurrentDocName = text.includes("{{currentDocName}}")
    let hasCurrentDocAttach = text.includes("{{currentDocAttach}}")
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
        let descendantNotes = []
        MNNote.getFocusNotes().map(note=>{
          descendantNotes = descendantNotes.concat(note.descendantNodes.descendant)
        })
        return descendantNotes
      default:
        return [MNNote.getFocusNote()]
    }
  }
  /**
   * 
   * @param {MNNote|MbBookNote} note 
   * @param {{target:string,type:string,index:number}} des 
   */
  static clearNoteContent(note,des){
    let target = des.target ?? "title"
    switch (target) {
      case "title":
        note.noteTitle = ""
        break;
      case "excerptText":
        note.excerptText = ""
        break;
      case "comments":
        let commentLength = note.comments.length
        let comment
        for (let i = commentLength-1; i >= 0; i--) {
          if (des.type) {
            switch (des.type) {
              case "TextNote":
                comment = note.comments[i]
                if (comment.type === "TextNote") {
                  note.removeCommentByIndex(i)
                }
                break;
              case "LinkNote":
                comment = note.comments[i]
                if (comment.type === "LinkNote") {
                  note.removeCommentByIndex(i)
                }
                break;
              case "PaintNote":
                comment = note.comments[i]
                if (comment.type === "PaintNote") {
                  note.removeCommentByIndex(i)
                }
                break;
              case "HtmlNote":
                comment = note.comments[i]
                if (comment.type === "HtmlNote") {
                  note.removeCommentByIndex(i)
                }
                break;
              default:
                break;
            }
          }else{
            note.removeCommentByIndex(i)
          }
          break;
        }
        break;
      default:
        break;
    }
  }
  /**
   * 
   * @param {MNNote|MbBookNote} note 
   * @param {{target:string,type:string,index:number}} des 
   */
  static setNoteContent(note,content,des){
    let target = des.target ?? "title"
    switch (target) {
      case "title":
        note.noteTitle = content
        break;
      case "excerpt":
      case "excerptText":
        note.excerptText = content
        break;
      default:
        break;
    }
  }
  static clearContent(des){
    let range = des.range ?? "currentNotes"
    let targetNotes = this.getNotesByRange(range)
    MNUtil.undoGrouping(()=>{
      targetNotes.forEach(note=>{
        this.clearNoteContent(note, des)
      })
    })
  }
  static setContent(content,des){
    try {
      

    let range = des.range ?? "currentNote"
    let targetNotes = this.getNotesByRange(range)
    MNUtil.undoGrouping(()=>{
      targetNotes.forEach(note=>{
        this.setNoteContent(note, content,des)
      })
    })
    } catch (error) {
      toolbarUtils.addErrorLog(error, "setContent")
    }
  }
  static replace(note,ptt,des){
    let content
    switch (des.target) {
      case "title":
        content = note.noteTitle
        note.noteTitle = content.replace(ptt, des.to)
        break;
      case "excerpt":
        content = note.excerptText ?? ""
        note.excerptText = content.replace(ptt, des.to)
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
    let content = ""
    switch (des.target) {
      case "title":
        content = note.noteTitle
        break;
      case "excerpt":
        content = note.excerptText ?? ""
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
    MNUtil.showHUD("paste")
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
        let notebookController = MNUtil.notebookController
        let currentNotebookId = notebookController.notebookId
        
        if (!notebookController.view.hidden && notebookController.mindmapView && notebookController.focusNote) {
          targetNoteid = notebookController.focusNote.noteId
        }else{
          let testNote = MNUtil.currentDocController.focusNote
          targetNoteid = testNote.realGroupNoteIdForTopicId(currentNotebookId)
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
    // toolbarUtils.studyController().focusNoteInFloatMindMapById(targetNoteid)
  }
  static async delay (seconds) {
    return new Promise((resolve, reject) => {
      NSTimer.scheduledTimerWithTimeInterval(seconds, false, function () {
        resolve()
      })
    })
  }
  static replaceNoteIndex(text,index,des){ 
    let noteIndices = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30'] 
    if (des.noteIndices && des.noteIndices.length) {
      noteIndices = des.noteIndices
    }
    let tem = text.replace("{{noteIndex}}",noteIndices[index])
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
      if (text.includes("{{title}}") && des.removeSource) {
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
      let tem = this.detectAndReplaceWithNote(text,note)
      tem = this.replaceNoteIndex(tem, noteIndex, des)
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
    return mergedText
  } catch (error) {
    return undefined
  }
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

  static detectAndReplace(text,element=undefined) {
    let noteConfig = this.getNoteObject(MNNote.getFocusNote(),{},{parent:true,child:true})
    let config = {date:this.getDateObject()}
    if (noteConfig) {
      config.note = noteConfig
    }
    if (element !== undefined) {
      config.element = element
    }
    let hasClipboardText = text.includes("{{clipboardText}}")
    let hasSelectionText = text.includes("{{selectionText}}")
    let hasCurrentDocName = text.includes("{{currentDocName}}")
    let hasCurrentDocAttach = text.includes("{{currentDocAttach}}")
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
    let output = MNUtil.render(text, config)
    return output
  }
  /**
   * 
   * @param {string} text 
   * @param {MbBookNote|MNNote} note 
   * @returns 
   */
  static detectAndReplaceWithNote(text,note) {
    let config = this.getVarInfoWithNote(text,note)
    return this.replacVar(text,config)
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
    let log = {
      error:error.toString(),
      source:source,
      time:(new Date(Date.now())).toString(),
      mnaddon:"MN Toolbar"
    }
    if (info) {
      log.info = info
    }
    this.errorLog.push(log)
    MNUtil.copyJSON(this.errorLog)
  }
  static removeComment(des){
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
  static showMessage(des){
    let content = this.detectAndReplace(des.content)
    MNUtil.showHUD(content)
  }
  static async confirm(des){
    if (des.title && "onConfirm" in des) {
      let confirmTitle = toolbarUtils.detectAndReplace(des.title)
      let confirmSubTitle = des.subTitle ? toolbarUtils.detectAndReplace(des.subTitle) : ""
      let confirm = await MNUtil.confirm(confirmTitle, confirmSubTitle)
      if (confirm) {
        return des.onConfirm
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
  static chatAI(des){
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
  static search(des,button){
    // MNUtil.copyJSON(des)
    // MNUtil.showHUD("Search")
    let selectionText = MNUtil.selectionText
    let noteId = undefined
    let foucsNote = MNNote.getFocusNote()
    if (foucsNote) {
      noteId = foucsNote.noteId
    }
    let studyFrame = MNUtil.studyView.bounds
    let beginFrame = button.frame
    if (button.menu) {
      beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
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
   * 
   * @param {{buffer:boolean,target:string,method:string}} des 
   * @returns 
   */
  static async ocr(des){
    if (typeof ocrUtils === 'undefined') {
      MNUtil.showHUD("MN Toolbar: Please install 'MN OCR' first!")
      return
    }
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
    // let res
    let res = await ocrNetwork.OCR(imageData,des.source,buffer)
    // switch (des.source) {
    //   case "doc2x":
    //     res = await ocrNetwork.doc2xOCR(imageData)
    //     break
    //   case "simpletex":
    //     res = await ocrNetwork.simpleTexOCR(imageData)
    //     break
    //   default:
    //     res = await ocrNetwork.OCR(imageData)
    //     break
    // }
    let noteTargets = ["comment","excerpt"]
    if (!focusNote && noteTargets.includes(des.target)) {
      let selection = MNUtil.currentSelection
      if (selection.onSelection) {
        focusNote = MNNote.fromSelection()
      }
    }
    if (res) {
      switch (des.target) {
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
          MNUtil.postNotification("editorInsert",{contents:[{type:"text",content:res}]})
          break;
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
        default:
          break;
      }
    }
      
    } catch (error) {
      this.addErrorLog(error, "ocr")
    }
  
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
      let type = Array.isArray(des.type) ? des.type : [des.type]
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
  static getNoteObject(note,config={},opt={}) {
    try {
    if (!note) {
      return undefined
    }
      
    let noteConfig = config
    noteConfig.id = note.noteId
    noteConfig.notebook = {
      id:note.notebookId,
      name:MNUtil.getNoteBookById(note.notebookId).title,
    }
    noteConfig.title = note.noteTitle
    noteConfig.url = note.noteURL
    noteConfig.excerptText = note.excerptText
    noteConfig.date = {
      create:note.createDate.toLocaleString(),
      modify:note.modifiedDate.toLocaleString(),
    }
    noteConfig.allText = note.allNoteText()
    noteConfig.tags = note.tags
    noteConfig.hashTags = note.tags.map(tag=> ("#"+tag))
    if (note.docMd5 && MNUtil.getDocById(note.docMd5)) {
      noteConfig.docName = MNUtil.getFileName(MNUtil.getDocById(note.docMd5).pathFile) 
    }
    if (note.childMindMap) {
      noteConfig.childMindMap = this.getNoteObject(note.childMindMap)
    }
    if ("parent" in opt && opt.parent && note.parentNote) {
      noteConfig.parent = this.getNoteObject(note.parentNote)
    }
    if ("child" in opt && opt.child && note.childNotes) {
      noteConfig.child = note.childNotes.map(note=>this.getNoteObject(note))
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
        this.showHUD("Please install 'MN Subscription' first!")
      }
      return false
    }
  }
  static isSubscribed(msg = true){
    if (typeof subscriptionConfig !== 'undefined') {
      return subscriptionConfig.isSubscribed()
    }else{
      if (msg) {
        this.showHUD("Please install 'MN Subscription' first!")
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
  static focus(note,des){
    let targetNote = note
    if (des.source) {
      switch (des.source) {
        case "parentNote":
          targetNote = note.parentNote
          if (!targetNote) {
            MNUtil.showHUD("No parentNote!")
            return
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
          targetNote.focusInDocument()
          break;
        case "mindmap":
          targetNote.focusInMindMap()
          break;
        case "both":
          targetNote.focusInDocument()
          targetNote.focusInMindMap()
          break;
        case "floatMindmap":
          targetNote.focusInFloatMindMap()
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
    let focusNote = MNNote.new(MNUtil.currentDocController.highlightFromSelection())
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
        }
        if ("asTitle" in des && des.asTitle) {
          focusNote.noteTitle = focusNote.excerptText
          focusNote.excerptText = ""
          focusNote.excerptTextMarkdown = false
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
        resolve(focusNote)
        } catch (error) {
          toolbarUtils.addErrorLog(error, "noteHighlight")
          resolve(undefined)
        }
      })
    })
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
  static async setColor(des){
  try {
    let fillIndex = -1
    let colorIndex = des.color
    if ("fillPattern" in des) {
      fillIndex = des.fillPattern
    }
    if ("followAutoStyle" in des && des.followAutoStyle && (typeof autoUtils !== 'undefined')) {
      let focusNotes
      let followAutoStyle = true
      let selection = MNUtil.currentSelection
      if (selection.onSelection) {
        focusNotes = MNNote.new(MNUtil.currentDocController.highlightFromSelection())
        // followAutoStyle = false
      }else{
        focusNotes = MNNote.getFocusNotes()
      }
      MNUtil.showHUD("followAutoStyle")
      MNUtil.undoGrouping(()=>{
        focusNotes.map(note=>{
          if (followAutoStyle) {
            let fillIndex
            if (note.excerptPic) {
              fillIndex = autoUtils.getConfig("image")[colorIndex]
            }else{
              fillIndex = autoUtils.getConfig("text")[colorIndex]
            }
          }
          this.setNoteColor(note,colorIndex,fillIndex)
        })
      })
      return
    }

    // MNUtil.copy(description+fillIndex)
    let focusNotes
    let selection = MNUtil.currentSelection
    if (selection.onSelection) {
      focusNotes = [MNNote.new(MNUtil.currentDocController.highlightFromSelection())]
    }else{
      focusNotes = MNNote.getFocusNotes()
    }
    // await MNUtil.delay(1)
    MNUtil.undoGrouping(()=>{
      focusNotes.map(note=>{
        this.setNoteColor(note,colorIndex,fillIndex)
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
   * @param {number} colorIndex 
   * @param {number} fillIndex 
   */
  static setNoteColor(note,colorIndex,fillIndex){
    if (note.note.groupNoteId) {
      let originNote = MNNote.new(note.note.groupNoteId)
      originNote.notes.forEach(n=>{
        n.colorIndex = colorIndex
        if (fillIndex !== -1) {
          n.fillIndex = fillIndex
        }
      })
    }else{
      note.notes.forEach(n=>{
        n.colorIndex = colorIndex
        if (fillIndex !== -1) {
          n.fillIndex = fillIndex
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
  static async export(des){
    let focusNote = MNNote.getFocusNote()
    let exportTarget = des.target ?? "auto"
    let exportSource = des.source ?? "noteDoc"
    switch (exportSource) {
      case "noteDoc":
        let noteDocPath = MNUtil.getDocById(focusNote.note.docMd5).fullPathFileName
        MNUtil.saveFile(noteDocPath, ["public.pdf"])
        break;
      case "note":
        let md = await this.getMDFromNote(focusNote)
        MNUtil.copy(md)
        break;
      case "currentDoc":
        let docPath = MNUtil.currentDocController.document.fullPathFileName
        MNUtil.saveFile(docPath, ["public.pdf"])
        break;
      default:
        break;
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
      "🔨 empty action with double click",
      "🔨 empty action with finish action",
      "🔨 insert snippet",
      "🔨 insert snippet with menu",
      "🔨 add note index",
      "🔨 toggle mindmap",
      "🔨 copy with menu",
      "🔨 copy markdown link",
      "🔨 toggle markdown",
      "🔨 toggle textFirst",
      "🔨 chatAI with menu",
      "🔨 search with menu",
      "🔨 OCR with menu",
      "🔨 OCR to clipboard",
      "🔨 OCR as chat mode reference",
      "🔨 toggle full doc and tab bar",
      "🔨 merge text of merged notes",
      "🔨 create & move to main mindmap",
      "🔨 create & move as child note",
      "🔨 move note to main mindmap",
      "🔨 menu with actions",
      "🔨 focus in float window",
      "🔨 user confirm",
      "🔨 show message",
      "🔨 trigger button"
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
  static showEditorOnNoteEdit = false
  static defalutButtonConfig = {color:"#ffffff",alpha:0.85}
  static defaultWindowState = {
    sideMode:"",//固定工具栏下贴边模式
    splitMode:false,//固定工具栏下是否跟随分割线
    open:false,//固定工具栏是否默认常驻
    dynamicButton:9,//跟随模式下的工具栏显示的按钮数量,
    frame:{x:0,y:0,width:40,height:415}
  }
  //非自定义动作的key
  static builtinActionKeys = ["copy","searchInEudic","switchTitleorExcerpt","copyAsMarkdownLink","search","bigbang","snipaste","chatglm","edit","ocr","execute","pasteAsTitle","clearFormat","color0","color1","color2","color3","color4","color5","color6","color7","color8","color9","color10","color11","color12","color13","color14","color15"]
  static allPopupButtons = [
  "copy",
  "copyOCR",
  "toggleTitle",
  "toggleCopyMode",
  "toggleGroupMode",
  "moveNoteTo",
  "linkNoteTo",
  "noteHighlight",
  "blankHighlight",
  "mergeHighlight",
  "delHighlight",
  "sendHighlight",
  "foldHighlight",
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
  "imageboxOnPage",
  "moreOperations",
]
  static defaultPopupReplaceConfig = {
    noteHighlight:{enabled:false,target:"",name:"noteHighlight"},
    addToReview:{enabled:false,target:"",name:"addToReview"},
    goPalette:{enabled:false,target:"",name:"goPalette"},
    editHashtags:{enabled:false,target:"",name:"editHashtags"},
    toggleTitle:{enabled:false,target:"",name:"toggleTitle"},
    moveNoteTo:{enabled:false,target:"",name:"moveNoteTo"},
    toggleCopyMode:{enabled:false,target:"",name:"toggleCopyMode"},
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
    imageboxOnPage:{enabled:false,target:"",name:"imageboxOnPage"},
    setBlankLayer:{enabled:false,target:"",name:"setBlankLayer"},
    sourceHighlightOfNote:{enabled:false,target:"",name:"sourceHighlightOfNote"},
    paintHighlight:{enabled:false,target:"",name:"paintHighlight"},
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
    "color15":2.4
  }
  static imageConfigs = {}
  static imageScale = {}
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
    //数组格式,存的是每个action的key
    this.action = this.getByDefault("MNToolbar_action", this.getDefaultActionKeys())
    this.action = this.action.map(a=>{
      if (a === "excute") {
        return "execute"
      }
      return a
    })
    
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
      let editorConfig = this.getDescriptionByName("edit")
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
  }
  static initCloudStore(){
    this.cloudStore = NSUbiquitousKeyValueStore.defaultStore()
    MNUtil.postNotification("NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI", {})
    // this.readCloudConfig(false)
  }
  static getPopupConfig(key){
    if (this.popupConfig[key] !== undefined) {
      return this.popupConfig[key]
    }else{
      return this.defaultPopupReplaceConfig[key]
    }
  }
  static addCloudChangeObserver(observer, selector, name) {
    NSNotificationCenter.defaultCenter().addObserverSelectorName(observer, selector, name, this.cloudStore)
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
        if (["lastModifyTime","lastSyncTime"].includes(key)) {
          return true
        }
        if (!this.deepEqual(obj1[key], obj2[key])) {
          return false;
        }
    }
    return true;
  }
  static getAllConfig(){
    let config = {
      windowState: this.windowState,
      syncConfig: this.syncConfig,
      dynamic: this.dynamic,
      addonLogos: this.addonLogos,
      actionKeys: this.action,
      actions: this.actions,
      buttonConfig:this.buttonConfig,
      popupConfig:this.popupConfig
    }
    return config
  }
  static importConfig(config){
    this.windowState = config.windowState
    this.syncConfig = config.syncConfig
    this.dynamic = config.dynamic
    this.addonLogos = config.addonLogos
    this.action = config.actionKeys
    this.actions = config.actions
    this.buttonConfig = config.buttonConfig
    this.popupConfig = config.popupConfig
  }
  static async readCloudConfig(msg = true,alert = false){
    if(!this.syncConfig.iCloudSync){
      return false
    }
    if (!toolbarUtils.checkSubscribe(false,msg,true)) {
      return false
    }
    if (!this.cloudStore) {
      this.cloudStore = NSUbiquitousKeyValueStore.defaultStore()
    }
    try {
      // this.cloudStore.removeObjectForKey("MNToolbar_totalConfig")
      let cloudConfig = this.cloudStore.objectForKey("MNToolbar_totalConfig")
      // MNUtil.copy(cloudConfig)
      if (cloudConfig && cloudConfig.syncConfig) {
        let same = this.deepEqual(cloudConfig, this.getAllConfig())
        if (same) {
          // MNUtil.showHUD("No change")
          return false
        }
        // MNUtil.copyJSON(cloudConfig)
        if (this.syncConfig.lastSyncTime < cloudConfig.syncConfig.lastSyncTime ) {
          // MNUtil.copy("Import from iCloud")
          if (alert) {
            let confirm = await MNUtil.confirm("Import from iCloud?","是否导入iCloud配置？")
            if (!confirm) {
              return false
            }
          }
          this.windowState = cloudConfig.windowState
          this.syncConfig = cloudConfig.syncConfig
          this.dynamic = cloudConfig.dynamic
          this.addonLogos = cloudConfig.addonLogos
          this.action = cloudConfig.actionKeys
          this.actions = cloudConfig.actions
          this.buttonConfig = cloudConfig.buttonConfig
          this.popupConfig = cloudConfig.popupConfig
          this.syncConfig.lastSyncTime = Date.now()
          this.syncConfig.lastModifyTime = Date.now()
          this.save(undefined,undefined,false)
          if (msg) {
            MNUtil.showHUD("Importing...")
          }
          return true

        }
        if (this.syncConfig.lastSyncTime > (cloudConfig.syncConfig.lastSyncTime+1000) ) {
          if (alert) {
            let confirm = await MNUtil.confirm("Uploading to iCloud?","是否上传配置到iCloud？")
            if (!confirm) {
              return false
            }
          }
          this.writeCloudConfig()
          if (msg) {
            MNUtil.showHUD("Uploading...")
          }
        }
        return false
      }else{
        let confirm = await MNUtil.confirm("Empty config in iCloud, uploading?","iCloud配置为空,是否上传？")
        if (!confirm) {
          return false
        }
        this.writeCloudConfig()
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
  static writeCloudConfig(msg = true){
    if(!this.syncConfig.iCloudSync){
      return
    }
    if (!toolbarUtils.checkSubscribe(false,msg,true)) {
      return
    }
    if (!this.cloudStore) {
      this.cloudStore = NSUbiquitousKeyValueStore.defaultStore()
    }
    let cloudConfig = this.cloudStore.objectForKey("MNToolbar_totalConfig")
    if (cloudConfig && cloudConfig.syncConfig) {
      let same = this.deepEqual(cloudConfig, this.getAllConfig())
      if (same) {
        // MNUtil.showHUD("No change")
        return false
      }
    }
    if (this.syncConfig.lastSyncTime < cloudConfig.syncConfig.lastSyncTime ) {
      let localTime = Date.parse(this.syncConfig.lastSyncTime).toLocaleString()
      let cloudTime = Date.parse(cloudConfig.syncConfig.lastSyncTime).toLocaleString()
      MNUtil.showHUD("Conflict config: loca_"+localTime+", cloud_"+cloudTime)
      return false
    }
    this.syncConfig.lastSyncTime = Date.now()
    this.syncConfig.lastModifyTime = Date.now()
    let config = {
      windowState: this.windowState,
      syncConfig: this.syncConfig,
      dynamic: this.dynamic,
      addonLogos: this.addonLogos,
      actionKeys: this.action,
      actions: this.actions,
      buttonConfig:this.buttonConfig,
      popupConfig:this.popupConfig
    }
    // MNUtil.copyJSON(config)
    this.cloudStore.setObjectForKey(config,"MNToolbar_totalConfig")
    this.syncConfig.lastSyncTime = Date.now()
    this.syncConfig.lastModifyTime = Date.now()
    this.save("MNToolbar_syncConfig",undefined,false)
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
    this.runImage = MNUtil.getImage(this.mainPath+"/run.png",2.6)
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
  static getAllActions(){
    let absentKeys = this.getDefaultActionKeys().filter(key=>!this.action.includes(key))
    let allActions = this.action.concat(absentKeys)
    return allActions
  }
  static getDesByButtonName(targetButtonName){
    let allActions = this.action.concat(this.getDefaultActionKeys().slice(this.action.length))
    let allButtonNames = allActions.map(action=>this.getAction(action).name)
    let buttonIndex = allButtonNames.indexOf(targetButtonName)
    if (buttonIndex === -1) {
      MNUtil.showHUD("Button not found: "	+ targetButtonName)
      return undefined
    }
    let action = allActions[buttonIndex]
    let actionDes = toolbarConfig.getDescriptionByName(action)
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
static getAction(actionKey){
  if (actionKey in this.actions) {
    return this.actions[actionKey]
  }
  return this.getActions()[actionKey]
}

static getActions() {
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
    "pasteAsTitle":{name:"Paste As Title",image:"pasteAsTitle",description:"{}"},
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
    "ocr":{name:"ocr",image:"ocr",description:JSON.stringify({target:"comment",source:"default"})},
    "edit":{name:"edit",image:"edit",description:JSON.stringify({showOnNoteEdit:false})},
    "execute":{name:"execute",image:"execute",description:"MNUtil.showHUD('Hello world')"},
    "sidebar":{name:"sidebar",image:"sidebar",description:"{}"},
  }
}
static execute(){


}
static getDefaultActionKeys() {
  
  let actions = this.getActions()
  return Object.keys(actions)
}
static save(key = undefined,value = undefined,upload = true) {
  // MNUtil.showHUD("save")
  if(key === undefined){
    let defaults = NSUserDefaults.standardUserDefaults()
    defaults.setObjectForKey(this.windowState,"MNToolbar_windowState")
    defaults.setObjectForKey(this.dynamic,"MNToolbar_dynamic")
    defaults.setObjectForKey(this.action,"MNToolbar_action")
    defaults.setObjectForKey(this.actions,"MNToolbar_actionConfig")
    defaults.setObjectForKey(this.addonLogos,"MNToolbar_addonLogos")
    defaults.setObjectForKey(this.buttonConfig,"MNToolbar_buttonConfig")
    defaults.setObjectForKey(this.popupConfig,"MNToolbar_popupConfig")
    defaults.setObjectForKey(this.imageScale,"MNToolbar_imageScale")
    defaults.setObjectForKey(this.syncConfig,"MNToolbar_syncConfig")
    if (upload) {
      this.writeCloudConfig(false)
    }
    return
  }
  if (value) {
    NSUserDefaults.standardUserDefaults().setObjectForKey(value,key)
  }else{
    // showHUD(key)
    switch (key) {
      case "MNToolbar_windowState":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.windowState,key)
        break;
      case "MNToolbar_dynamic":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.dynamic,key)
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
    if (upload) {
      this.writeCloudConfig(false)
    }
  }
  NSUserDefaults.standardUserDefaults().synchronize()
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
static reset(){
  this.action = this.getDefaultActionKeys()
  this.actions = this.getActions()
  this.save("MNToolbar_action")
  this.save("MNToolbar_actionConfig")
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
static getDescriptionByName(actionName){
  let des
  if (actionName in toolbarConfig.actions) {
    des = toolbarConfig.actions[actionName].description
  }else{
    des = toolbarConfig.getActions()[actionName].description
  }
  if (MNUtil.isValidJSON(des)) {
    return JSON.parse(des)
  }
  return undefined
}
  static checkCouldSave(actionName){
    if (actionName.includes("custom")) {
      return true
    }
    if (actionName.includes("color")) {
      return true
    }
    let whiteNamelist = ["search","copy","chatglm","ocr","edit","searchInEudic","pasteAsTitle"]
    if (whiteNamelist.includes(actionName)) {
      return true
    }
    MNUtil.showHUD("Only available for Custom Action!")
    return false
  }

}
class toolbarSandbox{
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