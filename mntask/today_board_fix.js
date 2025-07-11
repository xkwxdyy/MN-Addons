/**
 * 今日看板刷新问题临时修复补丁
 * 测试不同的评论添加方法
 */

// 备选方案1：使用 appendTextComment
function testAppendTextComment(boardNote) {
  try {
    MNUtil.log("🧪 测试 appendTextComment...")
    boardNote.appendTextComment("测试文本评论")
    MNUtil.log("✅ appendTextComment 成功")
    return true
  } catch (e) {
    MNUtil.log(`❌ appendTextComment 失败: ${e.message}`)
    return false
  }
}

// 备选方案2：使用 appendHtmlComment
function testAppendHtmlComment(boardNote) {
  try {
    MNUtil.log("🧪 测试 appendHtmlComment...")
    boardNote.appendHtmlComment("<h2>测试 HTML 评论</h2>")
    MNUtil.log("✅ appendHtmlComment 成功")
    return true
  } catch (e) {
    MNUtil.log(`❌ appendHtmlComment 失败: ${e.message}`)
    return false
  }
}

// 备选方案3：直接操作 MNComments
function testDirectCommentManipulation(boardNote) {
  try {
    MNUtil.log("🧪 测试直接操作 MNComments...")
    const comment = {
      type: "TextNote",
      text: "直接添加的评论",
      noteid: boardNote.noteId
    }
    boardNote.MNComments.push(comment)
    MNUtil.log("✅ 直接操作 MNComments 成功")
    return true
  } catch (e) {
    MNUtil.log(`❌ 直接操作 MNComments 失败: ${e.message}`)
    return false
  }
}

// 修复后的 addTaskLinksToBoard
function fixedAddTaskLinksToBoard(boardNote, grouped) {
  MNUtil.log("🔧 使用修复版本的 addTaskLinksToBoard")
  
  // 测试哪种方法可用
  const canUseMarkdown = testAppendMarkdownComment(boardNote)
  const canUseText = testAppendTextComment(boardNote)
  const canUseHtml = testAppendHtmlComment(boardNote)
  
  MNUtil.log(`📊 测试结果: Markdown=${canUseMarkdown}, Text=${canUseText}, Html=${canUseHtml}`)
  
  // 根据测试结果选择合适的方法
  let appendMethod = null
  if (canUseMarkdown) {
    appendMethod = (text) => boardNote.appendMarkdownComment(text)
  } else if (canUseText) {
    appendMethod = (text) => boardNote.appendTextComment(text)
  } else if (canUseHtml) {
    appendMethod = (text) => {
      const html = text.startsWith("##") ? 
        `<h2>${text.substring(2).trim()}</h2>` : 
        `<p>${text}</p>`
      boardNote.appendHtmlComment(html)
    }
  } else {
    MNUtil.log("❌ 没有可用的评论添加方法！")
    return
  }
  
  // 使用选定的方法添加内容
  if (grouped.highPriority.length > 0) {
    appendMethod("## 🔴 高优先级")
    grouped.highPriority.forEach(task => {
      const link = MNTaskManager.createTaskLink(task)
      appendMethod(link)
    })
  }
  
  // ... 其他分组类似处理
}

function testAppendMarkdownComment(boardNote) {
  try {
    boardNote.appendMarkdownComment("## 测试 Markdown")
    return true
  } catch (e) {
    return false
  }
}

// 导出修复函数
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fixedAddTaskLinksToBoard,
    testAppendTextComment,
    testAppendHtmlComment,
    testDirectCommentManipulation
  }
}