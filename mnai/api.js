let option = {
      theme:"dark",
      math:{
        engine:"MathJax",
        mathJaxOptions:{
          tex: {
              inlineMath: [ ['$','$'], ["\\(","\\)"] ]
          }
        },
        inlineDigit: true
        
        
      },
      cdn:"https://unpkg.com/vditor@3.11.0"
    }
let buttonCodeBlockCache = {}
function clearCache() {
  buttonCodeBlockCache = {}
}
function escapeHTML(e) { 
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;") 
}
const API_URL = "v1/chat/completions";
let loading = false;
let presetRoleData = {
  "default": translations[locale]["defaultText"],
  "normal": translations[locale]["assistantText"],
  "cat": translations[locale]["catText"],
  "emoji": translations[locale]["emojiText"],
  "image": translations[locale]["imageText"]
};
let modelVersion; // 模型版本
let apiHost; // api反代地址
let apiSelects = []; // api地址列表
let customAPIKey; // 自定义apiKey
let systemRole; // 自定义系统角色
let roleNature; // 角色性格
let roleTemp; // 回答质量
let convWidth = []; // 会话宽度，0:窗口宽度，1:全屏宽度
let textSpeed; // 打字机速度，越小越快
let contLen; // 连续会话长度，默认25，对话包含25条上下文信息。设置为0即关闭连续会话
let enableLongReply; // 是否开启长回复，默认关闭，开启可能导致api费用增加。
let longReplyFlag;
let voiceIns; // Audio or SpeechSynthesisUtterance
const isFirefox = !!navigator.userAgent.match(/firefox/i);
const supportMSE = !!window.MediaSource && !isFirefox; // 是否支持MSE（除了ios应该都支持）
const voiceMIME = "audio/mpeg";
const voiceFormat = "audio-24khz-48kbitrate-mono-mp3";
const voicePreLen = 130;
const voiceSuffix = ".mp3";
let userAvatar; // 用户头像
let customDarkOut;
let isCaseSearch; // 搜索是否区分大小写
let controller;
let controllerId;
/**
 * 
 * @param {string} text 
 */
const copy = (text) => {
  const input = document.createElement("textarea");
  input.value = text;
  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, input.value.length);
  document.execCommand("copy");
  document.body.removeChild(input);
}

/**
 * 添加或替换第六个选项
 * @param {string} value - 新选项的值
 * @param {string} text - 新选项的文本内容
 */
function addOption(value, index) {
  var selectElement = document.getElementById("preSetModel");

  // 创建一个新的option元素
  var newOption = document.createElement("option");
  newOption.value = value;
  newOption.textContent = value;

  // 检测select元素中的option数量
  if (selectElement.options.length < index) {
    // 少于六个选项时，直接添加新选项
    selectElement.appendChild(newOption);
  } else {
    // 等于或多于六个选项时，替换第六个选项
    selectElement.options[index] = newOption;
  }
}
/**
 * 添加或替换第六个选项
 * @param {string} value - 新选项的值
 * @param {string} text - 新选项的文本内容
 */
function addOrReplaceOption(value) {
  var selectElement = document.getElementById("preSetModel");

  let models = value.split(",");
  for (let i = 0; i < models.length; i++) {
    addOption(models[i].trim(), i + 5);
  }
}
/**
 * 
 * @param {string} title 
 * @param {string|number} body 
 */
function postNotificataion(title, body, encode = true) {
  let notification = "chataction://"+title
  if (body) {
    if (encode) {
      notification = notification +"?content="+ encodeURIComponent(body)
    }else{
      notification = notification +"?content="+ body
    }
  }
  if (mnMode) {
    window.location.href = notification
  }
}
function showError(content) {
  postNotificataion("showError", "Error: "+content);
}
function getTextContent(message) {
  if ("content" in message) {
    if (Array.isArray(message.content)) {
      let textContent = message.content.find(item => {
        return item.type === "text";
      })
      if (textContent) {
        return textContent.text
      }
      return undefined
    }else{
      return message.content
    }
  }else{
    return undefined
  }
}

function getIndicesInFullHistory(params) {
  let indicesInFullHistory = []
  data.forEach((item,index)=>{
    if (item.role === "system") {
      indicesInFullHistory.push(index)
      return
    }
    if (item.role === "user") {
      indicesInFullHistory.push(index)
      return
    }
    if (item.role === "assistant") {
      if ("tool_calls" in item) {
        return
      }
      indicesInFullHistory.push(index)
      return
    }
    return
  })
  return indicesInFullHistory 
}
function getImageContent(message) {
  if ("content" in message) {
    if (Array.isArray(message.content)) {
      let imageContent = message.content.find(item => {
        return item.type === "image_url";
      })
      if (imageContent) {
        return imageContent.image_url.url
      }
      return undefined
    }else{
      return undefined
    }
  }else{
    return undefined
  }
}
function getImageContents(message) {
  let imageURLs = []
  if ("content" in message) {
    if (Array.isArray(message.content)) {
      message.content.forEach(item => {
        if (item.type === "image_url") {
          imageURLs.push(item.image_url.url)
        }
      })
    }
  }
  return imageURLs
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


function codeBlockReplacer(lang,format,code){
    let encodedContent = encodeURIComponent(code);
    if (lang === "userSelect") {
      let url = `userselect://choice?content=${encodedContent}`
      code = renderKaTeXFormulas(code)
      // code = md2html(code)
      return `<div><a href="${url}" style="
    display: block;
    padding: 10px 12px;
    margin-top: 10px;
    background: #e3eefc;
    color: #1565c0;
    border-radius: 8px;
    text-decoration: none;
    border: 2px solid transparent;
    border-color: #90caf9;
    font-size: 15px;
    cursor: pointer;
    box-sizing: border-box;
"
>
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
      return `<div><a href="${url}" style="
    display: block;
    padding: 10px 12px;
    margin-top: 10px;
    background:rgb(230, 255, 239);
    color:#237427;
    border-radius: 8px;
    text-decoration: none;
    border: 2px solid transparent;
    border-color:#01b76e;
    font-size: 15px;
    cursor: pointer;
    box-sizing: border-box;
"
>
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
      return `<div><a href="${url}" style="
    display: block;
    padding: 10px 12px;
    margin-top: 10px;
    background:rgb(230, 255, 239);
    color:#237427;
    border-radius: 8px;
    text-decoration: none;
    border: 2px solid transparent;
    border-color:#01b76e;
    font-size: 15px;
    cursor: pointer;
    box-sizing: border-box;
"
>
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
const pattern = /```(userSelect|addNote|addComment)\s*(plaintext|markdown|json)?\n([\s\S]*?)```/g;
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
function replaceButtonCodeBlocks(markdown) {
//   let replacer = (lang,format,code) => {
//     let encodedContent = encodeURIComponent(code);
//     if (lang === "userSelect") {
//       let url = `userselect://choice?content=${encodedContent}`
//       return `<div><a href="${url}" style="
//     display: block;
//     padding: 10px 12px;
//     margin-top: 10px;
//     background: #e3eefc;
//     color: #1565c0;
//     border-radius: 8px;
//     text-decoration: none;
//     border: 2px solid transparent;
//     border-color: #90caf9;
//     font-size: 15px;
//     cursor: pointer;
//     box-sizing: border-box;
// "
// >
// ${code.trim()}
// </a></div>`
//     }
//     if (lang === "addNote") {
//       // console.log("addNote");
//       let url = `userselect://addnote?content=${encodedContent}`
//       if (format === "markdown") {
//         // console.log("markdown");
        
//         url = `userselect://addnote?content=${encodedContent}&format=markdown`
//         code = md2html(code)
//       }
//       return `<div><a href="${url}" style="
//     display: block;
//     padding: 10px 12px;
//     margin-top: 10px;
//     background:rgb(230, 255, 239);
//     color:#237427;
//     border-radius: 8px;
//     text-decoration: none;
//     border: 2px solid transparent;
//     border-color:#01b76e;
//     font-size: 15px;
//     cursor: pointer;
//     box-sizing: border-box;
// "
// >
// <div style="font-weight: bold;margin-bottom: 5px;font-size: 18px;">➕点击创建笔记：</div>
// ${code.trim()}
// </a></div>`
//   }
//     if (lang === "addComment") {
//       let url = `userselect://addcomment?content=${encodedContent}`
//       if (format === "markdown") {
//         url = `userselect://addnote?content=${encodedContent}&format=markdown`
//         code = md2html(code)
//       }
//       return `<div><a href="${url}" style="
//     display: block;
//     padding: 10px 12px;
//     margin-top: 10px;
//     background:rgb(230, 255, 239);
//     color:#237427;
//     border-radius: 8px;
//     text-decoration: none;
//     border: 2px solid transparent;
//     border-color:#01b76e;
//     font-size: 15px;
//     cursor: pointer;
//     box-sizing: border-box;
// "
// >
// <div style="font-weight: bold;margin-bottom: 5px;font-size: 18px;">➕点击添加卡片评论：</div>
// ${code.trim()}
// </a></div>`
//   }
//   return ""
// }
  return replaceSpecialBlocks(markdown)
}



const setResContent = (currentResEle,content,render = true)=>{//渲染响应内容
  if (render) {
    content = replaceButtonCodeBlocks(content)
    let tem = currentResEle.getElementsByClassName("markdown-body")[0]
    Vditor.preview(tem,content,option)
  }else{
    currentResEle.getElementsByClassName("markdown-body")[0].innerHTML = content
  }
  refreshLatex(currentResEle)
}
const setImageContent = (currentReqEle,imageBase64)=>{
  const container = currentReqEle.getElementsByClassName('imageRequest')[0];
  const img = document.createElement('img');
  // if (/^data:image\/png;base64/.test(imageBase64)) {
  img.src = imageBase64;
  container.appendChild(img);
  // }else{
  //   img.src = "data:image/png;base64," + imageBase64;
  // }
}
const setReqContent = (currentReqEle,content,render = true)=>{
  let tem = currentReqEle.getElementsByClassName("markdown-body")[0]
  Vditor.preview(tem,content,option)
}
const setFuncContent = (currentResEle,content)=>{
  const container = currentResEle.getElementsByClassName('funcResponse')[0];
  container.innerHTML=content
}
const setReasoningContent = (currentResEle,content)=>{
  const container = currentResEle.getElementsByClassName('reasoningResponse')[0];
  const tem = container.getElementsByClassName('reasoningContent')
  if (tem.length) {
    const reasoningContent = tem[0];
    reasoningContent.innerHTML=content.trim()
    reasoningContent.scrollTo(0, reasoningContent.scrollHeight)
  }else{
  const reasoningContent = document.createElement('div');
    reasoningContent.className = 'reasoningContent';
    reasoningContent.innerHTML=content.trim()
    container.appendChild(reasoningContent);
    reasoningContent.scrollTo(0, reasoningContent.scrollHeight)
  }

}
const setSearchResult  = (currentResEle,results)=>{
  const container = currentResEle.getElementsByClassName('searchResults')[0];
  container.innerHTML = ''; // 清空现有内容
  results.forEach(result => {
      const resultDiv = document.createElement('div');
      resultDiv.className = 'searchResult';
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
const setResCursor = (currentResEle,cursorOn = true) => {
  let markdownBody = currentResEle.getElementsByClassName("markdown-body")[0]
  if (cursorOn) {
    markdownBody.innerHTML = "<p class='cursorCls'><br /></p>"
  }else{
    if (markdownBody.querySelector(".cursorCls")){
      markdownBody.innerHTML = "<br />"
    } 
    
  }
}
const findOffsetTop = (ele, target) => { // target is positioned ancestor element
  if (ele.offsetParent !== target) return ele.offsetTop + findOffsetTop(ele.offsetParent, target);
  else return ele.offsetTop;
}
const findResEle = (ele) => {
  if (!ele.classList.contains("response")) return findResEle(ele.parentElement);
  else return ele;
}
const isContentBottom = (ele) => {
  if (refreshIdx !== void 0) {
    return currentResEle.clientHeight + currentResEle.offsetTop > messagesEle.scrollTop + messagesEle.clientHeight
  } else {
    return messagesEle.scrollHeight - messagesEle.scrollTop - messagesEle.clientHeight < 128;
  }
}
const isEleBottom = (ele) => {
  return ele.clientHeight + findOffsetTop(ele, messagesEle) > messagesEle.scrollTop + messagesEle.clientHeight;
}
const outOfMsgWindow = (ele) => {
  return ele.offsetTop > messagesEle.scrollTop + messagesEle.clientHeight || ele.offsetTop + ele.clientHeight < messagesEle.scrollTop
}
const scrollToBottom = () => {
  if (isContentBottom()) {
    if (refreshIdx !== void 0) {
      messagesEle.scrollTo(0, currentResEle.clientHeight + currentResEle.offsetTop - messagesEle.clientHeight + 10)
    } else {
      messagesEle.scrollTo(0, messagesEle.scrollHeight)
    }
  }
}
const scrollToBottomLoad = (ele) => {
  if (!controller || !ele.offsetParent) return;
  if (isEleBottom(ele)) {
    let resEle = findResEle(ele)
    messagesEle.scrollTo(0, resEle.clientHeight + resEle.offsetTop - messagesEle.clientHeight + 10)
  }
}
const forceRepaint = (ele) => {
  ele.style.display = "none";
  ele.offsetHeight;
  ele.style.display = null;
}
const escapeTextarea = document.createElement("textarea");
const getEscape = str => {
  escapeTextarea.textContent = str;
  return escapeTextarea.innerHTML;
}
const parser = new DOMParser();
const getUnescape = html => {
  return parser.parseFromString(html, 'text/html').body.textContent;
}
const escapeRegexExp = (str) => { // from vscode src/vs/base/common/strings.ts escapeRegExpCharacters
  return str.replace(/[\\\{\}\*\+\?\|\^\$\.\[\]\(\)]/g, '\\$&');
}
const checkStorage = () => {
  let used = 0;
  for (let key in localStorage) {
    localStorage.hasOwnProperty(key) && (used += localStorage[key].length)
  }
  let remain = 5242880 - used;
  usedStorageBar.style.width = (used / 5242880 * 100).toFixed(2) + "%";
  let usedMBs = used / 1048576;
  usedStorage.textContent = (usedMBs < 1 ? usedMBs.toPrecision(2) : usedMBs.toFixed(2)) + "MB";
  availableStorage.textContent = Math.floor(remain / 1048576 * 100) / 100 + "MB";
};
const UNESCAPE_RE = /\\([ \\!"#$%&'()*+,.\/:;<=>?@[\]^_`{|}~-])/g;
const codeUtils = {
  getCodeLang(str = "") {
    const res = str.match(/ class="language-(.*?)"/);
    return (res && res[1]) || "";
  },
  getFragment(str = "") {
    return str ? `<span class="u-mdic-copy-code_lang" text="${str}"></span>` : "";
  },
};
const getCodeLangFragment = (oriStr = "") => {
  return codeUtils.getFragment(codeUtils.getCodeLang(oriStr));
};
const copyClickCode = (ele) => {
  const input = document.createElement("textarea");
  input.value = ele.parentElement.previousElementSibling.textContent;
  const nDom = ele.previousElementSibling;
  const nDelay = ele.dataset.mdicNotifyDelay;
  const cDom = nDom.previousElementSibling;
  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, input.value.length);
  document.execCommand("copy");
  document.body.removeChild(input);
  if (nDom.style.display === "none") {
    nDom.style.display = "block";
    cDom && (cDom.style.display = "none");
    setTimeout(() => {
      nDom.style.display = "none";
      cDom && (cDom.style.display = "block");
    }, nDelay);
  }
};
const copyClickMd = (idx) => {
  const input = document.createElement("textarea");
  // console.log(idx);
  
  // console.log(data[idx]);
  // console.log("systemRole"+systemRole);
  
  input.value = data[idx].content;
  document.body.appendChild(input);
  input.select();
  input.setSelectionRange(0, input.value.length);
  document.execCommand("copy");
  document.body.removeChild(input);
}
const enhanceCode = (render, options = {}) => (...args) => {
  /* args = [tokens, idx, options, env, slf] */
  const {
    btnText = translations[locale]["copyCode"], // button text
    successText = translations[locale]["copySuccess"], // copy-success text
    successTextDelay = 2000, // successText show time [ms]
    showCodeLanguage = true, // false | show code language
  } = options;
  const [tokens = {}, idx = 0] = args;
  const originResult = render.apply(this, args);
  const langFrag = showCodeLanguage ? getCodeLangFragment(originResult) : "";
  const tpls = [
    '<div class="m-mdic-copy-wrapper">',
    `${langFrag}`,
    `<div class="u-mdic-copy-notify" style="display:none;" text="${successText}"></div>`,
    `<button class="u-mdic-copy-btn j-mdic-copy-btn" text="${btnText}" data-mdic-notify-delay="${successTextDelay}" onclick="copyClickCode(this)"></button>`,
    '</div>',
  ];
  return originResult.replace("</pre>", `${tpls.join("")}</pre>`);
};
let currentVoiceIdx;
let editingIdx;
let originText;
const resumeSend = () => {
  if (editingIdx !== void 0) {
    chatlog.children[systemRole ? editingIdx - 1 : editingIdx].classList.remove("showEditReq");
  }
  sendBtnEle.children[0].textContent = translations[locale]["send"];
  inputAreaEle.value = originText;
  clearEle.title = translations[locale]["clearChat"];
  clearEle.classList.remove("closeConv");
  originText = void 0;
  editingIdx = void 0;
}
//菜单按钮事件
const mdOptionEvent = function (ev) {
  let id = ev.target.dataset.id;
  if (id) {
    let parent = ev.target.parentElement;
    let idxEle = parent.parentElement;
    let idx = Array.prototype.indexOf.call(chatlog.children, this.parentElement);
    if (id === "voiceBtn" || id === "speechMd" || id === "pauseMd" || id === "resumeMd") {
      let classList = parent.dataset.id === "voiceBtn" ? parent.classList : ev.target.classList;
      if (classList.contains("readyVoice")) {
        if (chatlog.children[idx].dataset.loading !== "true") {
          idx = systemRole ? idx + 1 : idx;
          speechEvent(idx);
        }
      } else if (classList.contains("pauseVoice")) {
        if (voiceIns) {
          if (voiceIns instanceof Audio) voiceIns.pause();
          else {
            if (supportSpe) speechSynthesis.pause();
            classList.remove("readyVoice");
            classList.remove("pauseVoice");
            classList.add("resumeVoice");
          }
        }
      } else {
        if (voiceIns) {
          if (voiceIns instanceof Audio) voiceIns.play();
          else {
            if (supportSpe) speechSynthesis.resume();
            classList.remove("readyVoice");
            classList.remove("resumeVoice");
            classList.add("pauseVoice");
          }
        }
      }
    } else if (id === "editMd") {
      notyf.error("暂不支持");
      return
      let reqEle = chatlog.children[idx];
      idx = systemRole ? idx + 1 : idx;
      if (editingIdx === idx) return;
      if (editingIdx !== void 0) {
        chatListEle.children[systemRole ? editingIdx - 1 : editingIdx].classList.remove("showEditReq");
      }
      reqEle.classList.add("showEditReq");
      editingIdx = idx;
      originText = inputAreaEle.value;
      inputAreaEle.value = data[idx].content;
      inputAreaEle.dispatchEvent(new Event("input"));
      inputAreaEle.focus();
      sendBtnEle.children[0].textContent = translations[locale]["update"];
      clearEle.title = translations[locale]["cancel"];
      clearEle.classList.add("closeConv");
    } else if (id === "refreshMd") {
      if (noLoading()) {
        currentResEle = chatlog.children[idx];
        setResContent(currentResEle,"<p class='cursorCls'><br /></p>",false)
        currentResEle.getElementsByClassName("funcResponse")[0].innerHTML = "";
        currentResEle.getElementsByClassName("searchResults")[0].innerHTML = "";
        currentResEle.getElementsByClassName("reasoningResponse")[0].innerHTML = "";
        currentResEle.dataset.loading = true;
        try {
        idx = systemRole ? idx + 1 : idx;
        // console.log(idx);
        
        let indicesInFullHistory = getIndicesInFullHistory()
        let firstIdx = indicesInFullHistory.findIndex(i=>{
          return data[i].role === "assistant"
        })
        if (editingIdx !== void 0) {
          if (editingIdx === idx) { resumeSend() }
          else if (editingIdx > idx) { editingIdx-- }
        }
        let offset = 0
        let indexInFullHistory = indicesInFullHistory[idx]
        // console.log(indicesInFullHistory);
        // console.log(indexInFullHistory);
        // console.log(data);
        if (indexInFullHistory > 1 && data[indexInFullHistory - 1].role === "tool") {
          offset = offset+1
          if (data[indexInFullHistory - 2].role === "assistant" && "tool_calls" in data[indexInFullHistory - 2]) {
            offset = offset+1
          }
        }
        // data.splice(indexInFullHistory-offset, 1+offset);
        // chatsData[activeChatIdx].data = data
        if (firstIdx === idx) updateChatPre();
        refreshIdx = indexInFullHistory-offset;
        // console.log(refreshIdx);
        let config = {history:data.slice(0,refreshIdx),afterHistory:data.slice(indexInFullHistory+1)}
        // console.log(config);
        stopEle.style.display = "flex";
        postNotificataion("refreshChat", JSON.stringify(config),true)
        } catch (error) {
          notyf.error(error.toString());
          copy(error.toString())
        }
      }else{
        notyf.error("loading: "+idx);
      }
    } else if (id === "copyMd") {
      idx = systemRole ? idx + 1 : idx;
      copyClickMd(idx);
      notyf.success(translations[locale]["copySuccess"]);
    } else if (id === "delMd") {
      // notyf.error("暂不支持: "+idx);
      // return
      if (noLoading()) {
        chatlog.removeChild(chatlog.children[idx]);
        try {
        idx = systemRole ? idx + 1 : idx;
        let indicesInFullHistory = getIndicesInFullHistory()
        let firstIdx = indicesInFullHistory.findIndex(i=>{
          return data[i].role === "assistant"
        })
        if (editingIdx !== void 0) {
          if (editingIdx === idx) { resumeSend() }
          else if (editingIdx > idx) { editingIdx-- }
        }
        let offset = 0
        let indexInFullHistory = indicesInFullHistory[idx]
        // console.log(idx);
        // console.log(data);
        if (indexInFullHistory > 1 && data[indexInFullHistory - 1].role === "tool") {
          offset = offset+1
          if (data[indexInFullHistory - 2].role === "assistant" && "tool_calls" in data[indexInFullHistory - 2]) {
            offset = offset+1
          }
        }
        data.splice(indexInFullHistory-offset, 1+offset);
        // chatsData[activeChatIdx].data = data
        if (firstIdx === idx) updateChatPre();
        updateChats();
        } catch (error) {
          notyf.error(error.toString());
          copy(error.toString())
        }
      }else{
        notyf.error("loading: "+idx);
      }
    } else if (id === "downAudioMd") {
      if (chatlog.children[idx].dataset.loading !== "true") {
        idx = systemRole ? idx + 1 : idx;
        downloadAudio(idx);
      }
    }
  }
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
function renderSearchResults(resultsEncoded,round = 0) {
  let results = JSON.parse(decodeURIComponent(resultsEncoded))
  const container = document.getElementsByClassName('searchResults')[round];
  container.innerHTML = ''; // 清空现有内容
  results.forEach(result => {
      const resultDiv = document.createElement('div');
      resultDiv.className = 'searchResult';
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
    function renderSearchResultsForMetaso(resultsEncoded,round = 0) {
      let results = JSON.parse(decodeURIComponent(resultsEncoded))
      const container = document.getElementsByClassName('searchResults')[round];
      container.innerHTML = ''; // 清空现有内容
        results.forEach((result,index) => {
            //result应该具有以下属性：title,link,content,icon,media
            // 必需属性：title, link, content
            // 可选属性：icon, media
            const resultDiv = document.createElement('div');
            resultDiv.className = 'searchResult';
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
/**
 * 
 * @param {object} funcObject 
 * @returns {string}
 */
function renderFuncResponse(funcObject){
  let funcName = funcObject.function.name
  let args = JSON.parse(funcObject.function.arguments.trim())
  // console.log(args);
  
  let funcText = funcName+"()\n"
  if (args) {
    switch (funcName) {
      case "setTitle":
        if (args.title) {
          funcText = `${funcName}("${args.title}")\n`
        }
        break;
      case "addComment":
        if (args.comment) {
          funcText = `${funcName}("${args.comment.trim()}")\n`
        }
        break;
      case "addTag":
        if (args.tag) {
          funcText = `${funcName}("${args.tag}")\n`
        }
        break;
      case "copyMarkdownLink":
        if (args.title) {
          funcText = `${funcName}("${args.title}")\n`
        }
        break;
      case "copyCardURL":
        funcText = `${funcName}()\n`
        break;
      case "copyText":
        if (args.text) {
          funcText = `${funcName}("${args.text}")\n`
        }
        break;
      case "close":
        funcText = `${funcName}()\n`
        break;
      case "clearExcerpt":
        funcText = `${funcName}()\n`
        break;
      case "setExcerpt":
        if (args.excerpt) {
          funcText = `${funcName}("${args.excerpt.trim()}")\n`
        }
        break;
      case "readDocument":
        let currentDocName = ""
        funcText = `${funcName}("${currentDocName}")\n`
        break;
      case "readFocusNotes":
        funcText = `${funcName}()\n`
        break;
      case "readParentNote":
        funcText = `${funcName}()\n`
        break;
      case "webSearch":
        funcText = `${funcName}("${args.question}")\n`
        break;
      case "addChildNote":
        let pre = `${funcName}(\n`
        if (args.title) {
          pre = pre+`"${args.title}"`
          if (args.content) {
            pre = pre+",\n"
          }
        }
        if (args.content) {
          pre = pre+`"${args.content.trim()}"`
        }
        pre = pre+`\n)\n`
        funcText = pre
        break;
      default:
        break;
    }
  }else{
    funcText = funcName+"()\n"
  }
  let funcHtml = `<code class="hljs">${funcText.trim()}</code>`
  return funcHtml
}
const formatMdEle = (ele, model) => {
  let avatar = document.createElement("div");
  avatar.className = "chatAvatar";
  if (ele.className === "response") {
    avatar.classList.add((model && model.startsWith("gpt-4")) ? "gpt4Avatar" : "gpt3Avatar");
    let funcResponse = document.createElement("div");
    funcResponse.className = "funcResponse";
    ele.appendChild(funcResponse);
    let searchResults = document.createElement("div");
    searchResults.className = "searchResults";
    ele.appendChild(searchResults);
    let reasoningResponse = document.createElement("div");
    reasoningResponse.className = "reasoningResponse";
    ele.appendChild(reasoningResponse);
  }else{
    let imageRequest = document.createElement("div");
    imageRequest.className = "imageRequest";
    ele.appendChild(imageRequest);
  }
  avatar.innerHTML = ele.className === "request" ? `<img src="${userAvatar}" />` : `<svg width="22" height="22"><use xlink:href="#aiIcon"></use></svg>`;
  ele.appendChild(avatar);
  let realMd = document.createElement("div");
  realMd.className = "markdown-body"//ele.className === "request" ? "requestBody" : "markdown-body";
  ele.appendChild(realMd);

  let mdOption = document.createElement("div");
  mdOption.className = "mdOption";
  ele.appendChild(mdOption);
  let optionWidth = 140;
  mdOption.innerHTML += (ele.className === "request" ? `<div class="optionItems" style="width:${optionWidth}px;"><div data-id="editMd" class="optionItem" title="${translations[locale]["edit"]}">
                <svg width="18" height="18"><use xlink:href="#chatEditIcon" /></svg>
                </div>` : `<div class="optionItems" style="width:${optionWidth}px;"><div data-id="refreshMd" class="refreshReq optionItem" title="${translations[locale]["refresh"]}">
                <svg width="16" height="16" ><use xlink:href="#refreshIcon" /></svg>
                <svg width="16" height="16" ><use xlink:href="#halfRefIcon" /></svg>
                </div>`) +
    `<div data-id="copyMd" class="optionItem" title="${translations[locale]["copy"]}">
                <svg width="20" height="20"><use xlink:href="#copyIcon" /></svg>
            </div>
            <div data-id="delMd" class="optionItem" title="${translations[locale]["del"]}">
                <svg width="20" height="20"><use xlink:href="#delIcon" /></svg>
            </div>` + `</div>`;
  mdOption.onclick = mdOptionEvent;
}
let mnMode = false
let allListEle = chatListEle.parentElement;
let folderData = [];
let chatsData = [];
let chatIdxs = [];
let searchIdxs = [];
let activeChatIdx = 0;
let data = [];
let activeChatEle;
let operateChatIdx, operateFolderIdx;
let dragLi, dragType, dragIdx;
let mobileDragOut;
const mobileDragStartEV = function (ev) {
  if (mobileDragOut !== void 0) {
    clearTimeout(mobileDragOut);
    mobileDragOut = void 0;
  }
  mobileDragOut = setTimeout(() => {
    this.setAttribute("draggable", "true");
    this.dispatchEvent(ev);
  }, 200);
};
if (isMobile) {
  let stopDragOut = () => {
    if (mobileDragOut !== void 0) {
      clearTimeout(mobileDragOut);
      mobileDragOut = void 0;
    }
  };
  let stopDrag = () => {
    stopDragOut();
    document.querySelectorAll("[draggable=true]").forEach(ele => {
      ele.setAttribute("draggable", "false");
    })
  };
  document.body.addEventListener("touchmove", stopDragOut);
  document.body.addEventListener("touchend", stopDrag);
  document.body.addEventListener("touchcancel", stopDrag);
};
const delDragIdx = () => {
  let chatIdx = chatIdxs.indexOf(dragIdx);
  if (chatIdx !== -1) {
    chatIdxs.splice(chatIdx, 1);
  } else {
    folderData.forEach((item, i) => {
      let inIdx = item.idxs.indexOf(dragIdx);
      if (inIdx !== -1) {
        item.idxs.splice(inIdx, 1);
        updateFolder(i);
      }
    })
  }
}
const updateFolder = (idx) => {
  let folderEle = folderListEle.children[idx];
  let childLen = folderData[idx].idxs.length;
  folderEle.children[0].children[1].children[1].textContent = childLen + translations[locale]["chats"];
  folderEle.classList.toggle("expandFolder", childLen);
}
folderListEle.ondragenter = chatListEle.ondragenter = function (ev) {
  ev.preventDefault();
  if (ev.target === dragLi) return;
  allListEle.querySelectorAll(".dragingChat").forEach(ele => {
    ele.classList.remove("dragingChat");
  })
  if (dragType === "chat") {
    if (this === chatListEle) {
      this.classList.add("dragingChat");
      let dragindex = Array.prototype.indexOf.call(chatListEle.children, dragLi);
      let targetindex = Array.prototype.indexOf.call(chatListEle.children, ev.target);
      delDragIdx();
      if (targetindex !== -1) {
        chatIdxs.splice(targetindex, 0, dragIdx);
        if (dragindex === -1 || dragindex >= targetindex) {
          chatListEle.insertBefore(dragLi, ev.target);
        } else {
          chatListEle.insertBefore(dragLi, ev.target.nextElementSibling);
        }
      } else {
        chatIdxs.push(dragIdx);
        chatListEle.appendChild(dragLi);
      }
    } else if (this === folderListEle) {
      let folderIdx;
      if (ev.target.classList.contains("headLi")) {
        ev.target.parentElement.classList.add("dragingChat");
        ev.target.nextElementSibling.appendChild(dragLi);
        delDragIdx();
        folderIdx = Array.prototype.indexOf.call(folderListEle.children, ev.target.parentElement);
        folderData[folderIdx].idxs.push(dragIdx);
        updateFolder(folderIdx);
      } else if (ev.target.classList.contains("chatLi")) {
        ev.target.parentElement.parentElement.classList.add("dragingChat");
        let parent = ev.target.parentElement;
        delDragIdx();
        folderIdx = Array.prototype.indexOf.call(folderListEle.children, parent.parentElement);
        let dragindex = Array.prototype.indexOf.call(parent.children, dragLi);
        let targetindex = Array.prototype.indexOf.call(parent.children, ev.target);
        if (dragindex !== -1) {
          folderData[folderIdx].idxs.splice(targetindex, 0, dragIdx);
          if (dragindex < targetindex) {
            parent.insertBefore(dragLi, ev.target.nextElementSibling);
          } else {
            parent.insertBefore(dragLi, ev.target);
          }
        } else {
          folderData[folderIdx].idxs.push(dragIdx);
          parent.appendChild(dragLi);
        }
        updateFolder(folderIdx);
      }
    }
    updateChatIdxs();
  } else if (dragType === "folder") {
    if (this === folderListEle) {
      let dragindex = Array.prototype.indexOf.call(folderListEle.children, dragLi);
      let folderIdx = Array.prototype.findIndex.call(folderListEle.children, (item) => {
        return item.contains(ev.target);
      })
      folderListEle.children[folderIdx].classList.remove("expandFolder");
      let folderEle = folderListEle.children[folderIdx];
      let data = folderData.splice(dragindex, 1)[0];
      folderData.splice(folderIdx, 0, data);
      if (dragindex === -1 || dragindex >= folderIdx) {
        folderListEle.insertBefore(dragLi, folderEle);
      } else {
        folderListEle.insertBefore(dragLi, folderEle.nextElementSibling);
      }
      updateChatIdxs();
    }
  }
}
folderListEle.ondragover = chatListEle.ondragover = (ev) => {
  ev.preventDefault();
}
folderListEle.ondragend = chatListEle.ondragend = (ev) => {
  document.getElementsByClassName("dragingLi")[0].classList.remove("dragingLi");
  allListEle.querySelectorAll(".dragingChat").forEach(ele => {
    ele.classList.remove("dragingChat");
  })
  dragType = dragIdx = dragLi = void 0;
}
const chatDragStartEv = function (ev) {
  ev.stopPropagation();
  dragLi = this;
  dragLi.classList.add("dragingLi");
  dragType = "chat";
  if (chatListEle.contains(this)) {
    let idx = Array.prototype.indexOf.call(chatListEle.children, this);
    dragIdx = chatIdxs[idx];
  } else if (folderListEle.contains(this)) {
    let folderIdx = Array.prototype.indexOf.call(folderListEle.children, this.parentElement.parentElement);
    let inFolderIdx = Array.prototype.indexOf.call(this.parentElement.children, this);
    dragIdx = folderData[folderIdx].idxs[inFolderIdx];
  }
}
const extraFolderActive = (folderIdx) => {
  let folderNewIdx = -1;
  for (let i = folderIdx - 1; i >= 0; i--) {
    if (folderData[i].idxs.length) {
      folderNewIdx = i;
    }
  }
  if (folderNewIdx === -1) {
    for (let i = folderIdx + 1; i < folderData.length; i++) {
      if (folderData[i].idxs.length) folderNewIdx = i;
    }
  }
  if (folderNewIdx !== -1) {
    activeChatIdx = folderData[folderNewIdx].idxs[0];
  } else if (chatIdxs.length) {
    activeChatIdx = chatIdxs[0];
  } else {
    activeChatIdx = -1;
  }
}
const delFolder = (folderIdx, ele) => {
  if (confirmAction(translations[locale]["delFolderTip"])) {
    let delData = folderData[folderIdx];
    let idxs = delData.idxs.sort();
    ele.parentElement.remove();
    if (idxs.indexOf(activeChatIdx) !== -1) {
      endAll();
      extraFolderActive(folderIdx);
    }
    folderData.splice(folderIdx, 1);
    for (let i = idxs.length - 1; i >= 0; i--) {
      chatsData.splice(idxs[i], 1);
    }
    folderData.forEach(item => {
      if (item.idxs.length) {
        item.idxs.forEach((i, ix) => {
          let len = idxs.filter(j => { return i > j }).length;
          if (len) {
            item.idxs[ix] = i - len;
          }
        })
      }
    })
    chatIdxs.forEach((item, ix) => {
      let len = idxs.filter(j => { return item > j }).length;
      if (len) chatIdxs[ix] = item - len;
    })
    let len = idxs.filter(j => { return activeChatIdx > j }).length;
    if (len) activeChatIdx -= len;
    if (activeChatIdx === -1) {
      addNewChat();
      activeChatIdx = 0;
      chatEleAdd(activeChatIdx);
    }
    updateChats();
    activeChat();
  }
}
const folderAddChat = (folderIdx, headEle) => {
  endAll();
  let chat = { name: translations[locale]["newChatName"], data: [] };
  chatsData.push(chat);
  activeChatIdx = chatsData.length - 1;
  folderData[folderIdx].idxs.push(activeChatIdx);
  let ele = chatEleAdd(activeChatIdx, false)
  headEle.nextElementSibling.appendChild(ele);
  updateFolder(folderIdx);
  updateChats();
  activeChat(ele);
}
const folderEleEvent = function (ev) {
  ev.preventDefault();
  ev.stopPropagation();
  let parent = this.parentElement;
  let idx = Array.prototype.indexOf.call(folderListEle.children, parent);
  if (ev.target.className === "headLi") {
    let isExpanded = parent.classList.toggle("expandFolder");
    if (folderData[idx].idxs.indexOf(activeChatIdx) !== -1) {
      parent.classList.toggle("activeFolder", !isExpanded);
    }
  } else if (ev.target.dataset.type === "folderAddChat") {
    folderAddChat(idx, this);
  } else if (ev.target.dataset.type === "folderEdit") {
    toEditName(idx, this, 0);
  } else if (ev.target.dataset.type === "folderDel") {
    delFolder(idx, this);
  }
}
const folderDragStartEv = function (ev) {
  dragLi = this;
  dragLi.classList.add("dragingLi");
  dragType = "folder";
  dragIdx = Array.prototype.indexOf.call(folderListEle.children, this);
}
const folderEleAdd = (idx, push = true) => {
  let folder = folderData[idx];
  let folderEle = document.createElement("div");
  folderEle.className = "folderLi";
  if (!isMobile) folderEle.setAttribute("draggable", "true");
  else folderEle.ontouchstart = mobileDragStartEV;
  let headEle = document.createElement("div");
  headEle.className = "headLi";
  headEle.innerHTML = `<svg width="24" height="24"><use xlink:href="#expandFolderIcon" /></svg>
                <div class="folderInfo">
                    <div class="folderName"></div>
                    <div class="folderNum"></div>
                </div>
                <div class="folderOption">
                    <svg data-type="folderAddChat" width="24" height="24" role="img"><title>${translations[locale]["newChat"]}</title><use xlink:href="#addIcon" /></svg>
                    <svg data-type="folderEdit" width="24" height="24" role="img"><title>${translations[locale]["edit"]}</title><use xlink:href="#chatEditIcon" /></svg>
                    <svg data-type="folderDel" width="24" height="24" role="img"><title>${translations[locale]["del"]}</title><use xlink:href="#delIcon" /></svg>
                </div>`
  headEle.children[1].children[0].textContent = folder.name;
  headEle.children[1].children[1].textContent = folder.idxs.length + translations[locale]["chats"];
  folderEle.appendChild(headEle);
  folderEle.ondragstart = folderDragStartEv;
  headEle.onclick = folderEleEvent;
  let chatsEle = document.createElement("div");
  chatsEle.className = "chatsInFolder";
  for (let i = 0; i < folder.idxs.length; i++) {
    chatsEle.appendChild(chatEleAdd(folder.idxs[i], false));
  }
  folderEle.appendChild(chatsEle);
  if (push) { folderListEle.appendChild(folderEle) }
  else { folderListEle.insertBefore(folderEle, folderListEle.firstChild) }
}
document.getElementById("newFolder").onclick = function () {
  folderData.unshift({ name: translations[locale]["newFolderName"], idxs: [] });
  folderEleAdd(0, false);
  updateChatIdxs();
  folderListEle.parentElement.scrollTop = 0;
};
const initChatEle = (index, chatEle) => {
  if (!chatsData.length) {
    chatsData = [
        {
          name:"New Chat",
          data:[]
        }
      ]
    index = 0
  }
  chatEle.children[1].children[0].textContent = chatsData[index].name ?? "New Chat";
  let chatPreview = "";
  if (chatsData[index].data && chatsData[index].data.length) {
    let first = chatsData[index].data.find(item => { return item.role === "assistant" });

    if (first && first.content) { chatPreview = first.content.slice(0, 30) }
  }
  chatEle.children[1].children[1].textContent = chatPreview;
  console.log("initChatEle");
  
};
const chatEleAdd = (idx, appendChat = true) => {
  let chat = chatsData[idx];
  let chatEle = document.createElement("div");
  chatEle.className = "chatLi";
  if (!isMobile) chatEle.setAttribute("draggable", "true");
  else chatEle.ontouchstart = mobileDragStartEV;
  chatEle.ondragstart = chatDragStartEv;
  chatEle.innerHTML = `<svg width="24" height="24"><use xlink:href="#chatIcon" /></svg>
                <div class="chatInfo">
                    <div class="chatName"></div>
                    <div class="chatPre"></div>
                </div>
                <div class="chatOption"><svg data-type="chatEdit" width="24" height="24" role="img"><title>${translations[locale]["edit"]}</title><use xlink:href="#chatEditIcon" /></svg>
                <svg data-type="chatDel" width="24" height="24" role="img"><title>${translations[locale]["del"]}</title><use xlink:href="#delIcon" /></svg></div>`
  if (appendChat) chatListEle.appendChild(chatEle);
  initChatEle(idx, chatEle);
  chatEle.onclick = chatEleEvent;
  return chatEle;
};
const addNewChat = () => {
  let chat = { name: translations[locale]["newChatName"], data: [] };
  if (presetRoleData.default) chat.data.unshift({ role: "system", content: presetRoleData.default });
  preEle.selectedIndex = 0;
  chatsData.push(chat);
  chatIdxs.push(chatsData.length - 1);
  document.getElementById("placeHolder").style.display = "block";
  updateChats();
};
async function delChat(idx, ele, folderIdx, inFolderIdx) {
//删除聊天记录，在网页中删除然后调用updateChats把新的数据同步给插件
  notyf.success("Deleting Chat...")
  if (confirmAction(translations[locale]["delChatTip"])) {
    if (idx === activeChatIdx) endAll();
    if (folderIdx !== void 0) {
      let folder = folderData[folderIdx];
      folder.idxs.splice(inFolderIdx, 1);
      updateFolder(folderIdx);
      if (idx === activeChatIdx) {
        if (inFolderIdx - 1 >= 0) {
          activeChatIdx = folder.idxs[inFolderIdx - 1];
        } else if (folder.idxs.length) {
          activeChatIdx = folder.idxs[0];
        } else {
          extraFolderActive(folderIdx);
        }
      }
    } else {
      let chatIdx = chatIdxs.indexOf(idx);
      chatIdxs.splice(chatIdx, 1);
      if (idx === activeChatIdx) {
        if (chatIdx - 1 >= 0) {
          activeChatIdx = chatIdxs[chatIdx - 1];
        } else if (chatIdxs.length) {
          activeChatIdx = chatIdxs[0];
        } else {
          let folderNewIdx = -1;
          for (let i = folderData.length - 1; i >= 0; i--) {
            if (folderData[i].idxs.length) folderNewIdx = i;
          }
          if (folderNewIdx !== -1) {
            activeChatIdx = folderData[folderNewIdx].idxs[0];
          } else {
            activeChatIdx = -1;
          }
        }
      }
    }
    if (activeChatIdx > idx) activeChatIdx--;
    chatsData.splice(idx, 1);
    ele.remove();
    folderData.forEach(item => {
      if (item.idxs.length) {
        item.idxs.forEach((i, ix) => {
          if (i > idx) item.idxs[ix] = i - 1;
        })
      }
    })
    chatIdxs.forEach((item, ix) => {
      if (item > idx) chatIdxs[ix] = item - 1;
    })
    if (activeChatIdx === -1) {
      addNewChat();
      activeChatIdx = 0;
      chatEleAdd(activeChatIdx);
    }
    updateChats(true,500);
  }
};
const endEditEvent = (ev) => {
  if (!document.getElementById("activeChatEdit").contains(ev.target)) {
    endEditChat();
  }
};
const preventDrag = (ev) => {
  ev.preventDefault();
  ev.stopPropagation();
}
const endEditChat = () => {
  if (operateChatIdx !== void 0) {
    let ele = getChatEle(operateChatIdx);
    chatsData[operateChatIdx].name = ele.children[1].children[0].textContent = document.getElementById("activeChatEdit").value;
    ele.lastElementChild.remove();
  } else if (operateFolderIdx !== void 0) {
    let ele = folderListEle.children[operateFolderIdx].children[0];
    folderData[operateFolderIdx].name = ele.children[1].children[0].textContent = document.getElementById("activeChatEdit").value;
    ele.lastElementChild.remove();
  }
  updateChats();
  operateChatIdx = operateFolderIdx = void 0;
  document.body.removeEventListener("mousedown", endEditEvent, true);
}
const toEditName = (idx, ele, type) => {
  let inputEle = document.createElement("input");
  inputEle.id = "activeChatEdit";
  inputEle.setAttribute("draggable", "true");
  inputEle.ondragstart = preventDrag;
  ele.appendChild(inputEle);
  if (type) {
    inputEle.value = chatsData[idx].name;
    operateChatIdx = idx;
  } else {
    inputEle.value = folderData[idx].name;
    operateFolderIdx = idx;
  }
  inputEle.setSelectionRange(0, 0);
  inputEle.focus();
  inputEle.onkeydown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      endEditChat();
    }
  };
  document.body.addEventListener("mousedown", endEditEvent, true);
  return inputEle;
};
const chatEleEvent = async function (ev) {
  ev.preventDefault();
  ev.stopPropagation();
  let openChat = ev.target.classList.contains("chatLi")
  if (openChat) {
    notyf.success("Loading Chat...")
  }
  let idx, folderIdx, inFolderIdx;
  if (chatListEle.contains(this)) {
    idx = Array.prototype.indexOf.call(chatListEle.children, this);
    idx = chatIdxs[idx];
  } else if (folderListEle.contains(this)) {
    folderIdx = Array.prototype.indexOf.call(folderListEle.children, this.parentElement.parentElement);
    inFolderIdx = Array.prototype.indexOf.call(this.parentElement.children, this);
    idx = folderData[folderIdx].idxs[inFolderIdx];
  }
  if (openChat) {
    if (window.innerWidth <= 800) {
      document.body.classList.remove("show-nav");
    }
    if (searchChatEle.value || activeChatIdx !== idx) {
      endAll();
      activeChatIdx = idx;
      activeChat(this);
    }
  } else if (ev.target.dataset.type === "chatEdit") {
    toEditName(idx, this, 1);
  } else if (ev.target.dataset.type === "chatDel") {
    delChat(idx, this, folderIdx, inFolderIdx);//删除聊天记录
  }
};
const updateChats = async (refresh = false,delayMs = 0) => {
  try {
    if (activeChatIdx > chatsData.length-1) {
      activeChatIdx = chatsData.length-1
    }
    if (refresh) {
      refreshChat(chatsData[activeChatIdx]["data"])
    }else{
      let hasSystem = data[0] && data[0].role === "system"
      if ((hasSystem ? data.length - 1 : data.length) === 0) {
        // notyf.success("Send Message to Chat");
        document.getElementById("placeHolder").style.display = "block";
      }else{
        document.getElementById("placeHolder").style.display = "none";
      }
    }
    if (delayMs) {
      await delay(delayMs)
    }
    let allDataEncoded = getAllData();
    postNotificataion("updateChat", allDataEncoded,false);
  } catch (error) {
    showError(error.toString());
  }
  // localStorage.setItem("chats", JSON.stringify(chatsData));
  // updateChatIdxs();
};
const updateChatIdxs = () => {
  localStorage.setItem("chatIdxs", JSON.stringify(chatIdxs));
  localStorage.setItem("folders", JSON.stringify(folderData));
}
const createConvEle = (className, append = true, model) => {
  let div = document.createElement("div");
  div.className = className;
  formatMdEle(div, model);
  if (append) chatlog.appendChild(div);
  return div;
}
const getChatEle = (idx) => {

  let chatIdx = chatIdxs.indexOf(idx);
  
  if (chatIdx !== -1) {
    return chatListEle.children[chatIdx];
  } else {
    let inFolderIdx;
    let folderIdx = folderData.findIndex(item => {
      inFolderIdx = item.idxs.indexOf(idx);
      return inFolderIdx !== -1;
    })
  // console.log(folderIdx);
    if (folderIdx !== -1) {
      return folderListEle.children[folderIdx].children[1].children[inFolderIdx];
    }
  }
}
/**
 * 刷新当前历史记录
 * @param {object[]} history 
 */
const refreshChat = async (history) => {
  console.log("refreshChat");
  
  data = history;
  // console.log(history);
  if (history.length && history[0].role === "system") {
    if (!history[0].content) {
      data.shift();
    }
  }
  let hasSystem = data[0] && data[0].role === "system"

  // console.log("systemRole"+systemRole);
  
  // console.log(activeChatIdx);
  allListEle.querySelectorAll(".activeChatLi").forEach(ele => {
    ele.classList.remove("activeChatLi");
  })
  allListEle.querySelectorAll(".activeFolder").forEach(ele => {
    ele.classList.remove("activeFolder")
  })
  let ele = getChatEle(activeChatIdx);
  ele.classList.add("activeChatLi");
  activeChatEle = ele;
  if (chatIdxs.indexOf(activeChatIdx) === -1) {
    if (!ele.parentElement.parentElement.classList.contains("expandFolder")) {
      ele.parentElement.parentElement.classList.add("activeFolder");
    }
  }
  if (hasSystem) {
    systemRole = data[0].content;
    systemEle.value = systemRole;
  } else {
    systemRole = void 0;
    systemEle.value = "";
  }
  chatlog.innerHTML = "";
  if ((hasSystem ? data.length - 1 : data.length) === 0) {
    // notyf.success("Send Message to Chat");
    document.getElementById("placeHolder").style.display = "block";
  }else{
    document.getElementById("placeHolder").style.display = "none";
  }
  if (systemRole ? data.length - 1 : data.length) {
    let firstIdx = systemRole ? 1 : 0;
    let lastResEle
    for (let i = firstIdx; i < data.length; i++) {
      // console.log(data[i]);
      switch (data[i].role) {
        case "user":
          let currentReqEle = createConvEle("request");
          let textContent = getTextContent(data[i])
          if (textContent) {
            setReqContent(currentReqEle, textContent);
          }
          let imageContents = getImageContents(data[i])
          if (imageContents.length) {
            imageContents.forEach(image=>{
              setImageContent(currentReqEle,image)
            })
          }
          await delay(50)
          break;
        case "assistant":
          // console.log(data[i]);
          let currentResEle
          let isEmpty = true
          if (data[i].content) {
            isEmpty = false
            if (lastResEle) {
              // console.log("has lastResEle");
              setResContent(lastResEle, data[i].content);
              lastResEle = undefined
            }else{
              // console.log("has not lastResEle");
              currentResEle = createConvEle("response", true, data[i].model);
              setResContent(currentResEle, data[i].content);
            }
          }
          if (data[i].tool_calls) {
            isEmpty = false
            if (!currentResEle) {
              currentResEle = createConvEle("response", true, data[i].model);
            }
            // console.log(data[i].tool_calls[0]);
            let tool_call = data[i].tool_calls.map(func=>{
              return renderFuncResponse(func)
            }).join("\n");
            // setFuncContent(currentResEle,`<pre>${tool_call.function.name+"()"}</pre>`)
            setFuncContent(currentResEle,`<pre>${tool_call}</pre>`)
            lastResEle = currentResEle
            // console.log("sign lastResEle");
          }
          if (data[i].reasoningContent) {
            isEmpty = false
            // console.log("has reasoningContent");
            if (!currentResEle) {
              currentResEle = createConvEle("response", true, data[i].model);
            }
            setReasoningContent(currentResEle,data[i].reasoningContent)
          }
          if (isEmpty) {
            data.splice(i,1)
          }
          await delay(50)
        break;
        case "tool":
          let preData = data[i-1]
          if (preData.role === "assistant" && preData.tool_calls && preData.tool_calls[0].function.name === "webSearch") {
            let searchResults = JSON.parse(data[i].content)
            setSearchResult(lastResEle,searchResults)
          }
          break;
        default:
          break;
      }
    }
  }
  let top = ele.offsetTop + ele.offsetHeight - allListEle.clientHeight;
  if (allListEle.scrollTop < top) allListEle.scrollTop = top;
  if (searchIdxs[activeChatIdx] !== void 0) {
    let dataIdx = searchIdxs[activeChatIdx];
    if (dataIdx !== -1) {
      let currChatEle = chatlog.children[systemRole ? dataIdx - 1 : dataIdx];
      let childs = currChatEle.children[1].getElementsByTagName("*");
      if (childs.length) {
        for (let i = childs.length - 1; i >= 0; i--) {
          if (childs[i].textContent && childs[i].textContent.indexOf(searchChatEle.value) !== -1) {
            let offTop = findOffsetTop(childs[i], messagesEle);
            messagesEle.scrollTop = offTop + childs[i].offsetHeight - messagesEle.clientHeight * 0.15;
            break;
          }
        }
      } else messagesEle.scrollTop = currChatEle.offsetTop;
    } else messagesEle.scrollTop = 0;
  }
  chatsData[activeChatIdx].data = data
  try {
    refreshLatex()
  } catch (error) {
    
  }
};
const activeChat = async (ele) => {
  if (activeChatIdx > chatsData.length-1) {
    activeChatIdx = chatsData.length-1
  }
  refreshChat(chatsData[activeChatIdx]["data"])
  try {
    await delay(500)
    postNotificataion("activeChat", JSON.stringify(chatsData[activeChatIdx]))
  } catch (error) {
    
  }
};
newChatEle.onclick = () => {
  endAll();
  addNewChat();
  activeChatIdx = chatsData.length - 1;
  chatEleAdd(activeChatIdx);
  activeChat(chatListEle.lastElementChild);
};
const initChats = () => {
  let localChats = [
        {
          name:"New Chat",
          data:[]
        }
      ];
  let localFolders = [];
  let localChatIdxs = [0];
  let localChatIdx = 0;
  activeChatIdx = localChatIdx;
  if (localChats) {
    chatsData = localChats;
    let folderIdxs = [];
    if (localFolders) {
      folderData = localFolders;
    }
    if (localChatIdxs !== undefined) {
      chatIdxs = localChatIdxs;
      for (let i = 0; i < chatIdxs.length; i++) {
        chatEleAdd(chatIdxs[i]);
      }
    } else {
      for (let i = 0; i < chatsData.length; i++) {
        if (folderIdxs.indexOf(i) === -1) {
          chatIdxs.push(i);
          chatEleAdd(i);
        }
      }
      updateChatIdxs();
    }
  } else {
    addNewChat();
    chatEleAdd(activeChatIdx);
  }
};
const initChatsFromData = (allData) => {
  folderListEle.innerHTML = "";
  chatListEle.innerHTML = "";
  activeChatIdx = allData.activeChatIdx ?? 0
  if (allData.chats) {
    chatsData = allData.chats
    let folderIdxs = [];
    if (allData.folder) {
      folderData = allData.folder
      for (let i = 0; i < folderData.length; i++) {
        folderEleAdd(i);
        folderIdxs.push(...folderData[i].idxs);
      }
    }
    if (allData.chatIdxs) {
      chatIdxs = allData.chatIdxs;
      for (let i = 0; i < chatIdxs.length; i++) {
        chatEleAdd(chatIdxs[i]);
      }
    } else {
      for (let i = 0; i < chatsData.length; i++) {
        if (folderIdxs.indexOf(i) === -1) {
          chatIdxs.push(i);
          chatEleAdd(i);
        }
      }
      updateChatIdxs();
    }
  } else {
    addNewChat();
    chatEleAdd(activeChatIdx);
  }
};
const initExpanded = () => {
  let folderIdx = folderData.findIndex(item => {
    return item.idxs.indexOf(activeChatIdx) !== -1;
  })
  if (folderIdx !== -1) {
    folderListEle.children[folderIdx].classList.add("expandFolder");
  }
}
try {
  
initChats();
initExpanded();
} catch (error) {
  showError(error.toString())
}
document.getElementById("clearSearch").onclick = () => {
  searchChatEle.value = "";
  searchChatEle.dispatchEvent(new Event("input"));
  searchChatEle.focus();
}
const toSearchChats = () => {
  searchIdxs.length = 0;
  for (let i = 0; i < chatsData.length; i++) {
    let chatEle = getChatEle(i);
    chatEle.style.display = null;
    let flags = isCaseSearch ? "" : "i";
    let pattern = escapeRegexExp(searchChatEle.value);
    let regex = new RegExp(pattern, flags);
    let nameData = chatsData[i].name.match(regex);
    let nameIdx = nameData ? nameData.index : -1;
    let matchContent;
    let dataIdx = chatsData[i].data.findIndex(item => {
      return item.role !== "system" && (matchContent = item.content.match(regex))
    })
    if (nameIdx !== -1 || dataIdx !== -1) {
      let ele = chatEle.children[1];
      if (dataIdx !== -1) {
        let data = chatsData[i].data[dataIdx];
        let idx = matchContent.index;
        let endIdx = idx + matchContent[0].length;
        ele.children[1].textContent = (idx > 8 ? "..." : "") + data.content.slice(idx > 8 ? idx - 5 : 0, idx);
        ele.children[1].appendChild(document.createElement("span"));
        ele.children[1].lastChild.textContent = data.content.slice(idx, endIdx);
        ele.children[1].appendChild(document.createTextNode(data.content.slice(endIdx)))
      } else {
        initChatEle(i, chatEle);
      }
      if (nameIdx !== -1) {
        let endIdx = nameIdx + nameData[0].length;
        ele.children[0].textContent = (nameIdx > 5 ? "..." : "") + chatsData[i].name.slice(nameIdx > 5 ? nameIdx - 3 : 0, nameIdx);
        ele.children[0].appendChild(document.createElement("span"));
        ele.children[0].lastChild.textContent = chatsData[i].name.slice(nameIdx, endIdx);
        ele.children[0].appendChild(document.createTextNode(chatsData[i].name.slice(endIdx)))
      } else {
        ele.children[0].textContent = chatsData[i].name;
      }
      searchIdxs[i] = dataIdx;
    } else {
      chatEle.style.display = "none";
      initChatEle(i, chatEle);
    }
  }
  for (let i = 0; i < folderListEle.children.length; i++) {
    let folderChatEle = folderListEle.children[i].children[1];
    if (!folderChatEle.children.length || Array.prototype.filter.call(folderChatEle.children, (ele) => {
      return ele.style.display !== "none"
    }).length === 0) {
      folderListEle.children[i].style.display = "none";
    }
  }
}
searchChatEle.oninput = (ev) => {
  if (searchChatEle.value.length) {
    toSearchChats();
  } else {
    searchIdxs.length = 0;
    for (let i = 0; i < chatsData.length; i++) {
      let chatEle = getChatEle(i);
      chatEle.style.display = null;
      initChatEle(i, chatEle);
    }
    for (let i = 0; i < folderListEle.children.length; i++) {
      folderListEle.children[i].style.display = null;
    }
  }
};
document.getElementById("resetHotKey").onclick = () => {
  initHotKey();
  notyf.success(translations[locale]["resetSetSuccTip"]);
};
const blobToText = (blob) => {
  return new Promise((res, rej) => {
    let reader = new FileReader();
    reader.readAsText(blob);
    reader.onload = () => {
      res(reader.result);
    }
    reader.onerror = (error) => {
      rej(error);
    }
  })
};
document.getElementById("exportChat").onclick = () => {
  if (loading) stopLoading();
  let data = {
    chatsData: chatsData,
    folderData: folderData,
    chatIdxs: chatIdxs
  }
  let blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  let date = new Date();
  let fileName = "chats-" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + ".json";
  downBlob(blob, fileName);
  notyf.success(translations[locale]["exportSuccTip"]);
};
document.getElementById("importChatInput").onchange = function () {
  let file = this.files[0];
  blobToText(file).then(text => {
    try {
      let json = JSON.parse(text);
      let checked = json.chatsData && json.folderData && json.chatIdxs && json.chatsData.every(item => {
        return item.name !== void 0 && item.data !== void 0;
      });
      if (checked) {
        let preFolder = folderData.length;
        let preLen = chatsData.length;
        if (json.chatsData) {
          chatsData = chatsData.concat(json.chatsData);
        }
        if (json.folderData) {
          for (let i = 0; i < json.folderData.length; i++) {
            json.folderData[i].idxs = json.folderData[i].idxs.map(item => {
              return item + preLen;
            })
            folderData.push(json.folderData[i]);
            folderEleAdd(i + preFolder);
          }
        }
        if (json.chatIdxs) {
          for (let i = 0; i < json.chatIdxs.length; i++) {
            let newIdx = json.chatIdxs[i] + preLen;
            chatIdxs.push(newIdx)
            chatEleAdd(newIdx);
          }
        }
        updateChats();
        checkStorage();
        notyf.success(translations[locale]["importSuccTip"]);
      } else {
        throw new Error("fmt error");
      }
    } catch (e) {
      notyf.error(translations[locale]["importFailTip"]);
    }
    this.value = "";
  })
};
clearChatSet.onclick = clearChat.onclick = () => {
  if (confirmAction(translations[locale]["clearAllTip"])) {
    chatsData.length = 0;
    chatIdxs.length = 0;
    folderData.length = 0;
    folderListEle.innerHTML = "";
    chatListEle.innerHTML = "";
    endAll();
    addNewChat();
    activeChatIdx = 0;
    chatEleAdd(activeChatIdx);
    isCompressedChats = false;
    updateChats();
    checkStorage();
    activeChat(chatListEle.firstElementChild);
    notyf.success(translations[locale]["clearChatSuccTip"]);
  }
};
let localSetKeys = ['modelVersion', 'APISelect', 'APIHost', 'APIKey', 'hotKeys', 'userAvatar', 'system', 'temp', 'top_p', 'convWidth0', 'convWidth1', 'textSpeed', 'contLen', 'enableLongReply', 'existVoice', 'voiceTestText', 'azureRegion', 'azureKey', 'enableContVoice', 'enableAutoVoice', 'voiceRecLang', 'autoVoiceSendWord', 'autoVoiceStopWord', 'autoVoiceSendOut', 'keepListenMic', 'fullWindow', 'themeMode', 'autoThemeMode', 'customDarkTime', 'UILang', 'pinNav', 'voice0', 'voicePitch0', 'voiceVolume0', 'voiceRate0', 'azureRole0', 'azureStyle0', 'voice1', 'voicePitch1', 'voiceVolume1', 'voiceRate1', 'azureRole1', 'azureStyle1', 'searchFlag'];


const endAll = () => {
  endSpeak();
  if (editingIdx !== void 0) resumeSend();
  if (loading) stopLoading();
};
const processIdx = (plus) => {
  if (currentVoiceIdx !== void 0) currentVoiceIdx += plus;
  if (editingIdx !== void 0) editingIdx += plus;
}
const hotKeyVals = {};
const ctrlHotKeyEv = (ev) => {
  if (ev.ctrlKey || ev.metaKey) {
    switch (ev.key.toLowerCase()) {
      case hotKeyVals["Nav"]:
        ev.preventDefault();
        toggleNavEv();
        return false;
      case hotKeyVals["Search"]:
        ev.preventDefault();
        searchChatEle.focus();
        return false;
      case hotKeyVals["Input"]:
        ev.preventDefault();
        inputAreaEle.focus();
        return false;
      case hotKeyVals["NewChat"]:
        ev.preventDefault();
        newChatEle.dispatchEvent(new MouseEvent("click"));
        return false;
      case hotKeyVals["ClearChat"]:
        ev.preventDefault();
        clearEle.dispatchEvent(new MouseEvent("click"));
        return false;
      case hotKeyVals["VoiceRec"]:
        if (supportRec) {
          ev.preventDefault();
          toggleRecEv();
        }
        return false;
      case hotKeyVals["VoiceSpeak"]:
        ev.preventDefault();
        speechEvent(systemRole ? 1 : 0);
        return false;
    }
  }
}
const ctrlAltHotKeyEv = (ev) => {
  if ((ev.ctrlKey || ev.metaKey) && ev.altKey) {
    switch (ev.key.toLowerCase()) {
      case hotKeyVals["Window"]:
        ev.preventDefault();
        toggleFull.dispatchEvent(new Event("click"));
        return false;
      case hotKeyVals["Theme"]:
        ev.preventDefault();
        lightEle.dispatchEvent(new Event("click"));
        return false;
      case hotKeyVals["Lang"]:
        ev.preventDefault();
        let idx = localeList.indexOf(locale) + 1;
        if (idx === localeList.length) idx = 0;
        locale = localeList[idx];
        setLang();
        changeLocale();
        return false;
    }
  }
}
const listKey = ['Nav', 'Search', 'Input', 'NewChat', 'ClearChat', 'VoiceRec', 'VoiceSpeak', 'Window', 'Theme', 'Lang'];
const ctrlKeyIdx = 7;
const defKeyVal = ['b', 'k', 'i', 'e', 'r', 'q', 's', 'u', 't', 'l'];
const initHotKey = () => {
  let localKeysObj = {};
  let localKeys = localStorage.getItem("hotKeys");
  if (localKeys) {
    try {
      localKeysObj = JSON.parse(localKeys);
    } catch (e) { }
  }
  let pre1 = isApple ? "⌘ + " : "Ctrl + ";
  let pre2 = isApple ? "⌘ + ⌥ + " : "Ctrl + Alt + ";
  for (let i = 0; i < listKey.length; i++) {
    let key = listKey[i];
    if (key === "VoiceRec" && !supportRec) continue;
    let ele = window["hotKey" + key];
    for (let j = 0; j < 26; j++) {
      // top-level hotkey, can't overwrite
      if (i < ctrlKeyIdx && (j === 13 || j === 19 || j === 22)) continue;
      let val = String.fromCharCode(j + 97);
      ele.options.add(new Option((i < ctrlKeyIdx ? pre1 : pre2) + val.toUpperCase(), val));
    }
    hotKeyVals[key] = ele.value = localKeysObj[key] || defKeyVal[i];
    ele.onchange = () => {
      if (hotKeyVals[key] === ele.value) return;
      let exist = listKey.find((item, idx) => {
        return (i < ctrlKeyIdx ? idx < ctrlKeyIdx : idx >= ctrlKeyIdx) && hotKeyVals[item] === ele.value;
      })
      if (exist) {
        ele.value = hotKeyVals[key];
        notyf.error(translations[locale]["hotkeyConflict"])
        return;
      }
      hotKeyVals[key] = ele.value;
      localStorage.setItem("hotKeys", JSON.stringify(hotKeyVals));
    }
  }
};
initHotKey();
document.addEventListener("keydown", ctrlHotKeyEv);
document.addEventListener("keydown", ctrlAltHotKeyEv);
const initSetting = () => {
  const customModelEle = document.getElementById("modelInput");
  customModelEle.dispatchEvent(new Event("change"));

  const modelEle = document.getElementById("preSetModel");
  const apiHostEle = document.getElementById("apiHostInput");
  const apiSelectEle = document.getElementById("apiSelect");
  const delApiOption = function (ev) {
    ev.stopPropagation();
    let index = Array.prototype.indexOf.call(apiSelectEle.children, this.parentElement);
    apiSelects.splice(index, 1);
    this.parentElement.remove();
    localStorage.setItem("APISelect", JSON.stringify(apiSelects));
    if (!apiSelects.length) apiSelectEle.style.display = "none";
  }
  const appendApiOption = () => {
    apiSelects.push(apiHost);
    initApiOption(apiHost);
    localStorage.setItem("APISelect", JSON.stringify(apiSelects));
  }
  const selApiOption = function (ev) {
    ev.preventDefault();
    ev.stopPropagation();
    apiSelectEle.style.display = "none";
    let index = Array.prototype.indexOf.call(apiSelectEle.children, this);
    apiHostEle.value = apiSelects[index];
    apiHostEle.dispatchEvent(new Event("change"));
  }
  const initApiOption = (api) => {
    let optionEle = document.createElement("div");
    optionEle.onclick = selApiOption;
    let textEle = document.createElement("span");
    textEle.textContent = api;
    optionEle.appendChild(textEle);
    let delEle = document.createElement("div");
    delEle.className = "delApiOption";
    delEle.onclick = delApiOption;
    delEle.innerHTML = `<svg width="24" height="24"><use xlink:href="#closeIcon" /></svg>`;
    optionEle.appendChild(delEle);
    apiSelectEle.appendChild(optionEle);
  }
  const initApiSelectEle = () => {
    apiSelectEle.innerHTML = "";
    for (let i = 0; i < apiSelects.length; i++) {
      initApiOption(apiSelects[i]);
    }
  }
  initApiSelectEle();
  apiHostEle.onfocus = () => {
    if (apiSelects.length) apiSelectEle.style.display = "block";
  }
  apiHostEle.onblur = (ev) => {
    if (!(ev.relatedTarget && apiSelectEle.contains(ev.relatedTarget))) apiSelectEle.style.display = "none";
  }
  let localApiHost = localStorage.getItem("APIHost");
  apiHost = apiHostEle.value = envAPIEndpoint || localApiHost || apiHostEle.getAttribute("value") || "https://api.chatanywhere.tech";
  apiHostEle.onchange = () => {
    apiHost = apiHostEle.value || "https://api.chatanywhere.tech";
    if (apiHost && apiSelects.indexOf(apiHost) === -1) appendApiOption();
    localStorage.setItem("APIHost", apiHost);
  }
  apiHostEle.dispatchEvent(new Event("change"));

  const keyEle = document.getElementById("keyInput");
  let localKey = localStorage.getItem("APIKey");
  customAPIKey = keyEle.value = envAPIKey || localKey || keyEle.getAttribute("value") || "sk-d1IiKor80we3AsuAUwp2CXjxfDRqKlTDSCBZMlb7R90vRpH4";
  keyEle.onchange = () => {
    customAPIKey = keyEle.value || "sk-d1IiKor80we3AsuAUwp2CXjxfDRqKlTDSCBZMlb7R90vRpH4";
    localStorage.setItem("APIKey", customAPIKey);
  }
  keyEle.dispatchEvent(new Event("change"));





  const updateAvatar = () => {
    setAvatarPre.src = userAvatar;
    chatlog.querySelectorAll(".request>.chatAvatar").forEach(ele => {
      ele.children[0].src = userAvatar;
    })
  }

  let localAvatar = "data:image/webp;base64,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";
  userAvatar = setAvatarPre.src = setAvatar.value = localAvatar;// || setAvatar.getAttribute("value") || "https://file.feliks.top/avatar.webp";
  setAvatar.onchange = () => {
    userAvatar = setAvatar.value;
    updateAvatar();
  }
  setAvatar.dispatchEvent(new Event("change"));
  let localSystem = localStorage.getItem("system");
  systemEle.onchange = () => {
    systemRole = systemEle.value;
    if (systemRole) {
      if (data[0] && data[0].role === "system") {
        data[0].content = systemRole;
      } else {
        data.unshift({ role: "system", content: systemRole });
        processIdx(1);
      }
    } else if (data[0] && data[0].role === "system") {
      data.shift();
      processIdx(-1);
    }
    updateChats();
  }
  if (systemRole === void 0) {
    systemRole = systemEle.value = localSystem || presetRoleData.default || "";
    if (systemRole) {
      data.unshift({ role: "system", content: systemRole });
      processIdx(1);
      updateChats();
    }
  }
  preEle.onchange = () => {
    let val = preEle.value;
    if (val && presetRoleData[val]) {
      systemEle.value = presetRoleData[val];
    } else {
      systemEle.value = "";
    }
    systemEle.dispatchEvent(new Event("change"));
    systemEle.focus();
  }
  const topEle = document.getElementById("top_p");
  let localTop = localStorage.getItem("top_p");
  const tempEle = document.getElementById("temp");
  let localTemp = localStorage.getItem("temp");
  tempEle.value = roleTemp = parseFloat(localTemp || tempEle.getAttribute("value"));
  tempEle.oninput = () => {
    tempEle.style.backgroundSize = (tempEle.value - tempEle.min) * 100 / (tempEle.max - tempEle.min) + "% 100%";
    roleTemp = parseFloat(tempEle.value);
    localStorage.setItem("temp", tempEle.value);
  }
  tempEle.dispatchEvent(new Event("input"));
  const convWEle = document.getElementById("convWidth");
  const styleSheet = document.styleSheets[0];
  convWEle.oninput = () => {
    let type = isFull ? 1 : 0;
    convWEle.style.backgroundSize = (convWEle.value - convWEle.min) * 100 / (convWEle.max - convWEle.min) + "% 100%";
    convWidth[type] = parseInt(convWEle.value);
    localStorage.setItem("convWidth" + type, convWEle.value);
    styleSheet.deleteRule(0);
    styleSheet.deleteRule(0);
    styleSheet.insertRule(`.bottom_wrapper{max-width:${convWidth[type]}%;}`, 0);
    // styleSheet.insertRule(`.requestBody,.response .markdown-body{max-width:calc(${convWidth[type]}% - 88px);}`, 0);
  }
  const setConvValue = () => {
    let type = isFull ? 1 : 0;
    let localConv = localStorage.getItem("convWidth" + type);
    convWEle.value = parseInt(localConv || (type ? "60" : "100"));
    convWEle.dispatchEvent(new Event("input"));
  }
  const fullFunc = () => {
    isFull = windowEle.classList.contains("full_window");
    localStorage.setItem("fullWindow", isFull);
    setConvValue();
    toggleFull.title = isFull ? translations[locale]["winedWin"] : translations[locale]["fullWin"];
    toggleFull.children[0].children[0].setAttributeNS("http://www.w3.org/1999/xlink", "href", isFull ? "#collapseFullIcon" : "#expandFullIcon");
  }
  toggleFull.onclick = () => {
    windowEle.classList.toggle("full_window");
    fullFunc();
  }
  let localFull = localStorage.getItem("fullWindow");
  if (localFull && localFull === "true") {
    if (!windowEle.classList.contains("full_window")) {
      windowEle.classList.add("full_window");
      fullFunc();
    }
  } else if (windowEle.classList.contains("full_window")) {
    windowEle.classList.remove("full_window");
    fullFunc();
  } else {
    setConvValue();
  }
  const speedEle = document.getElementById("textSpeed");
  let localSpeed = localStorage.getItem("textSpeed");
  speedEle.value = localSpeed || speedEle.getAttribute("value");
  textSpeed = parseFloat(speedEle.min) + (speedEle.max - speedEle.value);
  speedEle.oninput = () => {
    speedEle.style.backgroundSize = (speedEle.value - speedEle.min) * 100 / (speedEle.max - speedEle.min) + "% 100%";
    textSpeed = parseFloat(speedEle.min) + (speedEle.max - speedEle.value);
    localStorage.setItem("textSpeed", speedEle.value);
  }
  speedEle.dispatchEvent(new Event("input"));
  if (localStorage.getItem("enableCont") != null) { // fallback old cont
    if (localStorage.getItem("enableCont") === "false") localStorage.setItem("contLength", 0);
    localStorage.removeItem("enableCont");
  }
  const contLenEle = document.getElementById("contLength");
  let localContLen = localStorage.getItem("contLength");
  contLenEle.value = contLen = parseInt(localContLen || contLenEle.getAttribute("value"));
  contLenEle.oninput = () => {
    contLenEle.style.backgroundSize = (contLenEle.value - contLenEle.min) * 100 / (contLenEle.max - contLenEle.min) + "% 100%";
    contLen = parseInt(contLenEle.value);
    contLenWrap.textContent = contLen;
    localStorage.setItem("contLength", contLenEle.value);
  }
  contLenEle.dispatchEvent(new Event("input"));
  const longEle = document.getElementById("enableLongReply");
  let localLong = localStorage.getItem("enableLongReply");
  longEle.checked = enableLongReply = (localLong || longEle.getAttribute("checked")) === "true";
  longEle.onchange = () => {
    enableLongReply = longEle.checked;
    localStorage.setItem("enableLongReply", enableLongReply);
  }
  longEle.dispatchEvent(new Event("change"));
  let localPin = localStorage.getItem("pinNav");
  if (window.innerWidth > 800 && !(localPin && localPin === "false")) {
    document.body.classList.add("show-nav");
  };
  const setDarkTheme = (is) => {
    let cssEle = document.body.getElementsByTagName("link")[0];
    cssEle.href = cssEle.href.replace(is ? "light" : "dark", is ? "dark" : "light");
    let hlCssEle = document.body.getElementsByTagName("link")[1];
    hlCssEle.href = hlCssEle.href.replace(is ? "github" : "github-dark", is ? "github-dark" : "github");
    justDarkTheme(is);
  }
  const handleAutoMode = (ele) => {
    // console.log("handleAutoMode");
    
    if (ele.checked) {
      autoThemeMode = parseInt(ele.value);
      localStorage.setItem("autoThemeMode", autoThemeMode);
      initAutoTime();
      if (autoThemeMode) {
        if (customDarkOut !== void 0) {
          clearTimeout(customDarkOut);
          customDarkOut = void 0;
        }
        setDarkTheme(darkMedia.matches);
      } else {
        checkCustomTheme();
      }
    }
  }
  autoTheme0.onchange = autoTheme1.onchange = function () { handleAutoMode(this) };
  const handleAutoTime = (ele, idx) => {
    let otherIdx = 1 - idx;
    if (ele.value !== customDarkTime[otherIdx]) {
      customDarkTime[idx] = ele.value;
      localStorage.setItem("customDarkTime", JSON.stringify(customDarkTime));
      checkCustomTheme();
    } else {
      ele.value = customDarkTime[idx];
      notyf.error(translations[locale]["customDarkTip"]);
    }
  }
  customStart.onchange = function () { handleAutoTime(this, 0) };
  customEnd.onchange = function () { handleAutoTime(this, 1) };
  const initAutoTime = () => {
    customAutoSet.style.display = autoThemeMode === 0 ? "block" : "none";
    if (autoThemeMode === 0) {
      customStart.value = customDarkTime[0];
      customEnd.value = customDarkTime[1];
    }
  }
  const initAutoThemeEle = () => {
    autoThemeEle.querySelector("#autoTheme" + autoThemeMode).checked = true;
    initAutoTime();
  }
  const checkCustomTheme = () => {
    if (customDarkOut !== void 0) clearTimeout(customDarkOut);
    let date = new Date();
    let nowTime = date.getTime();
    let start = customDarkTime[0].split(":");
    let startTime = new Date().setHours(start[0], start[1], 0, 0);
    let end = customDarkTime[1].split(":");
    let endTime = new Date().setHours(end[0], end[1], 0, 0);
    let order = endTime > startTime;
    let isDark = order ? (nowTime > startTime && endTime > nowTime) : !(nowTime > endTime && startTime > nowTime);
    let nextChange = isDark ? endTime - nowTime : startTime - nowTime;
    if (nextChange < 0) nextChange += dayMs;
    setDarkTheme(isDark);
    customDarkOut = setTimeout(() => {
      checkCustomTheme();
    }, nextChange);
  }
  const setDarkMode = () => {
    console.log("setDarkMode");
    autoThemeMode = true
    themeMode = 2
    //强制自动切换主题
    if (customDarkOut !== void 0) {
      clearTimeout(customDarkOut);
      customDarkOut = void 0;
    }
    autoThemeEle.style.display = "none";
    let themeClass, title;
    if (themeMode === 2) {
      autoThemeEle.style.display = "block";
      if (autoThemeMode) {
        setDarkTheme(darkMedia.matches);
      } else {
        checkCustomTheme();
        initAutoThemeEle();
      }
      themeClass = "autoTheme";
      title = translations[locale]["autoTheme"];
    } else if (themeMode === 1) {
      setDarkTheme(false);
      themeClass = "lightTheme";
      title = translations[locale]["lightTheme"];
    } else {
      setDarkTheme(true);
      themeClass = "darkTheme";
      title = translations[locale]["darkTheme"];
    }
    localStorage.setItem("themeMode", themeMode);
    setLightEle.className = "setDetail themeDetail " + themeClass;
    lightEle.children[0].children[0].setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + themeClass + "Icon");
    lightEle.title = title;
  }
  lightEle.onclick = () => {
    themeMode = themeMode - 1;
    if (themeMode === -1) themeMode = 2;
    setDarkMode();
  }
  setLightEle.onclick = (ev) => {
    let idx = Array.prototype.indexOf.call(setLightEle.children, ev.target);
    if (themeMode !== idx) {
      themeMode = idx;
      setDarkMode();
    }
  }
  let localTheme = localStorage.getItem("themeMode");
  themeMode = parseInt(localTheme || "1");
  let localAutoTheme = localStorage.getItem("autoThemeMode");
  autoThemeMode = parseInt(localAutoTheme || "1");
  let localCustomDark = localStorage.getItem("customDarkTime");
  customDarkTime = JSON.parse(localCustomDark || '["21:00", "07:00"]');
  setDarkMode();
  darkMedia.onchange = e => {
    if (themeMode === 2 && autoThemeMode) setDarkTheme(e.matches);
  };
  const caseSearchEle = document.getElementById("matchCaseSearch");
  let localSearchFlag = localStorage.getItem("searchFlag") || "0";
  isCaseSearch = Boolean(localSearchFlag & 1);
  caseSearchEle.classList.toggle("seledSearch", isCaseSearch);
  caseSearchEle.onclick = () => {
    isCaseSearch = caseSearchEle.classList.toggle("seledSearch");
    localStorage.setItem("searchFlag", ~~isCaseSearch);
    if (searchChatEle.value.length) toSearchChats();
  }
};
initSetting();
document.getElementById("loadMask").style.display = "none";
const closeEvent = (ev) => {
  if (settingEle.contains(ev.target)) return;
  if (!dialogEle.contains(ev.target)) {
    dialogEle.style.display = "none";
    document.removeEventListener("mousedown", closeEvent, true);
    settingEle.classList.remove("showSetting");
    stopTestVoice();
  }
}
settingEle.onmousedown = () => {
  dialogEle.style.display = dialogEle.style.display === "block" ? "none" : "block";
  if (dialogEle.style.display === "block") {
    document.addEventListener("mousedown", closeEvent, true);
    settingEle.classList.add("showSetting");
  } else {
    document.removeEventListener("mousedown", closeEvent, true);
    settingEle.classList.remove("showSetting");
  }
}
let delayId;
/**
 * 
 * @param {number} ms 
 * @returns {Promise<void>}
 */
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
const uuidv4 = () => {
  let uuid = ([1e7] + 1e3 + 4e3 + 8e3 + 1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
  return existVoice === 3 ? uuid.toUpperCase() : uuid;
}
const getTime = () => {
  return existVoice === 3 ? new Date().toISOString() : new Date().toString();
}
const getWSPre = (date, requestId) => {
  let osPlatform = (typeof window !== "undefined") ? "Browser" : "Node";
  osPlatform += "/" + navigator.platform;
  let osName = navigator.userAgent;
  let osVersion = navigator.appVersion;
  return `Path: speech.config\r\nX-RequestId: ${requestId}\r\nX-Timestamp: ${date}\r\nContent-Type: application/json\r\n\r\n{"context":{"system":{"name":"SpeechSDK","version":"1.26.0","build":"JavaScript","lang":"JavaScript","os":{"platform":"${osPlatform}","name":"${osName}","version":"${osVersion}"}}}}`
}
const getWSAudio = (date, requestId) => {
  return existVoice === 3 ? `Path: synthesis.context\r\nX-RequestId: ${requestId}\r\nX-Timestamp: ${date}\r\nContent-Type: application/json\r\n\r\n{"synthesis":{"audio":{"metadataOptions":{"sentenceBoundaryEnabled":false,"wordBoundaryEnabled":false},"outputFormat":"${voiceFormat}"}}}`
    : `X-Timestamp:${date}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"true"},"outputFormat":"${voiceFormat}"}}}}`
}
const getWSText = (date, requestId, lang, voice, volume, rate, pitch, style, role, msg) => {
  let fmtVolume = volume === 1 ? "+0%" : volume * 100 - 100 + "%";
  let fmtRate = (rate >= 1 ? "+" : "") + (rate * 100 - 100) + "%";
  let fmtPitch = (pitch >= 1 ? "+" : "") + (pitch - 1) + "Hz";
  msg = getEscape(msg);
  if (existVoice === 3) {
    let fmtStyle = style ? ` style="${style}"` : "";
    let fmtRole = role ? ` role="${role}"` : "";
    let fmtExpress = fmtStyle + fmtRole;
    return `Path: ssml\r\nX-RequestId: ${requestId}\r\nX-Timestamp: ${date}\r\nContent-Type: application/ssml+xml\r\n\r\n<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='https://www.w3.org/2001/mstts' xml:lang='${lang}'><voice name='${voice}'><mstts:express-as${fmtExpress}><prosody pitch='${fmtPitch}' rate='${fmtRate}' volume='${fmtVolume}'>${msg}</prosody></mstts:express-as></voice></speak>`;
  } else {
    return `X-RequestId:${requestId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${date}Z\r\nPath:ssml\r\n\r\n<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='https://www.w3.org/2001/mstts' xml:lang='${lang}'><voice name='${voice}'><prosody pitch='${fmtPitch}' rate='${fmtRate}' volume='${fmtVolume}'>${msg}</prosody></voice></speak>`;
  }
}
const getAzureWSURL = () => {
  return `wss://${azureRegion}.tts.speech.microsoft.com/cognitiveservices/websocket/v1?Authorization=bearer%20${azureToken}`
}
const edgeTTSURL = "wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?trustedclienttoken=6A5AA1D4EAFF4E9FB37E23D68491D6F4";
const resetSpeakIcon = () => {
  if (currentVoiceIdx !== void 0) {
    chatlog.children[systemRole ? currentVoiceIdx - 1 : currentVoiceIdx].classList.remove("showVoiceCls");
    chatlog.children[systemRole ? currentVoiceIdx - 1 : currentVoiceIdx].lastChild.lastChild.className = "voiceCls readyVoice";
  }
}
const endSpeak = () => {
  resetSpeakIcon();
  currentVoiceIdx = void 0;
  if (voiceIns && voiceIns instanceof Audio) {
    voiceIns.pause();
    voiceIns.currentTime = 0;
    URL.revokeObjectURL(voiceIns.src);
    voiceIns.removeAttribute("src");
    voiceIns.onended = voiceIns.onerror = null;
    sourceBuffer = void 0;
    speechPushing = false;
    if (voiceSocket && voiceSocket["pending"]) {
      voiceSocket.close()
    }
    if (autoVoiceSocket && autoVoiceSocket["pending"]) {
      autoVoiceSocket.close()
    }
    speechQuene.length = 0;
    autoMediaSource = void 0;
    voiceContentQuene = [];
    voiceEndFlagQuene = [];
    voiceBlobURLQuene = [];
    autoOnlineVoiceFlag = false;
  } else if (supportSpe) {
    speechSynthesis.cancel();
  }
}
const speakEvent = (ins, force = true, end = false) => {
  return new Promise((res, rej) => {
    ins.onerror = () => {
      if (end) {
        endSpeak();
      } else if (force) {
        resetSpeakIcon();
      }
      res();
    }
    if (ins instanceof Audio) {
      ins.onended = ins.onerror;
      ins.play();
    } else {
      ins.onend = ins.onerror;
      speechSynthesis.speak(voiceIns);
    }
  })
};
let voiceData = [];
let voiceSocket;
let speechPushing = false;
let speechQuene = [];
let sourceBuffer;
speechQuene.push = function (buffer) {
  if (!speechPushing && (sourceBuffer && !sourceBuffer.updating)) {
    speechPushing = true;
    sourceBuffer.appendBuffer(buffer);
  } else {
    Array.prototype.push.call(this, buffer)
  }
}
const initSocket = () => {
  return new Promise((res, rej) => {
    if (!voiceSocket || voiceSocket.readyState > 1) {
      voiceSocket = new WebSocket(existVoice === 3 ? getAzureWSURL() : edgeTTSURL);
      voiceSocket.binaryType = "arraybuffer";
      voiceSocket.onopen = () => {
        res();
      };
      voiceSocket.onerror = () => {
        rej();
      }
    } else {
      return res();
    }
  })
}
const initStreamVoice = (mediaSource) => {
  return new Promise((r, j) => {
    Promise.all([initSocket(), new Promise(res => {
      mediaSource.onsourceopen = () => {
        res();
      };
    })]).then(() => {
      r();
    })
  })
}
let downQuene = {};
let downSocket;
const downBlob = (blob, name) => {
  let a = document.createElement("a");
  a.download = name;
  a.href = URL.createObjectURL(blob);
  a.click();
}
const initDownSocket = () => {
  return new Promise((res, rej) => {
    if (!downSocket || downSocket.readyState > 1) {
      downSocket = new WebSocket(existVoice === 3 ? getAzureWSURL() : edgeTTSURL);
      downSocket.binaryType = "arraybuffer";
      downSocket.onopen = () => {
        res();
      };
      downSocket.onmessage = (e) => {
        if (e.data instanceof ArrayBuffer) {
          let text = new TextDecoder().decode(e.data.slice(0, voicePreLen));
          let reqIdx = text.indexOf(":");
          let uuid = text.slice(reqIdx + 1, reqIdx + 33);
          downQuene[uuid]["blob"].push(e.data.slice(voicePreLen));
        } else if (e.data.indexOf("Path:turn.end") !== -1) {
          let reqIdx = e.data.indexOf(":");
          let uuid = e.data.slice(reqIdx + 1, reqIdx + 33);
          let blob = new Blob(downQuene[uuid]["blob"], { type: voiceMIME });
          let key = downQuene[uuid]["key"];
          let name = downQuene[uuid]["name"];
          if (blob.size === 0) {
            notyf.open({
              type: "warning",
              message: translations[locale]["cantSpeechTip"]
            });
            return;
          }
          voiceData[key] = blob;
          if (downQuene[uuid]["isTest"]) {
            testVoiceBlob = blob;
            playTestAudio();
          } else {
            downBlob(blob, name.slice(0, 16) + voiceSuffix);
          }
        }
      }
      downSocket.onerror = () => {
        rej();
      }
    } else {
      return res();
    }
  })
}
let testVoiceBlob;
let testVoiceIns;
const playTestAudio = () => {
  if (existVoice >= 2) {
    if (!testVoiceIns || testVoiceIns instanceof Audio === false) {
      testVoiceIns = new Audio();
      testVoiceIns.onended = testVoiceIns.onerror = () => {
        stopTestVoice();
      }
    }
    testVoiceIns.src = URL.createObjectURL(testVoiceBlob);
    testVoiceIns.play();
  } else if (supportSpe) {
    speechSynthesis.speak(testVoiceIns);
  }
}
const pauseTestVoice = () => {
  if (testVoiceIns) {
    if (testVoiceIns && testVoiceIns instanceof Audio) {
      testVoiceIns.pause();
    } else if (supportSpe) {
      speechSynthesis.pause();
    }
  }
  testVoiceBtn.className = "justSetLine resumeTestVoice";
}
const resumeTestVoice = () => {
  if (testVoiceIns) {
    if (testVoiceIns && testVoiceIns instanceof Audio) {
      testVoiceIns.play();
    } else if (supportSpe) {
      speechSynthesis.resume();
    }
  }
  testVoiceBtn.className = "justSetLine pauseTestVoice";
}
const stopTestVoice = () => {
  if (testVoiceIns) {
    if (testVoiceIns instanceof Audio) {
      testVoiceIns.pause();
      testVoiceIns.currentTime = 0;
      URL.revokeObjectURL(testVoiceIns.src);
      testVoiceIns.removeAttribute("src");
    } else if (supportSpe) {
      speechSynthesis.cancel();
    }
  }
  testVoiceBtn.className = "justSetLine readyTestVoice";
}
const startTestVoice = async () => {
  testVoiceBtn.className = "justSetLine pauseTestVoice";
  let volume = voiceVolume[voiceType];
  let rate = voiceRate[voiceType];
  let pitch = voicePitch[voiceType];
  let content = voiceTestText;
  if (existVoice >= 2) {
    let voice = existVoice === 3 ? voiceRole[voiceType].ShortName : voiceRole[voiceType].Name;
    let style = azureStyle[voiceType];
    let role = azureRole[voiceType];
    let key = content + voice + volume + rate + pitch + (style ? style : "") + (role ? role : "");
    let blob = voiceData[key];
    if (blob) {
      testVoiceBlob = blob;
      playTestAudio();
    } else {
      await initDownSocket();
      let currDate = getTime();
      let lang = voiceRole[voiceType].lang;
      let uuid = uuidv4();
      if (existVoice === 3) {
        downSocket.send(getWSPre(currDate, uuid));
      }
      downSocket.send(getWSAudio(currDate, uuid));
      downSocket.send(getWSText(currDate, uuid, lang, voice, volume, rate, pitch, style, role, content));
      downSocket["pending"] = true;
      downQuene[uuid] = {};
      downQuene[uuid]["name"] = content;
      downQuene[uuid]["key"] = key;
      downQuene[uuid]["isTest"] = true;
      downQuene[uuid]["blob"] = [];
    }
  } else {
    testVoiceIns = new SpeechSynthesisUtterance();
    testVoiceIns.onend = testVoiceIns.onerror = () => {
      stopTestVoice();
    }
    testVoiceIns.voice = voiceRole[voiceType];
    testVoiceIns.volume = volume;
    testVoiceIns.rate = rate;
    testVoiceIns.pitch = pitch;
    testVoiceIns.text = content;
    playTestAudio();
  }
}
const downloadAudio = async (idx) => {
  if (existVoice < 2) {
    return;
  }
  let type = data[idx].role === "user" ? 0 : 1;
  let voice = existVoice === 3 ? voiceRole[type].ShortName : voiceRole[type].Name;
  let volume = voiceVolume[type];
  let rate = voiceRate[type];
  let pitch = voicePitch[type];
  let style = azureStyle[type];
  let role = azureRole[type];
  let content = chatlog.children[systemRole ? idx - 1 : idx].children[1].textContent;
  let key = content + voice + volume + rate + pitch + (style ? style : "") + (role ? role : "");
  let blob = voiceData[key];
  if (blob) {
    downBlob(blob, content.slice(0, 16) + voiceSuffix);
  } else {
    await initDownSocket();
    let currDate = getTime();
    let lang = voiceRole[type].lang;
    let uuid = uuidv4();
    if (existVoice === 3) {
      downSocket.send(getWSPre(currDate, uuid));
    }
    downSocket.send(getWSAudio(currDate, uuid));
    downSocket.send(getWSText(currDate, uuid, lang, voice, volume, rate, pitch, style, role, content));
    downSocket["pending"] = true;
    downQuene[uuid] = {};
    downQuene[uuid]["name"] = content;
    downQuene[uuid]["key"] = key;
    downQuene[uuid]["blob"] = [];
  }
}
const NoMSEPending = (key) => {
  return new Promise((res, rej) => {
    let bufArray = [];
    voiceSocket.onmessage = (e) => {
      if (e.data instanceof ArrayBuffer) {
        bufArray.push(e.data.slice(voicePreLen));
      } else if (e.data.indexOf("Path:turn.end") !== -1) {
        voiceSocket["pending"] = false;
        if (!(bufArray.length === 1 && bufArray[0].byteLength === 0)) {
          voiceData[key] = new Blob(bufArray, { type: voiceMIME });
          res(voiceData[key]);
        } else {
          res(new Blob());
        }
      }
    }
  })
}
const pauseEv = () => {
  if (voiceIns.src) {
    let ele = chatlog.children[systemRole ? currentVoiceIdx - 1 : currentVoiceIdx].lastChild.lastChild;
    ele.classList.remove("readyVoice");
    ele.classList.remove("pauseVoice");
    ele.classList.add("resumeVoice");
  }
}
const resumeEv = () => {
  if (voiceIns.src) {
    let ele = chatlog.children[systemRole ? currentVoiceIdx - 1 : currentVoiceIdx].lastChild.lastChild;
    ele.classList.remove("readyVoice");
    ele.classList.remove("resumeVoice");
    ele.classList.add("pauseVoice");
  }
}
const speechEvent = async (idx) => {
  if (!data[idx]) return;
  endSpeak();
  currentVoiceIdx = idx;
  if (!data[idx].content && enableContVoice) {
    if (currentVoiceIdx !== data.length - 1) { return speechEvent(currentVoiceIdx + 1) }
    else { return endSpeak() }
  };
  let type = data[idx].role === "user" ? 0 : 1;
  chatlog.children[systemRole ? idx - 1 : idx].classList.add("showVoiceCls");
  let voiceIconEle = chatlog.children[systemRole ? idx - 1 : idx].lastChild.lastChild;
  voiceIconEle.className = "voiceCls pauseVoice";
  let content = chatlog.children[systemRole ? idx - 1 : idx].children[1].textContent;
  let volume = voiceVolume[type];
  let rate = voiceRate[type];
  let pitch = voicePitch[type];
  let style = azureStyle[type];
  let role = azureRole[type];
  if (existVoice >= 2) {
    if (!voiceIns || voiceIns instanceof Audio === false) {
      voiceIns = new Audio();
      voiceIns.onpause = pauseEv;
      voiceIns.onplay = resumeEv;
    }
    let voice = existVoice === 3 ? voiceRole[type].ShortName : voiceRole[type].Name;
    let key = content + voice + volume + rate + pitch + (style ? style : "") + (role ? role : "");
    let currData = voiceData[key];
    if (currData) {
      voiceIns.src = URL.createObjectURL(currData);
    } else {
      let mediaSource;
      if (supportMSE) {
        mediaSource = new MediaSource;
        voiceIns.src = URL.createObjectURL(mediaSource);
        await initStreamVoice(mediaSource);
        if (!sourceBuffer) {
          sourceBuffer = mediaSource.addSourceBuffer(voiceMIME);
        }
        sourceBuffer.onupdateend = function () {
          speechPushing = false;
          if (speechQuene.length) {
            let buf = speechQuene.shift();
            if (buf["end"]) {
              if (!sourceBuffer.buffered.length) notyf.open({ type: "warning", message: translations[locale]["cantSpeechTip"] });
              mediaSource.endOfStream();
            } else {
              speechPushing = true;
              sourceBuffer.appendBuffer(buf);
            }
          }
        };
        let bufArray = [];
        voiceSocket.onmessage = (e) => {
          if (e.data instanceof ArrayBuffer) {
            let buf = e.data.slice(voicePreLen);
            bufArray.push(buf);
            speechQuene.push(buf);
          } else if (e.data.indexOf("Path:turn.end") !== -1) {
            voiceSocket["pending"] = false;
            if (!(bufArray.length === 1 && bufArray[0].byteLength === 0)) voiceData[key] = new Blob(bufArray, { type: voiceMIME });
            if (!speechQuene.length && !speechPushing) {
              mediaSource.endOfStream();
            } else {
              let buf = new ArrayBuffer();
              buf["end"] = true;
              speechQuene.push(buf);
            }
          }
        }
      } else {
        await initSocket();
      }
      let currDate = getTime();
      let lang = voiceRole[type].lang;
      let uuid = uuidv4();
      if (existVoice === 3) {
        voiceSocket.send(getWSPre(currDate, uuid));
      }
      voiceSocket.send(getWSAudio(currDate, uuid));
      voiceSocket.send(getWSText(currDate, uuid, lang, voice, volume, rate, pitch, style, role, content));
      voiceSocket["pending"] = true;
      if (!supportMSE) {
        let blob = await NoMSEPending(key);
        if (blob.size === 0) notyf.open({ type: "warning", message: translations[locale]["cantSpeechTip"] });
        voiceIns.src = URL.createObjectURL(blob);
      }
    }
  } else {
    voiceIns = new SpeechSynthesisUtterance();
    voiceIns.voice = voiceRole[type];
    voiceIns.volume = volume;
    voiceIns.rate = rate;
    voiceIns.pitch = pitch;
    voiceIns.text = content;
  }
  await speakEvent(voiceIns);
  if (enableContVoice) {
    if (currentVoiceIdx !== data.length - 1) { return speechEvent(currentVoiceIdx + 1) }
    else { endSpeak() }
  }
};
let autoVoiceSocket;
let autoMediaSource;
let voiceContentQuene = [];
let voiceEndFlagQuene = [];
let voiceBlobURLQuene = [];
let autoOnlineVoiceFlag = false;
const confirmAction = (prompt) => {
  return true
};
let autoVoiceIdx = 0;
let autoVoiceDataIdx;
let refreshIdx;
let currentResEle;
let progressData = "";

/**
 * 设置指定轮次的回答
 * @param {string} resEncoded 
 * @param {number} round 
 */
const setCurrentResDev = (resEncoded,round = -1) => { 
try {
  

  let response = JSON.parse(decodeURIComponent(resEncoded))
  let content = response.response
  let funcHtml = ""
  let reasoningContent = ""
  if (response.funcResponse) {
    funcHtml = response.funcResponse
  }
  if (response.reasoningResponse && response.reasoningResponse.trim()) {
    reasoningContent = response.reasoningResponse
  }
  progressData = content
  if (!currentResEle) {
    let targetIndex = data.length - 1
    let targetRole = data[targetIndex].role
    if (round > -1) {
      let assistantIndice = []
      data.forEach((d,index)=>{
        if (d.role === "assistant") {
          assistantIndice.push(index)
        }
      })
      targetIndex = assistantIndice[round]
    }

    if (targetRole === "assistant") {
      currentResEle = chatlog.children[targetIndex];
      if (outOfMsgWindow(currentResEle)) messagesEle.scrollTo(0, currentResEle.offsetTop)
    } else if (!currentResEle) {
      currentResEle = createConvEle("response", true, modelVersion);
      // currentResEle.children[1].innerHTML = "<p class='cursorCls'><br /></p>";
      // setResContent(currentResEle,"<p class='cursorCls'><br /></p>",false)
      setResCursor(currentResEle,true)
      // currentResEle.getElementsByClassName("markdown-body")[0].innerHTML = "<p class='cursorCls'><br /></p>";
      currentResEle.dataset.loading = true;
      scrollToBottom();
    }
  }
  setResContent(currentResEle,content)
  if (funcHtml) {
    setFuncContent(currentResEle,funcHtml)
  }
  if (reasoningContent) {
    setReasoningContent(currentResEle,reasoningContent)
  }
  scrollToBottom();
} catch (error) {
  notyf.error("Error in setCurrentResDev: "+error.toString())
  copy(error.toString())
}
}

/**
 * 设置指定轮次的回答
 * @param {string} encodedText 
 * @param {number} round 
 */
const setCurrentRes = (encodedText,encodedFuncHtml,round = -1) => { 
  let content = decodeURIComponent(encodedText)
  let funcHtml = ""
  if (encodedFuncHtml) {
    funcHtml = decodeURIComponent(encodedFuncHtml)
  }
  progressData = content
  if (!currentResEle) {
    let targetIndex = data.length - 1
    let targetRole = data[targetIndex].role
    if (round > -1) {
      let assistantIndice = []
      data.forEach((d,index)=>{
        if (d.role === "assistant") {
          assistantIndice.push(index)
        }
      })
      targetIndex = assistantIndice[round]
    }

    if (targetRole === "assistant") {
      currentResEle = chatlog.children[targetIndex];
      if (outOfMsgWindow(currentResEle)) messagesEle.scrollTo(0, currentResEle.offsetTop)
    } else if (!currentResEle) {
        currentResEle = createConvEle("response", true, modelVersion);
      // currentResEle.children[1].innerHTML = "<p class='cursorCls'><br /></p>";
      // setResContent(currentResEle,"<p class='cursorCls'><br /></p>",false)
      setResCursor(currentResEle,true)
      // currentResEle.getElementsByClassName("markdown-body")[0].innerHTML = "<p class='cursorCls'><br /></p>";
      currentResEle.dataset.loading = true;
      scrollToBottom();
    }
  }
  setResContent(currentResEle,content)
  if (funcHtml) {
    setFuncContent(currentResEle,funcHtml)
  }
  scrollToBottom();
}
const prePareResponse = () => {
  let isRefresh = refreshIdx !== void 0;
  if (isRefresh) {
    currentResEle = chatlog.children[systemRole ? refreshIdx - 1 : refreshIdx];
    if (outOfMsgWindow(currentResEle)) messagesEle.scrollTo(0, currentResEle.offsetTop)
  } else if (!currentResEle) {
    currentResEle = createConvEle("response", true, modelVersion);
    setResCursor(currentResEle,true)
    // setResContent(currentResEle,"<p class='cursorCls'><br /></p>",false)
    // currentResEle.getElementsByClassName("markdown-body")[0].innerHTML = "<p class='cursorCls'><br /></p>";
    currentResEle.dataset.loading = true;
    scrollToBottom();
    if (outOfMsgWindow(currentResEle)) messagesEle.scrollTo(0, currentResEle.offsetTop)

  }
}
const streamGen = async (long) => {
  controller = new AbortController();
  controllerId = setTimeout(() => {
    notyf.error(translations[locale]["timeoutTip"]);
    stopLoading();
  }, 200000);
  let isRefresh = refreshIdx !== void 0;
  if (isRefresh) {
    currentResEle = chatlog.children[systemRole ? refreshIdx - 1 : refreshIdx];
    if (outOfMsgWindow(currentResEle)) messagesEle.scrollTo(0, currentResEle.offsetTop)
  } else if (!currentResEle) {
    currentResEle = createConvEle("response", true, modelVersion);
    setResCursor(currentResEle,true)
    // setResContent(currentResEle,"<p class='cursorCls'><br /></p>",false)
    // currentResEle.getElementsByClassName("markdown-body")[0].innerHTML = "<p class='cursorCls'><br /></p>";
    currentResEle.dataset.loading = true;
    scrollToBottom();
  }
  let idx = isRefresh ? refreshIdx : data.length;
  if (existVoice && enableAutoVoice && !long) {
    if (isRefresh) {
      endSpeak();
      autoVoiceDataIdx = currentVoiceIdx = idx;
    } else if (currentVoiceIdx !== data.length) {
      endSpeak();
      autoVoiceDataIdx = currentVoiceIdx = idx;
    }
  };
  try {
    let dataSlice;
    if (long) {
      idx = isRefresh ? refreshIdx : data.length - 1;
      dataSlice = [data[idx - 1], data[idx]];
      if (systemRole) dataSlice.unshift(data[0]);
    } else {
      let startIdx = idx > contLen ? idx - contLen - 1 : 0;
      dataSlice = data.slice(startIdx, idx);
      if (systemRole && startIdx > 0) dataSlice.unshift(data[0]);
    }
    dataSlice = dataSlice.map(item => {
      if (item.role === "assistant") return { role: item.role, content: item.content };
      else return item;
    })
    let headers = { "Content-Type": "application/json" };
    if (customAPIKey) headers["Authorization"] = "Bearer " + customAPIKey;
    console.log("model: " + modelVersion);

    const res = await fetch(apiHost + ((apiHost.length && !apiHost.endsWith("/")) ? "/" : "") + API_URL, {
      method: "POST",
      headers,
      body: JSON.stringify({
        messages: dataSlice,
        model: modelVersion,
        stream: true,
        temperature: roleTemp,
        top_p: roleNature
      }),
      signal: controller.signal
    });
    clearTimeout(controllerId);
    controllerId = void 0;
    if (res.status !== 200) {
      let errorText = "Error: " + res.status;
      switch (res.status) {
        case 401:
          errorText = translations[locale]["errorAiKeyTip"];
          break;
        case 400:
        case 413:
          errorText = translations[locale]["largeReqTip"];
          break;

        case 404:
          errorText = translations[locale]["noModelPerTip"];
          break;

        case 429:
          errorText = res.statusText ? translations[locale]["apiRateTip"] : translations[locale]["exceedLimitTip"];
          break;
        case 503:
          errorText = res.statusText;
          break;
        default:
          break;
      }
      notyf.error(errorText);
      setResContent(currentResEle,errorText)
      stopLoading();
      return;
    }
    const decoder = new TextDecoder();
    const reader = res.body.getReader();
    const readChunk = async () => {
      return reader.read().then(async ({ value, done }) => {
        if (!done) {
          value = decoder.decode(value);
          let chunks = value.match(/[^\n]+/g);
          if (!chunks) return readChunk();
          for (let i = 0; i < chunks.length; i++) {
            let chunk = chunks[i];
            if (chunk) {
              let payload;
              try {
                payload = JSON.parse(chunk.slice(5));
              } catch (e) {
                break;
              }
              if (!payload.choices.length) continue;
              if (payload.choices[0].finish_reason) {
                let lenStop = payload.choices[0].finish_reason === "length";
                let longReplyFlag = enableLongReply && lenStop;
                let ele = currentResEle.lastChild.children[0].children[0];
                if (!enableLongReply && lenStop) { ele.className = "halfRefReq optionItem"; ele.title = translations[locale]["continue"] }
                else { ele.className = "refreshReq optionItem"; ele.title = translations[locale]["refresh"] };
                break;
              } else {
                let content = payload.choices[0].delta.content;
                if (content) {
                  if (!progressData && !content.trim()) continue;
                  if (progressData) await delay();
                  progressData += content;
                  setResContent(currentResEle,progressData)
                  scrollToBottom();
                }
              }
            }
          }
          return readChunk();
        } else {
          if (isRefresh) {
            data[refreshIdx].content = progressData;
            if (longReplyFlag) return streamGen(true);
          } else {
            if (long) { data[data.length - 1].content = progressData }
            else { data.push({ role: "assistant", content: progressData, model: modelVersion }) }
            if (longReplyFlag) return streamGen(true);
          }
          stopLoading(false);
        }
      });
    };
    await readChunk();
  } catch (e) {
    if (e.message.indexOf("aborted") === -1) {
      notyf.error(translations[locale]["badEndpointTip"])
      stopLoading();
    }
  }
};
const loadAction = (bool) => {
  loading = bool;
  sendBtnEle.disabled = bool;
  sendBtnEle.className = bool ? " loading" : "loaded";
  stopEle.style.display = bool ? "flex" : "none";
  textInputEvent();
};
const updateChatPre = () => {
  console.log("updateChatPre");
  
  let ele = activeChatEle.children[1].children[1];
  let first = data.find(item => { return item.role === "assistant" });
  ele.textContent = (first && first.content)? first.content.slice(0, 30) : "";
  forceRepaint(ele.parentElement)
}
const stopLoading = (abort = true) => {
  stopEle.style.display = "none";
  // window.location.href = "chataction://stopLoading"
  setResCursor(currentResEle,false)

  // if (currentResEle.getElementsByClassName("markdown-body")[0].querySelector(".cursorCls")) setResContent(currentResEle,"<br />",false);
  if (abort) {
    // controller.abort();
    if (controllerId) clearTimeout(controllerId);
    if (delayId) clearTimeout(delayId);
    if (refreshIdx !== void 0) { data[refreshIdx].content = progressData }
    else if (data[data.length - 1].role === "assistant") { data[data.length - 1].content = progressData }
    else { data.push({ role: "assistant", content: progressData, model: modelVersion }) }
  }
  if (activeChatEle.children[1].children[1].textContent === "") updateChatPre();
  controllerId = delayId = refreshIdx = autoVoiceDataIdx = void 0;
  autoVoiceIdx = 0;
  currentResEle.dataset.loading = false;
  currentResEle = null;
  progressData = "";
  loadAction(false);
  postNotificataion("stopLoading")
};

const finish = (abort = true) => {
  stopEle.style.display = "none";
  // if (currentResEle.children[1].querySelector(".cursorCls")) currentResEle.children[1].innerHTML = "<br />";
  setResCursor(currentResEle,false)
  if (abort) {
    // controller.abort();
    if (controllerId) clearTimeout(controllerId);
    if (delayId) clearTimeout(delayId);
    if (refreshIdx !== void 0) { data[refreshIdx].content = progressData }
    else if (data[data.length - 1].role === "assistant") { data[data.length - 1].content = progressData }
    else { data.push({ role: "assistant", content: progressData, model: modelVersion }) }
  }
  if (activeChatEle.children[1].children[1].textContent === "") updateChatPre();
  controllerId = delayId = refreshIdx = autoVoiceDataIdx = void 0;
  autoVoiceIdx = 0;
  currentResEle.dataset.loading = false;
  currentResEle = null;
  progressData = "";
  chatsData[activeChatIdx].data = data
  loadAction(false);
  updateChats();
  // return getAllData()
};

const generateText = (message,imageBase64) => {
  loadAction(true);
  let requestEle;
  let isBottom = isContentBottom();//用于判断是否需要滚动
  let content = message.content
  if (editingIdx !== void 0) {//应该是重新编辑之后才调用这个
    let idx = editingIdx;
    let eleIdx = systemRole ? idx - 1 : idx;
    requestEle = chatlog.children[eleIdx];
    data[idx].content = content;
    resumeSend();
    if (idx !== data.length - 1) {
      // console.log("123");
      if (imageBase64) {
        setImageContent(requestEle,imageBase64)
      }
      setReqContent(requestEle,message);
      // requestEle.children[1].textContent = message;
      if (data[idx + 1].role !== "assistant") {
        if (currentVoiceIdx !== void 0) {
          if (currentVoiceIdx > idx) { currentVoiceIdx++ }
        }
        data.splice(idx + 1, 0, { role: "assistant", content: "", model: modelVersion });
        chatlog.insertBefore(createConvEle("response", false, modelVersion), chatlog.children[eleIdx + 1]);
      }
      chatlog.children[eleIdx + 1].children[1].innerHTML = "<p class='cursorCls'><br /></p>";
      chatlog.children[eleIdx + 1].dataset.loading = true;
      idx = idx + 1;
      data[idx].content = "";
      if (idx === currentVoiceIdx) { endSpeak() };
      refreshIdx = idx;
      prePareResponse()
      return;
    }
  } else {
    requestEle = createConvEle("request");//似乎代表用户请求的dom
    data.push(message)
    let textContent = getTextContent(message)
    if (textContent) {
      setReqContent(requestEle,textContent);
    }
    let imageContents = getImageContents(data.at(-1))
    if (imageContents.length) {
      imageContents.forEach(image=>{
        setImageContent(requestEle,image)
      })
    }
  }
  // requestEle.children[1].textContent = message;
  if (chatsData[activeChatIdx].name === translations[locale]["newChatName"]) {
    if (content.length > 20) content = content.slice(0, 17) + "...";
    chatsData[activeChatIdx].name = content;
    activeChatEle.children[1].children[0].textContent = content;
  }
  if (isBottom) messagesEle.scrollTo(0, messagesEle.scrollHeight);
  prePareResponse()
};
const genFunc = function () {
  clearAutoSendTimer();
  let message = inputAreaEle.value.trim();
  if (message.length !== 0 && noLoading()) {
    inputAreaEle.value = "";
    inputAreaEle.style.height = "47px";
    generateText(message);
  }
};
const sendMessage = function (encodedMessage,model) {
  document.getElementById("placeHolder").style.display = "none";
  let message = JSON.parse(decodeURIComponent(encodedMessage))
  clearAutoSendTimer();
  if (noLoading()) {
    generateText(message);
    if (model) {
      setCurrentModel(model)
    }
  }
  console.log("scrollToBottomLoad");
  
  scrollToBottomLoad()
  scrollToBottom()
};
const getCurrentHistory = () => {
  return data
}
const getAllData = (encode = true) => {
  let allData = {
    folder: folderData,
    chats: chatsData,
    chatIdxs : chatIdxs,
    activeChatIdx: activeChatIdx,
    avatar: userAvatar
  }
  mnMode = true
  if (encode) {
    return encodeURIComponent(JSON.stringify(allData))
  }else{
    return JSON.stringify(allData,undefined,2)
  }
}
const importAllData = (data) => {
  let allData = JSON.parse(decodeURIComponent(data))
  // console.log(allData);
  
  folderData = allData.folder
  chatsData = allData.chats
  chatIdxs = allData.chatIdxs
  activeChatIdx = allData.activeChatIdx
  mnMode = true
  initChatsFromData(allData)
  // console.log(chatsData[activeChatIdx].data);
  refreshChat(chatsData[activeChatIdx].data)
}
const setCurrentFuncIdxs = (encodedIdxs) => {
  let idxs = JSON.parse(decodeURIComponent(encodedIdxs))
  let currentChat = chatsData[activeChatIdx]
  currentChat.funcIdxs = idxs
  chatsData[activeChatIdx] = currentChat
  // let allData = {
  //   folder: folderData,
  //   chats: chatsData,
  //   chatIdxs : chatIdxs,
  //   activeChatIdx: activeChatIdx,
  //   avatar: userAvatar
  // }
  // return encodeURIComponent(JSON.stringify(allData))
}
const setCurrentModel = (encodedModel,encoded = true) => {
  let model = encodedModel
  if (encoded) {
    model = decodeURIComponent(encodedModel)
  }
  let currentChat = chatsData[activeChatIdx]
  currentChat.model = model
  chatsData[activeChatIdx] = currentChat
  // let allData = {
  //   folder: folderData,
  //   chats: chatsData,
  //   chatIdxs : chatIdxs,
  //   activeChatIdx: activeChatIdx,
  //   avatar: userAvatar
  // }
  // return encodeURIComponent(JSON.stringify(allData))
}
const setHistory = (encodedHistory,render = true) => {
  let history = JSON.parse(decodeURIComponent(encodedHistory))
  if (render) {
    //根据历史记录刷新
    refreshChat(history)
  }else{
    data = history
    if (history.length && history[0].role === "system") {
      if (!history[0].content) {
        data.shift();
      }
    }
    chatsData[activeChatIdx].data = data
  }
  mnMode = true
  //保存到本地存储
  // updateChats();
}
const refreshLatex = (ele = document.body)=>{
  try {
    MathJax.typesetPromise([ele])
  } catch (error) {
    
  }
}
const setDemoContent = ()=>{
  let history = [
    {
      role:"user",
      content:`# 这是一个标题

这是一些文本，包含一个数学公式：

$$
E = mc^2
$$

这是另一个行内公式 $a^2 + b^2 = c^2$。`
    }
  ]
  refreshChat(history)
}
const clearHistory = ()=>{
  if (editingIdx === void 0) {
    if (noLoading()) {
      if (systemRole) { data.length = 1 }
      else { data.length = 0 }
      chatlog.innerHTML = "";
      updateChatPre();
      updateChats();
    }
  } else {
    resumeSend();
  }
}
inputAreaEle.onkeydown = (e) => {
  if (e.keyCode === 13 && !e.shiftKey) {
    e.preventDefault();
    genFunc();
  }
};
//发送消息
sendBtnEle.onclick = genFunc;
stopEle.onclick = stopLoading;
//清空当前历史记录
clearEle.onclick = clearHistory;

document.addEventListener('dragstart', function (e) {
  // 如果拖动的是 <a> 标签本身，或者它的父元素是 <a>

  
  if (e.target.tagName.toLowerCase() === 'a' || e.target.closest('a')) {
    e.preventDefault(); // 阻止默认拖动行为
  }
  //禁止拖动头像
  let parentElement = e.target.parentElement
  if (parentElement.classList.contains('chatAvatar')) {
    e.preventDefault(); // 阻止默认拖动行为
  }
});