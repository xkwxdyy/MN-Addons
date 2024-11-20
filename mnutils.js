/**
 * 夏大鱼羊 - 字符串函数 - begin
 */
// https://github.com/vinta/pangu.js
// CJK is short for Chinese, Japanese, and Korean.
//
// CJK includes following Unicode blocks:
// \u2e80-\u2eff CJK Radicals Supplement
// \u2f00-\u2fdf Kangxi Radicals
// \u3040-\u309f Hiragana
// \u30a0-\u30ff Katakana
// \u3100-\u312f Bopomofo
// \u3200-\u32ff Enclosed CJK Letters and Months
// \u3400-\u4dbf CJK Unified Ideographs Extension A
// \u4e00-\u9fff CJK Unified Ideographs
// \uf900-\ufaff CJK Compatibility Ideographs
//
// For more information about Unicode blocks, see
// http://unicode-table.com/en/
// https://github.com/vinta/pangu
//
// all J below does not include \u30fb
const CJK =
  "\u2e80-\u2eff\u2f00-\u2fdf\u3040-\u309f\u30a0-\u30fa\u30fc-\u30ff\u3100-\u312f\u3200-\u32ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff"
// ANS is short for Alphabets, Numbers, and Symbols.
//
// A includes A-Za-z\u0370-\u03ff
// N includes 0-9
// S includes `~!@#$%^&*()-_=+[]{}\|;:'",<.>/?
//
// some S below does not include all symbols
// the symbol part only includes ~ ! ; : , . ? but . only matches one character
const CONVERT_TO_FULLWIDTH_CJK_SYMBOLS_CJK = new RegExp(
  `([${CJK}])[ ]*([\\:]+|\\.)[ ]*([${CJK}])`,
  "g"
)
const CONVERT_TO_FULLWIDTH_CJK_SYMBOLS = new RegExp(
  `([${CJK}])[ ]*([~\\!;,\\?]+)[ ]*`,
  "g"
)
const DOTS_CJK = new RegExp(`([\\.]{2,}|\u2026)([${CJK}])`, "g")
const FIX_CJK_COLON_ANS = new RegExp(`([${CJK}])\\:([A-Z0-9\\(\\)])`, "g")
// the symbol part does not include '
const CJK_QUOTE = new RegExp(`([${CJK}])([\`"\u05f4])`, "g")
const QUOTE_CJK = new RegExp(`([\`"\u05f4])([${CJK}])`, "g")
const FIX_QUOTE_ANY_QUOTE = /([`"\u05f4]+)[ ]*(.+?)[ ]*([`"\u05f4]+)/g
const CJK_SINGLE_QUOTE_BUT_POSSESSIVE = new RegExp(`([${CJK}])('[^s])`, "g")
const SINGLE_QUOTE_CJK = new RegExp(`(')([${CJK}])`, "g")
const FIX_POSSESSIVE_SINGLE_QUOTE = new RegExp(
  `([A-Za-z0-9${CJK}])( )('s)`,
  "g"
)
const HASH_ANS_CJK_HASH = new RegExp(
  `([${CJK}])(#)([${CJK}]+)(#)([${CJK}])`,
  "g"
)
const CJK_HASH = new RegExp(`([${CJK}])(#([^ ]))`, "g")
const HASH_CJK = new RegExp(`(([^ ])#)([${CJK}])`, "g")
// the symbol part only includes + - * / = & | < >
const CJK_OPERATOR_ANS = new RegExp(
  `([${CJK}])([\\+\\-\\*\\/=&\\|<>])([A-Za-z0-9])`,
  "g"
)
const ANS_OPERATOR_CJK = new RegExp(
  `([A-Za-z0-9])([\\+\\-\\*\\/=&\\|<>])([${CJK}])`,
  "g"
)
const FIX_SLASH_AS = /([/]) ([a-z\-_\./]+)/g
const FIX_SLASH_AS_SLASH = /([/\.])([A-Za-z\-_\./]+) ([/])/g
// the bracket part only includes ( ) [ ] { } < > “ ”
const CJK_LEFT_BRACKET = new RegExp(`([${CJK}])([\\(\\[\\{<>\u201c])`, "g")
const RIGHT_BRACKET_CJK = new RegExp(`([\\)\\]\\}<>\u201d])([${CJK}])`, "g")
const FIX_LEFT_BRACKET_ANY_RIGHT_BRACKET =
  /([\(\[\{<\u201c]+)[ ]*(.+?)[ ]*([\)\]\}>\u201d]+)/
const ANS_CJK_LEFT_BRACKET_ANY_RIGHT_BRACKET = new RegExp(
  `([A-Za-z0-9${CJK}])[ ]*([\u201c])([A-Za-z0-9${CJK}\\-_ ]+)([\u201d])`,
  "g"
)
const LEFT_BRACKET_ANY_RIGHT_BRACKET_ANS_CJK = new RegExp(
  `([\u201c])([A-Za-z0-9${CJK}\\-_ ]+)([\u201d])[ ]*([A-Za-z0-9${CJK}])`,
  "g"
)
const AN_LEFT_BRACKET = /([A-Za-z0-9])([\(\[\{])/g
const RIGHT_BRACKET_AN = /([\)\]\}])([A-Za-z0-9])/g
const CJK_ANS = new RegExp(
  `([${CJK}])([A-Za-z\u0370-\u03ff0-9@\\$%\\^&\\*\\-\\+\\\\=\\|/\u00a1-\u00ff\u2150-\u218f\u2700—\u27bf])`,
  "g"
)
const ANS_CJK = new RegExp(
  `([A-Za-z\u0370-\u03ff0-9~\\$%\\^&\\*\\-\\+\\\\=\\|/!;:,\\.\\?\u00a1-\u00ff\u2150-\u218f\u2700—\u27bf])([${CJK}])`,
  "g"
)
const S_A = /(%)([A-Za-z])/g
const MIDDLE_DOT = /([ ]*)([\u00b7\u2022\u2027])([ ]*)/g
const BACKSAPCE_CJK = new RegExp(`([${CJK}]) ([${CJK}])`, "g")
const SUBSCRIPT_CJK = /([\u2080-\u2099])(?=[\u4e00-\u9fa5])/g
// 上标 https://rupertshepherd.info/resource_pages/superscript-letters-in-unicode
const SUPERSCRIPT_CJK = /([\u2070-\u209F\u1D56\u1D50\u207F\u1D4F\u1D57])(?=[\u4e00-\u9fa5])/g
// 特殊字符
// \u221E: ∞
const SPECIAL = /([\u221E])(?!\s|[\(\[])/g  // (?!\s) 是为了当后面没有空格才加空格，防止出现多个空格
class Pangu {
  version
  static convertToFullwidth(symbols) {
    return symbols
      .replace(/~/g, "～")
      .replace(/!/g, "！")
      .replace(/;/g, "；")
      .replace(/:/g, "：")
      .replace(/,/g, "，")
      .replace(/\./g, "。")
      .replace(/\?/g, "？")
  }
  static toFullwidth(text) {
    let newText = text
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this
    newText = newText.replace(
      CONVERT_TO_FULLWIDTH_CJK_SYMBOLS_CJK,
      (match, leftCjk, symbols, rightCjk) => {
        const fullwidthSymbols = that.convertToFullwidth(symbols)
        return `${leftCjk}${fullwidthSymbols}${rightCjk}`
      }
    )
    newText = newText.replace(
      CONVERT_TO_FULLWIDTH_CJK_SYMBOLS,
      (match, cjk, symbols) => {
        const fullwidthSymbols = that.convertToFullwidth(symbols)
        return `${cjk}${fullwidthSymbols}`
      }
    )
    return newText
  }
  static spacing(text) {
    let newText = text
    // https://stackoverflow.com/questions/4285472/multiple-regex-replace
    newText = newText.replace(DOTS_CJK, "$1 $2")
    newText = newText.replace(FIX_CJK_COLON_ANS, "$1：$2")
    newText = newText.replace(CJK_QUOTE, "$1 $2")
    newText = newText.replace(QUOTE_CJK, "$1 $2")
    newText = newText.replace(FIX_QUOTE_ANY_QUOTE, "$1$2$3")
    newText = newText.replace(CJK_SINGLE_QUOTE_BUT_POSSESSIVE, "$1 $2")
    newText = newText.replace(SINGLE_QUOTE_CJK, "$1 $2")
    newText = newText.replace(FIX_POSSESSIVE_SINGLE_QUOTE, "$1's") // eslint-disable-line quotes
    newText = newText.replace(HASH_ANS_CJK_HASH, "$1 $2$3$4 $5")
    newText = newText.replace(CJK_HASH, "$1 $2")
    newText = newText.replace(HASH_CJK, "$1 $3")
    newText = newText.replace(CJK_OPERATOR_ANS, "$1 $2 $3")
    newText = newText.replace(ANS_OPERATOR_CJK, "$1 $2 $3")
    newText = newText.replace(FIX_SLASH_AS, "$1$2")
    newText = newText.replace(FIX_SLASH_AS_SLASH, "$1$2$3")
    newText = newText.replace(CJK_LEFT_BRACKET, "$1 $2")
    newText = newText.replace(RIGHT_BRACKET_CJK, "$1 $2")
    newText = newText.replace(FIX_LEFT_BRACKET_ANY_RIGHT_BRACKET, "$1$2$3")
    newText = newText.replace(
      ANS_CJK_LEFT_BRACKET_ANY_RIGHT_BRACKET,
      "$1 $2$3$4"
    )
    newText = newText.replace(
      LEFT_BRACKET_ANY_RIGHT_BRACKET_ANS_CJK,
      "$1$2$3 $4"
    )
    newText = newText.replace(AN_LEFT_BRACKET, "$1 $2")
    newText = newText.replace(RIGHT_BRACKET_AN, "$1 $2")
    newText = newText.replace(CJK_ANS, "$1 $2")
    newText = newText.replace(ANS_CJK, "$1 $2")
    newText = newText.replace(S_A, "$1 $2")
    // newText = newText.replace(MIDDLE_DOT, "・")
    // 去中文间的空格
    newText = newText.replace(BACKSAPCE_CJK, "$1$2")
    // 去掉下标和中文之间的空格
    newText = newText.replace(SUBSCRIPT_CJK, "$1 ")
    newText = newText.replace(SUPERSCRIPT_CJK, "$1 ")
    /* 特殊处理 */
    // 特殊字符
    newText = newText.replace(SPECIAL, "$1 ")
    // 处理 C[a,b] 这种单独字母紧跟括号的情形，不加空格
    newText = newText.replace(/([A-Za-z])\s([\(\[\{])/g, "$1$2")
    newText = newText.replace(/([\)\]\}])\s([A-Za-z])/g, "$1$2")
    // ”后面不加空格
    newText = newText.replace(/”\s/g, "”")
    // · 左右的空格去掉
    newText = newText.replace(/\s*·\s*/g, "·")
    // - 左右的空格去掉
    newText = newText.replace(/\s*-\s*/g, "-")
    // ∞ 后面的空格去掉
    newText = newText.replace(/∞\s/g, "∞")
    // 大求和符号改成小求和符号
    newText = newText.replace(/∑/g, "Σ")
    // 处理一下 弱* w* 这种空格
    newText = newText.replace(/([弱A-Za-z])\s*\*/g, "$1*")
    newText = newText.replace(/\*\s*\*/g, "**")
    return newText
  }
}
/**
 * 判断是否是正整数
 */
String.prototype.isPositiveInteger = function() {
  const regex = /^[1-9]\d*$/;
  return regex.test(this);
}
/**
 * 判断是否是知识点卡片的标题
 */
String.prototype.ifKnowledgeNoteTitle = function () {
  return /^【.{2,4}：.*】/.test(this)
}
String.prototype.isKnowledgeNoteTitle = function () {
  return this.ifKnowledgeNoteTitle()
}
/**
 * 获取知识点卡片的前缀
 */
String.prototype.toKnowledgeNotePrefix = function () {
  let match = this.match(/^【.{2,4}：(.*)】/)
  return match ? match[1] : this  // 如果匹配不到，返回原字符串
}
/**
 * 获取知识点卡片的标题
 */
String.prototype.toKnowledgeNoteTitle = function () {
  let match = this.match(/^【.{2,4}：.*】(.*)/)
  return match ? match[1] : this  // 如果匹配不到，返回原字符串
}
/**
 * 判断是否是绿色归类卡片的标题
 * @returns {boolean}
 */
String.prototype.ifGreenClassificationNoteTitle = function () {
  return /^“[^”]+”\s*相关[^“]*$/.test(this)
}
String.prototype.isGreenClassificationNoteTitle = function () {
  return this.ifGreenClassificationNoteTitle()
}
/**
 * 获取绿色归类卡片的标题
 */
String.prototype.toGreenClassificationNoteTitle = function () {
  let match = this.match(/^“([^”]+)”\s*相关[^“]*$/)
  return match ? match[1] : this  // 如果匹配不到，返回原字符串
}
/**
 * 判断是否是黄色归类卡片的标题
 * @returns {boolean}
 */
String.prototype.ifYellowClassificationNoteTitle = function () {
  return /^“[^”]*”：“[^”]*”\s*相关[^“]*$/.test(this)
}
String.prototype.isYellowClassificationNoteTitle = function () {
  return this.ifYellowClassificationNoteTitle()
}
/**
 * 获取黄色归类卡片的标题
 */
String.prototype.toYellowClassificationNoteTitle = function () {
  let match = this.match(/^“[^”]*”：“([^”]*)”\s*相关[^“]*$/)
  return match ? match[1] : this  // 如果匹配不到，返回原字符串
}
/**
 * 获取绿色或者黄色归类卡片的标题
 */
String.prototype.toClassificationNoteTitle = function () {
  if (this.ifGreenClassificationNoteTitle()) {
    return this.toGreenClassificationNoteTitle()
  }
  if (this.ifYellowClassificationNoteTitle()) {
    return this.toYellowClassificationNoteTitle()
  }
  return ""
}
/**
 * 判断输入的字符串是否是卡片 URL 或者卡片 ID
 */
String.prototype.ifNoteIdorURL = function () {
  return (
    this.ifValidNoteURL() ||
    this.ifValidNoteId()
  )
}
String.prototype.isNoteIdorURL = function () {
  return this.ifNoteIdorURL()
}
String.prototype.ifNoteURLorId = function () {
  return this.ifNoteIdorURL()
}
String.prototype.isNoteURLorId = function () {
  return this.ifNoteIdorURL()
}
String.prototype.ifNoteURLorID = function () {
  return this.ifNoteIdorURL()
}
String.prototype.isNoteURLorID = function () {
  return this.ifNoteIdorURL()
}
String.prototype.ifNoteIDorURL = function () {
  return this.ifNoteIdorURL()
}
String.prototype.isNoteIDorURL = function () {
  return this.ifNoteIdorURL()
}

/**
 * 判断是否是有效的卡片 ID
 */
String.prototype.ifValidNoteId = function() {
  const regex = /^[0-9A-Z]{8}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{12}$/;
  return regex.test(this);
}
String.prototype.isValidNoteId = function() {
  return this.ifValidNoteId()
}
String.prototype.ifNoteId = function() {
  return this.ifValidNoteId()
}
String.prototype.isNoteId = function() {
  return this.ifValidNoteId()
}

/**
 * 判断是否是有效的卡片 URL
 */
String.prototype.ifValidNoteURL = function() {
  return /^marginnote\dapp:\/\/note\//.test(this)
}
String.prototype.isValidNoteURL = function() {
  return this.ifValidNoteURL()
}
String.prototype.isLink = function() {
  return this.ifValidNoteURL()
}
String.prototype.ifLink = function() {
  return this.ifValidNoteURL()
}
/**
 * 把 ID 或 URL 统一转化为 URL
 */
String.prototype.toNoteURL = function() {
  if (this.ifNoteIdorURL()) {
    let noteId = this.trim()
    let noteURL
    if (/^marginnote\dapp:\/\/note\//.test(noteId)) {
      noteURL = noteId
    } else {
      noteURL = "marginnote4app://note/" + noteId
    }
    return noteURL
  }
}


String.prototype.ifNoteBookId = function() {
  return /^marginnote\dapp:\/\/notebook\//.test(this)
}
/**
 * 把 ID 或 URL 统一转化为 NoteBookId
 */
String.prototype.toNoteBookId = function() {
  if (this.ifNoteBookId() || this.ifNoteId()) {
    let noteId = this.trim()
    let noteURL
    if (/^marginnote\dapp:\/\/notebook\//.test(noteId)) {
      noteURL = noteId
    } else {
      noteURL = "marginnote4app://notebook/" + noteId
    }
    return noteURL
  }
}

/**
 * 把 ID 或 URL 统一转化为 ID
 */
String.prototype.toNoteId = function() {
  if (this.ifNoteIdorURL()) {
    let noteURL = this.trim()
    let noteId
    if (/^marginnote\dapp:\/\/note\//.test(noteURL)) {
      noteId = noteURL.slice(22)
    } else {
      noteId = noteURL
    }
    return noteId
  }
}
String.prototype.toNoteID = function() {
  return this.toNoteId()
}


/**
 * 夏大鱼羊 - 字符串函数 - end
 */















class MNUtil {
  /**
   * 夏大鱼羊 - MNUtil - begin
   */
  /**
   * 根据 md5 获取学习规划学习集对应的卡片 ID
   */
  static getNoteIdByMd5InPlanNotebook(md5){
    let md5IdPair = {
      // 刘培德《泛函分析基础》
      "fccc394d73fd738b364d33e1373a4a7493fafea8c024f3712f63db882e79a1cd":"35B90CB6-5BCC-4AA4-AE24-C6B4CBCB9666",
      // Jan van Neerven《Functional analysis》
      "3e68d9f7755163f5aacd5d337bdd7a0b6bd70d0727f721778d24d114010e6d7a":"96F569A4-2B2E-4B8D-B789-56ACE09AA2F1",
      // Conway《A course in Functional Analysis》
      "88603c9aa7b3c7605d84c08e0e17527f8ae7de0a323c666a0331cc8e7b616eab":"0B8E664B-BB42-431A-8516-C4CA4CF36F94",
      // 王凯 《泛函分析》
      "cb15d5b4e55227a3373bde1dd6f1295b21b561dbec231c91edad50186991fd7d":"C0ED1035-ED3E-4051-A1F6-EDE95CE35370",
      // Rudin 泛函分析
      "34c59a3b8af79bb95139756fb2d7c9c115fe8a7c79d4939100558b8bc7420e53":"8F938A8F-58DA-452D-9DE9-905DC77ABF04",
      // Folland 实分析
      "5bb47aff3b50e7ec12b0ffc3de8e13a7acb4aa11caffa52c29f9f8a5c9b970d5":"02E775DE-1CA6-4D72-A42C-45ED03FD1251",
      // Rudin - 实分析与复分析
      "f45e28950cadc7d1b9d29cd2763b9b6a969c8f38b45efb8cc2ee302115c5e8b4":"9CB204AD-C640-4F97-B62F-E47E2D659C25",
      // 赵焕光 - 现代分析入门
      "34f67c3a452118b6f274b8c063b85b0544a5d272081c7fdc1be27b9575b8a6f1":"C877F723-7FA3-4D95-9C87-9C036687782A",
      // 陆善镇 王昆扬 - 实分析
      "0bb3627b57dc95b4f4d682c71df34b3df01676b9a6819a1c5928c5ce7cb6cb25":"B73922E2-7036-40FE-BC5D-8F4713616C62",
      // 楼红卫《数学分析》
      "320ec3909f6cbd91445a7e76c98a105f50998370f5856be716f704328c11263f":"AA1B5A69-B17E-4B5C-9702-06F3C647C40E",
      // 李工宝《A first course in real analysis》
      "d2ec247e78e7517a2fb158e074a90e0bc53c84a57f2777eaa490af57fafd9438":"2D247A3C-559A-473A-83FE-C2A9BD09A74F",
      // MIRA
      "7c8f458cf3064fa1daa215ded76980c9aea8624097dbdcf90cca5bb893627621":"198E8FF1-4AAE-42CE-9C0A-1B6A6395804A",
      // 朱克和 《Operator Theory in Function Spaces》
      "6a248b6b116e03153af7204b612f93c12a4700ff3de3b3903bb0bcd84e2f6b09":"B32D4EFD-AAF9-44C7-8FDB-E92560F1171F",
      // 郭坤宇《算子理论基础》
      "659a6778d0732985b91d72961591a62c21d2d1bfcbd8e78464cc9a9aa6434cf1":"C04668B1-D77A-4495-8972-F028D9F90BFC",
      // 蹇人宜 安恒斌 《解析函数空间上的算子理论导引》
      "495ff8e34c20c10fe1244a7b36272e1b8ef8b6c0b92e01793ef2e377bfb90d72":"D35871E8-9F3B-4B95-AD73-48A6DDF27DC4",
      // The Theory of H(b) Spaces
      "d86e2e385d353492d9796caacac6353d75351c76968e613539efcaab3f58c8c1":"60F4D62D-D958-4CC7-BD59-511EE1E4312B",
      // Hoffman - Banach Spaces of Analytic Functions
      "f2ecc0f4f97eb3907e00746b964ae62a9f378e2cb05f1811aa7b37bce656c025":"CF750547-4BE6-4ABF-BB16-EE6D9321F73F",
      // Garnett - 有界解析函数
      "3ec7c103d58eb81e3c4d46022b5736c34d137c905b31053f69fe14ecf8da3606":"15E27BF9-EE52-4C2D-A5FE-0F16C9BC9148",
      // GTM249
      "cda554d017af672e87d4261c0463e41893bcb0cf50cb3f2042afaef749297482":"04E7DD41-1DE4-485E-9791-15F7DC067A46",
      // Stein - Harmonic Analysis: Real-Variable Methods, Orthogonality, and Oscillatory Integrals
      "4dc6b7188781ebad8c25ad5e9d7635c040ae4a08ddcd196fe2e6e716704851c2":"2E550C5B-88DD-408E-B246-39B293A5910F",
      // 郝成春 - 调和分析讲义
      "3805c33987e654ff07ca9ce68cdddeaff965ad544625faaf14c3799e13996ade":"1F47692A-81D2-4890-9E56-0C084D2B622D",
      // 谢启鸿《高等代数》
      "32dc18e2e7696064b8da9b14af56dfb54e41b8f08044f2ef00aa21f94885fc08":"8CAA1FAE-2A69-4CBE-A1F0-A02FB1C95C3C",
      // Krantz - 复变
      "74f3f034fe67fd4573b33f7c978bb06c2642b892c4b237f2efe9256359935e6e":"1B38D33E-77B7-4391-88F2-2FE3126D6FC4",
      "06c41fa919b0ec928c31f53e2301f4c9cc9ce1d820dcd5a1750db7144fb8caae":"1B38D33E-77B7-4391-88F2-2FE3126D6FC4",
      // A first course in complex analysis with applications
      "4f1fd75b664e8f7c8ee171ba2db11532fd34a3b010edad93fb5b0518243c164a":"7066180E-2430-4A3E-9241-135538474D86",
      // 邱维元 - 复分析讲义
      "886469e3d70342159bb554cdaee604fa5a6018e84b6ff04bbb35f69ea764a757":"1BD3CD6C-BDEE-4078-9DF3-BB5C45351356",
      // 方企勤 - 复变函数
      "e107e1772dbb53288a9d1c38781d3c77043ee40b68818a16f64c0e8480ed7c7e":"2FDA8616-2BE5-4253-BEE5-FA795AD37999"
    }

    return md5IdPair[md5]
  }
  /**
   * 根据名称获取 notebookid
   */
  static getNoteBookIdByName(name){
    let notebookId
    switch (name) {
      case "数学":
      case "数学基础":
        notebookId = "D03C8B94-77CF-46E6-8AAB-CB129EDBCFBC"
        break;
      case "数学分析":
      case "数分":
        notebookId = "922D2CDF-07CF-4A88-99BA-7AAC60E3C517"
        break;
      case "高等代数":
      case "高代":
        notebookId = "6E84B815-7BB6-42B0-AE2B-4057279EA163"
        break;
      case "实分析":
      case "实变函数":
      case "调和分析":
      case "实变":
      case "调和":
      case "实分析与调和分析":
      case "调和分析与实分析":
        notebookId = "B051BAC2-576D-4C18-B89E-B65C0E576C7F"
        break;
      case "复分析":
      case "复变函数":
      case "复变":
        notebookId = "EAB02DA9-D467-4D7D-B6BA-9244FC326299"
        break;
      case "泛函分析":
      case "泛函":
      case "泛函分析与算子理论":
      case "算子理论":
        notebookId = "98F4FA11-39D3-41A8-845A-F74E2197E111"
        break;
      case "学习规划":
      case "学习安排":
      case "Inbox":
      case "学习汇总":
      case "学习集结":
      case "规划":
      case "安排":
      case "inbox":
      case "汇总":
      case "集结":
        notebookId = "A07420C1-661A-4C7D-BA06-C7035C18DA74"
        break;
    }

    return notebookId.toNoteBookId()
  }

  /**
   * 获取学习集里的 inbox 部分的三个顶层的卡片 id
   */
  static getWorkFlowObjByNoteBookId(notebookId){
    let workflow = {}
    switch (notebookId.toNoteBookId()) {
      case "marginnote4app://notebook/A07420C1-661A-4C7D-BA06-C7035C18DA74":  // 学习规划 
        workflow.inputNoteId = "DED2745C-6564-4EFA-86E2-42DAAED3281A"
        workflow.internalizationNoteId = "796ACA3D-9A28-4DC7-89B4-EA5CC3928AFE"
        workflow.toClassifyNoteId = "3572E6DC-887A-4376-B715-04B6D8F0C58B"
        break;
      case "marginnote4app://notebook/98F4FA11-39D3-41A8-845A-F74E2197E111": // 泛函分析
        workflow.inputNoteId = "C1E43C94-287A-4324-9480-771815F82803"
        workflow.internalizationNoteId = "FE4B1142-CE83-4BA7-B0CF-453E07663059"
        workflow.toClassifyNoteId = "E1EACEC5-3ACD-424B-BD46-797CD8A56629"
        break;
      case "marginnote4app://notebook/EAB02DA9-D467-4D7D-B6BA-9244FC326299": // 复分析
        workflow.inputNoteId = "26316838-475B-49D9-9C7C-75AB01D80EDE"
        workflow.internalizationNoteId = "6FB0CEB6-DC7B-4EE6-AD73-4AA459EBE8D8"
        workflow.toClassifyNoteId = "B27D8A02-BDC4-4D3F-908B-61AA19CBB861"
        break;
      case "marginnote4app://notebook/6E84B815-7BB6-42B0-AE2B-4057279EA163": // 高等代数
        workflow.inputNoteId = "49E66E70-7249-47C6-869E-5A40448B9B0E"
        workflow.internalizationNoteId = "FDB5289B-3186-4D93-ADFF-B72B4356CBCD"
        workflow.toClassifyNoteId = "0164496D-FA35-421A-8A22-649831C83E63"
        break;
      case "marginnote4app://notebook/B051BAC2-576D-4C18-B89E-B65C0E576C7F": // 实分析
        workflow.inputNoteId = "E7538B60-D8E2-4A41-B620-37D1AD48464C"
        workflow.internalizationNoteId = "C5D44533-6D18-45F6-A010-9F83821F627F"
        workflow.toClassifyNoteId = "13623BE8-8D26-4FEE-95D8-B704C34E92EC"
        break;
      case "marginnote4app://notebook/922D2CDF-07CF-4A88-99BA-7AAC60E3C517": // 数学分析
        workflow.inputNoteId = "E22C7404-A6DE-4DB3-B749-BDF8C742F955"
        workflow.internalizationNoteId = "BBD9C2C0-CDB5-485E-A338-2C75F1ABE59F"
        workflow.toClassifyNoteId = "C7768D8F-3BD3-4D9F-BC82-C3F12701E7BF"
        break;
      case "marginnote4app://notebook/D03C8B94-77CF-46E6-8AAB-CB129EDBCFBC": // 数学基础 
        workflow.inputNoteId = "E69B712B-E42C-47F3-ADA4-1CB41A3336BD"
        workflow.internalizationNoteId = "6F5D6E1D-58C7-4E51-87CA-198607640FBE"
        workflow.toClassifyNoteId = "F6CE6E2C-4126-4945-BB98-F2437F73C806"
        break;
      case "marginnote4app://notebook/0F74EF05-FAA1-493E-9D78-CC84C4C045A6": // 文献库
        workflow.inputNoteId = ""
        workflow.internalizationNoteId = ""
        workflow.toClassifyNoteId = ""
        break;
    }
    return workflow
  }

  /**
   * 生成标题链接
   */
  static generateCustomTitleLink(keyword, titlelinkWord) {
    return `[${keyword}](marginnote4app://titlelink/custom/${titlelinkWord})`
  }
  /**
   * 【数学】根据中文类型获取对应的英文
   */
  static getEnNoteTypeByZhVersion(type){
    let typeMap = {
      "定义": "definition",
      "命题": "theorem",
      "反例": "antiexample",
      "例子": "example",
      "思想方法": "method",
      "问题": "question",
      "应用": "application",
      "归类": "classification",
      "": "temporary"
    }
    return typeMap[type]
  }
  /**
   * 【数学】根据中文类型获取对应的卡片颜色 index
   */
  static getNoteColorIndexByZhType(type){
    let typeMap = {
      "定义": 2,
      "命题": 10,
      "反例": 3,
      "例子": 15,
      "思想方法": 9,
      "问题": 13,
      "应用": 6
    }
    return typeMap[type]
  }
  /**
   * 【数学】根据颜色 Index 来判断卡片类型
   */
  static getNoteZhTypeByNoteColorIndex(index){
    let typeMap = {
      2: "定义",
      10: "命题",
      3: "反例",
      15: "例子",
      9: "思想方法",
      13: "问题",
      6: "应用",
      0: "归类",
      1: "顶层",
      4: "归类"
    }
    return typeMap[index]
  }
  static getNoteEnTypeByNoteColorIndex(index){
    let typeMap = {
      2: "definition",
      10: "theorem",
      3: "antiexample",
      15: "example",
      9: "method",
      13: "question",
      6: "application",
      0: "classification",
      1: "classification",
      4: "classification"
    }
    return typeMap[index]
  }
  /**
   * 【数学】根据卡片类型获取对应的模板卡片的 ID
   */
  static getTemplateNoteIdByZhType(type){
    let typeMap = {
      "定义": "C1052FDA-3343-45C6-93F6-61DCECF31A6D",
      "命题": "C4B464CD-B8C6-42DE-B459-55B48EB31AD8",
      "反例": "E64BDC36-DD8D-416D-88F5-0B3FCBE5D151",
      "例子": "C4B464CD-B8C6-42DE-B459-55B48EB31AD8",
      "思想方法": "EC68EDFE-580E-4E53-BA1B-875F3BEEFE62",
      "问题": "C4B464CD-B8C6-42DE-B459-55B48EB31AD8",
      "应用": "C4B464CD-B8C6-42DE-B459-55B48EB31AD8",
      "归类": "8853B79F-8579-46C6-8ABD-E7DE6F775B8B",
      "顶层": "8853B79F-8579-46C6-8ABD-E7DE6F775B8B"
    }
    return typeMap[type]
  }
  /**
   * 判断是否是普通对象
   * @param {Object} obj 
   * @returns {Boolean}
   */
  static isObj(obj) {
    return typeof obj === "object" && obj !== null && !Array.isArray(obj)
  }

  static ifObj(obj) {
    return this.isObj(obj)
  }

  /**
   * 判断评论是否是链接
   */
  static isCommentLink(comment){
    if (this.isObj(comment)) {
      if (comment.type == "TextNote") {
        return comment.text.isLink()
      }
    } else if (typeof comment == "string") {
      return comment.isLink()
    }
  }
  static isLink(comment){
    return this.isCommentLink(comment)
  }
  static ifLink(comment){
    return this.isCommentLink(comment)
  }
  static ifCommentLink(comment){
    return this.isCommentLink(comment)
  }

  /**
   * 获取到链接的文本
   */
  static getLinkText(link){
    if (this.isObj(link) && this.isCommentLink(link)) {
      return link.text
    }
    return link
  }
  /**
   * 夏大鱼羊 - MNUtil - end
   */
  static themeColor = {
    Gray: UIColor.colorWithHexString("#414141"),
    Default: UIColor.colorWithHexString("#FFFFFF"),
    Dark: UIColor.colorWithHexString("#000000"),
    Green: UIColor.colorWithHexString("#E9FBC7"),
    Sepia: UIColor.colorWithHexString("#F5EFDC")
  }
  static popUpNoteInfo = undefined;
  static popUpSelectionInfo = undefined;
  static mainPath
  static init(mainPath){
    if (this.mainPath) {
      this.mainPath = mainPath
      this.MNUtilVersion = this.getMNUtilVersion()
      const renderer = new marked.Renderer();
      renderer.code = (code, language) => {
        const validLang = hljs.getLanguage(language) ? language : 'plaintext';
        const uuid = NSUUID.UUID().UUIDString()
        if (validLang === 'plaintext') {
          return `<pre><div class="code-header" contenteditable="false"><span>${validLang}</span><button onclick="copyToClipboard('${uuid}')">复制</button></div><code class="hljs ${validLang}"  id="${uuid}">${code}</code></pre>`;
        }
        const highlightedCode = hljs.highlight(code, { language: validLang }).value;
        return `<pre><div class="code-header" contenteditable="false"><span>${validLang}</span><button onclick="copyToClipboard('${uuid}')">复制</button></div><code class="hljs ${validLang}" id="${uuid}">${highlightedCode}</code></pre>`;
      };
      // renderer.em = function(text) {
      //   return text;
      // };
      // marked.use({ renderer });
      marked.setOptions({ renderer });
    }
  }
  /**
   * Retrieves the version of the application.
   * 
   * This method checks if the application version has already been set. If not,
   * it sets the version using the `appVersion` method. The version is then
   * returned.
   * 
   * @returns {{version: string,type: string;}} The version of the application.
   */
  static get version(){
    if (!this.mnVersion) {
      this.mnVersion = this.appVersion()
    }
    return this.mnVersion
  }
  static get app(){
    // this.appInstance = Application.sharedInstance()
    // return this.appInstance
    if (!this.appInstance) {
      this.appInstance = Application.sharedInstance()
    }
    return this.appInstance
  }
  static get db(){
    if (!this.data) {
      this.data = Database.sharedInstance()
    }
    return this.data
  }
  static get currentWindow(){
    //关闭mn4后再打开，得到的focusWindow会变，所以不能只在init做一遍初始化
    return this.app.focusWindow
  }
  static get studyController(){
    return this.app.studyController(this.currentWindow)
  }
  static get studyView() {
    return this.app.studyController(this.currentWindow).view
  }
  /**
   * @returns {{view:UIView}}
   **/
  static get extensionPanelController(){
    return this.studyController.extensionPanelController
  }
  /**
   * @returns {UIView}
   */
  static get extensionPanelView(){
    return this.studyController.extensionPanelController.view
  }
  static get extensionPanelOn(){
    if (this.extensionPanelController && this.extensionPanelController.view.window) {
      return true
    }
    return false
  }
  static get mainPath(){
    return this.mainPath
  }
  /**doc:0,1;study:2;review:3 */
  static get studyMode(){
    return this.studyController.studyMode
  }
  static get readerController() {
    return this.studyController.readerController
  }
  static get notebookController(){
    return this.studyController.notebookController
  }
  static get docControllers() {
    return this.studyController.readerController.documentControllers
  }
  static get currentDocController() {
    return this.studyController.readerController.currentDocumentController
  }
  static get mindmapView(){
    return this.studyController.notebookController.mindmapView
  }
  static get selectionText(){
    let selectionText = this.currentDocController.selectionText
    if (selectionText) {
      return selectionText
    }
    if (this.studyController.docMapSplitMode) {//不为0则表示documentControllers存在
      let docControllers = this.docControllers
      let docNumber = docControllers.length
      for (let i = 0; i < docNumber; i++) {
        const docController = docControllers[i];
        selectionText = docController.selectionText
        if (selectionText) {
          return selectionText
        }
      }
    }
    if (this.popUpSelectionInfo) {
      let docController = this.popUpSelectionInfo.docController
      if (docController.selectionText) {
        return docController.selectionText
      }
    }
    return undefined
  }
  static get isSelectionText(){
    let image = this.currentDocController.imageFromSelection()
    if (image) {
      return this.currentDocController.isSelectionText
    }
    if (this.studyController.docMapSplitMode) {//不为0则表示documentControllers存在
      let docControllers = this.docControllers
      let docNumber = docControllers.length
      for (let i = 0; i < docNumber; i++) {
        const docController = docControllers[i];
        image = docController.imageFromSelection()
        if (image) {
          return docController.isSelectionText
        }
      }
    }
    if (this.popUpSelectionInfo) {
      let docController = this.popUpSelectionInfo.docController
      image = docController.imageFromSelection()
      if (image) {
        return docController.isSelectionText
      }
    }
    return false
  }
  /**
   * 返回选中的内容，如果没有选中，则onSelection属性为false
   * 如果有选中内容，则同时包括text和image，并通过isText属性表明当时是选中的文字还是图片
   * Retrieves the current selection details.
   * 
   * This method checks for the current document controller's selection. If an image is found,
   * it generates the selection details using the `genSelection` method. If no image is found
   * in the current document controller, it iterates through all document controllers if the
   * study controller's document map split mode is enabled. If a selection is found in the
   * pop-up selection info, it also generates the selection details. If no selection is found,
   * it returns an object indicating no selection.
   * 
   * @returns {{onSelection: boolean, image: null|undefined|NSData, text: null|undefined|string, isText: null|undefined|boolean,docMd5:string|undefined,pageIndex:number|undefined}} The current selection details.
   */
  static get currentSelection(){
    if (this.studyController.readerController.view.hidden) {
      return {onSelection:false}
    }
    let image = this.currentDocController.imageFromSelection()
    if (image) {
      return this.genSelection(this.currentDocController)
    }
    if (this.studyController.docMapSplitMode) {//不为0则表示documentControllers存在
      let docControllers = this.docControllers
      let docNumber = docControllers.length
      for (let i = 0; i < docNumber; i++) {
        const docController = docControllers[i];
        if (docController.imageFromSelection()) {
          return this.genSelection(docController)
        }
      }
    }
    if (this.popUpSelectionInfo && this.popUpSelectionInfo.docController) {
      let docController = this.popUpSelectionInfo.docController
      if (docController.imageFromSelection()) {
        return this.genSelection(docController)
      }
    }
    return {onSelection:false}
  }
  static get currentNotebookId() {
    return this.studyController.notebookController.notebookId
  }
  static get currentNotebook() {
    return this.getNoteBookById(this.currentNotebookId)
  }
  static get currentDocmd5(){
    try {
      const { docMd5 } = this.currentDocController
      if (docMd5 && docMd5.length === 32) return "00000000"
      else return docMd5
    } catch {
      return undefined
    }
  }
  static get isZH(){
    return NSLocale.preferredLanguages()[0].startsWith("zh")
  }

  static get currentThemeColor(){
    return this.themeColor[this.app.currentTheme]
  }
  static get clipboardText() {
    return UIPasteboard.generalPasteboard().string
  }
  static get clipboardImage() {
    return UIPasteboard.generalPasteboard().image
  }
  static get clipboardImageData() {
    let image = this.clipboardImage
    if (image) {
      return image.pngData()
    }
    return undefined
  }
  static get dbFolder(){
    //结尾不带斜杠
    return this.app.dbPath
  }
  static get cacheFolder(){
    //结尾不带斜杠
    return this.app.cachePath
  }
  static get documentFolder() {
    //结尾不带斜杠
    return this.app.documentPath
  }
  static get tempFolder() {
    //结尾不带斜杠
    return this.app.tempPath
  }
  static get splitLine() {
    let study = this.studyController
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
  /**
   * Retrieves the version and type of the application.
   * 
   * This method determines the version of the application by parsing the appVersion property.
   * It categorizes the version as either "marginnote4" or "marginnote3" based on the parsed version number.
   * Additionally, it identifies the operating system type (iPadOS, iPhoneOS, or macOS) based on the osType property.
   *  
   * @returns {{version: string, type: string}} An object containing the application version and operating system type.
   */
  static appVersion() {
    let info = {}
    let version = parseFloat(this.app.appVersion)
    if (version >= 4) {
      info.version = "marginnote4"
      info.versionNumber = version
    }else{
      info.version = "marginnote3"
      info.versionNumber = version
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
  static isIOS(){
    return this.appVersion().type == "iPhoneOS"
  }
  static isMacOS(){
    return this.appVersion().type == "macOS"
  }
  static isIPadOS(){
    return this.appVersion().type == "iPadOS"
  }
  static getMNUtilVersion(){
    let res = this.readJSON(this.mainPath+"/mnaddon.json")
    return res.version
    // this.copyJSON(res)
  }
  static countWords(str) {
    const chinese = Array.from(str)
      .filter(ch => /[\u4e00-\u9fa5]/.test(ch))
      .length
    
    const english = Array.from(str)
      .map(ch => /[a-zA-Z0-9\s]/.test(ch) ? ch : ' ')
      .join('').split(/\s+/).filter(s => s)
      .length

    return chinese + english
  }
  static getNoteFileById(noteId) {
    let note = this.getNoteById(noteId)
    let docFile = this.getDocById(note.docMd5)
    if (!docFile) {
      this.showHUD("No file")
      return undefined
    }
    let fullPath
    if (docFile.fullPathFileName) {
      fullPath = docFile.fullPathFileName
    }else{
      let folder = this.documentFolder
      let fullPath = folder+"/"+docFile.pathFile
      if (docFile.pathFile.startsWith("$$$MNDOCLINK$$$")) {
        let fileName = this.getFileName(docFile.pathFile)
        fullPath = Application.sharedInstance().tempPath + fileName
        // fullPath = docFile.pathFile.replace("$$$MNDOCLINK$$$", "/Users/linlifei/")
      }
    }
    if (!this.isfileExists(fullPath)) {
      this.showHUD("Invalid file: "+docFile.pathFile)
      return undefined
    }
    // copy(fullPath)
    let fileName = this.getFileName(fullPath)
    return{
      name:fileName,
      path:fullPath,
      md5:docFile.docMd5
    }
  }
  static isNSNull(obj){
    return (obj === NSNull.new())
  }
  static async runJavaScript(webview,script) {
  // if(!this.webviewResponse || !this.webviewResponse.window)return;
  return new Promise((resolve, reject) => {
    try {
      if (webview) {
        // MNUtil.copy(webview)
        webview.evaluateJavaScript(script,(result) => {
          if (this.isNSNull(result)) {
            resolve(undefined)
          }
          resolve(result)
        });
      }else{
        resolve(undefined)
      }
    } catch (error) {
      chatAIUtils.addErrorLog(error, "runJavaScript")
      resolve(undefined)
    }
  })
};
  static getRandomElement(arr) {
    if (arr.length === 1) {
      return arr[0]
    }
    if (arr && arr.length) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    }
    return ""; // 或者抛出一个错误，如果数组为空或者未定义
  }
  /**
   * Displays a Heads-Up Display (HUD) message on the specified window for a given duration.
   * 
   * This method shows a HUD message on the specified window for the specified duration.
   * If no window is provided, it defaults to the current window. The duration is set to 2 seconds by default.
   * 
   * @param {string} message - The message to display in the HUD.
   * @param {number} [duration=2] - The duration in seconds for which the HUD should be displayed.
   * @param {UIWindow} [window=this.currentWindow] - The window on which the HUD should be displayed.
   */
  static showHUD(message, duration = 2, window = this.currentWindow) {
    this.app.showHUD(message, window, duration);
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
  static copy(text) {
    UIPasteboard.generalPasteboard().string = text
  }
  /**
   * Copies a JSON object to the clipboard as a formatted string.
   * 
   * This method converts the provided JSON object into a formatted string using `JSON.stringify`
   * with indentation for readability, and then sets this string to the clipboard.
   * 
   * @param {Object} object - The JSON object to be copied to the clipboard.
   */
  static copyJSON(object) {
    UIPasteboard.generalPasteboard().string = JSON.stringify(object,null,2)
  }
  /**
   * Copies an image to the clipboard.
   * 
   * This method sets the provided image data to the clipboard with the specified pasteboard type.
   * 
   * @param {NSData} imageData - The image data to be copied to the clipboard.
   */
  static copyImage(imageData) {
    UIPasteboard.generalPasteboard().setDataForPasteboardType(imageData,"public.png")
  }
  /**
   *
   * @param {string} url
   */
  static openURL(url){
    this.app.openURL(NSURL.URLWithString(url));
  }
  static render(template,config){
    let output = mustache.render(template,config)
    return output
  }
  /**
   * 
   * @param {string} noteId 
   * @returns {boolean}
   */
  static isNoteInReview(noteId){
    return this.studyController.isNoteInReview(noteId)
  }
  static getNoteById(noteid) {
    let note = this.db.getNoteById(noteid)
    if (note) {
      return note
    }else{
      this.copy(noteid)
      this.showHUD("Note not exist!")
      return undefined
    }
  }
  static getNoteBookById(notebookId) {
    let notebook = this.db.getNotebookById(notebookId)
    return notebook
  }
  static getDocById(md5) {
    let doc = this.db.getDocumentById(md5)
    return doc
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
  /**
   * 
   * @param filePath The file path of the document to import
   * @returns The imported document md5
   */
  static importDocument(filePath) {
    return MNUtil.app.importDocument(filePath)
  
  }
  static toggleExtensionPanel(){
    this.studyController.toggleExtensionPanel()
  }
  static isfileExists(path) {
    return NSFileManager.defaultManager().fileExistsAtPath(path)
  }
  /**
   * Generates a frame object with the specified x, y, width, and height values.
   * 
   * This method creates a frame object with the provided x, y, width, and height values.
   * If any of these values are undefined, it displays a HUD message indicating the invalid parameter
   * and sets the value to 10 as a default.
   * 
   * @param {number} x - The x-coordinate of the frame.
   * @param {number} y - The y-coordinate of the frame.
   * @param {number} width - The width of the frame.
   * @param {number} height - The height of the frame.
   * @returns {{x: number, y: number, width: number, height: number}} The frame object with the specified dimensions.
   */
  static genFrame(x, y, width, height) {
    if (x === undefined) {
        MNUtil.showHUD("无效的参数: x");
        x = 10;
    }
    if (y === undefined) {
        MNUtil.showHUD("无效的参数: y");
        y = 10;
    }
    if (width === undefined) {
        MNUtil.showHUD("无效的参数: width");
        // MNUtil.copyJSON({x:x,y:y,width:width,height:height})
        width = 10;
    }
    if (height === undefined) {
        MNUtil.showHUD("无效的参数: height");
        height = 10;
    }
    return { x: x, y: y, width: width, height: height };
  }
  static setFrame(view,x,y,width,height){
    view.frame = {x:x,y:y,width:width,height:height}
  }
  /**
   *
   * @param {DocumentController} docController
   * @returns
   */
  static genSelection(docController){
    let selection = {onSelection:true}
    //无论是选中文字还是框选图片，都可以拿到图片。而文字则不一定
    let image = docController.imageFromSelection()
    if (image) {
      selection.image = image
      selection.isText = docController.isSelectionText
      if (docController.selectionText) {
        selection.text = docController.selectionText
      }
      selection.docMd5 = docController.docMd5
      selection.pageIndex = docController.currPageIndex
      return selection
    }
    return {onSelection:false}

  }
  static parseWinRect(winRect) {
    let rectArr = winRect.replace(/{/g, '').replace(/}/g, '').replace(/\s/g, '').split(',')
    let X = Number(rectArr[0])
    let Y = Number(rectArr[1])
    let H = Number(rectArr[3])
    let W = Number(rectArr[2])
    return this.genFrame(X, Y, W, H)
  }
  static async animate(func,time = 0.2) {
    return new Promise((resolve, reject) => {
      UIView.animateWithDurationAnimationsCompletion(time,func,()=>(resolve()))
    })

  }
  static checkSender(sender,window = this.currentWindow){
    return this.app.checkNotifySenderInWindow(sender, window)
  }
  static async delay (seconds) {
    return new Promise((resolve, reject) => {
      NSTimer.scheduledTimerWithTimeInterval(seconds, false, function () {
        resolve()
      })
    })
  }
  /**
   *
   * @param {UIView} view
   */
  static isDescendantOfStudyView(view){
    return view.isDescendantOfView(this.studyView)
  }
  static addObserver(observer,selector,name){
    NSNotificationCenter.defaultCenter().addObserverSelectorName(observer, selector, name);
  }
  static removeObserver(observer,name){
    NSNotificationCenter.defaultCenter().removeObserverName(observer, name);
  }
  static removeObservers(observer,notifications) {
    notifications.forEach(notification=>{
      NSNotificationCenter.defaultCenter().removeObserverName(object, notification);
    })
  }
  static refreshAddonCommands(){
    this.studyController.refreshAddonCommands()
  }
  static refreshAfterDBChanged(notebookId = this.currentNotebookId){
    this.app.refreshAfterDBChanged(notebookId)
  }
  /**
   * Focuses a note in the mind map by its ID with an optional delay.
   * 
   * This method attempts to focus a note in the mind map by its ID. If the note is not in the current notebook,
   * it displays a HUD message indicating that the note is not in the current notebook. If a delay is specified,
   * it waits for the specified delay before focusing the note.
   * 
   * @param {string} noteId - The ID of the note to focus.
   * @param {number} [delay=0] - The delay in seconds before focusing the note.
   */
  static focusNoteInMindMapById(noteId,delay=0){
  try {
    let note = this.getNoteById(noteId)
    if (note.notebookId && note.notebookId !== this.currentNotebookId) {
      this.showHUD("Note not in current notebook")
      return
    }
    if (delay) {
      this.delay(delay).then(()=>{
        this.studyController.focusNoteInMindMapById(noteId)
      })
    }else{
      this.studyController.focusNoteInMindMapById(noteId)
    }

  } catch (error) {
    MNUtil.showHUD(error)
  }
  }
  static focusNoteInFloatMindMapById(noteId,delay = 0){
    if (delay) {
      this.delay(delay).then(()=>{
        this.studyController.focusNoteInFloatMindMapById(noteId)
      })
    }else{
      this.studyController.focusNoteInFloatMindMapById(noteId)
    }
  }
  static focusNoteInDocumentById(noteId,delay = 0){
    if (delay) {
      this.delay(delay).then(()=>{
        this.studyController.focusNoteInDocumentById(noteId)
      })
    }else{
      this.studyController.focusNoteInDocumentById(noteId)
    }
  }
  static isValidJSON(jsonString){
    // return NSJSONSerialization.isValidJSONObject(result)
     try{
         var json = JSON.parse(jsonString);
         if (json && typeof json === "object") {
             return true;
         }
     }
     catch(e){
         return false;
     }
     return false;
  }
  static getValidJSON(text) {
    try {
    if (text.endsWith(':')) {
      text = text+'""}'
    }
    if (this.isValidJSON(text)) {
      return JSON.parse(text)
    }else if (this.isValidJSON(text+"\"}")){
      return JSON.parse(text+"\"}")
    }else if (this.isValidJSON(text+"}")){
      return JSON.parse(text+"}")
    }else if (!text.startsWith('{') && text.endsWith('}')){
      return JSON.parse("{"+text)
    }else{
      // this.showHUD("no valid json")
      // this.copy(original)
      return undefined
    }
    } catch (error) {
      this.showHUD("Error in getValidJSON: "+error)
      this.copy(text)
      return undefined
    }
  }
  /**
   * Merges multiple consecutive whitespace characters into a single space, except for newlines.
   * 
   * This method processes the input string to replace multiple consecutive whitespace characters
   * (excluding newlines) with a single space. It also ensures that multiple consecutive newlines
   * are reduced to a single newline. The resulting string is then trimmed of any leading or trailing
   * whitespace.
   * 
   * @param {string} str - The input string to be processed.
   * @returns {string} The processed string with merged whitespace.
   */
  static mergeWhitespace(str) {
      if (!str) {
        return "";
      }
      // 先将多个连续的换行符替换为单个换行符
      var tempStr = str.replace(/\n+/g, '\n');
      // 再将其它的空白符（除了换行符）替换为单个空格
      return tempStr.replace(/[\r\t\f\v ]+/g, ' ').trim();
  }
  /**
   * Groups the specified function within an undo operation for the given notebook.
   * 
   * This method wraps the provided function within an undo operation for the specified notebook.
   * It ensures that the function's changes can be undone as a single group. After the function is executed,
   * it refreshes the application to reflect the changes.
   * 
   * @param {Function} f - The function to be executed within the undo group.
   * @param {string} [notebookId=this.currentNotebookId] - The ID of the notebook for which the undo group is created.
   */
  static undoGrouping(f,notebookId = this.currentNotebookId){
    UndoManager.sharedInstance().undoGrouping(
      String(Date.now()),
      notebookId,
      f
    )
    this.app.refreshAfterDBChanged(notebookId)
  }
  static getImage(path,scale=2) {
    return UIImage.imageWithDataScale(NSData.dataWithContentsOfFile(path), scale)
  }
  static getFile(path) {
    return NSData.dataWithContentsOfFile(path)
  }
  /**
   * Extracts the file name from a full file path.
   * 
   * This method takes a full file path as input and extracts the file name by finding the last occurrence
   * of the '/' character and then taking the substring from that position to the end of the string.
   * 
   * @param {string} fullPath - The full path of the file.
   * @returns {string} The extracted file name.
   */
  static getFileName(fullPath) {
      // 找到最后一个'/'的位置
      let lastSlashIndex = fullPath.lastIndexOf('/');

      // 从最后一个'/'之后截取字符串，得到文件名
      let fileName = fullPath.substring(lastSlashIndex + 1);

      return fileName;
  }
  static getMediaByHash(hash) {
    let image = this.db.getMediaByHash(hash)
    return image
  }
  /**
   * 左 0, 下 1，3, 上 2, 右 4
   * @param {*} sender
   * @param {*} commandTable
   * @param {*} width
   * @param {*} position
   * @returns
   */
  static getPopoverAndPresent(sender,commandTable,width=100,position=2) {
    var menuController = MenuController.new();
    menuController.commandTable = commandTable
    menuController.rowHeight = 35;
    menuController.preferredContentSize = {
      width: width,
      height: menuController.rowHeight * menuController.commandTable.length
    };
    //左 0
    //下 1，3
    //上 2
    //右 4
    var popoverController = new UIPopoverController(menuController);
    var r = sender.convertRectToView(sender.bounds,this.studyView);
    popoverController.presentPopoverFromRect(r, this.studyView, position, true);
    return popoverController
  }
  /**
   *
   * @param {string} name
   * @param {*} userInfo
   */
  static postNotification(name,userInfo) {
    NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(name, this.currentWindow, userInfo)
  }
  static hexColorAlpha(hex,alpha=1.0) {
    let color = UIColor.colorWithHexString(hex)
    return alpha!==undefined?color.colorWithAlphaComponent(alpha):color
  }
  static genNSURL(url) {
    return NSURL.URLWithString(url)
  }
  /**
   * 默认在当前学习集打开
   * @param {string} md5 
   * @param {string} notebookId
   */
  static openDoc(md5,notebookId=MNUtil.currentNotebookId){
    MNUtil.studyController.openNotebookAndDocument(notebookId, md5)
  }
  /**
   * Converts NSData to a string.
   * 
   * This method checks if the provided data object has a base64 encoding method. If it does,
   * it decodes the base64 data and converts it to a UTF-8 string. If the data object does not
   * have a base64 encoding method, it returns the data object itself.
   * 
   * @param {NSData} data - The data object to be converted to a string.
   * @returns {string} The converted string.
   */
  static data2string(data){
    if (data.base64Encoding) {
      let test = CryptoJS.enc.Base64.parse(data.base64Encoding())
      let textString = CryptoJS.enc.Utf8.stringify(test);
      return textString
    }else{
      return data
    }
  }
  static readJSON(path){
    let data = NSData.dataWithContentsOfFile(path)
    const res = NSJSONSerialization.JSONObjectWithDataOptions(
      data,
      1<<0
    )
    return res
  }
  static writeJSON(path,object){
    NSData.dataWithStringEncoding(
      JSON.stringify(object, undefined, 2),
      4
    ).writeToFileAtomically(path, false)
  }
  static readText(path){
    let data = NSData.dataWithContentsOfFile(path)
    let test = CryptoJS.enc.Base64.parse(data.base64Encoding())
    let content = CryptoJS.enc.Utf8.stringify(test);
    return content
  }
  static writeText(path,string){
    NSData.dataWithStringEncoding(
      string,
      4
    ).writeToFileAtomically(path, false)
  }
  static readTextFromUrlSync(url){
    let textData = NSData.dataWithContentsOfURL(this.genNSURL(url))
    let text = this.data2string(textData)
    return text
  }
  static async readTextFromUrlAsync(url,option={}){
    // MNUtil.copy("readTextFromUrlAsync")
    let res = await MNConnection.fetch(url,option)
    if (!res.base64Encoding && "timeout" in res && res.timeout) {
      return undefined
    }
    let text = this.data2string(res)
    return text
  }
  /**
   * Encrypts or decrypts a string using XOR encryption with a given key.
   * 
   * This method performs XOR encryption or decryption on the input string using the provided key.
   * Each character in the input string is XORed with the corresponding character in the key,
   * repeating the key if it is shorter than the input string. The result is a new string
   * where each character is the XOR result of the original character and the key character.
   * 
   * @param {string} input - The input string to be encrypted or decrypted.
   * @param {string} key - The key used for XOR encryption or decryption.
   * @returns {string} The encrypted or decrypted string.
   */
  static xorEncryptDecrypt(input, key) {
    let output = [];
    for (let i = 0; i < input.length; i++) {
        // Perform XOR between the input character and the key character
        output.push(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return String.fromCharCode.apply(null, output);
  }
  // static encrypt(text,key){
  //   var encrypted = CryptoJS.AES.encrypt(text, key).toString();
  //   return encrypted
  // }
  // static decrypt(text,key){
  //   var decrypted = CryptoJS.AES.decrypt(text, key).toString();
  //   var originalText = decrypted.toString(CryptoJS.enc.Utf8);
  //   return originalText
  // }
  static MD5(data){
    let md5 = CryptoJS.MD5(data).toString();
    return md5
  }

  static replaceMNImagesWithBase64(markdown) {
  // if (/!\[.*?\]\((marginnote4app\:\/\/markdownimg\/png\/.*?)(\))/) {

  //   // ![image.png](marginnote4app://markdownimg/png/eebc45f6b237d8abf279d785e5dcda20)
  // }
try {
    // let shouldOverWritten = false
    // 匹配 base64 图片链接的正则表达式
    const MNImagePattern = /!\[.*?\]\((marginnote4app\:\/\/markdownimg\/png\/.*?)(\))/g;
    let images = []
    // 处理 Markdown 字符串，替换每个 base64 图片链接
    const result = markdown.replace(MNImagePattern, (match, MNImageURL,p2) => {
      // 你可以在这里对 base64Str 进行替换或处理
      // shouldOverWritten = true
      let hash = MNImageURL.split("markdownimg/png/")[1]
      let imageData = MNUtil.getMediaByHash(hash)
      let imageBase64 = imageData.base64Encoding()
      // if (!imageData) {
      //   return match.replace(MNImageURL, hash+".png");
      // }
      // imageData.writeToFileAtomically(editorUtils.bufferFolder+hash+".png", false)
      return match.replace(MNImageURL, "data:image/png;base64,"+imageBase64);
    });
  return result;
} catch (error) {
  editorUtils.addErrorLog(error, "replaceBase64ImagesWithR2")
  return undefined
}
}

  static md2html(md){
    let tem = this.replaceMNImagesWithBase64(md)
    return marked.parse(tem.replace(/_{/g,'\\_\{').replace(/_\\/g,'\\_\\'))
  }
  /**
   * Escapes special characters in a string to ensure it can be safely used in JavaScript code.
   * 
   * This method escapes backslashes, backticks, template literal placeholders, carriage returns,
   * newlines, single quotes, and double quotes in the input string. The resulting string can be
   * safely used in JavaScript code without causing syntax errors.
   * 
   * @param {string} str - The input string to be escaped.
   * @returns {string} The escaped string.
   */
  static escapeString(str) {
    return str.replace(/\\/g, '\\\\') // Escape backslashes
              .replace(/\`/g, '\\`') // Escape backticks
              .replace(/\$\{/g, '\\${') // Escape template literal placeholders
              .replace(/\r/g, '\\r') // Escape carriage returns
              .replace(/\n/g, '\\n') // Escape newlines
              .replace(/'/g, "\\'")   // Escape single quotes
              .replace(/"/g, '\\"');  // Escape double quotes
  }
  static getLocalDataByKey(key) {
    return NSUserDefaults.standardUserDefaults().objectForKey(key)
  }
  static setLocalDataByKey(data, key) {
    NSUserDefaults.standardUserDefaults().setObjectForKey(data, key)
  }


  /**
   *
   * @param {string[]} UTI
   * @returns
   */
  static async importFile(UTI){
    return new Promise((resolve, reject) => {
      this.app.openFileWithUTIs(UTI,this.studyController,(path)=>{
        resolve(path)
      })
    })
  }
  static saveFile(filePath, UTI) {
    this.app.saveFileWithUti(filePath, UTI)
  }
  /**
   *
   * @param {T[]} arr
   * @param {boolean} noEmpty
   * @returns {T[]}
   */
 static unique (arr, noEmpty = false){
  let ret = []
  if (arr.length <= 1) ret = arr
  else ret = Array.from(new Set(arr))
  if (noEmpty) ret = ret.filter(k => k)
  return ret
}
  static typeOf(note){
    if (typeof note === "undefined") {
      return "undefined"
    }
    if (typeof note === "string") {
      if (/^marginnote\dapp:\/\/note\//.test(note.trim())) {
        return "NoteURL"
      }
      return "string"
    }
    if (note instanceof MNNote) {
      return "MNNote"
    }
    if (note.noteId) {
      return "MbBookNote"
    }
    if ("title" in note || "content" in note || "excerptText" in note) {
      return "NoteConfig"
    }
    return typeof note

  }
  static getNoteId(note){
    let noteId
    switch (this.typeOf(note)) {
      case "MbBookNote":
        noteId = note.noteId
        break;
      case "NoteURL":
        noteId = this.getNoteIdByURL(note)
        break;
      case 'string':
        noteId = note
        break;
      default:
        this.showHUD("MNUtil.getNoteId: Invalid param")
        return undefined
    }
    return noteId
  }
  /**
   * Retrieves the image data from the current document controller or other document controllers if the document map split mode is enabled.
   * 
   * This method checks for image data in the current document controller's selection. If no image is found, it checks the focused note within the current document controller.
   * If the document map split mode is enabled, it iterates through all document controllers to find the image data. If a pop-up selection info is available, it also checks the associated document controller.
   * 
   * @param {boolean} [checkImageFromNote=false] - Whether to check the focused note for image data.
   * @param {boolean} [checkDocMapSplitMode=false] - Whether to check other document controllers if the document map split mode is enabled.
   * @returns {NSData|undefined} The image data if found, otherwise undefined.
   */
  static getDocImage(checkImageFromNote=false,checkDocMapSplitMode=false){
  try {

    let docMapSplitMode = this.studyController.docMapSplitMode
    if (checkDocMapSplitMode && !docMapSplitMode) {
      return undefined
    }
    let imageData = this.currentDocController.imageFromSelection()
    if (imageData) {
      return imageData
    }
    if (checkImageFromNote) {
      imageData = this.currentDocController.imageFromFocusNote()
    }
    if (imageData) {
      return imageData
    }
    // MNUtil.showHUD("message"+this.docControllers.length)
    if (docMapSplitMode) {//不为0则表示documentControllers存在
      let imageData
      let docNumber = this.docControllers.length
      for (let i = 0; i < docNumber; i++) {
        const docController = this.docControllers[i];
        imageData = docController.imageFromSelection()
        if (!imageData && checkImageFromNote) {
          imageData = docController.imageFromFocusNote()
        }
        if (imageData) {
          return imageData
        }
      }
    }
    if (this.popUpSelectionInfo) {
      let docController = this.popUpSelectionInfo.docController
      let imageData = docController.imageFromSelection()
      if (imageData) {
        return imageData
      }
      if (checkImageFromNote) {
        imageData = docController.imageFromFocusNote()
      }
      if (imageData) {
        return imageData
      }
    }
    return undefined
  } catch (error) {
    MNUtil.showHUD(error)
    return undefined
  }
  }
  static excuteCommand(command){
    let urlPre = "marginnote4app://command/"
    if (command) {
      let url = urlPre+command
      this.openURL(url)
      return
    }
  }
  /**
   *
   * @param {number[]} arr
   * @param {string} type
   */
  static sort(arr,type="increment"){
    let arrToSort = arr
    switch (type) {
      case "decrement":
        arrToSort.sort((a, b) => b - a);
        break;
      case "increment":
        arrToSort.sort((a, b) => a - b);
        break;
      default:
        break;
    }
    return [...new Set(arrToSort)]
  }
  /**
   * Displays an input dialog with a title, subtitle, and a list of items.
   * 
   * This method shows an input dialog with the specified title and subtitle. It allows the user to input text and select from a list of items.
   * The method returns a promise that resolves with an object containing the input text and the index of the button clicked by the user.
   * 
   * @param {string} title - The main title of the input dialog.
   * @param {string} subTitle - The subtitle of the input dialog.
   * @param {string[]} items - The list of items to display in the dialog.
   * @returns {Promise<{input:string,button:number}>} A promise that resolves with an object containing the input text and the button index.
   */
  static input(title,subTitle,items) {
    return new Promise((resolve, reject) => {
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        title,subTitle,2,items[0],items.slice(1),
        (alert, buttonIndex) => {
          let res = {input:alert.textFieldAtIndex(0).text,button:buttonIndex}
          resolve(res)
        }
      )
    })
  }
  /**
   * 注意这里的code需要是字符串
   * @param {string} code
   * @returns {string}
   */
  static getStatusCodeDescription(code){
  try {
    let des = {
    "400": "Bad Request",
    "401": "Unauthorized",
    "402": "Payment Required",
    "403": "Forbidden",
    "404": "Not Found",
    "405": "Method Not Allowed",
    "406": "Not Acceptable",
    "407": "Proxy Authentication Required",
    "408": "Request Timeout",
    "409": "Conflict",
    "410": "Gone",
    "411": "Length Required",
    "412": "Precondition Failed",
    "413": "Payload Too Large",
    "414": "URI Too Long",
    "415": "Unsupported Media Type",
    "416": "Range Not Satisfiable",
    "417": "Expectation Failed",
    "418": "I'm a teapot",
    "421": "Misdirected Request",
    "422": "Unprocessable Entity",
    "423": "Locked",
    "424": "Failed Dependency",
    "425": "Too Early",
    "426": "Upgrade Required",
    "428": "Precondition Required",
    "429": "Too Many Requests",
    "431": "Request Header Fields Too Large",
    "451": "Unavailable For Legal Reasons",
    "500": "Internal Server Error",
    "501": "Not Implemented",
    "502": "Bad Gateway",
    "503": "Service Unavailable",
    "504": "Gateway Timeout",
    "505": "HTTP Version Not Supported",
    "506": "Variant Also Negotiates",
    "507": "Insufficient Storage",
    "508": "Loop Detected",
    "510": "Not Extended",
    "511": "Network Authentication Required"
  }
  if (code in des) {
    return (code+": "+des[code])
  }
  return undefined
  } catch (error) {
    MNUtil.copy(error.toString())
  }
  }
  /**
   * 
   * @param {string} template 
   * @param {object} config 
   * @returns {string}
   */
  static render(template,config){
    let output = mustache.render(template,config)
    return output
  }
  /**
   * 
   * @param {number} value 
   * @param {number} min 
   * @param {number} max 
   * @returns {number}
   */
  static constrain(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  /**
   * max为10
   * @param {number} index 
   * @returns 
   */
  static emojiNumber(index){
    let emojiIndices = ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"]
    return emojiIndices[index]
  }
}

class MNConnection{
  static genURL(url) {
    return NSURL.URLWithString(url)
  }
  // static requestWithURL(url){
  //   return NSURLRequest.requestWithURL(NSURL.URLWithString(url))
  // }
  static requestWithURL(url){
    return NSMutableURLRequest.requestWithURL(NSURL.URLWithString(url))
  }
  /**
   * Loads a URL request into a web view.
   * 
   * This method loads the specified URL into the provided web view. It creates an NSURLRequest object
   * from the given URL and then instructs the web view to load this request.
   * 
   * @param {UIWebView} webview - The web view into which the URL should be loaded.
   * @param {string} url - The URL to be loaded into the web view.
   */
  static loadRequest(webview,url){
    webview.loadRequest(NSURLRequest.requestWithURL(NSURL.URLWithString(url)));
  }
  /**
   * 
   * @param {UIWebView} webview 
   * @param {string} fileURL
   * @param {string} baseURL 
   */
  static loadFile(webview,file,baseURL){
    webview.loadFileURLAllowingReadAccessToURL(
      NSURL.fileURLWithPath(file),
      NSURL.fileURLWithPath(baseURL)
    )
  }
  /**
   * 
   * @param {UIWebView} webview 
   * @param {string} html
   * @param {string} baseURL 
   */
  static loadHTML(webview,html,baseURL){
    webview.loadFileURLAllowingReadAccessToURL(
      html,
      NSURL.fileURLWithPath(baseURL)
    )
  }
  /**
   * Initializes an HTTP request with the specified URL and options.
   * 
   * This method creates an NSMutableURLRequest object with the given URL and sets the HTTP method, timeout interval, and headers.
   * It also handles query parameters, request body, form data, and JSON payloads based on the provided options.
   * 
   * @param {string} url - The URL for the HTTP request.
   * @param {Object} options - The options for the HTTP request.
   * @param {string} [options.method="GET"] - The HTTP method (e.g., "GET", "POST").
   * @param {number} [options.timeout=10] - The timeout interval for the request in seconds.
   * @param {Object} [options.headers] - Additional headers to include in the request.
   * @param {Object} [options.search] - Query parameters to append to the URL.
   * @param {string} [options.body] - The request body as a string.
   * @param {Object} [options.form] - Form data to include in the request body.
   * @param {Object} [options.json] - JSON data to include in the request body.
   * @returns {NSMutableURLRequest} The initialized NSMutableURLRequest object.
   */
  static initRequest(url,options) {
    const request = this.requestWithURL(url)
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
   * Sends an HTTP request asynchronously and returns the response data.
   * 
   * This method sends the specified HTTP request asynchronously using NSURLConnection. It returns a promise that resolves with the response data if the request is successful,
   * or with an error object if the request fails. The error object includes details such as the status code and error message.
   * 
   * @param {NSMutableURLRequest} request - The HTTP request to be sent.
   * @returns {Promise<Object>} A promise that resolves with the response data or an error object.
   */
  static async sendRequest(request){
    // MNUtil.copy("sendRequest")
    const queue = NSOperationQueue.mainQueue()
    return new Promise((resolve, reject) => {
      NSURLConnection.sendAsynchronousRequestQueueCompletionHandler(
        request,
        queue,
        (res, data, err) => {
          // try {
          //   if (res && res.statusCode) {
          //     MNUtil.showHUD("message"+res.statusCode())
          //   }else{
          //     MNUtil.showHUD("message"+err.localizedDescription)
          //   }
          // } catch (error) {
          //   MNUtil.showHUD(error)
          // }
          let error = {}
          let response = data
          if (err.localizedDescription){
            error.message = err.localizedDescription
            // MNUtil.copy(err.localizedDescription)
            // MNUtil.showHUD(err.localizedDescription)
            // reject()
          }
          if (!res.statusCode) {
            error.timeout = true
            MNUtil.showHUD(err.localizedDescription)
            // MNUtil.copyJSON(error)
            resolve(error)
          }
          if (res.statusCode && res.statusCode() >= 400) {
            error.statusCode = res.statusCode()
          }
          // if (res.statusCode() === 200) {
          //   MNUtil.showHUD("OCR success")
          // }else{
          //   MNUtil.showHUD("Error in OCR")
          // }
          // if (data) {
          //   MNUtil.copy("hasdata: "+typeof data)
          // }
          const result = NSJSONSerialization.JSONObjectWithDataOptions(
            data,
            1<<0
          )
          if (NSJSONSerialization.isValidJSONObject(result)){
            response = result
          }
          if (Object.keys(error).length) {
            if (NSJSONSerialization.isValidJSONObject(result)){
              error.body = result
            }else{
              error.body = MNUtil.data2string(data)
            }
            resolve(error)
          }
          resolve(response)
        }
      )
  })
  }
  /**
   * Fetches data from a specified URL with optional request options.
   * 
   * This method initializes a request with the provided URL and options, then sends the request asynchronously.
   * It returns a promise that resolves with the response data or an error object if the request fails.
   * 
   * @param {string} url - The URL to fetch data from.
   * @param {Object} [options={}] - Optional request options.
   * @param {string} [options.method="GET"] - The HTTP method to use for the request.
   * @param {number} [options.timeout=10] - The timeout interval for the request in seconds.
   * @param {Object} [options.headers={}] - Additional headers to include in the request.
   * @param {Object} [options.search] - Query parameters to append to the URL.
   * @param {string} [options.body] - The body of the request for POST, PUT, etc.
   * @param {Object} [options.form] - Form data to include in the request body.
   * @param {Object} [options.json] - JSON data to include in the request body.
   * @returns {Promise<Object|Error>} A promise that resolves with the response data or an error object.
   */
  static async fetch (url,options = {}){
    const request = this.initRequest(url, options)
    // MNUtil.copy(typeof request)
    const res = await this.sendRequest(request)
    return res
  }
  /**
   * Encodes a string to Base64.
   * 
   * This method encodes the provided string to a Base64 representation using the CryptoJS library.
   * It first parses the string into a WordArray and then converts this WordArray to a Base64 string.
   * 
   * @param {string} str - The string to be encoded to Base64.
   * @returns {string} The Base64 encoded string.
   */
static btoa(str) {
    // Encode the string to a WordArray
    const wordArray = CryptoJS.enc.Utf8.parse(str);
    // Convert the WordArray to Base64
    const base64 = CryptoJS.enc.Base64.stringify(wordArray);
    return base64;
}
  /**
   * Reads a file from a WebDAV server using the provided URL, username, and password.
   * 
   * This method sends a GET request to the specified WebDAV URL with the provided username and password for authentication.
   * It returns a promise that resolves with the response data if the request is successful, or with an error object if the request fails.
   * 
   * @param {string} url - The URL of the file on the WebDAV server.
   * @param {string} username - The username for authentication.
   * @param {string} password - The password for authentication.
   * @returns {Promise<Object>} A promise that resolves with the response data or an error object.
   */
static async readWebDAVFile(url, username, password) {
    const headers = {
      Authorization:'Basic ' + this.btoa(username + ':' + password),
      "Cache-Control": "no-cache"
      };
        const response = await this.fetch(url, {
            method: 'GET',
            headers: headers
        });
    return response
}
/**
 * Uploads a file to a WebDAV server using the provided URL, username, password, and file content.
 * 
 * This method sends a PUT request to the specified WebDAV URL with the provided username and password for authentication.
 * The file content is included in the request body. It returns a promise that resolves with the response data if the request is successful,
 * or with an error object if the request fails.
 * 
 * @param {string} url - The URL of the file on the WebDAV server.
 * @param {string} username - The username for authentication.
 * @param {string} password - The password for authentication.
 * @param {string} fileContent - The content of the file to be uploaded.
 * @returns {Promise<Object>} A promise that resolves with the response data or an error object.
 */
static async uploadWebDAVFile(url, username, password, fileContent) {
    const headers = {
      Authorization:'Basic ' + this.btoa(username + ':' + password),
      "Content-Type":'application/octet-stream'
    };
    const response = await this.fetch(url, {
        method: 'PUT',
        headers: headers,
        body: fileContent
    });
    return response
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
}
class MNButton{
  static get highlightColor(){
    return UIColor.blendedColor(
      UIColor.colorWithHexString("#2c4d81").colorWithAlphaComponent(0.8),
      MNUtil.app.defaultTextColor,
      0.8
    );
  }
  /**
   *
   * @param {{color:string,title:string,bold:boolean,font:number,opacity:number,radius:number}} config
   * @param {UIView} superView
   */
  static new(config = {},superView){
    let newButton = UIButton.buttonWithType(0);
    newButton.autoresizingMask = (1 << 0 | 1 << 3);
    newButton.layer.masksToBounds = true;
    newButton.setTitleColorForState(UIColor.whiteColor(),0);
    newButton.setTitleColorForState(this.highlightColor, 1);
    let radius = ("radius" in config) ? config.radius : 8
    newButton.layer.cornerRadius = radius;
    this.setConfig(newButton, config)
    if (superView) {
      superView.addSubview(newButton)
    }
    return newButton
  }
  constructor(config){
    this.button = UIButton.buttonWithType(0);
    MNButton.setConfig(this.button, config)
  }
//   static createButton(superview,config) {
//     let button = UIButton.buttonWithType(0);
//     button.autoresizingMask = (1 << 0 | 1 << 3);
//     button.setTitleColorForState(UIColor.whiteColor(),0);
//     button.setTitleColorForState(this.highlightColor, 1);
//     button.backgroundColor = this.hexColorAlpha("#9bb2d6",0.8)
//     button.layer.cornerRadius = 8;
//     button.layer.masksToBounds = true;
//     button.titleLabel.font = UIFont.systemFontOfSize(16);
//     if (superview) {
//       superview.addSubview(button)
//     }
//     this.setConfig(button, config)
//     return button
// }
  /**
   * Creates a color from a hex string with an optional alpha value.
   * 
   * This method takes a hex color string and an optional alpha value, and returns a UIColor object.
   * If the alpha value is not provided, the color is returned without modifying its alpha component.
   * 
   * @param {string} hex - The hex color string (e.g., "#RRGGBB").
   * @param {number} [alpha=1.0] - The alpha value (opacity) of the color, ranging from 0.0 to 1.0.
   * @returns {UIColor} The UIColor object representing the specified color with the given alpha value.
   */
  static hexColorAlpha(hex,alpha) {
    let color = UIColor.colorWithHexString(hex)
    return alpha!==undefined?color.colorWithAlphaComponent(alpha):color
  }
  static setColor(button,hexColor,alpha = 1.0){
    button.backgroundColor = this.hexColorAlpha(hexColor, alpha)
  }
  static setTitle(button,title,font = 16,bold= false){
    button.setTitleForState(title,0)
    if (bold) {
      button.titleLabel.font = UIFont.boldSystemFontOfSize(font)
    }else{
      button.titleLabel.font = UIFont.systemFontOfSize(font)
    }
  }
  /**
   *
   * @param {UIButton} button
   * @param {string|NSData} path
   */
  static setImage(button,path,scale){
    if (typeof path === "string") {
      button.setImageForState(MNUtil.getImage(path,scale),0)
    }else{
      button.setImageForState(path, 0)
    }
  }
  static setOpacity(button,opacity){
    button.layer.opacity = opacity


  }
  static setRadius(button,radius = 8){
    button.layer.cornerRadius = radius;
  }
/**
   * 设置按钮的配置
   *
   * @param {UIButton} button - 要设置配置的按钮对象
   * @param {{color: string, title: string, bold: boolean, font: number, opacity: number, radius: number, image?: string, scale?: number}} config - 配置对象
   */
  static setConfig(button, config) {
    if ("color" in config) {
      this.setColor(button, config.color, config.alpha);
    }
    if ("title" in config) {
      this.setTitle(button, config.title, config.font, config.bold);
    }
    if ("opacity" in config) {
      this.setOpacity(button, config.opacity);
    }
    if ("radius" in config) {
      this.setRadius(button, config.radius);
    }
    if ("image" in config) {
      this.setImage(button, config.image, config.scale);
    }
  }


}

class MNNote{
  /**
   * 夏大鱼羊定制 - MNNote - begin
   */
  /**
   * 卡片变成归类卡片信息汇总卡片
   */
  toBeClassificationInfoNote() {
    let classificationIdsArr = [
      {
        id: "3572E6DC-887A-4376-B715-04B6D8F0C58B",
        name: "学习规划"
      },
      {
        id: "E1EACEC5-3ACD-424B-BD46-797CD8A56629",
        name: "泛函分析与算子理论"
      },
      {
        id: "B27D8A02-BDC4-4D3F-908B-61AA19CBB861",
        name: "复分析"
      },
      {
        id: "13623BE8-8D26-4FEE-95D8-B704C34E92EC",
        name: "实分析与调和分析"
      },
      {
        id: "F6CE6E2C-4126-4945-BB98-F2437F73C806",
        name: "数学基础"
      },
      {
        id: "0164496D-FA35-421A-8A22-649831C83E63",
        name: "高等代数"
      },
      {
        id: "C7768D8F-3BD3-4D9F-BC82-C3F12701E7BF",
        name: "数学分析"
      }
    ]

    this.clearAllComments()
    this.colorIndex = 0
    classificationIdsArr.forEach(
      info => {
        let classificationNote = MNNote.new(info.id)
        if (classificationNote) {
          let childNotesNum = classificationNote.descendantNodes.descendant.length - 1  // 去掉归类卡片自己
          if (info.name == "学习规划") {
            if (childNotesNum > 6) {
              // 因为学习规划有六张本来就有的
              this.appendMarkdownComment("「" + info.name + "」还剩 " + childNotesNum + " 张卡片未归类")
              this.appendNoteLink(classificationNote, "To")
              this.colorIndex = 3
            }
          } else {
            if (childNotesNum > 0) {
              this.appendMarkdownComment("「" + info.name + "」还剩 " + childNotesNum + " 张卡片未归类")
              this.appendNoteLink(classificationNote, "To")
              this.colorIndex = 3
            }
          }
        }
      }
    )
  }
  /**
   * 卡片去掉所有评论
   */
  clearAllComments(){
    for (let i = this.comments.length -1; i >= 0; i--) {
      this.removeCommentByIndex(i)
    }
  }
  /**
   * 【数学】把证明的内容移到最下方
   * 
   * 一般用于重新写证明
   */
  moveProofDown() {
    let proofIndexArr = this.getHtmlBlockContentIndexArr("证明：")
    if (proofIndexArr.length > 0) {
      this.moveCommentsByIndexArrTo(proofIndexArr, "bottom")
    }
  }
  /**
   * 更新卡片学习状态
   */
  /**
   * 让卡片成为进度卡片
   * - 在学习规划学习集中，某些卡片起了大头钉的作用，下次能知道从哪里开始看
   * 
   * 1. 卡片变成灰色
   * 2. 找到摘录对应的 md5
   * 3. 找到学习规划学习集中对应的卡片
   * 4. 将卡片移动到学习规划学习集中对应的卡片下成为子卡片
   */
  toBeProgressNote(){
    let docMd5 = MNUtil.currentDocmd5
    let targetNote = MNNote.new(MNUtil.getNoteIdByMd5InPlanNotebook(docMd5))
    if (targetNote) {
      targetNote.addChild(this)
      this.colorIndex = 13 // 灰色
      // bug 添加到卡片的兄弟卡片了而不是变成子卡片
    }
  }
  /**
   * 让卡片独立出来
   */
  toBeIndependent(){
    let parentNote = this.getClassificationParentNote()
    parentNote.addChild(this)
    this.focusInMindMap(0.5)
  }
  /**
   * 将卡片转移到“输入”区
   */
  moveToInput(){
    let notebookId = MNUtil.currentNotebookId
    let workflowObj = MNUtil.getWorkFlowObjByNoteBookId(notebookId)
    if (workflowObj.inputNoteId) {
      let inputNoteId = workflowObj.inputNoteId
      let inputNote = MNNote.new(inputNoteId)
      inputNote.addChild(this)
      this.focusInMindMap(0.8)
    }
  }
  /**
   * 将卡片转移到“内化”区
   */
  moveToInternalize(){
    let notebookId = MNUtil.currentNotebookId
    let workflowObj = MNUtil.getWorkFlowObjByNoteBookId(notebookId)
    if (workflowObj.internalizationNoteId) {
      let internalizationNoteId = workflowObj.internalizationNoteId
      let internalizationNote = MNNote.new(internalizationNoteId)
      internalizationNote.addChild(this)
      if (this.title.includes("输入")) {
        this.changeTitle()
        this.linkParentNote()
      }
      this.focusInMindMap(1)
    }
  }
  /**
   * 将卡片转移到“待归类”区
   */
  moveToBeClassified(targetNoteId){
    let notebookId = MNUtil.currentNotebookId
    let workflowObj = MNUtil.getWorkFlowObjByNoteBookId(notebookId)
    let toClassifyNoteId = (targetNoteId == undefined)?workflowObj.toClassifyNoteId:targetNoteId
    let toClassifyNote = MNNote.new(toClassifyNoteId)
    if (toClassifyNote) {
      toClassifyNote.addChild(this)
      this.changeTitle()
      this.linkParentNote()
      this.addToReview()
    }
  }
  /**
   * 【数学】加入复习
   */
  addToReview() {
    if (
      !(
        this.noteTitle.includes("输入") ||
        this.noteTitle.includes("内化")
      )
    ) {
      if (this.getNoteTypeZh() !== "顶层" && this.getNoteTypeZh() !== "归类") {
        if (!MNUtil.isNoteInReview(this.noteId)) {  // 2024-09-26 新增的 API
          MNUtil.excuteCommand("AddToReview")
        }
      }
    }
  }
  /**
   * 根据 indexarr 和弹窗按钮确定移动的位置
   */
  moveCommentsByIndexArrAndButtonTo(indexArr, popUpTitle = "移动评论到", popUpSubTitle = "") {
    UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
      popUpTitle,
      popUpSubTitle,
      0,
      "取消",
      [
        "🔝🔝🔝🔝卡片最顶端🔝🔝🔝🔝",
        "----------【摘录区】----------",
        "🔝Top🔝",
        "⬇️ Bottom ⬇️",
        "----------【证明区】----------",
        "🔝Top🔝",
        "⬇️ Bottom ⬇️",
        "----------【相关思考区】----------",
        "🔝Top🔝",
        "⬇️ Bottom ⬇️",
      ],
      (alert, buttonIndex) => {
        switch (buttonIndex) {
          case 1:  // 卡片最顶端
            this.moveCommentsByIndexArrTo(indexArr, "top")
            break;
          case 3:  // 摘录区最顶端
            this.moveCommentsByIndexArrTo(indexArr, "excerpt", false)
            break;
          case 4:  // 摘录区最底部
            this.moveCommentsByIndexArrTo(indexArr, "excerpt")
            break;
          case 6:  // 证明区最顶端
            this.moveCommentsByIndexArrTo(indexArr, "proof", false)
            break;
          case 7:  // 证明区最底部
            this.moveCommentsByIndexArrTo(indexArr, "proof")
            break;
          case 9:  // 相关思考区最顶端
            this.moveCommentsByIndexArrTo(indexArr, "think", false)
            break;
          case 10:  // 相关思考区最底部
            this.moveCommentsByIndexArrTo(indexArr, "think")
            break;
        }

        MNUtil.undoGrouping(()=>{
          this.refresh()
        })
      }
    )
  }
  /**
   * 将 IdArr 里的 ID 对应的卡片剪切到 this 作为子卡片
   */
  pasteChildNotesByIdArr(arr) {
    arr.forEach((id) => {
      if (id.isNoteIdorURL()) {
        this.pasteChildNoteById(id.toNoteId())
      }
    })
  }

  pasteChildNoteById(id) {
    if (typeof id == "string" && id.isNoteIdorURL()) {
      let targetNote = MNNote.new(id.toNoteId())
      if (targetNote) {
        let config = {
          title: targetNote.noteTitle,
          content: "",
          markdown: true,
          color: targetNote.colorIndex
        }
        // 创建新兄弟卡片，标题为旧卡片的标题
        let newNote = this.createChildNote(config)
        targetNote.noteTitle = ""
        // 将旧卡片合并到新卡片中
        targetNote.mergeInto(newNote)
      }
    }
  }
  /**
   * 获取第一个标题链接词并生成标题链接
   */
  generateCustomTitleLinkFromFirstTitlelinkWord(keyword) {
    let title = this.title
    if (title.isKnowledgeNoteTitle()) {
      let firstTitleLinkWord = this.getFirstTitleLinkWord()
      return MNUtil.generateCustomTitleLink(keyword, firstTitleLinkWord)
    } else {
      return MNUtil.generateCustomTitleLink(keyword, title)
    }
  }
  /**
   * 获取标题的所有标题链接词
   */
  getTitleLinkWordsArr(){
    let title = this.noteTitle
    let titleLinkWordsArr = []
    if (title.isKnowledgeNoteTitle()) {
      let titlePart = title.toKnowledgeNoteTitle()
      // titlePart 用 ; 分割，然后以此加入到 titleLinkWordsArr 中
      titlePart.split(";").forEach((part) => {
        if (part.trim() !== "") {
          titleLinkWordsArr.push(part.trim())
        }
      })
    } else {
      titleLinkWordsArr.push(title)
    }
    return titleLinkWordsArr
  }
  /**
   * 获取标题中的第一个标题链接词
   */
  getFirstTitleLinkWord(){
    let title = this.noteTitle
    if (title.isKnowledgeNoteTitle()) {
      const regex = /【.*】(.*?);?\s*([^;]*?)(?:;|$)/;
      const matches = title.match(regex);
    
      if (matches) {
        const firstPart = matches[1].trim(); // 提取分号前的内容
        const secondPart = matches[2].trim(); // 提取第一个分号后的内容
    
        // 根据第一部分是否为空选择返回内容
        return firstPart === '' ? secondPart : firstPart;
      }
    } else {
      return title
    }
  }

  /**
   * 判断卡片的前缀是否包含
   * - 输入
   * - 内化
   * - 待归类
   */
  ifNoteTemporary(){
    return ["输入","内化","待归类"].some(keyword => this.title.includes(keyword))
  }
  
  /**
   * 【数学】修改和处理卡片标题
   * - 知识类卡片增加标题前缀
   * - 黄色归类卡片：“”：“”相关 xx
   * - 绿色归类卡片：“”相关 xx
   * - 处理卡片标题空格
   * 
   * @param {string} type - 针对归类卡片的类型
   */
  changeTitle(type) {
    let noteType = this.getNoteTypeZh()
    // let topestClassificationNote = this.getTopestClassificationNote()
    let classificationNoteType
    let title = this.noteTitle
    let parentNoteType = this.parentNote.getNoteTypeZh()
    let parentNoteTitle
    switch (noteType) {
      case "顶层":
        classificationNoteType = this.getTopWhiteNoteType()
        if (!title.isGreenClassificationNoteTitle()) {
          title = "“" + title + "”" + "相关" + classificationNoteType
        }
        break;
      case "归类":
        if (!title.isYellowClassificationNoteTitle()) {
          // 此时不是黄色卡片标题结构
          if (
            !this.isIndependentNote() ||
            (
              /**
               * 此时为 Inbox 的特殊情况
               */
              this.getNoteTypeObjByClassificationParentNoteTitle().en == "temporary"
            )
          ) {
            // 有归类父卡片
            if (parentNoteType == "定义") {
              // 也就是此时卡片的父卡片是一张定义类卡片
              // 此时为基于定义类卡片生成归类卡片
              classificationNoteType = type?type:this.getNoteTypeObjByClassificationParentNoteTitle().zh
              parentNoteTitle = this.parentNote.getFirstTitleLinkWord()
            } else {
              // 其余情况为正常归类
              classificationNoteType = this.getNoteTypeObjByClassificationParentNoteTitle().zh
              parentNoteTitle = this.parentNote.noteTitle.toClassificationNoteTitle()
            }
            // 修改标题
            this.title = "“" + parentNoteTitle + "”：“" + title + "”" + "相关" + classificationNoteType
          }
        } else {
          /**
           * 如果已经是黄色归类卡片的标题结构，此时需要
           * - 获取第一个括号的内容
           */
          if (
            !this.isIndependentNote() ||
            (
              /**
               * 此时为 Inbox 的特殊情况
               */
              this.getNoteTypeObjByClassificationParentNoteTitle().en == "temporary"
            )
          ) {
            // 有归类父卡片
            if (parentNoteType == "定义") {
              // 也就是此时卡片的父卡片是一张定义类卡片
              // 此时为基于定义类卡片生成归类卡片
              classificationNoteType = type?type:this.getNoteTypeObjByClassificationParentNoteTitle().zh
              parentNoteTitle = this.parentNote.getFirstTitleLinkWord()
            } else {
              // 其余情况为正常归类
              classificationNoteType = this.getNoteTypeObjByClassificationParentNoteTitle().zh
              parentNoteTitle = this.parentNote.noteTitle.toClassificationNoteTitle()
            }
            // 修改标题
            this.title = "“" + parentNoteTitle + "”：“" + title.toClassificationNoteTitle() + "”" + "相关" + classificationNoteType
          }
        }
        break;
      default:
        if (
          !this.isIndependentNote() ||
          (
            /**
             * 此时为 Inbox 的特殊情况
             */
            this.getNoteTypeObjByClassificationParentNoteTitle().en == "temporary"
          )
        ) {
          // type = this.getNoteTypeObjByClassificationParentNoteTitle().zh
          // noteType = this.getNoteTypeZh()
          parentNoteTitle = this.getClassificationParentNote().noteTitle.toClassificationNoteTitle()
          if (title.ifKnowledgeNoteTitle()) {
            /**
             * 已经有前缀了，先获取不带前缀的部分作为 title
             */
            let prefix = title.toKnowledgeNotePrefix() // 要放在下面的 title 处理之前，因为 title 处理之后会改变 title 的值
            title = title.toKnowledgeNoteTitle()
            /**
             * 如果是临时卡片，就直接重新弄前缀
             */
            if (this.ifNoteTemporary()) {
              if (type == "定义") {
                this.title = "【" + type + "：" + parentNoteTitle + "】; " + title
              } else {
                this.title = "【" + type + "：" + parentNoteTitle + "】" + title
              }
            } else {
              /**
               * 需要检测前缀的结尾是否在「上一个」 parentNoteTitle 的基础上增加了“：xxx”的结构
               * 此时的场景一般是：修改知识点卡片的归类卡片
               */
              // 先获取到旧的 parentNoteTitle。虽然可能出现“相关链接：”下方没有链接的情况，但是考虑到此时已经有前缀了，所以这个情况基本不会出现，除非是原归类卡片被删除的情况，所以就看能不能找到原归类卡片，找得到的话就增加判断是否多了结构，找不到的话直接按照现归类卡片的标题来处理即可。
              if (this.getHtmlCommentIndex("相关链接：") < this.comments.length-1) {
                let oldClassificationNoteId = this.comments[this.getHtmlCommentIndex("相关链接：")+1]
                if (oldClassificationNoteId.text && oldClassificationNoteId.text.isLink()) {
                  /**
                   * 是链接的话基本就是对应原归类卡片
                   */
                  let oldClassificationNote = MNNote.new(oldClassificationNoteId.text.toNoteId())
                  let oldClassificationNoteTitle = oldClassificationNote.noteTitle.toClassificationNoteTitle()
                  if (prefix === oldClassificationNoteTitle) {
                    /**
                     * 此时说明没有修改旧前缀
                     * 那就直接按照新归类卡片来
                     */
                    if (type == "定义") {
                      this.title = "【" + type + "：" + parentNoteTitle + "】; " + title
                    } else {
                      this.title = "【" + type + "：" + parentNoteTitle + "】" + title
                    }
                  } else if (prefix.startsWith(oldClassificationNoteTitle)) {
                    /**
                     * 此时说明修改了旧前缀，此时需要获取到修改的部分
                     */
                    let newContent = prefix.slice(oldClassificationNoteTitle.length)
                    if (type == "定义") {
                      this.title = "【" + type + "：" + parentNoteTitle + newContent + "】; " + title
                    } else {
                      this.title = "【" + type + "：" + parentNoteTitle + newContent + "】" + title
                    }
                  } else {
                    if (type == "定义") {
                      this.title = "【" + type + "：" + parentNoteTitle + "】; " + title
                    } else {
                      this.title = "【" + type + "：" + parentNoteTitle + "】" + title
                    }
                  }
                } else {
                  /**
                   * 否则说明原归类卡片不存在了
                   * 那就直接按照新归类卡片来
                   */
                  if (type == "定义") {
                    this.title = "【" + type + "：" + parentNoteTitle + "】; " + title
                  } else {
                    this.title = "【" + type + "：" + parentNoteTitle + "】" + title
                  }
                }
              }
            }
          } else {
            /**
             * 没有前缀，但需要检测是否有旧卡片本来带的【】开头的内容，去掉后加前缀
             */
            // MNUtil.showHUD("hahaha ")
            this.title = this.title.replace(/^【[^】]*】/, "");
            if (noteType == "定义") {
              this.title = "【" + noteType + "：" + parentNoteTitle + "】; " + title
            } else {
              this.title = "【" + noteType + "：" + parentNoteTitle + "】" + title
            }
          }
        }
        break;
    }
    // 最后处理一下标题的空格
    this.title = Pangu.spacing(this.title)
  }
  /**
   * 【数学】与父卡片进行链接
   * 1. 先识别是否已经进行了链接，如果有的话就删掉 this 的相关链接的第一条和对应归类卡片里的 this 链接
   * 2. 没有的话就进行双向链接，并且将链接移动到“相关链接：”下方
   * 
   * 【TODO】如果是输入、内化、待归类卡片，则不需要进行链接
   */
  linkParentNote(){
    if (
      !this.ifIndependentNote() ||
      this.getNoteTypeObjByClassificationParentNoteTitle().en == "temporary"
    ) {
      // 有归类的卡片，此时才进行链接
      let noteType = this.getNoteTypeZh()
      let belongHtmlBlockContentIndexArr
      switch (noteType) {
        case "顶层":
          // 绿色的顶层卡片
          belongHtmlBlockContentIndexArr = this.getHtmlBlockContentIndexArr("所属：")
          if (belongHtmlBlockContentIndexArr.length !== 0) {
            // 此时说明有链接，需要先删除
            let oldBelongIndex = belongHtmlBlockContentIndexArr[0]
            let oldLink = this.comments[oldBelongIndex].text
            let oldLinkedNote = MNNote.new(oldLink.toNoteId())
            let indexInOldLinkedNote = oldLinkedNote.getCommentIndex(this.noteURL)
            if (indexInOldLinkedNote !== -1) {
              oldLinkedNote.removeCommentByIndex(indexInOldLinkedNote)
            }
            this.removeCommentByIndex(oldBelongIndex)
    
            // 重新链接
            let topestClassificationNote = this.getTopestClassificationNote()
            if (topestClassificationNote) {
              let indexInTopestClassificationNote = topestClassificationNote.getCommentIndex(this.noteURL)
              if (indexInTopestClassificationNote == -1) {
                topestClassificationNote.appendNoteLink(this, "To")
              }
              this.appendNoteLink(topestClassificationNote, "To")
              this.moveComment(this.comments.length-1, oldBelongIndex)
            }
          } else {
            // 此时说明原来没有链接，所以直接链接就行
            let topestClassificationNote = this.getTopestClassificationNote()
            let indexInTopestClassificationNote = topestClassificationNote.getCommentIndex(this.noteURL)
            let topestClassificationNoteIndexInThis = this.getCommentIndex(topestClassificationNote.noteURL)
            if (topestClassificationNote) {
              // 链接到父卡片
              if (indexInTopestClassificationNote == -1) {
                topestClassificationNote.appendNoteLink(this, "To")
              }
              // 父卡片链接过来
              if (topestClassificationNoteIndexInThis == -1) {
                this.appendNoteLink(topestClassificationNote, "To")
                this.moveComment(this.comments.length-1, this.getHtmlCommentIndex("所属：")+1)
              } else {
                this.moveComment(topestClassificationNoteIndexInThis, this.getHtmlCommentIndex("所属：")+1)
              }
            }
          }
          break;
        case "归类":
          /**
           * 需要判断父卡片是不是定义类卡片，因为与定义类卡片的归类不删除
           * 然后后续即使已经和定义类卡片链接了，和其他归类卡片链接时，要把链接移动到第一个
           * 这样的话后续更改父卡片时可以进行链接的修改
           */
          belongHtmlBlockContentIndexArr = this.getHtmlBlockContentIndexArr("所属：")
          if (belongHtmlBlockContentIndexArr.length !== 0) {
            // 此时说明有链接，需要先删除
            let oldBelongIndex = belongHtmlBlockContentIndexArr[0]
            let oldLink = this.comments[oldBelongIndex].text
            let oldLinkedNote = MNNote.new(oldLink.toNoteId())
            if (oldLinkedNote.colorIndex !== 2) { // 如果是定义类卡片（此时对应的是从概念出发生成的归类），那么就不删除
              let indexInOldLinkedNote = oldLinkedNote.getCommentIndex(this.noteURL)
              if (indexInOldLinkedNote !== -1) {
                oldLinkedNote.removeCommentByIndex(indexInOldLinkedNote)
              }
              this.removeCommentByIndex(oldBelongIndex)
            } 
    
            // 重新链接
            if (this.parentNote) {
              let indexInParentNote = this.parentNote.getCommentIndex(this.noteURL)
              if (indexInParentNote == -1) {
                this.parentNote.appendNoteLink(this, "To")
              }
              this.appendNoteLink(this.parentNote, "To")
              this.moveComment(this.comments.length-1, oldBelongIndex)
            }
          } else {
            let parentNote = this.parentNote
            let indexInParentNote = parentNote.getCommentIndex(this.noteURL)
            let parentNoteIndexInThis = this.getCommentIndex(parentNote.noteURL)
            if (parentNote) {
              // 链接到父卡片
              if (indexInParentNote == -1) {
                parentNote.appendNoteLink(this, "To")
              }
              // 父卡片链接过来
              if (parentNoteIndexInThis == -1) {
                this.appendNoteLink(parentNote, "To")
                this.moveComment(this.comments.length-1, this.getHtmlCommentIndex("所属：")+1)
              } else {
                this.moveComment(parentNoteIndexInThis, this.getHtmlCommentIndex("所属：")+1)
              }
            }
          }
          break;
        default:
          // 知识点卡片
          let linksHtmlBlockContentIndexArr = this.getHtmlBlockContentIndexArr("相关链接：")
          if (linksHtmlBlockContentIndexArr.length !== 0){
            // 此时说明有链接，需要先删除
            let oldLinkIndex = linksHtmlBlockContentIndexArr[0]
            let oldLink = this.comments[oldLinkIndex].text
            let oldClassificationNote = MNNote.new(oldLink.toNoteId())
            let indexInOldClassificationNote = oldClassificationNote.getCommentIndex(this.noteURL)
            if (indexInOldClassificationNote !== -1) {
              oldClassificationNote.removeCommentByIndex(indexInOldClassificationNote)
            }
            this.removeCommentByIndex(oldLinkIndex)
    
            // 重新链接
            let parentNote = this.getClassificationParentNote()
            let indexInParentNote = parentNote.getCommentIndex(this.noteURL)
            if (parentNote) {
              // 链接到父卡片
              if (indexInParentNote == -1) {
                parentNote.appendNoteLink(this, "To")
              }
              // 父卡片链接过来
              this.appendNoteLink(parentNote, "To")
              this.moveComment(this.comments.length-1, oldLinkIndex)
            }
          } else {
            // 此时没有旧链接，直接链接即可
            let parentNote = this.getClassificationParentNote()
            let indexInParentNote = parentNote.getCommentIndex(this.noteURL)
            let parentNoteIndexInThis = this.getCommentIndex(parentNote.noteURL)
            let targetIndex = this.getHtmlCommentIndex("相关链接：") == this.comments.length-1 ? this.comments.length : this.getHtmlCommentIndex("相关链接：")+1
            if (parentNote) {
              // 链接到父卡片
              if (indexInParentNote == -1) {
                parentNote.appendNoteLink(this, "To")
              }
              // 父卡片链接过来
              if (parentNoteIndexInThis == -1) {
                this.appendNoteLink(parentNote, "To")
                this.moveComment(this.comments.length-1, targetIndex)
              } else {
                this.moveComment(parentNoteIndexInThis, targetIndex)
              }
            }
          }
          break;
      }
    }
  }
  /**
   * 【数学】获取到归类卡片、知识卡片最顶的第一个白色卡片
   */
  getTopWhiteNote(){
    let whiteNote
    // 先选到第一个白色的父卡片
    if (this.note.colorIndex == 12) {
      // 如果选中的就是白色的（比如刚建立专题的时候）
      whiteNote = this
    } else {
      whiteNote = this.parentNote
      while (whiteNote.colorIndex !== 12) {
        whiteNote = whiteNote.parentNote
      }
    }

    return whiteNote
  }
  /**
   * 【数学】获得到归类卡片、知识卡片最顶的第一个白色卡片的类型
   */
  getTopWhiteNoteType(){
    let whiteNote = this.getTopWhiteNote()
    let type
    const typeRegex = /^(.*)（/; // 匹配以字母或数字开头的字符直到左括号 '('
    
    const match = whiteNote.noteTitle.match(typeRegex);
    if (match) {
      type = match[1]; // 提取第一个捕获组的内容
    }

    return type
  }
  /**
   * 【数学】获得最顶层的归类卡片：绿色的上层的上层
   */
  getTopestClassificationNote(){
    let whiteNote = this.getTopWhiteNote()

    return whiteNote.parentNote
  }
  /**
   * 【数学】根据卡片类型自动修改颜色
   */
  changeColorByType(){
    if (!this.isIndependentNote()) {
      // 有归类的卡片。此时才需要根据父卡片的标题来判断卡片类型来改变卡片颜色
      let noteType = this.getNoteTypeZh()
      switch (noteType) {
        case "顶层":
          this.note.colorIndex = 1
          break;
        case "归类":
          if (this.parentNote.getNoteTypeZh() == "顶层") {
            this.note.colorIndex = 4
          } else {
            this.note.colorIndex = 0
          }
          break;
        default:
          let noteType = this.getNoteTypeObjByClassificationParentNoteTitle()
          let colorIndex = MNUtil.getNoteColorIndexByZhType(noteType.zh)
          this.note.colorIndex = colorIndex
          break;
      }
    }
  }
  /**
   * 【数学】合并模板卡片
   * 1. 识别父卡片的标题，来判断卡片是什么类型
   * 2. 根据卡片类型，合并不同的模板卡片
   * 3. 识别是否有摘录外的内容
   *   - 有的话就移动到
   *     - “证明：”下方（非概念类型卡片）
   *     - “相关思考下方”（概念卡片）
   *   - 没有的话就直接合并模板
   */
  mergeTemplate(){
    let noteType = this.getNoteTypeZh()
    // 要在合并模板之前获取，否则会把 Html 评论移动
    let contentIndexArr = this.getContentWithoutLinkNoteTypeIndexArr()

    if (this.ifIndependentNote()) {  
      if (this.getHtmlCommentIndex("相关思考：") == -1) {
        this.mergeTemplateByNoteType(noteType)

        /**
           * 把除了摘录外的其他内容移动到对应的位置
           * 定义的默认到“相关思考：”下方
           * 其他的默认到“证明：”下方
           */
        if (contentIndexArr.length !== 0) {
          switch (noteType.zh) {
            case "定义":
              let thoughtHtmlCommentIndex = this.getHtmlCommentIndex("相关思考：")
              this.moveComment(thoughtHtmlCommentIndex, contentIndexArr[0])
              // 注意相关概念的 index 要放在移动后取，否则移动后 index 会发生变化
              let conceptHtmlCommentIndex = this.getHtmlCommentIndex("相关概念：")
              this.moveComment(conceptHtmlCommentIndex, contentIndexArr[0])
              break;
            default:
              let proofHtmlCommentIndex = this.getProofHtmlCommentIndexByNoteType(noteType)
              if (this.ifCommentsAllLinksByIndexArr(contentIndexArr)) {
                // 如果全是链接，就放在应用下方，其实刚合并的话就是放在最下方
                this.moveCommentsByIndexArrTo(contentIndexArr, "applications", false)
              } else {
                // 如果有非链接，就放到证明下方
                this.moveComment(proofHtmlCommentIndex, contentIndexArr[0])
              }
              break;
          }
        }
      }
    } else {
      if (noteType == "归类" || noteType == "顶层") {
        /**
         * 归类卡片
         */
        // 和原本的处理不同，这里也采用合并模板的方式
        if (this.getHtmlCommentIndex("包含：") == -1) {
          this.mergeTemplateByNoteType(noteType)
        }
      } else {
        /**
         * 知识点卡片
         */
        if (this.getHtmlCommentIndex("相关思考：") == -1) {
          // 合并模板
          noteType = this.getNoteTypeObjByClassificationParentNoteTitle()
          this.mergeTemplateByNoteType(noteType)
    
          /**
           * 把除了摘录外的其他内容移动到对应的位置
           * 定义的默认到“相关思考：”下方
           * 其他的默认到“证明：”下方
           */
          if (contentIndexArr.length !== 0) {
            switch (noteType.zh) {
              case "定义":
                let thoughtHtmlCommentIndex = this.getHtmlCommentIndex("相关思考：")
                this.moveComment(thoughtHtmlCommentIndex, contentIndexArr[0])
                // 注意相关概念的 index 要放在移动后取，否则移动后 index 会发生变化
                let conceptHtmlCommentIndex = this.getHtmlCommentIndex("相关概念：")
                this.moveComment(conceptHtmlCommentIndex, contentIndexArr[0])
                break;
              default:
                let proofHtmlCommentIndex = this.getProofHtmlCommentIndexByNoteType(noteType)
                if (this.ifCommentsAllLinksByIndexArr(contentIndexArr)) {
                  // 如果全是链接，就放在应用下方，其实刚合并的话就是放在最下方
                  this.moveCommentsByIndexArrTo(contentIndexArr, "applications", false)
                } else {
                  // 如果有非链接，就放到证明下方
                  this.moveComment(proofHtmlCommentIndex, contentIndexArr[0])
                }
                break;
            }
          }
        }
      }
    }
  }
  /**
   * 检测 indexArr 对应的评论是否全是链接
   */
  ifCommentsAllLinksByIndexArr(indexArr){
    let flag = true
    indexArr.forEach((index) => {
      if (
        this.comments[index].type !== "TextNote" ||
        !this.comments[index].text.isLink()
      ) {
        flag = false
      }
    })

    return flag
  }
  /**
   * 【数学】获取“证明”系列的 Html 的 index
   *  因为命题、反例、思想方法的“证明：”叫法不同
   */
  getProofHtmlCommentIndexByNoteType(type){
    if (MNUtil.isObj(type)) {
      type = type.zh
    } 
    let proofHtmlCommentIndex
    switch (type) {
      case "反例":
        proofHtmlCommentIndex = this.getHtmlCommentIndex("反例及证明：")
        break;
      case "思想方法":
        proofHtmlCommentIndex = this.getHtmlCommentIndex("原理：")
        break;
      default:
        proofHtmlCommentIndex = this.getHtmlCommentIndex("证明：")
        break;
    }

    return proofHtmlCommentIndex
  }

  /**
   * 【数学】更新证明的 Html 的 index
   */
  getRenewProofHtmlCommentByNoteType(type){
    if (MNUtil.isObj(type)) {
      type = type.zh
    } 
    switch (type) {
      case "反例":
        if (this.getHtmlCommentIndex("证明：") !== -1) {
          this.removeCommentByIndex(this.getHtmlCommentIndex("证明："))
          this.mergeClonedNoteById("6ED0D29A-F57F-4B89-BFDA-58D5DFEB1F19")
          this.moveComment(this.comments.length-1, this.getHtmlCommentIndex("证明："))
        } else if (this.getHtmlCommentIndex("原理：") !== -1) {
          this.removeCommentByIndex(this.getHtmlCommentIndex("原理："))
          this.mergeClonedNoteById("6ED0D29A-F57F-4B89-BFDA-58D5DFEB1F19")
          this.moveComment(this.comments.length-1, this.getHtmlCommentIndex("原理："))
        }
        break;
      case "思想方法":
        if (this.getHtmlCommentIndex("证明：") !== -1) {
          this.removeCommentByIndex(this.getHtmlCommentIndex("证明："))
          this.mergeClonedNoteById("85F0FDF5-E1C7-4B38-80CA-7A3F3266B6A3")
          this.moveComment(this.comments.length-1, this.getHtmlCommentIndex("证明："))
        } else if (this.getHtmlCommentIndex("反例及证明：") !== -1) {
          this.removeCommentByIndex(this.getHtmlCommentIndex("反例及证明："))
          this.mergeClonedNoteById("85F0FDF5-E1C7-4B38-80CA-7A3F3266B6A3")
          this.moveComment(this.comments.length-1, this.getHtmlCommentIndex("反例及证明："))
        }
        break;
      default:
        if (this.getHtmlCommentIndex("反例及证明：") !== -1) {
          this.removeCommentByIndex(this.getHtmlCommentIndex("反例及证明："))
          this.mergeClonedNoteById("21D808AE-33D9-494A-9D99-04FFA5D9E455")
          this.moveComment(this.comments.length-1, this.getHtmlCommentIndex("反例及证明："))
        } else if (this.getHtmlCommentIndex("原理：") !== -1) {
          this.removeCommentByIndex(this.getHtmlCommentIndex("原理："))
          this.mergeClonedNoteById("21D808AE-33D9-494A-9D99-04FFA5D9E455")
          this.moveComment(this.comments.length-1, this.getHtmlCommentIndex("原理："))
        }
    }
  }
  /**
   * 获取除了 LinkNote 以外的 indexArr
   */
  getContentWithoutLinkNoteTypeIndexArr(){
    let indexArr = []
    for (let i = 0; i < this.comments.length; i++) {
      let comment = this.comments[i]
      if (comment.type !== "LinkNote") {
        indexArr.push(i)
      }
    }
    return indexArr
  }
  moveNewContent() {
    switch (this.getNoteTypeZh()) {
      case "定义":
        /**
         * 到“相关概念：”下方（定义类卡片）
         */
        this.moveNewContentTo("def")
        break;
      case "归类":
      case "顶层":
        /**
         * 到“相关思考：”下方
         */
        this.moveNewContentTo("thinking")
        break;
      default:
        /**
         * 移动新内容到“证明”下方（非定义类卡片）
         */
        this.moveNewContentTo("proof")
        break;
    }
  }
  /**
   * 移动新内容到对应的内容的某个地方
   * @param {String} target
   */
  moveNewContentTo(target, toBottom = true) {
    let newContentIndexArr = this.getNewContentIndexArr()
    let targetIndex
    switch (target) {
      /**
       * 证明
       */
      case "proof":
      case "Proof":
        if (toBottom) {
          targetIndex = this.getHtmlCommentIndex("相关思考：")
        } else {
          targetIndex = this.getProofHtmlCommentIndexByNoteType(this.getNoteTypeZh()) + 1
        }
        this.moveCommentsByIndexArr(newContentIndexArr, targetIndex)
        break;

      /**
       * 相关思考
       */
      case "thought":
      case "thoughts":
      case "think":
      case "thinks":
      case "thinking":
      case "idea":
      case "ideas":
        if (toBottom) {
          switch (this.getNoteTypeZh()) {
            case "定义":
              targetIndex = this.getHtmlCommentIndex("相关链接：")
              break;
            case "归类":
            case "顶层":
              targetIndex = this.getHtmlCommentIndex("包含：")
              break;
            default:
              targetIndex = this.getIncludingHtmlCommentIndex("关键词：")
              break;
          }
        } else {
          targetIndex = this.getHtmlCommentIndex("相关思考：") + 1
        }
        this.moveCommentsByIndexArr(newContentIndexArr, targetIndex)
        break;

      
      /**
       * 相关概念
       */
      case "def":
      case "definition":
      case "concept":
      case "concepts":
        if (this.getNoteTypeZh() == "定义") {
          if (toBottom) {
            targetIndex = this.getHtmlCommentIndex("相关思考：")
          } else {
            targetIndex = this.getHtmlCommentIndex("相关概念：") + 1
          }
          this.moveCommentsByIndexArr(newContentIndexArr, targetIndex)
        }
        break;

      /**
       * 相关链接
       */
      case "link":
      case "links":
      case "Link":
      case "Links":
        if (toBottom) {
          if (this.getNoteTypeZh() == "定义") {
            targetIndex = this.comments.length - 1
          } else {
            targetIndex = this.getHtmlCommentIndex("应用：")
          }
        } else {
          targetIndex = this.getHtmlCommentIndex("相关链接：") + 1
        }
        this.moveCommentsByIndexArr(newContentIndexArr, targetIndex)
        break;
    }
  }
  /**
   * 移动指定 index Arr 到对应的内容的某个地方
   */
  moveCommentsByIndexArrTo(indexArr, target, toBottom = true) {
    let targetIndex
    switch (target) {
      /**
       * 置顶
       */
      case "top":
        targetIndex = 0
        this.moveCommentsByIndexArr(indexArr, targetIndex)
        break;
      /**
       * 移动到最底下
       */
      case "bottom":
        targetIndex = this.comments.length - 1
        this.moveCommentsByIndexArr(indexArr, targetIndex)
        break;
      /**
       * 摘录区
       */
      case "excerpt":
      case "excerption":
        if (toBottom) {
          if (this.getNoteTypeZh() == "定义") {
            targetIndex = this.getHtmlCommentIndex("相关概念：")
          } else {
            // targetIndex = this.getHtmlCommentIndex("证明：")
            targetIndex = this.getProofHtmlCommentIndexByNoteType(this.getNoteTypeZh())
          }
        } else {
          // top 的话要看摘录区有没有摘录内容
          // - 如果有的话，就放在第一个摘录的前面
          // - 如果没有的话，就和摘录的 bottom 是一样的
          let excerptPartIndexArr = this.getExcerptPartIndexArr()
          if (excerptPartIndexArr.length == 0) {
            if (this.getNoteTypeZh() == "定义") {
              targetIndex = this.getHtmlCommentIndex("相关概念：")
            } else {
              // targetIndex = this.getHtmlCommentIndex("证明：")
              targetIndex = this.getProofHtmlCommentIndexByNoteType(this.getNoteTypeZh())
            }
          } else {
            targetIndex = excerptPartIndexArr[0]
          }
        }
        this.moveCommentsByIndexArr(indexArr, targetIndex)
        break;
      /**
       * 证明
       */
      case "proof":
      case "Proof":
        if (toBottom) {
          targetIndex = this.getHtmlCommentIndex("相关思考：")
        } else {
          targetIndex = this.getProofHtmlCommentIndexByNoteType(this.getNoteTypeZh()) + 1
        }
        this.moveCommentsByIndexArr(indexArr, targetIndex)
        break;

      /**
       * 相关思考
       */
      case "thought":
      case "thoughts":
      case "think":
      case "thinks":
      case "thinking":
      case "idea":
      case "ideas":
        if (toBottom) {
          if (this.getNoteTypeZh() == "定义") {
            targetIndex = this.getHtmlCommentIndex("相关链接：")
          } else {
            targetIndex = this.getIncludingHtmlCommentIndex("关键词：")
          }
        } else {
          targetIndex = this.getHtmlCommentIndex("相关思考：") + 1
        }
        this.moveCommentsByIndexArr(indexArr, targetIndex)
        break;

      
      /**
       * 相关概念
       */
      case "def":
      case "definition":
      case "concept":
      case "concepts":
        if (this.getNoteTypeZh() == "定义") {
          if (toBottom) {
            targetIndex = this.getHtmlCommentIndex("相关思考：")
          } else {
            targetIndex = this.getHtmlCommentIndex("相关概念：") + 1
          }
          this.moveCommentsByIndexArr(indexArr, targetIndex)
        }
        break;

      /**
       * 相关链接
       */
      case "link":
      case "links":
      case "Link":
      case "Links":
        if (toBottom) {
          if (this.getNoteTypeZh() == "定义") {
            targetIndex = this.comments.length - 1
          } else {
            targetIndex = this.getHtmlCommentIndex("应用：")
          }
        } else {
          targetIndex = this.getHtmlCommentIndex("相关链接：") + 1
        }
        this.moveCommentsByIndexArr(indexArr, targetIndex)
        break;


      /**
       * 应用
       */
      case "application":
      case "applications":
        if (!["定义", "归类", "顶层"].includes(this.getNoteTypeZh())) {
          if (toBottom) {
            targetIndex = this.comments.length - 1
          } else {
            targetIndex = this.getHtmlCommentIndex("应用：") + 1
          }
          this.moveCommentsByIndexArr(indexArr, targetIndex)
        }
        break;
    }
  }
  /**
   * 获取摘录区的 indexarr （制卡后）
   * 
   * 原理：
   * 判断卡片类型
   * - 定义：“相关概念：”前进行 LinkNote 评论的判断
   * - 其他：“证明：”（注意反例、思想方法的“证明：”叫法不同）前进行 LinkNote 评论的判断
   */
  getExcerptPartIndexArr() {
    let type = this.getNoteTypeZh()
    let indexArr = []
    let endIndex
    if (type == "定义") {
      endIndex = this.getHtmlCommentIndex("相关概念：")
    } else {
      endIndex = this.getProofHtmlCommentIndexByNoteType(type)
    }
    for (let i = 0; i < endIndex; i++) {
      let comment = this.comments[i]
      if (comment.type == "LinkNote") {
        indexArr.push(i)
      }
    }

    return indexArr
  }
  /**
   * 【数学】获取知识类卡片的新加内容的 Index
   * 原理是从应用部分的最后一条链接开始
   */
  getNewContentIndexArr() {
    let indexArr = []
    switch (this.getNoteTypeZh()) {
      case "定义":
        // 定义类卡片获取“相关链接：”下方的第一个非链接开始之后
        indexArr = this.getHtmlBlockNonLinkContentIndexArr("相关链接：")
        break;
      case "归类":
      case "顶层":
        // 归类类卡片获取“包含：”下方的第一个非链接开始之后
        indexArr = this.getHtmlBlockNonLinkContentIndexArr("包含：")
        break;
      default:
        // 非定义类卡片获取“应用”下方的第一个非链接开始之后
        indexArr = this.getHtmlBlockNonLinkContentIndexArr("应用：")
        // 应用部分有点特殊，需要防止“xxx 的应用：”这种文本也被识别，所以需要额外处理
        if (indexArr.length !== 0) {
          for (let i = 0; i < indexArr.length; i++) {
            let index = indexArr[i]
            let comment = this.comments[index]
            if (
              !MNUtil.isCommentLink(comment) &&
              (
                comment.text && 
                !comment.text.includes("的应用")
              )
            ) {
              indexArr = indexArr.slice(i)
              break
            }
          }
        }
        break;
    }
    return indexArr
  }
  /**
   * 获取某个 Html Block 中第一个非链接到最后的 Index Arr
   * 函数名中的 NonLink 不是指内容都是非链接
   * 而是指第一条是非链接，然后从这个开始到后面的都保留
   */
  getHtmlBlockNonLinkContentIndexArr (htmltext) {
    let indexArr = this.getHtmlBlockContentIndexArr(htmltext)
    let findNonLink = false
    if (indexArr.length !== 0) {
      // 从头开始遍历，检测是否是链接，直到找到第一个非链接就停止
      // bug：如果下方是链接，也会被识别
      for (let i = 0; i < indexArr.length; i++) {
        let index = indexArr[i]
        let comment = this.comments[index]
        if (!MNUtil.isCommentLink(comment)) {
          indexArr = indexArr.slice(i)
          findNonLink = true
          break
        }
      }
      if (!findNonLink) {
        // 防止只有链接时，仍然返回数组
        return []
      }
    }
    return indexArr
  }
  /**
   * 【数学】获取 this 的 noteType
   * 可能返回字符串，也可能返回对象
   */
  getNoteType() {
    let noteType
    if (this.ifIndependentNote()) {
      // 独立卡片根据颜色判断
      noteType = MNUtil.getNoteZhTypeByNoteColorIndex(this.note.colorIndex)
    } else {
      // 有归类父卡片则根据父卡片的标题判断
      noteType = this.getNoteTypeObjByClassificationParentNoteTitle()
    }
    return noteType
  }
  /**
   * 返回中文的 noteType
   */
  getNoteTypeZh() {
    let noteType
    let noteColorIndex = this.note.colorIndex
    if (this.ifIndependentNote()) {
      // 独立卡片根据颜色判断
      noteType = MNUtil.getNoteZhTypeByNoteColorIndex(this.note.colorIndex)
      return noteType
    } else {
      // 有归类父卡片则根据父卡片的标题判断
      if (noteColorIndex == 0 || noteColorIndex == 4) {
        /**
         * 黄色归类卡片
         */
        return "归类"
      } else if (noteColorIndex == 1) {
        /**
         * 绿色归类卡片
         */
        return "顶层"
      } else {
        noteType = this.getNoteTypeObjByClassificationParentNoteTitle()
        return noteType.zh
      }
    }
  }
  /**
   * 【数学】是否是独立卡片，即没有归类父卡片的卡片
   */
  ifIndependentNote(){
    if (this.note.colorIndex == 1) {
      // 绿色卡片单独处理，始终作为非独立卡片
      return false
    } else {
      let parentNote = this.getClassificationParentNote()
      if (parentNote === undefined) {
        return true
      } else {
        let parentNoteTitle = parentNote.noteTitle
        let match = parentNoteTitle.match(/“.*”相关(.*)/)
        // 如果归类卡片的“相关 xx”的 xx 是空的，此时作为 Inbox 专用归类，此时视为下面的知识类卡片为独立的
        return match[1] == ""
      }
    }
  }
  isIndependentNote(){
    return this.ifIndependentNote()
  }
  /**
   * 【数学】获得最新的一个“应用”的 Index
   * 除了 HtmlNote，后面可能出现“xxx 的应用：”，这些要避免被识别为新内容
   */
  /**
   * 【数学】根据归类的父卡片标题获取 note 的类型
   * @returns {Object} zh 和 en 分别是类型的中英文版本
   */
  getNoteTypeObjByClassificationParentNoteTitle(){
    let parentNote = this.getClassificationParentNote()
    let parentNoteTitle = parentNote.noteTitle
    let match = parentNoteTitle.match(/“.*”相关(.*)/)
    let noteType = {}
    if (match) {
      noteType.zh = match[1]
      noteType.en = MNUtil.getEnNoteTypeByZhVersion(noteType.zh)

      return noteType
    }
    return undefined
  }
  /**
   * 【数学】获取到第一次出现的黄色或绿色的父卡片
   * 检测父卡片是否是淡黄色、淡绿色或黄色的，不是的话获取父卡片的父卡片，直到是为止，获取第一次出现特定颜色的父卡片作为 parentNote
   */
  getClassificationParentNote(){
    let ifParentNoteChosen = false 
    let parentNote = this.parentNote
    if (parentNote) {
      while (parentNote) {
        if (parentNote.colorIndex == 0 || parentNote.colorIndex == 1 || parentNote.colorIndex == 4) {
          ifParentNoteChosen = true
          break
        }
        parentNote = parentNote.parentNote
      }
      if (!ifParentNoteChosen) {
        parentNote =  undefined
      }
      return parentNote
    } else {
      return undefined
    }
  }
  /**
   * 根据卡片类型合并不同的卡片
   */
  mergeTemplateByNoteType(type){
    let templateNoteId
    if (MNUtil.isObj(type)) {
      templateNoteId = MNUtil.getTemplateNoteIdByZhType(type.zh)
    } else if (typeof type == "string") {
      templateNoteId = MNUtil.getTemplateNoteIdByZhType(type)
    }
    this.mergeClonedNoteFromId(templateNoteId)
  }
  /**
   * 判断卡片是不是旧模板制作的
   */
  ifTemplateOldVersion(){
    // let remarkHtmlCommentIndex = this.getHtmlCommentIndex("Remark：")
    return this.getHtmlCommentIndex("Remark：") !== -1 || (this.getHtmlCommentIndex("所属：") !== -1 && this.getNoteTypeZh()!== "归类" && this.getNoteTypeZh()!== "顶层")
  }
  ifMadeByOldTemplate(){
    return this.ifTemplateOldVersion()
  }
  /**
   * 根据类型去掉评论
   */
  removeCommentsByTypes(types){
    if (typeof types == "string") {
      // 兼容 types 本身是字符串的情形
      this.removeCommentsByOneType(types)
    } else {
      if (Array.isArray(types)) {
        types.forEach(type => {
          this.removeCommentsByOneType(type)
        });
      }
    }
  }
  removeCommentsByType(type){
    this.removeCommentsByTypes(type)
  }
  /**
   * @param {String} type
   */
  removeCommentsByOneType(type){
    if (typeof type == "string") {
      switch (type) {
        /**
         * 链接
         */
        case "link":
        case "links":
        case "Link":
        case "Links":
        case "alllink":
        case "alllinks":
        case "allLink":
        case "allLinks":
          for (let i = this.comments.length-1; i >= 0; i--) {
            let comment = this.comments[i]
            if (
              comment.type == "TextNote" &&
              (
                comment.text.includes("marginnote3") ||
                comment.text.includes("marginnote4")
              )
            ) {
              this.removeCommentByIndex(i)
            }
          }
          break;
        
        /**
         * 手写
         */
        case "paint":
        case "painting":
        case "Paint":
        case "Painting":
        case "Handwriting":
        case "HandWriting":
        case "handwriting":
          for (let i = this.comments.length-1; i >= 0; i--) {
            let comment = this.comments[i]
            if (
              comment.type == "PaintNote"
            ) {
              this.removeCommentByIndex(i)
            }
          }
          break;

        /**
         * 所有文本（不包括链接）
         */
        case "text":
        case "Text":
        case "alltext":
        case "allText":
          for (let i = this.comments.length-1; i >= 0; i--) {
            let comment = this.comments[i]
            if (
              comment.type == "HtmlNote" ||
              (
                comment.type == "TextNote" &&
                !(
                  comment.text.includes("marginnote3") ||
                  comment.text.includes("marginnote4")
                )
              )
            ) {
              this.removeCommentByIndex(i)
            }
          }
          break;

        /**
         * Markdown 文本
         */
        case "markdown":
        case "Markdown":
        case "md":
        case "MD":
        case "MarkdownText":
        case "mdtext":
        case "MdText":
        case "mdText":
        case "Mdtext":
        case "Markdowntext":
          for (let i = this.comments.length-1; i >= 0; i--) {
            let comment = this.comments[i]
            if (
              comment.type == "TextNote" &&
              !(
                comment.text.includes("marginnote3") ||
                comment.text.includes("marginnote4")
              )
            ) {
              this.removeCommentByIndex(i)
            }
          }
          break;

        /**
         * Html 文本
         */
        case "html":
        case "Html":
        case "HTML":
        case "HtmlText":
        case "htmltext":
        case "Htmltext":
        case "htmlText":
          for (let i = this.comments.length-1; i >= 0; i--) {
            let comment = this.comments[i]
            if (
              comment.type == "HtmlNote"
            ) {
              this.removeCommentByIndex(i)
            }
          }
          break;

        /**
         * 摘录
         */
        case "excerpt":
        case "excerpts":
        case "Excerpt":
        case "Excerpts":
        case "LinkNote":
        case "LinkNotes":
        case "linknote":
        case "linknotes":
          for (let i = this.comments.length-1; i >= 0; i--) {
            let comment = this.comments[i]
            if (
              comment.type == "LinkNote"
            ) {
              this.removeCommentByIndex(i)
            }
          }
          break;

        default:
          MNUtil.showHUD('No "' + type + '" type!')
          break;
      }
    }
  }

  /**
   * 将卡片转化为非摘录版本
   */
  toNoExceptVersion(){
    if (this.parentNote) {
      let parentNote = this.parentNote
      let config = {
        title: this.noteTitle,
        content: "",
        markdown: true,
        color: this.colorIndex
      }
      // 创建新兄弟卡片，标题为旧卡片的标题
      let newNote = parentNote.createChildNote(config)
      this.noteTitle = ""
      // 将旧卡片合并到新卡片中
      this.mergeInto(newNote)
      newNote.focusInMindMap(0.2)
    } else {
      MNUtil.showHUD("没有父卡片，无法进行非摘录版本的转换！")
    }
  }

  toNoExceptType(){
    this.toNoExceptVersion()
  }

  toNonExceptVersion(){
    this.toNoExceptVersion()
  }

  toNonExceptType(){
    this.toNoExceptVersion()
  }

  /**
   * 合并到目标卡片并更新链接
   * 1. 更新新卡片里的链接（否则会丢失蓝色箭头）
   * 2. 双向链接对应的卡片里的链接要更新，否则合并后会消失
   * 
   * 思路：
   * 1. 将 this 的所有链接信息作为对象存到一个数组里：
   *   - 链接的 URL or ID
   *   - 链接在 this 里的 index
   *   - 单向链接还是双向链接
   *   - 如果是双向链接，还要存 this.noteURL 在被链接的卡片里的 index
   */
  mergeInto(targetNote){
    // 合并之前先更新链接
    this.renewLinks()

    /**
     * 储存 this 里面的链接信息
     */
    let linksInfoArr = []
    let handledLinksSet = new Set()  // 防止 this 里面有多个相同链接，造成对 linkedNote 的多次相同处理
    this.comments.forEach((comment, index) => {
      if (MNUtil.isCommentLink(comment)) {
        if (this.LinkIfDouble(comment)) {
          // 双向链接
          linksInfoArr.push({
            linkedNoteId: comment.text.toNoteId(),
            indexInThisNote: index,
            indexArrInLinkedNote: MNNote.new(comment.text.toNoteId()).getLinkCommentsIndexArr(this.noteId.toNoteURL())
          })
        } else {
          // 单向链接
          linksInfoArr.push({
            linkedNoteId: comment.text.toNoteId(),
            indexInThisNote: index,
          })
        }
      }
    })

    // 去掉 this 里的链接
    this.removeCommentsByTypes("link")

    // 合并之前先把 linkedNote 里关于 this 的链接先去掉
    linksInfoArr.forEach(linkInfo => {
      if (!handledLinksSet.has(linkInfo.linkedNoteId)) {
        let linkedNote = MNNote.new(linkInfo.linkedNoteId)
        if (linkInfo.indexArrInLinkedNote !== undefined) { // 双向链接
          linkedNote.removeCommentsByIndices(linkInfo.indexArrInLinkedNote)
        }
      }
      handledLinksSet.add(linkInfo.linkedNoteId)
    })

    // 合并到目标卡片
    targetNote.merge(this)

    // 清空 handledLinksSet
    handledLinksSet.clear()

    // 重新链接
    linksInfoArr.forEach(
      linkInfo => {
        let linkedNote = MNNote.new(linkInfo.linkedNoteId)
        targetNote.appendNoteLink(linkedNote, "To")
        targetNote.moveComment(targetNote.comments.length-1, linkInfo.indexInThisNote)
        if (!handledLinksSet.has(linkInfo.linkedNoteId)) {
          if (linkInfo.indexArrInLinkedNote !== undefined) {
            // 双向链接
            linkInfo.indexArrInLinkedNote.forEach(
              index => {
                linkedNote.appendNoteLink(targetNote, "To")
                linkedNote.moveComment(linkedNote.comments.length-1, index)
              }
            )
          }
        }
        handledLinksSet.add(linkInfo.linkedNoteId)
        linkedNote.clearFailedLinks()
      }
    )
  }


  /**
   * 判断卡片中是否有某个链接
   */
  hasLink(link){
    if (link.ifNoteIdorURL()) {
      let URL = link.toNoteURL()
      return this.getCommentIndex(URL) !== -1
    }
  }

  /**
   * 判断链接的类型：是单向链接还是双向链接
   * @param {string} link
   * @returns {String} "Double"|"Single"
   */
  LinkGetType(link){
    // 兼容一下 link 是卡片 comment 的情形
    if (MNUtil.isObj(link) && link.type == "TextNote") {
      link = link.text
    }
    if (link.ifNoteIdorURL()) {
      // 先确保参数是链接的 ID 或者 URL
      let linkedNoteId = link.toNoteID()
      let linkedNoteURL = link.toNoteURL()
      if (this.hasLink(linkedNoteURL)) {
        let linkedNote = MNNote.new(linkedNoteId)
        return linkedNote.hasLink(this.noteURL) ? "Double" : "Single"
      } else {
        MNUtil.showHUD("卡片中没有此链接！")
        return "NoLink"
      }
    } else {
      MNUtil.showHUD("参数不是合法的链接 ID 或 URL！")
    }
  }

  /**
   * 是否是单向链接
   * @param {string} link
   * @returns {Boolean}
   */
  LinkIfSingle(link){
    return this.LinkGetType(link) === "Single"
  }

  /**
   * 是否是双向链接
   * @param {string} link
   * @returns {Boolean}
   */
  LinkIfDouble(link){
    return this.LinkGetType(link) === "Double"
  }

  renew(){
    let noteType = this.getNoteTypeZh()
    /**
     * 更新链接
     */
    this.renewLinks()

    /**
     * 转换为非摘录版本
     */
    if (this.excerptText) {
      this.toNoExceptVersion()
    }

    /**
     * 检测是否是旧模板制作的卡片
     */
    if (this.ifTemplateOldVersion()) {
      /**
       * 旧模板卡片则只保留
       * 1. 标题
       * 2. 摘录
       * 3. 手写
       * 4. 图片
       * 也就是要去掉
       * 1. 文本
       * 2. 链接
       * i.e. 去掉所有的 TextNote
       * 但是保留原本的部分的链接
       *   - 原本的证明中相关知识的部分
       *   - 原本的证明中体现的思想方法的部分
       * 
       * 检测标题是否是知识类卡片的标题，如果是的话要把前缀去掉，否则会影响后续的添加到复习
       */
      if (this.noteTitle.ifKnowledgeNoteTitle()) {
        this.noteTitle = this.noteTitle.toKnowledgeNoteTitle()
      }

      // 获取“证明过程相关知识：”的 block 内容
      let proofKnowledgeBlockTextContentArr = this.getHtmlBlockTextContentArr("证明过程相关知识：")
      
      // 获取“证明体现的思想方法：”的 block 内容
      let proofMethodBlockTextContentArr = this.getHtmlBlockTextContentArr("证明体现的思想方法：")

      // 获取“应用：”的 block 内容
      let applicationBlockTextContentArr = this.getHtmlBlockTextContentArr("应用：")

      // 去掉所有的文本评论和链接
      this.removeCommentsByTypes(["text","link"])

      // 重新添加两个 block 的内容
      proofKnowledgeBlockTextContentArr.forEach(text => {
        this.appendMarkdownComment(text)
      })

      proofMethodBlockTextContentArr.forEach(text => {
        this.appendMarkdownComment(text)
      })

      applicationBlockTextContentArr.forEach(text => {
        this.appendMarkdownComment(text)
      })
    } else {
      /**
       * 其它类型的旧卡片
       */

      if (
        this.noteTitle.ifKnowledgeNoteTitle() &&
        (
          this.getCommentIndex("由来/背景：") !== -1 ||
          this.getCommentIndex("- ") !== -1 ||
          this.getCommentIndex("-") !== -1 ||
          this.getHtmlCommentIndex("所属：") !== -1
        )
      ) {
        this.noteTitle = this.noteTitle.toKnowledgeNoteTitle()
      }

      /**
       * 删除一些特定的文本
       */
      if (noteType!== "归类" && noteType!== "顶层") {
        this.removeCommentsByText(
          [
            "零层",
            "一层",
            "两层",
            "三层",
            "四层",
            "五层",
            "由来/背景：",
            "- 所属：",
            "所属："
          ]
        )
      } else {
        this.removeCommentsByText(
          [
            "零层",
            "一层",
            "两层",
            "三层",
            "四层",
            "五层",
            "由来/背景：",
            "- 所属：",
          ]
        )
      }

      this.removeCommentsByTrimText(
        "-"
      )

      /**
       * 更新 Html 评论
       */
      this.renewHtmlCommentFromId("关键词：", "13D040DD-A662-4EFF-A751-217EE9AB7D2E")
      this.renewHtmlCommentFromId("相关定义：", "341A7B56-8B5F-42C8-AE50-61F7A1276FA1")

      /**
       * 根据父卡片或者是卡片颜色（取决于有没有归类的父卡片）来修改 Html 版本
       */
      if (noteType !== "归类" && noteType !== "顶层") {
        // 修改对应 “证明：”的版本
        let proofHtmlCommentIndex = this.getProofHtmlCommentIndexByNoteType(noteType)
        if (proofHtmlCommentIndex == -1) {
          // 此时要先找到不正确的 proofHtmlComment 的 Index，然后删除掉
          this.getRenewProofHtmlCommentByNoteType(noteType)
        }
      } else {
        // 去掉“相关xx：” 改成“相关思考：”
        let oldRelatedHtmlCommentIndex = this.getIncludingHtmlCommentIndex("相关")
        let includeHtmlCommentIndex = this.getHtmlCommentIndex("包含：")
        if (includeHtmlCommentIndex !== -1) { // 原本合并过模板的才需要处理
          if (oldRelatedHtmlCommentIndex == -1) {
            this.mergeClonedNoteById("B3CAC635-F507-4BCF-943C-B3F9D4BF6D1D")
            this.moveComment(this.comments.length-1, includeHtmlCommentIndex)
          } else {
            this.removeCommentByIndex(oldRelatedHtmlCommentIndex)
            this.mergeClonedNoteById("B3CAC635-F507-4BCF-943C-B3F9D4BF6D1D")
            this.moveComment(this.comments.length-1, oldRelatedHtmlCommentIndex)
          }
        }
      }

      /**
       * 调整 Html Block 的结构
       */
      if (this.getNoteTypeZh() == "定义") {
        /**
         * 定义类卡片，按照
         * - 相关概念：
         * - 相关思考：
         * - 相关链接：
         * 的顺序
         */
        this.moveHtmlBlockToBottom("相关概念：")
        this.moveHtmlBlockToBottom("相关思考：")
        this.moveHtmlBlockToBottom("相关链接：")
      } else {
        // 非定义类卡片
        /**
         * 将“应用：”及下方的内容移动到最下方
         */
        this.moveHtmlBlockToBottom("应用：")
      }

      /**
       * 刷新卡片
       */
      this.refresh()
    }
  }

  renewNote(){
    this.renew()
  }

  renewCard(){
    this.renew()
  }

  getIncludingHtmlCommentIndex(htmlComment){
    const comments = this.note.comments
    for (let i = 0; i < comments.length; i++) {
      const _comment = comments[i]
      if (
        typeof htmlComment == "string" &&
        _comment.type == "HtmlNote" &&
        _comment.text.includes(htmlComment)
      ) {
        return i
      }
    }
    return -1
  }

  renewHtmlCommentFromId(comment, id) {
    if (typeof comment == "string") {
      let index = this.getHtmlCommentIndex(comment)
      if (index !== -1){
        this.removeCommentByIndex(index)
        this.mergeClonedNoteFromId(id)
        this.moveComment(this.comments.length-1, index)
      }
    } else {
      MNUtil.showHUD("只能更新文本类型的评论！")
    }
  }

  renewHtmlCommentById(comment, id) {
    this.renewHtmlCommentFromId(comment, id)
  }

  mergeClonedNoteFromId(id){
    let note = MNNote.clone(id)
    this.merge(note.note)
  }

  mergeClonedNoteById(id){
    this.mergeClonedNoteFromId(id)
  }

  /**
   * 根据内容删除文本评论
   */
  removeCommentsByContent(content){
    this.removeCommentsByText(content)
  }

  removeCommentsByTrimContent(content){
    this.removeCommentsByText(content)
  }

  removeCommentsByText(text){
    if (typeof text == "string") {
      this.removeCommentsByOneText(text)
    } else {
      if (Array.isArray(text)) {
        text.forEach(t => {
          this.removeCommentsByOneText(t)
        })
      }
    }
  }

  removeCommentsByTrimText(text){
    if (typeof text == "string") {
      this.removeCommentsByOneTrimText(text)
    } else {
      if (Array.isArray(text)) {
        text.forEach(t => {
          this.removeCommentsByOneTrimText(t)
        })
      }
    }
  }

  // aux function
  removeCommentsByOneText(text){
    if (typeof text == "string") {
      for (let i = this.comments.length-1; i >= 0; i--) {
        let comment = this.comments[i]
        if (
          (
            comment.type == "TextNote" ||
            comment.type == "HtmlNote"
          )
          &&
          comment.text == text
        ) {
          this.removeCommentByIndex(i)
        }
      }
    }
  }

  removeCommentsByOneTrimText(text){
    if (typeof text == "string") {
      for (let i = this.comments.length-1; i >= 0; i--) {
        let comment = this.comments[i]
        if (
          (
            comment.type == "TextNote" ||
            comment.type == "HtmlNote"
          )
          &&
          comment.text.trim() == text
        ) {
          this.removeCommentByIndex(i)
        }
      }
    }
  }

  /**
   * 刷新卡片
   */
  refresh(){
    this.note.appendMarkdownComment("")
    this.note.removeCommentByIndex(this.note.comments.length-1)
  }

  /**
   * 更新卡片里的链接
   * 1. 将 MN3 链接转化为 MN4 链接
   * 2. 去掉所有失效链接
   */
  LinkRenew(){
    this.convertLinksToNewVersion()
    this.clearFailedLinks()
  }

  renewLink(){
    this.LinkRenew()
  }

  renewLinks(){
    this.LinkRenew()
  }

  LinksRenew(){
    this.LinkRenew()
  }

  clearFailedLinks(){
    for (let i = this.comments.length-1; i >= 0; i--) {
      let comment = this.comments[i]
      if  (
        comment.type == "TextNote" &&
        (
          comment.text.startsWith("marginnote3app://note/") ||
          comment.text.startsWith("marginnote4app://note/") 
        )
      ) {
        let targetNoteId = comment.text.match(/marginnote[34]app:\/\/note\/(.*)/)[1]
        if (!targetNoteId.includes("/summary/")) {  // 防止把概要的链接删掉了
          let targetNote = MNNote.new(targetNoteId)
          if (!targetNote) {
            this.removeCommentByIndex(i)
          }
        }
      }
    }
  }

  LinkClearFailedLinks(){
    this.clearFailedLinks()
  }

  LinksConvertToMN4Version(){
    for (let i = this.comments.length-1; i >= 0; i--) {
      let comment = this.comments[i]
      if (
        comment.type == "TextNote" &&
        comment.text.startsWith("marginnote3app://note/")
      ) {
        let targetNoteId = comment.text.match(/marginnote3app:\/\/note\/(.*)/)[1]
        let targetNote = MNNote.new(targetNoteId)
        if (targetNote) {
          this.removeCommentByIndex(i)
          this.appendNoteLink(targetNote, "To")
          this.moveComment(this.comments.length-1, i)
        } else {
          this.removeCommentByIndex(i)
        }
      }
    }
  }

  convertLinksToMN4Version(){
    this.LinksConvertToMN4Version()
  }

  LinksConvertToNewVersion(){
    this.LinksConvertToMN4Version()
  }

  convertLinksToNewVersion(){
    this.LinksConvertToMN4Version()
  }


  /**
   * 将某一个 Html 评论到下一个 Html 评论之前的内容（不包含下一个 Html 评论）进行移动
   * 将 Html 评论和下方的内容看成一整个块，进行移动
   * 注意此函数会将 Html 评论和下方的内容一起移动，而不只是下方内容
   * @param {String} htmltext Html 评论，定位的锚点
   * @param {Number} toIndex 目标 index
   */
  moveHtmlBlock(htmltext, toIndex) {
    if (this.getHtmlCommentIndex(htmltext) !== -1) {
      let htmlBlockIndexArr = this.getHtmlBlockIndexArr(htmltext)
      this.moveCommentsByIndexArr(htmlBlockIndexArr, toIndex)
    }
  }

  /**
   * 移动 HtmlBlock 到最下方
   * @param {String} htmltext Html 评论，定位的锚点
   */
  moveHtmlBlockToBottom(htmltext){
    this.moveHtmlBlock(htmltext, this.comments.length-1)
  }

  /**
   * 移动 HtmlBlock 到最上方
   * @param {String} htmltext Html 评论，定位的锚点
   */
  moveHtmlBlockToTop(htmltext){
    this.moveHtmlBlock(htmltext, 0)
  }
  
  /**
   * 获取 Html Block 的索引数组
   */
  getHtmlBlockIndexArr(htmltext){
    let htmlCommentIndex = this.getHtmlCommentIndex(htmltext)
    let indexArr = []
    if (htmlCommentIndex !== -1) {
      // 获取下一个 html 评论的 index
      let nextHtmlCommentIndex = this.getNextHtmlCommentIndex(htmltext)
      if (nextHtmlCommentIndex == -1) {
        // 如果没有下一个 html 评论，则以 htmlCommentIndex 到最后一个评论作为 block
        for (let i = htmlCommentIndex; i <= this.comments.length-1; i++) {
          indexArr.push(i)
        }
      } else {
        // 有下一个 html 评论，则以 htmlCommentIndex 到 nextHtmlCommentIndex 之间的评论作为 block
        for (let i = htmlCommentIndex; i < nextHtmlCommentIndex; i++) {
          indexArr.push(i)
        }
      }
    }
    return indexArr
  }

  /**
   * 获取某个 html 评论的下一个 html 评论的索引
   * 若没有下一个 html 评论，则返回 -1
   * 思路：
   *  1. 先获取所有 html 评论的索引 arr
   *  2. 然后看 htmltext 在 arr 里的 index
   *  3. 如果 arr 没有 index+1 索引，则返回 -1；否则返回 arr[index+1]
   * @param {String} htmltext
   */
  getNextHtmlCommentIndex(htmltext){
    let indexArr = this.getHtmlCommentsIndexArr()
    let htmlCommentIndex = this.getHtmlCommentIndex(htmltext)
    let nextHtmlCommentIndex = -1
    if (htmlCommentIndex !== -1) {
      let nextIndex = indexArr.indexOf(htmlCommentIndex) + 1
      if (nextIndex < indexArr.length) {
        nextHtmlCommentIndex = indexArr[nextIndex]
      }
    }
    return nextHtmlCommentIndex
  }

  /**
   * 获得所有 html 评论的索引列表
   * @returns {Array}
   */
  getHtmlCommentsIndexArr(){
    let indexArr = []
    for (let i = 0; i < this.comments.length; i++) {
      let comment = this.comments[i]
      if (comment.type == "HtmlNote") {
        indexArr.push(i)
      }
    }

    return indexArr
  }

  /**
   * 获得某个文本评论的索引列表
   * @param {String} text 
   */
  getTextCommentsIndexArr(text){
    let arr = []
    this.comments.forEach((comment, index) => {
      if (comment.type == "TextNote" && comment.text == text) {
        arr.push(index)
      }
    })
    return arr
  }

  /**
   * 获得某个链接评论的索引列表
   * @param {Object|String} link
   */
  getLinkCommentsIndexArr(link){
    return this.getTextCommentsIndexArr(MNUtil.getLinkText(link))
  }

  /**
   * 获取某个 html Block 的下方内容的 index arr
   * 不包含 html 本身
   */
  getHtmlBlockContentIndexArr(htmltext){
    let arr = this.getHtmlBlockIndexArr(htmltext)
    if (arr.length > 0) {
      arr.shift()  // 去掉 html 评论的 index
    }
    return arr
  }

  /**
   * 获取 html block 下方的内容 arr
   * 不包含 html 本身
   * 但只能获取 TextNote，比如文字和链接
   */
  getHtmlBlockTextContentArr(htmltext){
    let indexArr = this.getHtmlBlockContentIndexArr(htmltext)
    let textArr = []
    indexArr.forEach(index => {
      let comment = this.comments[index]
      if (comment.type == "TextNote") {
        textArr.push(comment.text)
      }
    })
    return textArr
  }

  /**
   * 移动某个数组的评论到某个 index
   * 注意往上移动和往下移动情况不太一样
   */
  moveCommentsByIndexArr(indexArr, toIndex){
    if (indexArr.length !== 0) {
      let max = Math.max(...indexArr)
      let min = Math.min(...indexArr)
      if (toIndex < min) {
        // 此时是往上移动
        for (let i = 0; i < indexArr.length; i++) {
          this.moveComment(indexArr[i], toIndex+i)
        }
      } else if (toIndex > max) {
        // 此时是往下移动
        for (let i = indexArr.length-1; i >= 0; i--) {
          this.moveComment(indexArr[i], toIndex-(indexArr.length-1-i))
        }
      }
    }
  }

  /**
   * 获取 Html 评论的索引
   * @param {String} htmlcomment 
   */
  getHtmlCommentIndex(htmlcomment) {
    const comments = this.note.comments
    for (let i = 0; i < comments.length; i++) {
      const _comment = comments[i]
      if (
        typeof htmlcomment == "string" &&
        _comment.type == "HtmlNote" &&
        _comment.text == htmlcomment
      ) {
        return i
      }
    }
    return -1
  }

  /**
   * 刷新卡片及其父子卡片
   */
  refreshAll(){
    if (this.descendantNodes.descendant.length > 0) {
      this.descendantNodes.descendant.forEach(descendantNote => {
        descendantNote.refresh()
      })
    }
    if (this.ancestorNodes.length > 0) {
      this.ancestorNodes.forEach(ancestorNote => {
        ancestorNote.refresh()
      })
    }
  }
  getIncludingCommentIndex(comment,includeHtmlComment = false) {
    const comments = this.note.comments
    for (let i = 0; i < comments.length; i++) {
      const _comment = comments[i]
      if (typeof comment == "string") {
        if (includeHtmlComment) {
          if ((_comment.type == "TextNote" || _comment.type == "HtmlNote" )&& _comment.text.includes(comment)) return i
        }else{
          if (_comment.type == "TextNote" && _comment.text.includes(comment)) return i
        }
      } else if (
        _comment.type == "LinkNote" &&
        _comment.noteid == comment.noteId
      )
        return i
    }
    return -1
  }

  /**
   * 【数学】定义类卡片的增加模板
   * @param {string} type 需要生成的归类卡片的类型
   */
  addClassificationNoteByTypeBasedOnDefinitionNote(type, title=""){
    /**
     * 生成归类卡片
     */
    let classificationNote = this.addClassificationNote(title)

    /**
     * 修改标题
     */
    classificationNote.changeTitle(type)

    /**
     * [TODO：主要的处理]与定义类卡片进行链接，并防止后续归类后重新链接时导致归类卡片中定义卡片的链接被删除
     * 主要要修改 linkParentNote
     */
    classificationNote.linkParentNote()
  }

  /**
   * 
   * @returns {MNNote} 生成的归类卡片
   */
  addClassificationNote (title="") {
    let classificationNote = this.createEmptyChildNote(0,title)
    classificationNote.mergeClonedNoteFromId("8853B79F-8579-46C6-8ABD-E7DE6F775B8B")
    return classificationNote
  }

  createEmptyChildNote(colorIndex = this.colorIndex, title = "", content = ""){
    let config = {
      title: title,
      content: content,
      markdown: true,
      color: colorIndex
    }

    let childNote = this.createChildNote(config)

    return childNote
  }
  /**
   * 夏大鱼羊定制 - MNNote - end
   */
  /** @type {MbBookNote} */
  note
  /**
   * Initializes a new MNNote instance.
   * 
   * This constructor initializes a new MNNote instance based on the provided note object. The note object can be of various types:
   * - An MbBookNote instance.
   * - A string representing a note URL.
   * - A string representing a note ID.
   * - A configuration object for creating a new note.
   * 
   * If the note object is a string representing a note URL, the constructor will attempt to retrieve the corresponding note from the URL.
   * If the note object is a string representing a note ID, the constructor will attempt to retrieve the corresponding note from the database.
   * If the note object is a configuration object, the constructor will create a new note with the specified properties.
   * 
   * @param {MbBookNote|string|object} note - The note object to initialize the MNNote instance with.
   */
  constructor(note) {
    switch (MNUtil.typeOf(note)) {
      case 'MbBookNote':
        this.note = note
        break;
      case 'NoteURL':
        let NoteFromURL = MNUtil.getNoteBookById(MNUtil.getNoteIdByURL(note))
        if (NoteFromURL) {
          this.note = NoteFromURL
        }
      case 'string':
        let targetNoteId = note.trim()
        let targetNote = MNUtil.getNoteById(targetNoteId)
        if (targetNote) {
          this.note = targetNote
        }
        // MNUtil.showHUD(this.note.noteId)
        break;
        // MNUtil.copyJSON(targetNoteId+":"+this.note.noteId)
      case "NoteConfig":
        let config = note
        let notebook = MNUtil.currentNotebook
        let title = config.title ?? ""
        // MNUtil.showHUD("new note")
        // MNUtil.copyJSON(note)
        this.note = Note.createWithTitleNotebookDocument(title, notebook, MNUtil.currentDocController.document)
        if (config.content) {
          if (config.markdown) {
            this.note.appendMarkdownComment(config.content)
          }else{
            this.note.appendTextComment(config.content)
          }
        }
        if (config.color !== undefined) {
          this.note.colorIndex = config.color
        }
        break;
      default:
        break;
    }
  }
  /**
   * Creates a new MNNote instance based on the provided note object.
   * 
   * This static method initializes a new MNNote instance based on the provided note object. The note object can be of various types:
   * - An MbBookNote instance.
   * - A string representing a note URL.
   * - A string representing a note ID.
   * - A configuration object for creating a new note.
   * 
   * If the note object is a string representing a note URL, the method will attempt to retrieve the corresponding note from the URL.
   * If the note object is a string representing a note ID, the method will attempt to retrieve the corresponding note from the database.
   * If the note object is a configuration object, the method will create a new note with the specified properties.
   * 
   * @param {MbBookNote|string|object} note - The note object to initialize the MNNote instance with.
   * @returns {MNNote|undefined} The initialized MNNote instance or undefined if the note object is invalid.
   */
  static new(note){
    if (note === undefined) {
      return undefined
    }
    // MNUtil.showHUD(note)
    // let paramType = MNUtil.typeOf(note)
    // MNUtil.showHUD(paramType)
    switch (MNUtil.typeOf(note)) {
      case 'MbBookNote':
        return new MNNote(note)
      case 'NoteURL':
        let NoteFromURL = MNUtil.getNoteById(MNUtil.getNoteIdByURL(note))
        if (NoteFromURL) {
          return new MNNote(NoteFromURL)
        }
        return undefined
      case 'string':
        let targetNoteId = note.trim()
        let targetNote = MNUtil.getNoteById(targetNoteId)
        if (targetNote) {
          return new MNNote(targetNote)
        }
        return undefined
      case "NoteConfig":
        let config = note
        let notebook = MNUtil.currentNotebook
        let title = config.title ?? ""
        // MNUtil.copyJSON(note)
        let newNote = Note.createWithTitleNotebookDocument(title, notebook, MNUtil.currentDocController.document)
        if (config.excerptText) {
          newNote.excerptText = config.excerptText
          if (config.excerptTextMarkdown) {
            newNote.excerptTextMarkdown = true
            if (/!\[.*?\]\((data:image\/.*;base64,.*?)(\))/.test(config.excerptText)) {
              newNote.processMarkdownBase64Images()
            }
          }
        }
        if (config.content) {
          if (config.markdown) {
            newNote.appendMarkdownComment(config.content)
          }else{
            newNote.appendTextComment(config.content)
          }
        }
        if (config.color !== undefined) {
          newNote.colorIndex = config.color
        }

        return new MNNote(newNote)
      default:
        return undefined
    }
  }
  get noteId() {
    return this.note.noteId
  }
  get notebookId() {
    return this.note.notebookId
  }
  /**
   * Retrieves the original note ID of a note that has been merged.
   * 
   * This method returns the original note ID of a note that has been merged into another note. This is useful for tracking the history of notes that have been combined.
   * 
   * @returns {string} The original note ID of the merged note.
   */
  get originNoteId(){
    return this.note.originNoteId
  }
  /**
   * Retrieves the note ID of the main note in a group of merged notes.
   * 
   * This method returns the note ID of the main note in a group of merged notes. This is useful for identifying the primary note in a set of combined notes.
   * 
   * @returns {string} The note ID of the main note in the group of merged notes.
   */
  get groupNoteId(){
    return this.note.groupNoteId
  }
  /**
   * Retrieves the child notes of the current note.
   * 
   * This method returns an array of MNNote instances representing the child notes of the current note. If the current note has no child notes, it returns an empty array.
   * 
   * @returns {MNNote[]} An array of MNNote instances representing the child notes.
   */
  get childNotes() {
    return this.note.childNotes?.map(k => new MNNote(k)) ?? []
  }
  /**
   * Retrieves the parent note of the current note.
   * 
   * This method returns an MNNote instance representing the parent note of the current note. If the current note has no parent note, it returns undefined.
   * 
   * @returns {MNNote|undefined} The parent note of the current note, or undefined if there is no parent note.
   */
  get parentNote() {
    return this.note.parentNote && new MNNote(this.note.parentNote)
  }
  /**
   * Retrieves the URL of the current note.
   * 
   * This method generates and returns the URL of the current note, which can be used to reference or share the note.
   * 
   * @returns {string} The URL of the current note.
   */
  get noteURL(){
    return MNUtil.version.version+'app://note/'+this.note.noteId
  }
  /**
   * Retrieves the child mind map note of the current note.
   * 
   * This method returns an MNNote instance representing the child mind map note of the current note. If the current note has no child mind map note, it returns undefined.
   * 
   * @returns {MNNote|undefined} The child mind map note of the current note, or undefined if there is no child mind map note.
   */
  get childMindMap(){
    if (this.note.childMindMap) {
      return MNNote.new(this.note.childMindMap)
    }
    return undefined
  }
  /**
   *
   * @returns {{descendant:MNNote[],treeIndex:number[][]}}
   */
  get descendantNodes() {
    const { childNotes } = this
    if (!childNotes.length) {
      return {
        descendant: [],
        treeIndex: []
      }
    } else {
      /**
       *
       * @param {MNNote[]} nodes
       * @param {number} level
       * @param {number[]} lastIndex
       * @param {{descendant:MNNote[],treeIndex:number[][]}} ret
       * @returns
       */
      function down(
        nodes,
        level = 0,
        lastIndex = [],
        ret = {
          descendant: [],
          treeIndex: []
        }
      ) {
        level++
        nodes.forEach((node, index) => {
          ret.descendant.push(node)
          lastIndex = lastIndex.slice(0, level - 1)
          lastIndex.push(index)
          ret.treeIndex.push(lastIndex)
          if (node.childNotes?.length) {
            down(node.childNotes, level, lastIndex, ret)
          }
        })
        return ret
      }
      return down(childNotes)
    }
  }
  get ancestorNodes() {
    /**
     *
     * @param {MNNote} node
     * @param {MNNote[]} ancestorNodes
     * @returns
     */
    function up(node, ancestorNodes) {
      if (node.note.parentNote) {
        const parentNode = new MNNote(node.note.parentNote)
        ancestorNodes = up(parentNode, [...ancestorNodes, parentNode])
      }
      return ancestorNodes
    }
    return up(this, [])
  }
  /**
   * Retrieves the notes associated with the current note.
   * 
   * This method returns an array of notes that are linked to the current note. It includes the current note itself and any notes that are linked through the comments.
   * 
   * @returns {MNNote[]} An array of MNNote instances representing the notes associated with the current note.
   */
  get notes() {
    return this.note.comments.reduce(
      (acc, cur) => {
        cur.type == "LinkNote" && acc.push(MNNote.new(cur.noteid))
        return acc
      },
      [this]
    )
  }
  /**
   * Retrieves the titles associated with the current note.
   * 
   * This method splits the note title by semicolons and returns an array of unique titles. If the note title is not defined, it returns an empty array.
   * 
   * @returns {string[]} An array of unique titles associated with the current note.
   */
  get titles() {
    return MNUtil.unique(this.note.noteTitle?.split(/\s*[;；]\s*/) ?? [], true)
  }
  /**
   * Sets the titles associated with the current note.
   * 
   * This method sets the titles associated with the current note by joining the provided array of titles with semicolons. If the excerpt text of the note is the same as the note title, it updates both the note title and the excerpt text.
   * 
   * @param {string[]} titles - The array of titles to set for the current note.
   */
  set titles(titles) {
    const newTitle = MNUtil.unique(titles, true).join("; ")
    if (this.note.excerptText === this.note.noteTitle) {
      this.note.noteTitle = newTitle
      this.note.excerptText = newTitle
    } else {
      this.note.noteTitle = newTitle
    }
  }
  get isOCR() {
    if (this.note.excerptPic?.paint) {
      return this.note.textFirst
    }
    return false
  }
  get textFirst() {
    return this.note.textFirst
  }
  get title() {
    return this.note.noteTitle ?? ""
  }
  get noteTitle() {
    return this.note.noteTitle ?? ""
  }
  /**
   *
   * @param {string} title
   * @returns
   */
  set title(title) {
    this.note.noteTitle = title
  }
  /**
   * set textFirst
   * @param {boolean} on
   * @returns
   */
  set textFirst(on){
    this.note.textFirst = on
  }
  /**
   *
   * @param {string} title
   * @returns
   */
  set noteTitle(title) {
    this.note.noteTitle = title
  }
  get excerptText(){
    return this.note.excerptText
  }
  get excerptTextMarkdown(){
    return this.note.excerptTextMarkdown;
  }
  set excerptTextMarkdown(status){
    this.note.excerptTextMarkdown = status
  }
  set excerptText(text){
    this.note.excerptText = text
    if (this.excerptPic && !this.textFirst) {
      this.textFirst = true
    }
  }
  get mainExcerptText() {
    return this.note.excerptText ?? ""
  }
  /**
   *
   * @param {string} text
   * @returns
   */
  set mainExcerptText(text) {
    this.note.excerptText = text
  }
  get excerptPic(){
    return this.note.excerptPic
  }
  get excerptPicData(){
    let imageData = MNUtil.getMediaByHash(this.note.excerptPic.paint)
    return imageData
  }
  get colorIndex(){
    return this.note.colorIndex
  }
  set colorIndex(index){
    this.note.colorIndex = index
  }
  get fillIndex(){
    return this.note.fillIndex
  }
  set fillIndex(index){
    this.note.fillIndex = index
  }
  get createDate(){
    return this.note.createDate
  }
  get modifiedDate(){
    return this.note.modifiedDate
  }
  get linkedNotes(){
    return this.note.linkedNotes
  }
  get summaryLinks(){
    return this.note.summaryLinks
  }
  get mediaList(){
    return this.note.mediaList
  }
  /**
   * get all tags, without '#'
   * @returns {string[]}
   */
  get tags() {
    try {
    // MNUtil.showHUD("length: "+this.note.comments.length)
    const tags = this.note.comments.reduce((acc, cur) => {
      // MNUtil.showHUD("cur.type")
      if (cur.type == "TextNote" && cur.text.startsWith("#")) {
        acc.push(...cur.text.split(/\s+/).filter(k => k.startsWith("#")))
      }
      return acc
    }, [])
    return tags.map(k => k.slice(1))

    } catch (error) {
      MNUtil.showHUD(error)
      return []
    }
  }
  /**
   *
   * @returns {NoteComment[]}
   */
  get comments(){
    return this.note.comments
  }
  /**
   * set tags, will remove all old tags
   *
   * @param {string[]} tags
   * @returns
   */
  set tags(tags) {
    this.tidyupTags()
    tags = MNUtil.unique(tags, true)
    const lastComment = this.note.comments[this.note.comments.length - 1]
    if (lastComment?.type == "TextNote" && lastComment.text.startsWith("#")) {
      this.note.removeCommentByIndex(this.note.comments.length - 1)
    }
    this.appendTextComments(tags.map(k => '#'+k).join(" "))
  }
  /**
   * @returns {{ocr:string[],html:string[],md:string[]}}
   */
  get excerptsTextPic() {
    return this.notes.reduce(
      (acc, cur) => {
        Object.entries(MNNote.getNoteExcerptTextPic(cur)).forEach(([k, v]) => {
          if (k in acc) acc[k].push(...v)
        })
        return acc
      },
      {
        ocr: [],
        html: [],
        md: []
      }
    )
  }
  /**
   * @returns {{html:string[],md:string[]}}
   */
  get commentsTextPic() {
    return this.note.comments.reduce(
      (acc, cur) => {
        if (cur.type === "PaintNote") {
          const imgs = MNNote.exportPic(cur)
          if (imgs)
            Object.entries(imgs).forEach(([k, v]) => {
              if (k in acc) acc[k].push(v)
            })
        } else if (cur.type == "TextNote" || cur.type == "HtmlNote") {
          const text = cur.text.trim()
          if (text && !text.includes("marginnote3app") && !text.startsWith("#"))
            Object.values(acc).map(k => k.push(text))
        }
        return acc
      },
      {
        html: [],
        md: []
      }
    )
  }
  /** @returns {string[]} */
 get excerptsText() {
    return this.notes.reduce((acc, note) => {
      const text = note.excerptText?.trim()
      if (text) {
        if (!note.excerptPic?.paint || this.isOCR) {
          acc.push(text)
        }
      }
      return acc
    }, [])
  }
  /**
   * get all comment text
   * @returns {string[]}
   */
  get commentsText() {
    return this.note.comments.reduce((acc, cur) => {
      if (cur.type == "TextNote" || cur.type == "HtmlNote") {
        const text = cur.text.trim()
        if (text && !text.includes("marginnote3app") && !text.startsWith("#"))
          acc.push(text)
      }
      return acc
    }, [])
  }
  /**
   * get all text and pic note will be OCR or be transformed to base64
   */
  get allTextPic() {
    const retVal = MNNote.getNoteExcerptTextPic(this.note)
    this.note.comments.forEach(k => {
      if (k.type === "PaintNote") {
        const imgs = MNNote.exportPic(k)
        if (imgs)
          Object.entries(imgs).forEach(([k, v]) => {
            if (k in retVal) retVal[k].push(v)
          })
      } else if (k.type == "TextNote" || k.type == "HtmlNote") {
        const text = k.text.trim()
        if (text) Object.values(retVal).map(k => k.push(text))
      } else if (k.type == "LinkNote") {
        const note = MNUtil.db.getNoteById(k.noteid)
        if (note)
          Object.entries(MNNote.getNoteExcerptTextPic(note)).forEach(([k, v]) => {
            if (k in retVal) retVal[k].push(...v)
          })
      }
    })
    return {
      html: retVal.html.join("\n\n"),
      ocr: retVal.ocr.join("\n\n"),
      md: retVal.md.join("\n\n")
    }
  }
  /**
   * Get all text
   */
  get allText() {

    const { mainExcerptText } = this
    const retVal =
      mainExcerptText && (!this.note.excerptPic?.paint || this.isOCR)
        ? [mainExcerptText]
        : []
    this.note.comments.forEach(k => {
      if (k.type == "TextNote" || k.type == "HtmlNote") {
        const text = k.text.trim()
        if (text) retVal.push(text)
      } else if (k.type == "LinkNote") {
        const note = MNUtil.db.getNoteById(k.noteid)
        const text = note?.excerptText?.trim()
        if (text && (!note?.excerptPic?.paint || this.isOCR)) retVal.push(text)
      }
    })
    return retVal.join("\n\n")
  }
  /**
   * Get all text.
   */
  get excerptsCommentsText() {
    const { mainExcerptText } = this
    const retVal =
      mainExcerptText && (!this.note.excerptPic?.paint || this.isOCR)
        ? [mainExcerptText]
        : []
    this.note.comments.forEach(k => {
      if (k.type == "TextNote" || k.type == "HtmlNote") {
        const text = k.text.trim()
        if (text && !text.includes("marginnote3app") && !text.includes("marginnote4app") && !text.startsWith("#"))
          retVal.push(text)
      } else if (k.type == "LinkNote") {
        const note = MNUtil.db.getNoteById(k.noteid)
        const text = note?.excerptText?.trim()
        if (text && (!note?.excerptPic?.paint || this.isOCR)) retVal.push(text)
      }
    })
    return retVal
  }
  get docMd5(){
    if (this.note.docMd5) {
      return this.note.docMd5
    }
    return undefined
  }
  /**
   * 当前卡片可能只是文档上的摘录，通过这个方法获取它在指定学习集下的卡片noteId
   * 与底层API不同的是，这里如果不提供nodebookid参数，则默认为当前学习集的nodebookid
   * @param {string} nodebookid
   * @returns {string}
   */
  realGroupNoteIdForTopicId(nodebookid = MNUtil.currentNotebookId){
    return this.note.realGroupNoteIdForTopicId(nodebookid)
  };
  /**
   * 当前卡片可能只是文档上的摘录，通过这个方法获取它在指定学习集下的卡片noteId
   * 与底层API不同的是，这里如果不提供nodebookid参数，则默认为当前学习集的nodebookid
   * @param {string} nodebookid
   * @returns {MNNote}
   */
  realGroupNoteForTopicId(nodebookid = MNUtil.currentNotebookId){
    let noteId = this.note.realGroupNoteIdForTopicId(nodebookid)
    return MNNote.new(noteId)
  };
  processMarkdownBase64Images(){
    this.note.processMarkdownBase64Images();
  }
  allNoteText(){
    return this.note.allNoteText()
  }

  async getMDContent(withBase64 = false){
    let note = this.realGroupNoteForTopicId()
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
    if (withBase64) {
      excerptText = `[image](${MNUtil.getMediaByHash(note.excerptPic.paint).base64Encoding()})`
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
          if (withBase64 && comment.q_hpic  && comment.q_hpic.paint && !textFirst) {
            let imageData = MNUtil.getMediaByHash(comment.q_hpic.paint)
            let imageSize = UIImage.imageWithData(imageData).size
            if (imageSize.width === 1 && imageSize.height === 1) {
              if (comment.q_htext) {
                excerptText = excerptText+"\n"+comment.q_htext
              }
            }else{
              excerptText = excerptText+`\n[image](${imageData.base64Encoding()})`
            }
          }else{
            excerptText = excerptText+"\n"+comment.q_htext
          }
          break
        case "PaintNote":
          if (withBase64 && comment.paint){
            excerptText = excerptText+`\n[image](${MNUtil.getMediaByHash(comment.paint).base64Encoding()})`
          }
          break
        default:
          break;
      }
    }
  }
  // excerptText = (excerptText && excerptText.trim()) ? this.highlightEqualsContentReverse(excerptText) : ""
  let content = title+"\n"+excerptText
  return content
}catch(error){
  MNUtil.showHUD("Error in (getMDContent): "+error.toString())
  return ""
}
  }
  paste(){
    this.note.paste()
  }

  /**
   * Merges the current note with another note.
   * 
   * This method merges the current note with another note. The note to be merged can be specified in various ways:
   * - An MbBookNote instance.
   * - An MNNote instance.
   * - A string representing a note URL.
   * - A string representing a note ID.
   * 
   * If the note to be merged is a string representing a note URL, the method will attempt to retrieve the corresponding note from the URL.
   * If the note to be merged is a string representing a note ID, the method will attempt to retrieve the corresponding note from the database.
   * 
   * @param {MbBookNote|MNNote|string} note - The note to be merged with the current note.
   */
  merge(note){
    switch (MNUtil.typeOf(note)) {
      case "MbBookNote":
        this.note.merge(note)
        break;
      case "MNNote":
        this.note.merge(note.note)
        break;
      case "NoteURL":
        let noteFromURL = MNUtil.getNoteById(MNUtil.getNoteIdByURL(note))
        if (noteFromURL) {
          this.note.merge(noteFromURL)
        }else{
          MNUtil.copy(note)
          MNUtil.showHUD("Note not exist!")
        }
      case "string":
        let targetNote = MNUtil.getNoteById(note)
        if (targetNote) {
          this.note.merge(targetNote)
        }else{
          MNUtil.copy(note)
          MNUtil.showHUD("Note not exist!")
        }
        break
      default:
        break;
    }
  }
  /**
   * Remove from parent
   * 去除当前note的父关系(没用过不确定具体效果)
   */
  removeFromParent(){
    this.note.removeFromParent()
  }
  insertChildBefore(){
    this.note.insertChildBefore()
  }
  /**
   * Deletes the current note, optionally including its descendant notes.
   * 
   * This method deletes the current note from the database. If the `withDescendant` parameter is set to `true`, it will also delete all descendant notes of the current note.
   * The deletion can be grouped within an undo operation if the `undoGrouping` parameter is set to `true`.
   * 
   * @param {boolean} [withDescendant=false] - Whether to delete the descendant notes along with the current note.
   * @param {boolean} [undoGrouping=true] - Whether to group the deletion within an undo operation.
   */
  delete(withDescendant = false, undoGrouping = true){
    if (undoGrouping) {
      MNUtil.undoGrouping(()=>{
        if (withDescendant) {
          MNUtil.db.deleteBookNoteTree(this.note.noteId)
        }else{
          MNUtil.db.deleteBookNote(this.note.noteId)
        }
      })
    }else{
      if (withDescendant) {
        MNUtil.db.deleteBookNoteTree(this.note.noteId)
      }else{
        MNUtil.db.deleteBookNote(this.note.noteId)
      }
    }
  }
  /**
   * Adds a child note to the current note.
   * 
   * This method adds a child note to the current note. The child note can be specified as an MbBookNote instance, an MNNote instance, a note URL, or a note ID.
   * If the child note is specified as a note URL or a note ID, the method will attempt to retrieve the corresponding note from the database.
   * If the child note is specified as an MNNote instance, the method will add the underlying MbBookNote instance as a child.
   * 
   * @param {MbBookNote|MNNote|string} note - The child note to add to the current note.
   */
  addChild(note){
    try {

    // MNUtil.showHUD(MNUtil.typeOf(note))
    switch (MNUtil.typeOf(note)) {
      case "NoteURL":
        let noteFromURL = MNUtil.getNoteById(MNUtil.getNoteIdByURL(note))
        if (noteFromURL) {
          this.note.addChild(noteFromURL)
        }else{
          MNUtil.copy(note)
          MNUtil.showHUD("Note not exist!")
        }
        break;
      case "string":
        let targetNote = MNUtil.getNoteById(note)
        if (targetNote) {
          this.note.addChild(targetNote)
        }else{
          MNUtil.copy(note)
          MNUtil.showHUD("Note not exist!")
        }
        break;
      case "MNNote":
        this.note.addChild(note.note)
        break;
      case "MbBookNote":
        this.note.addChild(note)
        break;
      default:
        MNUtil.showHUD("UNKNOWN Note")
        break;
    }
    } catch (error) {
      MNUtil.showHUD(error)
    }
  }
  /**
   * Adds a target note as a child note to the current note.
   * 
   * This method adds the specified target note as a child note to the current note. If the `colorInheritance` parameter is set to true, the target note will inherit the color of the current note.
   * The operation is wrapped within an undo grouping to allow for easy undo operations.
   * 
   * @param {MbBookNote|MNNote} targetNote - The note to be added as a child note.
   * @param {boolean} [colorInheritance=false] - Whether the target note should inherit the color of the current note.
   */
  addAsChildNote(targetNote,colorInheritance=false) {
    MNUtil.undoGrouping(()=>{
      if (colorInheritance) {
        targetNote.colorIndex = this.note.colorIndex
      }
      this.addChild(targetNote)
    })
  }
  /**
   * Adds the specified note as a sibling note to the current note.
   * 
   * This method adds the specified note as a sibling note to the current note. If the current note has no parent note, it displays a HUD message indicating that there is no parent note.
   * If the `colorInheritance` parameter is set to true, the color index of the target note is set to the color index of the current note.
   * 
   * @param {MbBookNote|MNNote} targetNote - The note to be added as a sibling.
   * @param {boolean} [colorInheritance=false] - Whether to inherit the color index from the current note.
   */
  addAsBrotherNote(targetNote,colorInheritance=false) {
    if (!this.note.parentNote) {
      MNUtil.showHUD("No parent note!")
      return
    }
    let parent = this.parentNote
    MNUtil.undoGrouping(()=>{
      if (colorInheritance) {
        targetNote.colorIndex = this.note.colorIndex
      }
      parent.addChild(targetNote)
    })
  }
  /**
   * Creates a child note for the current note based on the provided configuration.
   * 
   * This method creates a new child note for the current note using the specified configuration. If the current note is a document excerpt and not a mind map note,
   * it will create the child note under the corresponding mind map note in the current notebook. The method can optionally group the operation within an undo group.
   * 
   * @param {{title:String,excerptText:string,excerptTextMarkdown:boolean,content:string,markdown:boolean,color:number}} config - The configuration for the new child note.
   * @param {boolean} [undoGrouping=true] - Whether to group the operation within an undo group.
   * @returns {MNNote} The newly created child note.
   */
  createChildNote(config,undoGrouping=true) {
    let child
    let note = this
    let noteIdInMindmap = this.note.realGroupNoteIdForTopicId(MNUtil.currentNotebookId)
    if (noteIdInMindmap && this.noteId !== noteIdInMindmap) {
      //对文档摘录添加子节点是无效的，需要对其脑图中的节点执行添加子节点
      note = MNNote.new(noteIdInMindmap)
    }
    if (undoGrouping) {
      MNUtil.undoGrouping(()=>{
        try {
          child = MNNote.new(config)
          this.addChild(child)
        } catch (error) {
          MNUtil.showHUD("Error in createChildNote:"+error)
        }
      })
    }else{
      try {
        child = MNNote.new(config)
        this.addChild(child)
      } catch (error) {
        MNUtil.showHUD("Error in createChildNote:"+error)
      }
    }
    return child
  }
  /**
   *
   * @param {{title:String,content:String,markdown:Boolean,color:Number}} config
   * @returns {MNNote}
   */
  createBrotherNote(config,undoGrouping=true) {
    let note = this
    let noteIdInMindmap = this.note.realGroupNoteIdForTopicId(MNUtil.currentNotebookId)
    if (noteIdInMindmap && this.noteId !== noteIdInMindmap) {
      //对文档摘录添加子节点是无效的，需要对其脑图中的节点执行添加子节点
      note = MNNote.new(noteIdInMindmap)
    }
    if (!note.parentNote) {
      MNUtil.showHUD("No parent note!")
      return
    }
    let child
    let parent = note.parentNote
    if (undoGrouping) {
      MNUtil.undoGrouping(()=>{
        child = MNNote.new(config)
        parent.addChild(child)
      })
    }else{
      child = MNNote.new(config)
      parent.addChild(child)
    }
    return child
  }
  hasImage(){
    if (this.excerptPic && !this.textFirst) {
      return true
    }
    let comments = this.comments
    if (comments && comments.length) {
      let comment = comments.find(c=>c.type==="PaintNote")
      if (comment) {
        return true
      }
    }
    return false
  }
  /**
   * Append text comments as much as you want.
   * @param {string[]} comments
   * @example
   * node.appendTextComments("a", "b", "c")
   */
  appendTextComments(...comments) {
    comments = MNUtil.unique(comments, true)
    const existComments = this.note.comments.filter(k => k.type === "TextNote")
    comments.forEach(comment => {
      if (
        comment &&
        existComments.every(k => k.type === "TextNote" && k.text !== comment)
      ) {
        this.note.appendTextComment(comment)
      }
    })
    return this
  }
  /**
   *
   * @param  {string} comment
   * @param  {number} index
   * @returns
   */
  appendMarkdownComment(comment,index=undefined){
    this.note.appendMarkdownComment(comment)
    if (index !== undefined) {
      this.moveComment(this.note.comments.length-1, index)
    }
  }
  /**
   *
   * @param  {string} comment
   * @param  {number} index
   * @returns
   */
  appendTextComment(comment,index=undefined){
    this.note.appendTextComment(comment)
    if (index !== undefined) {
      this.moveComment(this.note.comments.length-1, index)
    }
  }
  /**
   *
   * @param {string} html
   * @param {string} text
   * @param {CGSize} size
   * @param {string} tag
   * @param  {number} index
   */
  appendHtmlComment(html, text, size, tag, index = undefined){
    this.note.appendHtmlComment(html, text, size, tag)
    if (index !== undefined) {
      this.moveComment(this.note.comments.length-1, index)
    }
  }
  /**
   *
   * @param  {string[]} comments
   * @returns
   */
  appendMarkdownComments(...comments) {
    comments = unique(comments, true)
    const existComments = this.note.comments.filter(k => k.type === "TextNote")
    comments.forEach(comment => {
      if (
        comment &&
        existComments.every(k => k.type === "TextNote" && k.text !== comment)
      ) {
        if (this.note.appendMarkdownComment)
          this.note.appendMarkdownComment(comment)
        else this.note.appendTextComment(comment)
      }
    })
  }
  sortCommentsByNewIndices(arr){
    this.note.sortCommentsByNewIndices(arr)
  }
  /**
   * Moves a comment from one index to another within the note's comments array.
   * 
   * This method reorders the comments array by moving a comment from the specified `fromIndex` to the `toIndex`.
   * If the `fromIndex` or `toIndex` is out of bounds, it adjusts them to the nearest valid index.
   * If the `fromIndex` is the same as the `toIndex`, it does nothing and displays a message indicating no change.
   * 
   * @param {number} fromIndex - The current index of the comment to be moved.
   * @param {number} toIndex - The target index where the comment should be moved.
   */
  moveComment(fromIndex, toIndex) {
  try {

    let length = this.comments.length;
    let arr = Array.from({ length: length }, (_, i) => i);
    let from = fromIndex
    let to = toIndex
    if (fromIndex < 0) {
      from = 0
    }
    if (fromIndex > (arr.length-1)) {
      from = arr.length-1
    }
    if (toIndex < 0) {
      to = 0
    }
    if (toIndex > (arr.length-1)) {
      to = arr.length-1
    }
    if (from == to) {
      // MNUtil.showHUD("No change")
      return
    }
    // 取出要移动的元素
    const element = arr.splice(to, 1)[0];
    // 将元素插入到目标位置
    arr.splice(from, 0, element);
    let targetArr = arr
    this.sortCommentsByNewIndices(targetArr)
    } catch (error) {
    MNUtil.showHUD(error)
  }
  }
  /**
   * Moves a comment to a new position based on the specified action.
   * 
   * This method moves a comment from its current position to a new position based on the specified action.
   * The available actions are:
   * - "top": Moves the comment to the top of the list.
   * - "bottom": Moves the comment to the bottom of the list.
   * - "up": Moves the comment one position up in the list.
   * - "down": Moves the comment one position down in the list.
   * 
   * @param {number} fromIndex - The current index of the comment to be moved.
   * @param {string} action - The action to perform (top, bottom, up, down).
   */
  moveCommentByAction(fromIndex, action) {
    let targetIndex
    switch (action) {
      case "top":
        targetIndex = 0
        break;
      case "bottom":
        targetIndex = 100
        break;
      case "up":
        targetIndex = fromIndex-1
        break;
      case "down":
        targetIndex = fromIndex+1
        break;
      default:
        MNUtil.copy(action)
        MNUtil.showHUD("Invalid action!")
        return
    }
    this.moveComment(fromIndex, targetIndex)
  }
  /**
   * Retrieves the indices of comments that match the specified condition.
   * 
   * This method iterates through the comments of the current note and returns the indices of the comments that satisfy the given condition.
   * The condition can include filtering by comment type, inclusion or exclusion of specific text, or matching a regular expression.
   * 
   * @param {Object} condition - The condition to filter the comments.
   * @param {string[]} [condition.type] - The types of comments to include (e.g., "TextNote", "HtmlNote").
   * @param {string} [condition.include] - The text that must be included in the comment.
   * @param {string} [condition.exclude] - The text that must not be included in the comment.
   * @param {string} [condition.reg] - The regular expression that the comment must match.
   * @returns {number[]} An array of indices of the comments that match the condition.
   */
  getCommentIndicesByCondition(condition){
    let indices = []
    let type = []
    if ("type" in condition) {
      type = Array.isArray(condition.type) ? condition.type : [condition.type]
    }
    this.note.comments.map((comment,commentIndex)=>{
      if (type.length) {
        if (!type.includes(comment.type)) {
          return
        }
      }
      if (condition.include) {
        if (comment.type === "PaintNote") {
          return
        }
        if (!comment.text.includes(condition.include)) {
          return
        }
      }
      if (condition.exclude) {
        if (comment.type === "PaintNote") {
          return
        }
        if (comment.text.includes(condition.include)) {
          return
        }
      }
      if (condition.reg) {
        if (comment.type === "PaintNote") {
          return
        }
        let ptt = new RegExp(condition.reg,"g")
        if (!(ptt.test(comment.text))) {
          return
        }
      }
      indices.push(commentIndex)
    })
    return indices
  }
  /**
   *
   * @param {number} index
   */
  removeCommentByIndex(index){
    let length = this.note.comments.length
    if(index >= length){
      index = length-1
    }
    this.note.removeCommentByIndex(index)
  }
  /**
   *
   * @param {number[]} indices
   */
  removeCommentsByIndices(indices){
    let commentsLength = this.note.comments.length
    let newIndices = indices.map(index=>{
      if (index > commentsLength-1) {
        return commentsLength-1
      }
      if (index < 0) {
        return 0
      }
      return index
    })
    let sortedIndices = MNUtil.sort(newIndices,"decrement")
    sortedIndices.map(index=>{
      this.note.removeCommentByIndex(index)
    })
  }
  /**
   *
   * @param {{type:string,include:string,exclude:string,reg:string}} condition
   */
  removeCommentByCondition(condition){
    let indices = this.getCommentIndicesByCondition(condition)
    this.removeCommentsByIndices(indices)
  }
  /**
   * Remove all comment but tag, link and also the filterd. And tags and links will be sat at the end。
   * @param filter not deleted
   * @param f call a function after deleted, before set tag and link
   */
  async removeCommentButLinkTag(
    // 不删除
    filter,
    f
  ) {
    const { removedIndex, linkTags } = this.note.comments.reduce(
      (acc, comment, i) => {
        if (
          comment.type == "TextNote" &&
          (comment.text.includes("marginnote3app://note/") ||
            comment.text.startsWith("#"))
        ) {
          acc.linkTags.push(comment.text)
          acc.removedIndex.unshift(i)
        } else if (!filter(comment)) acc.removedIndex.unshift(i)
        return acc
      },
      {
        removedIndex: [],
        linkTags: []
      }
    )
    removedIndex.forEach(k => {
      this.note.removeCommentByIndex(k)
    })
    f && (await f(this))
    this.appendTextComments(...linkTags)
    return this
  }

  /**
   * @param {string[]} titles
   * append titles as much as you want
   */
  appendTitles(...titles) {
    const newTitle = MNUtil.unique([...this.titles, ...titles], true).join("; ")
    if (this.note.excerptText === this.note.noteTitle) {
      this.note.noteTitle = newTitle
      this.note.excerptText = newTitle
    } else {
      this.note.noteTitle = newTitle
    }
    return this
  }
  /**
   * @param {string[]} tags
   * append tags as much as you want
   */
  appendTags(tags) {
  try {
    this.tidyupTags()
    tags = this.tags.concat(tags)//MNUtil.unique(this.tags.concat(tags), true)
    const lastComment = this.note.comments[this.note.comments.length - 1]
    if (lastComment?.type == "TextNote" && lastComment.text.startsWith("#")) {
      this.note.removeCommentByIndex(this.note.comments.length - 1)
    }
    this.appendTextComments(tags.map(k => '#'+k).join(" "))
    return this
  } catch (error) {
    MNUtil.copy(error.toString())
  }
  }
  /**
   * make sure tags are in the last comment
   */
  tidyupTags() {
    const existingTags= []
    const tagCommentIndex = []
    this.note.comments.forEach((comment, index) => {
      if (comment.type == "TextNote" && comment.text.startsWith("#")) {
        const tags = comment.text.split(" ").filter(k => k.startsWith("#"))
        existingTags.push(...tags.map(tag => tag.slice(1)))
        tagCommentIndex.unshift(index)
      }
    })

    tagCommentIndex.forEach(index => {
      this.note.removeCommentByIndex(index)
    })

    this.appendTextComments(
      MNUtil.unique(existingTags)
        .map(k => '#'+k)
        .join(" ")
    )
    return this
  }
  /**
   * @param {MbBookNote | string} comment
   * get comment index by comment
   */
  getCommentIndex(comment,includeHtmlComment = false) {
    const comments = this.note.comments
    for (let i = 0; i < comments.length; i++) {
      const _comment = comments[i]
      if (typeof comment == "string") {
        if (includeHtmlComment) {
          if ((_comment.type == "TextNote" || _comment.type == "HtmlNote" )&& _comment.text == comment) return i
        }else{
          if (_comment.type == "TextNote" && _comment.text == comment) return i
        }
      } else if (
        _comment.type == "LinkNote" &&
        _comment.noteid == comment.noteId
      )
        return i
    }
    return -1
  }
  clearFormat(){
    this.note.clearFormat()
  }
  /**
   * Appends a note link to the current note.
   * 
   * This method appends a note link to the current note based on the specified type. The type can be "Both", "To", or "From".
   * If the type is "Both", the note link is added to both the current note and the target note.
   * If the type is "To", the note link is added only to the current note.
   * If the type is "From", the note link is added only to the target note.
   * 
   * @param {MNNote|MbBookNote} note - The note to which the link should be added.
   * @param {string} type - The type of link to add ("Both", "To", or "From").
   */
  appendNoteLink(note,type="To"){
    switch (MNUtil.typeOf(note)) {
      case "MNNote":
        switch (type) {
          case "Both":
            this.note.appendNoteLink(note.note)
            note.note.appendNoteLink(this.note)
            break;
          case "To":
            this.note.appendNoteLink(note.note)
            break;
          case "From":
            note.note.appendNoteLink(this.note)
          default:
            break;
        }
        break;
      case "MbBookNote":
        switch (type) {
          case "Both":
            this.note.appendNoteLink(note)
            note.appendNoteLink(this.note)
            break;
          case "To":
            this.note.appendNoteLink(note)
            break;
          case "From":
            note.appendNoteLink(this.note)
          default:
            break;
        }
        break;
      default:
        break;
    }
  }
  clone() {
    let notebookId = MNUtil.currentNotebookId
    let noteIds = MNUtil.db.cloneNotesToTopic([this.note], notebookId)
    return MNNote.new(noteIds[0])
  }
  focusInMindMap(delay = 0){
    if (this.notebookId && this.notebookId !== MNUtil.currentNotebookId) {
      MNUtil.showHUD("Note not in current notebook")
      return
    }
    if (delay) {
      MNUtil.delay(delay).then(()=>{
        MNUtil.studyController.focusNoteInMindMapById(this.noteId)
      })
    }else{
      MNUtil.studyController.focusNoteInMindMapById(this.noteId)
    }
  }
  focusInDocument(delay = 0){
    if (delay) {
      MNUtil.delay(delay).then(()=>{
        MNUtil.studyController.focusNoteInDocumentById(this.noteId)
      })
    }else{
      MNUtil.studyController.focusNoteInDocumentById(this.noteId)
    }
  }
  focusInFloatMindMap(delay = 0){
    if (delay) {
      MNUtil.delay(delay).then(()=>{
        MNUtil.studyController.focusNoteInFloatMindMapById(this.noteId)
      })
    }else{
      MNUtil.studyController.focusNoteInFloatMindMapById(this.noteId)
    }
  }
  /**
   *
   * 
   * This method checks if the note has an excerpt picture. If it does, it retrieves the image data and the excerpt text.
   * If the note does not have an excerpt picture, it only retrieves the excerpt text. The method returns an object containing
   * arrays of OCR text, HTML text, and Markdown text.
   * 
   * @param {MbBookNote} note - The note from which to retrieve the excerpt text and image data.
   * @returns {{ocr: string[], html: string[], md: string[]}} An object containing arrays of OCR text, HTML text, and Markdown text.
   */
  static getNoteExcerptTextPic(note) {
    const acc = {
      ocr: [],
      html: [],
      md: []
    }
    const text = note.excerptText?.trim()
    if (note.excerptPic) {
      const imgs = MNNote.exportPic(note.excerptPic)
      if (imgs)
        Object.entries(imgs).forEach(([k, v]) => {
          if (k in acc) acc[k].push(v)
        })
      if (text) {
        acc.ocr.push(text)
      }
    } else {
      if (text) {
        Object.values(acc).forEach(k => k.push(text))
      }
    }
    return acc
  }
  /**
   * Get picture base64 code wrapped in html and markdown
   * @param {MNPic} pic
   * @returns
   * - html: '<img class="MNPic" src="data:image/jpeg;base64,${base64}"/>'
   * - md: '![MNPic](data:image/jpeg;base64,${base64})'
   */
  static exportPic(pic) {
    const base64 = MNUtil.db.getMediaByHash(pic.paint)?.base64Encoding()
    if (base64)
      return {
        html: `<img class="MNPic" src="data:image/jpeg;base64,${base64}"/>`,
        md: `![MNPic](data:image/jpeg;base64,${base64})`
      }
  }
  static focusInMindMapById(noteId,delay = 0){
    MNUtil.focusNoteInMindMapById(noteId,delay)
  }
  static focusInDocumentById(noteId,delay = 0){
    MNUtil.focusNoteInDocumentById(noteId,delay = 0)
  }
  static focusInFloatMindMapById(noteId,delay = 0){
    MNUtil.focusNoteInFloatMindMapById(noteId,delay = 0)
  }
  /**
   *
   * @param {MbBookNote|string} note
   */
  static focusInMindMap(note,delay=0){
    let noteId = MNUtil.getNoteId(note);
    if (noteId) {
      MNUtil.focusNoteInMindMapById(noteId,delay)
    }
  }
  /**
   *
   * @param {MbBookNote|string} note
   */
  static focusInDocument(note,delay){
    let noteId = MNUtil.getNoteId(note);
    if (noteId) {
      MNUtil.focusNoteInDocumentById(noteId,delay)
    }
  }
  static focusInFloatMindMap(note,delay){
    let noteId = MNUtil.getNoteId(note);
    if (noteId) {
      MNUtil.focusNoteInFloatMindMapById(noteId,delay)
    }
  }
  /**
   * Retrieves the currently focused note in the mind map or document.
   * 
   * This method checks for the focused note in the following order:
   * 1. If the notebook controller is visible and has a focused note, it returns that note.
   * 2. If the document map split mode is enabled, it checks the current document controller and all document controllers for a focused note.
   * 3. If a pop-up note info is available, it returns the note from the pop-up note info.
   * 
   * @returns {MNNote|undefined} The currently focused note, or undefined if no note is focused.
   */
  static getFocusNote() {
    let notebookController = MNUtil.notebookController
    if (!notebookController.view.hidden && notebookController.mindmapView && notebookController.focusNote) {
      return MNNote.new(notebookController.focusNote)
    }
    if (MNUtil.studyController.docMapSplitMode) {//不为0则表示documentControllers存在
      let note = MNUtil.currentDocController.focusNote
      if (note) {
        return MNNote.new(note)
      }
      let focusNote
      let docNumber = MNUtil.docControllers.length
      for (let i = 0; i < docNumber; i++) {
        const docController = MNUtil.docControllers[i];
        focusNote = docController.focusNote
        if (focusNote) {
          return MNNote.new(focusNote)
        }
      }
      if (MNUtil.popUpNoteInfo) {
        return MNNote.new(MNUtil.popUpNoteInfo.noteId)
      }
    }
    return undefined
  }
    /**
   * 
   * @param {MbBookNote|MNNote} note 
   */
  static hasImageInNote(note){
    if (note.excerptPic && !note.textFirst) {
      return true
    }
    if (note.comments && note.comments.length) {
      let comment = note.comments.find(c=>c.type==="PaintNote")
      if (comment) {
        return true
      }
    }
    return false
  }
  static fromSelection(docController = MNUtil.currentDocController){
    let selection = MNUtil.currentSelection
    if (!selection.onSelection) {
      return undefined
    }
    return MNNote.new(docController.highlightFromSelection())
  }
  /**
   * Retrieves the focus notes in the current context.
   * 
   * This method checks for focus notes in various contexts such as the mind map, document controllers, and pop-up note info.
   * It returns an array of MNNote instances representing the focus notes. If no focus notes are found, it returns an empty array.
   * 
   * @returns {MNNote[]} An array of MNNote instances representing the focus notes.
   */
  static getFocusNotes() {
    let notebookController = MNUtil.notebookController
    if (!notebookController.view.hidden && notebookController.mindmapView && notebookController.mindmapView.selViewLst && notebookController.mindmapView.selViewLst.length) {
      let selViewLst = notebookController.mindmapView.selViewLst
      return selViewLst.map(tem=>{
        return MNNote.new(tem.note.note)
      })
    }
    if (MNUtil.studyController.docMapSplitMode) {//不为0则表示documentControllers存在
      let note = MNUtil.currentDocController.focusNote
      if (note) {
        return [MNNote.new(note)]
      }
      let focusNote
      let docNumber = MNUtil.docControllers.length
      for (let i = 0; i < docNumber; i++) {
        const docController = MNUtil.docControllers[i];
        focusNote = docController.focusNote
        if (focusNote) {
          return [MNNote.new(focusNote)]
        }
      }
    }
    if (MNUtil.popUpNoteInfo) {
        return [MNNote.new(MNUtil.popUpNoteInfo.noteId)]
    }
    //如果两个上面两个都没有，那就可能是小窗里打开的
    return [MNNote.new(notebookController.focusNote)]
  }
  static getSelectedNotes(){
    return this.getFocusNotes()
  }
  /**
   * Clones a note to the specified notebook.
   * 
   * This method clones the provided note to the specified notebook. The note object can be of various types:
   * - An MbBookNote instance.
   * - A string representing a note URL.
   * - A string representing a note ID.
   * - A configuration object for creating a new note.
   * 
   * If the note object is a string representing a note URL, the method will attempt to retrieve the corresponding note from the URL.
   * If the note object is a string representing a note ID, the method will attempt to retrieve the corresponding note from the database.
   * If the note object is a configuration object, the method will create a new note with the specified properties.
   * 
   * @param {MbBookNote|string|MNNote} note - The note object to clone.
   * @param {string} [notebookId=MNUtil.currentNotebookId] - The ID of the notebook to clone the note to.
   * @returns {MNNote|undefined} The cloned MNNote instance or undefined if the note object is invalid.
   */
  static clone(note, notebookId = MNUtil.currentNotebookId) {
    let noteIds = []
    // let notebookId = MNUtil.currentNotebookId
    switch (MNUtil.typeOf(note)) {
      case "NoteURL":
        let noteFromURL = MNUtil.getNoteById(MNUtil.getNoteIdByURL(note))
        if (!noteFromURL) {
          MNUtil.copy(note)
          MNUtil.showHUD("Note not exists!")
          return undefined
        }
        noteIds = MNUtil.db.cloneNotesToTopic([noteFromURL], notebookId)
        return MNNote.new(noteIds[0])
      case "string":
        let targetNote = MNUtil.getNoteById(note)
        if (!targetNote) {
          MNUtil.copy(note)
          MNUtil.showHUD("Note not exists!")
          return undefined
        }
        noteIds = MNUtil.db.cloneNotesToTopic([targetNote], notebookId)
        return MNNote.new(noteIds[0])
      case "MbBookNote":
        noteIds = MNUtil.db.cloneNotesToTopic([note], notebookId)
        return MNNote.new(noteIds[0])
      case "MNNote":
        noteIds = MNUtil.db.cloneNotesToTopic([note.note], notebookId)
        return MNNote.new(noteIds[0])
      default:
        break;
    }
  }
  /**
   * Retrieves the image data from the current document controller or other document controllers if the document map split mode is enabled.
   * 
   * This method checks for image data in the current document controller's selection. If no image is found, it checks the focused note within the current document controller.
   * If the document map split mode is enabled, it iterates through all document controllers to find the image data. If a pop-up selection info is available, it also checks the associated document controller.
   * 
   * @param {boolean} [checkImageFromNote=false] - Whether to check the focused note for image data.
   * @param {boolean} [checkDocMapSplitMode=false] - Whether to check other document controllers if the document map split mode is enabled.
   * @returns {NSData|undefined} The image data if found, otherwise undefined.
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
}

class MNExtensionPanel {
  static subviews = {}
  static get currentWindow(){
    //关闭mn4后再打开，得到的focusWindow会变，所以不能只在init做一遍初始化
    return this.app.focusWindow
  }
  static get subviewNames(){
    return Object.keys(this.subviews)
  }
  static get app(){
    // this.appInstance = Application.sharedInstance()
    // return this.appInstance
    if (!this.appInstance) {
      this.appInstance = Application.sharedInstance()
    }
    return this.appInstance
  }
  static get studyController(){
    return this.app.studyController(this.currentWindow)
  }
  /**
   * @returns {{view:UIView}}
   **/
  static get controller(){
    return this.studyController.extensionPanelController
  }
  /**
   * @returns {UIView}
   */
  static get view(){
    return this.studyController.extensionPanelController.view
  }
  static get frame(){
    return this.view.frame
  }
  static get width(){
    return this.view.frame.width
  }
  static get height(){
    return this.view.frame.height
  }
  static get on(){
    if (this.controller && this.view.window) {
      return true
    }
    return false
  }
  /**
   * 用于关闭其他窗口的扩展面板
   * @param {UIWindow} window 
   */
  static hideExtentionPanel(window){
    let originalStudyController = this.app.studyController(window)
    if (originalStudyController.extensionPanelController.view.window) {
      originalStudyController.toggleExtensionPanel()
    }
  }
  static toggle(){
    this.studyController.toggleExtensionPanel()
  }
  static show(name = undefined){
    if (!this.on) {
      this.toggle()
    }
    if (name && name in this.subviews) {
      let allNames = Object.keys(this.subviews)
      allNames.forEach(n=>{
        let view = this.subviews[n]
        if (n == name){
          if (!view.isDescendantOfView(this.view)) {
            this.hideExtentionPanel(view.window)
            view.removeFromSuperview()
            this.view.addSubview(view)
          }
          view.hidden = false
        }else{
          view.hidden = true
        }
      })
    }
  }
  /**
   * 
   * @param {string} name 
   * @returns {UIView}
   */
  static subview(name){
    return this.subviews[name]
  }
  /**
   * 需要提供一个视图名,方便索引和管理
   * @param {string} name 
   * @param {UIView} view 
   */
  static addSubview(name,view){
    if (this.controller) {
      this.subviews[name] = view
      this.view.addSubview(view)
      let allNames = Object.keys(this.subviews)
      allNames.forEach(n=>{
        if (n == name){
          this.subviews[n].hidden = false
        }else{
          this.subviews[n].hidden = true
        }
      })
    }else{
      MNUtil.showHUD("Show Extension Panel First!")
    }
  }
  static removeSubview(name){
    if (name in this.subviews) {
      this.subviews[name].removeFromSuperview()
      delete this.subviews[name]
    }
  }
}