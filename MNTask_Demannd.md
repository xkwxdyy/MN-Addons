下面开发 mntask 项目。
1. 一旦修改代码，就需要按照修改的内容程度来改 mnaddon.json 的版本号。
2. 任何更新，尤其是新功能，要在 mntask_guide.md 里详细更新。
---
目前开发的按钮功能包括菜单里的，仍然有很多有问题！请你进行一遍详细的自查与修复 ultrathink

---
添加任务记录这些功能应该放在字段记录的那个按钮里，而不是任务状态切换的按钮 ultrathink


---
设置优先级功能出问题了，没有弹窗，而是直接加了 `<span id="subField" style="background:#FFF;color:#FF8C5A;border:2px solid currentColor;border-radius:3px;padding:6px 12px;font-size:0.9em;font-weight:600;box-shadow:0 1px 3px rgba(255,140,90,0.2);display:inline-block;">🔥 优先级: ⚪ undefined</span>` 请修复 ultrathink

---
过期任务功能现在很不完善！看板里虽然会增加有几个过期任务，但我看不到哪些过期了，“使用「处理过期任务」功能管理”，这个提示也没用啊，也没这个功能。

筛选的功能也有大问题，请你仔细重新检查。ultrathink

---
MNTask 里关于任务记录的几个功能，没几个能用的，要不就是点击没反应，请仔细检查！ ultrathink



---
我发现 MNTask 里用了 MNMath 的 toNoExcerptVersion 函数，并且很多次，但这个其实和 math 无关，我觉得要不就把 toNoExcerptVersion 函数的实现写到 mntask 里的辅助类里，避免对 MNMath 类有依赖，因为 MNMath 是扩展部分，不是官方原生的功能。ultrathink

---
重新完善一下按钮和菜单功能，支持单击和长按弹出菜单。感觉现在的太多太乱了。有很多内容只有个框架，先暂时去掉。把用到 MNTaskManager 和 TaskFieldUtils 的这些功能留着，其余没用到的先删除，不然现在菜单里东西太多，我不知道哪些已经开发了。ultrathink

---
请继续开发新功能：目前任务没有一个记录系统，类似于时间戳的那种，即使是动作任务可能也会有几步，所以需要一个记录系统来记录每个任务的完成情况，也就是类似于百分比的那种感觉，但是可以让用户记录每个步骤都做了什么，完成的怎么样，也类似于任务日志的东西


请学习一下 mnai 项目了解插件更多的处理可能性以及一些结合插件实现的操作， mnutils 项目学习基础 API。
然后我希望你思考

---
1. 自定义字段的添加优化一下，目前是默认加在`信息`字段的最下方。

默认制卡是加了`所属`，然后下方是`启动`，之后的新加就默认加在 `信息` 字段的下方，视觉上就是不断往上叠加，而不是从下面加入的。


2. 请学习 MNMath.manageCommentsByPopup 函数，解析字段内容，可以多选，然后进行移动和删除，mntask 里可以简单很多，因为没有 HtmlComment 类型的字段。只需要按照 id 那个来逐层解析，比如是先按 mainField 然后是 subField。
3. 至于如何获取新内容以及最后一个评论，这个暂时不要，目前就是
   - 选择字段
   - 多选
  然后类似地可以选择移动或删除。
4. 新功能加完了之后把这个写到按钮菜单里面。