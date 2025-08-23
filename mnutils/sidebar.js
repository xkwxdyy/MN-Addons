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
  let text = decodeURIComponent(encoded)
  let plugins = JSON.parse(text)
  setPlugins(plugins)
} catch (error) {
  document.body.innerText = error.toString()
}
}
function update(plugins) {
  try {
    if (!pluginList) return
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
        nameContainer.style.overflow = "scroll";
        nameContainer.style.whiteSpace = "nowrap";
        nameContainer.style.width = "calc(100vw - 50px)";

        const pluginName = document.createElement("span");
        pluginName.textContent = plugin.name;
        pluginName.style.flex = "1";
        pluginName.style.minWidth = "200px";

        const bottomContainer = document.createElement("div");
        bottomContainer.style.display = "flex";
        bottomContainer.style.justifyContent = "space-between";
        bottomContainer.style.alignItems = "center";
        bottomContainer.style.height = "20px";
        bottomContainer.style.width = "calc(100vw - 50px)";
          

        const installBtn = document.createElement("button");
        installBtn.style.flexShrink = "0";
        installBtn.style.marginTop = "0px";
        switch (plugin.action) {
          case "None":
            logoImg.src = plugin.logo || "https://vip.123pan.cn/1836303614/dl/icon/web.png";
            installBtn.style.display = "none";
            break;
          case "reinstall":
            logoImg.src = plugin.logo || "https://vip.123pan.cn/1836303614/dl/icon/addon.png";
            installBtn.textContent = "Install";
            installBtn.className = "reinstall-btn";
            installBtn.addEventListener("click", (event) => {
                event.stopPropagation(); // 阻止点击事件冒泡到 li
                postMessageToAddon("mnaddonAction", "reinstall", {id:plugin.id,version:plugin.version})
                // window.location.href = `mnaddon://action=reinstall?id=${plugin.id}?version=${plugin.version}`
            });
            break;
          case "install":
            logoImg.src = plugin.logo || "https://vip.123pan.cn/1836303614/dl/icon/addon.png";
            installBtn.textContent = "Install";
            installBtn.className = "install-btn";
            installBtn.addEventListener("click", (event) => {
                event.stopPropagation(); // 阻止点击事件冒泡到 li
                postMessageToAddon("mnaddonAction", "install", {id:plugin.id,version:plugin.version})
                // window.location.href = `mnaddon://action=install?id=${plugin.id}?version=${plugin.version}`
            });
            break;
          case "update":
            logoImg.src = plugin.logo || "https://vip.123pan.cn/1836303614/dl/icon/addon.png";
            installBtn.textContent = "Update";
            installBtn.className = "update-btn";
            installBtn.addEventListener("click", (event) => {
                event.stopPropagation(); // 阻止点击事件冒泡到 li
                postMessageToAddon("mnaddonAction", "update", {id:plugin.id,version:plugin.version})
                // window.location.href = `mnaddon://action=update?id=${plugin.id}?version=${plugin.version}`
            });
            break;
          case "importNotebook":
            logoImg.src = plugin.logo || "https://vip.123pan.cn/1836303614/dl/icon/notebook.png";
            installBtn.textContent = "Import";
            installBtn.className = "import-btn";
            installBtn.addEventListener("click", (event) => {
                event.stopPropagation(); // 阻止点击事件冒泡到 li
                postMessageToAddon("mnaddonAction", "importNotebook", {id:plugin.id,version:plugin.version})
                // window.location.href = `mnaddon://action=importNotebook?id=${plugin.id}?version=${plugin.version}`
            });
            break;
          case "importDocument":
            logoImg.src = plugin.logo || "https://vip.123pan.cn/1836303614/dl/icon/pdf.png";
            installBtn.textContent = "Import";
            installBtn.className = "import-btn";
            installBtn.addEventListener("click", (event) => {
                event.stopPropagation(); // 阻止点击事件冒泡到 li
                postMessageToAddon("mnaddonAction", "importDocument", {id:plugin.id,version:plugin.version})
                // window.location.href = `mnaddon://action=importDocument?id=${plugin.id}?version=${plugin.version}`
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
        if (plugin.action !== "None") {
          bottomContainer.appendChild(installBtn);
        }

        pluginInfo.appendChild(nameContainer);
        pluginInfo.appendChild(bottomContainer);
        contentContainer.appendChild(pluginInfo);

        li.appendChild(logoContainer);
        li.appendChild(contentContainer);

        li.addEventListener("click", async() => {
          // window.location.href = plugin.description
          postMessageToAddon("mnaddonAction", "showDescription", {id:plugin.id})

          // window.location.href = `mnaddon://action=showDescription?id=${plugin.id}`
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
const tagsBar = document.getElementById("tags-bar");
let allPlugins = []
let selectedTags = new Set()

// 如果宿主环境未注入 postMessageToAddon，提供空实现以避免报错
// eslint-disable-next-line no-var
var postMessageToAddon = (typeof window !== "undefined" && typeof window["postMessageToAddon"] === "function")
  ? window["postMessageToAddon"]
  : function (..._args) {}

if (typeof window !== "undefined" && typeof window["postMessageToAddon"] !== "function") {
  window["postMessageToAddon"] = postMessageToAddon
}

function getAllTags(plugins){
  const tagSet = new Set()
  plugins.forEach((p)=>{
    if (Array.isArray(p.tags)) {
      p.tags.forEach((t)=> tagSet.add(t))
    }
  })
  return ["全部", ...Array.from(tagSet)]
}

function renderTags(tags){
  if (!tagsBar) return
  tagsBar.className = "tags-bar"
  tagsBar.innerHTML = ""
  tags.forEach((tag)=>{
    const chip = document.createElement("div")
    const isActive = tag === "全部" ? selectedTags.size === 0 : selectedTags.has(tag)
    chip.className = "tag-chip" + (isActive ? " active" : "")
    chip.textContent = tag
    chip.addEventListener("click", ()=>{
      if (tag === "全部") {
        selectedTags.clear()
      } else {
        if (selectedTags.has(tag)) {
          selectedTags.delete(tag)
        } else {
          selectedTags.add(tag)
        }
      }
      renderTags(tags)
      renderList()
    })
    tagsBar.appendChild(chip)
  })
}

function renderList(){
  if (!pluginList) return
  pluginList.innerHTML = ""
  // const list = selectedTags.size === 0
  //   ? allPlugins
  //   : allPlugins.filter((p)=> Array.isArray(p.tags) && p.tags.every((t)=> selectedTags.has(t)))
  const list = selectedTags.size === 0
    ? allPlugins
    : allPlugins.filter((p)=> Array.isArray(p.tags) && Array.from(selectedTags).every((t)=> p.tags.includes(t)))
  update(list)
}

function setPlugins(plugins){
  allPlugins = Array.isArray(plugins) ? plugins : []
  const tags = getAllTags(allPlugins)
  if (tags.length > 1) {
    // 仅保留仍然存在的标签
    selectedTags = new Set(Array.from(selectedTags).filter((t)=> tags.includes(t)))
    renderTags(tags)
  }
  renderList()
}
