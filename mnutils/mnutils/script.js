// const plugins = [
//     {
//         name: "MN ChatAI",
//         version: "v1.17.1",
//         description: "https://flowus.cn/feliks/share/774c219d-32cc-4847-8f8f-6e26fc19841b?code=VT0JLU",
//         url:"https://123",
//         action:"Install"
//     },
//     {
//         name: "MN Editor",
//         version: "v1.0.0",
//         description: "https://bbs.marginnote.com.cn/t/topic/44639",
//         url:"https://123",
//         action:"Update"
//     },
//     // 你可以添加更多插件
// ];
function updateFromNative(encoded) {
try {
  pluginList.innerHTML = ""
  let text = decodeURIComponent(encoded)
  let plugins = JSON.parse(text)
  update(plugins)
} catch (error) {
  document.body.innerText = error.toString()
}
}
function update(plugins) {
  try {
    plugins.forEach((plugin, index) => {
        const li = document.createElement("li");
        li.style.display = "flex";
        li.style.alignItems = "stretch";
        li.style.gap = "5px";
        li.style.marginTop = "10px";
        li.style.paddingBottom = "10px";


        // 添加logo容器
        const logoContainer = document.createElement("div");
        logoContainer.style.width = "30px";
        logoContainer.style.flexShrink = "0";
        logoContainer.style.display = "flex";
        logoContainer.style.alignItems = "center";
        logoContainer.style.justifyContent = "center";
        logoContainer.style.padding = "0px 0";

        // 创建logo图片元素
        const logoImg = document.createElement("img");
        logoImg.style.width = "100%";
        logoImg.style.height = "100%";
        logoImg.style.objectFit = "contain";
        logoImg.style.borderRadius = "5px";
        logoContainer.appendChild(logoImg);

        // 创建右侧内容容器
        const contentContainer = document.createElement("div");
        contentContainer.style.flex = "1";
        contentContainer.style.display = "flex";
        contentContainer.style.flexDirection = "column";
        contentContainer.style.gap = "4px";

        const pluginInfo = document.createElement("div");
        pluginInfo.style.display = "flex";
        pluginInfo.style.flexDirection = "column";
        pluginInfo.style.gap = "4px";

        const nameContainer = document.createElement("div");
        nameContainer.style.display = "flex";
        nameContainer.style.flexWrap = "wrap";
        nameContainer.style.gap = "8px";
        nameContainer.style.alignItems = "center";

        const pluginName = document.createElement("span");
        pluginName.textContent = plugin.name;
        pluginName.style.flex = "1";
        pluginName.style.minWidth = "200px";

        const bottomContainer = document.createElement("div");
        bottomContainer.style.display = "flex";
        bottomContainer.style.justifyContent = "space-between";
        bottomContainer.style.alignItems = "center";
        bottomContainer.style.height = "20px";

        const installBtn = document.createElement("button");
        installBtn.style.flexShrink = "0";
        installBtn.style.marginTop = "0px";
        switch (plugin.action) {
          case "reinstall":
            logoImg.src = plugin.logo || "https://vip.123pan.cn/1836303614/dl/icon/addon.png";
            installBtn.textContent = "Install";
            installBtn.className = "reinstall-btn";
            installBtn.addEventListener("click", (event) => {
                event.stopPropagation(); // 阻止点击事件冒泡到 li
                window.location.href = `mnaddon://action=reinstall?id=${plugin.id}?version=${plugin.version}`
            });
            break;
          case "install":
            logoImg.src = plugin.logo || "https://vip.123pan.cn/1836303614/dl/icon/addon.png";
            installBtn.textContent = "Install";
            installBtn.className = "install-btn";
            installBtn.addEventListener("click", (event) => {
                event.stopPropagation(); // 阻止点击事件冒泡到 li
                window.location.href = `mnaddon://action=install?id=${plugin.id}?version=${plugin.version}`
            });
            break;
          case "update":
            logoImg.src = plugin.logo || "https://vip.123pan.cn/1836303614/dl/icon/addon.png";
            installBtn.textContent = "Update";
            installBtn.className = "update-btn";
            installBtn.addEventListener("click", (event) => {
                event.stopPropagation(); // 阻止点击事件冒泡到 li
                window.location.href = `mnaddon://action=update?id=${plugin.id}?version=${plugin.version}`
            });
            break;
          case "importNotebook":
            logoImg.src = plugin.logo || "https://vip.123pan.cn/1836303614/dl/icon/notebook.png";
            installBtn.textContent = "Import";
            installBtn.className = "import-btn";
            installBtn.addEventListener("click", (event) => {
                event.stopPropagation(); // 阻止点击事件冒泡到 li
                window.location.href = `mnaddon://action=importNotebook?id=${plugin.id}?version=${plugin.version}`
            });
            break;
          case "importDocument":
            logoImg.src = plugin.logo || "https://vip.123pan.cn/1836303614/dl/icon/pdf.png";
            installBtn.textContent = "Import";
            installBtn.className = "import-btn";
            installBtn.addEventListener("click", (event) => {
                event.stopPropagation(); // 阻止点击事件冒泡到 li
                window.location.href = `mnaddon://action=importDocument?id=${plugin.id}?version=${plugin.version}`
            });
            break;
          default:
            break;
        }

        const pluginVersion = document.createElement("div");
        pluginVersion.className = "version";
        if (plugin.version) {
          pluginVersion.textContent = `${plugin.author} | ${plugin.version}`;
        } else {
          pluginVersion.textContent = `${plugin.author}`;
        }
        pluginVersion.style.fontSize = "0.6em";
        pluginVersion.style.color = "#666";

        nameContainer.appendChild(pluginName);
        bottomContainer.appendChild(pluginVersion);
        bottomContainer.appendChild(installBtn);

        pluginInfo.appendChild(nameContainer);
        pluginInfo.appendChild(bottomContainer);

        contentContainer.appendChild(pluginInfo);

        li.appendChild(logoContainer);
        li.appendChild(contentContainer);

        li.addEventListener("click", async() => {
          // window.location.href = plugin.description
          window.location.href = `mnaddon://action=showDescription?id=${plugin.id}`
          // let ele = document.getElementById(plugin.id)
          // let mnaddon = document.getElementById("mnaddon")
          // if (mnaddon) {
          //   pluginDetails.innerHTML = ""
          // }
          // if (!ele) {
          //   if (/mnaddon\.craft\.me/.test(plugin.description)) {
          //     pluginDetails.innerHTML = (pluginDetails.innerHTML)+`<iframe id="${plugin.id}" src="${plugin.description}" frameborder="0"></iframe>`
          //   }else{
          //     pluginDetails.innerHTML = (pluginDetails.innerHTML)+`<div id="${plugin.id}">${marked.parse(plugin.description)}</div>`
          //   }
          // }
          // plugins.forEach((p)=>{
          //   let ele = document.getElementById(p.id)
          //   if (ele) {
          //     ele.style.display = (p.id === plugin.id) ? "block" :"none"
          //   }
          // })
          // let res = await fetch(plugin.description+"?timestamp="+Date.now())
          // let des = await res.text()
          // console.log(des);
            // pluginDetails.innerHTML = marked.parse(des);
            // pluginDetails.innerHTML = `<iframe src="${plugin.description}" frameborder="0"></iframe>`
            // pluginDetails.innerHTML = '<iframe src="https://www.baidu.com" frameborder="0"></iframe>'
        });
        pluginList.appendChild(li);
    });
  } catch (error) {
    document.body.innerText = error.toString()
  }
}
const pluginList = document.getElementById("plugin-list");
// let plugins = [
//     {
//         "name": "CET4 6月真题",
//         "version": "",
//         "fileName":"CET4_6月.pdf",
//         "author": "MarginNote",
//         "id":"25851337bb7cedb8f092c1866cdb9ce9747e28e8012e96a71e14dea8043de2b4",
//         "description": "https://www.123912.com/Weboffice/?id=18037998&shareKey=4P6pTd-yIgT3&sharePwd=&type=f&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/DA7D63B1-5006-41DD-B4DE-65057B022DD2_2/yHqfTgzU6KQ15yjpjKMLsvLDPxyIxRt37Ua0HCUAMpgz/CET4_6.pdf",
//         "url":"https://vip.123pan.cn/1836303614/dl/docs/CET4_6月.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-yIgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "CET4 12月真题",
//         "version": "",
//         "fileName":"CET4_12月.pdf",
//         "author": "MarginNote",
//         "id":"3877feac6ccd33cdcca004e8d77500fc4bea8217304d36554ef192f589d5fd8e",
//         "description": "https://www.123912.com/Weboffice/?id=18037997&shareKey=4P6pTd-yIgT3&sharePwd=&type=f&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/27E7690F-308E-4F90-AC5B-EE67FC848284_2/iSSO6spucCA6ekla1Lf8W17cTJA8u8oVLhoD1HI65ukz/CET4_12.pdf",
//         "url":"https://vip.123pan.cn/1836303614/dl/docs/CET4_12月.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-yIgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "CET6 6月真题",
//         "version": "",
//         "fileName":"CET6_6月.pdf",
//         "author": "MarginNote",
//         "id":"9dc4f8f4c665b53b3dd5706d5fb7600692868c6ca5db93de5df5145f5eaaa3a6",
//         "description": "https://www.123912.com/Weboffice/?id=18037999&shareKey=4P6pTd-yIgT3&sharePwd=&type=f&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/8DF4419E-1D74-489B-A43B-29F4520CFF56_2/0LsppNMnNcnrxqjaWXD4tFxArUwhMh6q0TQxuKybk8Qz/CET6_6.pdf",
//         "url":"https://vip.123pan.cn/1836303614/dl/docs/CET6_6月.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-yIgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "CET6 12月真题",
//         "version": "",
//         "fileName":"CET6_12月.pdf",
//         "author": "MarginNote",
//         "id":"a155e9f22e1076fb2c25ef1c36df48d08af4976f057675854ced81edaccc8d19",
//         "description": "https://www.123912.com/Weboffice/?id=18038000&shareKey=4P6pTd-yIgT3&sharePwd=&type=f&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/28799FFD-94A6-4D73-ACBA-538DE5A7790D_2/7c7Yzd42npuJ1US9DEEimlX8CChyUtOxExlbLwsKphcz/CET6_12.pdf",
//         "url":"https://vip.123pan.cn/1836303614/dl/docs/CET6_12月.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-yIgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "高等数学（第七版上）",
//         "version": "",
//         "logo":"https://vip.123pan.cn/1836303614/dl/icon/gdsx7s.png",
//         "fileName":"高等数学（同济第七版上）.pdf",
//         "author": "同济大学",
//         "id":"doc0",
//         "description": "https://www.123912.com/Weboffice/?type=f&id=18050814&FileName=%E9%AB%98%E7%AD%89%E6%95%B0%E5%AD%A6%EF%BC%88%E5%90%8C%E6%B5%8E%E7%AC%AC%E4%B8%83%E7%89%88%E4%B8%8A%EF%BC%89.pdf&Size=56592978&Etag=b2b86e9128d33935eacc102c45d988fc&S3KeyFlag=1775043-0&CreateAt=1749133726&UpdateAt=1749133726&from=2&shareKey=4P6pTd-xMgT3&sharePwd=&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://vip.123pan.cn/1836303614/dl/docs/高等数学（同济第七版上）.pdf",
//         "url":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/9522608C-0298-49A4-BBD7-DF89F5B0EC12_2/SzCrhWxCJ2KZlad0ZOH0tL2Q10zjR2U0tguOHQyCV28z/9522608C-0298-49A4-BBD7-DF89F5B0EC12_2.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-xMgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "高等数学（第七版下）",
//         "version": "",
//         "fileName":"高等数学（同济第七版下）.pdf",
//         "author": "同济大学",
//         "id":"doc1",
//         "description": "https://www.123912.com/Weboffice/?type=f&id=18054804&FileName=%E9%AB%98%E7%AD%89%E6%95%B0%E5%AD%A6%EF%BC%88%E5%90%8C%E6%B5%8E%E7%AC%AC%E4%B8%83%E7%89%88%E4%B8%8B%EF%BC%89.pdf&Size=49494990&Etag=bbe8afefa6ff8147ec360332766752b3&S3KeyFlag=1831179013-0&CreateAt=1749134012&UpdateAt=1749140784&from=2&shareKey=4P6pTd-xMgT3&sharePwd=&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://vip.123pan.cn/1836303614/dl/docs/高等数学（同济第七版下）.pdf",
//         "url":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/3FCAACBC-F36C-4945-8B57-DBDD0A226DD6_2/fm2PiplnczlaXgo2ZsFFGdKBlyhOMLYNGm5ygYdYI9oz/3FCAACBC-F36C-4945-8B57-DBDD0A226DD6_2.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-xMgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "高等数学习题全解（第七版上）",
//         "version": "",
//         "fileName":"高等数学习题全解（同济第七版上）.pdf",
//         "author": "同济大学",
//         "id":"doc2",
//         "description": "https://www.123912.com/Weboffice/?type=f&id=18050815&FileName=%E9%AB%98%E7%AD%89%E6%95%B0%E5%AD%A6%E4%B9%A0%E9%A2%98%E5%85%A8%E8%A7%A3%E6%8C%87%E5%8D%97%EF%BC%88%E5%90%8C%E6%B5%8E%E7%AC%AC%E4%B8%83%E7%89%88%E4%B8%8A%EF%BC%89.pdf&Size=43040774&Etag=2f38fbe7fdc4735c6854bd9323500409&S3KeyFlag=1625778-0&CreateAt=1749133726&UpdateAt=1749139288&from=2&shareKey=4P6pTd-xMgT3&sharePwd=&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://vip.123pan.cn/1836303614/dl/docs/高等数学习题全解指南（同济第七版上）.pdf",
//         "url":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/9DBFA955-042B-43FE-84F2-48812B090525_2/801I30cCGU26TyOqzuXSupzInhQJyyWkBZOQqzNPn48z/7.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-xMgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "高等数学习题全解（第七版下）",
//         "version": "",
//         "fileName":"高等数学习题全解（同济第七版下）.pdf",
//         "author": "同济大学",
//         "id":"doc3",
//         "description": "https://www.123912.com/Weboffice/?type=f&id=18054805&FileName=%E9%AB%98%E7%AD%89%E6%95%B0%E5%AD%A6%E4%B9%A0%E9%A2%98%E5%85%A8%E8%A7%A3%E6%8C%87%E5%8D%97%EF%BC%88%E5%90%8C%E6%B5%8E%E7%AC%AC%E4%B8%83%E7%89%88%E4%B8%8B%EF%BC%89.pdf&Size=46971537&Etag=b590217077199cb0bfa9354f65791999&S3KeyFlag=1625778-0&CreateAt=1749134012&UpdateAt=1749139302&from=2&shareKey=4P6pTd-xMgT3&sharePwd=&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://vip.123pan.cn/1836303614/dl/docs/高等数学习题全解指南（同济第七版下）.pdf",
//         "url":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/C9231174-8238-4FF1-BA33-F608D06C4E2C_2/IVs6m00rbssRyvORE41DO2me1x4cW6wPOiJWG1jzGWsz/7.pdf.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-xMgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "高等数学（第八版上）",
//         "version": "",
//         "fileName":"高等数学（同济第八版上）.pdf",
//         "author": "同济大学",
//         "id":"doc4",
//         "description": "https://www.123912.com/Weboffice/?type=f&id=18066988&FileName=%E9%AB%98%E7%AD%89%E6%95%B0%E5%AD%A6%EF%BC%88%E5%90%8C%E6%B5%8E%E7%AC%AC%E5%85%AB%E7%89%88%E4%B8%8A%EF%BC%89.pdf&Size=83629774&Etag=449ce80c08009500ec841d7f735ebf89&S3KeyFlag=1813990981-0&CreateAt=1749139258&UpdateAt=1749139258&from=2&shareKey=4P6pTd-xMgT3&sharePwd=&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://vip.123pan.cn/1836303614/dl/docs/高等数学（同济第八版上）.pdf",
//         "url":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/6503A9E1-9480-473E-B02C-BD042C8EB0F2_2/NGG6agqdzxMEQ8awOuCDfyJ4Tzdm39xGDvYWv3Ug9loz/%20%20%20.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-xMgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "高等数学（第八版下）",
//         "version": "",
//         "fileName":"高等数学（同济第八版下）.pdf",
//         "author": "同济大学",
//         "id":"doc5",
//         "description": "https://www.123912.com/Weboffice/?type=f&id=18066987&FileName=%E9%AB%98%E7%AD%89%E6%95%B0%E5%AD%A6%EF%BC%88%E5%90%8C%E6%B5%8E%E7%AC%AC%E5%85%AB%E7%89%88%E4%B8%8B%EF%BC%89.pdf&Size=73704961&Etag=d0063004f0afd8d59455954d5e741f0d&S3KeyFlag=1813990981-0&CreateAt=1749139258&UpdateAt=1749139258&from=2&shareKey=4P6pTd-xMgT3&sharePwd=&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://vip.123pan.cn/1836303614/dl/docs/高等数学（同济第八版下）.pdf",
//         "url":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/A1462586-6ECE-4D85-9D9B-4CD12C95B31E_2/MvvCpJrbsCTRIZ57oorhWePFQxd9oy910Pi1BAK1hvsz/%20%20%20.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-xMgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "高等数学习题全解（第八版上）",
//         "version": "",
//         "fileName":"高等数学习题全解（同济第八版上）.pdf",
//         "author": "同济大学",
//         "id":"doc6",
//         "description": "https://www.123912.com/s/4P6pTd-xMgT3",
//         "customUrl":true,
//         "backupUrl":"https://vip.123pan.cn/1836303614/dl/docs/高等数学习题全解指导（同济第八版上）.pdf",
//         "url":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/D1299BBC-35E4-43A8-B492-EFB813A27EE4_2/TIrAILrcpAuvYPjLNLZ4N8yuVBmP7TLUAB8XdGRrz4oz/D1299BBC-35E4-43A8-B492-EFB813A27EE4_2.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-xMgT3",
//         "action":"importDocument"
//     },  
//     {
//         "name": "高等数学习题全解（第八版下）",
//         "version": "",
//         "fileName":"高等数学习题全解（同济第八版下）.pdf",
//         "author": "同济大学",
//         "id":"doc7",
//         "description": "https://www.123912.com/s/4P6pTd-xMgT3",
//         "customUrl":true,
//         "backupUrl":"https://vip.123pan.cn/1836303614/dl/docs/高等数学习题全解指导（同济第八版下）.pdf",
//         "url":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/37438EE0-C90C-463A-812A-8D700DCC7D38_2/fX6lg7jcD3dC1cx2ie3QdFdifsHplH6LnnARVONrEZ0z/8.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-xMgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "线性代数（第七版）",
//         "version": "",
//         "fileName":"线性代数（第七版）.pdf",
//         "author": "同济大学",
//         "id":"doc8",
//         "description": "https://www.123912.com/Weboffice/?CreateAt=1749186877&Etag=c2f9b103a5d9573b7e85d015ef3a886f&FileName=%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0%EF%BC%88%E5%90%8C%E6%B5%8E%E7%AC%AC%E4%B8%83%E7%89%88%EF%BC%89+.pdf&S3KeyFlag=1817172079-0&Size=56523832&UpdateAt=1749186992&from=2&id=18072799&shareKey=4P6pTd-DMgT3&sharePwd=&type=f&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/6C6C9262-5ECF-415B-86BB-27FA2C9AB103_2/xrwo3qoKW8NOCry5Q5JzQJyQzEF9hkri27cPM3bXGMMz/%20.pdf",
//         "url":"https://vip.123pan.cn/1836303614/dl/docs/线性代数（同济第七版） .pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-DMgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "线性代数习题全解（第七版）",
//         "version": "",
//         "fileName":"线性代数习题全解（第七版）.pdf",
//         "author": "同济大学",
//         "id":"doc9",
//         "description": "https://www.123912.com/Weboffice/?CreateAt=1749186877&Etag=58db13dbc76f6ac6add10eea70706dfc&FileName=%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0%E5%AD%A6%E4%B9%A0%E8%BE%85%E5%AF%BC%E4%B8%8E%E4%B9%A0%E9%A2%98%E5%85%A8%E8%A7%A3%EF%BC%88%E5%90%8C%E6%B5%8E%E7%AC%AC%E4%B8%83%E7%89%88%EF%BC%89.pdf&S3KeyFlag=1784790-0&Size=60344607&UpdateAt=1749186877&from=2&id=18072798&shareKey=4P6pTd-DMgT3&sharePwd=&type=f&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/44AC931D-10FF-4438-97DB-39FC20CBDD9E_2/ABMPSxUgiW2omchuvfjJ8I7QCRkBHz7x8C0wQENQUscz/44AC931D-10FF-4438-97DB-39FC20CBDD9E_2.pdf",
//         "url":"https://vip.123pan.cn/1836303614/dl/docs/线性代数学习辅导与习题全解（同济第七版）.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-DMgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "Harry Potter and the Sorcerer's Stone",
//         "version": "",
//         "fileName":"Harry Potter and the Sorcerer's Stone.pdf",
//         "author": "J.K. Rowling",
//         "id":"b90a4cf398bdb95541df31db3e3f6a96a61dafd7be28f76c2335a67300e25412",
//         "description": "https://www.123912.com/Weboffice/?type=f&id=18066855&FileName=Harry%20Potter%20and%20the%20Sorcerer%E2%80%98s%20Stone.pdf&Size=4190274&Etag=428f724f136fd36d075bc21244c38a69&S3KeyFlag=1836303614-0&CreateAt=1749136125&UpdateAt=1749139657&from=2&shareKey=4P6pTd-4MgT3&sharePwd=&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/733D25A5-714C-4972-AE78-3FC33E898E78_2/CpcSoZyCcujKjFgZCqyzkysSPVg12L98XfnR5setQt8z/Harry%20Potter%20and%20the%20Sorcerers%20Stone.pdf",
//         "url":"https://vip.123pan.cn/1836303614/dl/docs/Harry Potter and the Sorcerer's Stone.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-4MgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "Harry Potter and the Chamber of Secrets",
//         "version": "",
//         "fileName":"Harry Potter and the Chamber of Secrets.pdf",
//         "author": "J.K. Rowling",
//         "id":"435085d19ddac5662887d3c9e14c824a2b731ed1f32ce1a51d9e413066f648da",
//         "description": "https://www.123912.com/Weboffice/?type=f&id=18066854&FileName=Harry%20Potter%20and%20the%20Chamber%20of%20Secrets.pdf&Size=4511100&Etag=d1431ab1c8a5a23297b79466be59c149&S3KeyFlag=1836303614-0&CreateAt=1749136121&UpdateAt=1749139616&from=2&shareKey=4P6pTd-4MgT3&sharePwd=&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/71A968AD-F3E5-4EC5-B6DE-BF1B95446999_2/tjnAxgCgWiUZ0kesX2Cu4M6B1uJ9L6ocBdWzZB47aAsz/Harry%20Potter%20and%20the%20Chamber%20of%20Secrets.pdf",
//         "url":"https://vip.123pan.cn/1836303614/dl/docs/Harry Potter and the Chamber of Secrets.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-4MgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "Harry Potter and the Prisoner of Azkaban",
//         "version": "",
//         "fileName":"Harry Potter and the Prisoner of Azkaban.pdf",
//         "author": "J.K. Rowling",
//         "id":"90a26a9ba0e18323e6c5b546ca611f5af703af072560dfd92a2987ff548b25f1",
//         "description": "https://www.123912.com/Weboffice/?type=f&id=18066852&FileName=Harry%20Potter%20and%20the%20Prisoner%20of%20Azkaban.pdf&Size=5764756&Etag=ac7958d3264eb486a77ab6daedb1356b&S3KeyFlag=1836303614-0&CreateAt=1749136118&UpdateAt=1749139657&from=2&shareKey=4P6pTd-4MgT3&sharePwd=&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/BC03CFED-A715-4DFE-8441-BF50B42618F2_2/8B3GzDCyHXyRRD8amrgwVhqaT7mAxuFX4lAf9jixZKwz/Harry%20Potter%20and%20the%20Prisoner%20of%20Azkaban.pdf",
//         "url":"https://vip.123pan.cn/1836303614/dl/docs/Harry Potter and the Prisoner of Azkaban.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-4MgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "Harry Potter and the Goblet of Fire",
//         "version": "",
//         "fileName":"Harry Potter and the Goblet of Fire.pdf",
//         "author": "J.K. Rowling",
//         "id":"5d9bb56eed927b25c812fec102ac226eef242ea06b86b2f50f52a30d642027f7",
//         "description": "https://www.123912.com/Weboffice/?type=f&id=18066853&FileName=Harry%20Potter%20and%20the%20Goblet%20of%20Fire.pdf&Size=8234199&Etag=035fc3ffc6a4f8fda29d5c74a944a60f&S3KeyFlag=1836303614-0&CreateAt=1749136120&UpdateAt=1749139657&from=2&shareKey=4P6pTd-4MgT3&sharePwd=&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/8528225E-6B78-48CF-84F5-45C30FB89A0C_2/SQYtMA55aoPgEuedt75gDlkBfm2YuxTwVHmgayppft8z/Harry%20Potter%20and%20the%20Goblet%20of%20Fire.pdf",
//         "url":"https://vip.123pan.cn/1836303614/dl/docs/Harry Potter and the Goblet of Fire.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-4MgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "Harry Potter and the Order of the Phoenix",
//         "version": "",
//         "fileName":"Harry Potter and the Order of the Phoenix.pdf",
//         "author": "J.K. Rowling",
//         "id":"63fdd89c9f9eec20db18ee66bd27c6716f3479d77038fb73aa7125d3a76578fc",
//         "description": "https://www.123912.com/Weboffice/?type=f&id=18066849&FileName=Harry%20Potter%20and%20the%20Order%20of%20the%20Phoenix.pdf&Size=6532180&Etag=9acc274fb88b41dcee9bd0a848177a98&S3KeyFlag=1836303614-0&CreateAt=1749136099&UpdateAt=1749139657&from=2&shareKey=4P6pTd-4MgT3&sharePwd=&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/BCB9E6CA-2639-4384-8304-26144E2B44FF_2/JDK3K9oVA21gvOp4H76mX5VU0QMZ0xZfACbmnc48rrkz/Harry%20Potter%20and%20the%20Order%20of%20the%20Phoenix.pdf",
//         "url":"https://vip.123pan.cn/1836303614/dl/docs/Harry Potter and the Order of the Phoenix.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-4MgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "Harry Potter and the Half-Blood Prince",
//         "version": "",
//         "fileName":"Harry Potter and the Half-Blood Prince.pdf",
//         "author": "J.K. Rowling",
//         "id":"6a3a20d246d4706ace4174d1ec960567a79b7b30a3a11aab9931be7cec378c64",
//         "description": "https://www.123912.com/Weboffice/?type=f&id=18066850&FileName=Harry%20Potter%20and%20the%20Half-Blood%20Prince.pdf&Size=7027928&Etag=adf2484905f9872ced9222b7a44e0420&S3KeyFlag=1836303614-0&CreateAt=1749136099&UpdateAt=1749139657&from=2&shareKey=4P6pTd-4MgT3&sharePwd=&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/69D30785-E764-4ABA-8DC9-3EF002FD9754_2/WMmgp96NP5hsEEhpO8X1ZnM9DxU8ymKMDS1F06bX48gz/Harry%20Potter%20and%20the%20Half-Blood%20Prince.pdf",
//         "url":"https://vip.123pan.cn/1836303614/dl/docs/Harry Potter and the Half-Blood Prince.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-4MgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "Harry Potter and the Deathly Hallows",
//         "version": "",
//         "fileName":"Harry Potter and the Deathly Hallows.pdf",
//         "author": "J.K. Rowling",
//         "id":"9a888b0f2b56ed62590b5f543483ade3c6a350ca9fcc86e50ede0a387df60538",
//         "description": "https://www.123912.com/Weboffice/?type=f&id=18066851&FileName=Harry%20Potter%20and%20the%20Deathly%20Hallows.pdf&Size=8045090&Etag=330b1288e156346614b80f23e72165bc&S3KeyFlag=1836303614-0&CreateAt=1749136111&UpdateAt=1749139657&from=2&shareKey=4P6pTd-4MgT3&sharePwd=&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/9326704C-AE49-4D64-8B9B-C56AC2EE9A3A_2/vS88RrnYo6SyZ9IW9Iso4cM0sslFjxyXnSK3v0h6B0Uz/Harry%20Potter%20and%20the%20Deathly%20Hallows.pdf",
//         "url":"https://vip.123pan.cn/1836303614/dl/docs/Harry Potter and the Deathly Hallows.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-4MgT3",
//         "action":"importDocument"
//     },
//     {
//         "name": "白夜行",
//         "version": "",
//         "fileName":"白夜行.pdf",
//         "author": "东野圭吾",
//         "id":"doc10",
//         "description": "https://www.123912.com/Weboffice/?type=f&id=18072763&FileName=%E7%99%BD%E5%A4%9C%E8%A1%8C.pdf&Size=10430559&Etag=b3c4fa836521371415a5d655cf6d9b36&S3KeyFlag=1836303614-0&CreateAt=1749185576&UpdateAt=1749186653&from=2&shareKey=4P6pTd-RMgT3&sharePwd=&uid=1836303614",
//         "customUrl":true,
//         "backupUrl":"https://res.craft.do/user/full/d01d3557-bed1-4af3-4d79-844eeea93999/doc/4D9A23C4-FDD7-40EF-A23F-58C23DF4F6F7/5CEF080F-DA49-4C9B-A95C-C25C1D37BB36_2/9yVRQpGV008sxMmjAhQ7aOEiZlRMoVtMQaDoOH7Mkw4z/5CEF080F-DA49-4C9B-A95C-C25C1D37BB36_2.pdf",
//         "url":"https://vip.123pan.cn/1836303614/dl/docs/%E7%99%BD%E5%A4%9C%E8%A1%8C.pdf",
//         "shareUrl":"https://www.123912.com/s/4P6pTd-RMgT3",
//         "action":"importDocument"
//     }
// ]
// update(plugins)
