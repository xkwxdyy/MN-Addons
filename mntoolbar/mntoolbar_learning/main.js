JSB.newAddon = function (mainPath) {
  JSB.require('utils')
  if (!pluginDemoUtils.checkMNUtilsFolder(mainPath)) {return undefined}
  JSB.require('webviewController');
  JSB.require('settingController');
  /** @return {MNPluginDemoClass} */
  const getPluginDemoClass = ()=>self  
  var MNPluginDemoClass = JSB.defineClass(
    'PluginDemo : JSExtension',
    { /* Instance members */
      sceneWillConnect: async function () { //Window initialize
      },
      sceneDidDisconnect: function () { // Window disconnect 在插件页面关闭插件（不是删除）
      },
      sceneWillResignActive: function () { // Window resign active
      },
      sceneDidBecomeActive: function () { // Window become active
      },
      notebookWillOpen: async function (notebookid) {
      },
      notebookWillClose: function (notebookid) {
      },
      onProcessNewExcerpt:function (sender) {
      },
      onPopupMenuOnSelection: async function (sender) { // Clicking note
      },
      onClosePopupMenuOnSelection: async function (sender) {
      },
      onPopupMenuOnNote: async function (sender) { // Clicking note
      },
      onClosePopupMenuOnNote: async function (sender) {
      },
      documentDidOpen: function (docmd5) {
      },
      documentWillClose: function (docmd5) {
      },
      controllerWillLayoutSubviews: function (controller) {
      },
      queryAddonCommandStatus: function () {
      },
      onNewIconImage: function (sender) {
      },
      onOpenToolbarSetting:function (params) {
      },
      onToggleDynamic:function (sender) {
      },
      onToggleMindmapToolbar:function (sender) {
      },
      onRefreshView: function (sender) {
      },
      onCloudConfigChange: async function (sender) {
      },
      manualSync: async function (sender) {
      },
      onTextDidBeginEditing:function (param) {
      },
      onTextDidEndEditing: function (param) {
      },
      onRefreshToolbarButton: function (sender) {
      },
      openSetting:function () {
      },
      toggleToolbar:function () {
      },
      toggleDynamic:function () {
      },
      openDocument:function (button) {
      },
      toggleToolbarDirection: function (source) {
      },
      toggleAddon:function (button) {
      }
    },
    { /* Class members */
      addonDidConnect: function () {
      },
      addonWillDisconnect: async function () {
      },
      applicationWillEnterForeground: function () {
      },
      applicationDidEnterBackground: function () {
      },
      applicationDidReceiveLocalNotification: function (notify) {
      }
    }
  );
  MNPluginDemoClass.prototype.foo = function(bar){ 
  }
  return MNPluginDemoClass;
};