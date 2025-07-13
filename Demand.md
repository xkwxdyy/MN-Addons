现在继续开发 mnutils 的 MNMath 类的 manageCommentsByPopup 函数。
1. switch (buttonIndex) 是通过对应按钮的数字，但是这样有一个不足就是，如果把上面的数组里的元素换一下顺序，那么下面的 switch 语句必须整体都要改，很麻烦，请你优化。
2. 目前弹窗里的多选功能支持移动和删除，我希望你再增加一个：“提取”。从效果上来看，就是把选中的内容提取出来变成新的卡片，成为子卡片，不需要有标题。具体的实现方式如下：
- 假设选中的是 note，那么克隆一下 note 为 clonedNote，并且把 clonedNote 添加为 note 的子卡片
- 因为是克隆的，所以两个卡片的评论是一模一样的，对应的 index 也是一样的，所以要达到提取的效果，其实就是把 clonedNote 里在弹窗里选中的几个评论之外的评论都删除掉就行了。
ultrathink


---
ocrAsProofTitleWithTranslation 目前无法实现翻译功能，翻译的那个弹窗点击后仍然是直接把翻译前的内容作为了标题。请深入学习 mnautostyle 插件项目，这里开发了 autoAi* 的功能，其中有一个是自动翻译！刚好是我们要的，请学习他的实现方式，并迁移过来。ultrathink


---
我补充一下，使用 mntoolbar 的时候，默认是 MNUtils 的 API Key 填写好了的
---
1. 没有 MNUtil.alert 函数 
2. 你这个 API 配置很有问题,很麻烦. 并不需要, MNUtils 插件里有一个 Subscription Manager，我们是在这里有一个总的 API Key 填写，然后 AI 调用的话，只需要切换模型即可，什么都不需要配置。请你把这个操作学习过来，请再仔细学习 mnai 项目！ultrathink


---
现在开发 mntoolbar/mntoolbar 项目：
1. 现在已经有 ocrAsProofTitle 函数了，这个函数的作用是调用 OCR 对卡片进行 OCR 并将返回的结果设置为标题。
2. 现在我希望你仔细研究 mnai 和 mntoolbar 项目的代码，我希望实现的功能是：能够进一步调用 AI 来将上面返回的结果翻译为中文。所以你得非常清楚 mnai 插件是如何实现的 AI 调用的，以及返回的结果如何获取，以及对应 的 Prompt 如何设置，还有可以设置一些 Function call 这个可以作为参考，我们作为底层代码层，大概率用不到这个，我们主要是需要 AI 返回的结果。ultrathink

---
很好，现在我的需求是我会点击一张卡片，然后我希望对这个卡片的所有没有标题的子孙卡片都进行这样的 OCR 操作，你看看能不能行？ultrathink
---
继续开发 mntoolbar：
尝试在“证明”按钮的长按菜单里加一个功能：
将选中的卡片 OCR，并且把 OCR 的结果设置为标题。
1. 参考 toolbar 本来就有的 OCR 动作
2. 要注意 onFinish 的处理，因为 OCR 需要时间
3. 调用的模型和源和 toolbar 保持一致，默认用第一个，然后用 JSDoc 写其余的，然后我来选 
ultrathink
---
修复 mntoolbar 的 upwardMergeWithStyledComments ：在 git 的 e0e40164b75bb9353b6bb015cf22399c7bfacccc 和5a616902f5f20d4d42c758845c5ce18d30ada447 两次 commit 中删除了大量的 API。不知道是不是这次删除导致的问题。
请你先分析这个动作的逻辑和功能，然后目前的效果是除了第一张子卡片的标题变成了 HtmlMardown 评论添加，然后后续的合并之类的以及后续的卡片都没有变！请你找出问题并修复！ultrathink
---
现在开发 mnutils 的  HtmlMarkdownUtils：
增加一个新的类型叫 check，具体的样式为
```
<span id="check" style="font-weight:600;color:#34A853;background:#E6F7EE;border:2px solid #34A853;border-radius:4px;padding:4px 8px;display:inline-block;box-shadow:0 1px 2px rgba(52,168,83,0.2);margin:0 2px;line-height:1.3;vertical-align:baseline;position:relative;">🔍 CHECK
</span>
```
样式为上面的，emoji 也是上面的
默认的前缀是 CHECK。要注意兼容到 mntoolbar 的动作里面

然后 mntoolbar 新增一个按钮，内容为证明按钮,菜单为 menu_proof，单击动作为增加一个上面新增的这个 CHECK 的HtmlMarkdown 评论，不加任何内容。长按菜单的第一个就是制卡按钮里的有一个合并证明要点，这里也加一个一样的 ultrathink
---
1. JavaScript 基础的部分整体还是写的太生硬了，逻辑性不强，对新手不友好。
2. 学习 mntoolbar/mntoolbar_learning/main.js, mntoolbar/mntoolbar_learning/webviewController.js, mntoolbar/mntoolbar_learning/settingController.js 这三个文件中的 JSDoc 注释，里面详细地补充了一些对插件，尤其是 toolbar 插件里结构的框架，尽可能地把 JSDoc 注释里的内容充分学习凝练，然后写到 A_first_course_to_the_development_of_MN_Addon.md
3. 最后你要以一个完全新手的视角重新自己从头再读一遍这个文档，哪里觉得难懂的，哪里觉得不通俗的，哪里觉得不够详细的，哪里觉得不够深入浅出的，都要进行修改和补充。
4. `note.appendHtmlComment("<b>HTML</b>", "显示文本", 16);` 你这写的是错的，请读 mnai 项目学习如何正确使用 appendHtmlComment，如果你是从哪里看到的，说明那个地方也写错了，把那个地方一起改了。下面出现的 appendHtmlComment 的都要检查！
5. 
```// 通用函数
function changeNotesColor(context, colorIndex, colorName) {
  const { focusNotes } = context;
  
  if (!focusNotes || focusNotes.length === 0) {
    MNUtil.showHUD("❌ 请先选择笔记");
    return;
  }
  
  MNUtil.undoGrouping(() => {
    focusNotes.forEach(note => {
      note.colorIndex = colorIndex;
    });
    MNUtil.showHUD(`✅ 已改为${colorName}`);
  });
}
```
其中`const { focusNotes } = context;` 是不是有问题啊，是不是还得写成 `const { button, des, focusNote, focusNotes, self } = context;`，下面有好多都是！不知道你从哪里看到的 `const { focusNotes } = context;`  的写法，这是错误的，把原出处也要改掉！

ultrathink
---
请基于当前目录下的 mnai, mntask, mnutils, mntoolbar 项目，完善  ./A_first_course_to_the_development_of_MN_Addon.md, 我把里面初步的框架写好了。这是一个面向一个没有 JavaScript 基础的 MarginNote 插件开发新手的教学文档，所以尽可能写得通俗易懂，深入浅出。

1. 把几个项目里的所有 Markdown 文件全都精读一遍！包括每个项目里的 CLAUDE.md 文件，这些都是开发插件中的精华所在。
2. 然后精读 mnutils, mntask 和 mntoolbar 项目代码，这是开发的重点，尤其是 mnutils. 也是后续初学者开发主要学习的插件。
3. 然后再精读 mnai 项目代码，了解插件更多的处理可能性以及一些结合插件实现的操作，了解插件还能实现什么效果
4. 你要完成上面几个内容再开始写。JavaScript 基础不需要太深，但是
   - 在开发新按钮功能中涉及到的
   - MNUtils 的基础 API 中涉及到的
  这些要写详细
1. MNUtils 一定要总结最常见，最常用的 API，尤其是 MNNote 类和 MNUtil 类的 API，这些是开发插件的基础。

希望最终的效果是只需要通过你的这一个文档就能让一个没有 JavaScript 基础的初学者，能够快速入门 MarginNote 插件开发，并且能够独立开发出自己的插件。ultrathink

---
还是有大问题！很多函数还是被删了！比如 mergIntoAndRenewReplaceholder，对照你写的 deleted_mnnote_methods_report.md 一个一个排查！ mntoolbar 里只要出现的都不能删！！！！！！！ ultrathink
---
重点排查一下 git 的：5a616902f5f20d4d42c758845c5ce18d30ada447 里的更新内容。具体说明如下：

上一次我让你根据：
```
请你精简 mnutils/xdyyutils.js 文件里的代码，不需要处理 MNMath 和 HtmlMarkdownUtils 类和 Pangu 类。其余的都需要处理。

精简依据，也就是下面情况的要删除
1. 没有在 mntask 里用到的
2. 没有在 mntoolbar 里用到的

尤其是 xdyyutils.js 里面有很多 MNNote 和 MNUtil 类的函数补充，但是很多内容都已经在 MNMath 类里实现了，所以不需要了，但是还是有一部分在 mntoolbar 里有用到，这些暂时保留先。
```
简化了代码，但是我发现有一个具体的情况：你把很多 mntoolbar, MNMath, HtmlMarkdownUtils 里涉及到的函数也删除了！比如 MNNote 的扩展：moveCommentsByIndexArr （好像是这个）！

请你完整自查，看看是不是误删了什么！不要删多了！ultrathink
---
请你精简 mnutils/xdyyutils.js 文件里的代码，不需要处理 MNMath 和 HtmlMarkdownUtils 类和 Pangu 类。其余的都需要处理。

精简依据，也就是下面情况的要删除
1. 没有在 mntask 里用到的
2. 没有在 mntoolbar 里用到的

尤其是 xdyyutils.js 里面有很多 MNNote 和 MNUtil 类的函数补充，但是很多内容都已经在 MNMath 类里实现了，所以不需要了，但是还是有一部分在 mntoolbar 里有用到，这些暂时保留先。

注意：最后再精简 String 类部分的代码，因为这个有些函数用在了需要删除的函数里，但是你因为这个而没有删除，为了避免这个，所以最后处理。 ultrathink
---
我刚更新了 mntoolbar 的按钮菜单（xdyy_menu_registry.js 文件中）
这个是最新的版本，请你基于这个菜单，查看 xdyy_custom_actions_registry.js 文件里的动作，没有在菜单里的动作全都删除。
然后查看按钮 xdyy_button_registry.js 文件，删除菜单不在菜单文件里的按钮。
ultrathink


---
优化一下 convertFieldContentToHtmlMDByPopup 函数，参考 manageCommentsByPopup 函数的处理，支持多选就行。ultrathink

---
继续开发 MNMath 的 smartLinkArrangement 函数。目前没有命题与命题的情况对吧？
或者是例子与例子，反例与反例，或者是这三种与这三种其一的情况，都按照下面的处理：和定义与定义的类似。

希望的效果是，假设是卡片 A 和 卡片 B
1. 检测卡片 A 的最后一条评论是否是 B 的链接，以及 B 的最后一条是否是 A 的链接，两个都是的话进行下一步
2. 在 A 的“相关思考”字段的 bottom 下方增加一个“- ”，然后把 B 的链接移动到这个“- ”下方，同理处理 B 卡片。其实这个操作和定义与定义的是一样的。

并且把上面说的这几种情况的功能优化到 mntoolbar 里的 moveUpThoughtPointsToBottom 动作，目前这个单击动作只有一个功能：把自动获取的内容移动到“相关思考”，但希望能够把上面的处理进行兼容。ultrathink
---
manageCommentsByPopup 需要优化:现在是把移动和删除的确认放在了新的弹窗里，但是这样会有点麻烦，我希望的是如果第一个弹窗里选择了“多选”，那么就把这个选项直接放在了多选的那个选择弹窗的下方（目前只有一个确认）。
因为弹窗多的话，确认起来就比较繁琐，虽然现在功能很丰富。ultrathink
---
今日看板那个功能继续开发：现在看不到任务类型，只能看到状态，这个不太好，因为我们启动任务肯定是做“动作”类型的任务。另外我是学生，很多时间都在读书，所以重点研究一下如何拆解读书任务？目前有的那些拆解是很久之前写的，并不完善！希望基于目前的框架和体系重新写。
注意一定要灵活，能方便地调整和追踪。 ultrathink
---
优化一下制卡功能：
目标、关键结果卡片比较特殊，他们在“同一条”下是唯一的，也就是一个目标的子卡片只能是关键结果类型的卡片，关键结果类型的卡片的子卡片只能是项目类型，所以这两种情况就不需要弹窗选择了，就按照上面说的制卡就行，其余的情况不确定，所以才需要手动选择。ultrathink
---
继续开发 mntask：
目前增加一个今日任务的识别符号，然后筛选的效果是把他们都移动到今日看板。但这样有个问题是还要考虑到后续把他们移动回去的问题。

所以我觉得就是在今日看板里通过链接或者 Markdown 形式的行内链接比较好，这样那个“今日看板”可以更加宏观地区看到任务情况，所以其实就是把今日任务的一些处理，都最后呈现为 “今日看板” 卡片里的评论的处理。

所以请你优化一下。ultrathink
---
MNMath 的 smartLinkArrangement 函数有点问题
1. 命题卡片A这种知识点卡片和归类卡片B双向链接之后触发的话，A 中的B 链接，应该移动到“相关链接”的 bottom，而不是 top，top 有个问题是会被后续制卡的时候 linkParent 给清除掉
2. 加一个新的支持：定义 A和归类卡片B 的情形：A 在 B 内的链接移动到“所属”字段的 bottom
---
有一个需求：我希望能够把一些卡片“pin 住”，相当于收藏一些卡片，并且能够随时调用，在 FloatMindMap 里显示。
具体的交互设想如下：
1. 如何收藏卡片
   - 我想的是在 toolbar 的视图里增加一个新的 view（你可以重点学习一下 toolbar 里的切换视图(搜索 tabView)功能。）然后里面提供两个输入框，第一个写标题，也就是最后调用的时候显示的内容，第二个就写卡片的 URL 或者 ID，mnutils/xdyyutils.js 里面有一些 String 的方法可以判定和处理，比如统一处理为 ID 之类的，但是其实问题都不大，因为正确的 URL 和 ID 都能作为 MNNote.new 的参数，然后 focusInFloatMindMap 就行了。
   - 但上面只是我暂时想的，重点其实是如何设计的可以方便加入，修改，删除和调顺序
     - 修改的话，就是点击之后两个输入框里就显示对应的信息，修改后保存就可以更新，有点类似于第一个按钮视图的设置那种感觉
     - 还希望能支持：如果ID 那个输入框是完全空的也能加入，因为这个时候会作为一种分隔符来分隔卡片（万一太多的话）
   - 我突然想到可以类似于第一个按钮视图那种，他也支持改顺序，每个按钮下方也是会有两个框！我发现可以仿照那个视图弄一个！
2. 如何调用卡片
   - 我其实之前弄过一个按钮，应该是带有 `pin` 的一个，然后 toolbar 支持替换软件原生的菜单，这样的话，我就用 pin 来替换原生的菜单，当然也可以不替换，但反正通过`pin`按钮，我单击一下就可以看到一个 pin 菜单，每个 item 都可能是卡片（也可能有一些 item 是用来划分的），然后点击具体的标题就可以在浮窗中定位到对应的卡片
   - 或者你想想看怎么弄比较好？

关键点
1. 这个信息需要能够被保存，所以你需要看看如何把这些信息存到 iCloud 里，这个在 toolbar 里是可以做到的。
2. 一旦你需要在 xdyy*.js 外的文件里进行修改，要注意这些文件是官方的文件，更新的时候需要用 update.py 来打补丁，免去我手动修改的麻烦。
ultrathink
---
请学习 mnai, mntoolbar, mnutils 项目，前两个学习卡片的更多处理的可能性以及一些结合插件实现的操作， mnutils 学习基础 API。请你进一步规划思考任务管理需要的筛选，并且完善今日任务的筛选以及后续处理，并增加其它类型的筛选 ultrathink
---
请你阅读 mntask 的 TaskFieldUtils 和 MNTaskManager 两个类，了解目前已经开发的一些功能。基础 API 参见 mnutils 项目
现在打算开始开发 mntask 的筛选功能了，因为目前只切换状态的话，会有很多进行中的任务
我们首先解决:
1. 要有一个今日看板？（在 Task Board 视图里添加绑定）
2. 如何标记哪些是今天要做的？比如在信息字段下加什么子字段？
3. 如何把这些卡片筛选出来？
4. 筛选出来之后如何确定这些任务的顺序、优先级？也就是先做哪件再做哪件？
5. 做完了带有今日任务标记的任务，今日看板内如何更新？
ultrathink
---
mntoolbar 里的 moveNewContentsByPopupTo 动作和 deleteCommentsByPopup 动作，本质上是 MNMath 里的两个函数。我希望他们能统一。

现在moveNewContentsByPopupTo 对应的 moveCommentsByPopup 函数对评论的多选处理和解析已经很完善了，后续就在这个上面进行进一步开发。我希望能把删除评论的功能加进来。我的大致思路如下：
1. 第一个弹窗整体，依旧是选择获取评论的方式
2. 第一个弹窗的几个选项触发的第二个弹窗里都加一个按钮，功能就是“删除”，然后原来的“确定移动”类型的功能，改成“移动”，具体的用词你可以调整，反正就是这个窗口就可以选择下一步行动是删除还是移动，如果是删除，就再给一个弹窗，弹窗的提示内容里把我选中的内容的类型和内容都列出来（就和弹窗里解析显示的是一样的），点击确认的话删除就可以了。
如果选择移动，则按照之前的处理即可

开发完之后应该更新一下 mntoolbar 那个菜单里的动作，应该是可以把删除评论的去掉，以及删除评论的函数也可以去掉了。
ultrathink
---
我发现移动和删除评论的弹窗函数里都有一个问题，就是归类卡片的前缀有问题
```
“xxx”相关yy
```
的归类卡片的类型应该写成 `[yy归类]` 而不是 `[yy]` ultrathink
---
刚测试了还是有个 bug: 命题卡片证明字段的内容,如果移动到"相关思考"字段下方的某个评论 A,我刚测试了点击"A上方"和"A 下方",结果都是到了 A 上方 ultrathink         
---
第二层解决了，但是第三层没有完全解决，虽然我也能接受，但是你看这个图 [Image #1], 明显是 HtmlMarkdown评论字段下方的内容暴露出来了! 比如那个"倒数第一"到"纯手写" 这个部分应该隐藏在 "的回答很好的"这一项里面 ultrathink
---
再补充一下，刚刚的例子中，第三层也是和第二层同理，要有一个第三层的粗略位置，也就是 1 前面，1 后面， A，A top，A bottom，B，B top，B bottom，点击 A 或者 B 进入更细节的位置控制 ultrathink
---
你说的第三层,我怕你没理解正确,我补充一下,这个时候暴露出来的普通评论的前面应该是没有任何 HtmlMarkdown 评论的,一旦有,就和前面说的一样,一定属于某个 HtmlMarkdown 评论,那么这个时候就不能暴露在这层,比如 1, A, 2,B 3. 其中  A 和 B 是 HtmlMarkdown 评论，然后从左到右 index 增加，这个时候 1 就是需要和 HtmlMarkdown 同层，因为它不属于任何 HtmlMarkdown 评论，但是 2 属于 A， 3 输入 B，所以 2 需要点击 A 才能看到，3 需要点击 B 才能看到。 ultrathink
---
还是有问题：这张图
第二个弹窗怎么又把字段里的内容暴露了？
这个部分
这个时候不应该显示的，这个部分的内容，应该点击“证明区”然后在第三个弹窗里显示
第三个弹窗也是这个类似的问题：
应该像第二个弹窗一样，先提供每个 HtmlMarkdown 评论的 top 和 bottom，然后如果有进一步需要，再点 HtmlMarkdown，比如我点击 “你干嘛啊”，才到第四个弹窗的内容。

总结一下，其实现在要的效果有了，但是第二个和第三个窗口都有暴露内容的问题。还没把这个“文件夹”分得很彻底 ultrathink
---
继续开发 mntask: 现在任务只有三个状态，但是其实第三个状态可以点击后进行归档，我希望在状态栏那个地方也增加一个“已归档”状态，来与“已完成”区分，因为“已完成”可能会退回“进行中”。 ultrathink
---
我刚发现应该还需要一个弹窗，因为目前第三个弹窗是 HtmlMarkdown 评论与其下方的所有内容都暴露在一起，容易混淆。
应该是类似于第二个弹窗，如果要更精细移动化，再点 HtmlMarkdown 评论，这样就进入到第三层弹窗，里面的内容是 HtmlMarkdown 下方的所有内容。 这样才真正能实现三层，像文件夹一样的效果。ultrathink
---
这张图左边是具体的卡片，右边是第二层弹窗，有个问题是这个时候 HtmlMarkdown 评论的字段不应该显示的，不应该在这一层就暴露出来，只有当我需要进一步点击证明区的时候才需要，但我看点击后第三层的功能确实也实现了，请把这个第二层优化一下  ultrathink
---
1. 现在第一个弹窗里根本无法像 deleteCommentsByFieldPopup 那样多选！ ultrathink
---
1. 如果是解析的是纯链接，那么弹窗里显示的应该是标题，不过如果有前缀的话需要处理，参考一下别的函数的处理，其实就是处理为`[类型] 标题`
2. 手写内容没有正确识别类型，可以学习一下 deleteCommentsByFieldPopup 函数的类型处理。要注意用 note.MNComments 来获取更精细的类型
3. 你目前也只是开发了两层，你相当于把 HtmlMarkdown 评论和其它评论看成一种了。在第二层的时候，其余类型的评论不应该“暴露出来”，应该要进一步点击某条 HtmlMarkdown 评论才行。所以你得学习 MNMath 的字段识别和字段下方内容获取，HtmlMarkdown 评论也要有一套类似的。ultrathink
---
继续开发 mnutils

## moveCommentsByPopup 增加新功能
目前我们 xdyyutils.js 里的 MNMath 类有一些能够解析普通评论的函数（不是函数本身，而是内部实现了），你可以学习一下。这里普通评论是指文本手写，图片，链接之类的，也就是说，不是我们 MNMath 里专门的字段或者是 HtmlMarkdownUtils 类里加的这种评论，虽然它们本质上也是 markdown 评论。

目前的 moveCommentsByPopup 函数的功能是只实现了两层。第一层是 HtmlComment 类型评论的字段，第二层是点击 xx 区“进入了第一层到达第二层”（这里的“进入了第一层”是指获取了这个字段下面的内容，也就是到下一个字段之间的内容。）

然后我们目前可以解析 HtmlMarkdown 评论。但现在有一些还没考虑到的场景：
1. 第二层里没有 HtmlComment 类型评论的字段，而是普通评论
   - 这种情况下就需要能够解析普通评论，从而能够移动内容到这种评论的位置，也就是能精准定位。
2. 如果有 HtmlComment 类型，先解析，然后在现在的基础上进一步处理：
   - 如果两个 HtmlComment 类型 A 和 HtmlComment 评论 B 之间有普通评论，那么 A 的两条（也就是 A 上方和 A 下方）就增加一条，点击后可以“进入 A”，也就是到了第三层，再有一个弹窗，里面的内容是解析的 A 和 B 之间的评论，然后这个时候就只需要有某条“下方”，以及最开始和最下方即可，因为这样已经可以取遍所有index 了
   - 如果 A 和 B 之间没有普通评论，那么就保持只有 A 的两条，也就是 A 上方和 A 下方


## moveCommentsByPopup 触发后的默认效果需要优化
- 不需要关键词（这个有其它函数处理过，你可以学习一下，关键是是不显示“关键词”，但是不要影响“关键词”上面一个和下面一个字段的处理
- 加一个“最后一条评论”按钮，和手动输入“Z”是一个效果，因为我发现我经常移动最后一条评论。
ultrathink

## 选择移动的内容也要继续优化
在选择移动什么内容（也就是第一个弹窗的选项）时，目前能选择的内容只有
- 自动获取
- 手动输入 Index
- 某个具体的字段下方的全部内容

无法更加精细化地选择。目前已经在其它函数里通过弹窗实现了多选。

希望也能像刚刚的提到的那样，进行三层的解析，如果进入到第三层，或者没有 HtmlComment 评论时的第二层，可以通过弹窗选择，也可以多选，多选其实就是涵盖了整个字段的处理。