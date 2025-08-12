class MNFrame{
  /**
   * 
   * @param {UIView} view 
   * @param {number} x 
   * @param {number} y 
   * @param {number} width 
   * @param {number} height 
   */
  static set(view,x,y,width,height){
    view.frame = MNUtil.genFrame(x, y, width, height)
  }
}
class browserUtils {
  static errorLog = []
  static init(mainPath){
    this.mainPath = mainPath
    this.screenImage = MNUtil.getImage(mainPath + `/screen.png`)
    this.linkImage = MNUtil.getImage(mainPath + `/link.png`)
    this.homeImage = MNUtil.getImage(mainPath + `/home.png`)
    this.goforwardImage = MNUtil.getImage(mainPath + `/goforward.png`)
    this.gobackImage = MNUtil.getImage(mainPath + `/goback.png`)
    this.reloadImage = MNUtil.getImage(mainPath + `/reload.png`)
    this.stopImage = MNUtil.getImage(mainPath + `/stop.png`)
    this.webappImage = MNUtil.getImage(mainPath + `/webapp.png`)
    this.moreImage = MNUtil.getImage(mainPath + `/more.png`,2.5)
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
  static showHUD(message,duration=2) {
    let app = Application.sharedInstance()
    app.showHUD(message,app.focusWindow,duration)
  }
  static checkMNUtilsFolder(fullPath){
    let extensionFolder = this.getExtensionFolder(fullPath)
    let folderExist = NSFileManager.defaultManager().fileExistsAtPath(extensionFolder+"/marginnote.extension.mnutils/main.js")
    if (!folderExist) {
      this.showHUD("MN Browser: Please install 'MN Utils' first!",5)
    }
    return folderExist
  }
  static async checkMNUtil(alert = false,delay = 0.01){
    if (typeof MNUtil === 'undefined') {//如果MNUtil未被加载，则执行一次延时，然后再检测一次
      //仅在MNUtil未被完全加载时执行delay
      await this.delay(delay)
      if (typeof MNUtil === 'undefined') {
        if (alert) {
          this.showHUD("MN Browser: Please install 'MN Utils' first!",5)
        }
        return false
      }
    }
    return true
  }
  static async delay (seconds) {
    return new Promise((resolve, reject) => {
      NSTimer.scheduledTimerWithTimeInterval(seconds, false, function () {
        resolve()
      })
    })
  }
  static getOrderText(order) {
    if (order[0] == 4) {
      return 'Order: (Title) + (Excerpt → Comment)'
    }
    let orderNumber = `${order[0]}${order[1]}${order[2]}`
    switch (orderNumber) {
      case "123":
        return 'Order: Title → Excerpt → Comment'
      case "132":
        return 'Order: Title → Comment → Excerpt'
      case "213":
        return 'Order: Excerpt → Title → Comment'
      case "231":
        return 'Order: Excerpt → Comment → Title'
      case "312":
        return 'Order: Comment → Title → Excerpt'
      case "321":
        return 'Order: Comment → Excerpt → Title'
      default:
        return "123";
    }
  }
  static isNSNull(obj){
    return (obj === NSNull.new())
  }
  static shouldPrevent(currentURL,requestURL,type) {
    let firstCheck = Application.sharedInstance().osType === 0 && (type===0 || /^https:\/\/m.inftab.com/.test(currentURL))
    if (firstCheck) {
      let blacklist = ["^https?://www.bilibili.com","^https?://m.bilibili.com","^https?://space.bilibili.com","^https?://t.bilibili.com","^https?://www.wolai.com","^https?://flowus.com","^https?://www.notion.so"]
      if (blacklist.some(url=>RegExp(url).test(requestURL))) {
        return true
      }
    }
    return false
  }
  /**
   * count为true代表本次check会消耗一次免费额度（如果当天未订阅），如果为false则表示只要当天免费额度没用完，check就会返回true
   * 开启ignoreFree则代表本次check只会看是否订阅，不管是否还有免费额度
   * @param {boolean} count 
   * @param {boolean} msg 
   * @param {boolean} ignoreFree 
   * @returns {Boolean}
   */
  static checkSubscribe(count = true, msg = true,ignoreFree = false){
    // return true
    // MNUtil.showHUD("checkSubscribe")

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
  static checkSender(sender,window){
    return MNUtil.app.checkNotifySenderInWindow(sender, window)
  }
  static checkLogo(){
    if (typeof MNUtil === 'undefined') return false
    if (typeof toolbarConfig !== 'undefined' && toolbarConfig.addonLogos && ("MNBrowser" in toolbarConfig.addonLogos) && !toolbarConfig.addonLogos["MNBrowser"]) {
        return false
    }
    return true
  }
  static setFrame(controller,x,y,width,height){
    if (typeof x === "object") {
      controller.view.frame = x
    }else{
      controller.view.frame = MNUtil.genFrame(x, y, width, height)
    }
    controller.currentFrame = controller.view.frame
  }
  static genLog(error,source){
    return {error:error.toString(),source:source,time:(new Date(Date.now())).toString()}
  }
  static formatSeconds(seconds) {
    // 计算分钟数
    const minutes = Math.floor(seconds / 60);
    // 计算剩余的秒数
    const remainingSeconds = Math.floor(seconds % 60);

    // 格式化为两位数，不足两位的补零
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    // 返回格式化后的字符串
    return `${formattedMinutes}:${formattedSeconds}`;
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
        return MNUtil.getMediaByHash(note.excerptPic.paint)
      }
    }
    if (note.comments.length) {
      let imageData = undefined
      for (let i = 0; i < note.comments.length; i++) {
        const comment = note.comments[i];
        if (comment.type === 'PaintNote' && comment.paint) {
          imageData = MNUtil.getMediaByHash(comment.paint)
          break
        }
        if (comment.type === "LinkNote" && comment.q_hpic && comment.q_hpic.paint) {
          imageData = MNUtil.getMediaByHash(comment.q_hpic.paint)
          break
        }
        
      }
      if (imageData) {
        return imageData
      }
    }
    return undefined
  }
  static getCurrentImage(){
  try {

    let foucsNote = MNNote.getFocusNote()

    // let imageData = ocrUtils.getImageForOCR()
    let imageData = MNUtil.getDocImage(true,true)
    if (!imageData) {
      if (foucsNote) {
        imageData = this.getImageFromNote(foucsNote)
      }else{
        // MNUtil.showHUD("No focus note")
        return undefined;
      }
    }
    if (!imageData) {
        // MNUtil.showHUD("No image")
      return undefined;
    }
    return imageData
    
  } catch (error) {
    browserUtils.addErrorLog(error, "getCurrentImage")
    return undefined;
  }
  }
static getSubFuncScript(){

return `/**
 * 根据指定的 scheme、host、path、query 和 fragment 生成一个完整的 URL Scheme 字符串。
 * URL Scheme 完整格式：scheme://host/path?query#fragment
 *
 * @param {string} scheme - URL scheme，例如 'myapp'。必须提供。
 * @param {string|undefined} [host] - host 部分，例如 'user_profile'。
 * @param {string|string[]|undefined} [path] - path 部分，例如 'view/123'。
 * @param {Object<string, string|number|boolean|object>|undefined} [query] - 查询参数对象。
 * @param {string|undefined} [fragment] - fragment 标识符，即 URL 中 # 后面的部分。
 * @returns {string} - 生成的完整 URL 字符串。
 */
function generateUrlScheme(scheme, host, path, query, fragment) {
  // 1. 处理必须的 scheme
  if (!scheme) {
    console.error("Scheme is a required parameter.");
    return '';
  }
  // 2. 构建基础部分：scheme 和 host
  //    即使 host 为空，也会生成 'scheme://'，这对于 'file:///' 这类 scheme 是正确的
  let url = \`\${scheme}://\${host || ''}\`;

  // 3. 添加 path
  if (path) {
    if (Array.isArray(path)) {
      let pathStr = path.join('/')
      url += \`/\${pathStr.replace(/^\\\/+/, '')}\`;
    }else{
      // 确保 host 和 path 之间只有一个斜杠，并处理 path 开头可能存在的斜杠
      url += \`/\${path.replace(/^\\\/+/, '')}\`;
    }
  }

  // 4. 添加 query 参数
  if (query && Object.keys(query).length > 0) {
    const queryParts = [];
    for (const key in query) {
      // 确保我们只处理对象自身的属性
      if (Object.prototype.hasOwnProperty.call(query, key)) {
        const value = query[key];
        const encodedKey = encodeURIComponent(key);
        // 对值进行编码，如果是对象，则先序列化为 JSON 字符串
        const encodedValue = encodeURIComponent(
          typeof value === "object" && value !== null ? JSON.stringify(value) : value
        );
        queryParts.push(\`\${encodedKey}=\${encodedValue}\`);
      }
    }
    if (queryParts.length > 0) {
      url += \`?\${queryParts.join('&')}\`;
    }
  }

  // 5. 添加 fragment
  if (fragment) {
    // Fragment 部分不应该被编码
    url += \`#\${fragment}\`;
  }

  return url;
}
    /**
     *
     * @param {string} scheme - URL scheme, 例如 'myapp'。
     * @param {string} [host] - 可选的路径或操作名。
     * @param {Object<string, string|number|boolean>} [params] - 查询参数对象。
     */
    function postMessageToAddon(scheme, host, path, params,fragment) {
      let url = generateUrlScheme(scheme,host,path, params,fragment)
      window.location.href = url
    }
/**
 * 将 PNG 或 JPEG 的 Base64 字符串异步转换为 PDF 的 Base64 字符串。
 * @param {string} pngBase64 - 图片的 Base64 字符串 (可以包含 "data:image/..." 前缀，也可以不包含)。
 * @param {boolean} [fitContent=false] - 是否让 PDF 页面大小与图片大小完全一致。true 表示是，false 表示将图片适应到 A4 页面。
 * @returns {Promise<string>} - 一个解析为 PDF Base64 字符串的 Promise。
 */
async function convertPngBase64ToPdfBase64(imageBase64, fitContent = false) {
    // 确保 window.jspdf.jsPDF 存在
    if (typeof window === 'undefined' || !window.jspdf || !window.jspdf.jsPDF) {
        return Promise.reject(new Error("jsPDF 库未加载。请确保在使用此函数前已引入 jsPDF。"));
    }
    const { jsPDF } = window.jspdf;

    return new Promise((resolve, reject) => {
        const img = new Image();
        let imgData = imageBase64;
        const isPng = imageBase64.startsWith('data:image/png;base64,') || (!imageBase64.startsWith('data:') && imageBase64.length % 4 === 0); // A simple check
        const isJpeg = imageBase64.startsWith('data:image/jpeg;base64,');

        // 如果没有数据URI前缀，则根据推断或默认添加一个
        if (!imgData.startsWith('data:image/')) {
            imgData = 'data:image/png;base64,' + imageBase64;
        }

        img.src = imgData;

        img.onload = function() {
            try {
                const imgWidth = this.width;
                const imgHeight = this.height;
                let pdf;

                // 根据 fitContent 参数决定 PDF 的创建方式
                if (fitContent) {
                    // 模式1: PDF 页面大小 = 图片大小
                    // 使用图片的宽高直接作为PDF的页面尺寸，单位为 'pt' (1 pt = 1/72 inch)
                    pdf = new jsPDF({
                        orientation: imgWidth > imgHeight ? 'l' : 'p', // 根据宽高比设置方向
                        unit: 'pt',
                        format: [imgWidth, imgHeight]
                    });
                    // 将图片添加到 (0, 0) 位置，大小与图片原始尺寸一致
                    pdf.addImage(imgData, isJpeg ? 'JPEG' : 'PNG', 0, 0, imgWidth, imgHeight);

                } else {
                    // 模式2: 将图片适应到 A4 页面 (原始逻辑)
                    pdf = new jsPDF({ orientation: 'p', unit: 'pt', format: 'a4' });
                    const a4Width = 595.28, a4Height = 841.89;
                    const margin = 20; // 边距

                    // 计算缩放后的图片尺寸以适应A4页面并保留宽高比
                    let pdfImgWidth = imgWidth;
                    let pdfImgHeight = imgHeight;
                    const maxWidth = a4Width - margin * 2;
                    const maxHeight = a4Height - margin * 2;

                    if (pdfImgWidth > maxWidth) {
                        pdfImgWidth = maxWidth;
                        pdfImgHeight = (imgHeight / imgWidth) * pdfImgWidth;
                    }
                    if (pdfImgHeight > maxHeight) {
                        pdfImgHeight = maxHeight;
                        pdfImgWidth = (imgWidth / imgHeight) * pdfImgHeight;
                    }

                    // 计算居中位置
                    const x = (a4Width - pdfImgWidth) / 2;
                    const y = (a4Height - pdfImgHeight) / 2;

                    pdf.addImage(imgData, isJpeg ? 'JPEG' : 'PNG', x, y, pdfImgWidth, pdfImgHeight);
                }

                // 生成 PDF 的 Base64
                const pdfDataUri = pdf.output('datauristring');
                const pdfBase64 = pdfDataUri.split(',')[1];
                resolve(pdfBase64);

            } catch (error) {
                reject(error);
            }
        };

        img.onerror = (err) => {
            reject(new Error("无法加载Base64图片，请检查格式是否正确。"));
        };
    });
}
 
           // 动态加载html2canvas脚本的函数
        function loadHtml2CanvasScript( callback) {
            let url = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
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
                window.location.href = 'browser://showhud?message='+encodeURIComponent('加载失败'+url)
                console.error(url + ' 加载失败');
            };

            document.head.appendChild(script); // 或者 document.body.appendChild(script);
        }
           // 动态加载jspdf脚本的函数
        function loadJSPDFScript( callback) {
            let url = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'
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
                window.location.href = 'browser://showhud?message='+encodeURIComponent('加载失败'+url)
                console.error(url + ' 加载失败');
            };

            document.head.appendChild(script); // 或者 document.body.appendChild(script);
        }
/**
 * 计算页面的最大缩放比例。
 * @returns {number} - 计算出的最大安全scale值.
 */
function calculateMaxScale() {
    // 1. 定义一个在所有主流浏览器中都相对安全的最大画布面积常量。
    // 16,777,216 是 4096 * 4096，这是iOS Safari的一个常见限制，非常安全。
    const SAFE_MAX_CANVAS_AREA = 16777216;

    const originalWidth = document.documentElement.scrollWidth;
    const originalHeight = document.documentElement.scrollHeight;
    const originalArea = originalWidth * originalHeight;

    // 3. 计算最大缩放比例
    // scale^2 * originalArea <= SAFE_MAX_CANVAS_AREA
    // scale <= sqrt(SAFE_MAX_CANVAS_AREA / originalArea)
    const maxScale = Math.sqrt(SAFE_MAX_CANVAS_AREA / originalArea);

    // 返回一个稍微向下取整的值以增加保险系数，比如保留两位小数
    return Math.floor(maxScale * 100) / 100;
}
        // 截图函数
        async function screenshotToPNGBase64(scale = 4) {
            // 检查 html2canvas 是否已加载
            if (typeof html2canvas === 'undefined') {
                window.location.href = 'browser://showhud?message='+encodeURIComponent('html2canvas库加载失败')
                return;
            }

            console.log('开始截图...');
            const maxScale = calculateMaxScale();
            console.log('最大缩放比例:', maxScale);
            if (scale > maxScale) {
              scale = maxScale
            }

            // 使用 html2canvas 截取整个 body
            // 你可以根据需要调整截图的配置参数
            let canvas = await html2canvas(document.body, {
                scale: scale,
                allowTaint: true, // 允许跨域图片，但可能会污染 canvas
                useCORS: true,    // 尝试使用 CORS 加载图片，避免污染
                scrollY: -window.scrollY, // 确保从页面顶部开始截图
                windowWidth: document.documentElement.scrollWidth, // 使用完整的文档宽度
                windowHeight: document.documentElement.scrollHeight // 使用完整的文档高度
            })
            const image = canvas.toDataURL('image/jpeg',0.8); // 压缩图片大小
            return image
        }
        // 截图函数
        async function captureScreenshot() {
            let image = await screenshotToPNGBase64()
            window.location.href = 'browser://copyimage?image='+image
        }
        
        `

}

  static dataFromBase64(base64,type = undefined){
    if (type) {
      switch (type) {
        case "pdf":
          if (base64.startsWith("data:application/pdf;base64,")) {
            let pdfData = NSData.dataWithContentsOfURL(MNUtil.genNSURL(base64))
            return pdfData
          }else{
            let pdfData = NSData.dataWithContentsOfURL(MNUtil.genNSURL("data:application/pdf;base64,"+base64))
            return pdfData
          }
        default:
          break;
      }
    }
    return NSData.dataWithContentsOfURL(MNUtil.genNSURL(base64))
  }
  /**
   * 该方法会弹出文件选择窗口以选择要导入的文档
   * @returns {string} 返回文件md5
   */
  static importPDFFromBase64(pdfBase64,option = {}){
  try {

    let pdfData = this.dataFromBase64(pdfBase64,"pdf")
    if ("filePath" in option) {
      pdfData.writeToFileAtomically(option.filePath, false)
      let md5 = MNUtil.importDocument(option.filePath)
      return md5
    }
    let fileName = option.fileName || ("imported_"+Date.now()+".pdf")
    let folder = option.folder || MNUtil.tempFolder
    let filePath = folder + fileName
    MNUtil.log(filePath)
    pdfData.writeToFileAtomically(filePath, false)
    let md5 = MNUtil.importDocument(filePath)
    return md5
    
  } catch (error) {
    this.addErrorLog(error, "importPDFFromBase64")
    return undefined
  }
  }
  /**
   * 该方法会弹出文件选择窗口以选择要导入的文档
   * @returns {string} 返回文件md5
   */
  static importPDFFromData(pdfData,option = {}){
  try {
    if ("filePath" in option) {
      pdfData.writeToFileAtomically(option.filePath, false)
      let md5 = MNUtil.importDocument(option.filePath)
      return md5
    }
    let fileName = option.fileName || ("imported_"+Date.now()+".pdf")
    let folder = option.folder || MNUtil.tempFolder
    let filePath = folder + fileName
    MNUtil.log(filePath)
    pdfData.writeToFileAtomically(filePath, false)
    let md5 = MNUtil.importDocument(filePath)
    return md5
    
  } catch (error) {
    this.addErrorLog(error, "importPDFFromBase64")
    return undefined
  }
  }
  static addErrorLog(error,source,info){
    MNUtil.showHUD("MN Browser Error ("+source+"): "+error)
    let log = {
      error:error.toString(),
      source:source,
      time:(new Date(Date.now())).toString(),
      mnaddon:"MN Browser"
    }
    if (info) {
      log.info = info
    }
    this.errorLog.push(log)
    MNUtil.copy(this.errorLog)
    if (typeof MNUtil.log !== 'undefined') {
      MNUtil.log({
        source:"MN Browser",
        level:"error",
        message:source,
        detail:log,
      })
    }
  }
  static ttsHtml(){
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MP3 Player</title>
</head>
<body>
    <audio controls id="audioPlayer">
        Your browser does not support the audio element.
    </audio>

    <script>
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer sk-Z009eI4mw8tmOqgvA598C8B7Eb9a4444821018157bC59fF1");
        myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
           "model": "tts-1",
           "input": "The quick brown fox jumped over the lazy dog.",
           "voice": "alloy"
        });

        var requestOptions = {
           method: 'POST',
           headers: myHeaders,
           body: raw,
           redirect: 'follow'
        };

        fetch("https://chatapi.onechats.top/v1/audio/speech", requestOptions)
           .then(response => response.blob())
           .then(blob => {
               var url = URL.createObjectURL(blob);
               var audioPlayer = document.getElementById('audioPlayer');
               var source = document.createElement('source');
               source.src = url;
               source.type = 'audio/mpeg';
               audioPlayer.appendChild(source);
               audioPlayer.load();
           })
           .catch(error => console.log('error', error));
    </script>
</body>
</html>
`
  return html
  }
  static extractJSONFromMarkdown(markdown) {
    // 使用正则表达式匹配被```JSON```包裹的内容
    const regex = /```JSON([\s\S]*?)```/g;
    const matches = regex.exec(markdown);
    
    // 提取匹配结果中的JSON字符串部分，并去掉多余的空格和换行符
    if (matches && matches[1]) {
        const jsonString = matches[1].trim();
        return jsonString;
    } else {
        return undefined;
    }
  }
  static getTextForSearch (note) {
    let order = browserConfig.searchOrder
    if (!order) {
      order = [2,1,3]
    }
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
          let noteText  = note.comments.filter(comment=>comment.type === "TextNote" && !/^marginnote3app:\/\//.test(comment.text))
          if (noteText.length) {
            text =  noteText[0].text
          }
          break;
        default:
          break;
      }
      if (text) {
        return text
      }
    }
  return ""
  }
  /**
   * 
   * @param {MNNote|MbBookNote} note 
   */
static async parseNoteInfo(note){
  let config = {content:this.getTextForSearch(note)}
  let markdown = await note.getMDContent()
  let bilibiliLinks = this.extractBilibiliLinks(markdown)
  if (bilibiliLinks.length) {
    config.bilibiliLinks = bilibiliLinks
  }
  let webLinks = this.extractWebLink(markdown)
  if (webLinks.length) {
    config.webLinks = webLinks
  }
  return config
}
  static extractWebLink (markdownText) {
  if (!this.checkSubscribe(true)) {
    return undefined
  }
  // 正则表达式匹配以 "marginnote4app://addon/BilibiliExcerpt?videoId=" 开头的链接
  const regex = /https:\/\/.*/g;

  const results = [];
  let match;

  // 循环匹配所有符合条件的链接
  while ((match = regex.exec(markdownText)) !== null) {
    results.push(match[0]);
  }
  return results;
}
static extractBilibiliLinks(markdownText) {
  if (!this.checkSubscribe(true)) {
    return undefined
  }
  // 正则表达式匹配以 "marginnote4app://addon/BilibiliExcerpt?videoId=" 开头的链接
  const regex = /marginnote4app:\/\/addon\/BilibiliExcerpt\?videoId=([^&\s)]+)(?:&t=([\d.]+))?(?:&p=([\d.]+))?/g;

  const results = [];
  let match;

  // 循环匹配所有符合条件的链接
  while ((match = regex.exec(markdownText)) !== null) {
    const videoId = match[1]; // 提取 videoId
    const t = match[2] ? parseFloat(match[2]) : null; // 提取 t 并转换为数字，如果不存在则为 null
    const p = match[3] ? parseFloat(match[3]) : null; // 提取 t 并转换为数字，如果不存在则为 null

    results.push({ videoId, t ,p});
  }

  return results;
}
  static videoInfo2MD(videoFrameInfo){
    if ("bv" in videoFrameInfo) {
      let timeStamp = this.videoTime2MD(videoFrameInfo)
      return `![image.png](${videoFrameInfo.image})\n${timeStamp}`
      
    }else{
      return `![image.png](${videoFrameInfo.image})`
    }
  }
  static videoTime2MD(videoFrameInfo){
    let formatedVideoTime = this.formatSeconds(videoFrameInfo.time)
    if ("p" in videoFrameInfo && videoFrameInfo.p) {
      if (browserConfig.getConfig("timestampDetail")) {
        return `[\[${formatedVideoTime}\] (${videoFrameInfo.bv}-${videoFrameInfo.p})](marginnote4app://addon/BilibiliExcerpt?videoId=${videoFrameInfo.bv}&t=${videoFrameInfo.time}&p=${videoFrameInfo.p})`
      }else{
        return `[${formatedVideoTime}](marginnote4app://addon/BilibiliExcerpt?videoId=${videoFrameInfo.bv}&t=${videoFrameInfo.time}&p=${videoFrameInfo.p})`
      }
    }
    if (browserConfig.getConfig("timestampDetail")) {
      return `[\[${formatedVideoTime}\] (${videoFrameInfo.bv})](marginnote4app://addon/BilibiliExcerpt?videoId=${videoFrameInfo.bv}&t=${videoFrameInfo.time})`
    }else{
      return `[${formatedVideoTime}](marginnote4app://addon/BilibiliExcerpt?videoId=${videoFrameInfo.bv}&t=${videoFrameInfo.time})`
    }
  }
  static getTargetFrame(popupFrame,arrow){
    var x, y
    let w = (MNUtil.app.osType !== 1) ? 419 : 365, // this.addonController.view.frame.width
      h = 500, // this.addonController.view.frame.height
      fontSize = 15,
      margin = 10,
      padding = 20
    let frame = MNUtil.studyView.bounds
    let W = frame.width
    let H = frame.height
    let X = popupFrame.x
    let Y = popupFrame.y
    let contextMenuWidth = MNUtil.studyMode === 0 ? 225 : 435
    let contextMenuHeight = 35
    let textMenuPadding = 40

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
    if (arrow === 1) {
      let upperBlankHeight = Y - textMenuPadding - fontSize - padding,
        lowerBlankHeight = H - Y - contextMenuHeight - padding;
      if (upperBlankHeight >= lowerBlankHeight) {
        h = (upperBlankHeight >= h) ? h : upperBlankHeight;
        y = upperBlankHeight - h;
      } else {
        y = H - lowerBlankHeight;
        h = (H - y >= h) ? h : H - y;
    // this.appInstance.showHUD('x:'+x+';y:'+Y,this.window,2)
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
    return MNUtil.genFrame(x, y, w, h)
  }
  /**
   * 
   * @param {string} url 
   * @returns {boolean}
   */
  static isAllowedIconLibrary(url){
    if (url.includes("https://www.iconfont.cn/")) {
      return true;
    }
    if (url.includes("https://zhangyu1818.github.io/appicon-forge/")) {
      return true
    }
    return false
  }
  /**
   * 
   * @param {string} url 
   * @returns 
   */
static parseLink(url) {
    const result = {
        isPdfDownload: false,
        fileName: ''
    };

    // 检查是否是 PDF 文件的下载链接
    const isPdfRegex = /\.pdf(\?|$)/i;
    result.isPdfDownload = isPdfRegex.test(url);

    // 提取文件名
    const fileNameRegex = /\/([^\/?#]+\.pdf)(\?|$)/i;
    const match = url.match(fileNameRegex);
    if (match && match[1]) {
        result.fileName = decodeURIComponent(match[1]);
    }

    return result;
}
static checkRedirect(requestURL){
    let info = {
      isRedirect:false,
      redirectURL:""
    }
    if (requestURL.startsWith("https://www.baidu.com/s?tn" || requestURL.startsWith("https://www.baidu.com/s?wd="))) {
      let searchText = requestURL.split("wd=")[1]
      // MNUtil.copy(searchText)
      let decodedSearchText = decodeURIComponent(searchText)
      if (decodedSearchText.startsWith("https://") || decodedSearchText.startsWith("http://")) {
        info.isRedirect = true
        info.redirectURL = decodedSearchText
        return info
      }
      info.isRedirect = true
      info.redirectURL = "https://www.baidu.com/s?wd="+searchText
      return info
    }
    if (requestURL.startsWith("https://www.google.com/search?q=")) {
      let searchText = requestURL.split("search?q=")[1]
      let decodedSearchText = decodeURIComponent(searchText)
      if (decodedSearchText.startsWith("https://") || decodedSearchText.startsWith("http://")) {
        info.isRedirect = true
        info.redirectURL = decodedSearchText
        return info
      }
    }
    if (requestURL.startsWith("https://www.bing.com/search?q=") || requestURL.startsWith("https://cn.bing.com/search?form=bing&q=")) {
      let searchText = requestURL.split("q=")[1]
      let decodedSearchText = decodeURIComponent(searchText)
      if (decodedSearchText.startsWith("https://") || decodedSearchText.startsWith("http://")) {
        info.isRedirect = true
        info.redirectURL = decodedSearchText
        return info
      }
    }
    if (requestURL.startsWith("https://www.duckduckgo.com/?q=")) {
      let searchText = requestURL.split("?q=")[1]
      let decodedSearchText = decodeURIComponent(searchText)
      if (decodedSearchText.startsWith("https://") || decodedSearchText.startsWith("http://")) {
        info.isRedirect = true
        info.redirectURL = decodedSearchText
        return info
      }
    }
    if (requestURL.startsWith("https://www.sogou.com/sogou") && requestURL.includes("query=")) {
      let searchText = requestURL.split("query=")[1]
      let decodedSearchText = decodeURIComponent(searchText)
      if (decodedSearchText.startsWith("https://") || decodedSearchText.startsWith("http://")) {
        info.isRedirect = true
        info.redirectURL = decodedSearchText
        return info
      }
    }
    if (requestURL.startsWith("https://yandex.com/search") && requestURL.includes("text=")) {
      let searchText = requestURL.split("text=")[1]
      let decodedSearchText = decodeURIComponent(searchText)
      if (decodedSearchText.startsWith("https://") || decodedSearchText.startsWith("http://")) {
        info.isRedirect = true
        info.redirectURL = decodedSearchText
        return info
      }
    }
    if (requestURL.startsWith("https://m.so.com/s?")) {
      let searchText = requestURL.split("q=")[1]
      let decodedSearchText = decodeURIComponent(searchText)
      if (decodedSearchText.startsWith("https://") || decodedSearchText.startsWith("http://")) {
        info.isRedirect = true
        info.redirectURL = decodedSearchText
        return info
      }
    }
    if (requestURL.startsWith("https://www.zhihu.com/search?type=content&q=")) {
      let searchText = requestURL.split("search?type=content&q=")[1]
      let decodedSearchText = decodeURIComponent(searchText)
      if (decodedSearchText.startsWith("https://") || decodedSearchText.startsWith("http://")) {
        info.isRedirect = true
        info.redirectURL = decodedSearchText
        return info
      }
    }
    return info
}

static getWebJS(id) {
  switch (id) {
    case "updateDeeplOffset":
      return `document.getElementsByClassName("page-header")[0].style.display='none';
        document.getElementsByTagName("nav")[2].style.display='none';
        document.querySelector('[data-layout-id="translatorTabList"]').style.display='none';
        document.querySelector('[data-layout-id="mainSection"]').style.padding='0px';
        `
    case "updateThesaurusOffset":
      return `document.getElementsByTagName("header")[0].style.display = "none"
        document.getElementsByTagName("section")[0].style.display = "none"
        document.getElementsByTagName("section")[6].style.display = "none"
        document.getElementsByTagName("section")[7].style.display = "none"
        document.getElementsByTagName("section")[8].style.display = "none"
        document.getElementsByTagName("section")[9].style.display = "none"
        document.getElementsByTagName("p")[5].style.display = "none"
        document.getElementsByClassName("acw ac-widget-placeholder ac-reset")[0].style.display = "none"`
    case "updateBaiduTranslateOffset":
      return `document.querySelector('[class^="AppTopSwiper__root"]').style.display='none';`
    case "updateBilibiliOffset":
      return `
      document.getElementsByClassName("v-popover-wrap")[0].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[1].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[2].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[3].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[4].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[5].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[6].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[8].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[10].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[11].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[13].style.display = "none";
      document.getElementsByClassName("recommended-swipe grid-anchor")[0].style.display = "none";
      `
    default:
      return ""
  }
}

}
class browserConfig{
  static get defaultEntries(){
    return {
      Bing:             { title: '🔍 Bing',           symbol: "🔍", engine: "Bing",     desktop:false, link: "https://www.bing.com/search?q=%s" },
      Baidu:            { title: '🔍 Baidu',          symbol: "🔍", engine: "Baidu",    desktop:false, link: "https://www.baidu.com/s?wd=%s" },
      Zhihu:            { title: '🔍 Zhihu',          symbol: "🔍", engine: "Zhihu",    desktop:false, link: "https://www.zhihu.com/search?type=content&q=%s" },
      Google:           { title: '🔍 Google',         symbol: "🔍", engine: "Google",   desktop:false, link: "https://www.google.com/search?q=%s" },
      BaiduTranslate:   { title: '📔 Baidu',          symbol: "📔", engine: "Baidu",    desktop:false, link: "https://fanyi.baidu.com/#en/zh/%s" },
      Deepl:            { title: '📔 Deepl',          symbol: "📔", engine: "Deepl",    desktop:false, link: "https://www.deepl.com/translator#en/zh/%s" },
      Youdao:           { title: '📔 Youdao',         symbol: "📔", engine: "Youdao",   desktop:false, link: "https://dict.youdao.com/m/result?word=%s&lang=en" },
      GoogleTranslate:  { title: '📔 Google',         symbol: "📔", engine: "Google",   desktop:false, link: "https://translate.google.com/?sl=en&tl=zh-CN&text=%s&op=translate" },
      Thesaurus:        { title: '📔 Thesaurus',      symbol: "📔", engine: "Thesaurus",desktop:false, link: "https://www.thesaurus.com/browse/%s" },
      ChatGLM:          { title: '🤖 智谱清言',        symbol: "🤖", engine: "智谱清言",     desktop:false, link: "https://chatglm.cn/detail?from=apply" },
      Yiyan:            { title: '🤖 文心一言',        symbol: "🤖", engine: "文心一言",     desktop:false, link: "https://yiyan.baidu.com/" },
      ResearchGate:     { title: '🎓 ResearchGate',   symbol: "🎓", engine: "RG",       desktop:false, link: "https://www.researchgate.net/search.Search.html?query=%s" },
      GoogleScholar:    { title: '🎓 Google Scholar', symbol: "🎓", engine: "Scholar",  desktop:false, link: "https://scholar.google.com/scholar?q=%s" }
    }
  }
  static get defaultWebAppEntries(){
    return {
      Bilibili:         { title: '📺 Bilibili',       symbol: "📺", engine: "Bilibili", desktop:true, link: "https://www.bilibili.com" },
      Notion:           { title: '📝 Notion',         symbol: "📝", engine: "Notion",   desktop:false, link: "https://www.notion.so" },
      Wolai:            { title: '📝 Wolai',          symbol: "📝", engine: "Wolai",    desktop:false, link: "https://www.wolai.com" },    
      Craft:            { title: '📝 Craft',          symbol: "📝", engine: "Craft",    desktop:false, link: "https://docs.craft.do" },
      Flomo:            { title: '📝 Flomo',          symbol: "📝", engine: "Flomo",    desktop:false, link: "https://v.flomoapp.com/mine" },
      Flowus:           { title: '📝 Flowus',         symbol: "📝", engine: "Flowus",   desktop:false, link: "https://flowus.cn" },
      Yinian:           { title: '📝 Yinian',         symbol: "📝", engine: "Yinian",   desktop:true, link: "https://www.yinian.pro/note/" },
      Baiduyun:         { title: '☁️ Baiduyun',        symbol: "☁️", engine: "Baidu",    desktop:true, link: "https://pan.baidu.com/disk/main#/index?category=all" },
    }
  }
  static onSync = false
  static get allCustomActions(){
    return [
        "openNewWindow",
        "openInNewWindow",
        "screenshot",
        "videoFrame2Clipboard",
        "videoFrame2Editor",
        "videoFrame2Note",
        "videoFrame2ChildNote",
        "videoFrameToNewNote",
        "videoFrameToComment",
        "videoFrameToSnipaste",
        "videoTime2Clipboard",
        "videoTime2Editor",
        "videoTime2Note",
        "videoTime2ChildNote",
        "videoTimeToNewNote",
        "videoTimeToComment",
        "changeBilibiliVideoPart",
        "pauseOrPlay",
        "forward10s",
        "backward10s",
        "bigbang",
        "copyCurrentURL",
        "copyAsMDLink",
        "openCopiedURL",
        "uploadPDFToDoc2X",
        "uploadImageToDoc2X"
      ]
  }
  static getCustomEmojiByAction(action){
    switch (action) {
      case "screenshot":
        return " 📸";
      case "videoFrame2Clipboard":
      case "videoFrame2Editor":
      case "videoFrame2Note":
      case "videoFrame2ChildNote":
      case "videoFrameToComment":
      case "videoFrameToNewNote":
      case "videoFrameToSnipaste":
        return "🎬";
      case "videoTime2Clipboard":
      case "videoTime2Editor":
      case "videoTime2Note":
      case "videoTime2ChildNote":
      case "videoTimeToComment":
      case "videoTimeToNewNote":
        return "📌";
      case "forward10s":
        return "⏩";
      case "backward10s":
        return "⏪";
      case "pauseOrPlay":
        return "▶️"
      case "bigbang":
        return "💥"
      case "openNewWindow":
      case "openInNewWindow":
        return "➕";
      case "copyCurrentURL":
      case "copyAsMDLink":
      case "openCopiedURL":
        return "🌐";
      case "uploadPDFToDoc2X":
      case "uploadImageToDoc2X":
        return "📤";
      case "changeBilibiliVideoPart":
        return "🕐";
      default:
        break;
    }
    return "";
  }
  static getCustomEmoji(index){
    let configName = (index === 1)?"custom":"custom"+index
    return this.getCustomEmojiByAction(this.getConfig(configName))
  }
    static getCustomDescription(action){
    let actionConfig = {
      "openNewWindow":"open new window",
      "openInNewWindow":"open in new window",
      "screenshot":"screenshot",
      "videoFrame2Clipboard":"videoframe to clipboard",
      "videoFrame2Editor":"videoframe to editor",
      "videoFrame2Note":"videoframe to note",
      "videoFrame2ChildNote":"videoframe to child note",
      "videoFrameToNewNote":"videoframe to new note",
      "videoFrameToComment":"videoframe to comment",
      "videoTime2Clipboard":"timestamp to clipboard",
      "videoTime2Editor":"timestamp to editor",
      "videoTime2Note":"timestamp to note",
      "videoTime2ChildNote":"timestamp to child note",
      "videoFrameToSnipaste":"videoframe to snipaste",
      "videoTimeToNewNote":"timestamp to new note",
      "videoTimeToComment":"timestamp to comment",
      "pauseOrPlay":"pause or play",
      "forward10s":"video forward 10s",
      "backward10s":"video backward 10s",
      "bigbang":"bigbang",
      "copyCurrentURL":"copy current URL",
      "copyAsMDLink":"copy as MD link",
      "openCopiedURL":"open copied URL",
      "uploadPDFToDoc2X":"upload PDF to Doc2X",
      "uploadImageToDoc2X":"upload Image to Doc2X",
      "changeBilibiliVideoPart":"Change Bilibili Video part"
    }
    let emoji = this.getCustomEmojiByAction(action)
    return emoji+" "+actionConfig[action];
  }
  static get defaultConfig(){
    return{
      syncNoteId: "",
      autoExport:false,
      autoImport:false,
      autoExitWatchMode:true,
      lastSyncTime:0,
      modifiedTime:0,
      custom:"screenshot",
      custom2:"copyCurrentURL",
      custom3:"bigbang",
      custom4:"openNewWindow",
      custom5:"openCopiedURL",
      custom6:"videoFrame2Clipboard",
      custom7:"videoFrame2Note",
      custom8:"videoFrame2ChildNote",
      custom9:"videoFrameToNewNote",
      custom10:"videoFrameToComment",
      timestampDetail:true,
      autoOpenVideoExcerpt:false,
      homePage:{
        url:'https://m.inftab.com/',
        desktop:false
      },
      size:{width:419,height:450},
      syncSource:"None",
      syncNoteId: "",
      r2file:"",
      r2password:"",
      InfiFile:"",
      InfiPassword:"",
      webdavFile:"",
      webdavFolder:"",
      webdavUser:"",
      webdavPassword:"",
      homePageEngine:"Bing",
      useLocalHomePage:true
    }
  }
  static previousConfig = {}
  static get homePageEngine(){
    let engine = this.getConfig("homePageEngine")
    if (!(engine in this.entries)) {
      engine = this.entrieNames[0]
    }
    return engine
  }
  static init(){
    this.config = this.getByDefault('MNBrowser_config', this.defaultConfig)
    this.entries = this.getByDefault('MNBrowser_entries', this.defaultEntries)
    this.entrieNames = this.getByDefault('MNBrowser_entrieNames',Object.keys(this.entries));
    this.webAppEntries = this.getByDefault('MNBrowser_webAppEntries', this.defaultWebAppEntries)
    this.webAppEntrieNames = this.getByDefault('MNBrowser_webAppEntrieNames', Object.keys(this.webAppEntries))
    if (!this.webAppEntrieNames.length) {
      this.webAppEntrieNames = Object.keys(this.webAppEntries)
    }
    // MNUtil
    this.toolbar = this.getByDefault('MNBrowser_toolbar', true)
    this.dynamic = this.getByDefault('MNBrowser_dynamic', false)
    this.engine = this.getByDefault('MNBrowser_engine', "Bing")
    if (!(this.engine in this.entries)) {
      this.engine = this.entrieNames[0]
    }
    // if (!(this.engine in this.entries)) {
    //   this.engine = this.entrieNames[0]
    // }
    this.searchOrder         = this.getByDefault('MNBrowser_searchOrder',[2,1,3]);
    if (!this.searchOrder || !this.searchOrder.length) {
      this.searchOrder = [2,1,3]
    }
  }
  static copy(obj){
    return JSON.parse(JSON.stringify(obj))
  }
  static getByDefault(key,defaultValue) {
    let value = NSUserDefaults.standardUserDefaults().objectForKey(key)
    if (value === undefined) {
      NSUserDefaults.standardUserDefaults().setObjectForKey(defaultValue,key)
      return defaultValue
    }
    return value
  }
  static remove(key){
    NSUserDefaults.standardUserDefaults().removeObjectForKey(key)
  }
  static save(key,ignoreExport = false,synchronize = true){
        // MNUtil.showHUD("save "+key)
    switch (key) {
      case "MNBrowser_webAppEntries":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.webAppEntries,"MNBrowser_webAppEntries")
        this.config.modifiedTime = Date.now()
        if (!ignoreExport && this.autoExport(true)) {
          this.export(false)
        }
        break;
      case "MNBrowser_webAppEntrieNames":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.webAppEntrieNames,"MNBrowser_webAppEntrieNames")
        this.config.modifiedTime = Date.now()
        if (!ignoreExport && this.autoExport(true)) {
          this.export(false)
        }
        break;
      case "MNBrowser_entries":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.entries,"MNBrowser_entries")
        this.config.modifiedTime = Date.now()
        if (!ignoreExport && this.autoExport(true)) {
          this.export(false)
        }
        break;
      case "MNBrowser_entrieNames":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.entrieNames,"MNBrowser_entrieNames")
        this.config.modifiedTime = Date.now()
        if (!ignoreExport && this.autoExport(true)) {
          this.export(false)
        }
        break;
      case "MNBrowser_searchOrder":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.searchOrder,"MNBrowser_searchOrder")
        this.config.modifiedTime = Date.now()
        if (!ignoreExport && this.autoExport(true)) {
          this.export(false)
        }
        break;
      case "MNBrowser_dynamic":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.dynamic,"MNBrowser_dynamic")
        this.config.modifiedTime = Date.now()
        if (!ignoreExport && this.autoExport(true)) {
          this.export(false)
        }
        break;
      case "MNBrowser_engine":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.engine,"MNBrowser_engine")
        this.config.modifiedTime = Date.now()
        if (!ignoreExport && this.autoExport(true)) {
          this.export(false)
        }
        break;
      case "MNBrowser_toolbar":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.toolbar,"MNBrowser_toolbar")
        this.config.modifiedTime = Date.now()
        if (!ignoreExport && this.autoExport(true)) {
          this.export(false)
        }
        break;
      case "MNBrowser_config":
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.config,"MNBrowser_config")
        this.config.modifiedTime = Date.now()
        if (!ignoreExport && this.autoExport(true)) {
          this.export(false)
        }
        break;
      default:
        break;
    }
    if (synchronize) {
      NSUserDefaults.standardUserDefaults().synchronize()
    }
  }
  static checkCloudStore(notificaiton = true){
    let iCloudSync = this.getConfig("syncSource") === "iCloud"
    if (iCloudSync &&!this.cloudStore) {
      this.cloudStore = NSUbiquitousKeyValueStore.defaultStore()
      if (notificaiton) {
        MNUtil.postNotification("NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI", {}) 
      }
    }
  }
  static initCloudStore(){
    this.cloudStore = NSUbiquitousKeyValueStore.defaultStore()
    MNUtil.postNotification("NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI", {})
    // this.readCloudConfig(false)
  }
  static getAllConfig(){
    let config = {
      config:this.config,
      entries:this.entries,
      entrieNames:this.entrieNames,
      webAppEntries:this.webAppEntries,
      webAppEntrieNames:this.webAppEntrieNames,
      searchOrder:this.searchOrder,
      dynamic:this.dynamic,
      engine:this.engine,
      toolbar:this.toolbar
    }
    return config
  }
  /**
   * 
   * @param {object} obj1 
   * @param {object} obj2 
   * @returns {boolean}
   */
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
        if (["modifiedTime","lastSyncTime","autoImport","autoExport"].includes(key)) {
          continue
        }
        // if (key === "currentPrompt") {
        //   MNUtil.copy(obj1[key]+":"	+ obj2[key])
        // }
        if (!this.deepEqual(obj1[key], obj2[key])) {
          return false;
        }
    }
    return true;
  }
  static isValidTotalConfig(config){
    if (!config) {
      return false
    }
    let isVaild = ("config" in config && "entries" in config && "entrieNames" in config && "webAppEntries" in config && "webAppEntrieNames" in config && "searchOrder" in config && "dynamic" in config && "engine" in config && "toolbar" in config)
    return isVaild
  }
  /**
   * 
   * @param {object} newConfig 
   * @returns {boolean}
   */
  static importConfig(newConfig){
    if (this.isValidTotalConfig(newConfig)){
      this.previousConfig = this.getAllConfig()
      let autoImport = this.getConfig("autoImport")
      let autoExport = this.getConfig("autoExport")
      this.config = newConfig.config
      this.config.lastSyncTime = Date.now()
      this.config.autoImport = autoImport
      this.config.autoExport = autoExport
      // this.config.modifiedTime = Date.now()
      this.entries = newConfig.entries
      this.entrieNames = newConfig.entrieNames
      this.webAppEntries = newConfig.webAppEntries
      this.webAppEntrieNames = newConfig.webAppEntrieNames
      this.searchOrder = newConfig.searchOrder
      this.dynamic = newConfig.dynamic
      this.engine = newConfig.engine
      this.toolbar = newConfig.toolbar
      this.saveAfterImport()
      this.setSyncStatus(false,true)
      return true
    }else{
      this.setSyncStatus(false)
      return false
    }
  }
  /**
   * 
   * @param {boolean} msg 
   * @param {boolean} alert 
   * @param {boolean} force 
   * @returns {Promise<boolean>}
   */
  static async readCloudConfig(msg = true,alert = false,force = false){

    // if (!chatAIUtils.checkSubscribe(false,msg)) {
    //   return false
    // }
    this.checkCloudStore(false)
    if (force) {
      let cloudConfig = this.cloudStore.objectForKey("MNBrowser_totalConfig")
      let success = this.importConfig(cloudConfig)
      if (msg) {
        MNUtil.showHUD("Import from iCloud")
      }
      if (success) {
        if (alert) {
          MNUtil.showHUD("Import success!")
        }
        return true
      }else{
        MNUtil.showHUD("Invalid config in iCloud!")
        return false
      }
    }
    let iCloudSync = this.getConfig("syncSource") === "iCloud"
    if(!iCloudSync){
      return false
    }
    try {
      let cloudConfig = this.cloudStore.objectForKey("MNBrowser_totalConfig")
      // MNUtil.copy(cloudConfig)
      if (cloudConfig) {
        let same = this.deepEqual(cloudConfig, this.getAllConfig())
        if (same) {
          if (msg) {
            MNUtil.showHUD("Already synced")
          }
          return false
        }
        //要求云端的配置更新, 才能向本地写入
        //即使云端最旧的时间也要比本地最新的时候更新
        let localLatestTime = this.getLocalLatestTime()
        let localOldestTime = Math.min(this.config.lastSyncTime,this.config.modifiedTime)
        let cloudLatestTime = Math.max(cloudConfig.config.lastSyncTime,cloudConfig.config.modifiedTime)
        let cloudOldestTime = Math.min(cloudConfig.config.lastSyncTime,cloudConfig.config.modifiedTime)
        // MNUtil.copy({localLatestTime,localOldestTime,cloudLatestTime,cloudOldestTime})
        if (localLatestTime < cloudOldestTime) {
          if (alert) {
            let confirm = await MNUtil.confirm("MN Browser\nImport from iCloud?","是否导入iCloud配置？")
            if (!confirm) {
              return false
            }
          }
          if (msg) {
            MNUtil.showHUD("Import from iCloud")
          }
          let success = this.importConfig(cloudConfig)
          if (success) {
            if (alert) {
              MNUtil.showHUD("Import success!")
            }
            return true
          }else{
            MNUtil.showHUD("Invalid config in iCloud!")
            return false
          }
        }
        //如果本地配置的修改时间比云端配置的修改时间大1秒,则认为本地配置更新,需要上传到云端
        if (this.config.modifiedTime > (cloudConfig.config.modifiedTime+1000)) {
          if (alert) {
            let confirm = await MNUtil.confirm("MN Browser\n Uploading to iCloud?","📤 是否上传配置到iCloud？")
            if (!confirm) {
              return false
            }
          }
          this.writeCloudConfig(msg)
          return false
        }
        let userSelect = await MNUtil.userSelect("MN Browser","Conflict config, import or export?\n\n配置冲突，请选择操作\n\n"+Date.parse(this.config.modifiedTime).toLocaleString()+"\n"+Date.parse(cloudConfig.config.modifiedTime).toLocaleString()+"\n\n"+Date.parse(this.config.lastSyncTime).toLocaleString()+"\n"+Date.parse(cloudConfig.config.lastSyncTime).toLocaleString(),["📥 Import / 导入","📤 Export / 导出"])
        switch (userSelect) {
          case 0:
            MNUtil.showHUD("User Cancel")
            return false
          case 1:
            let success = this.importConfig(cloudConfig)
            if (success) {
              if (alert) {
                MNUtil.showHUD("Import success!")
              }
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
        let confirm = await MNUtil.confirm("MN Browser\nEmpty config in iCloud, uploading?","iCloud配置为空,是否上传？")
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
      browserUtils.addErrorLog(error, "readCloudConfig")
      return false
    }
  }
  static writeCloudConfig(msg = true,force = false){
  try {
    

    // if (!browserUtils.checkSubscribe(false,msg,true)) {
    //   return false
    // }
    let key = "MNBrowser_totalConfig"
    this.checkCloudStore(false)
    if (force) {
      this.config.lastSyncTime = Date.now()
      // this.config.modifiedTime = Date.now()
      let config = this.getAllConfig()
      this.cloudStore.setObjectForKey(config,key)
      this.config.lastSyncTime = Date.now()
      return true
    }
    let iCloudSync = this.getConfig("syncSource") === "iCloud"
    if(!iCloudSync){
      return false
    }
    let cloudConfig = this.cloudStore.objectForKey(key)
    if (cloudConfig) {
      let same = this.isSameConfigWithLocal(cloudConfig)
      if (same) {
        //如果同步配置相同,不应该向云端写入
        return false
      }
      //如果云端的更新,那么不应该向云端写入
      let localLatestTime = Math.max(this.config.lastSyncTime,this.config.modifiedTime)
      let cloudOldestTime = Math.min(cloudConfig.config.lastSyncTime,cloudConfig.config.modifiedTime)
      if (localLatestTime < cloudOldestTime) {
        let localTime = Date.parse(localLatestTime).toLocaleString()
        let cloudTime = Date.parse(cloudOldestTime).toLocaleString()
        MNUtil.showHUD("Conflict config: local_"+localTime+", cloud_"+cloudTime)
        return false
      }
    }
    this.config.lastSyncTime = Date.now()
    // this.config.modifiedTime = Date.now()
    let config = this.getAllConfig()
    this.cloudStore.setObjectForKey(config,key)
    this.config.lastSyncTime = Date.now()
    // MNUtil.copy(config)
    // this.config.modifiedTime = Date.now()
    return true
  } catch (error) {
    browserUtils.addErrorLog(error, "writeCloudConfig")
    return false
  }
  }
  static getSyncSourceString(){
    switch (this.getConfig("syncSource")) {
      case "MNNote":
        return "MNNote"
      case "CFR2":
        return "Cloudflare R2"
      case "Infi":
        return "InfiniCloud"
      case "Webdav":
        return "Webdav"
      case "iCloud":
        return "iCloud"
      case "None":
        return "None"
      default:
        break;
    }
    return undefined
  }
  /**
   * 
   * @param {boolean} checkSubscribe 
   * @returns {boolean}
   */
  static autoImport(checkSubscribe = false){
    if (checkSubscribe && !browserUtils.checkSubscribe(false,false,true)) {
      return false
    }
    return this.getConfig("autoImport")
  }
  /**
   * 
   * @param {boolean} checkSubscribe 
   * @returns {boolean}
   */
  static autoExport(checkSubscribe = false){
    if (checkSubscribe && !browserUtils.checkSubscribe(false,false,true)) {
      return false
    }
    return this.getConfig("autoExport")
  }
  static getConfig(key){
    if (this.config[key] !== undefined) {
      return this.config[key]
    }else{
      return this.defaultConfig[key]
    }
  }


  static setSyncStatus(onSync,success = false){
  try {
    this.onSync = onSync
    // if (chatAIUtils.chatController) {
    //   if (onSync) {
    //     MNButton.setColor(chatAIUtils.chatController.moveButton, "#e06c75",0.5)
    //   }else{
    //     if (success) {
    //       MNButton.setColor(chatAIUtils.chatController.moveButton, "#30d36c",0.5)
    //       MNUtil.delay(1).then(()=>{
    //         MNButton.setColor(chatAIUtils.chatController.moveButton, "#3a81fb",0.5)
    //       })
    //     }else{
    //       MNButton.setColor(chatAIUtils.chatController.moveButton, "#3a81fb",0.5)
    //     }
    //   }
    // }
  } catch (error) {
    browserUtils.addErrorLog(error, "setSyncStatus")
  }
  }
  /**
   * 判断配置是否相同
   * @param {object} config 
   * @param {boolean} alert 
   * @returns {boolean}
   */
  static isSameConfigWithLocal(config,alert = true){
  try {
    // MNUtil.copyJSON({remote:config,local:this.getAllConfig()})
    let same = this.deepEqual(config, this.getAllConfig())
    if (same && alert) {
      MNUtil.showHUD("Same config")
    }
    return same
  } catch (error) {

    return false
  }
  }
  /**
   * 只负责获取配置和检查配置格式是否正确,不负责检查版本
   * @param {string} syncSource 
   * @param {boolean} alert 
   * @returns 
   */
  static async getCloudConfigFromSource(syncSource,alert){
    try {
    let key = "MNBrowser_totalConfig"
    let config = undefined
    switch (syncSource) {
      case "None":
        return undefined
      case "iCloud":
        this.checkCloudStore(false)
        config = this.cloudStore.objectForKey(key)
        break;
      case "MNNote":
        let noteId = this.getConfig("syncNoteId")
        // if (!noteId.trim()) {
        //   return undefined
        // }
        let focusNote = MNNote.new(noteId)
        if (!focusNote) {
          focusNote = MNNote.getFocusNote()
        }
        if (!focusNote) {
          MNUtil.showHUD("Note not exists!")
          return undefined
        }
        if (focusNote.noteTitle !== "MN Browser Config") {
          MNUtil.showHUD("Invalid note title!")
          this.setSyncStatus(false)
          return undefined
        }
        let contentToParse = focusNote.excerptText
        if (/```JSON/.test(contentToParse)) {
          contentToParse = browserConfig.extractJSONFromMarkdown(contentToParse)
        }
        if (!MNUtil.isValidJSON(contentToParse)) {
          MNUtil.showHUD("Invalid Config")
          return undefined
        }
        config = JSON.parse(contentToParse)
        break;
      case "CFR2":
        if (!browserConfig.getConfig("r2file")) {
          MNUtil.showHUD("No Config file")
          return undefined
        }
        let hasPassword = await this.checkR2Password()
        if (!hasPassword) {
          MNUtil.showHUD("No Password")
          return undefined
        }
        if (alert) { MNUtil.showHUD("Downloading...") }
        config = await browserConfig.readEncryptedConfigFromR2(browserConfig.config.r2file, browserConfig.config.r2password)
        break;
      case "Infi":
        if (!browserConfig.getConfig("InfiFile")) {
          MNUtil.showHUD("No Config file")
          return undefined
        }

        let hasInfiPassword = await this.checkInfiPassword()
        if (!hasInfiPassword) {
          MNUtil.showHUD("No Password")
          return undefined
        }
        if (alert) { MNUtil.showHUD("Downloading...") }
        config = await browserConfig.readEncryptedConfigFromInfi(browserConfig.config.InfiFile, browserConfig.config.InfiPassword)
        break;
      case "Webdav":
        if (!browserConfig.getConfig("webdavFile")) {
          MNUtil.showHUD("No Config file")
          return undefined
        }
        let hasAccount = await this.checkWebdavAccount()
        if (!hasAccount) {
          MNUtil.showHUD("No Account")
          return undefined
        }
        if (alert) { MNUtil.showHUD("Downloading...") }
        let authorization = {
          user:browserConfig.getConfig("webdavUser"),
          password:browserConfig.getConfig("webdavPassword")
        }
        config = await browserConfig.readConfigFromWebdav(browserConfig.config.webdavFile+".json",authorization)
        if (!Object.keys(config).length || ("statusCode" in config && config.statusCode >= 400)) {
          MNUtil.showHUD("Error when getCloudConfig: "+config.statusCode)
          MNUtil.copyJSON(config)
          return undefined
        }
        break;
    }
    if (this.isValidTotalConfig(config)) {
      return config
    }
    return undefined
    } catch (error) {
      browserUtils.addErrorLog(error, "getCloudConfigFromSource",syncSource)
      return undefined
    }
  }
  static getLocalLatestTime(){
    let lastSyncTime = this.config.lastSyncTime ?? 0
    let modifiedTime = this.config.modifiedTime ?? 0
    return Math.max(lastSyncTime,modifiedTime)
  }
  static async import(alert = true,force = false){
    if (!browserUtils.checkSubscribe(true)) {
      return false
    }
    if (this.onSync) {
      if (alert) {
        MNUtil.showHUD("onSync")
      }
      return false
    }
    let syncSource = this.getConfig("syncSource")
    // if (syncSource === "iCloud") {
    //   return false
    // }
    this.setSyncStatus(true)
    // MNUtil.showHUD("Importing...")
    let config = await this.getCloudConfigFromSource(syncSource, alert)
    if (force) {
      // MNUtil.copy(typeof config)
      let success = this.importConfig(config)
      if (success) {
        if (alert) {
          MNUtil.showHUD("Import success!")
        }
        return true
      }else{
        MNUtil.showHUD("Invalid config in note!")
        return false
      }
    }
    // MNUtil.showHUD("Importing123...")

    if (!config || browserConfig.isSameConfigWithLocal(config,alert)) {
      this.setSyncStatus(false)
      return false
    }
    let localLatestTime = this.getLocalLatestTime()
    let cloudOldestTime = Math.min(config.config.lastSyncTime,config.config.modifiedTime)
    let confirm = true
    //导入前检查配置是否正确
    //即使云端最旧的时间也要比本地最新的时候更新,否则需要用户确认
    if (localLatestTime > cloudOldestTime && alert) {
      let OverWriteOption = "Overwrite?\n是否覆盖？"
      switch (syncSource) {
        case "None":
          return false
        case "iCloud":
          confirm = await MNUtil.confirm("MN Browser\nOlder config from iCloud!\niCloud配置较旧！",OverWriteOption)
          break;
        case "MNNote":
          confirm = await MNUtil.confirm("MN Browser\nOlder config from note!\n卡片配置较旧！",OverWriteOption)
          break;
        case "CFR2":
          confirm = await MNUtil.confirm("MN Browser\nOlder config from R2!\nR2配置较旧！",OverWriteOption)
          break;
        case "Infi":
          confirm = await MNUtil.confirm("MN Browser\nOlder config from InfiniCloud!\nInfiniCloud配置较旧！","Overwrite local config?\n是否覆盖本地配置？")
          break;
        case "Webdav":
          confirm = await MNUtil.confirm("MN Browser\nOlder config from Webdav!\nWebdav配置较旧！","Overwrite local config?\n是否覆盖本地配置？")
          break;
      }
    }
    if (!confirm) {
      this.setSyncStatus(false)
      return false
    }

    let success = this.importConfig(config)
    if (success) {
      if (alert) {
        MNUtil.showHUD("Import success!")
      }
      return true
    }else{
      MNUtil.showHUD("Invalid config in note!")
      return false
    }
  }
  static async export(alert = true,force = false){
  try {
    
    if (!browserUtils.checkSubscribe(true)) {
      return false
    }
    if (this.onSync) {
      MNUtil.showHUD("onSync")
      return
    }
    let syncSource = this.getConfig("syncSource")
    this.setSyncStatus(true)
    if (force) {
      switch (syncSource) {
        case "None":
          this.setSyncStatus(false,false)
          return false
        case "iCloud":
          let success = this.writeCloudConfig(true,true)
          this.setSyncStatus(false,success)
          return;
        case "MNNote":
          let noteId = this.getConfig("syncNoteId")
          let latestTime = this.getLocalLatestTime()
          let focusNote = MNNote.new(noteId)
          if (!focusNote) {
            focusNote = MNUtil.getFocusNote()
          }
          if (!focusNote) {
            this.setSyncStatus(false)
            MNUtil.showHUD("No focus note")
            return false
          }
          let modifiedDate = Date.parse(focusNote.modifiedDate ?? focusNote.createDate)
          let confirm = false
          if (latestTime > modifiedDate) {
            confirm = true
          }else{
            if (alert) {
              confirm = await MNUtil.confirm("MN Browser\nNewer config from note!\n卡片配置较新！","Overwrite?\n是否覆盖？")
            }
          }
          if (!confirm) {
            this.setSyncStatus(false)
            return false
          }
          this.config.lastSyncTime = Date.now()+5
          // this.config.modifiedTime = this.config.lastSyncTime
          this.config.syncNoteId = focusNote.noteId
          this.export2MNNote(focusNote)
          this.setSyncStatus(false,true)
          return true
        case "CFR2":
          this.setSyncStatus(true)
          this.config.lastSyncTime = Date.now()+5
          // this.config.modifiedTime = this.config.lastSyncTime
          if (alert) {
            MNUtil.showHUD("Uploading...")
          }
          await browserConfig.uploadConfigWithEncryptionFromR2(this.config.r2file, this.config.r2password, alert)
          // MNUtil.copyJSON(this.config)
          this.setSyncStatus(false,true)
          return true
        case "Infi":
          this.setSyncStatus(true)
          this.config.lastSyncTime = Date.now()+5
          // this.config.modifiedTime = this.config.lastSyncTime
          if (alert) {
            MNUtil.showHUD("Uploading...")
          }
          await browserConfig.uploadConfigWithEncryptionToInfi(this.config.InfiFile, this.config.InfiPassword, alert)
          // MNUtil.copyJSON(this.config)
          this.setSyncStatus(false,true)
          return true
        case "Webdav":
        try {
          this.setSyncStatus(true)
          this.config.lastSyncTime = Date.now()+5
          // this.config.modifiedTime = this.config.lastSyncTime
          if (alert) {
            MNUtil.showHUD("Uploading...")
          }
          let authorization = {
            user:this.getConfig("webdavUser"),
            password:this.getConfig("webdavPassword")
          }
          let res = await browserConfig.uploadConfigToWebdav(this.config.webdavFile+".json", authorization)
          if (typeof res === "object" && "statusCode" in res && res.statusCode >= 400) {
            MNUtil.showHUD("Error when export.uploadConfigToWebdav: "+res.statusCode)
            MNUtil.copyJSON(res)
            this.setSyncStatus(false)
            return false
          }
          // MNUtil.copyJSON(this.config)
          this.setSyncStatus(false,true)
          return true
        } catch (error) {
          MNUtil.showHUD(error)
          this.setSyncStatus(false,false)
          return true
        }
      }
      return true
    }
    let remoteConfig = await this.getCloudConfigFromSource(syncSource, alert)
    if (remoteConfig && this.isSameConfigWithLocal(remoteConfig,alert)) {
      this.setSyncStatus(false)
      return false
    }
    switch (syncSource) {
      case "None":
        this.setSyncStatus(false,false)
        return false
      case "iCloud":
        let success = this.writeCloudConfig(false,true)
        this.setSyncStatus(false,success)
        return;
      case "MNNote":
        let noteId = this.getConfig("syncNoteId")
        let latestTime = this.getLocalLatestTime()
        let focusNote = MNNote.new(noteId)
        if (!focusNote) {
          focusNote = MNNote.getFocusNote()
        }
        if (!focusNote) {
          this.setSyncStatus(false)
          MNUtil.showHUD("No focus note")
          return false
        }
        let modifiedDate = Date.parse(focusNote.modifiedDate ?? focusNote.createDate)
        let confirm = false
        if (latestTime > modifiedDate) {
          confirm = true
        }else{
          if (alert) {
            confirm = await MNUtil.confirm("MN Browser\nNewer config from note!\n卡片配置较新！","Overwrite?\n是否覆盖？")
          }
        }
        if (!confirm) {
          this.setSyncStatus(false)
          return false
        }
        this.config.lastSyncTime = Date.now()+5
        // this.config.modifiedTime = this.config.lastSyncTime
        this.config.syncNoteId = focusNote.noteId
        this.export2MNNote(focusNote)
        this.setSyncStatus(false,true)
        return true
      case "CFR2":
        this.setSyncStatus(true)
        if (remoteConfig && remoteConfig.config && remoteConfig.config.modifiedTime > this.config.modifiedTime) {
          if (alert) {
            let confirm = await MNUtil.confirm("MN Browser\nNewer config from R2!\nR2配置较新！","Overwrite remote config?\n是否覆盖远程配置？")
            if (!confirm) {
              this.setSyncStatus(false)
              return false
            }
          }else{
            this.setSyncStatus(false)
            return false
          }
        }
        this.config.lastSyncTime = Date.now()+5
        // this.config.modifiedTime = this.config.lastSyncTime
        if (alert) {
          MNUtil.showHUD("Uploading...")
        }
        await browserConfig.uploadConfigWithEncryptionFromR2(this.config.r2file, this.config.r2password, alert)
        // MNUtil.copyJSON(this.config)
        this.setSyncStatus(false,true)
        return true
      case "Infi":
        this.setSyncStatus(true)
        if (remoteConfig && remoteConfig.config && remoteConfig.config.modifiedTime > this.config.modifiedTime) {
          if (alert) {
            let confirm = await MNUtil.confirm("MN Browser\nNewer config from InfiniCloud!\nInfiniCloud配置较新！","Overwrite remote config?\n是否覆盖远程配置？")
            if (!confirm) {
              this.setSyncStatus(false)
              return false
            }
          }else{
            this.setSyncStatus(false)
            return false
          }
        }
        this.config.lastSyncTime = Date.now()+5
        // this.config.modifiedTime = this.config.lastSyncTime
        if (alert) {
          MNUtil.showHUD("Uploading...")
        }
        await browserConfig.uploadConfigWithEncryptionToInfi(this.config.InfiFile, this.config.InfiPassword, alert)
        // MNUtil.copyJSON(this.config)
        this.setSyncStatus(false,true)
        return true
      case "Webdav":
      try {
        this.setSyncStatus(true)
        if (!Object.keys(remoteConfig).length || ("statusCode" in remoteConfig && (remoteConfig.statusCode >= 400 && remoteConfig.statusCode != 404 ))) {
          // chatAIUtils.addErrorLog(error, "export",remoteConfig.statusCode)
          MNUtil.showHUD("Error when export.readConfigFromWebdav: "+remoteConfig.statusCode)
          // MNUtil.copyJSON(remoteConfig)
          this.setSyncStatus(false)
          return false
        }
        if (remoteConfig && remoteConfig.config && remoteConfig.config.modifiedTime > this.config.modifiedTime) {
          if (alert) {
            let confirm = await MNUtil.confirm("MN Browser\nNewer config from Webdav!\nWebdav配置较新！","Overwrite remote config?\n是否覆盖远程配置？")
            if (!confirm) {
              this.setSyncStatus(false)
              return false
            }
          }else{
            this.setSyncStatus(false)
            return false
          }
        }

        this.config.lastSyncTime = Date.now()+5
        // this.config.modifiedTime = this.config.lastSyncTime
        if (alert) {
          MNUtil.showHUD("Uploading...")
        }
        let authorization = {
          user:this.getConfig("webdavUser"),
          password:this.getConfig("webdavPassword")
        }
        let res = await browserConfig.uploadConfigToWebdav(this.config.webdavFile+".json", authorization)
        if (typeof res === "object" && "statusCode" in res && res.statusCode >= 400) {
          MNUtil.showHUD("Error when export.uploadConfigToWebdav: "+res.statusCode)
          MNUtil.copyJSON(res)
          this.setSyncStatus(false)
          return false
        }
        // MNUtil.copyJSON(this.config)
        this.setSyncStatus(false,true)
        return true
      } catch (error) {
        MNUtil.showHUD(error)
        this.setSyncStatus(false,false)
        return true
      }
    }
    return true
  } catch (error) {
    browserUtils.addErrorLog(error, "export")
  }
    // MNUtil.copyJSON(config)
  }
  static saveAfterImport(){
    this.save("MNBrowser_dynamic",true)
    this.save("MNBrowser_engine",true)
    this.save("MNBrowser_entries",true)
    this.save("MNBrowser_entrieNames",true)
    this.save("MNBrowser_searchOrder",true)
    this.save("MNBrowser_toolbar",true)
    this.save("MNBrowser_webAppEntries",true)
    this.save("MNBrowser_webAppEntrieNames",true)
    this.save("MNBrowser_config",true)
  }
  static async sync(){
 try {
  

    if (!browserUtils.checkSubscribe(true)) {
      return false
    }
    let noteId = this.config.syncNoteId
    let lastSyncTime = this.config.lastSyncTime ?? 0
    let modifiedTime = this.config.modifiedTime ?? 0
    let latestTime = Math.max(lastSyncTime,modifiedTime)
    let focusNote = MNUtil.getNoteById(noteId)
    if (!focusNote) {
      focusNote = MNNote.getFocusNote()
    }
    let isVaildNoteConfig = false
    let noteConfig
    let modifiedDate = Date.parse(focusNote.modifiedDate ?? focusNote.createDate)
    if (focusNote.noteTitle === "MN Browser Config") {
      let contentToParse = focusNote.excerptText
      if (/```JSON/.test(contentToParse)) {
        contentToParse = browserUtils.extractJSONFromMarkdown(contentToParse)
      }
      noteConfig = JSON.parse(contentToParse)
      isVaildNoteConfig = ("config" in noteConfig 
    && "entries" in noteConfig 
    && "entrieNames" in noteConfig 
    && "webAppEntries" in noteConfig 
    && "webAppEntrieNames" in noteConfig 
    && "searchOrder" in noteConfig
    && "dynamic" in noteConfig
    && "engine" in noteConfig
    && "toolbar" in noteConfig
    )
      
    }
    if (latestTime < modifiedDate && isVaildNoteConfig) {
      // MNUtil.showHUD("should import")
      this.config = noteConfig.config
      this.config.lastSyncTime = Date.now()
      this.entries = noteConfig.entries
      this.entrieNames = noteConfig.entrieNames
      this.webAppEntries = noteConfig.webAppEntries
      this.webAppEntrieNames = noteConfig.webAppEntrieNames
      this.searchOrder = noteConfig.searchOrder
      this.dynamic = noteConfig.dynamic
      this.engine = noteConfig.engine
      this.toolbar = noteConfig.toolbar

      this.save("MNBrowser_config",true)
      this.save("MNBrowser_webAppEntries",true)
      this.save("MNBrowser_webAppEntrieNames",true)
      this.save("MNBrowser_entries",true)
      this.save("MNBrowser_entrieNames",true)
      this.save("MNBrowser_searchOrder",true)
      this.save("MNBrowser_dynamic",true)
      this.save("MNBrowser_engine",true)
      this.save("MNBrowser_toolbar",true)
      MNUtil.showHUD("Sync Success (import)!")
      return true
    }else{
      // MNUtil.showHUD("should export")
      this.config.lastSyncTime = Date.now()+5
      this.config.syncNoteId = focusNote.noteId
      let config = {
        config:this.config,
        entries:this.entries,
        entrieNames:this.entrieNames,
        webAppEntries:this.webAppEntries,
        webAppEntrieNames:this.webAppEntrieNames,
        searchOrder:this.searchOrder,
        dynamic:this.dynamic,
        engine:this.engine,
        toolbar:this.toolbar
      }
      MNUtil.undoGrouping(()=>{
        focusNote.excerptText = "```JSON\n"+JSON.stringify(config,null,2)+"\n```"
        focusNote.noteTitle = "MN Browser Config"
        focusNote.note.excerptTextMarkdown = true
      })
      MNUtil.showHUD("Sync Success (export)!")
      return true
    }
 } catch (error) {
  MNUtil.showHUD(error)
 }
 }
   /**
   * 
   * @param {MNNote} focusNote 
   */
  static export2MNNote(focusNote){
    this.config.lastSyncTime = Date.now()+5
    this.config.syncNoteId = focusNote.noteId
    let config = this.getAllConfig()
    MNUtil.undoGrouping(()=>{
      focusNote.excerptText = "```JSON\n"+JSON.stringify(config,null,2)+"\n```"
      focusNote.noteTitle = "MN Browser Config"
      focusNote.excerptTextMarkdown = true
    })
  }



}
function strCode(str) {  //获取字符串的字节数
    var count = 0;  //初始化字节数递加变量并获取字符串参数的字符个数
    var cn = [8211, 8212, 8216, 8217, 8220, 8221, 8230, 12289, 12290, 12296, 12297, 12298, 12299, 12300, 12301, 12302, 12303, 12304, 12305, 12308, 12309, 65281, 65288, 65289, 65292, 65294, 65306, 65307, 65311]
    var half = [32, 33, 34, 35, 36, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 123, 124, 125, 126,105,108,8211]
    if (str) {  //如果存在字符串，则执行
        len = str.length; 
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


function getWebJS(id) {
  switch (id) {
    case "updateDeeplOffset":
      return `document.getElementsByClassName("dl_header")[0].style.display="none";
        document.getElementsByClassName("lmt__docTrans-tab-container")[0].style.display="none";
        document.getElementsByClassName("lmt__sides_container")[0].style.margin = 0;
        document.querySelector("#dl_translator").style.cssText = "padding-top: 20px";
        document.getElementsByClassName("lmt__language_container")[0].style.display = "none";
        document.getElementsByClassName("lmt__language_container")[1].style.display = "none";
        document.getElementsByClassName("lmt__target_toolbar")[0].style.display = "none";
        document.querySelector("#dl_cookieBanner").style.display="none";
        document.querySelector("#lmt_quotes_article").style.display="none";
        document.querySelector("#lmt__dict").style.margin = 0;
        document.querySelector("#lmt_pro_ad_container").style.display = "none";
        document.querySelector("body > div.dl_footerV2_container").style.display = "none";`
    case "updateThesaurusOffset":
      return `document.getElementsByTagName("header")[0].style.display = "none"
        document.getElementsByTagName("section")[0].style.display = "none"
        document.getElementsByTagName("section")[6].style.display = "none"
        document.getElementsByTagName("section")[7].style.display = "none"
        document.getElementsByTagName("section")[8].style.display = "none"
        document.getElementsByTagName("section")[9].style.display = "none"
        document.getElementsByTagName("p")[5].style.display = "none"
        document.getElementsByClassName("acw ac-widget-placeholder ac-reset")[0].style.display = "none"`
    case "updateBilibiliOffset":
      return `
      document.getElementsByClassName("v-popover-wrap")[0].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[1].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[2].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[3].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[4].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[5].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[6].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[8].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[10].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[11].style.display = "none";
      document.getElementsByClassName("v-popover-wrap")[13].style.display = "none";
      document.getElementsByClassName("recommended-swipe grid-anchor")[0].style.display = "none";
      `
    default:
      return ""
  }
}


function postNotification(name,userInfo) {
  let focusWindow = Application.sharedInstance().focusWindow
  NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(name, focusWindow, userInfo)
  
}