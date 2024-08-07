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

        const pluginInfo = document.createElement("div");
        pluginInfo.style.display = "flex";
        pluginInfo.style.justifyContent = "space-between";
        pluginInfo.style.alignItems = "center";

        const pluginName = document.createElement("span");
        pluginName.textContent = plugin.name;
        pluginName.style.flexGrow = "1"; // 使插件名称占据剩余空间

        const installBtn = document.createElement("button");
        switch (plugin.action) {
          case "Re-install":
            installBtn.textContent = "Install";
            installBtn.className = "reinstall-btn";
            installBtn.addEventListener("click", (event) => {
                event.stopPropagation(); // 阻止点击事件冒泡到 li
                window.location.href = `mnaddon://action=reinstall?id=${plugin.id}?version=${plugin.version}`
            });
            break;
          case "Install":
            installBtn.textContent = "Install";
            installBtn.className = "install-btn";
            installBtn.addEventListener("click", (event) => {
                event.stopPropagation(); // 阻止点击事件冒泡到 li
                window.location.href = `mnaddon://action=install?id=${plugin.id}?version=${plugin.version}`
            });
            break;
          case "Update":
            installBtn.textContent = "Update";
            installBtn.className = "update-btn";
            installBtn.addEventListener("click", (event) => {
                event.stopPropagation(); // 阻止点击事件冒泡到 li
                window.location.href = `mnaddon://action=update?id=${plugin.id}?version=${plugin.version}`
            });
            break;
          default:
            break;
        }


        pluginInfo.appendChild(pluginName);
        pluginInfo.appendChild(installBtn);

        const pluginVersion = document.createElement("div");
        pluginVersion.className = "version"
        pluginVersion.textContent = `${plugin.author} | V${plugin.version}`;
        pluginVersion.style.fontSize = "0.8em";

        li.appendChild(pluginInfo);
        li.appendChild(pluginVersion);

        li.addEventListener("click", async() => {
          window.location.href = plugin.description
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
// const pluginDetails = document.getElementById("plugin-details");
// pluginDetails.innerHTML = ""
// update(plugins)
// document.addEventListener("DOMContentLoaded", async () => {
//     const res = await fetch("https://file.feliks.top/mnaddon.json?timestamp="+Date.now())
//     const plugins = await res.json()
//     update(plugins)
// });
