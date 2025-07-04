

class taskFrame{
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
class taskUtils {
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
      "🔨 user select":{
        "description": "要求用户选择一个选项",
        "action": "userSelect",
        "title": "test",
        "selectItems": [
          {
            "action": "showMessage",
            "content": "选中第一个",
            "selectTitle": "teste1"
          },
          {
            "action": "showMessage",
            "content": "选中第二个",
            "selectTitle": "teste2"
          }
        ]
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
      "🔨 split note to mindmap":{
        "action": "markdown2Mindmap",
        "source": "currentNote"
      },
      "🔨 import mindmap from clipboard":{
        "action": "markdown2Mindmap",
        "source": "clipboard"
      },
      "🔨 import mindmap from markdown file":{
        "action": "markdown2Mindmap",
        "source": "file"
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
      "🔨 create & set branch style":{
        "description": "创建摘录并设置分支样式",
        "action": "noteHighlight",
        "onFinish": {
          "action": "command",
          "command": "SelBranchStyle3"
        }
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
                    "mindmapTask",
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
      },
      "🔨 focus note":{
        "description": "聚焦特定笔记",
        "action": "focus",
        "noteURL": "marginnote4app://note/C1919104-10E9-4C97-B967-1F2BE3FD0BDF",
        "target": "floatMindmap"
      }
    }
  static init(mainPath){
  try {
    this.app = Application.sharedInstance()
    this.data = Database.sharedInstance()
    this.focusWindow = this.app.focusWindow
    this.mainPath = mainPath
    this.version = this.appVersion()
    this.errorLog = [this.version]
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
      let taskVersion = MNUtil.readJSON(this.mainPath+"/mnaddon.json").version
      info.taskVersion = taskVersion
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
    taskUtils.addErrorLog(error, "isPureMNImages")
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
    taskUtils.addErrorLog(error, "hasMNImages")
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
    taskUtils.addErrorLog(error, "replaceBase64ImagesWithR2")
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
          taskUtils.smartCopy()
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
      taskUtils.addErrorLog(error, "copy")
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
      await taskUtils.delay(delay)
      if (typeof MNUtil === 'undefined') {
        if (alert) {
          taskUtils.confirm("MN Task: Install 'MN Utils' first", "MN Task: 请先安装'MN Utils'")
        }else{
          taskUtils.showHUD("MN Task: Please install 'MN Utils' first!",5)
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
    if (!str.startsWith("/")) return new RegExp(taskUtils.escapeStringRegexp(str))
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
      case "comments"://todo: 改进type检测,支持未添加index参数时移除所有评论
        // this.removeComment(des)
        let commentLength = note.comments.length
        let comment
        for (let i = commentLength-1; i >= 0; i--) {
          if ("type" in des) {
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
      default:
        MNUtil.showHUD("Invalid target: "+target)
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
  static setContent(des){
    try {
    let range = des.range ?? "currentNotes"
    let targetNotes = this.getNotesByRange(range)
    MNUtil.undoGrouping(()=>{
      targetNotes.forEach(note=>{
        let content = des.content ?? "content"
        this.setNoteContent(note, content,des)
      })
    })
    } catch (error) {
      taskUtils.addErrorLog(error, "setContent")
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
          targetNote.focusInFloatMindMap()
        }else{
          MNUtil.showHUD("No Note found!")
        }
        return
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
        if (note.noteId in taskUtils.commentToRemove) {
          taskUtils.commentToRemove[note.noteId].push(-1)
        }else{
          taskUtils.commentToRemove[note.noteId] = [-1]
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
              if (note.noteId in taskUtils.commentToRemove) {
                taskUtils.commentToRemove[note.noteId].push(index)
              }else{
                taskUtils.commentToRemove[note.noteId] = [index]
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
              if (note.noteId in taskUtils.commentToRemove) {
                taskUtils.commentToRemove[note.noteId].push(index)
              }else{
                taskUtils.commentToRemove[note.noteId] = [index]
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
          let childNote = note.createChildNote(config)
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
      let childNote = note.createChildNote(config)
      this.AST2Mindmap(childNote,c)
    })
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
      default:
        break;
    }
    // let markdown = des.markdown
    MNUtil.showHUD("Creating Mindmap...")
    await MNUtil.delay(0.1)
    let res = taskUtils.markdown2AST(markdown)
    // MNUtil.copy(res)
    MNUtil.undoGrouping(()=>{
      if (!focusNote) {
        focusNote = this.newNoteInCurrentChildMap({title:newNoteTitle})
        focusNote.focusInFloatMindMap(0.5)
      }
      taskUtils.AST2Mindmap(focusNote,res)
    })
    return
 } catch (error) {
  this.addErrorLog(error, "markdown2Mindmap")
  return
 }
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
    MNUtil.showHUD("MN Task Error ("+source+"): "+error)
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
        if (button.menu) {
          button.menu.dismissAnimated(true)
          let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
          let endFrame = taskFrame.gen(beginFrame.x-225, beginFrame.y-50, 500, 500)
          endFrame.y = MNUtil.constrain(endFrame.y, 0, studyFrame.height-500)
          endFrame.x = MNUtil.constrain(endFrame.x, 0, studyFrame.width-500)
          MNUtil.postNotification("lookupText"+target,{text:textSelected,beginFrame:beginFrame,endFrame:endFrame})
          return
        }
        let endFrame
        beginFrame.y = beginFrame.y-10
        if (beginFrame.x+490 > studyFrame.width) {
          endFrame = taskFrame.gen(beginFrame.x-450, beginFrame.y-10, 500, 500)
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
          endFrame = taskFrame.gen(beginFrame.x+40, beginFrame.y-10, 500, 500)
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


      // let des = taskConfig.getDescriptionByName("searchInEudic")
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
      let confirmTitle = taskUtils.detectAndReplace(des.title)
      let confirmSubTitle = des.subTitle ? taskUtils.detectAndReplace(des.subTitle) : ""
      let selectTitles = des.selectItems.map(item=>{
        return taskUtils.detectAndReplace(item.selectTitle)
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
  static chatAI(des,button){
    if (des.target === "openFloat") {
      MNUtil.postNotification("chatAIOpenFloat", {beginFrame:button.convertRectToView(button.bounds,MNUtil.studyView)})
      return
    }
    if (des.target === "currentPrompt") {
      MNUtil.postNotification("customChat",{})
      return true
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
  static search(des,button){
    // MNUtil.copyJSON(des)
    // MNUtil.showHUD("Search")
    let selectionText = MNUtil.selectionText
    let noteId = undefined
    let focusNote = MNNote.getFocusNote()
    if (focusNote) {
      noteId = focusNote.noteId
    }
    let studyFrame = MNUtil.studyView.bounds
    let beginFrame = button.frame
    if (button.menu) {
      button.menu.dismissAnimated(true)
      let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
      let endFrame = taskFrame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
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
    // if (button.menu) {
    //   beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
    // }
    let endFrame
    beginFrame.y = beginFrame.y-10
    if (beginFrame.x+490 > studyFrame.width) {
      endFrame = taskFrame.gen(beginFrame.x-450, beginFrame.y-10, 450, 500)
      if (beginFrame.y+490 > studyFrame.height) {
        endFrame.y = studyFrame.height-500
      }
    }else{
      endFrame = taskFrame.gen(beginFrame.x+40, beginFrame.y-10, 450, 500)
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
      // MNUtil.showHUD("MN Task: Please install 'MN OCR' first!")
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
                let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
                let endFrame = taskFrame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
                endFrame.y = taskUtils.constrain(endFrame.y, 0, studyFrame.height-500)
                endFrame.x = taskUtils.constrain(endFrame.x, 0, studyFrame.width-500)
                MNUtil.postNotification("openInEditor",{content:res,beginFrame:beginFrame,endFrame:endFrame})
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
                let studyFrame = MNUtil.studyView.bounds
                let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
                let endFrame = taskFrame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
                endFrame.y = taskUtils.constrain(endFrame.y, 0, studyFrame.height-500)
                endFrame.x = taskUtils.constrain(endFrame.x, 0, studyFrame.width-500)
                MNUtil.postNotification("openInEditor",{content:res,beginFrame:beginFrame,endFrame:endFrame})
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
          let studyFrame = MNUtil.studyView.bounds
          let beginFrame = button.convertRectToView(button.bounds,MNUtil.studyView)
          let endFrame = taskFrame.gen(beginFrame.x-225, beginFrame.y-50, 450, 500)
          endFrame.y = taskUtils.constrain(endFrame.y, 0, studyFrame.height-500)
          endFrame.x = taskUtils.constrain(endFrame.x, 0, studyFrame.width-500)
          MNUtil.postNotification("openInEditor",{content:res,beginFrame:beginFrame,endFrame:endFrame})
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
      create:note.createDate.toLocaleString(),
      modify:note.modifiedDate.toLocaleString(),
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
  var TYPES = 'Object Function Boolean Symbol MNUtil MNNote taskUtils taskConfig';

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
      this.showHUD("MN Task: Please install 'MN Utils' first!")
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
        case "parentNote":
          targetNote = targetNote.parentNote
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
          taskUtils.addErrorLog(error, "noteHighlight")
          resolve(undefined)
        }
      })
    })
  }
  static insertSnippet(des){
    let target = des.target ?? "textview"
    let success = true
    switch (target) {
      case "textview":
        let textView = taskUtils.textView
        if (!textView || textView.hidden) {
          MNUtil.showHUD("No textView")
          success = false
          break;
        }
        let textContent = taskUtils.detectAndReplace(des.content)
        success = taskUtils.insertSnippetToTextView(textContent,textView)
        break;
      case "editor":
        let contents = [
          {
            type:"text",
            content:taskUtils.detectAndReplace(des.content)
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
              taskUtils.addErrorLog(error, "openSideBar")
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
  static async setColor(des){
  try {
    let fillIndex = -1
    let colorIndex = des.color
    if ("fillPattern" in des) {
      fillIndex = des.fillPattern
    }
    if ("followAutoStyle" in des && des.followAutoStyle && (typeof autoUtils !== 'undefined')) {
      let focusNotes
      let selection = MNUtil.currentSelection
      if (selection.onSelection) {
        focusNotes = [MNNote.new(selection.docController.highlightFromSelection())]
      }else{
        focusNotes = MNNote.getFocusNotes()
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
          this.setNoteColor(note,colorIndex,fillIndex)

        })
        } catch (error) {
          taskUtils.addErrorLog(error, "setColor")
        }
      })
      return
    }

    // MNUtil.copy(description+fillIndex)
    let focusNotes
    let selection = MNUtil.currentSelection
    if (selection.onSelection) {
      focusNotes = [MNNote.new(selection.docController.highlightFromSelection())]
    }else{
      focusNotes = MNNote.getFocusNotes()
    }
    // await MNUtil.delay(1)
    MNUtil.undoGrouping(()=>{
      focusNotes.map(note=>{
        this.setNoteColor(note,colorIndex,fillIndex)
          // let tem = {
          //   noteId:note.colorIndex}
          // // MNUtil.copy(note.realGroupNoteIdForTopicId())
          // // MNUtil.showHUD("123")
          // if (note.originNoteId) {
          //   // MNUtil.showHUD("message")
          //   let originNote = MNNote.new(note.originNoteId)
          //   tem.originNoteId = originNote.colorIndex
          //   this.setNoteColor(originNote,colorIndex,fillIndex)
          // }
          // tem.realGroupNoteId = note.realGroupNoteIdForTopicId()
          // MNUtil.copy(tem)
          // if (note.realGroupNoteIdForTopicId() && note.realGroupNoteIdForTopicId() !== note.noteId) {
          //   // MNUtil.showHUD("realGroupNoteIdForTopicId")
          //   let realGroupNote = note.realGroupNoteForTopicId()
          //   this.setNoteColor(realGroupNote,colorIndex,fillIndex)

          // }
      })
    })
  } catch (error) {
    taskUtils.addErrorLog(error, "setColor")
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
    if (note.note.groupNoteId) {//有合并卡片
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
      // if (note.originNoteId) {
      //   let originNote = MNNote.new(note.originNoteId)
      //   originNote.notes.forEach(n=>{
      //     n.colorIndex = colorIndex
      //     if (fillIndex !== -1) {
      //       n.fillIndex = fillIndex
      //     }
      //   })
      //   // this.setNoteColor(originNote,colorIndex,fillIndex)
      // }
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
    let frame = taskFrame.gen(X-studyFrameX, Y, W, H)
    return frame
  }
  static getButtonColor(){
    if (!this.isSubscribed(false)) {
      return MNUtil.hexColorAlpha("#ffffff", 0.85)
    }
    // let color = MNUtil.app.defaultBookPageColor.hexStringValue
    // MNUtil.copy(color)
    let varColors = ["defaultBookPageColor","defaultHighlightBlendColor","defaultDisableColor","defaultTextColor","defaultNotebookColor","defaultTintColor","defaultTintColorForSelected","defaultTintColorForDarkBackground"]
    if (varColors.includes(taskConfig.buttonConfig.color)) {
      return MNUtil.app[taskConfig.buttonConfig.color].colorWithAlphaComponent(taskConfig.buttonConfig.alpha)
    }
    // if () {
      
    // }
    return MNUtil.hexColorAlpha(taskConfig.buttonConfig.color, taskConfig.buttonConfig.alpha)
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
        MNUtil.writeText(taskConfig.mainPath+"/export.md",content)
        MNUtil.saveFile(taskConfig.mainPath+"/export.md", ["public.md"])
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
      taskUtils.addErrorLog(error, "export")
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
    if (!taskConfig.checkCouldSave(item)) {
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
      "🔨 split note to mindmap",
      "🔨 import mindmap from markdown file",
      "🔨 import mindmap from clipboard",
      "🔨 OCR with menu",
      "🔨 OCR to clipboard",
      "🔨 OCR as chat mode reference",
      "🔨 toggle full doc and tab bar",
      "🔨 merge text of merged notes",
      "🔨 create & move to main mindmap",
      "🔨 create & move as child note",
      "🔨 create & set branch style",
      "🔨 move note to main mindmap",
      "🔨 menu with actions",
      "🔨 focus in float window",
      "🔨 focus note",
      "🔨 user confirm",
      "🔨 user select",
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
    let config = this.getVarInfo(text,userInput,{note:noteConfig})
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
  let config = this.getVarInfo(text,userInput,{note:noteConfig})
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
   * @returns {Promise<number>} A promise that resolves with the button index of the button clicked by the user.
   */
  static async confirm(mainTitle,subTitle){
    return new Promise((resolve, reject) => {
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        mainTitle,subTitle,0,"Cancel",["Confirm"],
        (alert, buttonIndex) => {
          // MNUtil.copyJSON({alert:alert,buttonIndex:buttonIndex})
          resolve(buttonIndex)
        }
      )
    })
  }
}

class taskConfig {
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
    // 夏大鱼羊 - begin：add Preprocess
    preprocess:false,
    // 夏大鱼羊 - end
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
  "dragDrop"
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
    // this.config = this.getByDefault("MNTask_config",this.defaultConfig)
    try {
    this.mainPath = mainPath
    this.dynamic = this.getByDefault("MNTask_dynamic",false)
    this.addonLogos = this.getByDefault("MNTask_addonLogos",{})
    // 夏大鱼羊 - begin：用来存参考文献的数据
    taskConfig.referenceIds = this.getByDefault("MNTask_referenceIds", {})
    // 夏大鱼羊 - end
    // 任务管理根节点和分区卡片存储
    this.rootNoteId = this.getByDefault("MNTask_rootNoteId", null)
    this.partitionCards = this.getByDefault("MNTask_partitionCards", {})
    this.windowState = this.getByDefault("MNTask_windowState",this.defaultWindowState)
    this.buttonNumber = this.getDefaultActionKeys().length
    //数组格式,存的是每个action的key
    this.action = this.getByDefault("MNTask_action", this.getDefaultActionKeys())
    this.action = this.action.map(a=>{
      if (a === "excute") {
        return "execute"
      }
      return a
    })
    this.dynamicAction = this.getByDefault("MNTask_dynamicAction", this.action)
    if (this.dynamicAction.length === 0) {
      this.dynamicAction = this.action
    }

    this.actions = this.getByDefault("MNTask_actionConfig", this.getActions())
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
    this.buttonConfig = this.getByDefault("MNTask_buttonConfig", this.defalutButtonConfig)
    // MNUtil.copyJSON(this.buttonConfig)
    this.highlightColor = UIColor.blendedColor(
      UIColor.colorWithHexString("#2c4d81").colorWithAlphaComponent(0.8),
      taskUtils.app.defaultTextColor,
      0.8
    );
      let editorConfig = this.getDescriptionByName("edit")
      if ("showOnNoteEdit" in editorConfig) {
        this.showEditorOnNoteEdit = editorConfig.showOnNoteEdit
      }
      
    } catch (error) {
      taskUtils.addErrorLog(error, "init")
    }
    this.buttonImageFolder = MNUtil.dbFolder+"/buttonImage"
    NSFileManager.defaultManager().createDirectoryAtPathAttributes(this.buttonImageFolder, undefined)
    // this.popupConfig = this.getByDefault("MNTask_popupConfig", this.defaultPopupReplaceConfig)
    // this.popupConfig = this.defaultPopupReplaceConfig
    this.popupConfig = this.getByDefault("MNTask_popupConfig", this.defaultPopupReplaceConfig)
    this.syncConfig = this.getByDefault("MNTask_syncConfig", this.defaultSyncConfig)
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
    if (taskUtils.checkSubscribe(false,false,true)) {
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
          //iOS端不参与"MNTask_windowState"的云同步,因此比较时忽略该参数
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
      referenceIds:this.referenceIds,
      rootNoteId: this.rootNoteId,
      partitionCards: this.partitionCards,
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
    if (!MNUtil.isIOS()) { //iOS端不参与"MNTask_windowState"的云同步
      this.windowState = config.windowState
    }
    let icloudSync = this.syncConfig.iCloudSync
    this.syncConfig = config.syncConfig
    this.dynamic = config.dynamic
    this.addonLogos = config.addonLogos
    this.referenceIds = config.referenceIds
    this.rootNoteId = config.rootNoteId
    this.partitionCards = config.partitionCards
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
      taskUtils.addErrorLog(error, "importConfig")
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
      let cloudConfig = this.cloudStore.objectForKey("MNTask_totalConfig")
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
      // this.cloudStore.removeObjectForKey("MNTask_totalConfig")
      let cloudConfig = this.cloudStore.objectForKey("MNTask_totalConfig")
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
            let confirm = await MNUtil.confirm("MN Task: Import from iCloud?","MN Task: 是否导入iCloud配置？")
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
            let confirm = await MNUtil.confirm("MN Task: Uploading to iCloud?","MN Task: 是否上传配置到iCloud？")
            if (!confirm) {
              return false
            }
          }
          this.writeCloudConfig()
          return false
        }
        let userSelect = await MNUtil.userSelect("MN Task\nConflict config, import or export?","配置冲突，请选择操作",["📥 Import / 导入","📤 Export / 导出"])
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
        let confirm = await MNUtil.confirm("MN Task: Empty config in iCloud, uploading?","MN Task: iCloud配置为空,是否上传？")
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
      taskUtils.addErrorLog(error, "readCloudConfig")
      return false
    }
  }
  static writeCloudConfig(msg = true,force = false){
  try {
    if (force) {//force下不检查订阅(由更上层完成)
      this.checkCloudStore()
      this.syncConfig.lastSyncTime = Date.now()
      this.syncConfig.lastModifyTime = Date.now()
      let cloudConfig = this.cloudStore.objectForKey("MNTask_totalConfig")
      let config = this.getAllConfig()
      if (MNUtil.isIOS() && cloudConfig && cloudConfig.windowState) {
        //iOS端不参与"MNTask_windowState"的云同步
        config.windowState = cloudConfig.windowState
      }
      if (msg) {
        MNUtil.showHUD("Uploading...")
      }
      this.cloudStore.setObjectForKey(config,"MNTask_totalConfig")
      return true
    }
    if(!this.iCloudSync){
      return false
    }
    let iCloudSync = this.syncConfig.iCloudSync
    this.checkCloudStore()
    let cloudConfig = this.cloudStore.objectForKey("MNTask_totalConfig")
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
      //iOS端不参与"MNTask_windowState"的云同步
      config.windowState = cloudConfig.windowState
    }
    // MNUtil.copyJSON(config)
    if (msg) {
      MNUtil.showHUD("Uploading...")
    }
    config.syncConfig.iCloudSync = iCloudSync
    this.cloudStore.setObjectForKey(config,"MNTask_totalConfig")
    this.syncConfig.lastSyncTime = Date.now()
    this.save("MNTask_syncConfig",undefined,false)
    return true
  } catch (error) {
    taskUtils.addErrorLog(error, "writeCloudConfig")
    return false
  }
  }
  static initImage(){
    try {
    let keys = this.getDefaultActionKeys()
    this.imageScale = taskConfig.getByDefault("MNTask_imageScale",{})
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
        if (key in taskConfig.defalutImageScale) {
          scale = taskConfig.defalutImageScale[key]
        }
        this.imageConfigs[key] = MNUtil.getImage(this.mainPath+"/"+this.getAction(key).image+".png",scale)
      }
    })
    this.curveImage = MNUtil.getImage(this.mainPath+"/curve.png",2)
    this.runImage = MNUtil.getImage(this.mainPath+"/run.png",2.6)
    this.templateImage = MNUtil.getImage(this.mainPath+"/template.png",2.2)
    // MNUtil.copyJSON(this.imageConfigs)
      } catch (error) {
      taskUtils.addErrorLog(error, "initImage")
    }
  }
  // static setImageByURL(action,url,refresh = false) {
  //   this.imageConfigs[action] = taskUtils.getOnlineImage(url)
  //   if (refresh) {
  //     MNUtil.postNotification("refreshTaskButton", {})
  //   }
  // }
  static setImageByURL(action,url,refresh = false,scale = 3) {
    let md5 = MNUtil.MD5(url)
    // let imagePath = this.mainPath+"/"+this.getAction(action).image+".png"
    // MNUtil.getImage(this.mainPath+"/"+this.getAction(key).image+".png",scale)
    let localPath = this.buttonImageFolder+"/"+md5+".png"
    this.imageScale[action] = {path:md5+".png",scale:scale}
    this.save("MNTask_imageScale")
    let image = undefined
    let imageData = undefined
    if (MNUtil.isfileExists(localPath)) {
      image = MNUtil.getImage(localPath,scale)
      // image.pngData().writeToFileAtomically(imagePath, false)
      this.imageConfigs[action] = image
      if (refresh) {
        MNUtil.postNotification("refreshTaskButton", {})
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
          MNUtil.postNotification("refreshTaskButton", {})
        }
      }
      return
    }
    if (/^https?:\/\//.test(url)) {
      image = taskUtils.getOnlineImage(url,scale)
      this.imageConfigs[action] = image
      imageData = image.pngData()
      // imageData.writeToFileAtomically(imagePath, false)
      imageData.writeToFileAtomically(localPath, false)
      if (refresh) {
        MNUtil.postNotification("refreshTaskButton", {})
      }
      return
    }
    // }
    if (refresh) {
      MNUtil.postNotification("refreshTaskButton", {})
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
    this.save("MNTask_imageScale")
    if (MNUtil.isfileExists(localPath)) {
      this.imageConfigs[action] = image
      if (refresh) {
        MNUtil.postNotification("refreshTaskButton", {})
      }
      return
    }else{
      this.imageConfigs[action] = image
      image.pngData().writeToFileAtomically(localPath, false)
      if (refresh) {
        MNUtil.postNotification("refreshTaskButton", {})
      }
    }
    // }
    if (refresh) {
      MNUtil.postNotification("refreshTaskButton", {})
    }
  } catch (error) {
    taskUtils.addErrorLog(error, "setButtonImage")
  }
  }
  /**
   * 只是返回数组,代表所有按钮的顺序
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
      return undefined
    }
    let action = allActions[buttonIndex]
    let actionDes = taskConfig.getDescriptionByName(action)
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
  static toggleTaskDirection(source){
    if (!taskUtils.checkSubscribe(true)) {
      return
    }
    switch (source) {
      case "fixed":
        if (taskConfig.getWindowState("direction") === "vertical") {
          taskConfig.windowState.direction = "horizontal"
          taskConfig.save("MNTask_windowState")
          MNUtil.showHUD("Set fixed direction to horizontal")

        }else{
          taskConfig.windowState.direction = "vertical"
          taskConfig.save("MNTask_windowState")
          MNUtil.showHUD("Set fixed direction to vertical")
        }
        break;
      case "dynamic":
        if (taskConfig.getWindowState("dynamicDirection") === "vertical") {
          taskConfig.windowState.dynamicDirection = "horizontal"
          taskConfig.save("MNTask_windowState")
          MNUtil.showHUD("Set dynamic direction to horizontal")
        }else{
          taskConfig.windowState.dynamicDirection = "vertical"
          taskConfig.save("MNTask_windowState")
          MNUtil.showHUD("Set dynamic direction to vertical")
        }
        break;
      default:
        break;
    }
    MNUtil.postNotification("refreshTaskButton",{})
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
        let child = taskUtils.createChildNote(note,key)
        this.expandesConfig(child, subConfig,undefined,exclude)
      }else{
        if (exclude) {
          if (key !== exclude) {
            taskUtils.createChildNote(note,key,config[key])
          }
        }else{
          taskUtils.createChildNote(note,key,config[key])
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
  //   taskUtils.addErrorLog(error, "checkLogoStatus")
  //   return true
  // }
  }
static template(action) {
  let config = {action:action}
  switch (action) {
    case "cloneAndMerge":
      config.target = taskUtils.version.version+"app://note/xxxx"
      break
    case "link":
      config.target = taskUtils.version.version+"app://note/xxxx"
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
      config.target = taskUtils.version+"app://note/xxxx"
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
  let action = {}
  if (actionKey in this.actions) {
    action = this.actions[actionKey]
    if (!MNUtil.isValidJSON(action.description)) {//兼容旧版本的description问题
      action.description = this.getActions()[actionKey].description
    }
    return action
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
    "ocr":{name:"ocr",image:"ocr",description:JSON.stringify({target:"comment",source:"default"})},
    "edit":{name:"edit",image:"edit",description:JSON.stringify({showOnNoteEdit:false})},
    "timer":{name:"timer",image:"timer",description:JSON.stringify({target:"menu"})},
    "execute":{name:"execute",image:"execute",description:"MNUtil.showHUD('Hello world')"},
    "sidebar":{name:"sidebar",image:"sidebar",description:"{}"},
    "undo":{name:"undo",image:"undo",description:"{}"},
    "redo":{name:"redo",image:"redo",description:"{}"},
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
    defaults.setObjectForKey(this.windowState,"MNTask_windowState")
    defaults.setObjectForKey(this.dynamic,"MNTask_dynamic")
    defaults.setObjectForKey(this.action,"MNTask_action")
    defaults.setObjectForKey(this.dynamicAction,"MNTask_dynamicAction")
    defaults.setObjectForKey(this.actions,"MNTask_actionConfig")
    defaults.setObjectForKey(this.addonLogos,"MNTask_addonLogos")
    defaults.setObjectForKey(this.referenceIds,"MNTask_referenceIds")
    // 检查 null 值，避免崩溃
    if (this.rootNoteId !== null && this.rootNoteId !== undefined) {
      defaults.setObjectForKey(this.rootNoteId,"MNTask_rootNoteId")
    }
    defaults.setObjectForKey(this.partitionCards,"MNTask_partitionCards")
    defaults.setObjectForKey(this.buttonConfig,"MNTask_buttonConfig")
    defaults.setObjectForKey(this.popupConfig,"MNTask_popupConfig")
    defaults.setObjectForKey(this.imageScale,"MNTask_imageScale")
    defaults.setObjectForKey(this.syncConfig,"MNTask_syncConfig")
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
      case "MNTask_referenceIds":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.referenceIds,key)
        break;
      case "MNTask_rootNoteId":
        // 检查 null 值，避免崩溃
        if (this.rootNoteId !== null && this.rootNoteId !== undefined) {
          NSUserDefaults.standardUserDefaults().setObjectForKey(this.rootNoteId,key)
        }
        break;
      case "MNTask_partitionCards":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.partitionCards,key)
        break;
      case "MNTask_windowState":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.windowState,key)
        if (MNUtil.isIOS()) { //iOS端不参与"MNTask_windowState"的云同步
          return
        }
        break;
      case "MNTask_dynamic":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.dynamic,key)
        break;
      case "MNTask_dynamicAction":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.dynamicAction,key)
        break;
      case "MNTask_action":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.action,key)
        break;
      case "MNTask_actionConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.actions,key)
        break;
      case "MNTask_addonLogos":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.addonLogos,key)
        break;
      case "MNTask_buttonConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.buttonConfig,key)
        break;
      case "MNTask_popupConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.popupConfig,key)
        break;
      case "MNTask_imageScale":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.imageScale,key)
        break;
      case "MNTask_syncConfig":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.syncConfig,key)
        break;
      default:
        taskUtils.showHUD("Not supported")
        break;
    }
    this.syncConfig.lastModifyTime = Date.now()
    if (upload && this.iCloudSync) {
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
    // 检查 defaultValue 是否为 null 或 undefined，避免崩溃
    if (defaultValue !== null && defaultValue !== undefined) {
      NSUserDefaults.standardUserDefaults().setObjectForKey(defaultValue,key)
    }
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
      this.save("MNTask_actionConfig")
      break;
    case "order":
      this.action = this.getDefaultActionKeys()
      this.save("MNTask_action")
      break;  
    case "dynamicOrder":
      this.dynamicAction = this.getDefaultActionKeys()
      this.save("MNTask_dynamicAction")
      break;
    default:
      break;
  }
}
static getDescriptionByIndex(index){
  let actionName = taskConfig.action[index]
  if (actionName in taskConfig.actions) {
    return JSON.parse(taskConfig.actions[actionName].description)
  }else{
    return JSON.parse(taskConfig.getActions()[actionName].description)
  }
}
static getExecuteCode(){
  let actionName = "execute"
  if (actionName in taskConfig.actions) {
    return taskConfig.actions[actionName].description
  }else{
    return taskConfig.getActions()[actionName].description
  }
}
static getDescriptionByName(actionName){
  let des
  if (actionName in taskConfig.actions) {
    des = taskConfig.actions[actionName].description
  }else{
    des = taskConfig.getActions()[actionName].description
  }
  if (MNUtil.isValidJSON(des)) {
    return JSON.parse(des)
  }
  if (actionName === "pasteAsTitle") {
    return {
      "action": "paste",
      "target": "title",
      "content": "{{clipboardText}}"
    }
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
    let whiteNamelist = ["timer","search","copy","chatglm","ocr","edit","searchInEudic","pasteAsTitle","sidebar"]
    if (whiteNamelist.includes(actionName)) {
      return true
    }
    MNUtil.showHUD("Only available for Custom Action!")
    return false
  }

  // 根节点管理方法
  static saveRootNoteId(noteId) {
    this.rootNoteId = noteId
    // 检查 null 值，避免崩溃
    if (noteId !== null && noteId !== undefined) {
      this.save("MNTask_rootNoteId", noteId)
    } else {
      // 如果是 null 或 undefined，删除键
      this.remove("MNTask_rootNoteId")
    }
  }
  
  static getRootNoteId() {
    return this.rootNoteId
  }
  
  static clearRootNoteId() {
    this.rootNoteId = null
    // 使用 remove 方法删除键，避免设置 null 值导致崩溃
    this.remove("MNTask_rootNoteId")
  }
  
  // 分区卡片管理方法
  static getPartitionCard(partitionName) {
    return this.partitionCards[partitionName] || null
  }
  
  static savePartitionCard(partitionName, cardId) {
    this.partitionCards[partitionName] = cardId
    this.save("MNTask_partitionCards", this.partitionCards)
  }
  
  static clearPartitionCards() {
    this.partitionCards = {}
    this.save("MNTask_partitionCards", {})
  }

  // 通用看板管理方法
  static getBoardNoteId(boardKey) {
    // 为了向后兼容，root 看板特殊处理
    if (boardKey === 'root') {
      return this.getRootNoteId()
    }
    // 其他看板使用分区卡片存储
    return this.getPartitionCard(boardKey)
  }
  
  static saveBoardNoteId(boardKey, noteId) {
    // 为了向后兼容，root 看板特殊处理
    if (boardKey === 'root') {
      return this.saveRootNoteId(noteId)
    }
    // 其他看板使用分区卡片存储
    return this.savePartitionCard(boardKey, noteId)
  }
  
  static clearBoardNoteId(boardKey) {
    // 为了向后兼容，root 看板特殊处理
    if (boardKey === 'root') {
      return this.clearRootNoteId()
    }
    // 其他看板清除对应的分区卡片
    if (this.partitionCards[boardKey]) {
      delete this.partitionCards[boardKey]
      this.save("MNTask_partitionCards", this.partitionCards)
    }
  }

}

/**
 * MNTaskManager - 任务卡片管理器
 * 负责任务卡片的创建、解析、转换等功能
 */
class MNTaskManager {
  /**
   * 解析任务卡片标题
   * @param {string} title - 任务卡片标题
   * @returns {Object} 解析后的标题各部分
   */
  static parseTaskTitle(title) {
    let titleParts = {}
    // 匹配格式：【类型 >> 路径｜状态】内容
    let match = title.match(/^【([^｜]+)(?:\s*>>\s*(.+?))?｜([^】]+)】(.*)/)
    
    if (match) {
      titleParts.typeAndPath = match[1].trim()  // "类型" 或 "类型 >> 路径"
      titleParts.path = match[2] ? match[2].trim() : ""  // 路径部分（可能为空）
      titleParts.status = match[3].trim()  // 状态
      titleParts.content = match[4].trim()  // 内容
      
      // 从 typeAndPath 中分离类型
      if (titleParts.path) {
        titleParts.type = titleParts.typeAndPath.replace(` >> ${titleParts.path}`, '').trim()
      } else {
        titleParts.type = titleParts.typeAndPath
      }
    }
    
    return titleParts
  }

  /**
   * 判断是否是任务类卡片
   * @param {MNNote} note - 要判断的卡片
   * @returns {boolean} 是否是任务卡片
   */
  static isTaskCard(note) {
    const title = note.noteTitle || ""
    
    // 必须符合基本格式
    if (!title.startsWith("【") || !title.includes("｜") || !title.includes("】")) {
      return false
    }
    
    // 解析标题获取类型
    const titleParts = this.parseTaskTitle(title)
    if (!titleParts.type) {
      return false
    }
    
    // 只接受这四种任务类型
    const validTypes = ["目标", "关键结果", "项目", "动作"]
    return validTypes.includes(titleParts.type)
  }

  /**
   * 更新任务路径
   * @param {MNNote} note - 要更新的任务卡片
   */
  static updateTaskPath(note) {
    const titleParts = this.parseTaskTitle(note.noteTitle)
    const parentNote = note.parentNote
    
    if (!parentNote || !this.isTaskCard(parentNote)) {
      // 没有父任务或父级不是任务，保持原状
      return
    }
    
    // 解析父任务
    const parentParts = this.parseTaskTitle(parentNote.noteTitle)
    
    // 构建新路径：父级路径 >> 父级内容
    let newPath = ""
    if (parentParts.path) {
      newPath = `${parentParts.path} >> ${parentParts.content}`
    } else {
      newPath = parentParts.content
    }
    
    // 重构标题
    const newTitle = `【${titleParts.type} >> ${newPath}｜${titleParts.status}】${titleParts.content}`
    
    MNUtil.undoGrouping(() => {
      note.noteTitle = newTitle
    })
  }

  /**
   * 转换为任务卡片
   * @param {MNNote} note - 要转换的卡片
   */
  static async convertToTaskCard(note) {
    // 先使用 MNMath.toNoExcerptVersion 处理摘录卡片
    let targetNote = note
    if (note.excerptText) {
      // 检查是否有 MNMath 类
      if (typeof MNMath !== 'undefined' && MNMath.toNoExcerptVersion) {
        targetNote = MNMath.toNoExcerptVersion(note)
      } else {
        // 如果没有 MNMath，尝试手动加载 mnutils
        try {
          JSB.require('mnutils')
          if (typeof MNMath !== 'undefined' && MNMath.toNoExcerptVersion) {
            targetNote = MNMath.toNoExcerptVersion(note)
          }
        } catch (e) {
          // 如果还是不行，使用简单的处理方式
          MNUtil.log("MNMath 不可用，使用简单处理方式")
        }
      }
    }
    
    // 弹窗让用户选择类型
    const taskTypes = ["目标", "关键结果", "项目", "动作"]
    const selectedIndex = await MNUtil.userSelect("选择任务类型", "", taskTypes)
    
    if (selectedIndex === 0) return // 用户取消
    
    const selectedType = taskTypes[selectedIndex - 1]
    
    MNUtil.undoGrouping(() => {
      // 构建任务路径
      const path = this.buildTaskPath(targetNote)
      
      // 构建新标题
      const content = targetNote.noteTitle || "未命名任务"
      const newTitle = path ? 
        `【${selectedType} >> ${path}｜未开始】${content}` :
        `【${selectedType}｜未开始】${content}`
      
      targetNote.noteTitle = newTitle
      
      // 设置颜色（白色=未开始）
      targetNote.colorIndex = 0
      
      // 创建空函数供后续实现
      this.addTaskFields(targetNote, selectedType)
      this.linkParentTask(targetNote)
    })
  }

  /**
   * 构建任务路径
   * @param {MNNote} note - 要构建路径的卡片
   * @returns {string} 任务路径
   */
  static buildTaskPath(note) {
    const parentNote = note.parentNote
    if (!parentNote || !this.isTaskCard(parentNote)) {
      return ""
    }
    
    const parentParts = this.parseTaskTitle(parentNote.noteTitle)
    
    if (parentParts.path) {
      return `${parentParts.path} >> ${parentParts.content}`
    } else {
      return parentParts.content
    }
  }

  /**
   * 添加任务字段（HtmlComment）
   * @param {MNNote} note - 要添加字段的卡片
   * @param {string} taskType - 任务类型
   */
  static addTaskFields(note, taskType) {
    // TODO: 根据任务类型添加相应的字段
  }

  /**
   * 链接父任务
   * @param {MNNote} note - 要链接的卡片
   */
  static linkParentTask(note) {
    // TODO: 创建与父任务的链接关系
  }

  /**
   * 获取任务类型定义
   * @param {string} type - 任务类型
   * @returns {Object} 类型定义
   */
  static getTaskType(type) {
    const types = {
      "目标": {
        key: "objective",
        colorIndex: 3,  // 粉色=进行中
        fields: ["关键结果", "进度", "截止日期", "负责人"]
      },
      "关键结果": {
        key: "keyResult",
        colorIndex: 0,  // 白色=未开始
        fields: ["完成标准", "进度", "相关项目"]
      },
      "项目": {
        key: "project",
        colorIndex: 0,  // 白色=未开始
        fields: ["项目描述", "里程碑", "资源", "风险"]
      },
      "动作": {
        key: "action",
        colorIndex: 0,  // 白色=未开始
        fields: ["执行细节", "预计时间", "执行场景", "前置条件"]
      }
    }
    return types[type]
  }

  /**
   * 更新任务状态
   * @param {MNNote} note - 要更新的任务卡片
   * @param {string} newStatus - 新状态
   */
  static updateTaskStatus(note, newStatus) {
    if (!this.isTaskCard(note)) return
    
    const titleParts = this.parseTaskTitle(note.noteTitle)
    const typeWithPath = titleParts.path ? 
      `${titleParts.type} >> ${titleParts.path}` : 
      titleParts.type
    
    const newTitle = `【${typeWithPath}｜${newStatus}】${titleParts.content}`
    
    // 设置对应的颜色
    let colorIndex = 0  // 默认白色
    switch (newStatus) {
      case "已完成":
        colorIndex = 1  // 绿色
        break
      case "进行中":
        colorIndex = 3  // 粉色
        break
      case "未开始":
        colorIndex = 0  // 白色
        break
    }
    
    MNUtil.undoGrouping(() => {
      note.noteTitle = newTitle
      note.colorIndex = colorIndex
    })
  }
}

class taskSandbox{
  static async execute(code){
    'use strict';
    if (!taskUtils.checkSubscribe(true)) {
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
      taskUtils.addErrorLog(error, "executeInSandbox",code)
    }
  }
}

// 加载夏大鱼羊的扩展文件
JSB.require('xdyy_utils_extensions')

// 初始化夏大鱼羊的扩展
if (typeof initXDYYExtensions === 'function') {
  initXDYYExtensions()
}
if (typeof extendTaskConfigInit === 'function') {
  extendTaskConfigInit()
}