JSB.newAddon = function (mainPath) {
  JSB.require('utils')
  if (!ocrUtils.checkMNUtilsFolder(mainPath)) {return undefined}
  JSB.require('webviewController');
  // Application.sharedInstance().showHUD(ocrUtils.getExtensionFolder(mainPath),Application.sharedInstance().focusWindow,5)
  /** @return {MNOCRClass} */
  const getMNOCRClass = ()=>self

  var MNOCRClass = JSB.defineClass(
    'MNOCR : JSExtension',
    { /* Instance members */
      sceneWillConnect: async function () { //Window initialize
        if (!(await ocrUtils.checkMNUtil(false,0.1))) return
        let self = getMNOCRClass()
        self.init(mainPath)
        self.isFirst = true
      },

      sceneDidDisconnect: function () { // Window disconnect

      },

      sceneWillResignActive: function () { // Window resign active
      },

      sceneDidBecomeActive: function () { // Window become active
      },

      notebookWillOpen: async function (notebookid) {
        if (!(await ocrUtils.checkMNUtil(false,0.1))) return
        let self = getMNOCRClass()
        self.init(mainPath)
        ocrUtils.checkOCRController()
        // if (ocrUtils.studyController.studyMode = 3) return
      try {
        if (ocrUtils.studyController.studyMode < 3) {
          ocrUtils.ocrController.view.hidden = true;
          ocrUtils.ocrController.notebookid = notebookid
          self.notebookid = notebookid
          ocrUtils.ocrController.view.frame = { x: 50, y: 100, width: 260, height: 345 }
          ocrUtils.ocrController.currentFrame = { x: 50, y: 100, width: 260, height: 345 }
          MNUtil.delay(0.2).then(()=>{
            MNUtil.studyView.becomeFirstResponder(); //For dismiss keyboard on iOS
          })
        }else{
          if (ocrUtils.ocrController) {
            ocrUtils.ocrController.view.hidden = true
          }
        }
      } catch (error) {
        ocrUtils.addErrorLog(error, "notebookWillOpen")
      }
      },

      notebookWillClose: function (notebookid) {
      },

      documentDidOpen: function (docmd5) {
      },

      documentWillClose: function (docmd5) {
      },

      controllerWillLayoutSubviews: function (controller) {
        if (typeof MNUtil === 'undefined') return
        if (controller !== ocrUtils.studyController) {
          return;
        };
        if (ocrUtils.studyController.studyMode === 3 && ocrUtils.ocrController){
            ocrUtils.ocrController.view.hidden = true
        }
        if (!ocrUtils.ocrController.view.hidden && !ocrUtils.ocrController.onAnimate) {
          let studyFrame = ocrUtils.studyView.bounds
          let currentFrame = ocrUtils.ocrController.currentFrame
          if (currentFrame.x+currentFrame.width*0.5 >= studyFrame.width) {
            currentFrame.x = studyFrame.width-currentFrame.width*0.5              
          }
          if (currentFrame.y >= studyFrame.height) {
            currentFrame.y = studyFrame.height-20              
          }
          currentFrame.height = 345
          ocrUtils.setFrame(ocrUtils.ocrController, currentFrame)
        }
      },
      queryAddonCommandStatus: function () {
        if (!ocrUtils.checkLogo()) {
          return null
        }
        ocrUtils.checkOCRController()
        if (ocrUtils.studyController.studyMode < 3) {
          return {
            image: 'logo.png',
            object: self,
            selector: 'toggleAddon:',
            checked: false
          };
        } else {
          if (ocrUtils.ocrController) {
            ocrUtils.ocrController.view.hidden = true
          }
          return null;
        }
      },
      toggleAddon:function (sender) {
      if (typeof MNUtil === 'undefined') return null
      try {
        self.init(mainPath)
        ocrUtils.checkOCRController()
        if (!self.addonBar) {
          self.addonBar = sender.superview.superview
          ocrUtils.addonBar = self.addonBar
        }
        if (self.isFirst) {
          let buttonFrame = self.addonBar.frame
          let frame = buttonFrame.x < 100 ? {x:40,y:buttonFrame.y,width:260,height: 345} : {x:buttonFrame.x-260,y:buttonFrame.y,width:260,height: 345}
          ocrUtils.setFrame(ocrUtils.ocrController, frame)
          self.isFirst = false;
        }
        if (ocrUtils.ocrController.view.hidden || !MNUtil.isDescendantOfStudyView(ocrUtils.ocrController.view)) {
          ocrUtils.ensureView(ocrUtils.ocrController.view)
          ocrUtils.ocrController.show(self.addonBar.frame)
        }else{
          ocrUtils.ocrController.hide(self.addonBar.frame)
        }
      } catch (error) {
        ocrUtils.addErrorLog(error, "toggleAddon")
      }
      // ocrUtils.ocrController.view.hidden = !ocrUtils.ocrController.view.hidden
      }
    },
    { /* Class members */
      addonDidConnect: function () {
      },

      addonWillDisconnect: function () {
        // NSUserDefaults.standardUserDefaults().removeObjectForKey("MNOCR")
      },

      applicationWillEnterForeground: function () {
      },

      applicationDidEnterBackground: function () {
      },

      applicationDidReceiveLocalNotification: function (notify) {
      }
    }
  );
  MNOCRClass.prototype.init = function(mainPath){
  try {
    if (!this.initialized) {
      ocrUtils.init(mainPath)
      ocrConfig.init()
      this.initialized = true
    }
  } catch (error) {
    ocrUtils.addErrorLog(error, "init")
  }
  }
  return MNOCRClass;
};