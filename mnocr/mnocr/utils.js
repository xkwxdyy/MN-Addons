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
class ocrUtils {
  // 构造器方法，用于初始化新创建的对象
  constructor(name) {
    this.name = name;
  }
  static pdfTranslate = false
  static errorLog = []
  /**
   * @type {ocrController}
   * @static
   */
  static ocrController
  /** @type {String} */
  static mainPath
  // 0都没有
// 1都有
// 2image
// 3text
  static init(mainPath){
    this.app = Application.sharedInstance()
    this.data = Database.sharedInstance()
    this.currentWindow = this.app.focusWindow
    this.version = this.appVersion()
    this.mainPath = mainPath
  }
  static get notebookController(){
    return this.studyController.notebookController
  }
  static get studyController(){
    return this.app.studyController(this.currentWindow)
  }
  static get studyView() {
    return this.app.studyController(this.currentWindow).view
  }
  static get currentNotebookId() {
    return this.studyController.notebookController.notebookId
  }
  static showHUD(message,duration=2) {
    this.app.showHUD(message,this.currentWindow,duration)
  }
  static addErrorLog(error,source,info){
    MNUtil.showHUD("MN OCR Error ("+source+"): "+error)
    let log = {error:error.toString(),source:source,time:(new Date(Date.now())).toString()}
    if (info) {
      log.info = info
    }
    this.errorLog.push(log)
    MNUtil.copyJSON(this.errorLog)
    MNUtil.log({
      source:"MN OCR",
      message:source,
      level:"ERROR",
      detail:JSON.stringify(this.errorLog,null,2)
    })
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
      default:
        break;
    }
    return info
  }
  static getByDefault(key,defaultValue) {
    let value = NSUserDefaults.standardUserDefaults().objectForKey(key)
    if (value === undefined) {
      NSUserDefaults.standardUserDefaults().setObjectForKey(defaultValue,key)
      return defaultValue
    }
    return value
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
  static copy(text) {
    UIPasteboard.generalPasteboard().string = text
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

  
  static get currentDocController() {
    return this.studyController.readerController.currentDocumentController
  }
  static currentNotebook() {
    let notebookId = this.studyController.notebookController.notebookId
    return this.getNoteBookById(notebookId)
  }
  static undoGrouping(f,notebookId = this.currentNotebookId){
    UndoManager.sharedInstance().undoGrouping(
      String(Date.now()),
      notebookId,
      f
    )
    this.app.refreshAfterDBChanged(notebookId)
  }
  static checkOCRController(){
    if (!this.ocrController) {
      this.ocrController = ocrController.new();
      this.ocrController.view.hidden = true
    }
    if (!MNUtil.isDescendantOfStudyView(this.ocrController.view)) {
      MNUtil.studyView.addSubview(this.ocrController.view)
    }
  }
  static getImage(path,scale=2) {
    return UIImage.imageWithDataScale(NSData.dataWithContentsOfFile(path), scale)
  }
  static refreshAddonCommands(){
    this.studyController.refreshAddonCommands()
  }
  static addObserver(observer,selector,name){
    NSNotificationCenter.defaultCenter().addObserverSelectorName(observer, selector, name);
  }
  static removeObserver(observer,name){
    NSNotificationCenter.defaultCenter().removeObserverName(observer, name);
  }
  static checkSender(sender,window){
    return this.app.checkNotifySenderInWindow(sender, window)
  }
  static async delay (seconds) {
    return new Promise((resolve, reject) => {
      NSTimer.scheduledTimerWithTimeInterval(seconds, false, function () {
        resolve()
      })
    })
  }
  static getPopoverAndPresent(sender,commandTable,width=100) {
    var menuController = MenuController.new();
    menuController.commandTable = commandTable
    menuController.rowHeight = 35;
    menuController.preferredContentSize = {
      width: width,
      height: menuController.rowHeight * menuController.commandTable.length
    };
    //右 0
    //下 1，3
    //上 2
    var popoverController = new UIPopoverController(menuController);
    var r = sender.convertRectToView(sender.bounds,this.studyView);
    popoverController.presentPopoverFromRect(r, this.studyView, 1, true);
    return popoverController
  }
  static hexColorAlpha(hex,alpha) {
    let color = UIColor.colorWithHexString(hex)
    return alpha!==undefined?color.colorWithAlphaComponent(alpha):color
  }
  static getMediaByHash(hash) {
    let image = this.data.getMediaByHash(hash)
    return image
  }
  static 
  getFocusNote() {
    let notebookController = this.notebookController
    // copy("text:"+!notebookController.view.hidden)
    if (!notebookController.view.hidden && notebookController.mindmapView && notebookController.focusNote) {
      return notebookController.focusNote
    }else{
      return (this.currentDocController.focusNote ?? this.currentDocController.lastFocusNote)
    }
  }
  /**
   * 
   * @param {MbBookNote} note 
   * @returns 
   */
  static getImageFromNote(note,checkTextFirst = false) {
    if (note.excerptPic) {
      if (checkTextFirst && note.textFirst) {
        //检查发现图片已经转为文本，因此略过
      }else{
        return ocrUtils.getMediaByHash(note.excerptPic.paint)
      }
    }
    if (note.comments.length) {
      let imageData = undefined
      for (let i = 0; i < note.comments.length; i++) {
        const comment = note.comments[i];
        if (comment.type === 'PaintNote' && comment.paint) {
          imageData = ocrUtils.getMediaByHash(comment.paint)
          break
        }
        if (comment.type === "LinkNote" && comment.q_hpic && comment.q_hpic.paint) {
          imageData = ocrUtils.getMediaByHash(comment.q_hpic.paint)
          break
        }
        
      }
      if (imageData) {
        return imageData
      }
    }
    return undefined
  }
  static setFrame(target,frame){
    target.view.frame = frame
    target.currentFrame = frame
  }
  static getRandomElement(arr) {
    if (arr && arr.length === 1) {
      return arr[0]
    }
    if (arr && arr.length) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    }
    return ""; // 或者抛出一个错误，如果数组为空或者未定义
  }
  static getImageForOCR(){
    //先看文档有没有，没有就从笔记里找，再没有就从文档上的笔记找
    let foucsNote = ocrUtils.getFocusNote()
    let imageData = ocrUtils.currentDocController.imageFromSelection()
    if (!imageData && foucsNote) {
      imageData = ocrUtils.getImageFromNote(foucsNote)
    }
    if (!imageData) {
      imageData = ocrUtils.currentDocController.imageFromFocusNote()
    }
    return imageData
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
    let folderExist = NSFileManager.defaultManager().fileExistsAtPath(extensionFolder+"/marginnote.extension.mnutils/main.js")
    if (!folderExist) {
      ocrUtils.showHUD("MN OCR: Please install 'MN Utils' first!",5)
    }
    return folderExist
  }
  static checkLogo(){
    if (typeof MNUtil === 'undefined') return false
    if (typeof toolbarConfig !== 'undefined' && toolbarConfig.addonLogos && ("MNOCR" in toolbarConfig.addonLogos) && !toolbarConfig.addonLogos["MNOCR"]) {
        return false
    }
    return true
  }
  /**
   * 
   * @param {UIView} view 
   */
  static ensureView(view){
    if (!MNUtil.isDescendantOfStudyView(view)) {
      view.hidden = true
      MNUtil.studyView.addSubview(view)
      this.forceToRefresh = true
      // view.hidden = false
    }
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
            editor.innerHTML = JSON.stringify(parsedJson, null, 2);
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
  static escapeStringRegexp(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d")
  }
  static action(source,res){
    let sourcesForAction = ["Doc2X","SimpleTex"]
    if (res && sourcesForAction.includes(source) && Object.keys(ocrConfig.getConfig("action")).length) {
      let des = ocrConfig.getConfig("action")
      if ("action" in des && des.action == "replace") {
        let mod= des.mod ?? "g"
        let ptt
        if ("reg" in des) {
          ptt = new RegExp(des.reg,mod)
        }else{
          ptt = new RegExp(ocrUtils.escapeStringRegexp(des.from),mod)
        }
        res = res.replace(ptt, des.to)
      }
    }
    return res
  }
  static async checkMNUtil(alert = false,delay = 0.01){
    if (typeof MNUtil === 'undefined') {//如果MNUtil未被加载，则执行一次延时，然后再检测一次
      //仅在MNUtil未被完全加载时执行delay
      await ocrUtils.delay(delay)
      if (typeof MNUtil === 'undefined') {
        if (alert) {
          ocrUtils.showHUD("MN OCR: Please install 'MN Utils' first!",5)
        }
        return false
      }
    }
    return true
  }
}

class ocrNetwork {
  constructor(name) {
    this.name = name;
  }
  static OCRBuffer = {}
  static genNSURL(url) {
    return NSURL.URLWithString(url)
  }
  static initRequest(url,options) {
    const request = NSMutableURLRequest.requestWithURL(this.genNSURL(url))
    request.setHTTPMethod(options.method ?? "GET")
    request.setTimeoutInterval(options.timeout ?? 10)
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15",
      "Content-Type": "application/json",
      Accept: "application/json"
    }
    request.setAllHTTPHeaderFields({
      ...headers,
      ...(options.headers ?? {})
    })
    if (options.search) {
      request.setURL(
        this.genNSURL(
          `${url.trim()}?${Object.entries(options.search).reduce((acc, cur) => {
            const [key, value] = cur
            return `${acc ? acc + "&" : ""}${key}=${encodeURIComponent(value)}`
          }, "")}`
        )
      )
    } else if (options.body) {
      request.setHTTPBody(NSData.dataWithStringEncoding(options.body, 4))
    } else if (options.form) {
      request.setHTTPBody(
        NSData.dataWithStringEncoding(
          Object.entries(options.form).reduce((acc, cur) => {
            const [key, value] = cur
            return `${acc ? acc + "&" : ""}${key}=${encodeURIComponent(value)}`
          }, ""),
          4
        )
      )
    } else if (options.json) {
      request.setHTTPBody(
        NSJSONSerialization.dataWithJSONObjectOptions(
          options.json,
          1
        )
      )
    }
    return request
  }
  /**
   * 
   * @param {NSMutableURLRequest} request 
   * @param {string} msg 
   * @param {boolean} showMsg 
   * @returns 
   */
  static async sendRequest(request,msg="OCR",showMsg=true) {
    const queue = NSOperationQueue.mainQueue()
    // MNUtil.showHUD("send request")
    return new Promise((resolve, reject) => {
      NSURLConnection.sendAsynchronousRequestQueueCompletionHandler(
        request,
        queue,
        (res, data, err) => {
          try {
            if (err.localizedDescription) {
              let result = {success:false}
              // let error = {
              //   error:err.localizedDescription,
              //   url:request.url()
              // }
              MNUtil.confirm("MN OCR Error", err.localizedDescription)
              resolve(result)
              return
            }
            const result = NSJSONSerialization.JSONObjectWithDataOptions(
              data,
              1<<0
            )
            const validJson = NSJSONSerialization.isValidJSONObject(result)
            // let response = {}
            // MNUtil.copyJSON("result:"+res.statusCode())
            if (res.statusCode() === 200) {
              if (showMsg) {
                MNUtil.showHUD(msg+" success")
              }
              result.success = true
              resolve(result)
            }else{
              let error = {error:err.localizedDescription,statusCode:res.statusCode()}
              if (validJson) {
                error.data = result
              }
              // ocrUtils.addErrorLog(error, "sendRequest."+msg,info)
              MNUtil.confirm("MN OCR Error", JSON.stringify(error,null,2))
              result.success = false
              resolve(result)
            }
          } catch (error) {
            ocrUtils.addErrorLog(error, "sendRequest."+msg)
            // MNUtil.confirm("OCR Error", "error")
            let result = {success:false}
            resolve(result)
          }
          resolve(result)
        }
      )
  })
  }
  static async fetch (url,options = {},msg,showMsg){
    const request = this.initRequest(url, options)
    const res = await this.sendRequest(request,msg,showMsg)
    return res
  }
/**
 * 
 * @returns {Promise<Object>}
 */
 static async simpleTexOCR(imageData) {
  let key = ocrConfig.getConfig("simpleTexApikey").trim()
  if (!key) {
    if (this.isActivated()) {
      let res = await subscriptionNetwork.getKey("simpletex")
      // MNUtil.copyJSON(res)
      if (!res) {
        return undefined
      }
      key = ocrUtils.getRandomElement(res.keys)
      // ocrUtils.copy(key)
      // return undefined
    }else{
      return undefined
    }
  }
  if (!key) {
    MNUtil.showHUD("No simpleTex API key")
    return
  }
  MNUtil.waitHUD("OCR By simpleTex")
  const headers = {
    token: key
  }
  let url = "https://server.simpletex.cn/api/simpletex_ocr"
  // if (ocrConfig.getConfig("simpleTexGeneral")) {
  //   url = "https://server.simpletex.cn/api/simpletex_ocr"
  // }else{
  //   url = ocrConfig.getConfig("simpleTexTurbo") ?"https://server.simpletex.cn/api/latex_ocr_turbo" :"https://server.simpletex.cn/api/latex_ocr"
  // }
  let config = JSON.parse(JSON.stringify(ocrConfig.config))
  config.source = "SimpleTex"
  const request = this.initOCRRequest(url, {
      headers: headers
    },
    imageData,
    config)
  try {
    let res = await this.sendRequest(request)
    let ocrResult
    if (res.res.type === "formula") {
      ocrResult = "$$"+res.res.info.trim()+"$$"
    }
    if (res.res.type === "doc") {
      ocrResult = res.res.info.markdown.trim()
    }
    if ("err_info" in res.res) {
      MNUtil.showHUD(JSON.stringify(res.res.err_info))
    }else{
      MNUtil.showHUD("OCR success")
    }
    return ocrResult
    
  } catch (error) {
    ocrUtils.showHUD(error)
    return undefined
  }
}
static initRequestForChatGPT (apikey,url,model,temperature,funcIndices=[]) {
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
    "messages":this.history,
    "temperature":temperature
  }

  // MNUtil.copyJSON(body)
  const request = ocrNetwork.initRequest(url, {
      method: "POST",
      headers: headers,
      timeout: 60,
      json: body
    })
  return request
}
/**
 * 允许直接传入base64图片,减少转换耗时
 * @param {string|NSData} imageData
 * @returns {Promise<Object>}
 */
 static async ChatGPTVision(imageData,source="GPT-4o") {
  try {
  let key = subscriptionConfig.config.apikey
  if (ocrConfig.modelSource(source).isFree) {
    key = 'sk-S2rXjj2qB98OiweU46F3BcF2D36e4e5eBfB2C9C269627e44'
  }
  if (!key) {
    MNUtil.showHUD("No ChatGPT API key")
    return
  }
  MNUtil.waitHUD("OCR By "+source)
  let url = subscriptionConfig.config.url + "/v1/chat/completions"
  let prompt = ocrConfig.getConfig("userPrompt")
  // let compressedImageData = UIImage.imageWithData(imageData).jpegData(0.1)
  let imageUrl = "data:image/jpeg;base64,"
  if (typeof imageData === "string") {
    imageUrl = imageUrl+imageData
  }else{
    imageUrl = imageUrl+imageData.base64Encoding()
  }
  this.history = [
    {
      role:"system",
      content:prompt
    },
    {
      role: "user", 
      content: [
        {
          "type": "image_url",
          "image_url": {
            "url" : imageUrl
          }
        }
      ]
    }
  ]

  let modelName = ocrConfig.modelSource(source).model
  let request = this.initRequestForChatGPT(key, url, modelName, 0.1)
    let res = await this.sendRequest(request,"ChatGPTVision",false)
    // MNUtil.copy(res)
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
      .replace(/<\|begin_of_box\|>/g,'')
      .replace(/<\|end_of_box\|>/g,'')
    return convertedText
    
  } catch (error) {
    ocrUtils.addErrorLog(error, "ChatGPTVision")
    // MNUtil.confirm("OCR Error", "error")
    return undefined
  }
}
/**
 * 
 * @returns {Promise<Object>}
 */
 static async ChatGPTText(question,model="GPT-4o") {
  let modelName = "glm-4-plus"
  MNUtil.waitHUD("OCR By "+modelName)
  let key = "7a83bf0873d12b99a1f9ab972ee874a1.NULvuYvVrATzI4Uj"
  let url = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
  this.history = question
  let request = this.initRequestForChatGPT(key, url, modelName, 0.1)
  try {
    let res = await this.sendRequest(request)
    let ocrResult
    if (res.choices.length) {
      ocrResult = res.choices[0].message.content
    }else{
      return undefined
    }
    let convertedText = ocrResult
      .replace(/(\\\[\s*)|(\s*\\\])/g, '$$$')
      .replace(/(\\\(\s*)|(\s*\\\))/g, '$')
    return convertedText
    
  } catch (error) {
    ocrUtils.showHUD(error)
    return undefined
  }
}
  /**
   * 
   * @returns {Boolean}
   */
  static checkSubscribe(){
    // return true
    if (typeof subscriptionConfig !== 'undefined') {
      let res = subscriptionConfig.checkSubscribed(false,true)
      // MNUtil.copy(res)
      return res
    }else{
      this.showHUD("Set your API key or install 'MN Subscrption'")
      return false
    }
  }
  /**
   * 
   * @returns {Boolean}
   */
  static isSubscribed(msg = true){
    // return true
    if (typeof subscriptionConfig !== 'undefined') {
      let res = subscriptionConfig.isSubscribed()
      // MNUtil.copy(res)
      return res
    }else{
      if (msg) {
        this.showHUD("Set your API key or install 'MN Subscrption'")
      }
      return false
    }
  }
  static isActivated(msg = false){
    if (typeof subscriptionConfig !== 'undefined') {
      return subscriptionConfig.getConfig("activated")
    }else{
      if (msg) {
        this.showHUD("Set your API key or install 'MN Subscrption'")
      }
      return false
    }
    
  }
  static async refreshAccessToken(refreshToken){
    MNUtil.showHUD("get access_token")
    let url = "https://api.doc2x.noedgeai.com/api/token/refresh"
    let headers = {
      Authorization: "Bearer "+refreshToken
    }
    let res = await this.fetch(url,{
      headers:headers,
      method: "Post"
      },"refresh access_token")
    if (res.code === "success") {
      return res.data.token
    }
    MNUtil.showHUD("Refresh token failed")
    return undefined
  }
  static async getAccessToken(model = "doc2x"){
    let accessToken
    let key = ocrConfig.getConfig("doc2xApikey").trim()
    if (!key) {
      if (this.isActivated()) {
        if (this.accessToken) {
          subscriptionNetwork.getKey(model)
          return this.accessToken
        }
        MNUtil.waitHUD("Get accessToken...")
        let res = await subscriptionNetwork.getKey(model)
        if (!res) {
          return undefined
        }
        accessToken = ocrUtils.getRandomElement(res.keys)
        this.accessToken = accessToken
        // ocrUtils.copy(key)
        return accessToken
      }else{
        return undefined
      }
    }
    return key
  }
/**
 * 
 * @returns {NSMutableURLRequest}
 */
 static intDoc2xOCRRequest(imageData,accessToken,stream=true) {
  if (!accessToken) {
    return undefined
  }
  MNUtil.waitHUD("OCR By doc2X")
  // ocrUtils.showHUD("OCR By doc2X")
  let config = JSON.parse(JSON.stringify(ocrConfig.config))
  config.source = "Doc2X"
  const headers = {
    Authorization: "Bearer "+accessToken
  }
  let url = "https://v2.doc2x.noedgeai.com/api/v2/parse/img/layout"
  const request = this.initOCRRequest(url, {
      headers: headers
    },
    imageData,
    config
    )
  return request
}
/**
 * 
 * @returns {NSMutableURLRequest}
 */
 static intDoc2xPDFOCRRequest(pdfData,accessToken,config = {}) {
  const headers = {
    Authorization: "Bearer "+accessToken
  }
  let ocrConfig = config
  ocrConfig.source = "Doc2XPDF"
  let url = "https://v2.doc2x.noedgeai.com/api/v2/parse/pdf"
  const request = this.initOCRRequest(url, {
      headers: headers
    },
    pdfData,
    ocrConfig
    )
  return request
}

/**
 * 
 * @returns {Promise<Object>}
 */
 static async doc2xImgOCR(imageData) {
    let accessToken = ocrConfig.getConfig("doc2xApikey")
    if (!accessToken) {
      accessToken = await this.getAccessToken("doc2x")
      if (!accessToken) {
        return undefined
      }
    }
    let request = this.intDoc2xOCRRequest(imageData,accessToken,false)
    let res = await this.sendRequest(request,"doc2x",false)
    let convertedText = res.data.result.pages[0].md
      .replace(/\$\$\n?/g, '$$$\n')
      .replace(/(\\\[\s*\n?)|(\s*\\\]\n?)/g, '$$$\n')
      .replace(/(\\\(\s*)|(\s*\\\))/g, '$')
      .replace(/```/g,'')
    return convertedText
 }
/**
 * 
 * @returns {Promise<Object>}
 */
 static async doc2xPDFOCR(PDFData,fileName,accessToken) {
  try {
    let config = ocrConfig.config
    config.fileName = fileName
    let request = this.intDoc2xPDFOCRRequest(PDFData,accessToken,config)
    if (!request) {
      MNUtil.showHUD("Error in doc2xPDFOCR: No accessToken! Check your apikey")
      return undefined
    }
    MNUtil.waitHUD("PDF OCR By doc2X")
//     let res = {
//   "code": "success",
//   "data": {
//     "pages": 15,
//     "remain": 481,
//     "uuid": "d9d70cd7-9055-48a9-86e1-1f25ac013059"
//   },
//   "msg": "ok"
// }
    let res = await this.sendRequest(request,"doc2xPDF")
    if (res.code === "success") {
      let uuid = res.data.uid
      ocrUtils.fileId = uuid
      let status = ""
      let pageSizes = undefined
      let finish = false
      let result
      // MNUtil.copyJSON(res)
      const headers = {
        Authorization: "Bearer "+accessToken
      }
      await MNUtil.delay(1)
      MNUtil.waitHUD("Getting PDF content...")
      do {
        // let url = "https://api.doc2x.noedgeai.com/api/v1/async/status?uuid="+uuid
        let url = "https://v2.doc2x.noedgeai.com/api/v2/parse/status?uid="+uuid
        result = await this.fetch(url,{headers: headers},"",false)
        status = result.data.status
        MNUtil.waitHUD("Progress "+result.data.progress+"%")
        if (status === "success") {
          finish = true
          pageSizes = result.data.result.pages.length
          // if (!md) {
          //   MNUtil.copyJSON(result.data.result.pages[0])
          // }
        }
        await MNUtil.delay(1)
      } while (!finish);
      if (!pageSizes) {
        MNUtil.showHUD("Empty PDF OCR result!")
        // MNUtil.copyJSON(result)
        return undefined
      }
      let tem = result.data.result
      let pages = tem.pages.map(page=>{
        let convertedText = page.md
          .replace(/(\\\[\s*)|(\s*\\\])/g, '$$') // Replace display math mode delimiters
          .replace(/(\\\(\s*)|(\s*\\\))/g, '$')
          .replace(/\<img\sstyle/g,"\n\n<img style")
        return {md:convertedText}
      })
      tem.pages = pages
      // MNUtil.copyJSON(tem)
      return tem
    }
    return undefined
  } catch (error) {
    ocrUtils.addErrorLog(error, "doc2xPDFOCR")
    return undefined
  }
}
static parseDoc2XRespnse(data){
  let test = CryptoJS.enc.Base64.parse(data.base64Encoding())
  let textString = CryptoJS.enc.Utf8.stringify(test);
  // MNUtil.copy(textString)
  let res = JSON.parse(textString.split("data:").at(-1))
  return res.data
}
static initOCRRequest (url,options,imageData,config={}) {
  const request = NSMutableURLRequest.requestWithURL(this.genNSURL(url))
  // try {
  request.setHTTPMethod("Post")
  request.httpShouldHandleCookies = false
  // request.setCachePolicy(4)
  // request.setTimeoutInterval(options.timeout ?? 10)
  let boundary = NSUUID.UUID().UUIDString()

  const headers = {
    "User-Agent": "curl/8.4.0",
    "Accept-Encoding":"*",
    "Accept-Language":"*",
    "Connection":"close",
    "Content-Type": "multipart/form-data; boundary="+boundary,
    Accept: "*/*"
  }
  request.setAllHTTPHeaderFields({
    ...headers,
    ...(options.headers ?? {})
  })
  let fileName = config.fileName ?? "image.png"
  
  let body = NSMutableData.new()
  let filePart
  // MNUtil.copyJSON(config)
  switch (config.source) {
    case "Doc2X":
      body.appendData(imageData)
      request.setHTTPBody(body)
      return request
      // if (config.imageCorrection) {
      //   filePart = NSData.dataWithStringEncoding(`--${boundary}\r\nContent-Disposition: form-data; name="img_correction"\r\n\r\n`, 4)
      //   body.appendData(filePart)
      //   body.appendData(NSData.dataWithStringEncoding(`true\r\n`, 4))
      // }
      // if (config.pureEquation) {
      //   filePart = NSData.dataWithStringEncoding(`--${boundary}\r\nContent-Disposition: form-data; name="equation"\r\n\r\n`, 4)
      //   body.appendData(filePart)
      //   body.appendData(NSData.dataWithStringEncoding(`true\r\n`, 4))
      // }
      // filePart = NSData.dataWithStringEncoding(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: image/png\r\n\r\n`, 4)
      // filePart = NSData.dataWithStringEncoding(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: image/jpeg\r\n\r\n`, 4)
      break;
    case "Doc2XPDF":
      // filePart = NSData.dataWithStringEncoding(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: application/pdf\r\n\r\n`, 4)
      body.appendData(imageData)
      request.setHTTPBody(body)
      return request
      break
    case "SimpleTex":
      if (ocrConfig.config.simpleTexRotation) {
        filePart = NSData.dataWithStringEncoding(`--${boundary}\r\nContent-Disposition: form-data; name="enable_img_rot"\r\n\r\n`, 4)
        body.appendData(filePart)
        body.appendData(NSData.dataWithStringEncoding(`true\r\n`, 4))
      }
      if (ocrConfig.config.simpleTexRecMode) {
        // MNUtil.showHUD(ocrConfig.config.simpleTexRecMode)
        filePart = NSData.dataWithStringEncoding(`--${boundary}\r\nContent-Disposition: form-data; name="rec_mode"\r\n\r\n`, 4)
        body.appendData(filePart)
        body.appendData(NSData.dataWithStringEncoding(`${ocrConfig.config.simpleTexRecMode}\r\n`, 4))
      }
      filePart = NSData.dataWithStringEncoding(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${fileName}"\r\nContent-Type: image/png\r\n\r\n`, 4)
      break
    default:
      break;
  }

  body.appendData(filePart)
  body.appendData(imageData)
  
  let endBoundary = NSData.dataWithStringEncoding(`\r\n--${boundary}--\r\n`, 4)
  body.appendData(endBoundary)
  request.setHTTPBody(body)
  return request
}
static async OCRDev(question,source = ocrConfig.getConfig("source"),buffer=true){
  try {
  let ocrSource = source
  switch (source) {
    case "doc2x":
      ocrSource = "Doc2X"
      break;
    case "simpletex":
      ocrSource = "SimpleTex"
      break;
    case "GPT-4o":
      ocrSource = "GPT-4o"
      break;
    case "GPT-4o-mini":
      ocrSource = "GPT-4o-mini"
      break;
    case "default":
      ocrSource = ocrConfig.getConfig("source")
      break;
    default:
      break;
  }
  let prompt = [
    {role:"system",content:`对于用户给出的单词，你会严格按以下格式输出内容，不使用任何markdown标题：

1. **释义**：
    以词性缩写开头，动词要区分及物和不及物两种词性，多含义的不要遗漏其他含义

2. **常用词组**：
 
3. **例句**：
    针对每个释义给出例句，并在例句后面用括号给出中文翻译

4. **相关词汇**：
    解释每个相关词汇的含义及与该单词的区别  

5. **词根词缀分析**：
    如何根据词根词缀分析单词含义`},
    {role: "user", content: question}
    ]
  let config = JSON.parse(JSON.stringify(ocrConfig.config))
  config.source = ocrSource
  MNUtil.showHUD(ocrSource)
  let res = undefined;
  switch (ocrSource) {
    case "GPT-4o":
    case "GPT-4o-mini":
      res = await this.ChatGPTText(prompt,ocrSource)
      break;
    default:
      return undefined
  }
  res = ocrUtils.action(source, res)
  return res
  } catch (error) {
    MNUtil.showHUD(error)
    // ocrUtils.adder
  }
}
static async OCR(imageData,source = ocrConfig.getConfig("source"),buffer=true){
  try {
  let ocrSource = source
  let config = JSON.parse(JSON.stringify(ocrConfig.config))
  config.source = ocrSource
  MNUtil.log(typeof imageData)
  MNUtil.log("is imagedata: "+(imageData instanceof NSData))
  let imageBase64 = (typeof imageData === "string") ? imageData : imageData.base64Encoding()
  let strForMD5 = JSON.stringify(config)+imageBase64
  let MD5 = MNUtil.MD5(strForMD5)
  MNUtil.log("MD5: "+MD5)
  if (buffer && (MD5 in this.OCRBuffer)) {
    MNUtil.waitHUD("Read from buffer...")
    // let sourcesForAction = ["Doc2X","SimpleTex"]
    let res = this.OCRBuffer[MD5]
    res = ocrUtils.action(source, res)
    return res
  }
  // MNUtil.showHUD(ocrSource)
  let res = undefined;
  switch (ocrSource) {
    case "Doc2X":
    case "doc2x":
      res = await this.doc2xImgOCR(imageData)
      if (res) {
        this.OCRBuffer[MD5] = res
        MNUtil.log({
          source:"MN OCR",
          message:"✅ OCR By Doc2X",
          detail:res
        })
      }
      break;
    case "SimpleTex":
    case "simpleTex":
      res = await this.simpleTexOCR(imageData)
      if (res) {
        this.OCRBuffer[MD5] = res
        MNUtil.log({
          source:"MN OCR",
          message:"✅ OCR By SimpleTex",
          detail:res
        })
      }
      break;
    case "glm-4v-plus":
    case "glm-4v-flash":
    case "glm-4.1v-thinking-flashx":
    case "glm-4.1v-thinking-flash":
    case "glm-4.5v":
    case "glm-4.5v-nothinking":
    case "abab6.5s-chat":
    case "claude-3-5-sonnet-20241022":
    case "claude-3-5-haiku-20241022":
    case "claude-3-7-sonnet":
    case "claude-opus-4":
    case "claude-sonnet-4":
    case "claude-3-5-haiku":
    case "gemini-2.0-flash-exp":
    case "gemini-2.0-flash-lite":
    case "gemini-2.5-flash-lite":
    case "gemini-2.0-flash":
    case "gemini-2.5-flash":
    case "gemini-2.5-pro":
    case "gemini-2.0-pro":
    case "GPT-4o":
    case "GPT-4o-mini":
    case "GPT-4.1":
    case "GPT-4.1-mini":
    case "GPT-4.1-nano":
    case "GPT-5":
    case "GPT-5-mini":
    case "GPT-5-nano":
    case "doubao-seed-1-6":
    case "doubao-seed-1-6-nothinking":
    case "doubao-seed-1.6-flash":
    case "doubao-seed-1.6-flash-nothinking":
    case "Moonshot-v1":
    case "MiniMax-Text-01":
      let beginTime = Date.now()
      res = await this.ChatGPTVision(imageBase64,ocrSource)
      let endTime = Date.now()
      let costTime = (endTime-beginTime)/1000
      if (res) {
        this.OCRBuffer[MD5] = res
        MNUtil.log({
          source:"MN OCR",
          message:"✅ OCR By "+ocrSource+" ("+costTime.toFixed(2)+"s)",
          detail:res
        })
      }
      break;
    default:
      MNUtil.showHUD("Unsupported source: "+ocrSource)
      return undefined
  }
  MNUtil.stopHUD()
  res = ocrUtils.action(source, res)
  
  return res
  } catch (error) {
    ocrUtils.addErrorLog(error, "ocrNetwork.OCR")
    return undefined
  }
}
static async PDFOCR(){
try {
  

  // self.docMd5 = MNUtil.currentDocController.document.docMd5
  let currentDoc = MNUtil.currentDocController.document
  let docMd5 = currentDoc.docMd5
  ocrUtils.docMd5 = docMd5
  let currentDocPath = currentDoc.fullPathFileName
  if (!currentDocPath) {
    MNUtil.showHUD("Doc not exist!")
    return undefined
  }
  if (!MNUtil.isfileExists(currentDocPath)) {
    MNUtil.showHUD("Doc not exist!")
    return undefined
  }
  if (ocrConfig.fileIds[docMd5] && MNUtil.isfileExists(MNUtil.dbFolder+"/"+docMd5+".json")) {
    MNUtil.waitHUD("Read from buffer...")
    let res = MNUtil.readJSON(MNUtil.dbFolder+"/"+docMd5+".json")
    return res
  }
  let accessToken = ocrConfig.getConfig("doc2xApikey")
  // if (currentDoc.pageCount < 20){
  //   accessToken = await this.getAccessToken("doc2xPDF")
  // }else{
  //   accessToken = await this.getAccessToken("doc2xPDF20")
  // }
  this.currentTime = Date.now()
  if (!accessToken) {
    MNUtil.showHUD("No doc2X API key")
    return undefined
  }
  let fileData = MNUtil.getFile(currentDocPath)
  if (!fileData) {
    return undefined
  }

  if (ocrConfig.fileIds[docMd5]) {
    MNUtil.showHUD("Get OCR result from doc2X")
    const headers = {
      Authorization: "Bearer "+accessToken
    }
    let url = "https://v2.doc2x.noedgeai.com/api/v2/parse/status?uuid="+ocrConfig.fileIds[docMd5]
    // let url = "https://api.doc2x.noedgeai.com/api/req/json/"+ocrConfig.fileIds[docMd5]
    let res = await ocrNetwork.fetch(url,{headers: headers})
    if (res.data && res.data.result && res.data.result.pages) {
      let tem = res.data.result
      let pages = tem.pages.map(page=>{
        let convertedText = page.md
          .replace(/(\\\[\s*)|(\s*\\\])/g, '$$') // Replace display math mode delimiters
          .replace(/(\\\(\s*)|(\s*\\\))/g, '$')
        page.md = convertedText
        return page
      })
      tem.pages = pages
      // MNUtil.copyJSON(tem)
      return tem
    }else{
      MNUtil.showHUD("Get OCR result failed! Continue OCR")
    }
  }
  let fileName = MNUtil.getFileName(currentDocPath)
  let res = await this.doc2xPDFOCR(fileData,fileName,accessToken)
  ocrConfig.saveFileId(docMd5, ocrUtils.fileId)

  return res
  // switch (source) {
  //   case "Doc2X":
  //     return await this.doc2xOCR(imageData)
  //   case "SimpleTex":
  //     return await this.simpleTexOCR(imageData)
  //   default:
  //     return undefined
  // }
} catch (error) {
  MNUtil.showHUD(error)
}
}
}

class ocrConfig {
  constructor(name) {
    this.name = name;
  }
  static defaultConfig = {
    source:"SimpleTex",
    simpleTexApikey: "",
    simpleTexTurbo:false,
    simpleTexGeneral:true,
    simpleTexRecMode:"auto",
    simpleTexRotation:false,
    doc2xApikey: "",
    imageCorrection:false,
    pureEquation:false,
    PDFOCR:false,
    subscribedDay: 0,
    apikey: "",
    freeUsage:0,
    freeDay:0,
    subscriptionDaysRemain:0,
    openaiApikey:"",
    userPrompt:`—role—
Image Text Extraction Specialist

—goal—
For the given image, please directly output the text in the image.
For any formulas, you must enclose them with dollar signs.

—constrain—
You are not allowed to output any content other than what is in the image.`,
    action:{}
  }
  static defaultFileIds = {}
  /**
   * 
   * @param {string} model 
   * @returns 
   */
  static modelSource(model){
    let config = {
      "abab6.5s-chat":{title: "Abab6.5s",model:"abab6.5s-chat",isFree:false},
      "glm-4v-plus":{title: "GLM-4V Plus",model:"glm-4v-plus-0111",isFree:false},
      "glm-4v-flash":{title: "GLM-4V Flash",model:"glm-4v-flash",isFree:true},
      "glm-4.1v-thinking-flash":{title: "GLM-4.1V Thinking Flash",model:"glm-4.1v-thinking-flash",isFree:true},
      "glm-4.1v-thinking-flashx":{title: "GLM-4.1V Thinking FlashX",model:"glm-4.1v-thinking-flashx",isFree:true},
      "glm-4.5v":{title: "GLM-4.5V",model:"glm-4.5v",isFree:false},
      "glm-4.5v-nothinking":{title: "GLM-4.5V No Thinking",model:"glm-4.5v-nothinking",isFree:true},
      "claude-3-5-sonnet":{title: "Claude-3.5 Sonnet",model:"claude-3-5-sonnet-20241022",isFree:false},
      "claude-sonnet-4":{title: "Claude-4 Sonnet",model:"claude-sonnet-4",isFree:false},
      "claude-opus-4":{title: "Claude-4 Opus",model:"claude-opus-4",isFree:false},
      "claude-3-7-sonnet":{title: "Claude-3.7 Sonnet",model:"claude-3-7-sonnet-20250219",isFree:false},
      "claude-3-5-sonnet-20241022":{title: "Claude-3.5 Sonnet",model:"claude-3-5-sonnet-20241022",isFree:false},
      "claude-3-5-haiku":{title: "Claude-3.5 Haiku",model:"claude-3-5-haiku",isFree:false},
      "gemini-2.0-flash-exp":{title: "Gemini-2.0 Flash",model:"gemini-2.0-flash",isFree:false},
      "gemini-2.0-flash":{title: "Gemini-2.0 Flash",model:"gemini-2.0-flash",isFree:false},
      "gemini-2.5-flash":{title: "Gemini-2.5 Flash",model:"gemini-2.5-flash",isFree:false},
      "gemini-2.0-pro":{title: "Gemini-2.0 Pro",model:"gemini-2.0-pro-exp-02-05",isFree:false},
      "gemini-2.5-pro":{title: "Gemini-2.5 Pro",model:"gemini-2.5-pro-exp-03-25",isFree:false},
      "gemini-2.0-flash-lite":{title: "Gemini-2.0 Flash Lite",model:"gemini-2.0-flash-lite",isFree:true},
      "gemini-2.5-flash-lite":{title: "Gemini-2.5 Flash Lite",model:"gemini-2.5-flash-lite",isFree:true},
      "minimax-text-01":{title: "MiniMax-Text-01",model:"MiniMax-Text-01",isFree:false},
      "moonshot-v1":{title: "Moonshot V1",model:"moonshot-v1-8k-vision-preview",isFree:false},
      "gpt-4o":{title: "GPT-4o",model:"gpt-4o-2024-08-06",isFree:false},
      "gpt-4o-mini":{title: "GPT-4o Mini",model:"gpt-4o-mini",isFree:false},
      "gpt-4.1":{title: "GPT-4.1",model:"gpt-4.1",isFree:false},
      "gpt-4.1-mini":{title: "GPT-4.1 Mini",model:"gpt-4.1-mini",isFree:false},
      "gpt-4.1-nano":{title: "GPT-4.1 Nano",model:"gpt-4.1-nano",isFree:true},
      "gpt-5":{title: "GPT-5",model:"gpt-5",isFree:false},
      "gpt-5-mini":{title: "GPT-5 Mini",model:"gpt-5-mini",isFree:false},
      "gpt-5-nano":{title: "GPT-5 Nano",model:"gpt-5-nano",isFree:true},
      "doubao-seed-1-6":{title: "Doubao 1.6",model:"doubao-seed-1-6",isFree:false},
      "doubao-seed-1-6-nothinking":{title: "Doubao 1.6 No Thinking",model:"doubao-seed-1-6-nothinking",isFree:false},
      "doubao-seed-1.6-flash":{title: "Doubao 1.6 Flash",model:"doubao-seed-1-6-flash",isFree:true},
      "doubao-seed-1.6-flash-nothinking":{title: "Doubao 1.6 Flash No Thinking",model:"doubao-seed-1-6-flash-nothinking",isFree:true},
    }
    let tem = config[model.toLowerCase()]
    if (tem) {
      return tem
    }else{
      MNUtil.showHUD("Unknown source "+model)
      return {title:"Unknown source "+model,isFree:false}
    }
  }
  static init(){
    this.config = this.getByDefault("MNOCR", this.defaultConfig)
    this.fileIds = this.getByDefault("MNOCR_fileIds", this.defaultFileIds)
    // this.config.subscribedDay = 0
    // this.config.subscriptionDaysRemain = 0
  }
  static getByDefault(key,defaultValue) {
    let value = NSUserDefaults.standardUserDefaults().objectForKey(key)
    if (value === undefined) {
      NSUserDefaults.standardUserDefaults().setObjectForKey(defaultValue,key)
      return defaultValue
    }
    return value
  }
  static getConfig(key){
    if (this.config[key] !== undefined) {
      return this.config[key]
    }else{
      return this.defaultConfig[key]
    }
  }

  static save() {
    NSUserDefaults.standardUserDefaults().setObjectForKey(this.config,"MNOCR")
  }
  static saveFileId(md5,uuid){
    this.fileIds[md5] = uuid
    NSUserDefaults.standardUserDefaults().setObjectForKey(this.fileIds,"MNOCR_fileIds")
  }
  static remove(){
    NSUserDefaults.standardUserDefaults().removeObjectForKey("MNOCR")
  }
}