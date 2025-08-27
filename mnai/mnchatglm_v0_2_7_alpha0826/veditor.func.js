window.MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']]
  },
  svg: {
    fontCache: 'global'
  }
};
let onProcess = false
let processPercent = 0
let parsedPdf
let pageContents = [];
let pageStructure = []
let buttonCodeBlockCache = {}
let buttonPreContent = ""

function getValidJSON(jsonString,debug = false) {
  try {
    if (typeof jsonString === "object") {
      return jsonString
    }
    return JSON.parse(jsonString)
  } catch (error) {
    try {
      return JSON.parse(jsonrepair(jsonString))
    } catch (error) {
      let errorString = error.toString()
      try {
        if (errorString.startsWith("Unexpected character \"{\" at position")) {
          return JSON.parse(jsonrepair(jsonString+"}"))
        }
        return {}
      } catch (error) {
        debug && this.addErrorLog(error, "getValidJSON", jsonString)
        return {}
      }
    }
  }
}
/**
 * 
 * @param {string} md 
 * @returns 
 */
function md2html(md){
  md = renderKaTeXFormulas(md)
  let res = marked.parse(md.replace(/_{/g,'\\_\{').replace(/_\\/g,'\\_\\'))
  return res
}
/**
 * 将字符串中美元符号包裹的 LaTeX 公式替换为 KaTeX 渲染后的 HTML
 * @param {string} inputStr - 包含可能公式的原始字符串（如 "E=mc^2$，块级公式：$$\int_a^b f(x)dx$$"）
 * @param {Object} [katexOptions] - KaTeX 渲染配置项（可选，默认：{ throwOnError: false }）
 * @returns {string} 替换公式后的 HTML 字符串
 */
function renderKaTeXFormulas(inputStr, katexOptions = {}) {
  // 合并默认配置和用户配置（throwOnError 默认关闭，避免生产环境报错）
  const defaultOptions = { throwOnError: false, errorColor: "#cc0000" };
  const options = { ...defaultOptions, ...katexOptions };

  // 正则表达式：匹配 $$...$$（块级公式）和 $...$（行内公式）
  // 注意：使用非贪婪匹配（*?）避免跨多个公式匹配，同时排除转义的 \$（即 \$ 不视为公式分隔符）
  const formulaRegex = /(?<!\\)\$\$(.*?)(?<!\\)\$\$|(?<!\\)\$(.*?)(?<!\\)\$/gs;

  // 替换匹配到的公式
  return inputStr.replace(formulaRegex, (match, blockFormula, inlineFormula) => {
    // 判断是块级公式（$$...$$）还是行内公式（$...$）
    const isBlock = blockFormula !== undefined;
    const formulaContent = isBlock ? blockFormula.trim() : inlineFormula.trim();

    try {
      // 使用 KaTeX 渲染公式为 HTML 字符串
      return katex.renderToString(formulaContent, {
        ...options,
        displayMode: isBlock, // 块级公式设置 displayMode: true
      });
    } catch (error) {
      // 渲染失败时，返回错误提示（保留原始公式内容以便调试）
      console.error("KaTeX 渲染错误:", error, "公式内容:", formulaContent);
      return `<span style="color: ${options.errorColor}; background: #ffebee; padding: 2px 4px; border-radius: 2px;">
        [公式错误: ${formulaContent}]
      </span>`;
    }
  });
}
  /**
   * 
   * @param {string} jsonString 
   * @returns {boolean}
   */
  function isValidJSON(jsonString){
    // return NSJSONSerialization.isValidJSONObject(result)
     try{
         var json = JSON.parse(jsonString);
         if (json && typeof json === "object") {
             return true;
         }
     }catch(e){
         return false;
     }
     return false;
  }
function clearCache() {
  buttonCodeBlockCache = {}
  buttonPreContent = ""
}
/**
 * 
 * @param {string} code 
 * @returns 
 */
function getChoiceBlock(code) {
  let url = `userselect://choice?content=${encodeURIComponent(code)}`
  let tem = code.split(". ")
  let backgroundColor = (theme === "dark") ? "rgba(213, 233, 255, 0.8)" : "rgba(194, 232, 255, 0.8)"
  let borderColor = (theme === "dark") ? "rgb(222, 226, 230)" : "rgb(193, 198, 202)"
  if (tem.length > 1 && tem[0].trim().length === 1) {
    
  return `<div style="margin-top: 5px;">
    <a href="${url}" style="display: block; padding: 16px 16px; color:rgb(42, 48, 55); border-radius: 12px; text-decoration: none; border: 2px solid ${borderColor}; background:${backgroundColor}; font-size: 16px; cursor: pointer; box-sizing: border-box; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.02); position: relative;">
      <span style="display: inline-block; width: 26px; height: 26px; background: #2196f3; color: white; border-radius: 50%; text-align: center; line-height: 26px; font-weight: 600; font-size: 13px; margin-right: 12px; vertical-align: middle;">
      ${tem[0]}
      </span>
      <span style="vertical-align: middle;">${tem.slice(1).join(". ")}</span>
  </a>
  </div>`
  }
  return `<div style="margin-top: 5px;">
    <a href="${url}" style="display: block; padding: 16px 20px; color:rgb(42, 48, 55); border-radius: 12px; text-decoration: none; border: 2px solid #dee2e6; background: ${backgroundColor}; font-size: 15px; cursor: pointer; box-sizing: border-box; transition: all 0.2s ease; box-shadow: 0 2px 4px rgba(0,0,0,0.02); position: relative;">
      <span style="vertical-align: middle;">${code}</span>
  </a>
  </div>`
}
/**
 * 
 * @param {string} code 
 */
function getQustionBlock(code) {
  // if (code.endsWith("...")) {
  //   //去除末尾的...
  //   code = code.slice(0, -3)
  // }
  let config = getValidJSON(code)
  // console.log(config);
  let keys = Object.keys(config)
      if (keys.length === 0) {
        return undefined
      }
      if (keys.length === 1 && keys[0] === "...") {
        return undefined
      }
    let encodedContent = encodeURIComponent(code);
      let createNoteURL = `userselect://addnote?content=${encodedContent}&type=choiceQuestion`
      
      let choices = []
      if ("choices" in config) {
        choices = config.choices.map(choice => { 
          return getChoiceBlock(choice)
        })
      }
      let titleHTML = ""
      if ("title" in config) {
        let titleColor = (theme === "dark") ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"
        titleHTML = `<h1 style="color: ${titleColor}; margin: 10px 0 10px 0; font-size: 24px; font-weight: 600;">${config.title}</h1>`
      }
      let descriptionHTML = ""
      if ("description" in config) {
        let descriptionColor = (theme === "dark") ? "rgb(221, 221, 221)" : "rgb(22, 44, 66)"
        descriptionHTML = `<p style="color: ${descriptionColor}; margin: 10px 0 10px 0; font-size: 16px;">${config.description}</p>`
      }
      let backgroundColor = (theme === "dark") ? "rgba(133, 149, 159, 0.4)" : "rgba(233, 246, 255, 0.8)"
      let borderColor = (theme === "dark") ? "rgba(124, 141, 152, 0.4)" : "rgba(125, 140, 154, 0.8)"
      let newNoteButtonTextColor = (theme === "dark") ? "rgb(1, 71, 176)" : "rgb(1, 71, 176)"
      let newNoteButtonBackgroundColor = (theme === "dark") ? "rgba(213, 233, 255, 0.8)" : "rgba(13, 110, 253, 0.08)"
      let newNoteButtonBorderColor = (theme === "dark") ? "rgba(192, 217, 255, 0.47)" : "rgba(13, 110, 253, 0.15)"
      let questionHTML = `\n<div style="background: ${backgroundColor}; box-shadow: 0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04);  width: calc(100% - 20px);  border-radius: 16px; padding: 5px; margin: 3px; border: 1px solid ${borderColor}; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
    <div style="text-align: right; margin-top: 1px; margin-bottom: 2px;">
        <div style="display: inline-block; font-weight: 600; width: 105px; font-size: 14px; text-align: center; padding: 8px 5px; background: ${newNoteButtonBackgroundColor}; border-radius: 12px; border: 1px solid ${newNoteButtonBorderColor};">
            <a href="${createNoteURL}" style="text-decoration: none; color: ${newNoteButtonTextColor}; display: block;">
               ➕ 点击创建卡片
            </a>
        </div>
    </div>
      <div style="text-decoration: none; text-align: center; margin-bottom: 15px; margin-top: 15px;">
          ${titleHTML}
          ${descriptionHTML}
      </div>
      ${choices.join("")}
  </div>`
      return questionHTML
    }
function codeBlockReplacer(lang,format,code){
    if (lang === "choiceQuestion") {
      return getQustionBlock(code)
    }
    let encodedContent = encodeURIComponent(code);
    if (lang === "userSelect") {
      let url = `userselect://choice?content=${encodedContent}`
      code = renderKaTeXFormulas(code)
      // code = md2html(code)
      return `\n<div><a href="${url}" style="display: block; padding: 10px 12px; margin-top: 10px; background: #e3eefc; color: #1565c0; border-radius: 8px; text-decoration: none; border: 2px solid transparent; border-color: #90caf9; font-size: 15px; cursor: pointer; box-sizing: border-box;">
${code.trim()}
</a></div>`
    }
    if (lang === "addNote") {
      // console.log("addNote");
      let url = `userselect://addnote?content=${encodedContent}`
      if (format === "markdown") {
        // console.log("markdown");
        
        url = `userselect://addnote?content=${encodedContent}&format=markdown`
        code = md2html(code)
      }
      return `\n<div><a href="${url}" style="display: block; padding: 10px 12px; margin-top: 10px; background:rgb(230, 255, 239); color:#237427; border-radius: 8px; text-decoration: none; border: 2px solid transparent; border-color:#01b76e; font-size: 15px; cursor: pointer; box-sizing: border-box;">
<div style="font-weight: bold;margin-bottom: 5px;font-size: 18px;">➕点击创建笔记：</div>
${code.trim()}
</a></div>`
  }
    if (lang === "addComment") {
      let url = `userselect://addcomment?content=${encodedContent}`
      if (format === "markdown") {
        url = `userselect://addnote?content=${encodedContent}&format=markdown`
        code = md2html(code)
      }
      return `\n<div><a href="${url}" style="display: block; padding: 10px 12px; margin-top: 10px; background:rgb(230, 255, 239); color:#237427; border-radius: 8px; text-decoration: none; border: 2px solid transparent; border-color:#01b76e; font-size: 15px; cursor: pointer; box-sizing: border-box;">
<div style="font-weight: bold;margin-bottom: 5px;font-size: 18px;">➕点击添加卡片评论：</div>
${code.trim()}
</a></div>`
  }
  return ""
}
/**
 * 从markdown中提取 userSelect 或 addNote 代码块，并替换成指定内容
 * @param {string} markdown - 原始markdown
 * @returns {string} 
 */
function replaceSpecialBlocks(markdown) {
  // const blocks = [];
  // 正则：匹配```userSelect 或 ```addNote 开头，直到下一个```
const pattern = /```(userSelect|addNote|addComment|choiceQuestion)\s*(plaintext|markdown|json)?\n([\s\S]*?)```/g;
const newMarkdown = markdown.replace(pattern, (match, lang, format, code) => {
    // blocks.push(code);
    if (match in buttonCodeBlockCache) {
      // notyf.success("Using cache")
      return buttonCodeBlockCache[match]
    }
    let res = codeBlockReplacer(lang,format,code)
    buttonCodeBlockCache[match] = res
    return res
    // return typeof replacer === 'function'
    //   ? replacer(lang,format,code)
    //   : String(replacer);
  });
  return newMarkdown;
}
/**
 * 匹配开头为 ``` 的代码块，但结尾不是 ``` 的代码块，并替换成指定内容
 * 不参与缓存检测
 * @param {string} markdown - 原始markdown
 * @returns {string} 
 */
function replaceSpecialBlocksNotEndingWithBacktick(markdown) {
  // const blocks = [];
  // 正则：匹配```userSelect 或 ```addNote 开头，直到下一个```
const pattern = /```(userSelect|addNote|addComment|choiceQuestion)\s*(plaintext|markdown|json)?\n([\s\S]*?)$/g;
const newMarkdown = markdown.replace(pattern, (match, lang, format, code) => {
    let res = codeBlockReplacer(lang,format,code)
    if (res) {
      buttonPreContent = res
    }else{
      if (buttonPreContent) {
        return buttonPreContent
      }
      return ""
    }
    return res
  });
  return newMarkdown;
}
/**
 * 
 * @param {string} markdown 
 * @returns 
 */
function replaceButtonCodeBlocks(markdown) {
  let res = replaceSpecialBlocks(markdown)
  res = replaceSpecialBlocksNotEndingWithBacktick(res)
  if (!res) {
    return ""
  }
  return res
}


/**
 * 解析单页的 textContent 对象，并根据文本项的布局返回带有正确换行和空格的字符串。
 * @param {object} textContent - 从 page.getTextContent() 获取的对象。
 * @param {number} [paragraphThreshold=1.5] - (可选) 判断为新段落的垂直间距倍数。
 * @returns {string} - 包含正确换行和空格格式的单页文本字符串。
 */
function parseTextContent(textContent, paragraphThreshold = 1.5) {
  if (!textContent || !textContent.items || textContent.items.length === 0) {
    return '';
  }

  // 定义一个正则表达式来匹配中日韩字符及全角符号
  // 这有助于我们判断一个字符是否属于“东亚文字”
  const CJK_PUNCT_REGEX = /[\u3000-\u303f\u4e00-\u9fff\uac00-\ud7af\uff00-\uffef]/;

  const sortedItems = textContent.items

  let pageText = '';
  let lastY = -1;
  let lastItemHeight = 0;
  let lastItemHasEOL = false
  let minX = 100


  for (const item of sortedItems) {
    // 清理单个文本项内部可能存在的多余空格
    const trimmedStr = item.str.replace(/\s+/g, ' ');

    if (lastY !== -1) {
        // console.log(trimmedStr+":"+item.transform[4]+":"+minX);
      const y_diff = Math.abs(item.transform[5] - lastY);
      // console.log(lastItemHeight);
      
      
      if ((y_diff > lastItemHeight * paragraphThreshold)) {
        pageText += '\n\n';
      }else if (trimmedStr.trim() && lastItemHasEOL && item.transform[4] > minX) {
        // console.log("return");
        pageText += '\n\n';
      }else if (trimmedStr.trim() && lastItemHasEOL) {
        pageText += ' ';
      } else if (item.height && (lastItemHeight > item.height*1.5 || lastItemHeight*1.5 < item.height)) {
        pageText += '\n\n';
      } else if (trimmedStr.trim() && y_diff > 2) {
        pageText += '\n';
      } else {
        // --- 智能空格逻辑 ---
        // 只有当两个文本项在同一行时，才需要判断是否添加空格
        const lastChar = pageText.slice(-1);
        const firstChar = trimmedStr[0];

        // 检查上一个字符和当前第一个字符，决定是否需要空格
        // 规则：当两个字符中，至少有一个不是 CJK 字符时，我们才需要添加空格。
        // 同时要确保上一个字符不是换行符或空格。
        if (lastChar && firstChar && !/\s/.test(lastChar)) {
          if (!CJK_PUNCT_REGEX.test(lastChar) || !CJK_PUNCT_REGEX.test(firstChar)) {
            pageText += '';
          }
        }
      }
    }
    
    // 拼接清理过的文本项
    pageText += trimmedStr;

    lastY = item.transform[5];
    if (trimmedStr.trim()) {
      lastItemHeight = item.height;
      lastItemHasEOL = item.hasEOL;
      if (item.transform[4] < minX) {
        minX = item.transform[4]
        
      }
    }
  }
pageText = pageText
      // a. 在中文和英文/数字之间添加空格
      .replace(/([\u4e00-\u9fff])([a-zA-Z0-9])/g, '$1 $2')
      .replace(/([a-zA-Z0-9])([\u4e00-\u9fff])/g, '$1 $2')
      // b. 移除中文之间的所有空格
      .replace(/([\u4e00-\u9fff])\s+([\u4e00-\u9fff])/g, '$1$2')
      // c. 移除单词与后续标点符号之间的空格 (关键！修复标点问题)
      .replace(/\s+([,.:;?!%)\]}])\s?/g, '$1 ')
      // d. 移除前置标点符号与后续单词之间的空格
      .replace(/([$([{“])\s+/g, '$1')
      // .replace(/([$([{“])\s+/g, '$1')
      // e. 将多个连续空格合并为一个
      .replace(/\n\n+/g, '\n\n')
      .trim();
  return pageText.trim(); // 最后清理一次，确保没有首尾空格
}
function getPdfContent() {
  parsedPdf = undefined
  return JSON.stringify(pageContents,null,2)
}
function getProgress() {
  let process = {
    onProcess: onProcess,
    processPercent: processPercent
  }
  return encodeURIComponent(JSON.stringify(process))
}
const renderPage = async (pageNum) => {
    console.log("renderPage",pageNum);
    const numPages = parsedPdf.numPages;
    // if (pageNum < 12) {
    //   await renderPage(pageNum + 1);
    //   return
    // }
    if (pageNum > numPages) return;
    processPercent = pageNum/numPages*100
    let progressEle = document.getElementById("progress-container")
    progressEle.innerHTML = `Parsing page ${pageNum} of ${numPages}`
    
    const page = await parsedPdf.getPage(pageNum);
    // 获取页面文本内容
    const textContent = await page.getTextContent();
    
    const textItems = parseTextContent(textContent,2);
    pageContents.push(textItems);
    pageStructure.push({"pageIndex":pageNum,"content":pageContents})
    // if (pageNum == 12) {
      
    // console.log(textContent);
    // console.log(`第 ${pageNum} 页文本内容:\n`, textItems);
    // }
    // await page.render(renderContext).promise;
    await renderPage(pageNum + 1);
};
/**
 * 
 * @param {number} ms 
 * @returns {Promise<void>}
 */
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
async function getDocumentContent(base64) {
  let otherEle = document.getElementById("other")
  if (!otherEle) {
    await delay(1000)
    otherEle = document.getElementById("other")
  }
  if (!otherEle) {
    await delay(1000)
    otherEle = document.getElementById("other")
  }
  let progressEle = document.getElementById("progress-container")   
  if (!progressEle) {
    progressEle = document.createElement("div")
    progressEle.setAttribute("id","progress-container")
    otherEle.append(progressEle)
  }
  // console.log(otherEle);
  // otherEle.innerHTML = `<div class="progress-container">`
  onProcess = true
  if (typeof pdfjsLib === 'undefined') {
    await delay(1000)
  }
  if (typeof pdfjsLib === 'undefined') {
    await delay(1000)
  }
const rawData = atob(base64); // 解码Base64
const buffer = new Uint8Array(rawData.length);
for (let i = 0; i < rawData.length; i++) {
  buffer[i] = rawData.charCodeAt(i);
}
pageContents = []
  return new Promise(async (resolve, reject) => {
pdfjsLib.getDocument(buffer).promise
            .then(async(pdf)=>{
                // window.location.href = "nativecopy://content="+encodeURIComponent("Parsing pdf...")
                parsedPdf = pdf
                await renderPage(1);
                onProcess = false
                let res = pageContents.join('\n\n')
                // console.log(res);
                resolve(res)
                // console.log(pageContents.join('\n\n'));
                // console.log(pageStructure);
                
            });
  })
  
}
function getTop() {
  var element = document.getElementsByClassName("vditor")[0]
  var position = element.getBoundingClientRect();

  // 获取文档的滚动位置
  var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // 计算相对于文档的位置
  var docPosition = {
      top: position.top + scrollTop,
      left: position.left + scrollLeft
  };
  return docPosition.top
}
function scrollToBottom() {
  const scrollHeight = document.body.scrollHeight; // 页面的总高度
  const clientHeight = document.documentElement.clientHeight; // 可视区域的高度
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop; // 当前滚动的位置

  // 判断是否已经滚动到底部
  if (scrollHeight - (scrollTop + clientHeight) > 1) {
    window.scrollTo(0, scrollHeight); // 滚动到底部
  }
}



async function setResponse(resEncoded) {
  let res = JSON.parse(decodeURIComponent(resEncoded))
  let funcResponse = res.funcResponse ?? ""
  funcResponse = funcResponse.trim()
  let reasoningResponse = res.reasoningResponse ?? ""
  reasoningResponse = reasoningResponse.trim()
  let scrollToBottom = res.scrollToBottom ?? false
  let response = res.response ?? ""
  // response = response.trim()
  response = replaceButtonCodeBlocks(response)
  let otherEle = document.getElementById("other")
  if (reasoningResponse && preReasoning !== reasoningResponse.trim()) {
    let reasoningEle = document.getElementById("reasoningResponse")   
    let collapsibleEle = document.getElementsByClassName("collapsible-content")[0]
    //判断reasoningEle是否存在
    if (!reasoningEle) {
      reasoningBegin = Date.now()
      reasoningEle = document.createElement("div")
      reasoningEle.setAttribute("id","reasoningResponse")
      otherEle.append(reasoningEle)
      reasoningEle.innerHTML = `<div class="collapsible-header" onclick="toggleCollapse(this)">
        <span class="thinkingTitle">🤔 Thinking...</span>
        <span class="toggle-icon" onclick="copyReasoningContent(this)">Copy</span></div><div class="collapsible-content"></div>`
      collapsibleEle = document.getElementsByClassName("collapsible-content")[0]
      collapsibleEle.style.maxHeight = '270px';
      collapsibleEle.style.padding = '10px';
        // document.querySelectorAll('.collapsible-content').forEach(item => {
        //     item.style.maxHeight = '170px';
        //     item.style.padding = '10px';
        // });
    }else if (!reasoningBegin) {
      reasoningBegin = Date.now()
    }

    collapsibleEle.innerHTML=reasoningResponse
    reasoningEle.querySelector('.thinkingTitle').textContent = `🤔 Thinking... (${((Date.now() - reasoningBegin)/1000).toFixed(1)}s)`
    // reasoningEle.innerHTML=reasoningResponse
    preReasoning = reasoningResponse.trim()
    //滚动到底部
    collapsibleEle.scrollTo(0,collapsibleEle.scrollHeight)
    // reasoningEle.scrollTo(0,reasoningEle.scrollHeight)
    if (reasoningResponse.trim().endsWith("...")) {
      expand()
      notifyRefreshHeight()
    }
  }
  if (funcResponse && preFunc !== funcResponse) {
    collapse()
    let funcResponseEle = document.getElementById("funcResponse")
    if (!funcResponseEle) {
      funcResponseEle = document.createElement("div")
      funcResponseEle.setAttribute("id","funcResponse")
      otherEle.append(funcResponseEle)
    }
    funcResponseEle.innerHTML=funcResponse
    funcResponseEle.scrollTo(0,funcResponseEle.scrollHeight)

    preFunc = funcResponse
    notifyRefreshHeight()
  }
  if (!response) {
    if (preContent) {
      // tem.innerHTML = ""
      preContent = ""
      // notifyRefreshHeight()
      // Vditor.md2html(tem,"",option).then((html)=>{
      //   tem.innerHTML = html
      // })
      Vditor.preview(tem,"",option)
    }
  }else if (preContent !== response) {
    collapse()
    // let html = await Vditor.md2html(response,option)
    // tem.innerHTML = html
    // preContent = response
    // if (scrollToBottom) {
    //   scrollToBottom()
    // }
    // notifyRefreshHeight()
    // console.log(response);
    
    Vditor.preview(tem,response,option)
    preContent = response
    // if (scrollToBottom) {
    //   scrollToBottom()
    // }
  }else{
    notifyRefreshHeight()
  }
  notifyRefreshHeight()

  // return document.body.scrollHeight
}

function setRealResponse(resEncoded) {
  let response = decodeURIComponent(resEncoded).trim()
  if (!response) {
    if (preContent) {
      Vditor.preview(tem,"",option)
      preContent = ""
    }
  }else if (preContent !== response) {
    collapse()
    Vditor.preview(tem,response,option)
    preContent = response
    // scrollToBottom()
  }
}
  /**
   * 获取当前选中的text/html
   * */
  function getCurrentSelect(){
    // let selectedHtml = editor.getSelection()
    let selectionObj = null, rangeObj = null;
    let selectedText = "", selectedHtml = "";

    // 处理兼容性
    if(window.getSelection){
      // 现代浏览器
      // 获取text
      selectionObj = window.getSelection();

      //  获取html
      rangeObj = selectionObj.getRangeAt(0);
      var docFragment = rangeObj.cloneContents();
      var tempDiv = document.createElement("div");
      tempDiv.appendChild(docFragment);
      selectedHtml = tempDiv.innerHTML;
    } else if(document.selection){
        // 非主流浏览器IE
        selectionObj = document.selection;
        rangeObj = selectionObj.createRange();
        selectedHtml = rangeObj.htmlText;
    }
    return editor.html2md(selectedHtml);
  };
  function createAudioElement(divId) {
    // 获取指定的div元素
    var div = document.getElementById(divId);
    div.style = "height:30px"
    if (!div) {
        console.error('Div with id ' + divId + ' not found.');
        return;
    }

    // 创建audio元素
    var audio = document.createElement('audio');
    audio.controls = true;
    audio.id = 'audioPlayer';
    // 将audio元素和fallback文本添加到div中
    div.appendChild(audio);
  }
function triggerKey(key,code,keyCode,metaKey=false,shiftKey=false,altKey=false) {
  var event = new KeyboardEvent('keydown', {
    key: key,
    code: code,
    keyCode: keyCode,
    which: keyCode,
    ctrlKey: false, // 在Windows上是true，在macOS上是metaKey: true
    metaKey: metaKey, // 在macOS上使用metaKey来表示Cmd键
    shiftKey: shiftKey,
    altKey: altKey,
    bubbles: true,
    cancelable: true
  });
  document.getElementsByClassName("vditor-reset")[0].dispatchEvent(event)
}
function copyToClipboard(text) {
  // notyf.success("Text copied")
  window.location.href = "nativeCopy://content="+encodeURIComponent(text);
}
function copyReasoningContent(header) {
  event.stopPropagation()
  let collapsibleEle = document.getElementsByClassName("collapsible-content")[0]
  copyToClipboard(collapsibleEle.textContent)
  // console.log(collapsibleEle.textContent);
}
function notifyRefreshHeight() {
  scrollToBottom()
  window.location.href = "editorheight://content="+document.body.scrollHeight;
}
function speech(encodedText,voice="male-qn-qingse",key,group = '1782363907101311578',speed=1.0,auto=false) {
    function hexToBlob(hex) {
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i < hex.length; i += 2) {
        bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
      }
      const blob = new Blob([bytes.buffer], { type: "audio/mpeg" }); 
      return blob;
    }
      // 使用函数
        const apiKey = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiLmnpfnq4vpo54iLCJVc2VyTmFtZSI6Iuael-eri-mjniIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxNzgyMzYzOTA3MTA5NzAwMTg2IiwiUGhvbmUiOiIxMzEyODU4OTM1MSIsIkdyb3VwSUQiOiIxNzgyMzYzOTA3MTAxMzExNTc4IiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoiMTUxNDUwMTc2N0BxcS5jb20iLCJDcmVhdGVUaW1lIjoiMjAyNC0xMS0xMCAyMjo1MToxMCIsImlzcyI6Im1pbmltYXgifQ.DyygSUMVOJtV-ui9QXFVb7musUhhHJuVgXwCU2aQvZ7XZQdevvzOzZZLICBgy2lA0ItwvYCp3JaDvY_e3swqls0NB3asi-bpk_NwLqguXauCnwG1_tdAKTLEUPT2OgvuLTiVxBdymjaBm8_aQOkWmRukz3M28L3tvpxNpkEGhbnM4nP0ZXHcajHV6KYDzN2brkDiVjNz2AIM0vE7RPHbSdbjLCS9iE7SOysQvsmmM_I7Ovy6vtvJZyaliNQBbGjtGYD-KE5F_so5w8e9fvFCOraqhYpQR-2bmpnFM8l0Bi3qPe_5v-P5lAIELZWCHOhOt0gbQq9z2VylUg5y3icVrA';
        group = '1782363907101311578'
        let text = decodeURIComponent(encodedText)
        createAudioElement('audioDiv');
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+apiKey);
        myHeaders.append("User-Agent", "Apifox/1.0.0 (https://apifox.com)");
        myHeaders.append("Content-Type", "application/json");
        const url = `https://api.minimax.chat/v1/t2a_v2?GroupId=${group}`;

        var raw = JSON.stringify({
           "model": "speech-01-turbo",
           "text": text,
            "voice_setting": {
                "voice_id": voice,
                "speed": speed,
                "vol": 1.0,
                "pitch": 0
            },
            "audio_setting": {
                "audio_sample_rate": 32000,
                "bitrate": 128000,
                "format": "mp3",
                "channel": 1
            }
        });

        var requestOptions = {
           method: 'POST',
           headers: myHeaders,
           body: raw,
           redirect: 'follow'
        };
        fetch(url, requestOptions)
           .then(response => response.json())
           .then((res) => {
              try {
                

              const blob = hexToBlob(res.data.audio)
              const blobUrl = URL.createObjectURL(blob);
               var audioPlayer = document.getElementById('audioPlayer');
               var source = document.createElement('source');
               source.src = blobUrl;
               source.type = 'audio/mpeg';
               audioPlayer.src = blobUrl
               audioPlayer.appendChild(source);
               audioPlayer.load();
               if (auto) {
                audioPlayer.play()
               }
              } catch (error) {
                document.getElementById('funcResponse').innerText = error.toString()
              }
           })
           .catch(error => console.log('error', error));
    }
function extractTitleAndTime(text) {
    // 正则表达式匹配标题和时间
    const regex = /(.*)（发布时间：(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})）/;
    const match = text.match(regex);
    
    if (match) {
        const title = match[1].trim();
        const time = match[2].trim();
        return [title, time];
    } else {
        return [text.trim()];
    }
}
/**
 * @deprecated
 * @param {*} resultsEncoded 
 */
    function renderSearchResults(resultsEncoded) {
      let results = JSON.parse(decodeURIComponent(resultsEncoded))
      let otherEle = document.getElementById("other")
      let container = document.getElementById("search-results")
      if (!container) {
        container = document.createElement("div")
        container.setAttribute("id","search-results")
        otherEle.append(container)
      }else{
        container.innerHTML = ''; // 清空现有内容
      }
        results.forEach(result => {
            //result应该具有以下属性：title,link,content,icon,media
            // 必需属性：title, link, content
            // 可选属性：icon, media
            const resultDiv = document.createElement('div');
            resultDiv.className = 'search-result';
            const title = document.createElement('h2');
            let titles = extractTitleAndTime(result.title);
            title.innerHTML = `<a href="${result.link}" target="_blank">${titles[0]}</a>`;
            const content = document.createElement('p');
            content.textContent = result.content.slice(0,200)+"...";
            resultDiv.appendChild(title);
            const media = document.createElement('p');
            if (result.media) {
              media.innerHTML = `<img src="${result.icon}" alt="${result.media}"> ${result.media}`;
              if (titles.length > 1) {
                media.innerHTML += " | "+titles[1];
              }
            }
            resultDiv.appendChild(media);
            resultDiv.appendChild(content);
            container.appendChild(resultDiv);
        });
    }
    /**
     * 
     * @param {string} resultsEncoded 
     */
    function renderSearchResultsForMetaso(resultsEncoded) {
      let results = JSON.parse(decodeURIComponent(resultsEncoded))
      let otherEle = document.getElementById("other")
      let container = document.getElementById("search-results")
      if (!container) {
        container = document.createElement("div")
        container.setAttribute("id","search-results")
        otherEle.append(container)
      }else{
        container.innerHTML = ''; // 清空现有内容
      }
        results.forEach((result,index) => {
            //result应该具有以下属性：title,link,content,icon,media
            // 必需属性：title, link, content
            // 可选属性：icon, media
            const resultDiv = document.createElement('div');
            resultDiv.className = 'search-result';
            const title = document.createElement('h2');
            title.innerHTML = `<a href="${result.link}" target="_blank">[${index+1}] ${result.title}</a>`;
            resultDiv.appendChild(title);
            const media = document.createElement('p');
            if ("authors" in result) {
              media.innerHTML = `${result.authors.join(",")} | ${result.date}`;
            }else{
              media.innerHTML = `${result.date}`;
            }
            resultDiv.appendChild(media);
            container.appendChild(resultDiv);
        });
    }
    function collapse() {
        let collapsibleEle = document.getElementsByClassName("collapsible-content")[0]
        // 切换当前项
        if (collapsibleEle?.style.maxHeight) {
            // 切换所有折叠项
            collapsibleEle.style.maxHeight = null;
            collapsibleEle.style.padding = null;
            let reasoningEle = document.getElementById("reasoningResponse")   
            reasoningEle.querySelector('.thinkingTitle').textContent = `✅ Finished Thinking  (${((Date.now() - reasoningBegin)/1000).toFixed(1)}s)`

        }
    }
    function expand() {
        // const content = header.nextElementSibling;
        let collapsibleEle = document.getElementsByClassName("collapsible-content")[0]
        const isOpen = collapsibleEle.style.maxHeight;
        // 切换当前项
        if (!isOpen) {
            collapsibleEle.style.maxHeight = '270px';
            collapsibleEle.style.padding = '10px';
        }
    }
    function toggleCollapse(header) {
        const content = header.nextElementSibling;
        const isOpen = content.style.maxHeight;
        let collapsibleEle = document.getElementsByClassName("collapsible-content")[0]

        // 切换当前项
        if (!isOpen) {
            collapsibleEle.style.maxHeight = '270px';
            collapsibleEle.style.padding = '10px';
            // document.querySelectorAll('.toggle-icon').forEach(icon => {
            //     icon.textContent = '▼';
            // });
            // content.style.maxHeight = content.scrollHeight + "px";
            // header.querySelector('.toggle-icon').textContent = '▲';
        }else{
            // 切换所有折叠项
            collapsibleEle.style.maxHeight = null;
            collapsibleEle.style.padding = null;
            // document.querySelectorAll('.toggle-icon').forEach(icon => {
            //     icon.textContent = '▲';
            // });
        }
    }
        // // const pdfUrl = 'https://vip.123pan.cn/1836303614/dl/docs/%E7%99%BD%E5%A4%9C%E8%A1%8C.pdf';
        // const pdfUrl = 'https://vip.123pan.cn/1836303614/dl/docs/The%20Little%20Prince.pdf';
        // // const pdfUrl = 'https://vip.123pan.cn/1836303614/dl/docs/CET4_12%E6%9C%88.pdf';
        // getDocumentContent(pdfUrl).then(res=>{
        //   console.log(res);
        // })