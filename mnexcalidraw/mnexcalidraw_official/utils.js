// 定义一个类
class excalidrawUtils {
  static init(mainPath){
    this.mainPath = mainPath
    this.screenImage = MNUtil.getImage(mainPath + `/screen.png`)
    this.linkImage = MNUtil.getImage(mainPath + `/link.png`)
    this.homeImage = MNUtil.getImage(mainPath + `/home.png`)
    this.goforwardImage = MNUtil.getImage(mainPath + `/goforward.png`)
    this.gobackImage = MNUtil.getImage(mainPath + `/goback.png`)
    this.reloadImage = MNUtil.getImage(mainPath + `/reload.png`,1.5)
    this.stopImage = MNUtil.getImage(mainPath + `/stop.png`)
    this.webappImage = MNUtil.getImage(mainPath + `/webapp.png`)
    this.locImage = MNUtil.getImage(mainPath + `/loc.png`)
    this.opacityImage = MNUtil.getImage(mainPath + `/opacity.png`)
    this.themeImage = MNUtil.getImage(mainPath + `/theme.png`)
    this.zoomImage = MNUtil.getImage(mainPath + `/zoom.png`)
    this.logo = MNUtil.getImage(mainPath + `/logo.png`)
    this.robotImage = MNUtil.getImage(mainPath + `/robot.png`,1.8)
  }
  static showHUD(message,duration=2) {
    let app = Application.sharedInstance()
    app.showHUD(message,app.focusWindow,duration)
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
      this.showHUD("MN Excalidraw: Please install 'MN Utils' first!",5)
    }
    return folderExist
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
   * 
   * @returns {Boolean}
   */
  static checkSubscribe(count = true){
    // return true
    if (typeof subscriptionConfig !== 'undefined') {
      let res = subscriptionConfig.checkSubscribed(count)
      return res
    }else{
      this.showHUD("Please install 'MN Utils' first!")
      return false
    }
  }
  static checkSender(sender,window){
    return MNUtil.app.checkNotifySenderInWindow(sender, window)
  }
  static setFrame(controller,x,y,width,height){
    if (typeof x === "object") {
      controller.view.frame = x
    }else{
      controller.view.frame = MNUtil.genFrame(x, y, width, height)
    }
    controller.currentFrame = controller.view.frame
  }
  static async delay (seconds) {
    return new Promise((resolve, reject) => {
      NSTimer.scheduledTimerWithTimeInterval(seconds, false, function () {
        resolve()
      })
    })
  }
  static async checkMNUtil(alert = false,delay = 0.01){
    if (typeof MNUtil === 'undefined') {//如果MNUtil未被加载，则执行一次延时，然后再检测一次
      //仅在MNUtil未被完全加载时执行delay
      await excalidrawUtils.delay(delay)
      if (typeof MNUtil === 'undefined') {
        if (alert) {
          excalidrawUtils.showHUD("MN Excalidraw: Please install 'MN Utils' first!",5)
        }
        return false
      }
    }
    return true
  }
    /**
   * 
   * @param {MbBookNote} note 
   * @returns 
   */
  static getImageFromNote(note) {
    if (note.excerptPic) {
      return MNUtil.getMediaByHash(note.excerptPic.paint)
    }
    if (note.comments.length) {
      let imageData = undefined
      for (let i = 0; i < note.comments.length; i++) {
        const comment = note.comments[i];
        if (comment.type === 'PaintNote' && comment.paint) {
          imageData = MNUtil.getMediaByHash(comment.paint)
          break
        }
      }
      if (imageData) {
        return imageData
      }
    }
    return undefined
  }
}
class excalidrawConfig{
  static defaultEntries = {
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
  static defaultWebAppEntries = {
      Bilibili:         { title: '📺 Bilibili',       symbol: "📺", engine: "Bilibili", desktop:true, link: "https://www.bilibili.com" },
      Notion:           { title: '📝 Notion',         symbol: "📝", engine: "Notion",   desktop:false, link: "https://www.notion.so" },
      Wolai:            { title: '📝 Wolai',          symbol: "📝", engine: "Wolai",    desktop:false, link: "https://www.wolai.com" },    
      Craft:            { title: '📝 Craft',          symbol: "📝", engine: "Craft",    desktop:false, link: "https://docs.craft.do" },
      Flomo:            { title: '📝 Flomo',          symbol: "📝", engine: "Flomo",    desktop:false, link: "https://v.flomoapp.com/mine" },
      Flowus:           { title: '📝 Flowus',         symbol: "📝", engine: "Flowus",   desktop:false, link: "https://flowus.cn" },
      Yinian:           { title: '📝 Yinian',         symbol: "📝", engine: "Yinian",   desktop:true, link: "https://www.yinian.pro/note/" },
      Baiduyun:         { title: '☁️ Baiduyun',        symbol: "☁️", engine: "Baidu",    desktop:true, link: "https://pan.baidu.com/disk/main#/index?category=all" },
    }
  static init(){
    this.entries = this.defaultEntries
    this.entrieNames = Object.keys(this.entries)
    this.webAppEntries = this.defaultWebAppEntries
    this.webAppEntrieNames = Object.keys(this.webAppEntries)
    this.toolbar = true
    this.dynamic = false
    this.engine = "Bing"
    this.searchOrder         = [2,1,3]
  }
  static getByDefault(key,defaultValue) {
    let value = NSUserDefaults.standardUserDefaults().objectForKey(key)
    if (value === undefined) {
      // NSUserDefaults.standardUserDefaults().setObjectForKey(defaultValue,key)
      return defaultValue
    }
    return value
  }
  static remove(key){
    NSUserDefaults.standardUserDefaults().removeObjectForKey(key)
  }
  static save(key){
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