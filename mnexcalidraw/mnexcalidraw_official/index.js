 const { useState, useEffect } = React;

 var Excalidraw;



function App() {
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);

  useEffect(() => {
    window.excalidrawAPI = excalidrawAPI;
  }, [excalidrawAPI]);

  function resetScene(){
    excalidrawAPI.resetScene();
  };
  function updateScene(elementId,imageId,width,height){
  const currentElements = excalidrawAPI.getSceneElements();
  const newElements = currentElements.concat({
      "id": elementId,
      "type": "image",
      "x": 0,
      "y": 0,
      "width": width,
      "height": height,
      "angle": 0,
      "strokeColor": "transparent",
      "backgroundColor": "transparent",
      "fillStyle": "hachure",
      "strokeWidth": 1,
      "strokeStyle": "solid",
      "roughness": 1,
      "opacity": 100,
      "groupIds": [],
      "frameId": null,
      "roundness": null,
      "seed": 413988931,
      "version": 4,
      "versionNonce": 1498294829,
      "isDeleted": false,
      "boundElements": null,
      "updated": 1717580472726,
      "link": null,
      "locked": false,
      "status": "pending",
      "fileId": imageId,
      "scale": [
        1,
        1
      ]
    })
    const sceneData = {
      elements: newElements,
      appState: {
      },
    };
    excalidrawAPI.updateScene(sceneData);
  };
  function scrollToContent() {
    let opt = {
      fitToContent:true,
      animate:true
    }
    excalidrawAPI.scrollToContent(undefined,opt)
  }
  function calculateSize(elements) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    for (const element of elements) {
      console.log(element)
      minX = Math.min(element.x, minX);
      minY = Math.min(element.y, minY);
      maxX = Math.max(element.x + element.width, maxX);
      maxY = Math.max(element.y + element.height, maxY);
    }
    
    return {
      width: (maxX - minX+20)*2,
      height: (maxY - minY+20)*2,
      scale: 2
    };
  }
  function addImage(id,imageData){
    const image = {
      id: id,
      dataURL: imageData,
      mimeType: "image/png",
      created: Date.now(),
      lastRetrieved: Date.now(),
      }
    excalidrawAPI.addFiles([image])
  }
  async function getCanvas() {
    if (!excalidrawAPI) {
      console.log("not excalidrawAPI")
      return;
    }

    var elements = excalidrawAPI.getSceneElements();

    if (!elements || !elements.length) {
      return;
    }

    size = calculateSize(elements)
    

    var canvas = await ExcalidrawLib.exportToCanvas({
      elements: elements,
      // appState: {
      //   ...initialData.appState,
      //   exportWithDarkMode: false,
      // },
      files: excalidrawAPI.getFiles(),
      getDimensions: function () { return size },
      exportPadding:10,
    });
   

    return canvas.toDataURL()
  }

  

 

  React.useEffect(function() {
    // 更新全局 Excalidraw 中的 onClickButton 当 excalidrawAPI 改变时
    Excalidraw = { getCanvas: getCanvas,resetScene:resetScene,updateScene:updateScene,addImage:addImage,scrollToContent:scrollToContent,calculateSize:calculateSize };
  }, [excalidrawAPI]);

  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "div", 
      { style: { } }, 
      React.createElement(ExcalidrawLib.Excalidraw, { ref: setExcalidrawAPI })
    )
  )
}
window.exportToCanvas = ExcalidrawLib.exportToCanvas;
const excalidrawWrapper = document.getElementById("app");
const root = ReactDOM.createRoot(excalidrawWrapper);
root.render(React.createElement(App));



 

