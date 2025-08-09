var MNOnAlert;
(void 0 === MNOnAlert && (MNOnAlert = !1),
  (JSB.newAddon = function (t) {
    try {
      (JSB.require('mnutils'), JSB.require('xdyyutils'), MNUtil.init(t));
    } catch (t) {
      subscriptionUtils.showHUD('Error when loading mnutils: ' + t);
    }
    JSB.require('mnutils');
    try {
      JSB.require('CryptoJS');
    } catch (t) {
      MNUtil.log('Error when loading CryptoJS: ' + t);
    }
    try {
      JSB.require('marked');
    } catch (t) {
      MNUtil.log('Error when loading marked: ' + t);
    }
    try {
      JSB.require('pdf');
    } catch (t) {
      MNUtil.log('Error when loading pdf: ' + t);
    }
    try {
      JSB.require('highlight');
    } catch (t) {
      MNUtil.log('Error when loading highlight: ' + t);
    }
    try {
      JSB.require('mustache');
    } catch (t) {
      MNUtil.log('Error when loading mustache: ' + t);
    }
    try {
      JSB.require('segmentit');
    } catch (t) {
      MNUtil.log('Error when loading segmentit: ' + t);
    }
    try {
      JSB.require('jsonrepair');
    } catch (t) {
      MNUtil.log('Error when loading jsonrepair: ' + t);
    }
    return JSB.defineClass(
      'MNSubscription : JSExtension',
      {
        sceneWillConnect: async function () {
          try {
            var t, e;
            ((self.appInstance = Application.sharedInstance()),
              subscriptionConfig.init(),
              (self.isNewWindow = !1),
              (self.watchMode = !1),
              (self.textSelected = ''),
              (self.textProcessed = !1),
              (self.dateGetText = Date.now()),
              (self.dateNow = Date.now()),
              (self.rect = '{{0, 0}, {10, 10}}'),
              (self.arrow = 1),
              (self.notifications = []),
              (self.isFirst = !0),
              MNUtil.addObservers(self, {
                PopupMenuOnNote: 'onPopupMenuOnNote:',
                PopupMenuOnSelection: 'onPopupMenuOnSelection:',
                ClosePopupMenuOnNote: 'onClosePopupMenuOnNote:',
                ClosePopupMenuOnSelection: 'onClosePopupMenuOnSelection:',
                UITextViewTextDidBeginEditingNotification: 'onTextDidBeginEditing:',
                UITextViewTextDidEndEditingNotification: 'onTextDidEndEditing:',
                AddonBroadcast: 'onAddonBroadcast:',
              }),
              await MNUtil.delay(0.1),
              subscriptionUtils.checkSubscriptionController(),
              subscriptionUtils.ensureView(subscriptionUtils.subscriptionController.view),
              self.isFirst &&
                ((t = subscriptionConfig.getMiniFrame()),
                (subscriptionUtils.subscriptionController.view.frame = t),
                (e = subscriptionUtils.calcLastFrame()),
                (subscriptionUtils.subscriptionController.lastFrame = e),
                (subscriptionUtils.subscriptionController.currentFrame =
                  subscriptionUtils.subscriptionController.view.frame),
                subscriptionUtils.subscriptionController.onAnimate && (await MNUtil.delay(0.5)),
                (subscriptionUtils.subscriptionController.initialized = !0),
                (self.isFirst = !1)));
          } catch (t) {
            subscriptionUtils.addErrorLog(t, 'sceneWillConnect');
          }
        },
        sceneDidDisconnect: function () {
          MNUtil.removeObservers(self);
        },
        onPopupMenuOnNote: function (t) {
          var e;
          self.window === MNUtil.currentWindow &&
            ((t = t.userInfo.note.noteId),
            (e = Date.now()),
            (MNUtil.popUpNoteInfo = { time: e, noteId: t }),
            (e = MNNote.new(t)),
            MNUtil.addHistory('note', { type: 'note', noteId: t, notebookId: e.notebookId, docMd5: e.docMd5 }));
        },
        onClosePopupMenuOnNote: function (t) {
          self.window === MNUtil.currentWindow &&
            MNUtil.popUpNoteInfo &&
            t.userInfo.noteid === MNUtil.popUpNoteInfo.noteId &&
            MNUtil.delay(1).then(() => {
              MNUtil.popUpNoteInfo = void 0;
            });
        },
        onPopupMenuOnSelection: function (t) {
          var e;
          self.window === MNUtil.currentWindow &&
            ((e = Date.now()),
            (t = t.userInfo.documentController),
            (MNUtil.popUpSelectionInfo = { time: e, docController: t }),
            (e = t.isSelectionText),
            MNUtil.addHistory(e ? 'text' : 'image', {
              notebookId: t.notebookId,
              docMd5: t.docMd5,
              text: t.selectionText,
              imageData: t.imageFromSelection(),
            }));
        },
        onClosePopupMenuOnSelection: async function (t) {
          self.window === MNUtil.currentWindow &&
            (await MNUtil.delay(0.01), MNUtil.popUpSelectionInfo) &&
            t.userInfo.documentController === MNUtil.popUpSelectionInfo.docController &&
            !t.userInfo.documentController.imageFromSelection() &&
            (MNUtil.popUpSelectionInfo = void 0);
        },
        onTextDidBeginEditing: function (t) {
          self.window === MNUtil.currentWindow &&
            3 !== MNUtil.studyMode &&
            ((t = t.object), (MNUtil.activeTextView = t));
        },
        onTextDidEndEditing: function (t) {
          self.window === MNUtil.currentWindow &&
            3 !== MNUtil.studyMode &&
            t.object === MNUtil.activeTextView &&
            (MNUtil.activeTextView = void 0);
        },
        onAddonBroadcast: async function (t) {
          var t = 'marginnote4app://addon/' + t.userInfo.message,
            e = MNUtil.parseURL(t),
            t = e.pathComponents[0];
          if ('mnutils' === t)
            switch (e.params.action) {
              case 'changeView':
                subscriptionUtils.subscriptionController.changeViewTo(e.params.view);
                break;
              case 'loadRechargePage':
                var i = subscriptionUtils.subscriptionController;
                (await i.changeViewTo('subscriptionView'), i.loadRechargePage());
            }
        },
        sceneWillResignActive: function () {},
        sceneDidBecomeActive: function () {
          subscriptionUtils.checkSubscriptionController();
        },
        notebookWillOpen: function (t) {
          try {
            (subscriptionUtils.refreshAddonCommands(), (self.notebookid = t), subscriptionConfig.autoSubscribe());
          } catch (t) {
            subscriptionUtils.addErrorLog(t, 'notebookWillOpen');
          }
        },
        onCloudConfigChange: async function (t) {
          MNUtil.postNotification('cloudConfigChange', t.userInfo);
        },
        notebookWillClose: function (t) {},
        documentDidOpen: function (t) {},
        documentWillClose: function (t) {},
        controllerWillLayoutSubviews: function (t) {
          if (t === MNUtil.studyController)
            try {
              var e = subscriptionUtils.subscriptionController;
              if (e && !e.onAnimate && !e.view.hidden) {
                var i = MNUtil.currentWindow.bounds;
                let t = e.currentFrame;
                e.miniMode
                  ? (subscriptionUtils.checkSubscriptionController(),
                    (t = subscriptionConfig.getMiniFrame()),
                    (e.view.frame = t),
                    (e.currentFrame = t))
                  : (t.x + 0.5 * t.width >= i.width && (t.x = i.width - 0.5 * t.width),
                    t.y >= i.height && (t.y = i.height - 20),
                    (e.view.frame = t),
                    (e.currentFrame = t));
              }
            } catch (t) {
              subscriptionUtils.addErrorLog(t, 'controllerWillLayoutSubviews');
            }
        },
        queryAddonCommandStatus: function () {
          return null;
        },
        toggleAddon: async function (t) {
          try {
            var e;
            (subscriptionUtils.ensureView(subscriptionUtils.subscriptionController.view),
              self.addonBar || ((self.addonBar = t.superview.superview), (subscriptionUtils.addonBar = self.addonBar)),
              self.isFirst &&
                (0 === (e = self.addonBar.frame).x
                  ? (subscriptionUtils.subscriptionController.view.frame = {
                      x: 40,
                      y: e.y,
                      width: 280,
                      height: subscriptionConfig.frameHeight,
                    })
                  : (subscriptionUtils.subscriptionController.view.frame = {
                      x: e.x - 280,
                      y: e.y,
                      width: 280,
                      height: subscriptionConfig.frameHeight,
                    }),
                (subscriptionUtils.subscriptionController.currentFrame =
                  subscriptionUtils.subscriptionController.view.frame),
                (self.isFirst = !1)),
              subscriptionUtils.subscriptionController.view.hidden
                ? subscriptionUtils.subscriptionController.show(self.addonBar.frame)
                : subscriptionUtils.subscriptionController.hide(self.addonBar.frame));
          } catch (t) {
            subscriptionUtils.showHUD(t);
          }
        },
      },
      {
        addonDidConnect: function () {
          (subscriptionUtils.init(t),
            subscriptionUtils.subscriptionController && (subscriptionUtils.subscriptionController.view.hidden = !1));
        },
        addonWillDisconnect: function () {
          ((subscriptionUtils.addonConnected = !1),
            subscriptionUtils.subscriptionController && (subscriptionUtils.subscriptionController.view.hidden = !0));
        },
        applicationWillEnterForeground: async function () {
          subscriptionUtils.addonConnected &&
            MNUtil.currentNotebookId &&
            (await MNUtil.delay(0.01), subscriptionConfig.autoSubscribe(!1));
        },
        applicationDidEnterBackground: function () {},
        applicationDidReceiveLocalNotification: function (t) {},
      }
    );
  }));
const getSubscriptionController = () => self;
var subscriptionController = JSB.defineClass(
  'subscriptionController : UIViewController <NSURLConnectionDelegate,UIWebViewDelegate>',
  {
    viewDidLoad: function () {
      try {
        ((self.initialized = !1),
          (self.custom = !1),
          (self.dynamic = !0),
          (self.miniMode = !0),
          (self.isLoading = !1),
          (self.lastFrame = self.view.frame),
          (self.currentFrame = self.view.frame),
          (self.color = [
            '#ffffb4',
            '#ccfdc4',
            '#b4d1fb',
            '#f3aebe',
            '#ffff54',
            '#75fb4c',
            '#55bbf9',
            '#ea3323',
            '#ef8733',
            '#377e47',
            '#173dac',
            '#be3223',
            '#ffffff',
            '#dadada',
            '#b4b4b4',
            '#bd9fdc',
          ]),
          (self.mode = 0),
          (self.moveDate = Date.now()),
          (self.lastRefreshView = ''),
          (self.lastRefreshTime = 0),
          self.init());
      } catch (t) {
        subscriptionUtils.addErrorLog(t, 'viewDidLoad');
      }
    },
    viewWillAppear: (t) => {},
    viewWillDisappear: (t) => {},
    viewWillLayoutSubviews: () => {
      self.layoutSubviews();
    },
    connectionDidReceiveResponse: async function (t, e) {
      ((self.statusCode = e.statusCode()),
        400 <= self.statusCode
          ? (self.waitHUD('Retrying...'), await MNUtil.delay(1), subscriptionNetwork.downloadFromConfigReTry(self))
          : ((self.onDownloading = !0),
            (self.currentData = NSMutableData.new()),
            (self.expectedContentLength = e.expectedContentLength())));
    },
    connectionDidReceiveData: async function (t, e) {
      try {
        if (400 <= self.statusCode) self.onDownloading = !1;
        else if ((self.currentData.appendData(e), 0 < self.expectedContentLength))
          self.waitHUD(
            'Downloading: ' + ((self.currentData.length() / self.expectedContentLength) * 100).toFixed(2) + '%'
          );
        else {
          let t = self.currentData.length();
          1e6 < t
            ? ((t /= 1e6), self.waitHUD('Downloading (' + t.toFixed(2) + ' MB)...'))
            : 1e3 < t
              ? ((t /= 1e3), self.waitHUD('Downloading (' + t.toFixed(2) + ' KB)...'))
              : self.waitHUD('Downloading (' + t.toFixed(2) + ' B)...');
        }
      } catch (t) {
        subscriptionUtils.addErrorLog(t, 'connectionDidReceiveData');
      }
    },
    connectionDidFinishLoading: async function (t) {
      try {
        if (((self.onDownloading = !1), !(400 <= self.statusCode))) {
          if (self.targetPath)
            switch ((self.currentData.writeToFileAtomically(self.targetPath, !1), self.fileType)) {
              case 'document':
                var e = MNUtil.getFileName(self.targetPath),
                  i = MNUtil.importDocument(self.targetPath);
                MNUtil.currentNotebookId &&
                  (await MNUtil.confirm('Open document?', '是否打开该文档？\n' + e)) &&
                  MNUtil.openDoc(i, MNUtil.currentNotebookId);
                break;
              case 'notebook':
                (self.targetPath.endsWith('.marginpkg') || self.targetPath.endsWith('.marginnotes')) &&
                  subscriptionUtils.importNotebook(self.targetPath, self.folder, self.notebookId);
                break;
              case 'mnaddon':
                (ZipArchive.unzipFileAtPathToDestination(self.targetPath, self.addonPath),
                  self.showHUD('✅ Install success!\n\nPlease restart MN manually', 2));
            }
          MNUtil.delay(1).then(() => {
            MNUtil.stopHUD();
          });
        }
      } catch (t) {
        (MNUtil.stopHUD(), subscriptionUtils.addErrorLog(t, 'connectionDidFinishLoading'));
      }
    },
    connectionDidFailWithError: function (t, e) {
      ((self.onDownloading = !1), self.showHUD('connectionDidFailWithError'));
    },
    webViewDidFinishLoad: async function (t) {
      var e = getSubscriptionController();
      if (!t.sidebar) {
        var i,
          o = MNUtil.parseURL(t.request);
        if ('file' === o.scheme && o.pathComponents.length && 'recharge.html' === o.pathComponents.at(-1))
          e.runJavaScript(`state.apiKey = "${subscriptionConfig.APIKey}"`, 'docview');
        else {
          if ('https' === o.scheme)
            switch (o.host) {
              case 'afdian.com':
              case 'ifdian.net':
                if ('message' === o.pathComponents[0])
                  return (
                    e.waitHUD('Checking APIKey...'),
                    await MNUtil.delay(1),
                    (i = await e.getApikeyFromWebview(t)) &&
                      (await MNUtil.confirm('Subscribe using APIKey below?', '是否使用以下APIKey订阅?\n' + i)) &&
                      ((e.apikeyInput.text = i),
                      (e.apikeyInput.editable = !0),
                      MNButton.setColor(e.showAPIKeyButton, '#e06c75'),
                      e.showHUD('Save APIKey'),
                      subscriptionConfig.save(),
                      e.activate()),
                    void MNUtil.stopHUD()
                  );
                break;
              case 'www.jianguoyun.com':
                return (
                  e.runJavaScript(
                    'document.getElementById("dashboard-container").style.display = "none";document.getElementsByClassName("info-container")[0].style.marginTop = 0;',
                    'docview'
                  ),
                  void MNUtil.stopHUD()
                );
            }
          MNUtil.stopHUD();
        }
      }
    },
    webViewShouldStartLoadWithRequestNavigationType: function (t, e, i) {
      try {
        let s = getSubscriptionController(),
          n = e.URL().absoluteString(),
          i = MNUtil.parseURL(n);
        switch (i.scheme) {
          case 'marginnote4app':
          case 'marginnote3app':
          case 'xhsdiscover':
            return (
              MNUtil.confirm('MN Utils', 'Open Red Note?\n\n是否打开小红书？').then(async (t) => {
                t && MNUtil.openURL(n);
              }),
              s.changeViewTo(subscriptionConfig.lastView, !0),
              !1
            );
          case 'mqqapi':
            return (
              MNUtil.confirm('MN Utils', 'Open QQ?\n\n是否打开QQ？').then(async (t) => {
                (t && MNUtil.openURL(n), s.changeViewTo(subscriptionConfig.lastView, !0));
              }),
              !1
            );
          case 'tencent':
            return (
              'groupwpa' === i.host &&
                (MNUtil.confirm('MN Utils', 'Open QQ Group?\n\n是否打开QQ群？').then(async (t) => {
                  t && MNUtil.openURL(n);
                }),
                s.changeViewTo(subscriptionConfig.lastView, !0)),
              !1
            );
          case 'nativeaction':
            return ('copy' === i.host && MNUtil.copy(i.params.text), !1);
          case 'mnaddonaction':
            return (s.executeMNAddonAction(i), !1);
          case 'afd':
            return (MNConnection.loadRequest(s.docview, 'https://afdian.com', !1), !1);
          case 'subscription':
            switch (i.host) {
              case 'newkey':
                return (s.afdNewkeyOrderPage(i.params.credit, i.params.openInBrowser), !1);
              case 'recharge':
                return (s.afdRechargeOrderPage(i.params.credit, i.params.openInBrowser), !1);
              case 'verify':
                var r = i.params.apikey;
                return (s.verifyApiKeyInRechargePage(r), !1);
            }
            return !1;
          case 'https':
            if (t.sidebar) {
              switch (i.host) {
                case 'qm.qq.com':
                  return (s.setWebMode(MNUtil.isMacOS(), 'docview'), MNConnection.loadRequest(s.docview, n, !1), !1);
                case 'www.xiaohongshu.com':
                  return !0;
                case 'oia.xiaohongshu.com':
                  return (
                    MNUtil.confirm('MN Utils', 'Open Red Note?\n\n是否打开小红书？').then(async (t) => {
                      var e = i.params.deeplink;
                      t && (MNUtil.openURL(e), s.changeViewTo(subscriptionConfig.lastView, !0));
                    }),
                    !1
                  );
              }
              return (
                s.checkDocview(),
                650 < s.view.frame.width && (MNUtil.copy(n), s.waitHUD('Previewing Document...', s.docview)),
                !1
              );
            }
            if ('ifdian.net' === i.host || 'afdian.com' === i.host) {
              var a = i.params;
              if (a && 'method' in a && 'alipay.trade.page.pay.return' === a.method)
                return (
                  s.docview.stopLoading(),
                  MNConnection.loadRequest(
                    s.docview,
                    'https://ifdian.net/message/929697869e9311eea6745254001e7c00',
                    !1
                  ),
                  !1
                );
            }
            if ('h5coml.vivo.com.cn' === i.host) return !1;
            if ('mnaddon.craft.me' === i.host) return (s.waitHUD('Loading Document...', s.docview), !0);
        }
        if (n.startsWith('data:application/pdf;base64,')) return !0;
        let o = subscriptionUtils.getFileNameFromUrl(n);
        if (
          (o &&
            (o.endsWith('.marginnotes') || o.endsWith('.marginpkg')) &&
            MNUtil.confirm('Should download this notebook?', '是否下载该学习集？\n' + o).then(async (t) => {
              var e;
              t &&
                (s.waitHUD('Downloading...'),
                (t = subscriptionUtils.mainPath + '/' + o),
                (e = MNConnection.requestWithURL(n)),
                NSURLConnection.connectionWithRequestDelegate(e, s),
                (s.targetPath = t),
                (s.folder = subscriptionUtils.mainPath + '/download'),
                (s.fileType = 'notebook'));
            }),
          /^https?\:\/\/.*\.mnaddon$/.test(n))
        ) {
          let o = MNUtil.getFileName(n);
          return (
            MNUtil.confirm('Install mnaddon: ' + o + '?', '安装插件: ' + o + '？').then(async (t) => {
              var e, i;
              t &&
                (s.waitHUD('Download: ' + o),
                (t = subscriptionUtils.mainPath + '/' + o),
                (await MNConnection.fetch(n)).writeToFileAtomically(t, !1),
                s.waitHUD('Get addonid...'),
                ZipArchive.unzipFileAtPathToDestination(t, subscriptionUtils.mainPath + '/temp'),
                (e = MNUtil.readJSON(subscriptionUtils.mainPath + '/temp/mnaddon.json'))) &&
                'addonid' in e &&
                ((i = subscriptionUtils.extensionPath + '/' + e.addonid),
                ZipArchive.unzipFileAtPathToDestination(t, i),
                s.showHUD(`Install mnaddon [${e.title}] success! Please restart MN manually`));
            }),
            !1
          );
        }
      } catch (t) {
        return (subscriptionUtils.addErrorLog(t, 'webViewShouldStartLoadWithRequestNavigationType'), !1);
      }
      return !0;
    },
    scrollViewDidScroll: function () {},
    openRechargePage: async function (t) {
      await self.loadRechargePage();
    },
    chooseAPIKeyForQuota: async function () {
      var t = getSubscriptionController(),
        e = subscriptionConfig.APIKey;
      let i = 'newAPIKey',
        o,
        s;
      if (e)
        switch (
          (o = await MNUtil.userSelect('Select Action\n选择操作', '', ['New Key / 新的Key', 'Recharge / 充值']))
        ) {
          case 0:
            return;
          case 1:
            i = 'newAPIKey';
            break;
          case 2:
            i = 'rechargeAPIKey';
            break;
          default:
            return;
        }
      if ('newAPIKey' === i)
        ((o = await MNUtil.userSelect('Select APIKey for quota', '选择要购买的额度', [
          '5 Points (5¥)',
          '10 Points (9.5¥)',
          '20 Points (19¥)',
          '50 Points (45¥)',
        ])),
          (s = [
            'https://ifdian.net/order/create?product_type=1&plan_id=a6ed8b60fbcf11ee941152540025c377&sku=%5B%7B%22sku_id%22:%22b24e214cfd3f11eebc335254001e7c00%22,%22count%22:1%7D%5D',
            'https://ifdian.net/order/create?product_type=1&plan_id=a6ed8b60fbcf11ee941152540025c377&sku=%5B%7B%22sku_id%22:%22a58e5502146f11efa4fa5254001e7c00%22,%22count%22:1%7D%5D',
            'https://ifdian.net/order/create?product_type=1&plan_id=a6ed8b60fbcf11ee941152540025c377&sku=%5B%7B%22sku_id%22:%2279e3e74a147011efb46e52540025c377%22,%22count%22:1%7D%5D',
            'https://ifdian.net/order/create?product_type=1&plan_id=a6ed8b60fbcf11ee941152540025c377&sku=%5B%7B%22sku_id%22%3A%22e87e8a7432f811efaa1552540025c377%22,%22count%22%3A1%7D%5D',
          ]));
      else if (
        ((o = await MNUtil.userSelect('Choose the recharge quota', '选择要增加的额度\n(充值到账有数小时延迟)', [
          '5 Points (5¥)',
          '10 Points (9.5¥)',
          '20 Points (19¥)',
          '50 Points (45¥)',
        ])),
        (s = [
          'https://ifdian.net/order/create?product_type=1&plan_id=f52724aa464611ef8acc52540025c377&sku=%5B%7B%22sku_id%22:%22f52fdfc8464611efbe3052540025c377%22,%22count%22:1%7D%5D',
          'https://ifdian.net/order/create?product_type=1&plan_id=f52724aa464611ef8acc52540025c377&sku=%5B%7B%22sku_id%22:%22a077cf88557611efb1785254001e7c00%22,%22count%22:1%7D%5D',
          'https://ifdian.net/order/create?product_type=1&plan_id=f52724aa464611ef8acc52540025c377&sku=%5B%7B%22sku_id%22:%22a0831816557611ef8fb05254001e7c00%22,%22count%22:1%7D%5D',
          'https://ifdian.net/order/create?product_type=1&plan_id=f52724aa464611ef8acc52540025c377&sku=%5B%7B%22sku_id%22:%22ba4c466e557611ef80c852540025c377%22,%22count%22:1%7D%5D',
        ]),
        0 === o)
      )
        return;
      switch (
        ((t.docview.customUserAgent =
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15'),
        o)
      ) {
        case 0:
          return;
        case 1:
          MNConnection.loadRequest(t.docview, s[0] + '&remark=' + e);
          break;
        case 2:
          MNConnection.loadRequest(t.docview, s[1] + '&remark=' + e);
          break;
        case 3:
          MNConnection.loadRequest(t.docview, s[2] + '&remark=' + e);
          break;
        case 4:
          MNConnection.loadRequest(t.docview, s[3] + '&remark=' + e);
          break;
        default:
          return;
      }
      t.checkDocview();
    },
    showHelper: async function (t) {
      (await self.checkDocview(),
        self.waitHUD('Loading...', self.docview),
        MNConnection.loadRequest(self.docview, 'https://mnaddon.craft.me/utils/subscription', MNUtil.isMacOS()));
    },
    chooseQuota: async function () {
      var t = getSubscriptionController(),
        e = subscriptionConfig.APIKey;
      if (e) {
        var i = await MNUtil.userSelect('Choose the recharge quota', '选择要增加的额度\n(充值到账有数小时延迟)', [
            '5 Points (5¥)',
            '10 Points (9.5¥)',
            '20 Points (19¥)',
            '50 Points (45¥)',
          ]),
          o = [
            'https://ifdian.net/order/create?product_type=1&plan_id=f52724aa464611ef8acc52540025c377&sku=%5B%7B%22sku_id%22:%22f52fdfc8464611efbe3052540025c377%22,%22count%22:1%7D%5D',
            'https://ifdian.net/order/create?product_type=1&plan_id=f52724aa464611ef8acc52540025c377&sku=%5B%7B%22sku_id%22:%22a077cf88557611efb1785254001e7c00%22,%22count%22:1%7D%5D',
            'https://ifdian.net/order/create?product_type=1&plan_id=f52724aa464611ef8acc52540025c377&sku=%5B%7B%22sku_id%22:%22a0831816557611ef8fb05254001e7c00%22,%22count%22:1%7D%5D',
            'https://ifdian.net/order/create?product_type=1&plan_id=f52724aa464611ef8acc52540025c377&sku=%5B%7B%22sku_id%22:%22ba4c466e557611ef80c852540025c377%22,%22count%22:1%7D%5D',
          ];
        switch (
          ((t.docview.customUserAgent =
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15'),
          i)
        ) {
          case 0:
            return;
          case 1:
            MNConnection.loadRequest(t.docview, o[0] + '&remark=' + e);
            break;
          case 2:
            MNConnection.loadRequest(t.docview, o[1] + '&remark=' + e);
            break;
          case 3:
            MNConnection.loadRequest(t.docview, o[2] + '&remark=' + e);
            break;
          case 4:
            MNConnection.loadRequest(t.docview, o[3] + '&remark=' + e);
            break;
          default:
            return;
        }
        t.checkDocview();
      } else t.showHUD('No APIKey');
    },
    getApiKey: async function (t) {
      var e = getSubscriptionController();
      (await e.checkDocview(),
        (e.docview.customUserAgent =
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15'),
        MNConnection.loadRequest(e.docview, 'https://ifdian.net/message/929697869e9311eea6745254001e7c00'));
    },
    openURL: async function (t) {
      (await self.checkDocview(),
        (self.docview.customUserAgent =
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15'),
        MNConnection.loadRequest(self.docview, t.url));
    },
    changeURL: function (t) {
      self.popoverController && self.popoverController.dismissPopoverAnimated(!0);
      var e = subscriptionConfig.URL,
        i = 'changeURLTo:',
        o = new Menu(t, self);
      (o.addMenuItem('🔗 URL1 (default)', i, subscriptionUtils.URLs[0], e === subscriptionUtils.URLs[0]),
        o.addMenuItem('🔗 URL2', i, subscriptionUtils.URLs[1], e === subscriptionUtils.URLs[1]),
        o.addMenuItem('🔗 URL3', i, subscriptionUtils.URLs[2], e === subscriptionUtils.URLs[2]),
        o.addMenuItem('🔗 URL4', i, subscriptionUtils.URLs[3], e === subscriptionUtils.URLs[3]),
        o.addMenuItem('🔗 URL5', i, subscriptionUtils.URLs[4], e === subscriptionUtils.URLs[4]),
        o.addMenuItem('🕙 Test URL', 'testURL:', t),
        (o.width = 200),
        (o.preferredPosition = 2),
        o.show());
    },
    changeURLTo: function (t) {
      (Menu.dismissCurrentMenu(),
        (subscriptionConfig.config.url = t),
        subscriptionConfig.save(),
        self.URLButton.setTitleForState(subscriptionUtils.getURLTitle(), 0));
    },
    testURL: async function (t) {
      let i = getSubscriptionController();
      (Menu.dismissCurrentMenu(), i.waitHUD('Testing URL...'), (i.testIndex = 0));
      var e = await Promise.all(subscriptionUtils.URLs.map((t, e) => i.testURL(t, e))),
        o = (MNUtil.stopHUD(), subscriptionConfig.URL),
        s = 'changeURLTo:',
        t = new Menu(t, i),
        n = subscriptionUtils.URLs[0],
        r = subscriptionUtils.URLs[1],
        a = subscriptionUtils.URLs[2],
        c = subscriptionUtils.URLs[3],
        l = subscriptionUtils.URLs[4];
      (t.addMenuItem(e[0].title, s, n, o === n),
        t.addMenuItem(e[1].title, s, r, o === r),
        t.addMenuItem(e[2].title, s, a, o === a),
        t.addMenuItem(e[3].title, s, c, o === c),
        t.addMenuItem(e[4].title, s, l, o === l),
        (t.width = 200),
        (t.preferredPosition = 2),
        t.show());
    },
    changeView: async function (t) {
      var e,
        i = getSubscriptionController();
      try {
        i.miniMode
          ? (await i.exitMiniMode(),
            (e = subscriptionConfig.lastView),
            i.lastRefreshView === e && i.lastRefreshTime > Date.now() - 6e4 ? i.refresh(!1) : i.refresh())
          : (Menu.dismissCurrentMenu(),
            i.popoverController && i.popoverController.dismissPopoverAnimated(!0),
            i.changeView(t));
      } catch (t) {
        subscriptionUtils.addErrorLog(t, 'changeView');
      }
    },
    setViewTo: async function (t) {
      var e = getSubscriptionController();
      try {
        (Menu.dismissCurrentMenu(), e.changeViewTo(t));
      } catch (t) {
        subscriptionUtils.addErrorLog(t, 'setViewTo');
      }
    },
    force2Crash: function (t) {
      MNUtil.studyView.frame = { x: void 0 };
    },
    showPanel: function (t) {
      (Menu.dismissCurrentMenu(),
        'sidebar' === t ? MNExtensionPanel.toggle() : (self.blur(), MNUtil.excuteCommand('OpenExtensions')));
    },
    pasteApiKey: async function (t) {
      let e = MNUtil.clipboardText.trim();
      var i;
      (self.waitHUD('Validating APIKey...'),
        e.startsWith('sk-')
          ? (i = await subscriptionNetwork.validateAPIKey(e)).success
            ? ((e = i.apikey),
              MNButton.setColor(self.showAPIKeyButton, '#e06c75'),
              (self.apikeyInput.text = e),
              (self.apikeyInput.editable = !0),
              self.showHUD('Save APIKey'),
              subscriptionConfig.save(),
              (await MNUtil.confirm('Activate now?', '现在激活?')) && self.activate())
            : 'error' in i
              ? i.error.includes('网络')
                ? MNUtil.confirm('验证 APIKey 时发生错误\n请尝试切换URL', i.error)
                : MNUtil.confirm('验证 APIKey 时发生错误', i.error)
              : MNUtil.confirm('Invalid APIKey', '无效的APIKey\n\n' + e)
          : (await MNUtil.confirm('Invalid APIKey', '无效的APIKey\n应为sk-xxxxxx\n\n是否要打开订阅页面？')) &&
            (MNConnection.loadFile(
              self.docview,
              subscriptionUtils.mainPath + '/newkey.html',
              subscriptionUtils.mainPath
            ),
            self.checkDocview()),
        MNUtil.stopHUD());
    },
    toggleApikey: function (t) {
      var e;
      self.apikeyInput.text && self.apikeyInput.text.trim()
        ? ((self.apikeyInput.text = ''),
          (self.apikeyInput.editable = !1),
          MNButton.setColor(self.showAPIKeyButton, '#a2a2a2'))
        : ((self.apikeyInput.editable = !0),
          subscriptionConfig.config.apikey.trim()
            ? ((e = subscriptionConfig.APIKey),
              (self.apikeyInput.text = e),
              (self.showAPIKeyButton.color = '#e06c75'),
              MNUtil.copy(e),
              self.showHUD('APIKey 已复制'))
            : ((self.showAPIKeyButton.color = '#a2a2a2'), self.showHUD('No APIKey')));
    },
    refreshUsage: async function (t) {
      var e,
        i = getSubscriptionController(),
        o = (i.waitHUD('Fetching usage'), await subscriptionNetwork.getUsage());
      (MNUtil.log({ message: 'usage', detail: o }),
        MNUtil.stopHUD(),
        'error' in o
          ? o.noQuota
            ? (i.usageButton.setTitleForState(o.error, 0),
              (await MNUtil.confirm('订阅Key额度不足\n是否充值?', JSON.stringify(o, void 0, 2))) &&
                i.loadRechargePage())
            : o.disabled
              ? (i.usageButton.setTitleForState(o.error, 0),
                MNUtil.confirm('订阅Key被禁用', JSON.stringify(o, void 0, 2)))
              : i.usageButton.setTitleForState(o.error, 0)
          : ((e = 99999999 < o.total ? '' : ' / ' + o.total.toFixed(2)),
            i.usageButton.setTitleForState('Usage: ' + (o.usage / 100).toFixed(2) + e, 0)));
    },
    showDetail: async function (t) {
      await self.checkDocview();
      var e = subscriptionConfig.APIKey;
      e
        ? (self.showHUD('Loading...'),
          self.docview.loadFileURLAllowingReadAccessToURL(
            NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/usage.html'),
            NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/')
          ),
          await MNUtil.delay(0.5),
          self.runJavaScript(`window.fetchData("${e}","${subscriptionConfig.URL}")`, 'docview'))
        : self.showHUD('No APIKey');
    },
    chooseActivateDays: function (t) {
      var e;
      (self.popoverController && self.popoverController.dismissPopoverAnimated(!0),
        subscriptionConfig.APIKey
          ? (!subscriptionConfig.config.activated && subscriptionConfig.config.subscriptionDaysRemain) ||
            (!subscriptionConfig.isSubscribed() && subscriptionConfig.config.subscriptionDaysRemain)
            ? ((subscriptionConfig.config.activated = !0),
              (subscriptionConfig.config.subscribedDay = subscriptionUtils.getToday()),
              (subscriptionConfig.config.subscriptionDaysRemain = subscriptionConfig.config.subscriptionDaysRemain - 1),
              subscriptionConfig.save(),
              subscriptionUtils.refreshAddonCommands(),
              self.activationStatus.setTitleForState(subscriptionConfig.getStatus(), 0),
              subscriptionUtils.showHUD(
                'Subscription days remian: ' + subscriptionConfig.config.subscriptionDaysRemain
              ))
            : ((e = 'activate:'),
              (e = [
                MNUtil.tableItem('1 day', self, e, 1),
                MNUtil.tableItem('5 days', self, e, 5),
                MNUtil.tableItem('10 days', self, e, 10),
                MNUtil.tableItem('15 days', self, e, 15),
                MNUtil.tableItem('20 days', self, e, 20),
                MNUtil.tableItem('25 days', self, e, 25),
                MNUtil.tableItem('30 days', self, e, 30),
              ]),
              (self.popoverController = MNUtil.getPopoverAndPresent(t, e, 100, 1)))
          : (MNConnection.loadFile(
              self.docview,
              subscriptionUtils.mainPath + '/newkey.html',
              subscriptionUtils.mainPath
            ),
            self.checkDocview()));
    },
    activate: async function (t = 1) {
      self.popoverController && self.popoverController.dismissPopoverAnimated(!0);
      var e = self.apikeyInput.text.trim();
      if (
        (e && (subscriptionConfig.config.apikey = e), 10 <= t) &&
        !(await MNUtil.confirm(
          `You'll be charged $${0.1 * t} for a ${t}-day subscription. Please confirm`,
          `订阅${t}天会扣除${0.1 * t}$额度. 请确认`
        ))
      )
        return;
      var i,
        e = await subscriptionNetwork.subscribe(t);
      (MNUtil.stopHUD(),
        e.success
          ? 'error' in (t = await subscriptionNetwork.getUsage())
            ? self.usageButton.setTitleForState(t.error, 0)
            : ((i = 99999999 < t.total ? '' : ' / ' + t.total.toFixed(2)),
              self.usageButton.setTitleForState('Usage: ' + (t.usage / 100).toFixed(2) + i, 0))
          : ((subscriptionConfig.config.autoSubscription = !1),
            self.autoSubscription.setTitleForState(
              subscriptionConfig.config.autoSubscription ? 'Auto subscription: ✅' : 'Auto subscription: ❌',
              0
            ),
            subscriptionConfig.save(),
            e.noQuota
              ? (self.usageButton.setTitleForState('订阅Key额度不足', 0),
                (await MNUtil.confirm('订阅Key额度不足\n是否充值?', e.error.message)) && self.loadRechargePage())
              : e.disabled
                ? (self.usageButton.setTitleForState('订阅Key已被禁用', 0),
                  MNUtil.confirm('订阅Key已被禁用', e.error.message))
                : e.error?.message
                  ? MNUtil.confirm('订阅时发生错误', e.error)
                  : MNUtil.confirm('订阅时发生错误')));
    },
    toggleAutoSubscription: async function (t) {
      try {
        var e = subscriptionConfig.getConfig('autoSubscription');
        ((subscriptionConfig.config.autoSubscription = !e),
          subscriptionConfig.save(),
          self.autoSubscription.setTitleForState(
            subscriptionConfig.config.autoSubscription ? 'Auto subscription: ✅' : 'Auto subscription: ❌',
            0
          ));
      } catch (t) {
        subscriptionUtils.addErrorLog(t, 'toggleAutoSubscription');
      }
    },
    changeOpacity: function (t) {
      self.popoverController && self.popoverController.dismissPopoverAnimated(!0);
      var e = [
        { title: '100%', object: self, selector: 'changeOpacityTo:', param: 1 },
        { title: '90%', object: self, selector: 'changeOpacityTo:', param: 0.9 },
        { title: '80%', object: self, selector: 'changeOpacityTo:', param: 0.8 },
        { title: '70%', object: self, selector: 'changeOpacityTo:', param: 0.7 },
        { title: '60%', object: self, selector: 'changeOpacityTo:', param: 0.6 },
        { title: '50%', object: self, selector: 'changeOpacityTo:', param: 0.5 },
      ];
      self.popoverController = subscriptionUtils.getPopoverAndPresent(t, e, 100);
    },
    changeOpacityTo: function (t) {
      self.view.layer.opacity = t;
    },
    closeButtonTapped: async function () {
      (self.toMinimode(!0), self.blur());
    },
    refreshButtonTapped: async function (t) {
      let e = getSubscriptionController();
      switch (subscriptionConfig.lastView) {
        case 'subscriptionView':
          var i = await subscriptionNetwork.getUsage();
          return (
            'error' in i
              ? e.usageButton.setTitleForState(i.error, 0)
              : e.usageButton.setTitleForState(`Usage: ${(i.usage / 100).toFixed(2)} / ` + i.total.toFixed(2), 0),
            void e.view.setNeedsLayout()
          );
        case 'log':
          return (e.clearLogs(), void e.view.setNeedsLayout());
        case 'webview':
          return void (t.clickDate && Date.now() - t.clickDate < 500
            ? (e.webview.loadFileURLAllowingReadAccessToURL(
                NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/sidebar.html'),
                NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/')
              ),
              MNUtil.delay(0.5).then(() => {
                e.refreshSidebar(!1, subscriptionConfig.lastView);
              }))
            : (e.refreshSidebar(!0, subscriptionConfig.lastView), (t.clickDate = Date.now())));
        case 'webviewAlpha':
        case 'shareNotebooks':
        case 'shareDocuments':
          return void (t.clickDate && Date.now() - t.clickDate < 500
            ? (e.webview.loadFileURLAllowingReadAccessToURL(
                NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/sidebar.html'),
                NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/')
              ),
              MNUtil.delay(0.5).then(() => {
                e.refreshSidebar(!1, subscriptionConfig.lastView);
              }))
            : (e.refreshSidebar(!0, subscriptionConfig.lastView), (t.clickDate = Date.now())));
      }
      e.view.setNeedsLayout();
    },
    onMoveGesture: function (t) {
      try {
        var e,
          i,
          o,
          s,
          n,
          r,
          a = self.view.frame;
        if (1 === t.state)
          ((e = t.translationInView(t.view)),
            (i = t.locationInView(MNUtil.currentWindow)),
            self.setMiniColor(!1),
            (self.base = MNUtil.genFrame(a.x - i.x + e.x, a.y - i.y + e.y, a.width, a.height)));
        else if (
          (2 === t.state &&
            ((o = MNUtil.currentWindow.bounds),
            (s = t.locationInView(MNUtil.currentWindow)),
            (n = MNUtil.constrain(self.base.y + s.y, 0, o.height - 15)),
            (r = MNUtil.constrain(self.base.x + s.x, -0.5 * self.base.width, o.width - 40)),
            (self.view.frame = MNUtil.genFrame(r, n, self.base.width, self.base.height)),
            (self.currentFrame = self.view.frame),
            (self.custom = !1)),
          3 === t.state && self.miniMode)
        ) {
          var c = subscriptionUtils.topOffset,
            l = subscriptionUtils.bottomOffset;
          let i = {
            left: a.x,
            right: MNUtil.currentWindow.frame.width - a.x - a.width,
            top: a.y - c,
            bottom: MNUtil.currentWindow.frame.height - a.y - a.height - l,
          };
          if (i.left < 20 && i.top < 20) subscriptionConfig.config.customMode = 'leftTop';
          else if (i.right < 20 && i.top < 20) subscriptionConfig.config.customMode = 'rightTop';
          else if (i.left < 20 && i.bottom < 20) subscriptionConfig.config.customMode = 'leftBottom';
          else if (i.right < 20 && i.bottom < 20) subscriptionConfig.config.customMode = 'rightBottom';
          else {
            var d = Object.keys(i).reduce((t, e) => (i[t] < i[e] ? t : e));
            if (!['left', 'right', 'top', 'bottom'].includes(d)) return void MNUtil.showHUD('No edge found');
            subscriptionConfig.config.customMode = d;
          }
          let e = subscriptionConfig.getMiniFrame(a, subscriptionConfig.config.customMode);
          ((self.onAnimate = !0),
            MNUtil.animate(() => {
              ((self.view.frame = e), (self.currentFrame = self.view.frame), (self.custom = !1));
            }).then(() => {
              ((self.onAnimate = !1),
                (subscriptionConfig.config.miniFrame = e),
                subscriptionConfig.save(),
                self.setMiniColor(!0));
              var t = self.lastFrame;
              self.lastFrame = subscriptionUtils.calcLastFrame(t);
            }));
        }
      } catch (t) {
        subscriptionUtils.addErrorLog(t, 'onMoveGesture');
      }
    },
    onResizeGesture0: function (t) {
      self.custom = !1;
      var e = t.view.frame,
        i = t.locationInView(self.view),
        o = self.view.frame;
      let s = i.x + 0.5 * e.width;
      i = self.view.frame.height;
      (s <= 280 && (s = 280),
        (self.view.frame = { x: o.x, y: o.y, width: s, height: i }),
        (self.currentFrame = self.view.frame),
        3 === t.state && MNUtil.currentWindow.bringSubviewToFront(self.view));
    },
    onResizeGesture: function (t) {
      ((self.custom = !1), (self.dynamic = !1));
      var e = t.view.frame,
        i = t.locationInView(t.view),
        o = self.view.frame;
      let s = i.x + e.x + 0.3 * e.width,
        n = i.y + e.y + 0.3 * e.height;
      (s <= 280 && (s = 280),
        n <= subscriptionConfig.frameHeight && (n = subscriptionConfig.frameHeight),
        (self.view.frame = { x: o.x, y: o.y, width: s, height: n }),
        (self.currentFrame = self.view.frame),
        3 === t.state && MNUtil.currentWindow.bringSubviewToFront(self.view));
    },
    onLongPress: async function (t) {
      var e;
      1 === t.state &&
        ((e = getSubscriptionController()),
        (t = t.view).url ? MNUtil.openURL(t.url) : t.id && 'changeview' === t.id && e.changeView(t));
    },
  }
);
function tryCatch(e) {
  return function (...t) {
    try {
      return e(...t);
    } catch (t) {
      return (MNUtil.showHUD(t), null);
    }
  };
}
((subscriptionController.prototype.refresh = async function (t = !0) {
  try {
    switch (subscriptionConfig.lastView) {
      case 'subscriptionView':
        ((this.subscriptionView.hidden = !1),
          (this.webview.hidden = !0),
          this.moveButton.setTitle('Subscription Manager'),
          (subscriptionConfig.config.lastView = 'subscriptionView'));
        break;
      case 'webview':
        ((this.subscriptionView.hidden = !0),
          (this.webview.hidden = !1),
          this.moveButton.setTitle('Update Manager'),
          t &&
            MNUtil.delay(0.5).then(() => {
              this.refreshSidebar(!0, 'webview');
            }),
          (subscriptionConfig.config.lastView = 'webview'));
        break;
      case 'webviewAlpha':
        ((this.subscriptionView.hidden = !0),
          (this.webview.hidden = !1),
          this.moveButton.setTitle('Update Manager (α)'),
          t &&
            MNUtil.delay(0.5).then(() => {
              this.refreshSidebar(!0, 'webviewAlpha');
            }),
          (subscriptionConfig.config.lastView = 'webviewAlpha'));
        break;
      case 'shareNotebooks':
        ((this.subscriptionView.hidden = !0),
          (this.webview.hidden = !1),
          this.moveButton.setTitle('Shared Notebooks'),
          t &&
            MNUtil.delay(0.5).then(() => {
              this.refreshSidebar(!0, 'shareNotebooks');
            }),
          (subscriptionConfig.config.lastView = 'shareNotebooks'));
        break;
      case 'shareDocuments':
        ((this.subscriptionView.hidden = !0),
          (this.webview.hidden = !1),
          this.moveButton.setTitle('Shared Documents'),
          t &&
            MNUtil.delay(0.5).then(() => {
              this.refreshSidebar(!0, 'shareDocuments');
            }),
          (subscriptionConfig.config.lastView = 'shareDocuments'));
        break;
      case 'log':
        ((this.subscriptionView.hidden = !0),
          (this.webview.hidden = !1),
          MNButton.setTitle(this.moveButton, 'Log Viewer', void 0, !0),
          this.webview.loadFileURLAllowingReadAccessToURL(
            NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/log.html'),
            NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/')
          ),
          (subscriptionConfig.config.lastView = 'log'));
        var e = this.view.frame;
        (e.width < 500 && (e.width = 500),
          e.height < 500 && (e.height = 500),
          (this.view.frame = e),
          (this.currentFrame = e),
          this.view.setNeedsLayout(),
          await MNUtil.delay(0.5),
          this.showLog(MNLog.logs));
    }
  } catch (t) {
    subscriptionUtils.addErrorLog(t, 'refresh');
  }
}),
  (subscriptionController.prototype.init = async function () {
    try {
      ((this.logoImage = MNUtil.getImage(subscriptionUtils.mainPath + '/dollar.png', 2)),
        (this.logImage = MNUtil.getImage(subscriptionUtils.mainPath + '/log.png', 2)),
        (this.appImage = MNUtil.getImage(subscriptionUtils.mainPath + '/app.png', 2)),
        (this.bothModeImage = MNUtil.getImage(subscriptionUtils.mainPath + '/bothMode.png', 2)),
        (this.goforwardImage = MNUtil.getImage(subscriptionUtils.mainPath + '/goforward.png', 2)),
        (this.screenImage = MNUtil.getImage(subscriptionUtils.mainPath + '/screen.png', 2)),
        (this.snipasteImage = MNUtil.getImage(subscriptionUtils.mainPath + '/snipaste.png', 2)),
        (this.closeImage = MNUtil.getImage(subscriptionUtils.mainPath + '/stop.png', 2)),
        (this.view.layer.shadowOffset = { width: 0, height: 0 }),
        (this.view.layer.shadowRadius = 15),
        (this.view.layer.shadowOpacity = 0.5),
        (this.view.layer.shadowColor = UIColor.colorWithWhiteAlpha(0.5, 1)),
        (this.view.layer.opacity = 1),
        (this.view.layer.cornerRadius = 15),
        (this.view.backgroundColor = UIColor.blackColor().colorWithAlphaComponent(1)),
        (this.highlightColor = UIColor.blendedColor(
          UIColor.colorWithHexString('#2c4d81').colorWithAlphaComponent(0.8),
          Application.sharedInstance().defaultTextColor,
          0.8
        )));
      var t = subscriptionConfig.isSubscribed() ? '#457bd3' : '#677180',
        e =
          ((this.moveButton = MNButton.new(
            {
              title: 'Subscription Manager',
              bold: !0,
              font: 16,
              radius: 8,
              color: t,
              highlight: this.highlightColor,
              opacity: 0.8,
              alpha: 0.4,
              id: 'changeview',
            },
            this.view
          )),
          this.moveButton.addClickAction(this, 'changeView:'),
          this.moveButton.addLongPressGesture(this, 'onLongPress:'),
          (this.closeButton = MNButton.new(
            { image: subscriptionUtils.mainPath + '/stop.png', radius: 8, color: '#e06c75', opacity: 0.8 },
            this.view
          )),
          this.closeButton.addClickAction(this, 'closeButtonTapped:'),
          (this.refreshButton = MNButton.new(
            { image: subscriptionUtils.mainPath + '/reload.png', radius: 8, color: '#457bd3', opacity: 0.8 },
            this.view
          )),
          this.refreshButton.addClickAction(this, 'refreshButtonTapped:'),
          (this.subscriptionView = UIView.new()),
          (this.subscriptionView.backgroundColor = UIColor.whiteColor().colorWithAlphaComponent(0.8)),
          (this.subscriptionView.layer.cornerRadius = 13),
          (this.subscriptionView.hidden = !1),
          this.view.addSubview(this.subscriptionView),
          (this.webview = new UIWebView(this.view.bounds)),
          (this.webview.backgroundColor = UIColor.whiteColor()),
          (this.webview.scalesPageToFit = !0),
          (this.webview.autoresizingMask = 18),
          (((this.webview.delegate = this).webview.scrollView.delegate = this).webview.scrollView.bounces = !1),
          (this.webview.layer.cornerRadius = 15),
          (this.webview.layer.masksToBounds = !0),
          (this.webview.layer.borderColor = MNUtil.hexColorAlpha('#9bb2d6', 0.8)),
          (this.webview.layer.borderWidth = 0),
          (this.webview.sidebar = !0),
          (this.docview = new UIWebView(this.view.bounds)),
          (this.docview.backgroundColor = UIColor.whiteColor()),
          (this.docview.scalesPageToFit = !0),
          (this.docview.autoresizingMask = 18),
          (((this.docview.delegate = this).docview.scrollView.delegate = this).docview.scrollView.bounces = !1),
          (this.docview.layer.cornerRadius = 15),
          (this.docview.layer.masksToBounds = !0),
          (this.docview.layer.borderColor = MNUtil.hexColorAlpha('#9bb2d6', 0.8)),
          (this.docview.layer.borderWidth = 0),
          (this.docview.sidebar = !1),
          (this.docview.customUserAgent =
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15'),
          (this.highlightColor = UIColor.blendedColor(
            MNUtil.hexColorAlpha('#2c4d81', 0.8),
            MNUtil.app.defaultTextColor,
            0.8
          )),
          (this.webview.hidden = !0),
          (this.docview.hidden = !0),
          (this.webview.lastOffset = 0),
          this.view.addSubview(this.webview),
          this.view.addSubview(this.docview),
          this.webview.loadFileURLAllowingReadAccessToURL(
            NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/sidebar.html'),
            NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/')
          ),
          (this.activationStatus = MNButton.new(
            {
              title: subscriptionConfig.getStatus(),
              bold: !0,
              font: 14,
              radius: 10,
              color: '#457bd3',
              highlight: this.highlightColor,
              opacity: 0.8,
            },
            this.subscriptionView
          )),
          this.activationStatus.addClickAction(this, 'chooseActivateDays:'),
          subscriptionConfig.getConfig('autoSubscription'));
      ((this.autoSubscription = MNButton.new(
        {
          title: e ? 'Auto subscription: ✅' : 'Auto subscription: ❌',
          bold: !0,
          font: 14,
          radius: 10,
          color: '#457bd3',
          highlight: this.highlightColor,
          opacity: 0.8,
        },
        this.subscriptionView
      )),
        this.autoSubscription.addClickAction(this, 'toggleAutoSubscription:'),
        (this.freeUsage = MNButton.new(
          {
            title: subscriptionConfig.getFreeUsage(),
            bold: !0,
            font: 14,
            radius: 10,
            color: '#457bd3',
            highlight: this.highlightColor,
            opacity: 0.8,
          },
          this.subscriptionView
        )),
        (this.usageButton = MNButton.new(
          {
            title: 'Refresh Usage',
            bold: !0,
            font: 14,
            radius: 10,
            color: '#457bd3',
            highlight: this.highlightColor,
            opacity: 0.8,
          },
          this.subscriptionView
        )),
        this.usageButton.addClickAction(this, 'refreshUsage:'),
        (this.usageDetailButton = MNButton.new(
          {
            title: 'Usage Detail',
            bold: !0,
            font: 14,
            radius: 10,
            color: '#457bd3',
            highlight: this.highlightColor,
            opacity: 0.8,
          },
          this.subscriptionView
        )),
        this.usageDetailButton.addClickAction(this, 'showDetail:'),
        (this.URLButton = MNButton.new(
          {
            title: subscriptionUtils.getURLTitle(),
            bold: !0,
            font: 14,
            radius: 10,
            color: '#457bd3',
            highlight: this.highlightColor,
            opacity: 0.8,
          },
          this.subscriptionView
        )),
        this.URLButton.addClickAction(this, 'changeURL:'),
        (this.apikeyInput = this.creatTextView('subscriptionView', void 0, 0.75)),
        (this.apikeyInput.editable = !1),
        (this.apikeyInput.text = ''),
        this.apikeyInput.becomeFirstResponder(),
        (this.pasteKeyButton = MNButton.new(
          {
            title: 'Paste',
            bold: !0,
            font: 14,
            radius: 8,
            color: '#e06c75',
            highlight: this.highlightColor,
            opacity: 0.8,
          },
          this.subscriptionView
        )),
        this.pasteKeyButton.addClickAction(this, 'pasteApiKey:'),
        (this.showAPIKeyButton = MNButton.new(
          { image: subscriptionUtils.mainPath + '/vision.png', radius: 8, color: '#a2a2a2', opacity: 0.8 },
          this.subscriptionView
        )),
        this.showAPIKeyButton.addClickAction(this, 'toggleApikey:'),
        (this.DMButton = MNButton.new(
          {
            title: 'Show APIKey',
            bold: !0,
            font: 14,
            highlight: this.highlightColor,
            radius: 10,
            color: '#e06c75',
            opacity: 0.8,
            url: 'https://ifdian.net/message/929697869e9311eea6745254001e7c00',
          },
          this.subscriptionView
        )),
        this.DMButton.addClickAction(this, 'getApiKey:'),
        this.DMButton.addLongPressGesture(this, 'onLongPress:'),
        (this.buyAPIKeyButton = MNButton.new(
          {
            title: 'Buy APIKey',
            bold: !0,
            font: 14,
            highlight: this.highlightColor,
            radius: 10,
            color: '#9bb2d6',
            id: 'chooseAPIKeyForQuota',
          },
          this.subscriptionView
        )),
        this.buyAPIKeyButton.addClickAction(this, 'openRechargePage:'),
        (this.helperButton = MNButton.new(
          {
            title: 'Have questions?',
            bold: !0,
            font: 14,
            highlight: this.highlightColor,
            radius: 10,
            color: '#9bb2d6',
            id: 'showHelper',
          },
          this.subscriptionView
        )),
        this.helperButton.addClickAction(this, 'showHelper:'),
        (this.resizeButton = MNButton.new(
          { image: subscriptionUtils.mainPath + '/curve.png', radius: 10, color: '#e06c75', opacity: 0.8, alpha: 0 },
          this.view
        )),
        this.moveButton.addPanGesture(this, 'onMoveGesture:'),
        this.closeButton.addPanGesture(this, 'onResizeGesture0:'),
        this.resizeButton.addPanGesture(this, 'onResizeGesture:'),
        this.toMinimode(!1));
    } catch (t) {
      subscriptionUtils.addErrorLog(t, 'init');
    }
  }),
  (subscriptionController.prototype.show = function (t) {
    let e = this.view.frame,
      i = this.view.layer.opacity;
    if ('marginnote3' === subscriptionUtils.version.version) this.view.hidden = !1;
    else {
      let t = subscriptionConfig.lastView;
      ((this.view.layer.opacity = 0.2),
        'log' === t &&
          (e.width < 500 && (e.width = 500),
          e.x + 500 > MNUtil.studyWidth && (e.x = MNUtil.studyWidth - 500),
          e.height < 500 && (e.height = 500),
          e.y + 500 > MNUtil.studyHeight) &&
          (e.y = MNUtil.studyHeight - 500),
        (this.view.hidden = !1),
        (this.moveButton.hidden = !0),
        (this.closeButton.hidden = !0),
        (this.activationStatus.hidden = !0),
        (this.freeUsage.hidden = !0),
        (this.autoSubscription.hidden = !0),
        (this.usageButton.hidden = !0),
        (this.apikeyInput.hidden = !0),
        (this.pasteKeyButton.hidden = !0),
        (this.refreshButton.hidden = !0),
        MNUtil.currentWindow.bringSubviewToFront(this.view),
        this.activationStatus.setTitle(subscriptionConfig.getStatus()),
        this.freeUsage.setTitle(subscriptionConfig.getFreeUsage()),
        MNUtil.animate(() => {
          ((this.view.layer.opacity = i), (this.view.frame = e), (this.currentFrame = e));
        }).then(() => {
          ((this.view.layer.borderWidth = 0),
            (this.moveButton.hidden = !1),
            (this.closeButton.hidden = !1),
            (this.activationStatus.hidden = !1),
            (this.freeUsage.hidden = !1),
            (this.autoSubscription.hidden = !1),
            (this.pasteKeyButton.hidden = !1),
            (this.apikeyInput.hidden = !1),
            (this.usageButton.hidden = !1),
            (this.refreshButton.hidden = !1),
            this.refreshLayout(),
            'webview' === t
              ? this.refreshSidebar(!0, !1)
              : 'webviewAlpha' === t
                ? this.refreshSidebar(!0, !0)
                : 'log' === t && this.showLog(MNLog.logs));
        }));
    }
  }),
  (subscriptionController.prototype.hide = function (t) {
    let e = this.view.layer.opacity;
    'marginnote3' === subscriptionUtils.version.version
      ? (this.view.hidden = !0)
      : ((this.moveButton.hidden = !0),
        (this.closeButton.hidden = !0),
        (this.activationStatus.hidden = !0),
        (this.freeUsage.hidden = !0),
        (this.autoSubscription.hidden = !0),
        (this.pasteKeyButton.hidden = !0),
        (this.usageButton.hidden = !0),
        (this.apikeyInput.hidden = !0),
        (this.refreshButton.hidden = !0),
        MNUtil.animate(() => {
          this.view.layer.opacity = 0.2;
        }).then(() => {
          ((this.view.hidden = !0), (this.view.layer.opacity = e));
        }));
  }),
  (subscriptionController.prototype.creatTextView = function (t = 'view', e = '#c0bfbf', i = 0.9) {
    var o = UITextView.new();
    return (
      (o.font = UIFont.systemFontOfSize(15)),
      (o.layer.cornerRadius = 8),
      (o.backgroundColor = subscriptionUtils.hexColorAlpha(e, i)),
      (o.textColor = UIColor.blackColor()),
      (o.bounces = !0),
      this[t].addSubview(o),
      o
    );
  }),
  (subscriptionController.prototype.refreshLayout = function () {
    this.freeUsage.setTitleForState(subscriptionConfig.getFreeUsage(), 0);
  }),
  (subscriptionController.prototype.runJavaScript = async function (i, o = 'webview') {
    return new Promise((e, t) => {
      try {
        this[o].evaluateJavaScript(i, (t) => {
          e(t);
        });
      } catch (t) {
        (subscriptionUtils.addErrorLog(t, 'runJavaScript'), e(0));
      }
    });
  }),
  (subscriptionController.prototype.getApikeyFromWebview = async function (i) {
    return new Promise((e, t) => {
      i.evaluateJavaScript(
        'JSON.stringify(Array.from(document.getElementsByClassName("msg")).map(msg => msg.innerText).filter(msg=>msg.startsWith("sk")))',
        async (t) => {
          var t = JSON.parse(t);
          (t.length && ((t = t.at(-1)) === subscriptionConfig.APIKey && e(void 0), e(t)), e(void 0));
        }
      );
    });
  }),
  (subscriptionController.prototype.refreshSidebar = async function (e = !0, r = 'webview') {
    try {
      let t;
      if (e) {
        if (!this.view.hidden)
          switch (r) {
            case 'webview':
              this.waitHUD('Retrieving updates...', this.webview);
              break;
            case 'shareNotebooks':
              this.waitHUD('Retrieving notebooks...', this.webview);
              break;
            case 'shareDocuments':
              this.waitHUD('Retrieving documents...', this.webview);
              break;
            case 'webviewAlpha':
              this.waitHUD('Retrieving updates (α)...', this.webview);
          }
        switch (r) {
          case 'webview':
            ((t = await subscriptionNetwork.readFileFromWebdav('mnaddon.json')),
              (subscriptionConfig.config.alpha = !1),
              (this.lastRefreshView = 'webview'),
              (this.lastRefreshTime = Date.now()));
            break;
          case 'shareNotebooks':
            ((t = await subscriptionNetwork.readFileFromWebdav('shareNotebooks.json')),
              (this.lastRefreshView = 'shareNotebooks'),
              (this.lastRefreshTime = Date.now()));
            break;
          case 'shareDocuments':
            ((t = await subscriptionNetwork.readFileFromWebdav('shareDocuments.json')),
              (this.lastRefreshView = 'shareDocuments'),
              (this.lastRefreshTime = Date.now()));
            break;
          case 'webviewAlpha':
            ((t = await subscriptionNetwork.readFileFromWebdav('mnaddonAlpha.json')),
              (subscriptionConfig.config.alpha = !0),
              (this.lastRefreshView = 'webviewAlpha'),
              (this.lastRefreshTime = Date.now()));
        }
        (MNUtil.stopHUD(), (subscriptionConfig.mnaddon = t));
      } else t = subscriptionConfig.mnaddon;
      let i = subscriptionUtils.getLocalMNAddonVersions(),
        o = [],
        s = [],
        n = [];
      if (!Array.isArray(t))
        return t.timeout && t.message
          ? void MNUtil.showHUD(t.message)
          : (this.waitHUD('Retrying...'), await MNUtil.delay(1), void this.refreshSidebarReTry(e, r));
      ((t = t.map((t) => {
        var e = t.id;
        if (e in i)
          switch (subscriptionUtils.compareVersions(t.version, i[e])) {
            case 0:
              ((t.action = 'reinstall'), s.push(t));
              break;
            case 1:
              ((t.action = 'update'), o.push(t));
              break;
            case -1:
              ((t.action = 'reinstall'), s.push(t));
          }
        else n.push(t);
        return t;
      })),
        0 < o.length && ((a = o.map((t) => t.name)), MNUtil.showHUD('Updates available: ' + a.join(', '))));
      var a,
        c = o.concat(s).concat(n);
      (this.runJavaScript(`updateFromNative(\`${encodeURIComponent(JSON.stringify(c))}\`)`), subscriptionConfig.save());
    } catch (t) {
      subscriptionUtils.addErrorLog(t, 'refreshSidebar');
    }
  }),
  (subscriptionController.prototype.refreshSidebarReTry = async function (e = !0, r = 'webview') {
    try {
      let t;
      if (e) {
        if (!this.view.hidden)
          switch (r) {
            case 'webview':
              this.waitHUD('Retrieving updates...', this.webview);
              break;
            case 'shareNotebooks':
              this.waitHUD('Retrieving notebooks...', this.webview);
              break;
            case 'shareDocuments':
              this.waitHUD('Retrieving documents...', this.webview);
              break;
            case 'webviewAlpha':
              this.waitHUD('Retrieving updates (α)...', this.webview);
          }
        switch (r) {
          case 'webview':
            ((t = await subscriptionNetwork.readFileFromWebdav('mnaddon.json', !0)),
              (subscriptionConfig.config.alpha = !1),
              (this.lastRefreshView = 'webview'),
              (this.lastRefreshTime = Date.now()));
            break;
          case 'shareNotebooks':
            ((t = await subscriptionNetwork.readFileFromWebdav('shareNotebooks.json', !0)),
              (this.lastRefreshView = 'shareNotebooks'),
              (this.lastRefreshTime = Date.now()));
            break;
          case 'shareDocuments':
            ((t = await subscriptionNetwork.readFileFromWebdav('shareDocuments.json', !0)),
              (this.lastRefreshView = 'shareDocuments'),
              (this.lastRefreshTime = Date.now()));
            break;
          case 'webviewAlpha':
            ((t = await subscriptionNetwork.readFileFromWebdav('mnaddonAlpha.json', !0)),
              (subscriptionConfig.config.alpha = !0),
              (this.lastRefreshView = 'webviewAlpha'),
              (this.lastRefreshTime = Date.now()));
        }
        (MNUtil.stopHUD(), (subscriptionConfig.mnaddon = t));
      } else t = subscriptionConfig.mnaddon;
      let i = subscriptionUtils.getLocalMNAddonVersions(),
        o = [],
        s = [],
        n = [];
      var a, c;
      Array.isArray(t)
        ? ((c =
            ((t = t.map((t) => {
              var e = t.id;
              if (e in i)
                switch (subscriptionUtils.compareVersions(t.version, i[e])) {
                  case 0:
                    ((t.action = 'reinstall'), s.push(t));
                    break;
                  case 1:
                    ((t.action = 'update'), o.push(t));
                    break;
                  case -1:
                    ((t.action = 'reinstall'), s.push(t));
                }
              else n.push(t);
              return t;
            })),
            0 < o.length && ((a = o.map((t) => t.name)), MNUtil.showHUD('Updates available: ' + a.join(', '))),
            o.concat(s).concat(n))),
          this.runJavaScript(`updateFromNative(\`${encodeURIComponent(JSON.stringify(c))}\`)`),
          subscriptionConfig.save())
        : t.timeout && t.message
          ? MNUtil.showHUD(t.message)
          : subscriptionUtils.addErrorLog('获取商店内容失败', 'refreshSidebarReTry', t);
    } catch (t) {
      subscriptionUtils.addErrorLog(t, 'refreshSidebar');
    }
  }),
  (subscriptionController.prototype.refreshSidebarReTry123 = async function (e = !0, r = 'webview') {
    try {
      let t;
      if (e) {
        if (!this.view.hidden)
          switch (r) {
            case 'webview':
              this.waitHUD('Retrieving updates...', this.webview);
              break;
            case 'shareNotebooks':
              this.waitHUD('Retrieving notebooks...', this.webview);
              break;
            case 'shareDocuments':
              this.waitHUD('Retrieving documents...', this.webview);
              break;
            case 'webviewAlpha':
              this.waitHUD('Retrieving updates (α)...', this.webview);
          }
        switch (r) {
          case 'webview':
            ((t = await subscriptionNetwork.readFileFrom123('mnaddon.json', !0)),
              (subscriptionConfig.config.alpha = !1),
              (this.lastRefreshView = 'webview'),
              (this.lastRefreshTime = Date.now()));
            break;
          case 'shareNotebooks':
            ((t = await subscriptionNetwork.readFileFrom123('shareNotebooks.json', !0)),
              (this.lastRefreshView = 'shareNotebooks'),
              (this.lastRefreshTime = Date.now()));
            break;
          case 'shareDocuments':
            ((t = await subscriptionNetwork.readFileFrom123('shareDocuments.json', !0)),
              (this.lastRefreshView = 'shareDocuments'),
              (this.lastRefreshTime = Date.now()));
            break;
          case 'webviewAlpha':
            ((t = await subscriptionNetwork.readFileFrom123('mnaddonAlpha.json', !0)),
              (subscriptionConfig.config.alpha = !0),
              (this.lastRefreshView = 'webviewAlpha'),
              (this.lastRefreshTime = Date.now()));
        }
        (MNUtil.stopHUD(), (subscriptionConfig.mnaddon = t));
      } else t = subscriptionConfig.mnaddon;
      let i = subscriptionUtils.getLocalMNAddonVersions(),
        o = [],
        s = [],
        n = [];
      var a, c;
      Array.isArray(t)
        ? ((c =
            ((t = t.map((t) => {
              var e = t.id;
              if (e in i)
                switch (subscriptionUtils.compareVersions(t.version, i[e])) {
                  case 0:
                    ((t.action = 'reinstall'), s.push(t));
                    break;
                  case 1:
                    ((t.action = 'update'), o.push(t));
                    break;
                  case -1:
                    ((t.action = 'reinstall'), s.push(t));
                }
              else n.push(t);
              return t;
            })),
            0 < o.length && ((a = o.map((t) => t.name)), MNUtil.showHUD('Updates available: ' + a.join(', '))),
            o.concat(s).concat(n))),
          this.runJavaScript(`updateFromNative(\`${encodeURIComponent(JSON.stringify(c))}\`)`),
          subscriptionConfig.save())
        : t.timeout && t.message
          ? MNUtil.showHUD(t.message)
          : subscriptionUtils.addErrorLog('获取商店内容失败', 'refreshSidebarReTry', t);
    } catch (t) {
      subscriptionUtils.addErrorLog(t, 'refreshSidebar');
    }
  }),
  (subscriptionController.prototype.activate = async function (t = 1) {
    MNUtil.showHUD('activate');
    var e = this.apikeyInput.text.trim();
    (e ? (subscriptionConfig.APIKey = e) : subscriptionConfig.APIKey,
      subscriptionConfig.config.activated
        ? !subscriptionConfig.isSubscribed() && subscriptionConfig.config.subscriptionDaysRemain
          ? ((subscriptionConfig.config.activated = !0),
            (subscriptionConfig.config.subscribedDay = subscriptionUtils.getToday()),
            (subscriptionConfig.config.subscriptionDaysRemain = subscriptionConfig.config.subscriptionDaysRemain - 1),
            subscriptionConfig.save(),
            subscriptionUtils.refreshAddonCommands(),
            this.activationStatus.setTitle(subscriptionConfig.getStatus()),
            subscriptionUtils.showHUD('Subscription days remian: ' + subscriptionConfig.config.subscriptionDaysRemain))
          : (await subscriptionNetwork.subscribe(t)).success ||
            (this.autoSubscription.setTitle(
              subscriptionConfig.config.autoSubscription ? 'Auto subscription: ✅' : 'Auto subscription: ❌'
            ),
            subscriptionConfig.save())
        : subscriptionConfig.config.subscriptionDaysRemain
          ? ((subscriptionConfig.config.activated = !0),
            (subscriptionConfig.config.subscribedDay = subscriptionUtils.getToday()),
            (subscriptionConfig.config.subscriptionDaysRemain = subscriptionConfig.config.subscriptionDaysRemain - 1),
            subscriptionConfig.save(),
            subscriptionUtils.refreshAddonCommands(),
            this.activationStatus.setTitle(subscriptionConfig.getStatus()),
            subscriptionUtils.showHUD('Subscription days remian: ' + subscriptionConfig.config.subscriptionDaysRemain))
          : subscriptionNetwork.subscribe(t));
  }),
  (subscriptionController.prototype.blur = async function () {
    (await this.runJavaScript(
      `        function removeFocus() {
            // 获取当前具有焦点的元素
            const focusedElement = document.activeElement;

            // 如果当前焦点元素存在，移除焦点
            if (focusedElement) {
                focusedElement.blur();
            }
        }
        removeFocus()`,
      'docview'
    ),
      this.docview.endEditing(!0));
  }),
  (subscriptionController.prototype.layoutSubviews = function () {
    var t, e, i, o;
    this.miniMode ||
      ((t = (e = this.view.bounds).width),
      (e = e.y + e.height),
      (i = 270),
      (o = subscriptionConfig.lastView),
      500 < t && 'log' !== o
        ? ((this.subscriptionView.frame = MNUtil.genFrame(0, 30, 280, e - 30)),
          (this.webview.frame = MNUtil.genFrame(0, 30, 280, e - 30)),
          (this.docview.frame = MNUtil.genFrame(285, 30, t - 285, e - 30)),
          (this.docview.hidden = !1))
        : ((i = t - 10),
          (this.subscriptionView.frame = MNUtil.genFrame(0, 30, t, e - 30)),
          (this.webview.frame = MNUtil.genFrame(0, 30, t, e - 30)),
          (this.docview.hidden = !0)),
      this.closeButton.setFrame(t - 30, 0, 25, 25),
      this.moveButton.setFrame(35, 0, t - 70, 25),
      this.refreshButton.setFrame(5, 0, 25, 25),
      this.activationStatus.setFrame(5, 80, i, 30),
      this.showAPIKeyButton.setFrame(i - 85, 45, 30, 25),
      this.pasteKeyButton.setFrame(i - 50, 45, 50, 25),
      this.autoSubscription.setFrame(5, 115, i, 30),
      this.freeUsage.setFrame(i - 25, 150, 30, 30),
      this.usageButton.setFrame(5, 150, i - 35, 30),
      this.usageDetailButton.setFrame(i - 110, 185, 115, 30),
      this.URLButton.setFrame(5, 185, i - 120, 30),
      (this.apikeyInput.frame = { x: 5, y: 5, width: i, height: 70 }),
      this.resizeButton.setFrame(t - 30, e - 30, 30, 30),
      (this.DMButton.hidden = e < 295),
      this.DMButton.setFrame(5, 220, i, 30),
      (this.buyAPIKeyButton.hidden = e < 320),
      this.buyAPIKeyButton.setFrame(5, 255, i, 30),
      (this.helperButton.hidden = e < 340),
      this.helperButton.setFrame(5, 290, i, 30));
  }),
  (subscriptionController.prototype.showHUD = function (t, e = 1.5, i = this.view) {
    MNUtil.showHUD(t, e, i);
  }),
  (subscriptionController.prototype.waitHUD = function (t, e = this.view) {
    MNUtil.waitHUD(t, e);
  }),
  (subscriptionController.prototype.showLog = function (t) {
    'log' == subscriptionConfig.lastView &&
      this.runJavaScript(`showLogsFromAddon(\`${encodeURIComponent(JSON.stringify(t))}\`)`);
  }),
  (subscriptionController.prototype.appendLog = function (t) {
    'log' == subscriptionConfig.lastView &&
      this.runJavaScript(`appendLogFromAddon(\`${encodeURIComponent(JSON.stringify(t))}\`)`);
  }),
  (subscriptionController.prototype.clearLogs = function () {
    'log' == subscriptionConfig.lastView
      ? ((MNLog.logs = []), this.runJavaScript('clearLogsFromAddon()'))
      : (MNLog.logs = []);
  }),
  (subscriptionController.prototype.hideAllButton = function () {
    ((this.closeButton.hidden = !0),
      (this.refreshButton.hidden = !0),
      (this.subscriptionView.hidden = !0),
      (this.resizeButton.hidden = !0),
      (this.webview.hidden = !0),
      (this.docview.hidden = !0));
  }),
  (subscriptionController.prototype.showAllButton = function () {
    ((this.closeButton.hidden = !1),
      (this.refreshButton.hidden = !1),
      (this.subscriptionView.hidden = !1),
      (this.webview.hidden = !1),
      (this.resizeButton.hidden = !1));
  }),
  (subscriptionController.prototype.setFrame = function (t, e, i, o) {
    ((this.view.frame = 'object' == typeof t ? t : MNUtil.genFrame(t, e, i, o)), (this.currentFrame = this.view.frame));
  }),
  (subscriptionController.prototype.toMinimode = function (i = !0) {
    try {
      ((this.miniMode = !0),
        (this.lastFrame = this.view.frame),
        (this.currentFrame = this.view.frame),
        this.hideAllButton(),
        (this.view.layer.borderWidth = 0),
        this.moveButton.setTitleForState('', 0));
      let t = '#457bd3',
        e = subscriptionConfig.getMiniFrame();
      i
        ? ((this.onAnimate = !0),
          MNUtil.animate(() => {
            ((this.view.layer.backgroundColor = MNUtil.hexColorAlpha(t, 0.8)),
              this.setFrame(e),
              (this.moveButton.frame = MNUtil.genFrame(0, 0, 40, 40)),
              this.setMiniColor(!1));
          }).then(() => {
            ((this.moveButton.hidden = !1),
              (this.view.layer.backgroundColor = MNUtil.hexColorAlpha(t, 0)),
              this.setMiniColor(!0),
              this.setMiniImage(),
              (this.onAnimate = !1));
          }))
        : (this.setFrame(e),
          (this.moveButton.frame = MNUtil.genFrame(0, 0, 40, 40)),
          (this.moveButton.hidden = !1),
          (this.view.layer.backgroundColor = MNUtil.hexColorAlpha(t, 0)),
          this.setMiniImage(),
          this.setMiniColor(!0));
    } catch (t) {
      subscriptionUtils.addErrorLog(t, 'toMinimode');
    }
  }),
  (subscriptionController.prototype.previewPDF = function (t) {
    t = MNUtil.getFile(t);
    this.docview.loadDataMIMETypeTextEncodingNameBaseURL(t, 'application/pdf', 'UTF-8', void 0);
  }),
  (subscriptionController.prototype.setMiniColor = function (e = !1) {
    if (this.miniMode) {
      let t = subscriptionConfig.isSubscribed() ? '#457bd3' : '#677180';
      e
        ? MNUtil.animate(() => {
            MNButton.setColor(this.moveButton, t, 0.4);
          }, 0.6)
        : MNButton.setColor(this.moveButton, t);
    }
  }),
  (subscriptionController.prototype.setMiniImage = function () {
    if (this.miniMode)
      switch ((this.moveButton.setTitleForState('', 0), subscriptionConfig.lastView)) {
        case 'subscriptionView':
          this.moveButton.setImageForState(this.logoImage, 0);
          break;
        case 'webview':
        case 'webviewAlpha':
          this.moveButton.setImageForState(this.appImage, 0);
          break;
        case 'log':
          this.moveButton.setImageForState(this.logImage, 0);
          break;
        default:
          this.moveButton.setImageForState(this.appImage, 0);
      }
  }),
  (subscriptionController.prototype.checkDocview = async function () {
    try {
      return new Promise((e, t) => {
        if (this.docview.hidden) {
          let t = this.view.frame;
          ((t.width = 800),
            t.height < 500 && (t.height = 500),
            MNUtil.windowWidth - t.x < 800 && (t.width = 600),
            (t.x = MNUtil.constrain(this.view.frame.x, 40, MNUtil.currentWindow.frame.width - t.width)),
            (this.onAnimate = !0),
            MNUtil.animate(() => {
              ((this.view.frame = t), this.layoutSubviews());
            }).then(() => {
              ((this.currentFrame = t), (this.onAnimate = !1), this.view.setNeedsLayout(), e());
            }));
        } else {
          let t = this.view.frame;
          t.height < 500 &&
            ((t.height = 500),
            (this.onAnimate = !0),
            MNUtil.animate(() => {
              ((this.view.frame = t), this.layoutSubviews());
            }).then(() => {
              ((this.currentFrame = t), (this.onAnimate = !1), this.view.setNeedsLayout(), e());
            }));
        }
        e();
      });
    } catch (t) {
      subscriptionUtils.addErrorLog(t, 'checkDocview');
    }
  }),
  (subscriptionController.prototype.loadRechargePage = async function () {
    if (MNUtil.isIOS()) MNUtil.confirm('MN Utils', 'Not supported on iOS\n\n暂不支持iOS');
    else {
      (await this.checkDocview(), this.setWebMode(!0, 'docview'));
      let t = subscriptionConfig.APIKey;
      t
        ? (MNConnection.loadFile(
            this.docview,
            subscriptionUtils.mainPath + '/recharge.html',
            subscriptionUtils.mainPath
          ),
          MNUtil.delay(0.5).then(() => {
            this.runJavaScript(`state.apiKey = "${t}"`, 'docview');
          }))
        : MNConnection.loadFile(this.docview, subscriptionUtils.mainPath + '/newkey.html', subscriptionUtils.mainPath);
    }
  }),
  (subscriptionController.prototype.verifyApiKeyInRechargePage = async function (t) {
    (await subscriptionNetwork.validateAPIKey(t)).success
      ? this.runJavaScript('handleApiKeyVerificationResult(true)', 'docview')
      : this.runJavaScript('handleApiKeyVerificationResult(false)', 'docview');
  }),
  (subscriptionController.prototype.afdNewkeyOrderPage = async function (t, e = !1) {
    var t = ['5', '10', '20', '50'].indexOf(t),
      i = NSUUID.UUID().UUIDString(),
      t =
        ((subscriptionUtils.orderId = i),
        [
          'https://ifdian.net/order/create?product_type=1&plan_id=a6ed8b60fbcf11ee941152540025c377&sku=%5B%7B%22sku_id%22:%22b24e214cfd3f11eebc335254001e7c00%22,%22count%22:1%7D%5D',
          'https://ifdian.net/order/create?product_type=1&plan_id=a6ed8b60fbcf11ee941152540025c377&sku=%5B%7B%22sku_id%22:%22a58e5502146f11efa4fa5254001e7c00%22,%22count%22:1%7D%5D',
          'https://ifdian.net/order/create?product_type=1&plan_id=a6ed8b60fbcf11ee941152540025c377&sku=%5B%7B%22sku_id%22:%2279e3e74a147011efb46e52540025c377%22,%22count%22:1%7D%5D',
          'https://ifdian.net/order/create?product_type=1&plan_id=a6ed8b60fbcf11ee941152540025c377&sku=%5B%7B%22sku_id%22%3A%22e87e8a7432f811efaa1552540025c377%22,%22count%22%3A1%7D%5D',
        ][t] +
          '&custom_order_id=' +
          encodeURIComponent(i));
    (MNUtil.copy(i), e ? MNUtil.openURL(t) : MNConnection.loadRequest(this.docview, t, !0));
  }),
  (subscriptionController.prototype.afdRechargeOrderPage = async function (t, e = !1) {
    var t = ['5', '10', '20', '50'].indexOf(t),
      i = [
        'https://ifdian.net/order/create?product_type=1&plan_id=f52724aa464611ef8acc52540025c377&sku=%5B%7B%22sku_id%22:%22f52fdfc8464611efbe3052540025c377%22,%22count%22:1%7D%5D',
        'https://ifdian.net/order/create?product_type=1&plan_id=f52724aa464611ef8acc52540025c377&sku=%5B%7B%22sku_id%22:%22a077cf88557611efb1785254001e7c00%22,%22count%22:1%7D%5D',
        'https://ifdian.net/order/create?product_type=1&plan_id=f52724aa464611ef8acc52540025c377&sku=%5B%7B%22sku_id%22:%22a0831816557611ef8fb05254001e7c00%22,%22count%22:1%7D%5D',
        'https://ifdian.net/order/create?product_type=1&plan_id=f52724aa464611ef8acc52540025c377&sku=%5B%7B%22sku_id%22:%22ba4c466e557611ef80c852540025c377%22,%22count%22:1%7D%5D',
      ];
    e ? MNUtil.openURL(i[t]) : MNConnection.loadRequest(this.docview, i[t], !0);
  }),
  (subscriptionController.prototype.executeMNAddonAction = async function (t) {
    try {
      if (this.onDownloading) return (this.showHUD('Wait...'), !1);
      var i = t.host;
      let e = t.params.id;
      var o,
        s,
        n,
        r,
        a = subscriptionConfig.mnaddon.filter((t) => t.id === e)[0],
        c = subscriptionConfig.lastView;
      switch (i) {
        case 'showDescription':
          'importDocument' === a.action && MNUtil.allDocumentIds().includes(a.id)
            ? ((o = MNUtil.getDocById(a.id)),
              await this.checkDocview(),
              this.previewPDF(o.fullPathFileName),
              MNUtil.stopHUD())
            : (MNConnection.loadRequest(this.docview, a.description),
              await this.checkDocview(),
              this.waitHUD('Previewing Document...', this.docview));
          break;
        case 'importDocument':
          (this.waitHUD('Importing document...'),
            subscriptionNetwork.downloadFromConfig(a, this),
            MNUtil.log({ level: 'info', message: 'Import document: ' + a.name }));
          break;
        case 'importNotebook':
          (this.waitHUD('Importing notebook...'),
            subscriptionNetwork.downloadFromConfig(a, this),
            MNUtil.log({ level: 'info', message: 'Import notebook: ' + a.name }));
          break;
        case 'install':
        case 'update':
          ('webview' === c
            ? subscriptionNetwork.downloadFromConfig123(a, this)
            : subscriptionNetwork.downloadFromConfig(a, this),
            this.docview.hidden || MNConnection.loadRequest(this.docview, a.description),
            MNUtil.log({ level: 'info', message: 'Install addon: ' + a.name + ' ' + a.version }));
          break;
        case 'reinstall':
          'history' in a
            ? ((s = a.history.map((t) => t.version).slice(0, 6)),
              (n = await MNUtil.userSelect('Choose a history version', '选择历史版本', s)) &&
                ((r = s[n - 1]),
                (a.version = r),
                'webview' === c
                  ? subscriptionNetwork.downloadFromConfig123(a, this)
                  : subscriptionNetwork.downloadFromConfig(a, this),
                MNUtil.log({ level: 'info', message: 'Install addon: ' + a.name + ' ' + a.version }),
                this.docview.hidden || MNConnection.loadRequest(this.docview, a.description)))
            : (await MNUtil.confirm('Re-install this addon?', '重新安装该插件？')) &&
              ('webview' === c
                ? subscriptionNetwork.downloadFromConfig123(a, this)
                : subscriptionNetwork.downloadFromConfig(a, this),
              MNUtil.log({ level: 'info', message: 'Install addon: ' + a.name + ' ' + a.version }),
              this.docview.hidden || MNConnection.loadRequest(this.docview, a.description));
      }
    } catch (t) {
      subscriptionUtils.addErrorLog(t, 'executeMNAddonAction');
    }
  }),
  (subscriptionController.prototype.changeView = async function (t) {
    var e = subscriptionConfig.lastView,
      i = subscriptionConfig.getConfig('customMode'),
      o = new Menu(t, this);
    if (((o.width = 250), (o.rowHeight = 35), (o.preferredPosition = 1), this.miniMode))
      switch (i) {
        case 'leftTop':
        case 'rightTop':
          o.preferredPosition = 1;
          break;
        case 'leftBottom':
        case 'rightBottom':
          o.preferredPosition = 2;
          break;
        case 'top':
          o.preferredPosition = 1;
          break;
        case 'bottom':
          o.preferredPosition = 2;
          break;
        case 'left':
          o.preferredPosition = 4;
          break;
        case 'right':
          o.preferredPosition = 0;
          break;
        default:
          o.preferredPosition = 1;
      }
    (o.addMenuItem('💲  Subscription Manager', 'setViewTo:', 'subscriptionView', 'subscriptionView' === e),
      o.addMenuItem('🎛️  Update Manager', 'setViewTo:', 'webview', 'webview' === e),
      o.addMenuItem('🎛️  Update Manager (α)', 'setViewTo:', 'webviewAlpha', 'webviewAlpha' === e),
      o.addMenuItem('📔  Shared Notebooks', 'setViewTo:', 'shareNotebooks', 'shareNotebooks' === e),
      o.addMenuItem('📄  Shared Documents', 'setViewTo:', 'shareDocuments', 'shareDocuments' === e),
      o.addMenuItem('🎛️  MNAddon Panel', 'showPanel:', 'setting', 'setting' === e),
      o.addMenuItem('🔨  Log Viewer', 'setViewTo:', 'log', 'log' === e),
      o.addMenuItem('🗺️  Update Roadmap', 'setViewTo:', 'roadmap', 'roadmap' === e),
      o.addMenuItem('🗺️  Feedback', 'setViewTo:', 'feedback', 'feedback' === e),
      o.addMenuItem('💬  QQ Gruop', 'setViewTo:', 'QQGruop', 'QQGruop' === e),
      o.addMenuItem('📕  Red Note', 'setViewTo:', 'redNote', 'redNote' === e),
      o.addMenuItem('❓  Questions', 'setViewTo:', 'commonQuestion', 'commonQuestion' === e),
      o.addMenuItem('❌  Force to Crash', 'force2Crash:', 'sidebar', 'sidebar' === e),
      o.show());
  }),
  (subscriptionController.prototype.changeViewTo = async function (t, e = !1) {
    try {
      for (; !this.initialized; ) (MNUtil.showHUD('not initialized'), await MNUtil.delay(0.5));
      var i = this.miniMode;
      if (this.miniMode) {
        switch (t) {
          case 'roadmap':
            return void MNUtil.postNotification('openInBrowser', { url: 'https://mnaddon.craft.me/roadmap' });
          case 'feedback':
            return void MNUtil.postNotification('openInBrowser', { url: 'https://s.craft.me/D9f5zVkfItscTP' });
        }
        (await this.exitMiniMode(), await MNUtil.delay(0.5));
      }
      if (e || subscriptionConfig.lastView !== t || i) {
        switch (t) {
          case 'subscriptionView':
            ((this.subscriptionView.hidden = !1),
              (this.webview.hidden = !0),
              MNButton.setTitle(this.moveButton, 'Subscription Manager', void 0, !0),
              (subscriptionConfig.config.lastView = 'subscriptionView'));
            break;
          case 'shareNotebooks':
            ((this.subscriptionView.hidden = !0),
              (this.webview.hidden = !1),
              MNButton.setTitle(this.moveButton, 'Shared Notebooks', void 0, !0),
              this.webview.loadFileURLAllowingReadAccessToURL(
                NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/sidebar.html'),
                NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/')
              ),
              this.refreshSidebar(!0, 'shareNotebooks'),
              (subscriptionConfig.config.lastView = 'shareNotebooks'));
            break;
          case 'shareDocuments':
            ((this.subscriptionView.hidden = !0),
              (this.webview.hidden = !1),
              MNButton.setTitle(this.moveButton, 'Shared Documents', void 0, !0),
              this.webview.loadFileURLAllowingReadAccessToURL(
                NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/sidebar.html'),
                NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/')
              ),
              this.refreshSidebar(!0, 'shareDocuments'),
              (subscriptionConfig.config.lastView = 'shareDocuments'));
            break;
          case 'webview':
            ((this.subscriptionView.hidden = !0),
              (this.webview.hidden = !1),
              MNButton.setTitle(this.moveButton, 'Update Manager', void 0, !0),
              this.webview.loadFileURLAllowingReadAccessToURL(
                NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/sidebar.html'),
                NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/')
              ),
              this.refreshSidebar(!0, 'webview'),
              (subscriptionConfig.config.lastView = 'webview'));
            break;
          case 'webviewAlpha':
            ((this.subscriptionView.hidden = !0),
              (this.webview.hidden = !1),
              MNButton.setTitle(this.moveButton, 'Update Manager (α)', void 0, !0),
              this.webview.loadFileURLAllowingReadAccessToURL(
                NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/sidebar.html'),
                NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/')
              ),
              this.refreshSidebar(!0, 'webviewAlpha'),
              (subscriptionConfig.config.lastView = 'webviewAlpha'));
            break;
          case 'commonQuestion':
            (this.checkDocview(),
              MNConnection.loadRequest(this.docview, 'https://mnaddon.craft.me/question', MNUtil.isMacOS()));
            break;
          case 'redNote':
            ((this.subscriptionView.hidden = !0),
              (this.webview.hidden = !1),
              MNConnection.loadRequest(this.webview, 'http://xhslink.com/m/80rv3rT5lFq', !1),
              this.wideSidebar());
            break;
          case 'QQGruop':
            return void MNConnection.loadRequest(
              this.webview,
              'https://qm.qq.com/cgi-bin/qm/qr?k=KbIlzoREcs0i6BptRm7mPz-FbSQ0rDdY&jump_from=webapi&authKey=IFb0w7qbBf7tqVvYh1EbMh0KeQ7+Ucl5ZGmjYr5ddX9wCGHyYUWuFnhI65S3Ne+6',
              MNUtil.isMacOS()
            );
          case 'roadmap':
            MNUtil.postNotification('openInBrowser', { url: 'https://mnaddon.craft.me/roadmap' });
            break;
          case 'feedback':
            MNUtil.postNotification('openInBrowser', { url: 'https://s.craft.me/D9f5zVkfItscTP' });
            break;
          case 'log':
            ((this.subscriptionView.hidden = !0),
              (this.webview.hidden = !1),
              MNButton.setTitle(this.moveButton, 'Log Viewer', void 0, !0),
              this.webview.loadFileURLAllowingReadAccessToURL(
                NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/log.html'),
                NSURL.fileURLWithPath(subscriptionUtils.mainPath + '/')
              ),
              (subscriptionConfig.config.lastView = 'log'),
              this.wideSidebar(),
              await MNUtil.delay(0.5),
              this.showLog(MNLog.logs));
        }
        (subscriptionConfig.save(), this.view.setNeedsLayout());
      }
    } catch (t) {
      subscriptionUtils.addErrorLog(t, 'changeViewTo');
    }
  }),
  (subscriptionController.prototype.exitMiniMode = async function () {
    let i = '#457bd3';
    return (
      (this.view.layer.backgroundColor = MNUtil.hexColorAlpha(i, 0.8)),
      this.moveButton.setImageForState(void 0, 0),
      (this.lastFrame.x = MNUtil.constrain(0, this.lastFrame.x, MNUtil.studyWidth - this.lastFrame.width)),
      (this.lastFrame.y = MNUtil.constrain(0, this.lastFrame.y, MNUtil.studyHeight - this.lastFrame.height)),
      new Promise((t, e) => {
        ((this.onAnimate = !0),
          MNUtil.animate(() => {
            this.setFrame(this.lastFrame);
            var t = this.view.bounds.width;
            (this.moveButton.setFrame(35, 0, t - 70, 25), MNButton.setColor(this.moveButton, i));
          }, 0.25).then(() => {
            ((this.miniMode = !1),
              this.showAllButton(),
              (this.view.layer.backgroundColor = MNUtil.hexColorAlpha(i, 0)),
              MNButton.setColor(this.moveButton, i),
              (this.onAnimate = !1),
              this.view.setNeedsLayout(),
              t());
          }));
      })
    );
  }),
  (subscriptionController.prototype.wideSidebar = function () {
    var t = this.view.frame;
    (t.width < 500 && (t.width = 500),
      t.height < 500 && (t.height = 500),
      (this.view.frame = t),
      (this.currentFrame = t));
  }),
  (subscriptionController.prototype.setWebMode = function (t = !1, e = 'webview') {
    this[e].customUserAgent = t
      ? 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15'
      : 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148';
  }),
  (subscriptionController.prototype.testURL = async function (e, i) {
    this.testIndex = this.testIndex + 1;
    try {
      var o = Date.now();
      let t = subscriptionConfig.APIKey;
      var s,
        n,
        r,
        a,
        c = 'URL' + (i + 1),
        l =
          ((t && '' !== t.trim()) || (t = 'sk-yJBsnoQlOkI7gQcqV501oAjuuiIhIg01gJ3qqmEyQdX81sQK'),
          await subscriptionNetwork.getUsage(e, t));
      return 'error' in l
        ? (MNLog.error({ message: 'Testing ' + c, detail: l }),
          (s = '❌ ' + c),
          { success: !1, error: l.error, timeUsed: -1, name: c, url: e, title: s })
        : ((n = Date.now()),
          this.waitHUD('Testing URL ' + 20 * this.testIndex + '%...'),
          (a = '🕙 ' + c + ' (' + (r = (n - o) / 1e3).toFixed(2) + 's)'),
          { success: !0, timeUsed: r, name: c, url: e, title: a });
    } catch (t) {
      this.waitHUD('Testing URL ' + 20 * this.testIndex + '%...');
      i = '❌ ' + URLName;
      return { success: !1, error: t.message, timeUsed: -1, name: URLName, url: e, title: i };
    }
  }));
class subscriptionUtils {
  constructor(t) {
    this.name = t;
  }
  static subscriptionController;
  static mainPath;
  static orderId = '';
  static init(t) {
    try {
      ((this.addonConnected = !0),
        (this.app = Application.sharedInstance()),
        (this.data = Database.sharedInstance()),
        (this.focusWindow = this.app.focusWindow),
        (this.version = this.appVersion()),
        (this.mainPath = t),
        (this.errorLog = []),
        (this.extensionPath = t.replace(/\/marginnote\.extension\.\w+/, '')),
        (this.topOffset = MNUtil.isMacOS() ? 30 : 22),
        (this.bottomOffset = MNUtil.isMacOS() ? 0 : 10),
        MNUtil.createFolder(t + '/download'),
        (this.downloadPath = t + '/download'));
    } catch (t) {
      MNUtil.log({
        message: 'subscriptionUtils.init',
        level: 'ERROR',
        source: 'MN Utils',
        timestamp: Date.now(),
        detail: t.toString(),
      });
    }
  }
  static showHUD(t, e = 0) {
    this.app.showHUD(t, this.focusWindow, 2);
  }
  static addErrorLog(t, e, i) {
    MNUtil.showHUD('MN Utils Error (' + e + '): ' + t);
    t = { error: t.toString(), source: e, time: new Date(Date.now()).toString(), mnaddon: 'MN Utils' };
    (i && (t.info = i),
      this.errorLog.push(t),
      MNUtil.copyJSON(this.errorLog),
      MNUtil.log({ message: e, level: 'ERROR', source: 'MN Utils', timestamp: Date.now(), detail: t }));
  }
  static appVersion() {
    var t = {},
      e = parseFloat(this.app.appVersion);
    switch (((t.version = 4 <= e ? 'marginnote4' : 'marginnote3'), this.app.osType)) {
      case 0:
        t.type = 'iPadOS';
        break;
      case 1:
        t.type = 'iPhoneOS';
        break;
      case 2:
        t.type = 'macOS';
    }
    return t;
  }
  static getByDefault(t, e) {
    var i = NSUserDefaults.standardUserDefaults().objectForKey(t);
    return void 0 === i ? (NSUserDefaults.standardUserDefaults().setObjectForKey(e, t), e) : i;
  }
  static getNoteColors() {
    return [
      '#ffffb4',
      '#ccfdc4',
      '#b4d1fb',
      '#f3aebe',
      '#ffff54',
      '#75fb4c',
      '#55bbf9',
      '#ea3323',
      '#ef8733',
      '#377e47',
      '#173dac',
      '#be3223',
      '#ffffff',
      '#dadada',
      '#b4b4b4',
      '#bd9fdc',
    ];
  }
  static getNoteById(t) {
    return this.data.getNoteById(t);
  }
  static getNoteBookById(t) {
    return this.data.getNotebookById(t);
  }
  static getUrlByNoteId(t) {
    return this.appVersion().version + 'app://note/' + t;
  }
  static getNoteIdByURL(t) {
    let e = t.trim();
    return (e = /^marginnote\dapp:\/\/note\//.test(e) ? e.slice(22) : e);
  }
  static clipboardText() {
    return UIPasteboard.generalPasteboard().string;
  }
  static copy(t) {
    UIPasteboard.generalPasteboard().string = t;
  }
  static copyJSON(t) {
    UIPasteboard.generalPasteboard().string = JSON.stringify(t, null, 2);
  }
  static copyImage(t) {
    UIPasteboard.generalPasteboard().setDataForPasteboardType(t, 'public.png');
  }
  static studyController() {
    return this.app.studyController(this.focusWindow);
  }
  static studyView() {
    return this.app.studyController(this.focusWindow).view;
  }
  static currentDocController() {
    return this.studyController().readerController.currentDocumentController;
  }
  static currentNotebook() {
    var t = this.studyController().notebookController.notebookId;
    return this.getNoteBookById(t);
  }
  static undoGrouping(t, e) {
    (UndoManager.sharedInstance().undoGrouping(String(Date.now()), t, e), this.app.refreshAfterDBChanged(t));
  }
  static checkSubscriptionController() {
    (this.subscriptionController || (this.subscriptionController = subscriptionController.new()),
      MNUtil.isDescendantOfCurrentWindow(this.subscriptionController.view) ||
        MNUtil.currentWindow.addSubview(this.subscriptionController.view));
  }
  static getNewLocDev(t, e = MNUtil.currentWindow) {
    1 === t.state && ((t.initLocation = t.locationInView(e)), (self.initFrame = self.view.frame));
  }
  static getNewLoc(t, e = MNUtil.currentWindow) {
    var i,
      o = t.locationInView(e),
      s =
        (t.moveDate || (t.moveDate = 0),
        100 < Date.now() - t.moveDate &&
          ((i = t.translationInView(e)), (s = t.locationInView(t.view.superview)), 1 === t.state) &&
          (t.locationToBrowser = { x: s.x - i.x, y: s.y - i.y }),
        o.x <= 0 && (o.x = 0),
        o.x > e.frame.width && (o.x = e.frame.width),
        (t.moveDate = Date.now()),
        { x: o.x - t.locationToBrowser.x, y: o.y - t.locationToBrowser.y });
    return (s.y <= 0 && (s.y = 0), s.y >= e.frame.height - 15 && (s.y = e.frame.height - 15), s);
  }
  static getImage(t, e = 2) {
    return UIImage.imageWithDataScale(NSData.dataWithContentsOfFile(t), e);
  }
  static refreshAddonCommands() {
    var t = subscriptionUtils.subscriptionController;
    t &&
      t.miniMode &&
      (subscriptionConfig.isSubscribed()
        ? MNButton.setColor(t.moveButton, '#457bd3', 0.4)
        : MNButton.setColor(t.moveButton, '#677180', 0.4));
  }
  static addObserver(t, e, i) {
    NSNotificationCenter.defaultCenter().addObserverSelectorName(t, e, i);
  }
  static removeObserver(t, e) {
    NSNotificationCenter.defaultCenter().removeObserverName(t, e);
  }
  static checkSender(t, e) {
    return this.app.checkNotifySenderInWindow(t, e);
  }
  static getPopoverAndPresent(t, e, i = 100, o = 2) {
    var s = MenuController.new(),
      e =
        ((s.commandTable = e),
        (s.rowHeight = 35),
        (s.preferredContentSize = { width: i, height: s.rowHeight * s.commandTable.length }),
        new UIPopoverController(s)),
      i = t.convertRectToView(t.bounds, this.studyView());
    return (e.presentPopoverFromRect(i, this.studyView(), o, !0), e);
  }
  static hexColorAlpha(t, e) {
    t = UIColor.colorWithHexString(t);
    return void 0 !== e ? t.colorWithAlphaComponent(e) : t;
  }
  static getToday() {
    return new Date().getDate();
  }
  static ensureView(t) {
    MNUtil.isDescendantOfCurrentWindow(t) || ((t.hidden = !1), MNUtil.currentWindow.addSubview(t));
  }
  static async delay(i) {
    return new Promise((t, e) => {
      NSTimer.scheduledTimerWithTimeInterval(i, !1, function () {
        t();
      });
    });
  }
  static getLocalMNAddonVersions() {
    try {
      var e = this.extensionPath + '/';
      let t = NSFileManager.defaultManager().contentsOfDirectoryAtPath(e),
        i = ((t = t.filter((t) => !/\.DS_Store$/.test(t))), {});
      return (
        t.map((t) => {
          var e;
          MNUtil.isfileExists(this.extensionPath + '/' + t + '/mnaddon.json') &&
            ((e = MNUtil.readJSON(this.extensionPath + '/' + t + '/mnaddon.json').version),
            (t = t.split('marginnote.extension.')[1]),
            (i[t] = e));
        }),
        i
      );
    } catch (t) {
      MNUtil.showHUD(t);
    }
  }
  static compareVersions(t, e) {
    var i = (t) => {
        return t.match(/(\d+)([a-zA-Z]*)(\d*)/g).map((t) => {
          var e = t.match(/\d+/),
            t = t.match(/[a-zA-Z]+/);
          return { num: e ? parseInt(e[0], 10) : 0, alpha: t ? t[0] : '', alphaNum: t ? t[0].charCodeAt(0) : 0 };
        });
      },
      o = i(t),
      s = i(e);
    for (let t = 0; t < Math.max(o.length, s.length); t++) {
      var n = o[t] || { num: 0, alpha: '', alphaNum: 0 },
        r = s[t] || { num: 0, alpha: '', alphaNum: 0 };
      if (n.num !== r.num) return n.num > r.num ? 1 : -1;
      if (n.alphaNum !== r.alphaNum) return n.alphaNum > r.alphaNum ? 1 : -1;
      if (n.alpha === r.alpha && n.num === r.num) {
        ((n = n.num), (r = r.num));
        if (n !== r) return r < n ? 1 : -1;
      }
    }
    return 0;
  }
  static getRandomAuthorization(t, e = !1) {
    var t = 'https://dav.jianguoyun.com/dav/mnaddonStore/' + t;
    let i = [
      { user: '2063617827@qq.com', password: 'a3dkxi2c72hgm8hh', url: t },
      { user: '1514501767@qq.com', password: 'a76xnbehrsr36via', url: t },
      { user: 'linlf7@mail2.sysu.edu.cn', password: 'an3q7hf679nhz8br', url: t },
    ];
    return (
      e && (MNUtil.log('retry'), (i = i.filter((t) => t.user !== this.preConfig.user))),
      1 === i.length
        ? i[0]
        : i && i.length
          ? ((t = Math.floor(Math.random() * i.length)), (e = i[t]), (this.preConfig = e))
          : ''
    );
  }
  static get URLs() {
    return [
      'https://api.feliks.top',
      'https://api1.feliks.top',
      'https://alpha.u1162561.nyat.app:20075',
      'https://api.u1162561.nyat.app:20074',
      'http://29226rb849.zicp.vip',
    ];
  }
  static getURLTitle() {
    switch (subscriptionConfig.URL) {
      case 'https://api.feliks.top':
        return 'URL1';
      case 'https://api1.feliks.top':
        return 'URL2';
      case 'https://alpha.u1162561.nyat.app:20075':
        return 'URL3';
      case 'https://api.u1162561.nyat.app:20074':
        return 'URL4';
      case 'http://29226rb849.zicp.vip':
        return 'URL5';
      default:
        return 'Unknown URL';
    }
  }
  static async importNotebook(o, s, t) {
    try {
      var n = subscriptionUtils.subscriptionController,
        i = (n.waitHUD('Importing notebook...'), MNUtil.allNotebookIds());
      let e = 2;
      if (
        (i.includes(t) &&
          (e = await MNUtil.userSelect('学习集已下载，请选择操作', '', ['合并已有学习集', '覆盖已有学习集'])),
        o.endsWith('.marginnotes'))
      )
        switch (e) {
          case 0:
            return void MNUtil.stopHUD();
          case 1:
            (n.waitHUD('Importing notebook...'), await MNUtil.delay(0.1));
            var r,
              a = MNUtil.importNotebook(o, !0);
            (n.waitHUD('✅ Import success!'),
              a &&
                ((r = await MNUtil.confirm('是否打开学习集？', a.title)), MNUtil.refreshAfterDBChanged(), r) &&
                MNUtil.openURL('marginnote4app://notebook/' + a.topicId),
              MNUtil.stopHUD(0.5));
            break;
          case 2:
          case 3:
            (n.waitHUD('Importing notebook...'), await MNUtil.delay(0.1));
            var c,
              l = MNUtil.importNotebook(o, !1);
            (n.waitHUD('✅ Import success!'),
              l &&
                ((c = await MNUtil.confirm('是否打开学习集？', l.title)), MNUtil.refreshAfterDBChanged(), c) &&
                MNUtil.openURL('marginnote4app://notebook/' + l.topicId),
              MNUtil.stopHUD(0.5));
            break;
          default:
            return;
        }
      else {
        (MNUtil.createFolderDev(s), ZipArchive.unzipFileAtPathToDestination(o, s));
        var d = MNUtil.subpathsOfDirectory(s + '/').filter((t) => t.endsWith('.pdf'));
        let i = d.map((t) => s + '/' + t);
        var u = d.map((t) => MNUtil.documentFolder + '/' + t);
        let t = MNUtil.contentsOfDirectory(s + '/');
        switch (((t = t.filter((t) => t.endsWith('.marginnotes'))), e)) {
          case 0:
            return void MNUtil.stopHUD();
          case 1:
            (n.waitHUD('Importing notebook...'), await MNUtil.delay(0.1));
            var h = MNUtil.importNotebook(s + '/' + t[0], !0);
            (await MNUtil.delay(0.1),
              u.length &&
                (n.waitHUD('Importing documents...'),
                u.forEach((t, e) => {
                  (MNUtil.copyFile(i[e], t), MNUtil.importDocument(t));
                })),
              await MNUtil.delay(0.1),
              n.waitHUD('✅ Import success!'),
              await MNUtil.openNotebook(h, !0),
              MNUtil.stopHUD(0.5));
            break;
          case 2:
          case 3:
            (n.waitHUD('Importing notebook...'), await MNUtil.delay(0.1));
            var p = MNUtil.importNotebook(s + '/' + t[0], !1);
            (await MNUtil.delay(0.1),
              u.length &&
                (n.waitHUD('Importing documents...'),
                u.forEach((t, e) => {
                  (MNUtil.copyFile(i[e], t), MNUtil.importDocument(t));
                })),
              await MNUtil.delay(0.1),
              n.waitHUD('✅ Import success!'),
              await MNUtil.openNotebook(p, !0),
              MNUtil.stopHUD(0.5));
            break;
          default:
            return;
        }
      }
    } catch (t) {
      subscriptionUtils.addErrorLog(t, 'importNotebook');
    }
  }
  static getFileNameFromUrl(t) {
    var e = t.indexOf('?');
    if (-1 === e) return MNUtil.getFileName(t);
    for (const s of t.slice(e + 1).split('&')) {
      var [i, o] = s.split('=');
      if ('filename' === i) return decodeURIComponent(o);
    }
    return null;
  }
  static calcLastFrame(e = void 0) {
    try {
      let t = {};
      e
        ? (t = e)
        : 'log' === subscriptionConfig.lastView
          ? ((t.width = 500), (t.height = 500))
          : ((t.width = 280), (t.height = subscriptionConfig.frameHeight));
      var i = subscriptionConfig.getConfig('customMode'),
        o = subscriptionConfig.getMiniFrame();
      switch (((t.x = o.x - 0.5 * t.width), i)) {
        case 'leftTop':
          ((t.x = 40), (t.y = 40));
          break;
        case 'rightTop':
          ((t.x = MNUtil.currentWindow.frame.width - t.width - 40), (t.y = 40));
          break;
        case 'leftBottom':
          ((t.x = 40), (t.y = MNUtil.currentWindow.frame.height - t.height - 40));
          break;
        case 'rightBottom':
          ((t.x = MNUtil.currentWindow.frame.width - t.width - 40),
            (t.y = MNUtil.currentWindow.frame.height - t.height - 40));
          break;
        case 'left':
          ((t.x = 40), (t.y = MNUtil.constrain(o.y, 40, MNUtil.currentWindow.frame.height - t.height - 40)));
          break;
        case 'top':
          t.y = 40;
          break;
        case 'right':
          ((t.x = MNUtil.currentWindow.frame.width - t.width - 40),
            (t.y = MNUtil.constrain(o.y, 40, MNUtil.currentWindow.frame.height - t.height - 40)));
          break;
        case 'bottom':
          ((t.x = MNUtil.constrain(o.x, 40, MNUtil.currentWindow.frame.width - t.width - 40)),
            (t.y = MNUtil.currentWindow.frame.height - t.height - 40));
      }
      return t;
    } catch (t) {
      subscriptionUtils.addErrorLog(t, 'calcLastFrame');
    }
  }
}
class subscriptionNetwork {
  constructor(t) {
    this.name = t;
  }
  static onSubscrbing = !1;
  static genNSURL(t) {
    return NSURL.URLWithString(t);
  }
  static initRequest(t, e) {
    var i = NSMutableURLRequest.requestWithURL(this.genNSURL(t));
    (i.setHTTPMethod(e.method ?? 'GET'), i.setTimeoutInterval(e.timeout ?? 10));
    return (
      i.setAllHTTPHeaderFields({
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15',
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(e.headers ?? {}),
      }),
      e.search
        ? i.setURL(
            this.genNSURL(
              t.trim() +
                '?' +
                Object.entries(e.search).reduce((t, e) => {
                  var [e, i] = e;
                  return (t ? t + '&' : '') + e + '=' + encodeURIComponent(i);
                }, '')
            )
          )
        : e.body
          ? i.setHTTPBody(NSData.dataWithStringEncoding(e.body, 4))
          : e.form
            ? i.setHTTPBody(
                NSData.dataWithStringEncoding(
                  Object.entries(e.form).reduce((t, e) => {
                    var [e, i] = e;
                    return (t ? t + '&' : '') + e + '=' + encodeURIComponent(i);
                  }, ''),
                  4
                )
              )
            : e.json && i.setHTTPBody(NSJSONSerialization.dataWithJSONObjectOptions(e.json, 1)),
      i
    );
  }
  static getJSONData(t) {
    try {
      var e;
      return t
        ? !MNUtil.isNSNull(t) &&
          t.length() &&
          (e = NSJSONSerialization.JSONObjectWithDataOptions(t, 1)) &&
          NSJSONSerialization.isValidJSONObject(e)
          ? e
          : void 0
        : void 0;
    } catch (t) {
      subscriptionUtils.addErrorLog(t, 'getJSONData');
    }
  }
  static async sendRequest(e) {
    const i = NSOperationQueue.mainQueue();
    return new Promise((l, t) => {
      NSURLConnection.sendAsynchronousRequestQueueCompletionHandler(e, i, (t, e, i) => {
        try {
          var o,
            s,
            n,
            r = this.getJSONData(e);
          if (MNUtil.isNSNull(t))
            return (
              MNUtil.log('Response is null'),
              i.localizedDescription
                ? ((o = { error: i.localizedDescription }), r && (o.data = r), void l(o))
                : ((s = { error: 'Response is null' }), r && (s.data = r), void l(s))
            );
          i.localizedDescription &&
            (MNUtil.showHUD(i.localizedDescription), (n = { error: i.localizedDescription }), r && (n.data = r), l(n));
          var a,
            c = t.statusCode();
          (400 <= c && (((a = { statusCode: c }).error = MNUtil.getStatusCodeDescription(c)), r && (a.data = r), l(a)),
            l(r || e));
        } catch (t) {
          l({ error: t.localizedDescription || 'Unknown error' });
        }
      });
    });
  }
  static async fetch(t, e = {}) {
    t = this.initRequest(t, e);
    return await this.sendRequest(t);
  }
  static async subscribe(e = 1, i = !0) {
    try {
      if (this.onSubscrbing) return { success: !1, error: 'On subscribing...' };
      this.onSubscrbing = !0;
      var o = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + subscriptionConfig.config.apikey };
      let t = 'mnaddon';
      var s = { model: (t = 1 < e ? 'mnaddon' + e : t), messages: [{ role: 'user', content: 'mnaddon' }] },
        n = subscriptionConfig.URL + '/v1/chat/completions',
        r = { method: 'POST', headers: o, timeout: 60, json: s },
        a =
          (1 < e ? MNUtil.waitHUD('Subscribing for ' + e + ' days...') : MNUtil.waitHUD('Subscribing...'),
          await MNUtil.delay(0.5),
          await this.fetch(n, r));
      if (a.success)
        (subscriptionConfig.isSubscribed()
          ? (subscriptionConfig.addSubscriptionDay(e),
            MNUtil.stopHUD(),
            MNUtil.showHUD(
              '✅ Subscribe success! ' + subscriptionConfig.config.subscriptionDaysRemain + ' days remain'
            ))
          : ((subscriptionConfig.config.activated = !0),
            (subscriptionConfig.config.subscribedDay = subscriptionUtils.getToday()),
            subscriptionConfig.addSubscriptionDay(e - 1),
            MNUtil.stopHUD(),
            MNUtil.showHUD(
              '✅ subscribe success! ' + subscriptionConfig.config.subscriptionDaysRemain + ' days remain'
            )),
          MNUtil.log({
            source: 'subscription',
            message: '✅ Subscribe success!',
            detail: subscriptionConfig.config.subscriptionDaysRemain + ' days remain',
          }));
      else {
        let t = !1,
          e = !1;
        if (((subscriptionConfig.config.autoSubscription = !1), a.error)) {
          if (
            ((a.success = !1),
            MNLog.error({ message: 'Error in subscribe', detail: a, source: 'MN Utils' }),
            'string' == typeof a.error)
          )
            return (
              MNUtil.log({
                level: 'error',
                source: 'subscription',
                message: 'Error: ' + a.error,
                detail: JSON.stringify(a.error, void 0, 2),
              }),
              (this.onSubscrbing = !1),
              (a.error = { message: a.error }),
              a
            );
          a.error.message
            ? (MNUtil.stopHUD(),
              (a.error.message.includes('该令牌额度已用尽') || a.error.message.includes('token quota is not enough')) &&
                ((t = !0), MNUtil.showHUD('订阅Key额度不足')),
              a.error.message.includes('该令牌状态不可用') && ((e = !0), MNUtil.showHUD('订阅Key被禁用')))
            : (MNUtil.showHUD('Error: ' + JSON.stringify(a.error)),
              MNUtil.addErrorLog(JSON.stringify(a.error), 'subscribe'));
        }
        if (subscriptionConfig.config.activated && (t || e))
          return ((this.onSubscrbing = !1), (a.success = !1), (a.noQuota = t), (a.disabled = e), a);
        i && (subscriptionConfig.config.activated = !1);
      }
      return (
        (this.onSubscrbing = !1),
        MNUtil.stopHUD(),
        MNUtil.delay(0.1).then(() => {
          (subscriptionConfig.save(),
            subscriptionUtils.subscriptionController.activationStatus.setTitleForState(
              subscriptionConfig.getStatus(),
              0
            ),
            subscriptionUtils.refreshAddonCommands());
        }),
        a
      );
    } catch (t) {
      return (subscriptionUtils.addErrorLog(t, 'subscribe'), MNUtil.stopHUD(), { success: !1, error: t });
    }
  }
  static async getKey(t = 'mnaddon') {
    var e,
      i = subscriptionConfig.APIKey;
    if ('' !== i.trim())
      return (
        (i = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + i }),
        (t = { model: t, messages: [{ role: 'user', content: 'mnaddon' }] }),
        (e = subscriptionConfig.URL + '/v1/chat/completions'),
        await this.fetch(e, { method: 'POST', headers: i, timeout: 60, json: t })
      );
    subscriptionUtils.showHUD('no api key');
  }
  static async countDownload(t = 'mnaddon') {
    var e = {
        'Content-Type': 'application/json',
        Authorization: 'Bearer sk-yJBsnoQlOkI7gQcqV501oAjuuiIhIg01gJ3qqmEyQdX81sQK',
      },
      t = { model: t, messages: [{ role: 'user', content: 'mnaddon' }] },
      i = subscriptionConfig.URL + '/v1/chat/completions';
    return await this.fetch(i, { method: 'POST', headers: e, timeout: 60, json: t });
  }
  static async getUsage(t = subscriptionConfig.URL, e = subscriptionConfig.APIKey) {
    try {
      var i = t + '/v1/dashboard/billing/subscription',
        o = t + '/v1/dashboard/billing/usage';
      if (e && '' !== e.trim()) {
        var s = { Authorization: 'Bearer ' + e, 'Content-Type': 'application/json' },
          n = {},
          r = await this.fetch(o, { method: 'GET', timeout: 10, headers: s });
        if ((MNUtil.log({ message: 'getUsage:' + t, detail: r }), 'error' in r)) {
          if ('data' in r && 'error' in r.data) {
            var a = r.data.error;
            if ('object' == typeof a && 'message' in a) {
              if (a.message.includes('该令牌额度已用尽') || a.message.includes('token quota is not enough'))
                return ((n.error = '订阅Key额度不足'), (n.noQuota = !0), (n.disabled = !1), (n.message = a.message), n);
              if (a.message.includes('该令牌状态不可用'))
                return ((n.error = '订阅Key被禁用'), (n.noQuota = !1), (n.disabled = !0), (n.message = a.message), n);
              n.message = a.message;
            } else n.error = a;
          }
          n.error = r.error;
        } else {
          n.usage = r.total_usage;
          var c = await this.fetch(i, { method: 'GET', timeout: 10, headers: s }),
            l = ((n.total = c.hard_limit_usd), n.total - n.usage / 100);
          l < 0.1 && ((n.error = '订阅Key额度不足'), (n.noQuota = !0), (n.disabled = !1));
        }
        return n;
      }
      subscriptionUtils.showHUD('no api key');
    } catch (t) {
      return (subscriptionUtils.addErrorLog(t, 'getUsage'), { error: t.message });
    }
  }
  static async validateAPIKey(e) {
    try {
      var i = subscriptionConfig.URL + '/api/token/search?keyword=&token=' + e;
      let t = 'gcZMFWrJysiae1/cs087tsmii3OBvvHY';
      var o,
        s,
        n = { 'New-Api-User': '29', Authorization: 'Bearer ' + t, 'Content-Type': 'application/json' },
        r = await this.fetch(i, { method: 'GET', timeout: 60, headers: n });
      return 'error' in r
        ? { success: !1, error: r.error }
        : 1 === r.data.length
          ? 2 === (o = r.data[0]).status
            ? { success: !1, error: '订阅Key额度已被禁用' }
            : 4 === o.status
              ? { success: !1, error: '订阅Key额度已耗尽' }
              : { success: !0, apikey: 'sk-' + r.data[0].key }
          : ((n = {
              'New-Api-User': '1',
              Authorization: 'Bearer ' + (t = 'RGEcAM0eZ7e/Otha+xiBPfaUEAMi+Q=='),
              'Content-Type': 'application/json',
            }),
            'error' in (r = await this.fetch(i, { method: 'GET', timeout: 60, headers: n }))
              ? { success: !1, error: r.error }
              : 1 === r.data.length
                ? 2 === (s = r.data[0]).status
                  ? { success: !1, error: '订阅Key额度已被禁用' }
                  : 4 === s.status
                    ? { success: !1, error: '订阅Key额度已耗尽' }
                    : { success: !0, apikey: 'sk-' + r.data[0].key }
                : { success: !1, error: '订阅Key格式可能错误' });
    } catch (t) {
      return (subscriptionUtils.addErrorLog(t, 'validateAPIKey'), { success: !1, error: t.message() });
    }
  }
  static btoa(t) {
    t = CryptoJS.enc.Utf8.parse(t);
    return CryptoJS.enc.Base64.stringify(t);
  }
  static atob(t) {
    let e = t.replace(/-/g, '+').replace(/_/g, '/');
    switch (e.length % 4) {
      case 2:
        e += '==';
        break;
      case 3:
        e += '=';
    }
    try {
      return CryptoJS.enc.Base64.parse(e).toString(CryptoJS.enc.Utf8);
    } catch (t) {
      return CryptoJS.enc.Base64.parse(e).toString(CryptoJS.enc.Latin1);
    }
  }
  static async readWebDAVFile(t, e, i) {
    ((e = { Authorization: 'Basic ' + this.btoa(e + ':' + i), 'Cache-Control': 'no-cache' }),
      (i = await MNConnection.fetch(t, { method: 'GET', headers: e })));
    try {
      return i.base64Encoding ? MNUtil.data2string(i) : i;
    } catch (t) {
      return i;
    }
  }
  static readWebDAVFileWithDelegate(t, e, i) {
    try {
      var o = { Authorization: 'Basic ' + this.btoa(e + ':' + i), 'Cache-Control': 'no-cache' };
      return this.initRequest(t, { method: 'GET', headers: o });
    } catch (t) {}
  }
  static async readFileFromWebdav(t, e = !1) {
    t = subscriptionUtils.getRandomAuthorization(t, e);
    return await this.readWebDAVFile(t.url, t.user, t.password);
  }
  static async readFileFrom123(t) {
    t = await MNConnection.fetch('https://vip.123pan.cn/1836303614/dl/mnaddonStore/' + t, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
    });
    return (MNUtil.copy(t), t);
  }
  static readFileFromWebdavWithDelegate(t, e = !1) {
    t = subscriptionUtils.getRandomAuthorization(t, e);
    return this.readWebDAVFileWithDelegate(t.url, t.user, t.password);
  }
  static readFileFrom123WithDelegate(t) {
    return MNConnection.initRequest('https://vip.123pan.cn/1836303614/dl/mnaddonStore/' + t, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
    });
  }
  static async downloadFromConfig(t, e = void 0) {
    subscriptionUtils.preAddonConfig = t;
    var i = subscriptionUtils.subscriptionController;
    if ('importDocument' === t.action)
      MNUtil.allDocumentIds().includes(t.id)
        ? (MNUtil.currentNotebookId
            ? (await MNUtil.confirm('Document already exists', '文档已存在，是否打开该文档？\n' + t.fileName)) &&
              (MNUtil.openDoc(t.id, MNUtil.currentNotebookId), 0 === MNUtil.docMapSplitMode) &&
              (MNUtil.studyController.docMapSplitMode = 1)
            : MNUtil.confirm('Document already exists', '文档已存在\n' + t.fileName),
          MNUtil.stopHUD())
        : (i.waitHUD('Download: ' + t.name),
          MNUtil.createFolderDev(MNUtil.documentFolder + '/Download'),
          (s = (n = MNUtil.documentFolder + '/Download') + '/' + t.fileName),
          (o = MNConnection.requestWithURL(t.url)),
          e &&
            (NSURLConnection.connectionWithRequestDelegate(o, e),
            (e.targetPath = s),
            (e.folder = n),
            (e.documentId = t.id),
            (e.fileType = 'document')));
    else if ('importNotebook' === t.action) {
      var o = MNUtil.getNoteBookById(t.id);
      if (o && o.notes?.length)
        switch (
          await MNUtil.userSelect('Notebook already exists', '学习集已存在，是否打开该学习集？\n\n' + t.name, [
            '打开学习集',
            '继续下载',
          ])
        ) {
          case 0:
            return void MNUtil.stopHUD();
          case 1:
            return void MNUtil.openNotebook(t.id);
        }
      var s = t.url.endsWith('.marginpkg') ? t.id + '.marginpkg' : t.id + '.marginnotes',
        n = subscriptionUtils.downloadPath + '/' + s;
      (MNUtil.isfileExists(n)
        ? ((o = subscriptionUtils.downloadPath + '/' + t.id), subscriptionUtils.importNotebook(n, o, t.id))
        : (i.waitHUD('Download: ' + t.name),
          (s = MNConnection.requestWithURL(t.url)),
          e &&
            (NSURLConnection.connectionWithRequestDelegate(s, e),
            (e.targetPath = n),
            (e.folder = subscriptionUtils.downloadPath + '/' + t.id),
            (e.notebookId = t.id),
            (e.fileType = 'notebook'))),
        MNUtil.stopHUD());
    } else {
      var r,
        o = subscriptionUtils.extensionPath + '/marginnote.extension.' + t.id,
        s = t.id + '_v' + t.version.replace(/\./g, '_') + '.mnaddon',
        n = subscriptionUtils.downloadPath + '/' + s;
      (t.customUrl
        ? (i.waitHUD('Download: ' + t.name),
          (r = MNConnection.requestWithURL(t.url)),
          e &&
            (NSURLConnection.connectionWithRequestDelegate(r, e),
            (e.targetPath = n),
            (e.addonPath = o),
            (e.fileType = 'mnaddon')))
        : (i.waitHUD('Download: ' + s),
          e &&
            ((r = subscriptionNetwork.readFileFromWebdavWithDelegate(s, e)),
            NSURLConnection.connectionWithRequestDelegate(r, e),
            (e.targetPath = n),
            (e.addonPath = o),
            (e.fileType = 'mnaddon'))),
        subscriptionNetwork.countDownload(t.id));
    }
  }
  static async downloadFromConfigReTry(t = void 0) {
    var e = subscriptionUtils.preAddonConfig,
      i = subscriptionUtils.subscriptionController;
    if ('importDocument' === e.action)
      MNUtil.allDocumentIds().includes(e.id)
        ? (MNUtil.currentNotebookId
            ? (await MNUtil.confirm('Document already exists', '文档已存在，是否打开该文档？\n' + e.fileName)) &&
              (MNUtil.openDoc(e.id, MNUtil.currentNotebookId), 0 === MNUtil.docMapSplitMode) &&
              (MNUtil.studyController.docMapSplitMode = 1)
            : MNUtil.confirm('Document already exists', '文档已存在\n' + e.fileName),
          MNUtil.stopHUD())
        : (i.waitHUD('Download: ' + e.name),
          MNUtil.createFolderDev(MNUtil.documentFolder + '/Download'),
          (s = (n = MNUtil.documentFolder + '/Download') + '/' + e.fileName),
          (o = MNConnection.requestWithURL(e.url)),
          t &&
            (NSURLConnection.connectionWithRequestDelegate(o, t),
            (t.targetPath = s),
            (t.folder = n),
            (t.documentId = e.id),
            (t.fileType = 'document')));
    else if ('importNotebook' === e.action) {
      var o = MNUtil.getNoteBookById(e.id);
      if (o && o.notes?.length)
        switch (
          await MNUtil.userSelect('Notebook already exists', '学习集已存在，是否打开该学习集？\n\n' + e.name, [
            '打开学习集',
            '继续下载',
          ])
        ) {
          case 0:
            return void MNUtil.stopHUD();
          case 1:
            return void MNUtil.openNotebook(e.id);
        }
      var s = e.url.endsWith('.marginpkg') ? e.id + '.marginpkg' : e.id + '.marginnotes',
        n = subscriptionUtils.downloadPath + '/' + s;
      (MNUtil.isfileExists(n)
        ? ((o = subscriptionUtils.downloadPath + '/' + e.id), subscriptionUtils.importNotebook(n, o, e.id))
        : (i.waitHUD('Download: ' + e.name),
          (s = MNConnection.requestWithURL(e.url)),
          t &&
            (NSURLConnection.connectionWithRequestDelegate(s, t),
            (t.targetPath = n),
            (t.folder = subscriptionUtils.downloadPath + '/' + e.id),
            (t.notebookId = e.id),
            (t.fileType = 'notebook'))),
        MNUtil.stopHUD());
    } else {
      var r,
        o = subscriptionUtils.extensionPath + '/marginnote.extension.' + e.id,
        s = e.id + '_v' + e.version.replace(/\./g, '_') + '.mnaddon',
        n = subscriptionUtils.downloadPath + '/' + s;
      (e.customUrl
        ? (i.waitHUD('Download: ' + e.name),
          (r = MNConnection.requestWithURL(e.url)),
          t &&
            (NSURLConnection.connectionWithRequestDelegate(r, t),
            (t.targetPath = n),
            (t.addonPath = o),
            (t.fileType = 'mnaddon')))
        : (i.waitHUD('Download: ' + s),
          t &&
            ((r = subscriptionNetwork.readFileFromWebdavWithDelegate(s, !0)),
            NSURLConnection.connectionWithRequestDelegate(r, t),
            (t.targetPath = n),
            (t.addonPath = o),
            (t.fileType = 'mnaddon'))),
        subscriptionNetwork.countDownload(e.id));
    }
  }
  static async downloadFromConfig123(t, e = void 0) {
    var i = subscriptionUtils.subscriptionController;
    if ('importDocument' === t.action)
      MNUtil.allDocumentIds().includes(t.id)
        ? (MNUtil.currentNotebookId
            ? (await MNUtil.confirm('Document already exists', '文档已存在，是否打开该文档？\n' + t.fileName)) &&
              (MNUtil.openDoc(t.id, MNUtil.currentNotebookId), 0 === MNUtil.docMapSplitMode) &&
              (MNUtil.studyController.docMapSplitMode = 1)
            : MNUtil.confirm('Document already exists', '文档已存在\n' + t.fileName),
          MNUtil.stopHUD())
        : (i.waitHUD('Download: ' + t.name),
          MNUtil.createFolderDev(MNUtil.documentFolder + '/Download'),
          (s = (n = MNUtil.documentFolder + '/Download') + '/' + t.fileName),
          (o = MNConnection.requestWithURL(t.url)),
          e &&
            (NSURLConnection.connectionWithRequestDelegate(o, e),
            (e.targetPath = s),
            (e.folder = n),
            (e.documentId = t.id),
            (e.fileType = 'document')));
    else if ('importNotebook' === t.action) {
      var o = MNUtil.getNoteBookById(t.id);
      if (o && o.notes?.length)
        switch (
          await MNUtil.userSelect('Notebook already exists', '学习集已存在，是否打开该学习集？\n\n' + t.name, [
            '打开学习集',
            '继续下载',
          ])
        ) {
          case 0:
            return void MNUtil.stopHUD();
          case 1:
            return void MNUtil.openNotebook(t.id);
        }
      var s = t.url.endsWith('.marginpkg') ? t.id + '.marginpkg' : t.id + '.marginnotes',
        n = subscriptionUtils.downloadPath + '/' + s;
      (MNUtil.isfileExists(n)
        ? ((o = subscriptionUtils.downloadPath + '/' + t.id), subscriptionUtils.importNotebook(n, o, t.id))
        : (i.waitHUD('Download: ' + t.name),
          (s = MNConnection.requestWithURL(t.url)),
          e &&
            (NSURLConnection.connectionWithRequestDelegate(s, e),
            (e.targetPath = n),
            (e.folder = subscriptionUtils.downloadPath + '/' + t.id),
            (e.notebookId = t.id),
            (e.fileType = 'notebook'))),
        MNUtil.stopHUD());
    } else {
      var r,
        o = subscriptionUtils.extensionPath + '/marginnote.extension.' + t.id,
        s = t.id + '_v' + t.version.replace(/\./g, '_') + '.mnaddon',
        n = subscriptionUtils.downloadPath + '/' + s;
      (t.customUrl
        ? (i.waitHUD('Download: ' + t.name),
          (r = MNConnection.requestWithURL(t.url)),
          e &&
            (NSURLConnection.connectionWithRequestDelegate(r, e),
            (e.targetPath = n),
            (e.addonPath = o),
            (e.fileType = 'mnaddon')))
        : (i.waitHUD('Download: ' + s),
          e &&
            ((r = subscriptionNetwork.readFileFrom123WithDelegate(s)),
            NSURLConnection.connectionWithRequestDelegate(r, e),
            (e.targetPath = n),
            (e.addonPath = o),
            (e.fileType = 'mnaddon'))),
        subscriptionNetwork.countDownload(t.id));
    }
  }
}
class subscriptionConfig {
  constructor(t) {
    this.name = t;
  }
  static defaultConfig = {
    activated: !1,
    autoSubscription: !1,
    subscribedDay: 0,
    apikey: '',
    freeUsage: 0,
    freeDay: 0,
    subscriptionDaysRemain: 0,
    url: 'https://api.feliks.top',
    lastView: 'webview',
    customMode: 'left',
    alpha: !1,
    miniFrame: { x: 0, y: 80, width: 40, height: 40 },
  };
  static frameHeight = 355;
  static mnaddon = [];
  static init() {
    this.config = this.getByDefault('FeliksPro', this.defaultConfig);
  }
  static getByDefault(t, e) {
    var i = NSUserDefaults.standardUserDefaults().objectForKey(t);
    return void 0 === i ? (NSUserDefaults.standardUserDefaults().setObjectForKey(e, t), e) : i;
  }
  static getConfig(t) {
    return (void 0 !== this.config[t] ? this.config : this.defaultConfig)[t];
  }
  static get APIKey() {
    return this.getConfig('apikey').trim();
  }
  static get URL() {
    return this.getConfig('url').trim();
  }
  static get lastView() {
    return this.getConfig('lastView');
  }
  static set APIKey(t) {
    this.config.apikey = t.trim();
  }
  static get miniFrame() {
    return { ...this.getConfig('miniFrame') };
  }
  static getMiniFrame(t, e) {
    var i = t ?? this.miniFrame,
      o = subscriptionUtils.topOffset,
      s = subscriptionUtils.bottomOffset,
      n = ((i.width = 40), (i.height = 40), MNUtil.windowWidth),
      r = MNUtil.windowHeight;
    switch (e ?? this.getConfig('customMode')) {
      case 'leftTop':
        ((i.x = -7), (i.y = o));
        break;
      case 'rightTop':
        ((i.x = n - 33), (i.y = o));
        break;
      case 'leftBottom':
        ((i.x = -7), (i.y = r - 40 - s));
        break;
      case 'rightBottom':
        ((i.x = n - 33), (i.y = r - 40 - s));
        break;
      case 'left':
        ((i.x = -7), (i.y = MNUtil.constrain(i.y, o, r - 40 - s)));
        break;
      case 'right':
        ((i.x = n - 33), (i.y = MNUtil.constrain(i.y, o, r - 40 - s)));
        break;
      case 'top':
        ((i.y = o), (i.x = MNUtil.constrain(i.x, -7, n - 33)));
        break;
      case 'bottom':
        ((i.x = MNUtil.constrain(i.x, -7, n - 33)), (i.y = r - 40 - s));
    }
    return i;
  }
  static addSubscriptionDay(t) {
    var e = subscriptionConfig.getConfig('subscriptionDaysRemain');
    this.config.subscriptionDaysRemain = e + t;
  }
  static isSubscribed() {
    var t;
    return !!this.getConfig('activated') && ((t = subscriptionUtils.getToday()), this.getConfig('subscribedDay') === t);
  }
  static updateFreeUsage() {
    subscriptionUtils.subscriptionController &&
      subscriptionUtils.subscriptionController.freeUsage.setTitleForState(this.getFreeUsage(), 0);
  }
  static getFreeUsage() {
    var t = subscriptionUtils.getToday();
    return this.getConfig('freeDay') === t
      ? ['🔟', '9️⃣', '8️⃣', '7️⃣', '6️⃣', '5️⃣', '4️⃣', '3️⃣', '2️⃣', '1️⃣', '0️⃣'][this.getConfig('freeUsage')] || '0️⃣'
      : ((this.config.freeDay = t), (this.config.freeUsage = 0), '🔟');
  }
  static isFree(t = !0) {
    var e,
      i = subscriptionUtils.getToday();
    return this.getConfig('freeDay') === i
      ? ((e = this.getConfig('freeUsage')),
        t
          ? ((this.config.freeUsage = e + 1),
            10 <= this.config.freeUsage
              ? subscriptionUtils.showHUD('Free Usage remian: 0')
              : subscriptionUtils.showHUD('Free Usage remian: ' + (9 - e)),
            e <= 10)
          : e <= 9)
      : ((this.config.freeDay = i),
        t
          ? ((this.config.freeUsage = 1),
            subscriptionUtils.showHUD('Free Usage remian: ' + (10 - this.config.freeUsage)))
          : (this.config.freeUsage = 0),
        !0);
  }
  static checkSubscribed(t = !0, e = !1, i = !0) {
    if (this.getConfig('activated')) {
      if (this.isSubscribed()) return !0;
      if (this.getConfig('autoSubscription'))
        return (this.subscribeUsingLocalDays() || subscriptionNetwork.subscribe(), !0);
      if (!e && this.isFree(t))
        return (
          MNUtil.delay(0.1).then(() => {
            (this.updateFreeUsage(), this.save());
          }),
          !0
        );
      i &&
        MNUtil.confirm(
          'MN Utils',
          'Free usage is not enough today. Please subscribe and retry.\n\n今日免费额度已用尽, 请订阅后重试'
        ).then((t) => {
          switch (t) {
            case 0:
              return;
            case 1:
              this.subscribeUsingLocalDays() || subscriptionNetwork.subscribe();
          }
        });
    } else if (e)
      i &&
        MNUtil.confirm(
          'MN Utils',
          'Subscription is required. Do you want to open MN Utils?\n\n该功能需要插件订阅, 是否打开充值页面?'
        ).then(async (t) => {
          t &&
            (await (t = subscriptionUtils.subscriptionController).changeViewTo('subscriptionView'),
            t.loadRechargePage());
        });
    else {
      if (this.isFree(t))
        return (
          MNUtil.delay(0.1).then(() => {
            (this.updateFreeUsage(), this.save());
          }),
          !0
        );
      i &&
        MNUtil.confirm(
          'MN Utils',
          'Free usage is not enough today. Do you want to open MN Utils?\n\n今日免费额度已用尽, 请订阅或者等待明日使用免费额度, 是否打开充值页面?'
        ).then(async (t) => {
          t &&
            (await (t = subscriptionUtils.subscriptionController).changeViewTo('subscriptionView'),
            t.loadRechargePage());
        });
    }
    return !1;
  }
  static subscribeUsingLocalDays() {
    return (
      !!this.config.subscriptionDaysRemain &&
      ((this.config.activated = !0),
      (this.config.subscribedDay = subscriptionUtils.getToday()),
      (this.config.subscriptionDaysRemain = this.config.subscriptionDaysRemain - 1),
      MNUtil.delay(0.1).then(() => {
        (subscriptionUtils.subscriptionController &&
          subscriptionUtils.subscriptionController.activationStatus &&
          subscriptionUtils.subscriptionController.activationStatus.setTitleForState(this.getStatus(), 0),
          subscriptionUtils.showHUD('Subscription days remian: ' + this.config.subscriptionDaysRemain),
          subscriptionUtils.refreshAddonCommands(),
          this.save());
      }),
      !0)
    );
  }
  static getStatus() {
    return (
      'Activated: ' +
      (this.getConfig('activated') ? '✅' : '❌') +
      ' | ' +
      ('Subscribed: ' + (this.isSubscribed() ? '✅' : '❌')) +
      ' | ' +
      this.getConfig('subscriptionDaysRemain')
    );
  }
  static save() {
    NSUserDefaults.standardUserDefaults().setObjectForKey(this.config, 'FeliksPro');
  }
  static remove() {
    NSUserDefaults.standardUserDefaults().removeObjectForKey('FeliksPro');
  }
  static autoSubscribe(t = !0) {
    this.getConfig('autoSubscription')
      ? this.getConfig('activated')
        ? this.isSubscribed()
          ? subscriptionUtils.refreshAddonCommands()
          : this.config.subscriptionDaysRemain
            ? ((this.config.activated = !0),
              (this.config.subscribedDay = subscriptionUtils.getToday()),
              (this.config.subscriptionDaysRemain = this.config.subscriptionDaysRemain - 1),
              subscriptionUtils.subscriptionController.activationStatus &&
                subscriptionUtils.subscriptionController.activationStatus.setTitleForState(this.getStatus(), 0),
              subscriptionUtils.showHUD('Subscription days remian: ' + this.config.subscriptionDaysRemain),
              subscriptionUtils.refreshAddonCommands(),
              this.save())
            : subscriptionNetwork.onSubscrbing
              ? subscriptionUtils.refreshAddonCommands()
              : subscriptionNetwork.subscribe().then((t) => {
                  subscriptionUtils.refreshAddonCommands();
                })
        : (t && subscriptionUtils.showHUD('Not activated!'),
          (subscriptionConfig.config.autoSubscription = !1),
          subscriptionUtils.refreshAddonCommands())
      : subscriptionUtils.refreshAddonCommands();
  }
}
