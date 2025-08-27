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
  /**
   * 
   * @param {UIWebView} webview 
   * @param {number} width 
   * @returns {Promise<NSData>}
   */
  static async screenshot(webview,width=1000){
    return new Promise((resolve, reject) => {
      webview.takeSnapshotWithWidth(2000,(snapshot)=>{
        try {
        resolve(snapshot.pngData())
        } catch (error) {
          MNUtil.showHUD(error)
        }
      })
    })
  }
  static getNoteCSS(focusNote){
    let noteColor = snipasteUtils.getNoteColor(focusNote.colorIndex)
    let textColor = snipasteUtils.getTextColor()
    let backgroundColor = snipasteUtils.getBackgroundColor()
    let themeHtml = `      
    body{
      background-color: ${backgroundColor};
    }`
    let CSS = `      ${themeHtml}
      .body {
        border: 3px solid ${noteColor};
        border-radius: 10px 10px 10px 10px;
        font-size: large;
      }
    .audioContainer {
      width: 100%;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 8px;
    }

    audio {
      width: 100%;
      display: block;
    }
        .language-mermaid {
            /* width: 100%; */
            /* height: 100%; */
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0px; 
            box-sizing: border-box;
        }
        .language-mermaid svg {
            /* * SVG 在 viewBox 属性的帮助下，会保持其原始长宽比，
             * 同时缩放到适应这个 100% 的容器尺寸。
             */
            width: 100%;
            height: calc(100% - 40px);
        }
      .link {
        white-space: pre-wrap;
        border-radius: 5px;
        background-color: ${noteColor};
        text-decoration: none;
      }
      .head {
        background-color: ${noteColor};
        border-radius: 6px 6px 0px 0px;
        line-height: 30px;
      }
      img {
        width: 100%;
      }
      .tail {
        height: 10px;
      }
      .title {
        padding-left: 10px;
        padding-bottom: 5px;
        cursor: grab;
        -webkit-text-fill-color: ${textColor};
      }
      .excerpt {
        white-space: pre-line;
        padding-left: 5px;;
        padding-right: 5px;
        cursor: grab;
        -webkit-text-fill-color: ${textColor};
      }
      .comment {
        padding-left: 10px;
        padding-right: 10px;
        cursor: grab;
        -webkit-text-fill-color: ${textColor};
      }
      .MathJax{
        color: ${textColor} !important;
      }
      .markdown {
        white-space: normal;
        padding-left: 5px;
      }
      .markdown ol{
        padding-left: 20px;
      }
      .linkToNote{
        background-color: rgb(162, 162, 162,20%);
        border-radius: 10px;
        padding: 10px;
        padding-left: 8px;
        margin-bottom: 10px;
      }
      .buttonContainer{
        margin-bottom: 5px;
      }`
    return CSS
  }
  static isPureHTMLComment(focusNote){
    if (!focusNote.excerptText && focusNote.comments.length === 1 && focusNote.comments[0].type === "HtmlNote") {
      return true
    }
    return false
  }
  static getNoteColor(colorIndex){
    let theme = MNUtil.app.currentTheme
    let colorConfig = {
      Default:["#ffffb4","#ccfdc4","#b4d1fb","#f3aebe","#ffff54","#75fb4c","#55bbf9","#ea3323","#ef8733","#377e47","#173dac","#be3223","#ffffff","#dadada","#b4b4b4","#bd9edc"],
      Dark:["#a0a071","#809f7b","#71839e","#986d77","#a0a032","#479e2c","#33759c","#921c12","#96551c","#204f2c","#0c266c","#771e14","#a0a0a0","#898989","#717171","#77638a"],
      Gary:["#d2d294","#a8d1a1","#94accf","#c88f9d","#d2d244","#5fcf3d","#459acd","#c0281b","#c46f28","#2c683a","#12328e","#9c281c","#d2d2d2","#b4b4b4","#949494","#9c82b5"]
    }
    let colorHexes = (theme in colorConfig)?colorConfig[theme]:colorConfig["Default"]
    if (colorIndex !== undefined && colorIndex >= 0) {
      return colorHexes[colorIndex]
    }
    return "#ffffff"
  }
  static getBackgroundColor(){
    let theme = MNUtil.app.currentTheme
    switch (theme) {
      case "Gray":
        return "#414141"
      case "Dark":
        return "#121212"
      default:
        return "#ffffff"
    }
  }
  static getTextColor(){
    let theme = MNUtil.app.currentTheme
    switch (theme) {
      case "Gray":
        return "#ffffff"
      case "Dark":
        return "rgb(233, 232, 232)"
      default:
        return "#000000"
    }
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
                  window.location.href = 'snipaste://showhud?message='+encodeURIComponent('加载失败'+url)
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
                window.location.href = 'snipaste://showhud?message='+encodeURIComponent('加载失败'+url)
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
                window.location.href = 'snipaste://showhud?message=库尚未加载完成，请稍后再试'
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
            window.location.href = 'snipaste://copyimage?image='+image
        }
        
        `

}
/**
 * 
 * @param {string} content 
 * @returns {string}
 */
static getFullMermaindHTML(content) {
  // 对 content 中的反引号和反斜杠进行转义，以安全地插入到 <script> 块中
  const escapedContent = content
    .replace(/\\/g, '\\\\') // 1. 转义反斜杠
    .replace(/`/g, '\\`')   // 2. 转义反引号
    .replace(/\$/g, '\\$');  // 3. 转义美元符号
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>自适应大小的 Mermaid 图表</title>
    <script src="https://vip.123pan.cn/1836303614/dl/cdn/mermaid.js" defer></script>
    <style>
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden; 
        }

        #mermaid-container {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px; 
            box-sizing: border-box;
        }

        #mermaid-container svg {
            /* * SVG 在 viewBox 属性的帮助下，会保持其原始长宽比，
             * 同时缩放到适应这个 100% 的容器尺寸。
             */
            width: 100%;
            height: 100%;
        }
        /* 加载容器样式 */
        .loading-container {
            text-align: center;
        }

        /* 旋转动画 */
        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #ccc; /* 圈的颜色 */
            border-top: 5px solid #3498db; /* 旋转部分的颜色 */
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px auto; /* 居中并与文字拉开距离 */
        }

        /* 定义旋转动画 */
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* “loading” 文字样式 */
        .loading-text {
            font-size: 20px;
            color: #555;
        }
    </style>
</head>
<body>

    <div id="mermaid-container">
      <div class="loading-container">
          <div class="spinner"></div>
          <div class="loading-text">loading</div>
      </div>
    </div>

    <script>
      // 监听 DOMContentLoaded 事件
      document.addEventListener('DOMContentLoaded', function () {

        mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict'
        });

        // 尝试使用一个更复杂的图表来观察缩放效果
        const mermaidContent = \`${escapedContent}\`;

        const container = document.getElementById('mermaid-container');

        mermaid.render('mermaid-graph', mermaidContent).then(({ svg, bind }) => {
            
            container.innerHTML = svg;
            const svgElement = container.querySelector('svg');

            if (svgElement) {
                // 移除这些属性，让 CSS 来控制大小
                svgElement.removeAttribute('width');
                svgElement.removeAttribute('height');
                svgElement.removeAttribute('style');
            }
            
            if (bind) {
                bind(container);
            }
        });
      })
    </script>
</body>
</html>`
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
    MNUtil.log({
      type:"MN Snipaste Error ("+source+"): "+error,
      source:"MN Snipaste",
      detail:tem
    })
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