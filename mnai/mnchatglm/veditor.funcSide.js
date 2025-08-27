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
  return pageContents.join('\n\n')
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
  notyf.success("Text copied")
  window.location.href = "nativeCopy://content="+encodeURIComponent(text);
}
function copyReasoningContent(header) {
  event.stopPropagation()
  let collapsibleEle = document.getElementsByClassName("collapsible-content")[0]
  copyToClipboard(collapsibleEle.textContent)
  // console.log(collapsibleEle.textContent);
}
function notifyRefreshHeight() {
  console.log("notifyRefreshHeight");
  scrollToBottom()
  // window.location.href = "editorheight://content="+document.body.scrollHeight;
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