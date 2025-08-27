class chatAITool{
  /** @type {String} **/
  name
  /** @type {Array} **/
  args
  /** @type {Array} **/
  tem = []
  /** @type {String} **/
  description
  /** @type {String} **/
  preContent = ""
  /** @type {String} **/
  preHtml = ""
  /** @type {String} **/
  preCSS = ""
  /** @type {Boolean} **/
  needNote
  /** @type {UIView} **/
  executeView = undefined
  /**
   * 
   * @param {String} name 
   * @param {Array} args 
   * @param {String} description 
   * @param {Boolean} needNote 
   */
  static new(name,config){
    // return new chatAITool(name,args,description,needNote)
    return new chatAITool(name,config)
  }
  static showHUD(text,duration = 2){
    if (this.executeView) {
      MNUtil.showHUD(text,duration,this.executeView)
    }else{
      MNUtil.showHUD(text,duration)
    }
  }
  static waitHUD(text){
    if (this.executeView && !this.executeView.hidden) {
      MNUtil.waitHUD(text,this.executeView)
    }else{
      MNUtil.waitHUD(text)
    }
  }
  constructor(name,config){
    this.config = config
    this.name = name;
    this.args = config.args;
    this.description = config.description;
    this.needNote = config.needNote ?? false
    this.toolTitle = config.toolTitle ?? ""
  }
  static genToolMessage(content,funcId){
    if (typeof content === 'object') {
      if (content.success) {
        let text = "Successfully executed this tool call."
        if (content.response) {
          text += "\n\nTool Response:\n"+content.response
        }
        return {"role":"tool","content":text,"tool_call_id":funcId}
      }else{
        let text = "Failed to execute this tool call."
        if (content.response) {
          text += "\n\nTool Response:\n"+content.response
        }
        return {"role":"tool","content":text,"tool_call_id":funcId}
      }
    }else{
      return {"role":"tool","content":content,"tool_call_id":funcId}
    }
  }
  body(forMinimax = false) {
    let parameters = {
      "type": "object",
      "properties": this.args,
    }
    if ("required" in this.config) {
      parameters.required = this.config.required
    }else{
      parameters.required = Object.keys(this.args)
    }
    let funcStructure = {
      "name":this.name,
      "description":this.description
    }
    if (forMinimax) {
      funcStructure.parameters = JSON.stringify(parameters)
      return {"type":"function","function":funcStructure}
    }
    funcStructure.parameters = parameters
    return {"type":"function","function":funcStructure}
  }
  checkArgs(args,funcId){
    // MNUtil.copy(args)
    let res = {onError:false}
    let args2check = []
    if ("required" in this.config) {
      args2check = this.config.required
    }else{
      args2check = Object.keys(this.args)
    }
    if (args2check.length) {//如果有必选参数
      if (!args) {
        res.onError = true
        res.errorMessage = this.genErrorInMissingArguments(args2check[0],funcId)
        return res
      }
      for (let arg of args2check) {//必选的参数
        if (!(arg in args)) {//如果必选参数不在AI实际提供的参数中,则报错
          res.onError = true
          res.errorMessage = this.genErrorInMissingArguments(arg,funcId)
          return res
        }
        // chatAIUtils.addErrorLog(JSON.stringify(args), funcId, "Missing arguments: "+arg)
        if (typeof args[arg] === 'string' && !(args[arg].trim())) {
          res.onError = true
          res.errorMessage = this.genErrorInEmptyArguments(arg,funcId)
          return res
        }
      }
    }else{
      return res
    }
    return res
  }
  clearPreContent(){
    this.preHtml = ""
    this.preCSS = ""
    this.preContent = ""
  }
  /**
   * 
   * @param {object} func 
   * @param {string|undefined} noteId 
   * @returns {Promise<{toolMessages:object,description:string}>}
   */
  async execute(func,noteId = undefined,onChat = false){
  try {
  /**
   * @type {MNNote} 
   */
  let note
  /**
   * @type {Array<MNNote>} 
   */
  let notes = []
  /**
   * @type {MNNote} 
   */
  let parentNote
  /**
   * @type {Array<MNNote>} 
   */
  let fromNotes = []
  /**
   * @type {MNNote} 
   */
  let toNote
  /**
   * @type {MNNote} 
   */
  let fromNote
  let tags = []
  let funcName = this.name
  let args = chatAIUtils.getValidJSON(func.function.arguments)
      // MNUtil.log({message:"createMindmap",detail:func.function.arguments})
      // MNUtil.log({message:"createMindmap",detail:args})

  // MNUtil.copy(func.function.arguments)
  let noteid = noteId ?? chatAIUtils.getFocusNoteId(this.needNote)
  // MNUtil.log(noteid)
  if (this.needNote && !noteid) { return this.genErrorInNoNote(func.id)}
  let checkRes = this.checkArgs(args,func.id)
  if (checkRes.onError) { return checkRes.errorMessage}
  if (this.needNote || noteid) {
    note = MNNote.new(noteid)?.realGroupNoteForTopicId()
    // MNUtil.log("123"+note.noteId)
  }
  let response = {}
  // MNUtil.log({message:"execute",detail:funcName})
  switch (funcName) {
    case "createMindmap":
      response = this.createMindmap(func,args,note)
      break;
    case "userSelect":
      response = await this.userSelect(func,args)
      break;
    case "userConfirm":
      response = await this.userConfirm(func,args)
      break;
    case "userInput":
      response = await this.userInput(func,args)
      break;
    case "generateImage":
      response = await this.generateImage(func,args)
      break;
    case "knowledge":
      response = await this.knowledgeAction(func,args)
      break;
    case "organizeNotes":
      response = await this.organizeNotes(func,args)
      break;
    case "editNote":
      response = await this.editNote(func,args,note)
      break;
    case "searchNotes":
      response = await this.searchNotes(func,args)
      break;
    case "createHTML":
      response = await this.createHTML(func,args)
      break;
    case "createMermaidChart":
      response = await this.createMermaidChart(func,args)
      break;
    default:
      break;
  }
  if (Object.keys(response).length) {
    this.preHtml = ""
    this.preCSS = ""
    this.preContent = ""
    return response
  }

  let message = {success:true}
  switch (funcName) {
    case "setTitle":
      response.result = MNUtil.mergeWhitespace(args.title.trim())
      message.response = "Title is set: "+response.result
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
      MNUtil.undoGrouping(()=>{
        note.noteTitle = response.result
      })
      break;
    case "addComment":
      response.result = chatAITool.formatMarkdownList(args.comment)
      message.response = "Comment is added: "+response.result
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
      MNUtil.undoGrouping(()=>{
        note.appendMarkdownComment(response.result)
        if (MNUtil.mindmapView) {
          note.focusInMindMap(0.5)
        }
      })
      break;
    // case "createMermaidChart":
    //   let args = this.fixHtmlArgs(args)

    // case "createHTML":
    //   let fixedArgs = this.fixHtmlArgs(args)
    //   let fullHtml = this.getFullHTML(fixedArgs)
    //   if (fullHtml) {
    //     MNUtil.postNotification("snipasteHtml", {html:fullHtml})
    //     response.result = MNUtil.mergeWhitespace(fullHtml)
    //     response.success = true
    //     message.response = "HTML file is created, with a preview window"
    //   }else{
    //     message.response = "Creating HTML file failed"
    //   }
    //   response.toolMessages = chatAITool.genToolMessage(message,func.id)
    //   break;

    case "addTag":
      response.result = "#"+MNUtil.mergeWhitespace(args.tag.trim())
      message.response = "Tag is added: "+response.result
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
      MNUtil.undoGrouping(()=>{
        note.appendTextComment(response.result)
      })
      break;
    case "copyCardURL":
      response.result = note.noteURL
      message.response = "Link is copied: "+response.result
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
      MNUtil.copy(response.result)
      break;
    case "copyMarkdownLink":
      response.result = `[${args.title.trim()}](${note.noteURL})`
      message.response = "Markdown Link is copied: "+response.result
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
      MNUtil.copy(response.result)
      break;
    case "copyText":
      response.result = chatAITool.formatMarkdownList(args.text)
      message.response = "Text is copied: "+response.result
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
      MNUtil.copy(response.result)
      break;
    case "close":
      message.response = "Conversation is ended"
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
      break;
    case "readDocument":
      let currentFile = chatAIUtils.getCurrentFile()
      if (!currentFile.fileExists) {
        message.response = "Document is empty"
        message.success = false
        response.toolMessages = chatAITool.genToolMessage(message,func.id)
      }else{
        try {
          let PDFExtractMode = chatAIConfig.getConfig("PDFExtractMode")
          let currentDocInfo = await chatAIConfig.getFileContent(currentFile,PDFExtractMode === "local")
          response.toolMessages = chatAITool.genToolMessage(JSON.stringify(currentDocInfo,undefined,2),func.id)
        } catch (error) {
          response.toolMessages = chatAITool.genToolMessage("Reading document failed",func.id)
          throw error;
        }
        MNUtil.waitHUD("🤖 Reading: "+currentFile.name)
      }
      break;
    case "webSearch":
      if (chatAIUtils.checkSubscribe(true,false)) {
        MNUtil.showHUD("🤖 Searching for ["+args.question+"] ")
        let apikeys = ["449628b94fcac030495890ee542284b8.F23PvJW4XXLJ4Lsu","7a83bf0873d12b99a1f9ab972ee874a1.NULvuYvVrATzI4Uj"]
        let apikey = chatAIUtils.getRandomElement(apikeys)
        let res = await chatAINetwork.webSearch(args.question,apikey)
        response.renderSearchResults = JSON.stringify(res)
        response.toolMessages = chatAITool.genToolMessage(JSON.stringify(res),func.id)
      }else{
        message.response = "Empty response due to the subscription limit in MN Utils"
        message.success = false
        response.toolMessages = chatAITool.genToolMessage(message,func.id)
      }
      break;
    case "readNotes":
      let focusNotes = chatAIUtils.getFocusNotes()
      if (focusNotes.length === 0 || args.range === "allNotesInMindmap") {
        focusNotes = chatAIUtils.getCurrentNotesInMindmap()
      }
      // MNUtil.copy("object"+focusNotes.length)
      if (focusNotes.length > 100) {
        let confirm = await MNUtil.confirm("Too many notes ("+focusNotes.length+")","🤖: 当前脑图笔记过多请确认是否继续读取笔记("+focusNotes.length+")",["Cancel","Confirm"])
        if (confirm === 0) {
          message.response = "Empty notes"
          message.success = false
          response.toolMessages = chatAITool.genToolMessage(message,func.id)
          break
        }
      }
      // MNUtil.copy("object"+focusNotes.length)
      MNUtil.waitHUD("🤖 Reading "+focusNotes.length+" notes")
      if (focusNotes.length) {
        let notesContents = []
        for (let i = 0; i < focusNotes.length; i++) {
          const note = focusNotes[i];
          let structure = await chatAIUtils.genCardStructure(note.noteId)
          notesContents.push(structure)
        }
        let tree = chatAIUtils.buildHierarchy(notesContents)
        // MNUtil.copy(tree)
        MNUtil.delay(0.5).then(()=>{
          MNUtil.stopHUD()
        })
        response.toolMessages = chatAITool.genToolMessage("Below are the focused notes:\n"+JSON.stringify(tree,undefined,2),func.id)
      }else{
        message.response = "Empty notes"
        message.success = false
        response.toolMessages = chatAITool.genToolMessage(message,func.id)
      }
      break;
    case "mergeNotes":
      fromNotes = args.fromNoteIds.map((noteId)=>{
        return MNNote.new(noteId)
      })
      if ("toNoteId" in args) {
        let toNote = MNNote.new(args.toNoteId)
        MNUtil.undoGrouping(()=>{
          fromNotes.forEach((n)=>{
            toNote.merge(n)
          })
        })
        message.response = fromNotes.length+" notes are merged to "+args.toNoteId
        message.success = true
        response.toolMessages = chatAITool.genToolMessage(message,func.id)
      }else{
        message.response = "Those notes are not merged, because toNoteId is missing"
        message.success = false
        response.toolMessages = chatAITool.genToolMessage(message,func.id)
      }
      break;
    case "moveNotes":
      fromNotes = args.fromNoteIds.map((noteId)=>{
        return MNNote.new(noteId)
      })
      toNote = MNNote.new(args.toNoteId)
      MNUtil.undoGrouping(()=>{
        fromNotes.forEach((n)=>{
          toNote.addAsChildNote(n)
        })
      })
      message.response = fromNotes.length+" notes are moved as children of "+args.toNoteId
      message.success = true
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
      break;
    case "linkNotes":
      fromNote = MNNote.new(args.fromNoteId)
      toNote = MNNote.new(args.toNoteId)
      MNUtil.undoGrouping(()=>{
        fromNote.appendNoteLink(toNote)
        if (!("biDirectional" in args) || args.biDirectional) {
          toNote.appendNoteLink(fromNote)
        }
      })
      message.response = "Note is linked to "+args.toNoteId
      message.success = true
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
      break;

    case "readParentNote":
      let focusNote = MNNote.new(noteId)
      if (focusNote) {
        parentNote = focusNote.parentNote
        if (parentNote) {
          let noteContent = {
            title:parentNote.noteTitle,
            content:chatAITool.formatMarkdownList(parentNote.allText),
            id:parentNote.noteId,
            color:parentNote.color
          }
          if (parentNote.tags && parentNote.tags.length) {
            noteContent.tags = parentNote.tags
          }
          response.toolMessages = chatAITool.genToolMessage("Parent note:\n"+JSON.stringify(noteContent,undefined,2),func.id)
        }else{
          message.response = "Current note has no parent note"
          message.success = false
          response.toolMessages = chatAITool.genToolMessage(message,func.id)
        }
      }else{  
        message.response = "No note selected"
        message.success = false
        response.toolMessages = chatAITool.genToolMessage(message,func.id)
      }
      break
    case "clearExcerpt":
      MNUtil.undoGrouping(()=>{
        note.excerptText = ""
      }) 
      message.response = "excerpt is cleared"
      message.success = true
      response.toolMessages = chatAITool.genToolMessage(message, func.id)
      break;
    case "setExcerpt":
      // note = MNUtil.getNoteById(noteid)
      // response.result = args.excerpt.replace(/&nbsp;/g, ' ')
      response.result = chatAITool.formatMarkdownList(args.excerpt)
      note = MNNote.new(noteid)
      note = note.realGroupNoteForTopicId()
      MNUtil.undoGrouping(()=>{
        note.excerptText = response.result
        note.excerptTextMarkdown = true
        if (MNUtil.mindmapView) {
          note.focusInMindMap(0.5)
        }
      }) 
      message.response = "excerpt is set: "+response.result
      message.success = true
      response.toolMessages = chatAITool.genToolMessage(message, func.id)
      break;
    case "addChildNote":
      let title = args.title
      let config = {markdown:true}
      if (title) {
        config.title = title.trim()
      }
      let content = args.content
      if (content) {
        config.content = chatAITool.formatMarkdownList(content)
      }
      let htmlContent = args.html
      // if (htmlContent) {
      //   config.htmlContent = htmlContent
      // }
      tags = args.tags
      if (tags) {
        config.tags = tags
      }
      let color = args.color
      if (color) {
        config.color = color
      }
      if ("parentNoteId" in args && args.parentNoteId) {
        note = MNNote.new(args.parentNoteId)
      }else{
        note = MNNote.new(noteid)
      }
      if (!note) {
        note = MNUtil.currentChildMap
      }else{
        note = note.realGroupNoteForTopicId()
      }
      // MNNote.createChildNote
      response.result = config
      // MNUtil.showHUD("message")
      // MNUtil.copy(htmlContent)
      if (!note) {
        MNUtil.undoGrouping(()=>{
          note = MNNote.new(response.result)
          if (htmlContent) {
            note.appendHtmlComment(htmlContent, htmlContent, {width:1000,height:500}, "")
          }
          if (MNUtil.mindmapView) {
            note.focusInMindMap(0.5)
          }
          message.response = "child note is created"
          message.success = true
        })
      }else{
        MNUtil.undoGrouping(()=>{
          let child = note.createChildNote(response.result,false)
          if (!child) {
            MNUtil.showHUD("❌ Failed in create childNote")
            message.response = "Failed in create childNote"
            message.success = false
          }else{
            try {
              if (htmlContent) {
                child.appendHtmlComment(htmlContent, htmlContent, {width:1000,height:500}, "")
              }
            } catch (error) {
              chatAIUtils.addErrorLog(error, "addChildNote")
            }
            if (MNUtil.mindmapView) {
              child.focusInMindMap(0.5)
            }
            message.response = "child note is created"
            message.success = false
          }
        })
      }
      message.noteStructure = response.result
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
      break 
    case "UnkonwFunc":
      response.result = "Unknown function: "+funcName
      message.success = false
      message.response = "Unknown function: "+funcName
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
      break;
    default:
      break;
  }
  response.description = this.codifyToolCall(args,true)
  this.preHtml = ""
  this.preCSS = ""
  this.preContent = ""
  // MNUtil.copy(this.tem)
  return response
} catch (error) {
  chatAIUtils.addErrorLog(error, "chatAITool.execute",func)
  return {toolMessages:chatAITool.genToolMessage("Error: "+error.message,func.id)}
}
}
  createMindmap (func,args,note) {
    let response = {}
    let message = {success:true}
      let ast
      switch (typeof args.ast) {
        case "object":
          // MNUtil.showHUD("object")
          ast = args["ast"]
          response.result = JSON.stringify(ast)
          break;
        case "string":
          // MNUtil.showHUD("string")
          response.result = args.ast
          ast = chatAIUtils.getValidJSON(response.result)
          break;
        default:
          break;
      }
      // MNUtil.log({message:"createMindmap",detail:args})
      // MNUtil.copy(args)
      if ("parentNoteId" in args && args.parentNoteId) {
        // MNUtil.log("parentNoteId")
        note = MNNote.new(args.parentNoteId)
      }
      if (!note) {
        // MNUtil.log("currentChildMap")
        note = MNUtil.currentChildMap
      }
      message.response = "Mindmap is created: "+response.result
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
      MNUtil.undoGrouping(()=>{
        // MNUtil.showHUD("Creating mindmap...")
        try {
        let child = chatAITool.AST2Mindmap(note, ast)
        child.focusInMindMap(0.5)
          
        } catch (error) {
          chatAIUtils.addErrorLog(error, "createMindmap", func.id)
        }
      })
    response.description = this.codifyToolCall(args,true)
    return response
  }
  async userSelect(func,args) {
    let response = {}
    let message = {success:true}
    let selectRes = {button:0,input:""}
      let choices = ["Cancel"].concat(args.choices,"Reply")
      if (args.title && args.detail) {
        selectRes = await MNUtil.input("🤖: "+args.title,args.detail,choices)
      }else{
        selectRes = await MNUtil.input("🤖: "+args.title,"",choices)
      }
      if (selectRes.button === 0) {
        response.result = {question:args,confirmed:false}
        message.response = "User does not make the choice"
      }if(selectRes.button === choices.length-1){
        response.result = {question:args,confirmed:true,userInput:selectRes.input}
        message.response = "User does not make the choice but reply: "+selectRes.input
      }else{
        response.result = {question:args,confirmed:true,choice:choices[selectRes.button]}
        if (selectRes.input) {
          message.response = "User's choice: "+choices[selectRes.button]+", with reply: "+selectRes.input
        }else{
          message.response = "User's choice: "+choices[selectRes.button]
        }
      }
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
    return response
  }
  async userConfirm(func,args) {
    let response = {}
    let message = {success:true}
    let confirm = false
      if (args.title && args.detail) {
        confirm = await MNUtil.confirm("🤖: "+args.title,args.detail)
      }else{
        confirm = await MNUtil.confirm("🤖: "+args.title,"")
      }
      response.result = {question:args,confirmed:confirm}
      if (confirm) {
        message.response = "User confirms"
      }else{
        message.response = "User does not confirm"
      }
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
    return response
  }
  async userInput(func,args) {
    let response = {}
    let message = {success:true}
      let userInput = ""
      let res = {button:0,input:""}
      if (args.title && args.detail) {
        res = await MNUtil.input("🤖: "+args.title,args.detail,["Cancel","Confirm"])
      }else{
        res = await MNUtil.input("🤖: "+args.title,"")
      }
      if (res.button === 0) {
        response.result = {question:args,hasUserInput:false}
        message.response = "User does not reply or confirm"
      }else{
        userInput = res.input
        if (userInput) {
          response.result = {question:args,hasUserInput:true,userInput:userInput}
          message.response = "User replies: "+userInput
        }else{
          message.response = "User confirms"
          response.result = {question:args,hasUserInput:false,confirmed:true}
        }
      }
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
    return response
  }
  async createHTML(func,args) {
    let response = {}
    let message = {success:true}
    let fixedArgs = this.fixHtmlArgs(args)
    let fullHtml = this.getFullHTML(fixedArgs)
    if (fullHtml) {
      MNUtil.postNotification("snipasteHtml", {html:fullHtml,force:true})
      response.result = MNUtil.mergeWhitespace(fullHtml)
      response.success = true
      message.response = "HTML file is created, with a preview window"
    }else{
      message.response = "Creating HTML file failed"
    }
    response.toolMessages = chatAITool.genToolMessage(message,func.id)
    return response
  }
  async createMermaidChart(func,args) {
    let response = {}
    let message = {success:true}
    let content = args.content ?? ""
    if (content) {
      content = chatAIUtils.replaceLtInLatexBlocks(content)
      content = content.replace(/\\n/g,"\n")
      // MNUtil.log({message:"createMermaidChart",detail:content})
      MNUtil.postNotification("snipasteMermaid", {content:content,force:true})
      response.result = content
      response.success = true
      message.response = "Mermaid chart is created, with a preview window"
    }else{
      message.response = "Creating Mermaid chart failed"
    }
    response.toolMessages = chatAITool.genToolMessage(message,func.id)
    return response
  }
  async knowledgeAction(func,args) {
    // MNUtil.log({message:"knowledgeAction",detail:args})
    let response = {}
    let message = {success:true}
    switch (args.action) {
      case "getKnowledge":
        if (chatAIConfig.knowledge.trim()) {
          response.result = chatAIConfig.knowledge
          message.response = "Current knowledge is:\n"+response.result
        }else{
          response.result = ""
          message.response = "Current knowledge is empty"
        }
        break;
      case "appendKnowledge":
        response = this.setKnowledge(func,{method:"append",content:args.content})
        return response;
      case "overwriteKnowledge":
        response = this.setKnowledge(func,{method:"overwrite",content:args.content})
        return response;
      case "clearKnowledge":
        response = this.setKnowledge(func,{method:"clear",content:args.content})
        return response;
      default:
        message.response = "Unknown action: "+args.action
        message.success = false
        break;
    }
    response.toolMessages = chatAITool.genToolMessage(message,func.id)
    return response
  }
  setKnowledge(func,args) {
    try {

    let response = {}
    let message = {success:true}
    let method = args.method ?? "append"
    switch (method) {
      case "append":
        chatAIConfig.knowledge += ("\n"+args.content)
        chatAIConfig.knowledge = chatAIConfig.knowledge.trim()
        response.result = chatAIConfig.knowledge
        message.response = "Current knowledge updated to:\n"+chatAIConfig.knowledge
        break;
      case "overwrite":
        chatAIConfig.knowledge = args.content
        chatAIConfig.knowledge = chatAIConfig.knowledge.trim()
        response.result = chatAIConfig.knowledge
        message.response = "Current knowledge is overwritten as:\n"+chatAIConfig.knowledge
        break;
      case "clear":
        chatAIConfig.knowledge = ""
        response.result = chatAIConfig.knowledge
        message.response = "Knowledge is cleared, current knowledge is empty"
        break;
      default:
        break;
    }
    chatAIConfig.save("MNChatglm_knowledge",undefined,false)
    response.toolMessages = chatAITool.genToolMessage(message,func.id)
    return response
      
    } catch (error) {
      chatAIUtils.addErrorLog(error, "setKnowledge")
      message.response = "Failed in setting knowledge"
      message.success = false
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
      return response
    }
  }
  async generateImage(func,args) {
    let response = {}
    let message = {success:true}
    try {

      // let url = "https://open.bigmodel.cn/api/paas/v4/images/generations"
      // let apikey = "449628b94fcac030495890ee542284b8.F23PvJW4XXLJ4Lsu"
      // let model = "cogview-4-250304"
      // let url = "https://yunwu.ai/v1/images/generations"
      // let apikey = "sk-M81DYoybLN8XpDeDUdmputJzLg9E4utJ0IDE4gpfRI0e7X4r"
      // let model = "gpt-image-1"
      let url = "https://api.gptgod.online/v1/images/generations"
      let apikey = "sk-edtyVyaobSEOb0tDXphlPDSquQKPdE8AvwU6Jl5qIjFPhtMz"
      let model = "gpt-4o-image"
      // let url = "https://api.minimax.chat/v1/image_generation"
      // let apikey = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiLmnpfnq4vpo54iLCJVc2VyTmFtZSI6Iuael-eri-mjniIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxNzgyMzYzOTA3MTA5NzAwMTg2IiwiUGhvbmUiOiIxMzEyODU4OTM1MSIsIkdyb3VwSUQiOiIxNzgyMzYzOTA3MTAxMzExNTc4IiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoiMTUxNDUwMTc2N0BxcS5jb20iLCJDcmVhdGVUaW1lIjoiMjAyNS0wNS0wMSAyMToxMzozMyIsIlRva2VuVHlwZSI6MSwiaXNzIjoibWluaW1heCJ9.a_vgCX8RH98PWKstZTCkkUow-ta4vS-FEYCkLNTnnYO5wpAPzqkODprPbDHTyE46uQE1PHcV34NNgQjDynAe9cKkCU11hrZhX5UexWZ7OOx_m7IvzeqezX7iZXQQSCJjzEwlwYenACS71uKGyoRpXXfNUWZ_cZZQrS_EJxAYiAiklKY1w-ue0kC61ubRdmT0FvPdQ5mWzYDvrbI6GE5OqLmWKcDFi6qQQ7PPrQkfHm8bZxQ6VmIt0pwMMA3FG4a6DW8We82iCmOZ2ZnRvQauMA7NyDnMxNG2b7Qps_A5LNAsmqNIUOb0aQtyyYdQYOokPV_LOJbrlzo_gjrxwS1n-g"
      // let model = "image-01"
      // let url = "https://api.minimax.chat/v1/image_generation"
      // let apikey = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiLmnpfnq4vpo54iLCJVc2VyTmFtZSI6Iuael-eri-mjniIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxNzgyMzYzOTA3MTA5NzAwMTg2IiwiUGhvbmUiOiIxMzEyODU4OTM1MSIsIkdyb3VwSUQiOiIxNzgyMzYzOTA3MTAxMzExNTc4IiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoiMTUxNDUwMTc2N0BxcS5jb20iLCJDcmVhdGVUaW1lIjoiMjAyNS0wNS0wMSAyMToxMzozMyIsIlRva2VuVHlwZSI6MSwiaXNzIjoibWluaW1heCJ9.a_vgCX8RH98PWKstZTCkkUow-ta4vS-FEYCkLNTnnYO5wpAPzqkODprPbDHTyE46uQE1PHcV34NNgQjDynAe9cKkCU11hrZhX5UexWZ7OOx_m7IvzeqezX7iZXQQSCJjzEwlwYenACS71uKGyoRpXXfNUWZ_cZZQrS_EJxAYiAiklKY1w-ue0kC61ubRdmT0FvPdQ5mWzYDvrbI6GE5OqLmWKcDFi6qQQ7PPrQkfHm8bZxQ6VmIt0pwMMA3FG4a6DW8We82iCmOZ2ZnRvQauMA7NyDnMxNG2b7Qps_A5LNAsmqNIUOb0aQtyyYdQYOokPV_LOJbrlzo_gjrxwS1n-g"
      // let model = "wanx2.1-t2i-plus"
      MNUtil.showHUD("Generating image...")
      let request = chatAINetwork.initRequestForCogView(args.prompt, apikey, url, model)
      let res = await chatAINetwork.sendRequest(request)
      // MNUtil.copy(res)
      if ("data" in res) {
        if ("error" in res.data) {
          if (typeof res.data.error === "string") {
            response.result = res.data.error
          }else{
            response.result = res.data.error.message
          }
          MNUtil.confirm("❌ Image generated failed", response.result)
          message.response = "Failed in generating image: "+response.result
          response.toolMessages = chatAITool.genToolMessage(message,func.id)
        }else{
          MNUtil.showHUD("✅ Image generated")
          response.result = res.data[0].url
          // response.result = res.data.image_urls[0]
          message.response = "Image is created at the following url: "+response.result+"\n please show this image as markdown image"
          // message.response = "Image is created at the following url: "+res.data.image_urls[0]+"\n please show this image as markdown image"
          response.toolMessages = chatAITool.genToolMessage(message,func.id)
        }
      }else{
        if ("error" in res) {
          response.result = res.error
          MNUtil.confirm("❌ Image generated failed", response.result)
          message.response = "Failed in generating image: "+response.result
          response.toolMessages = chatAITool.genToolMessage(message,func.id)
        }else{
          MNUtil.showHUD("❌ Image generated failed")
          message.response = "Failed in generating image"
          response.toolMessages = chatAITool.genToolMessage(message,func.id)
        }
      }

    } catch (error) {
      chatAIUtils.addErrorLog(error, "generateImage")
      MNUtil.showHUD("❌ Image generated failed")
      message.response = "Failed in generating image"
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
    }
    return response
  }
  /**
   * 
   * @param {object[]} notes 
   * @param {string} query 
   * @returns {Promise<MNNote[]>}
   */
  async rerankNotes(notes,query){
    let noteStrings = notes.map(note=>{
      let text = note.allNoteText()
      text = chatAIUtils.replaceBase64ImagesWithTemplate(text)
      return text
    })
    let res = await chatAINetwork.rerank(noteStrings,query,20)
    let relativeNotesWithScore = []
    for (let item of res) {
      if (item.relevance_score > 0.5) {
        relativeNotesWithScore.push({note:notes[item.index],score:item.relevance_score})
      }
    }
    return relativeNotesWithScore
  }
  async searchNotes(func,args) {
    let responsePrefix = "Search results are shown as follows, please show them as markdown link, user can click the link to show the note in floating window:\n"
    let response = {}
    let message = {success:true}
    let searchRange = args.searchRange ?? "currentNotebook"
    let keywords = args.searchPhrases ?? []
    let notes = []
    switch (searchRange) {
      case "currentNotebook":
        notes = await chatAITool.searchInCurrentStudySets(keywords)
        response.result = notes
        break;
      case "allNotebooks":
        if (args.exceptNotebooks) {
          notes = await chatAITool.searchInAllStudySets(keywords,{exceptNotebookNames:args.exceptNotebooks})
        }else{
          notes = await chatAITool.searchInAllStudySets(keywords)
        }
        response.result = notes
        break;
      default:
        break;
    }
    if (notes.length === 0) {
      message.response = "No notes are found"
      message.success = false
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
      return response
    }
    if (notes.length > 200) {
      chatAITool.waitHUD("Reranking "+notes.length+" notes...")
      let noteParts = []//分段做rerank

      for (let i = 0; i < notes.length; i += 200) {
        noteParts.push(notes.slice(i,i+200))
      }
      let resParts = await Promise.all(noteParts.map(notes=>this.rerankNotes(notes,args.query)))
      MNUtil.stopHUD()
      let res = resParts.flatMap(item=>item)
      //根据score排序
      res.sort((a,b)=>b.score-a.score)
      // MNUtil.copy(res.map(r=>r.score))
      let relativeNotes = []
      chatAITool.waitHUD("Generating structure for "+res.length+" notes...")
      for (let item of res) {
        relativeNotes.push(await chatAIUtils.genCardStructure(item.note))
      }
      MNUtil.delay(1).then(()=>{
        MNUtil.stopHUD()
      })
      chatAITool.showHUD("Reading "+relativeNotes.length+" notes...")
      // MNUtil.copy(relativeNotes)
      response.result = relativeNotes
      message.response = responsePrefix+JSON.stringify(relativeNotes,undefined,2)
      message.success = true
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
      return response
    }else if (notes.length <= 10) {
      // 如果笔记数量小于10，则直接生成结构
      let relativeNotes = []
      chatAITool.waitHUD("Generating structure for "+notes.length+" notes...")
      for (let note of notes) {
        relativeNotes.push(await chatAIUtils.genCardStructure(note))
      }
      MNUtil.stopHUD()
      chatAITool.showHUD("Reading "+relativeNotes.length+" notes...")
      response.result = relativeNotes
      message.response = responsePrefix+JSON.stringify(relativeNotes,undefined,2)
      message.success = true
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
      return response
    }else{
      // 如果笔记数量大于10，则先做rerank，再生成结构
      chatAITool.waitHUD("Reranking "+notes.length+" notes...")
      let res = await this.rerankNotes(notes, args.query)
      let relativeNotes = []
      chatAITool.waitHUD("Generating structure for "+res.length+" notes...")
      for (let item of res) {
        relativeNotes.push(await chatAIUtils.genCardStructure(item.note))
      }
      MNUtil.stopHUD()
      chatAITool.showHUD("Reading "+relativeNotes.length+" notes...")
      response.result = relativeNotes
      message.response = responsePrefix+JSON.stringify(relativeNotes,undefined,2)
      message.success = true
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
      return response
    }
  }
  async organizeNotes(func,args) {
    let response = {}
    let message = {success:true}
      let relatedNotes = []
      /**
       * 
       * @param {MNNote} parentNote 
       * @param {*} tree 
       * @returns 
       */
      function addChildrenDev(parentNote,tree) {
        let mainNode
        let noteId = ("noteId" in tree) ? tree.noteId : ("id" in tree) ? tree.id : undefined
        if (noteId) {
          if (chatAIUtils.noteExists(noteId)) {
            mainNode = MNNote.new(noteId)
          }else{
            mainNode = MNNote.new({content:""})
          }
        }else{
          mainNode = MNNote.new({content:""})
        }
        if ("title" in tree) {
          mainNode.noteTitle = tree.title
        }
        if ("color" in tree) {
          mainNode.color = tree.color
        }
        relatedNotes.push(mainNode)
        if (parentNote && (parentNote.noteId !== mainNode.parentNote?.noteId)) {
          parentNote.addChild(mainNode)
        }
        if ("children" in tree && tree.children.length) {
          tree.children.map((child)=>{
            if (typeof child === "string") {
              mainNode.addChild(child)
            }else{
              addChildrenDev(mainNode, child)
            }
          })
        }
      }
      MNUtil.showHUD("Reorganizing notes...")
      let newTrees = args.asts
  
      MNUtil.undoGrouping(()=>{
          newTrees.map(tree=>{
            // addChildren(tree)
            let parsedTree
            switch (typeof tree) {
              case "object":
                // MNUtil.showHUD("object")
                parsedTree = tree
                response.result = JSON.stringify(parsedTree)
                break;
              case "string":
                // MNUtil.showHUD("string")
                response.result = tree
                parsedTree = chatAIUtils.getValidJSON(response.result)
                break;
              default:
                break;
            }
            addChildrenDev(MNNote.currentChildMap,parsedTree)
          })
      })
      MNUtil.delay(0.5).then(()=>{
        MNUtil.excuteCommand("EditArrangeNotes")
      })
      let notesContents = []
      for (let i = 0; i < relatedNotes.length; i++) {
        const note = relatedNotes[i];
        let structure = await chatAIUtils.genCardStructure(note.noteId)
        notesContents.push(structure)
      }
      let tree = chatAIUtils.buildHierarchy(notesContents)
      // MNUtil.copy(newTree)
      message.response = "Notes are organized as follows:\n"+JSON.stringify(tree,undefined,2)
      message.success = true
      response.toolMessages = chatAITool.genToolMessage(message,func.id)
    return response
  }
  /**
   * 
   * @param {Object} func 
   * @param {Object} args 
   * @param {MNNote} note 
   * @returns {Object}
   */
  async editNote(func,args,note) {
    let response = {}
    let message = {success:true}
    /**
     * @type {Array<MNNote>} 
     */
    let notes = []
      let targetTitle = ""
      switch (args.action) {
        case "setColor":
          MNUtil.undoGrouping(()=>{
            note.color = args.color
          })
          message.response = `Color has been changed to "${args.color}"`
          break;
        case "replaceContent":
          let targetString = chatAIUtils.safeReplaceAll(note.excerptText,args.originalContent,args.content)
          MNUtil.undoGrouping(()=>{
            note.excerptText = targetString
          })
          message.response = `Content has been updated as "${targetString}"`
          break;
        case "setTitle":
        case "setTitleWithOptions":
          targetTitle = args.content ?? ""
          if ("titleOptions" in args) {
            let choices = ["Cancel"].concat(args.titleOptions,"Confirm")
            let selectRes = await MNUtil.input("🤖: 请选择要设置的标题","",choices)
            // MNUtil.copy(selectRes)
            if (selectRes.button === 0) {
              response.result = {question:args,confirmed:false}
              message.response = "Title has not been changed, user does not make the choice"
              targetTitle = ""
              // MNUtil.copy(message)
            }else if(selectRes.button === choices.length-1){
              response.result = {question:args,confirmed:true,userInput:selectRes.input}
              message.response = `Title has been changed to "${selectRes.input}"`
              targetTitle = selectRes.input
            }else{
              response.result = {question:args,confirmed:true,choice:choices[selectRes.button]}
              message.response = `Title has been changed to "${choices[selectRes.button]}"`
              targetTitle = choices[selectRes.button]
            }
            // MNUtil.copy(targetTitle)
          }
          if (targetTitle) {
            MNUtil.undoGrouping(()=>{
              note.title = targetTitle
            })
            message.success = true
          }else{
            message.success = false
          }
          break;
        case "appendTitle":
          targetTitle = note.title+";"+args.content
          MNUtil.undoGrouping(()=>{
            note.title = targetTitle
          })
          message.response = `Title has been changed as "${targetTitle}"`
          message.success = true
          break;
        case "clearTitle":
          MNUtil.undoGrouping(()=>{
            note.title = ""
          })
          message.response = "Title has been cleared"
          message.success = true
          break;
        case "setContent":
          MNUtil.undoGrouping(()=>{
            note.excerptText = chatAITool.formatMarkdownList(args.content)
            note.excerptTextMarkdown = true
          })
          message.response = `Note/card Content has been changed as "${args.content}"`
          message.success = true
          break;
        case "appendContent":
          let targetContent = note.excerptText+"\n"+args.content
          MNUtil.undoGrouping(()=>{
            note.excerptText = chatAITool.formatMarkdownList(targetContent)
          })
          message.response = `Note/card Content has been changed as "${targetContent}"`
          message.success = true
          break;
        case "clearContent":
          MNUtil.undoGrouping(()=>{
            note.excerptText = ""
          })
          message.response = "Note/card Content has been cleared"
          message.success = true
          break;
        case "addComment":
          MNUtil.undoGrouping(()=>{
            note.appendMarkdownComment(chatAITool.formatMarkdownList(args.content))
          })
          message.response = `Add comment with "${args.content}"`
          message.success = true
          break;
        case "addTags":
          MNUtil.undoGrouping(()=>{
            note.appendTags(args.tags)
          })
          message.response = `Add tags with "${args.tags}"`
          message.success = true
          break;
        case "removeTags":
          if ("tags" in args) {
            MNUtil.undoGrouping(()=>{
              note.removeTags(args.tags)
            })
            message.response = `Remove tags: "${args.tags}"`
          }else{
            MNUtil.undoGrouping(()=>{
              note.removeTags(note.tags)
            })
            message.response = `Remove all tags: "${note.tags}"`
          }
          message.success = true
          break;
        case "deleteNote":
          if ("targetNoteIds" in args) {
            notes = args.targetNoteIds.map((noteId)=>{
              return MNNote.new(noteId)
            })
          }
          if ("needConfirm" in args && args.needConfirm) {
            let confirmRes = await MNUtil.confirm("🤖: 请确认是否删除当前笔记","",["Cancel","Confirm"])
            if (confirmRes === 0) {
              message.response = "Note is not deleted, user does not confirm"
              message.success = false
            }else{
              MNUtil.undoGrouping(()=>{
                if (notes.length) {
                  notes.forEach((n)=>{
                    n.delete()
                  })
                }else{
                  note.delete()
                }
              })
              if (notes.length) {
                message.response = notes.length+" notes are deleted"
              }else{
                message.response = "This note is deleted"
              }
              message.success = true
            }
          }else{
            MNUtil.undoGrouping(()=>{
              if (notes.length) {
                notes.forEach((n)=>{
                  n.delete()
                })
              }else{
                note.delete()
              }
            })
            if (notes.length) {
              message.response = notes.length+" notes are deleted"
            }else{
              message.response = "This note is deleted"
            }
            message.success = true
          }
          break;
        default:
          message.response = `Unspported action: "${args.action}"`
          message.success = false
          break;
      }
      response.toolMessages = chatAITool.genToolMessage(message, func.id)
    return response
  }
  /**
 * 
 * @param {MNNote} note 
 * @param {Object} ast 
 */
static AST2Mindmap(note,ast,level = "all") {
try {
  let config = {excerptTextMarkdown: true}
  if ("title" in ast) {
    config.title = ast.title
  }
  if ("content" in ast) {
    config.content = ast.content
  }
  if ("color" in ast) {
    config.color = chatAIUtils.getColorIndex(ast.color)
  }
  if ("tags" in ast) {
    config.tags = ast.tags
  }
  let childNote
  if (!note) {
    if (MNUtil.currentSelection.onSelection) {
      childNote = MNNote.fromSelection().realGroupNoteForTopicId()
      childNote.title = config.title
      childNote.excerptText = config.content
      childNote.colorIndex = config.color
    }else{
      childNote = MNNote.new(config)
    }
  }else{
    childNote = note.createChildNote(config,false)
  }
  if (ast.children && ast.children.length) {
    ast.children.forEach((child, index)=>{
      this.AST2Mindmap(childNote,child)
    })
  }else{
    // MNUtil.showHUD("No children found")
  }
  return childNote
  } catch (error) {
  chatAIUtils.addErrorLog(error, "chatAITool.AST2Mindmap",ast)
  return undefined
}

}
  /**
   * Merges multiple consecutive whitespace characters into a single space, except for newlines.
   * 
   * This method processes the input string to replace multiple consecutive whitespace characters
   * (excluding newlines) with a single space. It also ensures that multiple consecutive newlines
   * are reduced to a single newline. The resulting string is then trimmed of any leading or trailing
   * whitespace.
   * 
   * @param {string} str - The input string to be processed.
   * @returns {string} The processed string with merged whitespace.
   */
  static mergeWhitespace(str) {
      if (!str) {
        return "";
      }
      // 1. 替换为标准空格
      // 2. 将多个连续的换行符替换为单个换行符
      // 3. 将其它空白符（除了换行符）替换为单个空格
      var tempStr = str.replace(/&nbsp;/g, ' ').replace(/\n+/g, '\n\n').replace(/[\r\t\f\v\s]+/g, ' ').trim()
      // var tempStr = str.replace(/\n+/g, '\n').replace(/[\r\t\f\v ]+/g, ' ').trim()
      return tempStr;
  }

/**
 * 修复包含非标准空格和格式错误的 Markdown 无序列表。
 * @param {string} markdownText - 包含格式问题的 Markdown 文本。
 * @returns {string} - 格式修正后的 Markdown 文本。
 */
static formatMarkdownList(markdownText) {
  // 1. 首先，全局替换所有的 &nbsp; 为标准空格。
  let correctedText = markdownText.replace(/&nbsp;/g, ' ');

  // 2. 将文本按行分割成数组，以便逐行处理。
  const lines = correctedText.split('\n');

  // 3. 遍历每一行，修正列表项的格式。
  const formattedLines = lines.map(line => {
    // 使用正则表达式匹配以可选空格开头，后跟一个短横线 (-) 的行。
    // \s* : 匹配行首的任意个空格（处理缩进）。
    // -     : 匹配列表标记符“-”。
    // \s* : 匹配“-”后面可能存在或缺失的空格。
    // (.*)  : 捕获该行剩余的全部内容（即列表的文本）。
    const listRegex = /^\s*-\s*(.*)$/;

    // 如果当前行匹配列表项的格式
    if (listRegex.test(line)) {
      // 就将其替换为标准格式：“  - 文本内容”
      // 这里我们统一使用两个空格作为缩进，并在“-”后加一个空格。
      return line.replace(listRegex, '  - $1');
    }
    
    // 如果不是列表项，则保持原样。
    return line;
  });

  // 4. 将处理好的各行重新用换行符连接成一个完整的字符串。
  return formattedLines.join('\n');
}

/**
 * 
 * @param {object} funcObject 
 * @returns {string}
 */
static render(funcObject){
  let funcName = funcObject.function.name
  let args = JSON.parse(funcObject.function.arguments.trim())
  let funcText = funcName+"()\n"
  if (args) {
    switch (funcName) {
      case "createMindmap":
        if (args.title) {
          funcText = `${funcName}("${MNUtil.mergeWhitespace(args.title)}")\n`
        }
        break;
      case "setTitle":
        if (args.title) {
          funcText = `${funcName}("${MNUtil.mergeWhitespace(args.title)}")\n`
        }
        break;
      case "addComment":
        if (args.comment) {
          funcText = `${funcName}("${args.comment.trim()}")\n`
        }
        break;
      case "addTag":
        if (args.tag) {
          funcText = `${funcName}("${MNUtil.mergeWhitespace(args.tag)}")\n`
        }
        break;
      case "copyMarkdownLink":
        if (args.title) {
          funcText = `${funcName}("${MNUtil.mergeWhitespace(args.title)}")\n`
        }
        break;
      case "copyCardURL":
        funcText = `${funcName}()\n`
        break;
      case "copyText":
        if (args.text) {
          funcText = `${funcName}("${MNUtil.mergeWhitespace(args.text)}")\n`
        }
        break;
      case "close":
        funcText = `${funcName}()\n`
        break;
      case "clearExcerpt":
        funcText = `${funcName}()\n`
        break;
      case "editNote":
        funcText = `${funcName}()\n`
        break;
      case "searchNotes":
        funcText = `${funcName}(${JSON.stringify(args,undefined,2)})\n`
        break;
      case "setExcerpt":
        if (args.excerpt) {
          funcText = `${funcName}("${args.excerpt.trim()}")\n`
        }
        break;
      case "readDocument":
        let currentDocName = MNUtil.getFileName(MNUtil.currentDocController.document.pathFile)
        funcText = `${funcName}("${currentDocName}")\n`
        break;
      case "readNotes":
        funcText = `${funcName}()\n`
        break;
      case "readParentNote":
        funcText = `${funcName}()\n`
        break;
      case "webSearch":
        funcText = `${funcName}("${args.question}")\n`
        break;
      case "addChildNote":
        funcText = `${funcName}(${JSON.stringify(args,undefined,2)})\n`
        // if (args.title) {
        //   pre = pre+`"${MNUtil.mergeWhitespace(args.title)}"`
        //   if (args.content) {
        //     pre = pre+",\n"
        //   }
        // }
        // if (args.content) {
        //   pre = pre+`"${args.content.trim()}"`
        // }
        // pre = pre+`\n)\n`
        // funcText = pre
        break;
      default:
        break;
    }
  }else{
    funcText = funcName+"()\n"
  }
  let funcHtml = `<code class="hljs">${funcText.trim()}</code>`
  return funcHtml
}
static getLoadingHTML(){
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>正在加载...</title>
    <style>
        /* 整体页面样式 */
        body, html {
            height: 100%;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f0f0f0; /* 背景颜色可以按需修改 */
            font-family: Arial, sans-serif;
        }

        /* 加载容器样式 */
        .loading-container {
            text-align: center;
        }

        /* 旋转动画 */
        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #ccc; /* 圈的颜色 */
            border-top: 5px solid #3498db; /* 旋转部分的颜色 */
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px auto; /* 居中并与文字拉开距离 */
        }

        /* 定义旋转动画 */
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* “loading” 文字样式 */
        .loading-text {
            font-size: 20px;
            color: #555;
        }
    </style>
</head>
<body>

    <div class="loading-container">
        <div class="spinner"></div>
        <div class="loading-text">loading</div>
    </div>

</body>
</html>`
}

codifyToolCall (args,force = false) {
try {

  let funcName = this.name
  // MNUtil.copy(funcName)
  switch (funcName) {
    case "setTitle":
      if (args.title) {
        return `🔨 ${funcName}("${MNUtil.mergeWhitespace(args.title)}")\n`
      }
      return `🔨 ${funcName}()\n`
    case "createMermaidChart":
      let content = args?.content?.trim() ?? ""
      content = chatAIUtils.replaceLtInLatexBlocks(content)
      MNUtil.postNotification("snipasteMermaid", {content:content})
      return `🔨 ${funcName}(\n${content}\n)\n`
    case "createHTML":
      let fixedArgs = this.fixHtmlArgs(args)
      let htmlConfig = {}
      if (fixedArgs.html) {
        htmlConfig.html = fixedArgs.html.length
      }
      if (fixedArgs.css) {
        htmlConfig.css = fixedArgs.css.length
      }
      let fullHtml = this.getFullHTML(fixedArgs)
      if (fullHtml) {
        MNUtil.postNotification("snipasteHtml", {html:fullHtml,force:force})
      }else{
        MNUtil.postNotification("snipasteHtml", {html:chatAITool.getLoadingHTML()})
      }
      // MNUtil.copy(args)
      return `🔨 ${funcName}(${JSON.stringify(htmlConfig)})\n`
    case "generateImage":
      if (args.prompt) {
        return `🔨 ${funcName}("${MNUtil.mergeWhitespace(args.prompt)}")\n`
      }
      return `🔨 ${funcName}()\n`
    case "addComment":
      if (args.comment) {
        return `🔨 ${funcName}("${MNUtil.mergeWhitespace(args.comment)}")\n`
      }
      return `🔨 ${funcName}()\n`
    case "addTag":
      if (args.tag) {
        return `🔨 ${funcName}("${MNUtil.mergeWhitespace(args.tag)}")\n`
      }
      return `🔨 ${funcName}()\n`
    case "copyMarkdownLink":
      if (args.title) {
        return `🔨 ${funcName}("${MNUtil.mergeWhitespace(args.title)}")\n`
      }
      return `🔨 ${funcName}()\n`
    case "copyCardURL":
      return `🔨 ${funcName}()\n`
    case "copyText":
      if (args.text) {
        return `🔨 ${funcName}("${MNUtil.mergeWhitespace(args.text)}")\n`
      }
      return `🔨 ${funcName}()\n`
    case "close":
      return `🔨 ${funcName}()\n`
    case "clearExcerpt":
      return `🔨 ${funcName}()\n`
    case "setExcerpt":
      if (args.excerpt) {
        this.preContent = args.excerpt.trim()
        return `🔨 ${funcName}("${this.preContent}")\n`
      }
      if (this.preContent) {
        // MNUtil.log("Using precontent")
        return `🔨 ${funcName}("${this.preContent}")\n`
      }
      return `🔨 ${funcName}()\n`
    case "readDocument":
      let currentDocName = MNUtil.getFileName(MNUtil.currentDocController.document.pathFile)
      return `🔨 ${funcName}("${currentDocName}")\n`
    case "readNotes":
      if (args.range) {
        return `🔨 ${funcName}("${args.range}")\n`
      }else{
        return `🔨 ${funcName}()\n`
      }
    case "webSearch":
      return `🔨 ${funcName}("${args.question}")\n`
    case "readParentNote":
      return `🔨 ${funcName}()\n`
      // let pre = `${funcName}(\n`
      // if (args.title) {
      //   pre = pre+`"${MNUtil.mergeWhitespace(args.title)}"`
      //   if (args.content) {
      //     pre = pre+",\n"
      //   }
      // }
      // if (args.content) {
      //   pre = pre+`"${args.content.trim()}"`
      // }
      // pre = pre+`\n)\n`
      // return pre
    case "organizeNotes":
      if (args.asts) {
        let asts = []
        args.asts.forEach(ast=>{
          if (typeof ast === "object") {
            asts.push(ast)
          }else{
            asts.push(chatAIUtils.getValidJSON(ast))
          }
        })
        return `🔨 ${funcName}(${JSON.stringify(asts,undefined,2)})\n`
      }
      return `🔨 ${funcName}()\n`
    case "createMindmap":
      if (args.ast) {
        // MNUtil.showHUD(typeof args.ast)
        // MNUtil.log({message:"codifyToolCall.createMindmap",detail:this.preContent})
        let ast
        switch (typeof args.ast) {
          case "object":
            ast = args.ast
            let stringified = JSON.stringify(ast,undefined,2)
            if (stringified.length > this.preContent.length) {
              this.preContent = stringified
              this.tem.push(`${funcName}(${stringified})\n`)
              return `🔨 ${funcName}(${stringified})\n`
            }
            this.tem.push(`${funcName}(${this.preContent})\n`)
            return `🔨 ${funcName}(${this.preContent})\n`
          case "string":
            ast = chatAIUtils.getValidJSON(args.ast)
            if(ast){
              let stringified = JSON.stringify(ast,undefined,2)
              if (stringified.length > this.preContent.length) {
                this.preContent = stringified
                this.tem.push(`${funcName}(${stringified})\n`)
                return `🔨 ${funcName}(${stringified})\n`
              }
              this.tem.push(`${funcName}(${this.preContent})\n`)
              return `🔨 ${funcName}(${this.preContent})\n`
            }
            this.tem.push(`${funcName}(${this.preContent})\n`)
            return `🔨 ${funcName}(${this.preContent})\n`
          default:
            this.tem.push(`${funcName}(${this.preContent})\n`)
            return `🔨 ${funcName}(${this.preContent})\n`
        }
      }else{
        // MNUtil.showHUD("Missing arguments: ast")
        return `🔨 ${funcName}(${this.preContent})\n`
      }
    case "knowledge":
      if (args.action) {
        switch (args.action) {
          case "getKnowledge":
            return `🔨 knowledge.get()`
          case "appendKnowledge":
            if (args.content) {
              return `🔨 knowledge.append(
${args.content}
)`
            }
            return `🔨 knowledge.append()`
          case "overwriteKnowledge":
            if (args.content) {
              return `🔨 knowledge.overwrite(
${args.content}
)`
            }
            return `🔨 knowledge.overwrite()`
          case "clearKnowledge":
            return `🔨 knowledge.clear()`
          default:
            break;
        }
      }
      return `🔨 ${funcName}()\n`
    case "UnkonwFunc":
      MNUtil.showHUD("Unknown function: "+funcName)
      return `🔨 ${funcName}()\n`
    default:
      if (args && Object.keys(args).length > 0) {
        this.preContent = JSON.stringify(args,undefined,2)
        return `🔨 ${funcName}(${this.preContent})\n`
      }
      return `🔨 ${funcName}(${this.preContent})\n`
  }
  
} catch (error) {
  chatAIUtils.addErrorLog(error, "chatAITool.codifyToolCall")
  return `🔨 ${funcName}()\n`
}
}
genErrorInMissingArguments(arg,funcId) {
  // MNUtil.copy(arg)
  MNUtil.showHUD("Missing arguments: "+arg)
  let response = {
    toolMessages: chatAITool.genToolMessage("Execution failed! The arguments ["+arg+"] provided is empty!",funcId),
    description: "Error in "+this.name+"(): Missing arguments: "+arg+"\n"
  }
  return response
}
genErrorInEmptyArguments(arg,funcId) {
  MNUtil.showHUD("Empty content in arguments: "+arg)
  let response = {
    toolMessages: chatAITool.genToolMessage("Execution failed! The content of arguments ["+arg+"] provided is empty!",funcId),
    description: "Error in "+this.name+"(): Empty content in arguments: "+arg+"\n"
  }
  return response
}
genErrorInNoNote(funcId) {
  MNUtil.showHUD("Unavailable")
  let response = {
    toolMessages: chatAITool.genToolMessage("Execution failed! There is no note selected",funcId),
    description: "Error in "+this.name+"(): There is no note selected\n"
  }
  return response
}
fixHtmlArgs(args){
  if (args.html) {
    this.preHtml = args.html
  }else if (this.preHtml) {
    args.html = this.preHtml
  }
  if (args.css) {
    this.preCSS = args.css
  }else if (this.preCSS){
    args.css = this.preCSS
  }
  return args
}
getFullMermaindHTML(content) {
  // 对 content 中的反引号和反斜杠进行转义，以安全地插入到 <script> 块中
  const escapedContent = content
    .replace(/\\/g, '\\\\') // 1. 转义反斜杠
    .replace(/`/g, '\\`')   // 2. 转义反引号
    .replace(/\$/g, '\\$');  // 3. 转义美元符号
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>自适应大小的 Mermaid 图表</title>
    <script src="https://vip.123pan.cn/1836303614/dl/cdn/mermaid.js" defer></script>
    <style>
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden; 
        }

        #mermaid-container {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px; 
            box-sizing: border-box;
        }

        #mermaid-container svg {
            /* * SVG 在 viewBox 属性的帮助下，会保持其原始长宽比，
             * 同时缩放到适应这个 100% 的容器尺寸。
             */
            width: 100%;
            height: 100%;
        }
        /* 加载容器样式 */
        .loading-container {
            text-align: center;
        }

        /* 旋转动画 */
        .spinner {
            width: 50px;
            height: 50px;
            border: 5px solid #ccc; /* 圈的颜色 */
            border-top: 5px solid #3498db; /* 旋转部分的颜色 */
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px auto; /* 居中并与文字拉开距离 */
        }

        /* 定义旋转动画 */
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* “loading” 文字样式 */
        .loading-text {
            font-size: 20px;
            color: #555;
        }
    </style>
</head>
<body>

    <div id="mermaid-container">
      <div class="loading-container">
          <div class="spinner"></div>
          <div class="loading-text">loading</div>
      </div>
    </div>

    <script>
      // 监听 DOMContentLoaded 事件
      document.addEventListener('DOMContentLoaded', function () {

        mermaid.initialize({
            startOnLoad: false,
            securityLevel: 'strict'
        });

        // 尝试使用一个更复杂的图表来观察缩放效果
        const mermaidContent = \`${escapedContent}\`;

        const container = document.getElementById('mermaid-container');

        mermaid.render('mermaid-graph', mermaidContent).then(({ svg, bind }) => {
            
            container.innerHTML = svg;
            const svgElement = container.querySelector('svg');

            if (svgElement) {
                // 移除这些属性，让 CSS 来控制大小
                svgElement.removeAttribute('width');
                svgElement.removeAttribute('height');
                svgElement.removeAttribute('style');
            }
            
            if (bind) {
                bind(container);
            }
        });
      })
    </script>
</body>
</html>`
}
getFullHTML(args){
    if (args.html) {
      if (args.css) {
        if (args.html.startsWith(`<!DOCTYPE html>`) || args.html.startsWith(`<!doctype html>`)) {
          let fullHtml = args.html.replace(" html>",` html>\n<style>\nbody{padding: 0 !important;}\nmain{padding-left: 0 !important;\npadding-right: 0 !important;\npadding-bottom: 0 !important;}\n${args.css}\n</style>`)
          return fullHtml
        }else{
          let fullHtml = `<!DOCTYPE html>
<style>body{padding: 0 !important;}main{padding-left: 0 !important;\npadding-right: 0 !important;\npadding-bottom: 0 !important;}</style>
<html lang="zh-cmn-Hans" style="height: 0px;">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
    <script src=https://cdn.tailwindcss.com/3.4.16></script>
    <link href=https://cdn.bootcdn.net/ajax/libs/font-awesome/6.4.0/css/all.min.css rel=stylesheet>
    <style>
      ${args.css}
    </style>
</head>
<body>
${args.html}
</body>
</html>`
          return fullHtml
        }
      }else{
        if (args.html.startsWith(`<!DOCTYPE html>`) || args.html.startsWith(`<!doctype html>`)) {
          return args.html.replace(" html>",` html>\n<style>\nbody{padding: 0 !important;}\nmain{padding-left: 0 !important;\npadding-right: 0 !important;\npadding-bottom: 0 !important;}\n</style>`)
        }else{
          let fullHtml = `<!DOCTYPE html>
<style>body{padding: 0 !important;}main{padding-left: 0 !important;\npadding-right: 0 !important;\npadding-bottom: 0 !important;}</style>
<html lang="zh-cmn-Hans" style="height: 0px;">
<head>
    <meta charset="utf-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
    <script src=https://cdn.tailwindcss.com/3.4.16></script>
    <link href=https://cdn.bootcdn.net/ajax/libs/font-awesome/6.4.0/css/all.min.css rel=stylesheet>
</head>
<body>
${args.html}
</body>
</html>`
          return fullHtml
        }
      }
    }else{
      return undefined
    }

}
  static get toolConfig(){
    return {
      "setTitle":{
        needNote:true,
        toolTitle: "📝   Set Title",
        args:{
          title:{
            type:"string",
            description:"title that should be set for this note, pure text only"
          }
        },
        description:"this function is used to set title for a note."
      },
      "addComment":{
        needNote:true,
        toolTitle: "💬   Add Comment",
        args:{
          comment:{
            type:"string",
            description:"comment that should be added for this note, pure text only"
          }
        },
        description:"this function is used to add comment for a note"
      },
      "addTag":{
        needNote:true,
        toolTitle: "🏷️   Add Tag",
        args:{
          tag:{
            type:"string",
            description:"tag that should be added for this note, no hyphen is allowed"
          }
        },
        description:"this function is used to add tag for a note"
      },
      "copyMarkdownLink":{
        needNote:true,
        toolTitle: "🔗   Copy Markdown Link",
        args:{
          title:{
            type:"string",
            description:"title for markdown link, pure text only"
          }
        },
        description:"this function is used to copy markdown link for a note, only title is required"
      },
      "copyCardURL":{
        needNote:true,
        toolTitle: "🔗   Copy Card URL",
        args:{},
        description:"this function is used to copy card url, do not pass any argument"
      },
      "copyText":{
        needNote:false,
        toolTitle: "📋   Copy Text",
        args:{
          text:{
            type:"string",
            description:"text that need to be copied"
          }
        },
        description:"this function can copy any pure text, but not card link"
      },
      "close":{
        needNote:false,
        toolTitle: "🔨   Close",
        args:{},
        description:"this function is used to close current conversation, do not pass any argument"
      },
      "readDocument":{
        needNote:false,
        toolTitle: "🔨   Read Doc",
        args:{},
        description:"this function is used to read document, do not pass any argument"
      },
      "readNotes":{
        needNote:false,
        toolTitle: "🔨   Read Notes",
        args:{
          range:{
            type:"string",
            description:"optional, range of notes to read, default is `focusedNotes`, other options: `allNotesInMindmap`"
          }
        },
        required:[],
        description:"this function is used to read focus notes/cards, also called selected notes/cards, do not pass any argument"
      },
      "readParentNote":{
        needNote:true,
        toolTitle: "🔨   Read ParentNote",
        args:{},
        description:"this function is used to read parent note/card of current note/card, do not pass any argument"
      },
      "webSearch":{
        needNote:false,
        toolTitle: "🌐   Web Search",
        args:{
          question:{
            type:"string",
            description:"question that need to be searched, pure text only"
          }
        },
        description:"this function is used to retrieve informations needed from web as reference"
      },
      "clearExcerpt":{
        needNote:true,
        toolTitle: "🔨   Clear Excerpt",
        args:{},
        description:"this function is used to clear excerpt for a note, do not pass any argument."
      },
      "setExcerpt":{
        needNote:true,
        toolTitle: "📝   Set Excerpt",
        args:{
          excerpt:{
            type:"string",
            description:`content that should be set for this note, in markdown format, which supports HTML tags like "span", "p", "div", "font", "u", "small", "big", "mark", "sup", "sub", "center" and etc. For example, this span tag change the color of the word "reveals" to red: <span style="background-color: red;">reveals</span>`
          }
        },
        description:"this function is used to set content for a note."
      },
      "addChildNote":{
        needNote:false,
        toolTitle: "➕   Create ChildNote",
        args:{
          title:{
            type:"string",
            description:"title for child note, optional"
          },
          content:{
            type:"string",
            description:`markdown content for child note, optional. It supports HTML tags like "span", "p", "div", "font", "u", "small", "big", "mark", "sup", "sub", "center" and etc. For example, this span tag change the color of the word "reveals" to red: <span style="background-color: red;">reveals</span>`
          },
          tags:{
            type:"array",
            items: {
              type:"string",
              description:"tag for child note, optional"
            },
            description:"tags for child note, optional"
          },
          color:{
            type:"string",
            description:"color for child note, optional. \nColors includes White, Yellow, Green, Blue, Red, Orange, Purple, LightYellow, LightGreen, LightBlue, LightRed, DarkGreen, DarkBlue, DeepRed, LightGray and DarkGray"
          },
          parentNoteId:{
            type:"string",
            description:" optional, parent note id for this child note, default is current note. NoteId format: `marginnote4app://note/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`"
          }
        },
        required:[],
        description:"this function is used to create a child note"
      },
      "createMindmap":{
        needNote:false,
        toolTitle: "🔨   Create Mindmap",
        args:{
          ast:{
            type:"string",
            description:"JSON string representing the Abstract Syntax Tree. Properties includes title (pure text), content (markdown), color (optional, white as default), tags (optional, array of strings, only when user ask to add tags) and children (optional, array of objects).\n Colors includes White, Yellow, Green, Blue, Red, Orange, Purple, LightYellow, LightGreen, LightBlue, LightRed, DarkGreen, DarkBlue, DeepRed, LightGray and DarkGray"
          },
          parentNoteId:{
            type:"string",
            description:" optional, parent note id for this mindmap, default is current note. NoteId format: `marginnote4app://note/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`"
          },
        },
        required:["ast"],
        description:"this tool is used to create a mindmap"
      },
      "createMermaidChart":{
        needNote:false,
        toolTitle: "🔨   Create Mermaid Chart",
        args:{
          content:{
            type:"string",
            description:`A string containing the full, valid Mermaid.js syntax for the diagram. The AI model is responsible for generating this code based on the user's requirements. The code must begin with a diagram type declaration (e.g., "graph TD", "sequenceDiagram", "pie").
### Constraints ###
1. For flow charts, all node labels must be wrapped in triple double quotes. 
2. Latex formulas must be wrapped in double dollar signs. 
3. Mermaid chart can not render two latex blocks in one node. Never use two or more latex blocks in one node.
4. Do not use html tags in node labels.
5. Do not use markdown list in node labels.
6. Do not use brackets in node labels.

### Example 1 Latex###
 graph LR
      A["""$$x^2$$"""] -->|"""$$\\sqrt{x+3}$$"""| B("""$$\\frac{1}{2}$$""")
      A -->|"""$$\\overbrace{a+b+c}^{\\text{note}}$$"""| C("""$$\\pi r^2$$""")
      B --> D("""$$x = \\begin{cases} a &\\text{if } b \\\\ c &\\text{if } d \\end{cases}$$""")
      C --> E("""$$x(t)=c_1\\begin{bmatrix}-\\cos{t}+\\sin{t}\\\\ 2\\cos{t} \\end{bmatrix}e^{2t}$$""")

### Example 2 Flow Chart ###
graph TD
    A["""<b>太平洋增温模式的 onset 特征变化 (分界点：1970年代末)</b>"""]

    subgraph "1970年代末之前 (如 1957, 1965, 1972)"
        direction LR
        B["""<b>触发机制</b><br>澳大利亚东部的<br>异常气旋东移"""] --> C{"导致"}
        C --> D["""赤道西太平洋<br>出现异常西风"""]
        C --> E["""东南太平洋<br>信风减弱"""]
        E --> F["""<b>结果</b><br>南美沿岸增温<br><u>领先</u><br>中太平洋增温"""]
    end

    subgraph "1970年代末之后 (如 1982, 1986-87, 1991)"
        direction LR
        G["""<b>触发机制</b><br>菲律宾海的<br>异常气旋增强"""] --> H{"导致"}
        H --> I["""赤道西太平洋<br>建立异常西风"""]
        H --> J["""东南太平洋<br>信风增强"""]
        J --> K["""<b>结果</b><br>南美沿岸增温<br><u>落后</u><br>中太平洋增温"""]
    end

    subgraph "根本原因"
        L["""<b>背景海温场 (SSTs) 的年代际变化</b><br>1. 热带太平洋增温<br>2. 温带南北太平洋变冷<br>3. 阿留申低压加深"""]
    end

    L --> A
    A --> B
    A --> G

    style A fill:#0077B6,stroke-width:0px,color:white
    style L fill:#48BFE3,stroke-width:0px,color:black

    style B fill:#F7B801,stroke-width:0px,color:black
    style D fill:#F18701,stroke-width:0px,color:white
    style E fill:#F18701,stroke-width:0px,color:white
    style F fill:#A44200,stroke-width:0px,color:white
    
    style G fill:#7FB800,stroke-width:0px,color:black
    style I fill:#55A630,stroke-width:0px,color:white
    style J fill:#55A630,stroke-width:0px,color:white
    style K fill:#008000,stroke-width:0px,color:white


### Example 3 Mindmap ###
mindmap
  root((太平洋增温模式的 onset 特征变化))
    ::icon(fa fa-water)
    分界点：1970年代末
    根本原因 (背景海温场SSTs的年代际变化)
      热带太平洋增温
      温带南北太平洋变冷
      阿留申低压加深
    1970年代末之前 (1957, 1965, 1972)
      ::icon(fa fa-cloud-sun-rain)
      触发机制
        澳大利亚东部的异常气旋东移
      影响
        赤道西太平洋出现异常西风
        东南太平洋信风减弱
      结果
        南美沿岸增温领先中太平洋增温
    1970年代末之后 (1982, 1986-87, 1991)
      ::icon(fa fa-cloud-showers-heavy)
      触发机制
        菲律宾海的异常气旋增强
      影响
        赤道西太平洋建立异常西风
        东南太平洋信风增强
      结果
        南美沿岸增温落后中太平洋增温
### Example 4 sequenceDiagram ###
sequenceDiagram
    autonumber
    participant 1 as $$\\alpha$$
    participant 2 as $$\\beta$$
    1->>2: Solve: $$\\sqrt{2+2}$$
    2-->>1: Answer: $$2$$
    Note right of 2: $$\\sqrt{2+2}=\\sqrt{4}=2$$

`
          }
        },
        required:[],
        description:"Generates and renders a diagram image from a Mermaid syntax string. Use this tool whenever a user asks to create a visual diagram, such as a flowchart, sequence diagram, Gantt chart, pie chart, etc."
      },
      "createHTML":{
        needNote:false,
        toolTitle: "🌐   Create HTML",
        args:{
          html:{
            type:"string",
            description:"HTML string representing the .html file, using Tailwind CSS and FontAwesome Icon."
          },
          css:{
            type:"string",
            description:"additional CSS string representing the .css file"
          }
        },
        required:[],
        description:"this tool is used to create a html file and preview it, using Tailwind CSS and FontAwesome Icon."
      },
      "mergeNotes":{
        needNote:false,
        toolTitle: "🔨   Merge Notes",
        args:{
          fromNoteIds:{
            type:"array",
            items:{
              type:"string",
              description:"noteId of note to be merged. NoteId format: `marginnote4app://note/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`"
            },
            description:"noteIds of notes to be merged"
          },
          toNoteId:{
            type:"string",
            description:"noteId of the main note to be merged to. NoteId format: `marginnote4app://note/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`"
          }
        },
        required:["fromNoteIds","toNoteId"],
        description:"this tool is used to merge notes (fromNoteIds) to another note (toNoteId)"
      },
      "moveNotes":{
        needNote:false,
        toolTitle: "🔨   Move Notes",
        args:{
          fromNoteIds:{
            type:"array",
            items:{
              type:"string",
              description:"noteId of child note. NoteId format: `marginnote4app://note/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`"
            },
            description:"noteIds of child notes"
          },
          toNoteId:{
            type:"string",
            description:"noteId of parent note. NoteId format: `marginnote4app://note/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`"
          }
        },
        required:["fromNoteIds","toNoteId"],
        description:"this tool is used to move notes (fromNoteIds) as children of another note (toNoteId)"
      },
      "linkNotes":{
        needNote:false,
        toolTitle: "🔗   Link Notes",
        args:{
          fromNoteId:{
            type:"string",
            description:"noteId of child note. NoteId format: `marginnote4app://note/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`"
          },
          toNoteId:{
            type:"string",
            description:"noteId of parent note. NoteId format: `marginnote4app://note/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`"
          },
          biDirectional:{
            type:"boolean",
            description:"optional, default is true, if true, the note (fromNoteId) will be linked to the note (toNoteId) and the note (toNoteId) will be linked to the note (fromNoteId) too"
          },
        },
        required:["fromNoteId","toNoteId"],
        description:"this tool is used to link a note (fromNoteId) to another note (toNoteId)"
      },
      "organizeNotes":{
        needNote:false,
        toolTitle: "🔨   Organize Notes",
        args:{
          asts:{
            type:"array",
            items:{
              type:"string",
              description:"JSON string representing the Abstract Syntax Tree. Properties includes noteId (required, supports `newNote` for a new node), title (optional, pure text), color (optional, white as default) and children (optional, array of objects).\n Colors includes White, Yellow, Green, Blue, Red, Orange, Purple, LightYellow, LightGreen, LightBlue, LightRed, DarkGreen, DarkBlue, DeepRed, LightGray and DarkGray"
            },
            description:"Multiple Abstract Syntax Trees represent multiple mindmaps."
          },
        },
        required:["asts"],
        description:"this tool is used to re-organize notes, using noteId and Abstract Syntax Tree to create new trees of mindmap"
      },
      "searchNotes":{
        needNote:false,
        toolTitle: "🔍   Search Notes",
        args:{
          searchPhrases:{
            type:"array",
            items:{
              type:"string",
              description:"Phrase to search. Generate optimal search phrases based on user intent. Use .OR. for synonyms, .AND. for required terms. For example, phrase `A .AND. B` means the note must contain both `A` and `B`, and phrase `A .OR. B` means the note must contain either `A` or `B`."
            },
            description:"Array of search phrases. Every phrase is searched independently. At least 6 phrases are required."
          },
          searchRange:{
            type:"string",
            enum:["currentNotebook","allNotebooks"],
            description:"search range, default is current notebook. The word 'notebook' here also refers to the 'study set'"
          },
          exceptNotebooks:{
            type:"array",
            items:{
              type:"string",
              description:"name of the notebook to be excluded from search"
            },
            description:"names of the notebooks to be excluded from search, optional, valid only when searchRange is `allNotebooks`"
          },
          query:{
            type:"string",
            description:"description of your query, about the possible topics of the notes"
          },
        },
        required:["searchPhrases","query"],
        description:"this tool is used to search notes"
      },
      "editNote":{
        needNote:true,
        toolTitle: "📝   Edit Note",
        args:{
          action:{
            type:"string",
            enum:["setTitle","setTitleWithOptions","appendTitle","clearTitle","setColor","setContent","appendContent","clearContent","replaceContent","addComment","addTags","removeTags","deleteNote"],
            description:`actions to edit note.
Use the \`replaceContent\` action to change the style of specific words.
For example, set parameter \`originalContent\` to "reveals" and parameter \`content\` to "<span style="background-color: red;">reveals</span>" to change the color of the word "reveals" to red.`
          },
          content:{
            type:"string",
            description:`content for specific action. 
            Required when use action \`setTitle\`, \`appendTitle\`, \`setContent\`, \`appendContent\`, \`replaceContent\`, \`addComment\`, \`addTags\`, \`removeTags\`.
            For actions \`setContent\`, \`appendContent\`, \`replaceContent\` and \`addComment\`, the content uses markdown format, which supports HTML tags like "span", "p", "div", "font", "u", "small", "big", "mark", "sup", "sub", "center" and etc.`
          },
          originalContent:{
            type:"string",
            description:"original content of the note, required when use action `replaceContent`"
          },
          color:{
            type:"string",
            description:"color for this note, required when use action `setColor`.",
            enum:["White","Yellow","Green","Blue","Red","Orange","Purple","LightYellow","LightGreen","LightBlue","LightRed","DarkGreen","DarkBlue","DeepRed","LightGray","DarkGray"]
          },
          titleOptions:{
            type:"array",
            items: {
              type:"string",
              description:"title option for note"
            },
            description:"additional titles for for user to select,required when use action \"setTitleWithOptions\""
          },
          tags:{
            type:"array",
            items: {
              type:"string",
              description:"tag for child note"
            },
            description:"tag for child note, required when use these actions: \"addTags\", \"removeTags\""
          },
          needConfirm:{
            type:"boolean",
            description:"optional, default is true, do not ask user to confirm action but use this argument, only valid for actions `deleteNote`"
          },
          targetNoteIds:{
            type:"array",
            items:{
              type:"string",
              description:"target noteId of note to delete. NoteId format: `marginnote4app://note/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`"
            },
            description:"target noteIds of notes to delete, required when use action `deleteNote`."
          }
        },
        required:["action"],
        description:"this tool is used to edit note"
      },
      "generateImage":{
        needNote:false,
        toolTitle: "🎨   Generate Image",
        args:{
          prompt:{
            type:"string",
            description:"A detailed image description in English, including subject, style, composition, etc. Example: 'A cyberpunk cityscape at night with neon lights and flying cars, digital art style.'"
          }
        },
        description:"this tool is used to generate a high-quality image based on a detailed text prompt."
      },
      "userConfirm":{
        needNote:false,
        toolTitle: "🔨   User Confirm",
        args:{
          title:{
            type:"string",
            description:"title of your query"
          },
          detail:{
            type:"string",
            description:"detail of your query"
          }
        },
        required:["title"],
        description:"this tool is used to query user's confirmation."
      },
      "userInput":{
        needNote:false,
        toolTitle: "🔨   User Input",
        args:{
          title:{
            type:"string",
            description:"title of your query"
          },
          detail:{
            type:"string",
            description:"detail of your query"
          }
        },
        required:["title"],
        description:"this tool is used to ask user's answer on your question."
      },
      "userSelect":{
        needNote:false,
        toolTitle: "🔨   User Select",
        args:{
          title:{
            type:"string",
            description:"title of your query"
          },
          detail:{
            type:"string",
            description:"detail of your query"
          },
          choices:{
            type:"array",
            items:{
              type:"string",
              description:"one of the choice you provide"
            },
            description:"choices you provide for user to select"
          }
        },
        required:["title","choices"],
        description:"this tool is used to let user to make a choice."
      },
      "knowledge":{
        needNote:false,
        toolTitle: "💡   Knowledge",
        args:{
          action:{
            type:"string",
            enum:["getKnowledge","appendKnowledge","overwriteKnowledge","clearKnowledge"],
            description:"action to get or set knowledge"
          },
          content:{
            type:"string",
            description:"content of knowledge you want to process, only valid when action is `appendKnowledge` and `overwriteKnowledge`"
          }
        },
        required:["action"],
        description:"this tool is used to process knowledge"
      },
    }
  }
  static get toolNames(){
    return ["setTitle","addComment","copyMarkdownLink","copyCardURL","copyText","close","addTag","addChildNote","clearExcerpt","setExcerpt","readDocument","readNotes","webSearch","readParentNote","createMindmap","editNote","generateImage","createHTML","userConfirm","userInput","userSelect","mergeNotes","moveNotes","linkNotes","organizeNotes","searchNotes","createMermaidChart","knowledge"]
  }
  static get toolNumber(){
    return this.toolNames.length
  }
  static get oldTools(){
    return [0,1,2,3,4,6,8,9]
  }
  static get activatedTools(){
    // return [15,11,13,21,22,23,24,25,7,14,17,16,18,19,20,10,12,0,1,6,2,3,4,8,9,5]
    return [15,11,13,21,22,23,24,25,7,14,17,26,16,18,19,20,10,12,0,1,6,2,3,4,8,9,27,5]
  }
  static get activatedToolsExceptOld(){
    // return [15,11,13,21,22,23,24,25,7,14,17,16,18,19,20,10,12,5]
    return [15,11,13,21,22,23,24,25,7,14,17,26,16,18,19,20,10,12,27,5]
  }
  static getChangedTools(currentFunc,index){
    let targetFunc = currentFunc
    switch (index) {
      case -1:
        targetFunc = []
        break;
      case 100:
        if (chatAIUtils.checkSubscribe()) {
          targetFunc = chatAITool.activatedToolsExceptOld
        }
        break
      default:
        if (chatAITool.oldTools.includes(index) || chatAIUtils.checkSubscribe()) {
          if (targetFunc.includes(index)) {
            targetFunc = targetFunc.filter(func=> func!==index)
          }else{
            targetFunc.push(index)
          }
          targetFunc.sort(function(a, b) {
            return a - b;
          });
        }
        break;
    }
    return targetFunc
  }
  /**
   * 
   * @param {string} name 
   * @returns {chatAITool}
   */
  static getToolByName(name){
    if (name in this.tools) {
      return this.tools[name]
    }else{
      return this.tools["UnkonwFunc"]
    }
  }
  static async executeTool(funcName,func,noteId){
    let tool = this.getToolByName(funcName)
    // MNUtil.copy(func)
    return await tool.execute(func,noteId)
  }
  static initTools(){
    this.tools = {}
    for (let i = 0; i < this.toolNames.length; i++) {
      let func = this.toolNames[i]
      let config = this.toolConfig[func]
      // this.tools[func] = this.new(func,config.args,config.description,config.needNote)
      this.tools[func] = this.new(func,config)
    }
    this.tools["UnkonwFunc"] = this.new("UnkonwFunc",{},"UnkonwFunc",false)
  }
  static getToolsByIndex(indices,forMinimax = false) {
    if (indices.length === 0) {
      return []
    }
    let funcStructures = indices.map(ind=>this.tools[this.toolNames[ind]].body(forMinimax))
    return funcStructures
  }
  /**
   * 
   * @param {string[]} searchTexts 
   * @returns {Promise<MNNote[]>}
   */
  static async searchInCurrentStudySets(searchTexts){
  try {
    

    this.waitHUD("Searching in current studySet...")
    await MNUtil.delay(0.01)
    let notesInCurrentStudySet = chatAIUtils.notesInCurrentStudySet()
    //先在当前的学习集搜索
    let filteredNotes = this.searchTitleInNotes(notesInCurrentStudySet,searchTexts)
    this.waitHUD("Searching in current studySets... Done")
    MNUtil.stopHUD(0.5)
    return filteredNotes
  } catch (error) {
    chatAIUtils.addErrorLog(error, "chatAITool.searchInCurrentStudySets")
    return []
  }
  }
  /**
   * 
   * @param {string[]} searchTexts 
   * @returns {Promise<MNNote[]>}
   */
  static async searchInAllStudySets(searchTexts,option = {}){
  try {

    this.waitHUD("Searching in current studySet...")
    await MNUtil.delay(0.01)
    let currentStudySet = MNUtil.currentNotebook
    let notesInCurrentStudySet = chatAIUtils.notesInCurrentStudySet()
    //先在当前的学习集搜索
    let filteredNotes = this.searchTitleInNotes(notesInCurrentStudySet,searchTexts)
    let searchOption = option
    if (searchOption.exceptNotebookIds) {
      searchOption.exceptNotebookIds.push(currentStudySet.topicId)
    }else{
      searchOption.exceptNotebookIds = [currentStudySet.topicId]
    }
    let otherStudySets = chatAIUtils.allStudySets(searchOption)
    for (let index = 0; index < otherStudySets.length; index++) {
      let studySet = otherStudySets[index];
      this.waitHUD(`Searching in other studySets [${index+1}/${otherStudySets.length}]...`)
      await MNUtil.delay(0.01)
      let notesInStudySet = chatAIUtils.notesInStudySet(studySet)
      let filteredNotesInStudySet = this.searchTitleInNotes(notesInStudySet,searchTexts)
      filteredNotes = filteredNotes.concat(filteredNotesInStudySet)
    }
    this.waitHUD("Searching in all studySets... Done")
    return filteredNotes
    
  } catch (error) {
    chatAIUtils.addErrorLog(error, "chatAITool.searchInAllStudySets")
    return []
  }
  }
/**
 * 判断字符串是否包含符合特定语法的搜索内容。
 * 支持 .AND., .OR. 和括号 ()。
 *
 * @param {string} text - 要在其中搜索的完整字符串。
 * @param {string} query - 基于 .AND. 和 .OR. 语法的搜索查询字符串。
 * @returns {boolean} - 如果 text 包含符合 query 条件的内容，则返回 true，否则返回 false。
 */
static textMatchKeyword(text, query) {
  // 1. 提取所有独立的搜索关键词。
  // 通过分割 .AND. .OR. 和括号，然后清理，来获取关键词列表。
  const terms = query
    .split(/\s*\.AND\.|\s*\.OR\.|\(|\)/)
    .map(term => term.trim())
    .filter(Boolean); // 过滤掉因分割产生的空字符串

  // 按长度降序排序，以防止在替换时，短关键词（如 "TC"）错误地替换了长关键词（如 "TCG"）的一部分。
  terms.sort((a, b) => b.length - a.length);

  // 辅助函数：用于在最终的表达式中检查单个关键词是否存在（不区分大小写）。
  const check = (term) => text.toLowerCase().includes(term.toLowerCase());

  // 2. 构建一个标准的 JavaScript 布尔表达式字符串。
  let jsQuery = query;

  // 将每个关键词替换为一个函数调用。
  // 例如 "tropical cyclone" -> 'check("tropical cyclone")'
  terms.forEach(term => {
    // 使用正则表达式的全局替换，确保所有出现的地方都被替换。
    // RegExp.escape is not a standard function, so we manually escape special characters.
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    jsQuery = jsQuery.replace(new RegExp(escapedTerm, 'g'), `check("${term}")`);
  });

  // 将自定义的 .AND. 和 .OR. 替换为 JavaScript 的 && 和 ||。
  jsQuery = jsQuery.replace(/\s*\.AND\.\s*/g, ' && ').replace(/\s*\.OR\.\s*/g, ' || ');

  // 3. 使用 new Function() 安全地执行构建好的表达式。
  // 这种方法比 eval() 更安全，因为它在自己的作用域内运行。
  try {
    const evaluator = new Function('check', `return ${jsQuery};`);
    return evaluator(check);
  } catch (error) {
    chatAIUtils.addErrorLog(error, "chatAITool.textMatchKeyword")
    return false; // 如果查询语法有误，则返回 false。
  }
}
  /**
   * 
   * @param {MNNote[]} notes 
   * @param {string[]} searchTexts 
   * @returns {MNNote[]}
   */
  static searchTitleInNotes(notes,searchTexts){
    let validSearchText = searchTexts.filter(searchText=>{
      if (searchText.trim() === "") {
        return false
      }
      if (searchText.trim() === ".AND." || searchText.trim() === ".OR.") {
        return false
      }
      return true
  })
    return notes.filter(note=>{
      let textToMatch = note.allNoteText()
      return validSearchText.some(searchText=>this.textMatchKeyword(textToMatch,searchText))
    }
    )
  }
}

// 定义一个类
class chatAIUtils {
  // 构造器方法，用于初始化新创建的对象
  constructor(name) {
    this.name = name;
  }
  static errorLog = []
  static cache = {}
  static cacheInfo = {number:0,times:0,enabled:true}
  /**
   * @type {{version:String,type:String}}
   * @static
   */
  static version
  static currentNoteId
  static currentSelection = ""
  static onPopupMenuOnNoteTime = 0
  static onClosePopupMenuOnNoteTime = 0
  static onPopupMenuOnSelectionTime = 0
  static onClosePopupMenuOnSelectionTime = 0
  static currentPrompt
  /** @type {String} */
  static mainPath
  /**
   * @type {Boolean}
   * @static
   */
  static OCREnhancedMode
  /**
   * @type {Boolean}
   * @static
   */
  static visionMode = false
  static noSystemMode
  static lastTime
  /**
   * @type {chatglmController}
   * @static
   */
  static chatController
  /**
   * @type {notificationController}
   * @static
   */
  static notifyController
  /**
   * @type {dynamicController}
   * @static
   */
  static dynamicController
  /**
   * @type {sideOutputController}
   * @static
   */
  static sideOutputController
  static init(mainPath){
    if (mainPath) {
      this.mainPath = mainPath
    }
    this.OCREnhancedMode = false
    this.app = Application.sharedInstance()
    this.data = Database.sharedInstance()
    this.focusWindow = this.app.focusWindow
    this.version = this.appVersion()
    this.errorLog = [this.version]
    this.onAlert = false
  }
  static async checkMNUtil(alert = false,delay = 0.01){
  try {
    

    if (typeof MNUtil === 'undefined') {//如果MNUtil未被加载，则执行一次延时，然后再检测一次
      //仅在MNUtil未被完全加载时执行delay
      await this.delay(delay)
      if (typeof MNUtil === 'undefined') {
        if (alert) {
          let res = await this.confirm("MN ChatAI:", "Install 'MN Utils' first\n\n请先安装'MN Utils'",["Cancel","Open URL"])
          if (res) {
            this.openURL("https://bbs.marginnote.com.cn/t/topic/49699")
          }
        }else{
          this.showHUD("MN ChatAI: Please install 'MN Utils' first!",5)
        }
        return false
      }
    }
    return true
  } catch (error) {
    this.copy(error.toString())
    // chatAIUtils.addErrorLog(error, "chatAITool.checkMNUtil")
    return false
  }
  }
  static showHUD(message,duration=2) {
    this.app.showHUD(message,this.focusWindow,2)
  }

  static appVersion() {
    let info = {}
    let version = parseFloat(this.app.appVersion)
    // MNUtil.copy(this.app.appVersion)
    if (version >= 4) {
      info.version = "marginnote4"
    }else{
      info.version = "marginnote3"
    }
    info.appVersion = this.app.appVersion
    switch (this.app.osType) {
      case 0:
        info.type = "iPadOS"
        break;
      case 1:
        info.type = "iPhoneOS"
        break;
      case 2:
        info.type = "macOS"
        break;
      default:
        break;
    }
    if (this.mainPath) {
      let chatAIVersion = MNUtil.readJSON(this.mainPath+"/mnaddon.json").version
      info.chatAIVersion = chatAIVersion
    }
    // MNUtil.copyJSON(info)
    return info
  }
  static  getNoteColors() {
    return ["#ffffb4","#ccfdc4","#b4d1fb","#f3aebe","#ffff54","#75fb4c","#55bbf9","#ea3323","#ef8733","#377e47","#173dac","#be3223","#ffffff","#dadada","#b4b4b4","#bd9fdc"]
  }
  static getNoteById(noteid) {
    let note = this.data.getNoteById(noteid)
    return note
  }
  static getNoteBookById(notebookId) {
    let notebook = this.data.getNotebookById(notebookId)
    return notebook
  }
  static getUrlByNoteId(noteid) {
    let ver = this.appVersion()
    return ver.version+'app://note/'+noteid
  } 
  static blur() {
    if (this.isMN4() && this.sideOutputController && this.sideOutputController.userInput) {
      this.sideOutputController.blur(0.1)
    }
    if (this.dynamicController && !this.dynamicController.view.hidden) {
      this.dynamicController.blur(0.1)
    }
  }
  static allStudySets(option = {}){
  try {
    let allNotebooks = MNUtil.allNotebooks()
    let exceptNotebookIds = option.exceptNotebookIds ?? []
    let exceptNotebookNames = option.exceptNotebookNames ?? []
    let studySets = allNotebooks.filter(notebook=>{
      let flags = notebook.flags
      if (flags === 2) {
        if (exceptNotebookIds.length > 0 || exceptNotebookNames.length > 0) {
          if (exceptNotebookIds.includes(notebook.topicId)) {
            return false
          }
          if (exceptNotebookNames.includes(notebook.title.trim())) {
            return false
          }
        }
        return true
      }
      return false
    })
    return studySets
  } catch (error) {
    this.addErrorLog(error, "allStudySets")
    return []
  }
  }
  /**
   * 
   * @param {string|undefined} exceptNotebookId 
   * @returns {Array<MNNote>}
   */
  static allNotesFromAllStudySets(option = {}){
    let studySets = this.allStudySets(option)
    // MNUtil.copy(studySets.map(studySet=>studySet.title))
    let notes = studySets.flatMap(studySet=>this.notesInStudySet(studySet)).map(note=>MNNote.new(note))
    return notes
  }
/**
 * 判断字符串是否包含符合特定语法的搜索内容。
 * 支持 .AND., .OR. 和括号 ()。
 *
 * @param {string} text - 要在其中搜索的完整字符串。
 * @param {string} query - 基于 .AND. 和 .OR. 语法的搜索查询字符串。
 * @returns {boolean} - 如果 text 包含符合 query 条件的内容，则返回 true，否则返回 false。
 */
static textMatchKeyword(text, query) {
  // 1. 提取所有独立的搜索关键词。
  // 通过分割 .AND. .OR. 和括号，然后清理，来获取关键词列表。
  const terms = query
    .split(/\s*\.AND\.|\s*\.OR\.|\(|\)/)
    .map(term => term.trim())
    .filter(Boolean); // 过滤掉因分割产生的空字符串

  // 按长度降序排序，以防止在替换时，短关键词（如 "TC"）错误地替换了长关键词（如 "TCG"）的一部分。
  terms.sort((a, b) => b.length - a.length);

  // 辅助函数：用于在最终的表达式中检查单个关键词是否存在（不区分大小写）。
  const check = (term) => text.toLowerCase().includes(term.toLowerCase());

  // 2. 构建一个标准的 JavaScript 布尔表达式字符串。
  let jsQuery = query;

  // 将每个关键词替换为一个函数调用。
  // 例如 "tropical cyclone" -> 'check("tropical cyclone")'
  terms.forEach(term => {
    // 使用正则表达式的全局替换，确保所有出现的地方都被替换。
    // RegExp.escape is not a standard function, so we manually escape special characters.
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    jsQuery = jsQuery.replace(new RegExp(escapedTerm, 'g'), `check("${term}")`);
  });

  // 将自定义的 .AND. 和 .OR. 替换为 JavaScript 的 && 和 ||。
  jsQuery = jsQuery.replace(/\s*\.AND\.\s*/g, ' && ').replace(/\s*\.OR\.\s*/g, ' || ');

  // 3. 使用 new Function() 安全地执行构建好的表达式。
  // 这种方法比 eval() 更安全，因为它在自己的作用域内运行。
  try {
    const evaluator = new Function('check', `return ${jsQuery};`);
    return evaluator(check);
  } catch (error) {
    console.error("查询语法无效:", error);
    return false; // 如果查询语法有误，则返回 false。
  }
}

  static textMatchKeywordOld(text,keyword){
    if (keyword.includes(".AND.")) {
      let keywords = keyword.split(".AND.")
      let validKeywords = keywords.filter(keyword=>keyword.trim() !== "")
      return validKeywords.every(keyword=>text.includes(keyword.trim()))
    }
    if (keyword.includes(".OR.")) {
      let keywords = keyword.split(".OR.")
      let validKeywords = keywords.filter(keyword=>keyword.trim() !== "")
      return validKeywords.some(keyword=>text.includes(keyword.trim()))
    }
    return text.includes(keyword)
  }
  /**
   * 
   * @param {MNNote[]} notes 
   * @param {string[]} searchTexts 
   * @returns {MNNote[]}
   */
  static searchTitleInNotes(notes,searchTexts){
    let validSearchText = searchTexts.filter(searchText=>{
      if (searchText.trim() === "") {
        return false
      }
      if (searchText.trim() === ".AND." || searchText.trim() === ".OR.") {
        return false
      }
      return true
  })
    return notes.filter(note=>{
      let textToMatch = note.allNoteText()
      return validSearchText.some(searchText=>this.textMatchKeyword(textToMatch,searchText))
    }
    )
  }
  /**
   * 
   * @param {string|MNNotebook} studySetId 
   * @returns {MNNote[]}
   */
  static notesInStudySet(studySetId = MNUtil.currentNotebookId){
    let allNotes
    if (typeof studySetId === "string") {
      allNotes = MNUtil.getNoteBookById(studySetId).notes
    }else{
      allNotes = studySetId.notes
    }
    let filteredNotes = allNotes.filter(note=>!note.docMd5.endsWith("_StudySet"))
    return filteredNotes
  }
  static aiNotesInStudySet(studySetId = MNUtil.currentNotebookId){
    let allNotes
    if (typeof studySetId === "string") {
      allNotes = MNUtil.getNoteBookById(studySetId).notes
    }else{
      allNotes = studySetId.notes
    }
    return allNotes.filter(note=>note.docMd5.endsWith("_StudySet"))
  }
  /**
   * 
   * @returns {MNNote[]}
   */
  static notesInCurrentStudySet(){
    let filteredNotes = []
    let allNotes = MNUtil.currentNotebook.notes
    for (let note of allNotes) {
      if (!note.docMd5.endsWith("_StudySet")) {
        filteredNotes.push(MNNote.new(note))
      }
    }
    return filteredNotes
  }
  /**
   * 
   * @param {string[]} searchTexts 
   * @returns {Promise<MNNote[]>}
   */
  static async searchInCurrentStudySets(searchTexts){
  try {
    

    MNUtil.waitHUD("Searching in current studySet...")
    await MNUtil.delay(0.01)
    let notesInCurrentStudySet = this.notesInCurrentStudySet()
    //先在当前的学习集搜索
    let filteredNotes = this.searchTitleInNotes(notesInCurrentStudySet,searchTexts)
    MNUtil.waitHUD("Searching in current studySets... Done")
    MNUtil.stopHUD(0.5)
    return filteredNotes
  } catch (error) {
    this.addErrorLog(error, "searchInCurrentStudySets")
    return []
  }
  }
  static async searchInAllStudySetsDev(searchText){
    let cachedNotes = await chatAIConfig.getCachedNotesInAllStudySets()
    let filteredNotes = cachedNotes.filter(note=>{
      if (note.title && note.title.includes(searchText)) {
        return true
      }
      return false
    })
    return filteredNotes
  }
  /**
   * 
   * @param {string[]} searchTexts 
   * @returns {Promise<MNNote[]>}
   */
  static async searchInAllStudySets(searchTexts,option = {}){
  try {

    MNUtil.waitHUD("Searching in current studySet...")
    await MNUtil.delay(0.01)
    let currentStudySet = MNUtil.currentNotebook
    let notesInCurrentStudySet = this.notesInCurrentStudySet()
    //先在当前的学习集搜索
    let filteredNotes = this.searchTitleInNotes(notesInCurrentStudySet,searchTexts)
    MNUtil.waitHUD("Searching in other studySets...")
    await MNUtil.delay(0.01)
    let searchOption = option
    if (searchOption.exceptNotebookIds) {
      searchOption.exceptNotebookIds.push(currentStudySet.topicId)
    }else{
      searchOption.exceptNotebookIds = [currentStudySet.topicId]
    }
    let notesInOtherStudySets = this.allNotesFromAllStudySets(option)
    let filteredNotesInOtherStudySet = this.searchTitleInNotes(notesInOtherStudySets,searchTexts)
    let notes = filteredNotes.concat(filteredNotesInOtherStudySet)
    MNUtil.waitHUD("Searching in all studySets... Done")
    return notes
    
  } catch (error) {
    this.addErrorLog(error, "searchInAllStudySets")
    return []
  }
  }
  static async searchInAllStudySetsDev(searchText){
    let cachedNotes = await chatAIConfig.getCachedNotesInAllStudySets()
    let filteredNotes = cachedNotes.filter(note=>{
      if (note.title && note.title.includes(searchText)) {
        return true
      }
      return false
    })
    return filteredNotes
  }
  /**
   * 注意这里的code需要是字符串
   * @param {string} code 
   * @returns {string}
   */
  static getStatusCodeDescription(code){
  try {
  // if (typeof code === "number") {
  //   code = toString(code)
  // }
      let des = {
        "400": "Bad Request",
        "401": "Unauthorized",
        "402": "Payment Required",
        "403": "Forbidden",
        "404": "Not Found",
        "405": "Method Not Allowed",
        "406": "Not Acceptable",
        "407": "Proxy Authentication Required",
        "408": "Request Timeout",
        "409": "Conflict",
        "410": "Gone",
        "411": "Length Required",
        "412": "Precondition Failed",
        "413": "Payload Too Large",
        "414": "URI Too Long",
        "415": "Unsupported Media Type",
        "416": "Range Not Satisfiable",
        "417": "Expectation Failed",
        "418": "I'm a teapot",
        "421": "Misdirected Request",
        "422": "Unprocessable Entity",
        "423": "Locked",
        "424": "Failed Dependency",
        "425": "Too Early",
        "426": "Upgrade Required",
        "428": "Precondition Required",
        "429": "Too Many Requests",
        "431": "Request Header Fields Too Large",
        "451": "Unavailable For Legal Reasons",
        "500": "Internal Server Error",
        "501": "Not Implemented",
        "502": "Bad Gateway",
        "503": "Service Unavailable",
        "504": "Gateway Timeout",
        "505": "HTTP Version Not Supported",
        "506": "Variant Also Negotiates",
        "507": "Insufficient Storage",
        "508": "Loop Detected",
        "510": "Not Extended",
        "511": "Network Authentication Required"
      }
      if (code in des) {
    return (code+": "+des[code])
      }
      return undefined
    } catch (error) {
      MNUtil.copy(error.toString())
    }
  }
  /**
   * 
   * @param {String} url 
   * @returns {String}
   */
  static getNoteIdByURL(url) {
    let targetNoteId = url.trim()
    if (/^marginnote\dapp:\/\/note\//.test(targetNoteId)) {
      targetNoteId = targetNoteId.slice(22)
    }
    return targetNoteId
  }
  static clipboardText() {
    return UIPasteboard.generalPasteboard().string
  }
  static copy(text) {
    UIPasteboard.generalPasteboard().string = text
  }
  static copyJSON(object) {
    UIPasteboard.generalPasteboard().string = JSON.stringify(object,null,2)
  }
static extractHtmlCodeBlocks(markdown) {
  // 匹配围栏代码块语法（支持 HTML 和 Vue 等常见标记）
  const regex = /```\s*(html|vue)\s*\n([\s\S]*?)\n```/gi;
  
  const blocks = [];
  let match;
  
  while ((match = regex.exec(markdown)) !== null) {
    // match[2] 包含代码内容，match[1] 包含语言标识
    blocks.push({
      language: match[1].toLowerCase(),
      code: match[2].trim()
    });
  }

  return blocks;
}

/**
 * 
 * @param {Array<{id:string,parentId:string}>} notes 
 * @returns 
 */
static buildHierarchy(notes) {
  const tree = [];
  const map = {}; // Helper to quickly find notes by their ID

  // First pass: Create a map of notes and initialize a 'children' array for each.
  notes.forEach(note => {
    map[note.id] = { ...note, children: [] }; // Store a copy and add children array
  });

  // Second pass: Populate the 'children' arrays and identify root nodes.
  notes.forEach(note => {
    let parentId = note.parentId
    if (parentId && map[parentId]) {
      // If it has a parent and the parent exists in our map, add it to parent's children
      map[parentId].children.push(map[note.id]);
    } else {
      // Otherwise, it's a root node (or an orphan if parentId is invalid but present)
      tree.push(map[note.id]);
    }
  });

  return tree;
}

/**
 * 
 * @param {Array<MNNote>} notes 
 * @returns 
 */
static buildHierarchyFromNotes(notes) {
  let notesStructure = notes.map(note=>{
    return {
      id:note.id,
      parentId:note.parentId
    }
  })
  const tree = [];
  const map = {}; // Helper to quickly find notes by their ID

  // First pass: Create a map of notes and initialize a 'children' array for each.
  notesStructure.forEach(note => {
    map[note.id] = { ...note, children: [] }; // Store a copy and add children array
  });

  // Second pass: Populate the 'children' arrays and identify root nodes.
  notesStructure.forEach(note => {
    let parentId = note.parentId
    if (parentId && map[parentId]) {
      // If it has a parent and the parent exists in our map, add it to parent's children
      map[parentId].children.push(map[note.id]);
    } else {
      // Otherwise, it's a root node (or an orphan if parentId is invalid but present)
      tree.push(map[note.id]);
    }
  });

  return tree;
}

  /**
   * 
   * @param {NSData} imageData 
   */
  static copyImage(imageData) {
    UIPasteboard.generalPasteboard().setDataForPasteboardType(imageData,"public.png")
  }
  static studyController() {
    return this.app.studyController(this.focusWindow)
  }
  static studyView() {
    return this.app.studyController(this.focusWindow).view
  }

  static currentDocController() {
    return this.studyController().readerController.currentDocumentController
  }
  static currentNotebook() {
    let notebookId = this.studyController().notebookController.notebookId
    return this.getNoteBookById(notebookId)
  }
  static undoGrouping(notebookId,f){
    UndoManager.sharedInstance().undoGrouping(
      String(Date.now()),
      notebookId,
      f
    )
    this.app.refreshAfterDBChanged(notebookId)
  }
  /**
   * 
   * @param {{title:String,content:String,markdown:Boolean,color:Number}} config 
   * @returns 
   */
  static creatNote(config) {
    try {

      let notebook = this.currentNotebook()
      let title = config.title ?? ""
    let note = Note.createWithTitleNotebookDocument(title, notebook,this.currentDocController().document)
      if (config.content) {
        if (config.markdown) {
          note.appendMarkdownComment(config.content)
      }else{
          note.appendTextComment(config.content)
        }
      }
      if (config.color !== undefined) {
        note.colorIndex = config.color
      }
      return note
    } catch (error) {
      this.showHUD(error)
      return undefined
    }
  }
  /**
   * 
   * @param {MbBookNote} parent 
   * @param {MbBookNote} targetNote 
   */
  static addChildNote(parent,targetNote,colorInheritance=false) {
    this.undoGrouping(parent.notebookId, ()=>{
      if (colorInheritance) {
        targetNote.colorIndex = parent.colorIndex
      }
      parent.addChild(targetNote)
    })
  }
  /**
   * 
   * @param {MbBookNote|String} parent 
   * @param {{title:String,content:String,markdown:Boolean,color:Number}} config 
   * @returns {MbBookNote}
   */
  static createChildNote(parent,config) {
    let parentNote = (typeof parent === "string")?this.getNoteById(parent):parent
    let child
    this.undoGrouping(parentNote.notebookId, ()=>{
      child = this.creatNote(config)
      parentNote.addChild(child)
    })
    return child
  }
  /**
   * 
   * @param {MbBookNote} brother 
   * @param {MbBookNote} targetNote 
   */
  static addBrotherNote(brother,targetNote,colorInheritance=false) {
    if (!brother.parentNote) {
      this.showHUD("No parent note!")
      return
    }
    let parent = brother.parentNote
    this.undoGrouping(parent.notebookId, ()=>{
      if (colorInheritance) {
        targetNote.colorIndex = brother.colorIndex
      }
      parent.addChild(targetNote)
    })
  }
  /**
   * 
   * @param {MbBookNote} brother 
   * @param {{title:String,content:String,markdown:Boolean,color:Number}} config 
   */
  static createBrotherNote(brother,config) {
    if (!brother.parentNote) {
      this.showHUD("No parent note!")
      return
    }
    let parent = brother.parentNote
    this.undoGrouping(parent.notebookId, ()=>{
      let child = this.creatNote(config)
      parent.addChild(child)
    })
  }
  static getSplitLine() {
    let study = this.studyController()
    let studyFrame = study.view.bounds
    let readerFrame = study.readerController.view.frame
    let hidden = study.readerController.view.hidden//true代表脑图全屏
    let rightMode = study.rightMapMode
    let fullWindow = readerFrame.width == studyFrame.width
    if (hidden || fullWindow) {
      return undefined
    }
    if (rightMode) {
      let splitLine = readerFrame.x+readerFrame.width
      return splitLine
    }else{
      let splitLine = readerFrame.x
      return splitLine
    }
  }
  static hexColorAlpha(hex,alpha) {
    let color = UIColor.colorWithHexString(hex)
    return alpha!==undefined?color.colorWithAlphaComponent(alpha):color
  }
  static genFrame(x,y,width,height) {
    return {x:x,y:y,width:width,height:height}
  }
  static getImage(path,scale=2) {
    return UIImage.imageWithDataScale(NSData.dataWithContentsOfFile(path), scale)
  }
  /**
   * 
   * @param {string} markdown 
   * @returns {NSData[]}
   */
  static getImagesFromMarkdown(markdown) {
try {
    // 匹配 base64 图片链接的正则表达式
    const MNImagePattern = /!\[.*?\]\((marginnote4app\:\/\/markdownimg\/png\/.*?)(\))/g;
    let images = []
    // 处理 Markdown 字符串，替换每个 base64 图片链接
    markdown.replace(MNImagePattern, (match, MNImageURL,p2) => {
      let hash = MNImageURL.split("markdownimg/png/")[1]
      let imageData = MNUtil.getMediaByHash(hash)
      if (imageData) {
        images.push(imageData)
      }
      return "";
    });
  return images;
} catch (error) {
  this.addErrorLog(error, "getImagesFromMarkdown")
  return []
}
}
  /**
   * Retrieves the image data from the current document controller or other document controllers if the document map split mode is enabled.
   * 
   * This method checks for image data in the current document controller's selection. If no image is found, it checks the focused note within the current document controller.
   * If the document map split mode is enabled, it iterates through all document controllers to find the image data. If a pop-up selection info is available, it also checks the associated document controller.
   * 
   * @param {MNNote} [note] - Whether to check the focused note for image data.
   * @param {boolean} [checkTextFirst=false] - Whether to check other document controllers if the document map split mode is enabled.
   * @returns {NSData[]|undefined} The image data if found, otherwise undefined.
   */
  static getImagesFromNote(note,checkTextFirst = false) {
    let imageDatas = []
    if (note.excerptPic) {
      if (checkTextFirst && note.textFirst) {
        if (note.excerptTextMarkdown) {
          let images = this.getImagesFromMarkdown(note.excerptText)
          if (images.length) {
            imageDatas = imageDatas.concat(images)
          }
        }
        //检查发现图片已经转为文本，因此略过
      }else{
        imageDatas.push(MNUtil.getMediaByHash(note.excerptPic.paint))
      }
    }else{
      if (note.excerptTextMarkdown) {
        let images = this.getImagesFromMarkdown(note.excerptText)
        if (images.length) {
          imageDatas = imageDatas.concat(images)
        }
      }
    }
    if (note.comments.length) {
      for (let i = 0; i < note.comments.length; i++) {
        const comment = note.comments[i];
        if (comment.type === 'PaintNote' && comment.paint) {
          imageDatas.push(MNUtil.getMediaByHash(comment.paint))
        }else if (comment.type === "LinkNote" && comment.q_hpic && comment.q_hpic.paint) {
          imageDatas.push(MNUtil.getMediaByHash(comment.q_hpic.paint))
        }
      }
    }
    return imageDatas
  }
  static getFocusNote(allowSelection = true) {
    //MNNote的方法可能无法兼顾到保存的对照视图,多加一个判断
    let focusNote = MNNote.getFocusNote()
    if (focusNote) {
      return focusNote
    }else{
      if (this.currentNoteId) {
        return MNNote.new(this.currentNoteId)
      }
      if (allowSelection && MNUtil.currentSelection.onSelection) {
        return MNNote.fromSelection().realGroupNoteForTopicId()
      }
      return undefined
    }
  }

  static getFocusNoteId(allowSelection = true) {
    //MNNote的方法可能无法兼顾到保存的对照视图,多加一个判断
    let focusNote = this.getFocusNote(allowSelection)
    if (focusNote) {
      return focusNote.noteId
    }
    return undefined
  }

  static getFocusNotes() {
    let focusNotes = MNNote.getFocusNotes()
    if (focusNotes.length === 1) {
      if (focusNotes[0]) {
        return focusNotes
      }
      return []
    }
    return focusNotes
  }

  static cloneNote(noteid) {
    let targetNote = this.getNoteById(noteid)
    if (!targetNote) {
      this.showHUD("Note not exists!")
      return undefined
    }
    let note = this.data.cloneNotesToTopic([targetNote], targetNote.notebookId)
    return note[0]
  }

  static cloneAndMerge(currentNote,targetNoteId) {
    let clonedNoteId = this.cloneNote(targetNoteId)
    currentNote.merge(this.getNoteById(clonedNoteId))
  }

  static postNotification(name,userInfo) {
    NSNotificationCenter.defaultCenter().postNotificationNameObjectUserInfo(name, this.focusWindow, userInfo)
  }
  /**
   * 
   * @param {MNNote} note 
   * @param {number} level 
   * @returns {Promise<string>}
   */
  static async getMDFromNote(note,level = 0,OCR_enabled = false){
    if (note) {
      note = note.realGroupNoteForTopicId()
    }else{
      return ""
    }
try {

  let title = (note.noteTitle && note.noteTitle.trim()) ? "# "+note.noteTitle.trim() : ""
  if (title.trim()) {
    title = title.split(";").filter(t=>{
      if (/{{.*}}/.test(t)) {
        return false
      }
      return true
    }).join(";")
  }
  let textFirst = note.textFirst
  let excerptText
  if (note.excerptPic && !textFirst) {
    if (OCR_enabled) {
      excerptText = await chatAINetwork.getTextOCR(MNUtil.getMediaByHash(note.excerptPic.paint))
    }else{
      excerptText = ""
    }
  }else{
    excerptText = note.excerptText ?? ""
  }
  if (note.comments.length) {
    let comments = note.comments
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      switch (comment.type) {
        case "TextNote":
          if (/^marginnote\dapp\:\/\//.test(comment.text)) {
            //do nothing
          }else{
            excerptText = excerptText+"\n"+comment.text
          }
          break;
        case "HtmlNote":
          excerptText = excerptText+"\n"+comment.text
          break
        case "LinkNote":
          if (OCR_enabled && comment.q_hpic  && comment.q_hpic.paint && !textFirst) {
            let imageData = MNUtil.getMediaByHash(comment.q_hpic.paint)
            let imageSize = UIImage.imageWithData(imageData).size
            if (imageSize.width === 1 && imageSize.height === 1) {
              if (comment.q_htext) {
                excerptText = excerptText+"\n"+comment.q_htext
              }
            }else{
              excerptText = excerptText+"\n"+await chatAINetwork.getTextOCR(imageData)
            }
          }else{
            excerptText = excerptText+"\n"+comment.q_htext
          }
          break
        case "PaintNote":
          if (OCR_enabled && comment.paint){
            excerptText = excerptText+"\n"+await chatAINetwork.getTextOCR(MNUtil.getMediaByHash(comment.paint))
          }
          break
        default:
          break;
      }
    }
  }
  excerptText = (excerptText && excerptText.trim()) ? this.highlightEqualsContentReverse(excerptText) : ""
  let content = title+"\n"+excerptText
  if (level) {
    content = content.replace(/(#+\s)/g, "#".repeat(level)+"\$1")
  }
  return content
}catch(error){
  this.addErrorLog(error, "getMDFromNote")
  return ""
}
  }
  static highlightEqualsContentReverse(markdown) {
      // 使用正则表达式匹配==xxx==的内容并替换为<mark>xxx</mark>
      return markdown.replace(/<mark>(.+?)<\/mark>/g, '==\$1==');
  }
/**
 * 
 * @param {object} vars 
 * @param {string} userInput 
 * @returns 
 */
  static getVarInfo(vars,preConfig = {}) {//对通用的部分先写好对应的值
    let config = preConfig
    config.date = {
      now: new Date(Date.now()).toLocaleString(),
      tomorrow: new Date(Date.now()+86400000).toLocaleString(),
      yesterday: new Date(Date.now()-86400000).toLocaleString(),
      year: new Date().getFullYear(),
      month: new Date().getMonth()+1,
      day: new Date().getDate(),
      hour: new Date().getHours(),
      minute: new Date().getMinutes(),
      second: new Date().getSeconds()
    }
    if (MNUtil.currentSelection.onSelection) {
      config.isSelectionImage = !MNUtil.currentSelection.isText
      config.isSelectionText = !!MNUtil.currentSelection.text
      config.selectionText = MNUtil.currentSelection.text
    }else{
      config.isSelectionText = false
      config.isSelectionImage = false
    }

    if (vars.hasClipboardText) {
      config.clipboardText = MNUtil.clipboardText
    }
    if (vars.hasKnowledge) {
      config.knowledge = chatAIConfig.knowledge
    }
    config.test = "test"
    if (vars.hasCurrentDocName) {
      config.currentDocName = MNUtil.getFileName(MNUtil.currentDocController.document.pathFile)
    }
    config.hideOnSelectionText = function (value) {//不能返回空字符串
      // MNUtil.showHUD("message"+this.isSelectionText)
      if (this.isSelectionText) {
        return " "
      }else{
        return value
      }
    }
    config.hideOnSelectionImage = function (value) {
      if (this.isSelectionImage) {
        return " "
      }else{
        return value
      }
    }
    config.hideOnNote = function (value) {
      if (this.note) {
        return " "
      }else{
        return value
      }
    }
    config.hideOnVision = function (value) {
      if (this.visionMode) {
        return " "
      }else{
        return value
      }
    }
    return config
  }
  /**
   * 
   * @param {MbBook|string} doc 
   * @returns 
   */
  static async getDocObject(doc,opt = {withContent:false}) {
    if (typeof doc === "string") {
      doc = MNUtil.getDocById(doc)
    }
    if (!doc) {
      return undefined
    }
    let docConfig = {}
    docConfig.id = doc.docMd5
    docConfig.name = doc.docTitle
    let tem = {
      name:doc.docTitle,
      path:doc.fullPathFileName,
      md5:doc.docMd5,
    }
    let PDFExtractMode = chatAIConfig.getConfig("PDFExtractMode")
    if (opt.withContent) {
      MNUtil.log({message:"getDocObject withContent",detail:tem})
      let fileInfo = await chatAIConfig.getFileContent(tem,PDFExtractMode === "local")
      // MNUtil.log(typeof fileInfo)
      docConfig.content = fileInfo.content
    }
    let notebookId = doc.currentTopicId
    if (notebookId) {
      docConfig.notebook = {
        id:notebookId,
        name:MNUtil.getNoteBookById(notebookId).title,
      }
    }
    docConfig.pageCount = doc.pageCount
    return docConfig
  }
  /**
   * @param {{first:boolean,parentLevel:number,parent:boolean,child:boolean}} opt 
   * @param {MNNote} note 
   */
  static async getNoteObject(note,opt={first:true,noteInfo:{}}) {
    try {
    if (!note) {
      return undefined
    }
    // MNUtil.log("Parentlevel: "+opt.parentLevel)
    let noteInfo = opt.noteInfo
      
    let noteConfig = {}
    noteConfig.id = note.noteId
    if (opt.first) {
      noteConfig.notebook = {
        id:note.notebookId,
        name:MNUtil.getNoteBookById(note.notebookId).title,
      }
    }
    noteConfig.title = note.noteTitle
    noteConfig.url = note.noteURL
    noteConfig.excerptText = note.excerptText
    noteConfig.isMarkdownExcerpt = note.excerptTextMarkdown
    let isBlankNote = this.isBlankNote(note)
    if (note.excerptPic && !isBlankNote) {
      noteConfig.isImageExcerpt = true
    }else{
      noteConfig.isImageExcerpt = false
    }
    noteConfig.date = {
      create:note.createDate.toLocaleString(),
      modify:note.modifiedDate.toLocaleString(),
    }
    noteConfig.allText = note.allNoteText()
    noteConfig.content = note.allText
    noteConfig.tags = note.tags
    noteConfig.hashTags = note.tags.map(tag=> ("#"+tag)).join(" ")
    noteConfig.hasTag = note.tags.length > 0
    noteConfig.hasComment = note.comments.length > 0
    noteConfig.hasChild = note.childNotes.length > 0
    noteConfig.hasText = !!noteConfig.allText
    let AllColors = ["LightYellow", "LightGreen", "LightBlue", "LightRed", "Yellow", "Green", "Blue", "Red", "Orange", "DarkGreen", "DarkBlue", "DeepRed", "White", "LightGray", "DarkGray", "Purple"]
    noteConfig.colorString = AllColors[note.colorIndex] ?? "White"
    if (note.colorIndex !== undefined) {
      noteConfig.color = {}
      noteConfig.color.lightYellow = note.colorIndex === 0
      noteConfig.color.lightGreen = note.colorIndex === 1
      noteConfig.color.lightBlue = note.colorIndex === 2
      noteConfig.color.lightRed = note.colorIndex === 3
      noteConfig.color.yellow = note.colorIndex === 4
      noteConfig.color.green = note.colorIndex === 5
      noteConfig.color.blue = note.colorIndex === 6
      noteConfig.color.red = note.colorIndex === 7
      noteConfig.color.orange = note.colorIndex === 8
      noteConfig.color.darkGreen = note.colorIndex === 9
      noteConfig.color.darkBlue = note.colorIndex === 10
      noteConfig.color.deepRed = note.colorIndex === 11
      noteConfig.color.white = note.colorIndex === 12
      noteConfig.color.lightGray = note.colorIndex === 13
      noteConfig.color.darkGray = note.colorIndex === 14
      noteConfig.color.purple = note.colorIndex === 15
    }
    if (note.docMd5 && MNUtil.getDocById(note.docMd5)) {
      let startPage = note.note.startPage
      let endPage = note.note.endPage
      let pageRange = undefined
      if (startPage !== undefined && endPage !== undefined) {
        pageRange = {startPage,endPage}
      }
      noteConfig.doc = await this.getDocObject(MNUtil.getDocById(note.docMd5),{withContent:noteInfo.hasNoteDoc,pageRange:pageRange}) 
      noteConfig.hasDoc = true
    }else{
      noteConfig.hasDoc = false
    }
    if (note.childMindMap) {
      // noteInfo.hasChildMindMap = false
      noteConfig.childMindMap = await this.getNoteObject(note.childMindMap,{first:false})
    }
    noteConfig.inMainMindMap = !noteConfig.childMindMap
    noteConfig.inChildMindMap = !!noteConfig.childMindMap
    if (opt.parent && note.parentNote) {
      if ("parentLevel" in noteInfo) {
        if (opt.parentLevel > 0) {
      // MNUtil.log("Get parent: "+opt.parentLevel)
          noteConfig.parent = await this.getNoteObject(note.parentNote,{parentLevel:opt.parentLevel-1,parent:true,first:false})
        }
      }else{
      // MNUtil.log("Get parent: "+opt.parentLevel)
        noteConfig.parent = await this.getNoteObject(note.parentNote,{first:false})
      }
    }
    // noteConfig.hasParent = "parent" in noteConfig
    if (opt.child && note.childNotes) {
      // MNUtil.log("Get child")
      noteConfig.child = await Promise.all(note.childNotes.map(note=>this.getNoteObject(note,{first:false})))
    }
    return noteConfig
    } catch (error) {
      this.addErrorLog(error, "getNoteObject")
      return undefined
    }
  }
  
  /**
   * 
   * @param {string} text 
   * @param {string} userInput 
   * @returns 
   */
  static checkVariableForNote(text,userInput){//提前写好要退化到的变量
    let OCR_Enabled = chatAIUtils.OCREnhancedMode
    let hasUserInput = text.includes("{{userInput}}")
    let hasCards = text.includes("{{cards}}")
    let hasCardsOCR = text.includes("{{cardsOCR}}")
    let replaceVarConfig = {}
    if (OCR_Enabled) {
      replaceVarConfig.context = `{{textOCR}}`
      replaceVarConfig.card = `{{cardOCR}}`
      replaceVarConfig.parentCard = `{{parentCardOCR}}`
      replaceVarConfig.cards = `{{cardsOCR}}`

      if (hasUserInput && !userInput) {
        replaceVarConfig.userInput = `{{textOCR}}`
      }
      if (hasCards || hasCardsOCR) {
        if (this.getFocusNotes().length === 1) {
          replaceVarConfig.cards = `{{cardOCR}}`
          replaceVarConfig.cardsOCR = `{{cardOCR}}`
        }
      }
    }else{
      if (hasUserInput && !userInput) {
        replaceVarConfig.userInput = `{{context}}`
      }
      if (hasCards || hasCardsOCR) {
        if (this.getFocusNotes().length === 1) {
          replaceVarConfig.cards = `{{card}}`
          replaceVarConfig.cardsOCR = `{{carsdOCR}}`
        }
      }
    }
    MNUtil.copy({text: text,replaceVarConfig:replaceVarConfig})
    return MNUtil.render(text, replaceVarConfig)
    // return this.replacVar(text, replaceVarConfig)
  }

  static checkVariableForText(text,userInput){//提前写好要退化到的变量
    let OCR_Enabled = chatAIUtils.OCREnhancedMode
    let hasUserInput = text.includes("{{userInput}}")
    let replaceVarConfig = {}
    if (OCR_Enabled) {
      replaceVarConfig.context = `{{textOCR}}`
      replaceVarConfig.card = `{{textOCR}}`
      replaceVarConfig.parentCard = `{{textOCR}}`
      replaceVarConfig.cards = `{{textOCR}}`
      if (hasUserInput && !userInput) {
        replaceVarConfig.userInput = `{{textOCR}}`
      }
    }else{
      replaceVarConfig.card = `{{context}}`
      replaceVarConfig.cards = `{{context}}`
      replaceVarConfig.parentCard = `{{context}}`
      if (hasUserInput && !userInput) {
        replaceVarConfig.userInput = `{{context}}`
      }
    }
    replaceVarConfig.cardOCR = `{{textOCR}}`
    replaceVarConfig.cardsOCR = `{{textOCR}}`
    replaceVarConfig.parentCardOCR = `{{textOCR}}`
    replaceVarConfig.noteDocInfo = `{{currentDocInfo}}`
    replaceVarConfig.noteDocAttach = `{{currentDocAttach}}`
    replaceVarConfig.noteDocName = `{{currentDocName}}`
    return this.replacVar(text, replaceVarConfig)
  }
  static replacVar(text,varInfo) {
    let vars = Object.keys(varInfo)
    let original = text
    for (let i = 0; i < vars.length; i++) {
      const variable = vars[i];
      const variableText = varInfo[variable]
      const regex = new RegExp(`{{${variable}}}`, 'g');
      original = original.replace(regex,variableText)
    }
    // copy(original)
    return original
  }

  static detectAndReplace(text,element=undefined) {
    let config = this.getVarInfo(text)
    if (element !== undefined) {
      config.element = element
    }
    return this.replacVar(text,config)
  }

  static checkHeight(height){
    if (height > 400) {
      return 400
    }else if(height < 80){
      return 80
    }else{
      return height
    }
  }
  static addObserver(observer,selector,name){
    NSNotificationCenter.defaultCenter().addObserverSelectorName(observer, selector, name);
  }
  static removeObserver(observer,name){
    NSNotificationCenter.defaultCenter().removeObserverName(observer, name);
  }
  static studyMode(){
    return this.studyController().studyMode
  }
  static openURL(url){
    if (!this.app) {
      this.app = Application.sharedInstance()
    }
    this.app.openURL(NSURL.URLWithString(url));
  }
  static ensureChatAIController(){
    if (!this.chatController) {
      this.chatController = chatglmController.new();
      MNUtil.studyView.addSubview(this.chatController.view)
      this.chatController.view.hidden = true;
    }else{
      this.ensureView(this.chatController.view)
    }
  }
  static initChatAIController(){
    this.chatController = chatglmController.new();
    MNUtil.studyView.addSubview(this.chatController.view)
  }
  static ensureNotifyController(){
    if (!this.notifyController) {
      this.notifyController = notificationController.new();
      MNUtil.currentWindow.addSubview(this.notifyController.view)
      // MNUtil.studyView.addSubview(this.notifyController.view)
      this.notifyController.view.hidden = true
      this.notifyController.view.frame = {x:50,y:50,width:400,height:120}
      this.notifyController.currentFrame = {x:50,y:50,width:400,height:120}
    }else
      this.ensureViewInCurrentWindow(this.notifyController.view)
  }
  static initDynamicController(){
    this.dynamicController = dynamicController.new();
    MNUtil.studyView.addSubview(this.dynamicController.view)
  }
  static isIOS(){
    //把宽度过低的情况也当做是iOS模式
    return (MNUtil.studyView.bounds.width < 500)
  }
  static getWidth(){
    if (this.isIOS()) {
      return MNUtil.studyView.bounds.width
    }else{
      return 400
    }
  }
  static getHeight(){
    if (this.isIOS()) {
      return MNUtil.currentWindow.bounds.height-this.getY()-30
    }else{
      return MNUtil.currentWindow.bounds.height-this.getY()
    }
  }
  static getY(){
    // return 75
    if (this.isIOS()) {
      return 0
    }else{
      return 75
    }
  }
  static getX(){
    let notifyLoc = chatAIUtils.isIOS()?0:chatAIConfig.config.notifyLoc
    switch (notifyLoc) {
      case 0:
        if (this.isIOS()) {
          return 0
        }else{
          return 50
        }
      case 1:
        if (this.isIOS()) {
          return MNUtil.currentWindow.bounds.width-450
        }else{
          return MNUtil.currentWindow.bounds.width-450
        }
      default:
        break;
    }
    return 0
  }
  static sidebarMode(){
    return !this.isIOS()
  }
  static onChat(){
    if (this.sidebarMode()) {
      if (!MNExtensionPanel.on) {
        return false
      }
      let targetView = MNExtensionPanel.subview("chatAISideOutputView")
      if (targetView) {
        return !targetView.hidden
      }
      return false
    }else{
      return this.notifyController.onChat
    }
  }
  /**
   * 
   * @param {MbBookNote|MNNote|undefined} note 
   */
  static hasImageInNote(note){
    if (!note) {
      return false
    }
    if (note.excerptPic && !note.textFirst) {
      return true
    }
    if (note.comments && note.comments.length) {
      let comment = note.comments.find(c=>c.type==="PaintNote")
      if (comment) {
        return true
      }
    }
    return false
  }
  /**
   * 
   * @param {MbBookNote|MNNote} note 
   */
  static async getTextForSearch(note,OCR_enabled=false) {
    let order = chatAIConfig.getConfig("searchOrder")
    let text
    for (let index = 0; index < order.length; index++) {
      const element = order[index];
      switch (element) {
        case 1:
          if (note.noteTitle && note.noteTitle !== "") {
            text = note.noteTitle
          }
          break;
        case 2:
          if (OCR_enabled && note.excerptPic && !note.textFirst) {
            let image = MNUtil.getMediaByHash(note.excerptPic.paint)
            text = await chatAINetwork.getTextOCR(image)
            // text = ""
          }else if (this.noteHasExcerptText(note)) {
            text = note.excerptText
          }

          //如果都不满足，此时text依然为undefined
          break;
        case 3:
          let commentText
          let commentImage = undefined
          //用find主要是保证得到想要的元素之后就会直接返回，而不是继续执行
          //但是find处理不了异步的情况
          let comment = note.comments.find(comment=>{
            switch (comment.type) {
              case "TextNote":
                if (/^marginnote\dapp:\/\//.test(comment.text)) {
                  return false
                }else{
                  commentText = comment.text
                  return true
                }
              case "HtmlNote":
                commentText = comment.text
                return true
              case "LinkNote":
                if (comment.q_hpic && !note.textFirst) {
                  if (OCR_enabled) {
                    commentImage = MNUtil.getMediaByHash(comment.q_hpic.paint)
                    // commentText = await chatAINetwork.getTextOCR(commentImage)
                    return true
                  }else{
                    return false
                  }
                }else{
                  commentText = comment.q_htext
                  return true
                }
              case "PaintNote":
                if (OCR_enabled && comment.paint) {
                  commentImage = MNUtil.getMediaByHash(comment.paint)
                  // commentText = await chatAINetwork.getTextOCR(commentImage)
                  return true
                }
                return false
              default:
                return false
            }
          })
          if (commentImage) {
            MNUtil.showHUD("should OCR")
            commentText = await chatAINetwork.getTextOCR(commentImage)
            // MNUtil.copy(commentText)
          }
          if (commentText && commentText.length) {
            text = commentText
          }
          break;
        case 4:
          text = chatAIUtils.getMDFromNote(note)
          break;
        default:
          break;
      }
      if (text) {
        return text
      }
    }
    return undefined
  }
  static async getInfoForReference(){
    try {
      let info = {userInput:"",ocr:false}
      if (chatAIUtils.currentNoteId) {
        let note = MNNote.new(chatAIUtils.currentNoteId)
        info.userInput = `{{note:${chatAIUtils.currentNoteId}}}`
        // let hasImage = chatAIUtils.hasImageInNote(note)
        let imageDatas = chatAIUtils.getImagesFromNote(note)
        let numberOfImages = imageDatas.length
        // let imageData = note.imageData
        if (numberOfImages) {//检查是否包含图片
          let autoImage = chatAIConfig.getConfig("autoImage")
          let autoOCR = chatAIConfig.getConfig("autoOCR")
          if (autoImage || autoOCR) {//如果同时开启了自动图片和自动OCR，则只有当图片存在时才会调用OCR
            if (autoImage) {//将图片添加到引用框中
              info.imageData = imageDatas[0]
              if (numberOfImages > 1) {
                info.imageDatas = imageDatas
              }
              return info
            }else if (autoOCR) {//对图片进行OCR
              let text = await chatAINetwork.getTextOCR(imageDatas[0])
              if (numberOfImages > 1) {
                for (let i = 1; i < numberOfImages; i++) {
                  const image = imageDatas[i]
                  const tem = await chatAINetwork.getTextOCR(image)
                  text = text + "\n" + tem
                }
              }

              info.userInput = text
              info.ocr = true
              return info
            }
          }
        }
        return info
      }
      let selection = MNUtil.currentSelection
      if (selection.onSelection) {//文档上存在选区
        info.userInput = selection.text
        if (selection.isText) {//选区为文本
          // let autoOCR = chatAIConfig.getConfig("autoOCR")
          // if (autoOCR) {//如果开启了自动OCR，则只有当图片存在时才会调用OCR
          //   let text = await chatAINetwork.getTextOCR(selection.image)
          //   info.userInput = text
          //   info.ocr = true
          // }
          return info
        }else{//选区为图片
          let autoImage = chatAIConfig.getConfig("autoImage")
          let autoOCR = chatAIConfig.getConfig("autoOCR")
          if (autoImage || autoOCR) {//如果同时开启了自动图片和自动OCR，则只有当图片存在时才会调用OCR
            let imageData = selection.image
            if (autoImage) {//将图片添加到引用框中
              info.imageData = imageData
              return info
            }else if (autoOCR) {
              let text = await chatAINetwork.getTextOCR(imageData)
              info.userInput = text
              info.ocr = true
              return info
            }
          }
        }
        return info
      }
      let note = chatAIUtils.getFocusNote()
      if (note) {
        info.userInput = `{{note:${note.noteId}}}`
        let imageDatas = chatAIUtils.getImagesFromNote(note)
        // let imageData = note.imageData
        let numberOfImages = imageDatas.length
        if (numberOfImages) {//检查是否包含图片
          let autoImage = chatAIConfig.getConfig("autoImage")
          let autoOCR = chatAIConfig.getConfig("autoOCR")
          if (autoImage || autoOCR) {//如果同时开启了自动图片和自动OCR，则只有当图片存在时才会调用OCR
            if (autoImage) {//将图片添加到引用框中
              info.imageData = imageDatas[0]
              if (numberOfImages > 1) {
                info.imageDatas = imageDatas
              }
              return info
            }else if (autoOCR) {
              let text = await chatAINetwork.getTextOCR(imageDatas[0])
              if (numberOfImages > 1) {
                for (let i = 1; i < numberOfImages; i++) {
                  const image = imageDatas[i]
                  const tem = await chatAINetwork.getTextOCR(image)
                  text = text + "\n" + tem
                }
              }
              info.userInput = text
              info.ocr = true
              return info
            }
          }
        }
      }
      return info
    } catch (error) {
      chatAIUtils.addErrorLog(error, "getInfoForReference")
      return undefined
    }
  }
  static getToday() {
    // 创建一个新的Date对象，默认情况下它会包含当前日期和时间
    const today = new Date();

    // 获取日
    const day = today.getDate();
    return day
  }
  static switchColor(on123){
    let color = on123 ? "#457bd3" : "#9bb2d6"
    return this.hexColorAlpha(color,0.8)
  }
  static countWords(str) {
    const chinese = Array.from(str)
      .filter(ch => /[\u4e00-\u9fa5]/.test(ch))
      .length
    
    const english = Array.from(str)
      .map(ch => /[a-zA-Z0-9\s]/.test(ch) ? ch : ' ')
      .join('').split(/\s+/).filter(s => s)
      .length

    return chinese + english
  }
  static animate(func,time = 0.2) {
    UIView.animateWithDurationAnimationsCompletion(time,func)
  }

  static animateWithCompletion(func,funcWhenCompleted,time = 0.2) {
    UIView.animateWithDurationAnimationsCompletion(time,func,funcWhenCompleted)
  }
  static checkSender(sender,window){
    return this.app.checkNotifySenderInWindow(sender, window)
  }
  static getFileName(fullPath) {
      // 找到最后一个'/'的位置
    let lastSlashIndex = fullPath.lastIndexOf('/');

      // 从最后一个'/'之后截取字符串，得到文件名
    let fileName = fullPath.substring(lastSlashIndex + 1);

    return fileName;
  }
  static noteExists(noteId){
    let note = this.data.getNoteById(noteId)
    if (note) {
      return true
    }
    return false
  }
  static isfileExists(path) {
    return NSFileManager.defaultManager().fileExistsAtPath(path)
  }

  static getCurrentFile() {
    let docController = this.currentDocController()
    let docFile = docController.document
    let currentPageNo = docController.currPageNo
    let pageCount = docFile.pageCount
    // copy(docFile.pathFile)
    let fullPath
    if (docFile.fullPathFileName) {
      fullPath = docFile.fullPathFileName
    }else{
      let folder = this.app.documentPath
      fullPath = folder+"/"+docFile.pathFile
      if (docFile.pathFile.startsWith("$$$MNDOCLINK$$$")) {
        let fileName = this.getFileName(docFile.pathFile)
        fullPath = this.app.tempPath + fileName
        // fullPath = docFile.pathFile.replace("$$$MNDOCLINK$$$", "/Users/linlifei/")
      }
    }
    // copy(fullPath)
    let fileName = docFile.docTitle
    return{
      name:fileName,
      path:fullPath,
      md5:docFile.docMd5,
      currentPageNo:currentPageNo,
      pageCount:pageCount,
      fileExists:MNUtil.isfileExists(fullPath)
    }
  }
  static getNoteFileName(noteId) {
    let note = MNUtil.getNoteById(noteId)
    let docFile = MNUtil.getDocById(note.docMd5)
    if (!docFile) {
      MNUtil.showHUD("No file")
      return undefined
    }
    return MNUtil.getFileName(docFile.pathFile)
  }
  static getNoteFile(noteId) {
    let note = MNUtil.getNoteById(noteId)
    let docFile = MNUtil.getDocById(note.docMd5)
    if (!docFile) {
      MNUtil.showHUD("No file")
      return {
        fileExists:false
      }
    }
    let fullPath
    if (docFile.fullPathFileName) {
      fullPath = docFile.fullPathFileName
    }else{
      let folder = MNUtil.documentFolder
      let fullPath = folder+"/"+docFile.pathFile
      if (docFile.pathFile.startsWith("$$$MNDOCLINK$$$")) {
        let fileName = this.getFileName(docFile.pathFile)
        fullPath = Application.sharedInstance().tempPath + fileName
        // fullPath = docFile.pathFile.replace("$$$MNDOCLINK$$$", "/Users/linlifei/")
      }
    }
    // copy(fullPath)
    let fileName = docFile.docTitle
    return{
      name:fileName,
      path:fullPath,
      md5:docFile.docMd5,
      fileExists:MNUtil.isfileExists(fullPath),
      pageCount:docFile.pageCount
    }
  }
  static isValidJSON(jsonString){
    try{
      var json = JSON.parse(jsonString);
      if (json && typeof json === "object") {
        return true;
      }
    }
    catch(e){
      return false;
    }
    return false;
  }
  /**
   * 
   * @param {MNNote|MbBookNote} note 
   * @returns 
   */
  static noteHasExcerptText(note) {
    //当摘要文本存在且没有评论时,不管是否是图片摘录,都返回true
    if (note.excerptText && note.excerptText.trim() && (note.comments.length === 0)) {
      return true
    }
    //考虑到可能存在图片摘要，因此要么图片摘要不存在，要么图片摘要已被转为文本
    let isBlankNote = this.isBlankNote(note)//指有图片摘录但图片分辨率为1x1的空白图片
    if (isBlankNote) {
      return note.excerptText && note.excerptText !== ""
    }
    return note.excerptText && note.excerptText !== "" && (!note.excerptPic || note.textFirst)
  }
  static strCode(str) {  //获取字符串的字节数
    var count = 0;  //初始化字节数递加变量并获取字符串参数的字符个数
    var cn = [8211, 8212, 8216, 8217, 8220, 8221, 8230, 12289, 12290, 12296, 12297, 12298, 12299, 12300, 12301, 12302, 12303, 12304, 12305, 12308, 12309, 65281, 65288, 65289, 65292, 65294, 65306, 65307, 65311]
    var half = [32, 33, 34, 35, 36, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 58, 59, 60, 61, 62, 63, 64, 91, 92, 93, 94, 95, 96, 123, 124, 125, 126,105,108,8211]
    if (str) {  //如果存在字符串，则执行
      let len = str.length;
        for (var i = 0; i < len; i++) {  //遍历字符串，枚举每个字符
        let charCode = str.charCodeAt(i)
            if (charCode>=65 && charCode<=90) {
              count += 1.5;  //大写
        } else if (half.includes(charCode)) {
              count +=0.45
        } else if (cn.includes(charCode)) {
              count +=0.8
            }else if (charCode > 255) {  //字符编码大于255，说明是双字节字符(即是中文)
                count += 2;  //则累加2个
            }else{
                count++;  //否则递加一次
            }
        }
        return count;  //返回字节数
    } else {
        return 0;  //如果参数为空，则返回0个
    }
  }
  /**
   * 
   * @param {any[]} arr 
   * @returns 
   */
  static getRandomElement(arr) {
    if (arr.length === 1) {
      return arr[0]
    }
    if (arr && arr.length) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      return arr[randomIndex];
    }
    return ""; // 或者抛出一个错误，如果数组为空或者未定义
  }
  static focusNoteInMindMapById(noteId){
    this.studyController().focusNoteInMindMapById(noteId)
  }
  static async delay (seconds) {
    return new Promise((resolve, reject) => {
      NSTimer.scheduledTimerWithTimeInterval(seconds, false, function () {
        resolve()
      })
    })
  }
  static getFile(path) {
    if (MNUtil.isfileExists(path)) {
      return NSData.dataWithContentsOfFile(path)
    }
    MNLog.error("getFile: file not exists",{detail:path})
    return undefined
  }
  static clearCurrent(){
    this.currentNoteId = undefined
    this.currentSelection = undefined
  }
  static refreshCurrent(){
    this.currentSelection = this.currentDocController().selectionText
    let focusNote = this.getFocusNote()
    if (focusNote) {
      this.currentNoteId = focusNote.noteId
    }else{
      this.currentNoteId = undefined
    }
  }
  static getPopoverAndPresent(sender,commandTable,width=100,position=2) {
    var menuController = MenuController.new();
    menuController.commandTable = commandTable
    menuController.rowHeight = 35;
    menuController.preferredContentSize = {
      width: width,
      height: menuController.rowHeight * menuController.commandTable.length
    };
    //左 0
    //下 1，3
    //上 2
    //右 4
    var popoverController = new UIPopoverController(menuController);
    var r = sender.convertRectToView(sender.bounds,MNUtil.studyView);
    popoverController.presentPopoverFromRect(r, MNUtil.studyView, position, true);
    return popoverController
  }
  static isActivated(msg = false){
    if (typeof subscriptionConfig !== 'undefined') {
      return subscriptionConfig.getConfig("activated")
    }else{
      if (msg) {
        this.showHUD("Set your API key or install 'MN Utils'")
      }
      return false
    }
    
  }
  static isSubscribed(msg = true){
    if (typeof subscriptionConfig !== 'undefined') {
      return subscriptionConfig.isSubscribed()
    }else{
      if (msg) {
        this.showHUD("Please install 'MN Utils' first!")
      }
      return false
    }
  }
  /**
   * count为true代表本次check会消耗一次免费额度（如果当天未订阅），如果为false则表示只要当天免费额度没用完，check就会返回true
   * 开启ignoreFree则代表本次check只会看是否订阅，不管是否还有免费额度
   * @param {boolean} count 
   * @param {boolean} msg 
   * @param {boolean} ignoreFree 
   * @returns {Boolean}
   */
  static checkSubscribe(count = true, msg = true,ignoreFree = false){
    // return true

    if (typeof subscriptionConfig !== 'undefined') {
      let res = subscriptionConfig.checkSubscribed(count,ignoreFree,msg)
      return res
    }else{
      if (msg) {
        this.showHUD("Please install 'MN Utils' first!")
      }
      return false
    }
  }
  static preCheck(freeOCR = false){
  try {
    

    if (this.checkSubscribe(false,false,true)) {
      this.chatController.usageButton.setTitleForState("Unlimited",0)
      return true
    }
    if (chatAIConfig.config.source === "Built-in" || freeOCR) {
      let usage = chatAIConfig.getUsage()
      if (usage.usage >= usage.limit) {
        MNUtil.confirm("Access limited", "You have reached the usage limit for today. Please subscribe to continue or use other AI providers.\n\n 当天免费额度已用完，请订阅或使用其他AI提供商。")
        return false
      }else{
        usage.usage = usage.usage+1
      }
      if (this.chatController.usageButton) {
        this.chatController.usageButton.setTitleForState("Usage: "+usage.usage+"/100",0)
      }
      chatAIConfig.save("MNChatglm_usage")
    }
    return true
  } catch (error) {
    this.addErrorLog(error, "preCheck")
    return false
  }
  }
  /**
   * 
   * @param {MbBookNote} note
   * @returns {String[]}
   */
  static extractTagsFromNote(note) {
    // 用于存储所有标签的数组
    const tags = [];
    // 检查 note 是否有 comments 属性，且其为数组
    if (note.comments && Array.isArray(note.comments)) {
      // 遍历 comments 数组
      note.comments.forEach(comment => {
        // 检查评论的类型是否为 "TextNote"
        if (comment.type === "TextNote" && typeof comment.text === "string") {
          // 使用正则表达式查找所有标签（格式为 #tagname）
          const tagMatches = comment.text.match(/#[\w\u4e00-\u9fff]+/g);
          if (tagMatches) {
            // 将找到的标签添加到 tags 数组中
            tags.push(...tagMatches);
          }
        }
      });
    }

    // 返回去重后的标签数组
    return [...new Set(tags)];
  }
  /**
   * 
   * @param {*} arr1 
   * @param {*} arr2 
   * @returns {String[]}
   */
  static findCommonElements(arr1, arr2) {
    // 使用 filter() 方法和 includes() 方法找出相同的元素
    const commonElements = arr1.filter(element => arr2.includes(element));
    return commonElements;
  }
  static findSimilarPrompts(query, prompts) {//
    // 使用 filter() 方法和 includes() 方法找出相似的元素
    let targetQuery = query.trim()
    const commonElements = this.findCommonElements([targetQuery], prompts)
    if (commonElements.length) {
      return commonElements
    }
    let similarPrompts = prompts.filter(promptName=>promptName.includes(targetQuery))
    if (similarPrompts.length) {
      let prefixMatchedPrompts = prompts.filter(promptName=>promptName.startsWith(targetQuery))
      if (prefixMatchedPrompts.length) {
        return prefixMatchedPrompts
      }
      return similarPrompts
    }
    return [];
  }
  static findKeyByTitle(obj, titleValue) {
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (obj[key].title === titleValue) {
          return key;
        }
      }
    }
    return undefined; // 没有找到对应的 key
  }
  static getFuncForAI(funcName,forMinimax = false) {
    let args = {}
    switch (funcName) {
      case "setTitle":
        args.title = this.genArgument("string", "title that should be set for this card, pure text only")
        return this.genStructure(funcName, args,
          "this function is used to set title for a card",
          forMinimax
        )
      case "addComment":
        args.comment = this.genArgument("string", "comment that should be added for this card, pure text only")
        return this.genStructure(funcName, args,
          "this function is used to add a comment for a card",
          forMinimax
        )
      case "addTag":
        args.tag = this.genArgument("string", "tag that should be added for this card, single word only, no hyphen is allowed")
        return this.genStructure(funcName, args,
          "this function is used to add a tag for a card",
          forMinimax
        )
      case "addChildNote":
        args.title = this.genArgument("string", "title for child note, optional")
        args.content = this.genArgument("string", "content for child note, optional")
        return this.genStructure(funcName, args,
          "this function is used to add a child note for a card",
          forMinimax
        )
      case "clearExcerpt":
        return this.genStructure(funcName, args,
          "this function is used to clear the card excerpt, do not pass any argument",
          forMinimax
        )
      case "setExcerpt":
        args.excerpt = this.genArgument("string", "excerpt text to be set")
        return this.genStructure(funcName, args,
          "this function is used to set the card excerpt text",
          forMinimax
        )
      case "copyMarkdownLink":
        args.title = this.genArgument("string", "title for markdown link")
        return this.genStructure(funcName, args,
          "this function can copy the card link in mardown format, just specify the title for this link",
          forMinimax
        )
      case "copyCardURL":
        return this.genStructure(funcName, args,
          "this function can directly copy the card url, do not pass any argument",
          forMinimax
        )
      case "copyText":
        args.text = this.genArgument("string", "pure text that need to be copied")
        return this.genStructure(funcName, args,
          "this function can copy any pure text, but not card link",
          forMinimax
        )
      case "close":
        return this.genStructure(funcName, args,
          "this function is used to end the coversation, do not pass any argument",
          forMinimax
        )
      default:
        break;
    }
  }
// static getFuncForAIForMinimax(funcName) {
//     let args = {}
//     switch (funcName) {
//       case "setTitle":
//         args.title = this.genArgument("string", "title that should be set for this card, pure text only")
//         return this.genStructure(funcName, args,
//           "this function is used to set title for a card",
//           true
//         )
//       case "addComment":
//         args.comment = this.genArgument("string", "comment that should be added for this card, pure text only")
//         return this.genStructure(funcName, args,
//           "this function is used to add a comment for a card",
//           true
//         )
//       case "addTag":
//         args.tag = this.genArgument("string", "tag that should be added for this card, single word only, no hyphen is allowed")
//         return this.genStructure(funcName, args,
//           "this function is used to add a tag for a card",
//           true
//         )
//       case "addChildNote":
//         args.title = this.genArgument("string", "title for child note, optional")
//         args.content = this.genArgument("string", "content for child note, optional")
//         return this.genStructure(funcName, args,
//           "this function is used to add a child note for a card",
//           true
//         )
//       case "clearExcerpt":
//         return this.genStructure(funcName, args,
//           "this function is used to clear the card excerpt, do not pass any argument",
//           true
//         )
//       case "setExcerpt":
//         args.excerpt = this.genArgument("string", "excerpt text to be set")
//         return this.genStructure(funcName, args,
//           "this function is used to set the card excerpt text",
//           true
//         )
//       case "copyMarkdownLink":
//         args.title = this.genArgument("string", "title for markdown link")
//         return this.genStructure(funcName, args,
//           "this function can copy the card link in mardown format, just specify the title for this link",
//           true
//         )
//       case "copyCardURL":
//         return this.genStructure(funcName, args,
//           "this function can directly copy the card url, do not pass any argument",
//           true
//         )
//       case "copyText":
//         args.text = this.genArgument("string", "pure text that need to be copied")
//         return this.genStructure(funcName, args,
//           "this function can copy any pure text, but not card link",
//           true
//         )
//       case "close":
//         return this.genStructure(funcName, args,
//           "this function is used to end the coversation, do not pass any argument",
//           true
//         )
//       default:
//         break;
//     }
//   }
  static getFuncByIndex(indices,isNote = true) {
    let func = ["setTitle","addComment","copyMarkdownLink","copyCardURL","copyText","close","addTag","addChildNote","clearExcerpt","setExcerpt"]
    let disableForSelection = [true,true,true,true,false,false,true,true,true,true]
    if (isNote) {
      let funcStructures = indices.map(ind=>this.getFuncForAI(func[ind]))
      return funcStructures
    }else{
      let funcStructures = indices.filter(ind=>!disableForSelection[ind]).map(ind=>this.getFuncForAI(func[ind]))
      return funcStructures
    }
  }

  static genArgument(type,description) {
    return{ "type": type, "description": description }
  }
  static genStructure(name,args,description,forMinimax = false) {
    let parameters = {
      "type": "object",
      "properties": args,
      "required": Object.keys(args),
    }
    let funcStructure = {
      "name":name,
      "description":description
    }
    if (forMinimax) {
      funcStructure.parameters = JSON.stringify(parameters)
      return {"type":"function","function":funcStructure}
    }
    funcStructure.parameters = parameters
    return {"type":"function","function":funcStructure}
  }
  // static genStructureForMinimax(name,args,description) {
  //   let parameters = {
  //     "type": "object",
  //     "properties": args,
  //     "required": Object.keys(args),
  //   }
  //   let funcStructure = {
  //     "name":name,
  //     "description":description,
  //     "parameters": JSON.stringify(parameters)
  //   }
  //   return {"type":"function","function":funcStructure}
  // }
  
  static getFuncByIndexForMinimax(indices,isNote = true) {
    let func = ["setTitle","addComment","copyMarkdownLink","copyCardURL","copyText","close","addTag","addChildNote","clearExcerpt","setExcerpt"]
    let disableForSelection = [true,true,true,true,false,false,true,true,true,true]
    if (isNote) {
      let funcStructures = indices.map(ind=>this.getFuncForAI(func[ind],true))
      return funcStructures
    }else{
      let funcStructures = indices.filter(ind=>!disableForSelection[ind]).map(ind=>this.getFuncForAI(func[ind],true))
      return funcStructures
    }
  }

  /**
   * 
   * @param {Array} resList 
   */
  static checkToolCalls(resList) {
    // MNUtil.copyJSON(resList)
    try {
    return resList.some(res=>{
        if (res && res.tool_calls && res.tool_calls.length) {
          return true
        }
        return false
      })
    } catch (error) {
      MNUtil.showHUD("Error in checkToolCalls: "+error)
      return false
    }
  }
  /**
   * 
   * @param {String} rawText 
   * @returns {{event:String,data:String}[]}
   */
  static parseEvents(rawText) {
    const lines = rawText.split('\n\n');
    // return lines
    const events = lines.map(line => {
      // 假设每行文本都是以 "event: " 开头，后面跟着事件类型，然后是数据
      const parts = line.split('\n');
      // const eventType = parts[0].split(': ')[1].trim();
      // const eventData = JSON.parse(parts.slice(1).join('\n'));
      let event = parts[0].split(':')[1]
      if (event) {
        let data = parts[1].slice(5)
        return {
          event: event.trim(),
          data: JSON.parse(data)
        };
      }else{
        return {
          event: ""
        };
      }
    });
    return events;
  }
static parseDataChunks(str) {

  const regex = /data:\s*({[\s\S]*?})(?=\s*data:|$)/g;
  const results = [];//role,citation
  let match;
  let usage = {};
  
  while ((match = regex.exec(str)) !== null) {
    // MNUtil.log({message:"match",detail:match})
    try {
      const jsonStr = match[1];
      const data = JSON.parse(jsonStr);
      const delta = data.choices[0]?.delta;
      if (delta) {
        results.push(delta);
      }
      if ("usage" in data) {
        usage = data.usage;
      }
      // results.push(data);
    } catch (e) {
      this.addErrorLog(e, "parseDataChunks")
    }
  }
  // MNUtil.log({message:"parseDataChunks",detail:results})
  if (results.length === 0 && /data:\s/.test(str)) {
    let jsonStr = str.split("data:")[1]
    try {
      let data = this.getValidJSON(jsonStr)
      results.push(data.choices[0]?.delta)
      const delta = data.choices[0]?.delta;
      if (delta) {
        results.push(delta);
      }
      if ("usage" in data) {
        usage = data.usage;
      }
    } catch (error) {
      this.addErrorLog(error, "parseFirstDataChunk",jsonStr)
    }
  }
  return {results:results,usage:usage};
}
  static parseData(originalText) {
  // 按行分割输入
  const lines = originalText.split('\n');

  // 初始化结果数组和缓冲区
  let result = [];
  let buffer = '';

  // 遍历每一行
  lines.forEach(line => {
    // 如果行以 "data:" 开头，表示可能是新的 JSON 块
    if (line.startsWith('data: ')) {
      // 将当前缓冲区的内容尝试解析
      buffer += line.slice(6);
    } else {
      //仅在缓冲区非空时进行拼接,即存在未成功解析的文本,有可能是错误按换行符切分的后果
      if (buffer.trim() && line.trim()) {
        buffer += (`\n`+line);
        // MNUtil.copy(buffer)
      }else{
        //如果上一行已经成功解析,但是又碰到非data开头的行,则忽略
        return
      }
    }
    if (buffer) {
      try {
        const jsonData = JSON.parse(buffer.trim());
        const content = jsonData.choices[0]?.delta?.content;
        if (content) {
          result.push(content);
        }
        buffer = '';//解析成功后清空缓存区
      } catch (error) {
        // 如果解析失败，忽略该缓冲区（可能是无效数据）
        chatAIUtils.addErrorLog(error, "parseData", buffer)
        // console.error('JSON 解析失败:', buffer.trim(), error);
      }
    }
  });

  // 处理最后一个缓冲区
  if (buffer) {
    try {
      const jsonData = JSON.parse(buffer.trim());
      const content = jsonData.choices[0]?.delta?.content;
      if (content) {
        result.push(content);
      }
    } catch (error) {
      console.error('JSON 解析失败:', buffer.trim(), error);
    }
  }

  // 拼接结果内容并返回
  return result;
}
  static codifyToolCall(funcName,args) {
    switch (funcName) {
    case "multi_tool_use.parallel":
      let preFix = `multi_tool_use(\n`
      let tool_uses = args.tool_uses
      let toolMessages = []
      tool_uses.map((tool_use,index)=>{
        switch (tool_use.recipient_name) {
          case "functions.setTitle":
            toolMessages.push("\t"+this.codifyToolCall("setTitle", {title:tool_use.parameters.title.trim()}))
            break;
          case "functions.addComment":
            toolMessages.push("\t"+this.codifyToolCall("addComment", {comment:tool_use.parameters.comment.trim()}))
            break;
          case "functions.addTag":
            toolMessages.push("\t"+this.codifyToolCall("addTag", {tag:tool_use.parameters.tag.trim()}))
            break;
          case "functions.copyMarkdownLink":
            toolMessages.push("\t"+this.codifyToolCall("copyMarkdownLink", {title:tool_use.parameters.title.trim()}))
            break;
          case "functions.copyCardURL":
            toolMessages.push("\t"+this.codifyToolCall("copyCardURL", {}))
            break;
          case "functions.copyText":
            toolMessages.push("\t"+this.codifyToolCall("copyText", {text:tool_use.parameters.text.trim()}))
            break;
          case "functions.addChildNote":
            toolMessages.push("\t"+this.codifyToolCall("addChildNote", {title:tool_use.parameters.title.trim(),content:tool_use.parameters.content.trim()}))
            break;
          case "functions.clearExcerpt":
            toolMessages.push("\t"+this.codifyToolCall("clearExcerpt", {}))
            break;
          case "functions.close":
            toolMessages.push("\t"+this.codifyToolCall("close", {}))
            break;
          case "functions.setExcerpt":
            toolMessages.push("\t"+this.codifyToolCall("setExcerpt", {excerpt:tool_use.parameters.excerpt.trim()}))
            break
          default:
            break;
        }
      })
      return preFix+toolMessages.join("")+")\n"
    default:
      return chatAITool.getToolByName(funcName).codifyToolCall(args)
  }
  }
  static safeJsonParse(jsonString) {
    try {
        // 处理字符串中的反斜杠，确保 JSON 解析不会失败
        return jsonString.replace(/\\([^u])/g, '\\\\$1');;
    } catch (e) {
        return null; // 如果解析失败，返回 null 或其他默认值
    }
}
static parseTime = []
static preResults = []
/** 
 * 用来格式化调用的函数内容的
 * @param {String} originalText
 * @param {Boolean} checkToolCalls
 */
  static parseResponse(originalText,checkToolCalls) {
  try {
    // let beginTime = Date.now()
    let response = {}
    // this.parseTime.push(MNUtil.UUID())
    // let tem = this.parseTime.join("\n")
    // return {response:tem}
    let resList = this.parseDataChunks(originalText)
    if (resList.usage) {
      response.usage = resList.usage
    }
    // if (this.preResults && this.preResults.length && resList.results) {
    //   this.preResults = this.preResults.concat(resList.results)
    // }else{
    //   this.preResults = resList.results
    // }
    let results = resList.results
    // let results = this.preResults
    // MNUtil.copy(results)
    if (!results.length) {
      // MNUtil.showHUD("No response")
      return undefined
    }
    // MNUtil.copyJSON(resList)
    // return
    if (checkToolCalls && this.checkToolCalls(results)) {
      let funcs = []
      results.map(res=>{
        if (res.tool_calls && res.tool_calls.length) {
          if (res.tool_calls[0].function.name) {
            funcs.push(res.tool_calls[0])
          }else{
            let index = res.tool_calls[0].index ?? 0
            if (!funcs[index]) {
              funcs[index] = {function:{name:"unknownFunction",arguments:"",index:index}}
            }
            if (funcs[index].function.arguments) {
              funcs[index].function.arguments = funcs[index].function.arguments+res.tool_calls[0].function.arguments
            }else{
              funcs[index].function.arguments = res.tool_calls[0].function.arguments
            }
          }
          // return delta.tool_calls[0].function.arguments
        }else{
          return ""
        }
      }).join("")
      // MNUtil.copyJSON(funcs)
      // return
      let funcList = []
      // MNUtil.copy(funcs)
      let funcResponses = funcs.map(func=>{
        let arg = func.function.arguments
        // MNUtil.copyJSON(JSON.parse("{\"title\": \"排放变化特征分析\"}{\"title\": \"排放变化特征分析\"}"))
        if (arg) {
          let args = this.getValidJSON(arg.trim())
          if (!args) {
            args = this.getValidJSON(this.safeJsonParse(arg.trim()))
          }
          func.function.arguments = JSON.stringify(args)
          if (args) {
            funcList.push(func)
            return this.codifyToolCall(func.function.name, args)
          }else{
            func.function.arguments = ""
            funcList.push(func)
            return func.function.name+"()\n"
          }
        }else{
            func.function.arguments = ""
            funcList.push(func)
            return func.function.name+"()\n"
        }
      })
      response.funcResponse = funcResponses.join("")
      response.funcList = funcList
    }
    response.response = results.map(res=>{
      if (res && res.content) {
        return res.content
      }
      return ""
    }).join("").trim()
    response.response = response.response.trim()
      .replace(/\$\$/g, '\n$$$\n')
      .replace(/(\\\[)|(\\\])/g, '$$$') // Replace display math mode delimiters
      .replace(/(\\\(\s?)|(\s?\\\))/g, '$') // Replace inline math mode opening delimiter
    response.reasoningResponse = results.map(res=>{
      if (res) {
        if (res.reasoning_content) {
          return res.reasoning_content
        }
        if (res.reasoning) {
          return res.reasoning
        }
      }
      return ""
    }).join("").trim()

    if (!response.reasoningResponse && response.response) {
      if (/^<think>/.test(response.response)) {
        let tem = response.response.split("</think>")
        if (tem.length > 1) {
          response.response = tem[1]
        }else{
          response.response = ""
        }
        response.reasoningResponse = tem[0].replace("<think>","").trim()
      }else if (/^<thought>/.test(response.response)) {
        let tem = response.response.split("</thought>")
        if (tem.length > 1) {
          response.response = tem[1]
        }else{
          response.response = ""
        }
        response.reasoningResponse = tem[0].replace("<thought>","").trim()
      }
      // else if(/^###Thinking/.test(response.response)){
      //   let tem = response.response.split("###Response")
      //   if (tem.length > 1) {
      //     response.response = tem[1]
      //   }else{
      //     response.response = ""
      //   }
      //   response.reasoningResponse = tem[0].replace("###Thinking","").trim()
      // }
    }
    //适配秘塔搜索
    response.citations = undefined
    results.map(res=>{
      if (res && res.citations) {
        response.citations = res.citations
        // response.citations.push(res.citations)
      }
    })
      // MNUtil.log({message:"res",detail:results})
    if (response.citations) {
      //将响应内容中的[[num]]替换为对应的citation，num为数字，从1开始
      response.response = response.response.replace(/\[\[([0-9]+)\]\]/g,(match,p1)=>{
        let num = parseInt(p1)
        let citation = response.citations[num-1]
        //根据引用的title和link构建markdown链接
        return `[{${num}}](${citation.link})`
      })
      // MNUtil.log({message:"citations",detail:response.citations})
    }
    // MNUtil.copy(response)
    // let endTime = Date.now()
    // this.parseTime.push(endTime - beginTime)
    // MNUtil.copyJSON(this.parseTime)
    return response
  } catch (error) {
    this.addErrorLog(error, "parseResponse")
    return {}
  }
  }
/**
 * 安全地全局替换字符串中所有匹配项
 * @param {string} originalStr - 原始字符串
 * @param {string} searchValue - 要查找的内容
 * @param {string} replacement - 替换内容
 * @returns {string} 替换后的新字符串
 */
static safeReplaceAll(originalStr, searchValue, replacement) {
  // 空搜索值直接返回原字符串
  if (!searchValue) return originalStr;
  
  // 尝试使用replaceAll()实现
  if (typeof originalStr.replaceAll === 'function') {
    return originalStr.replaceAll(searchValue, replacement);
  }

  // 降级方案：转义正则特殊字符并全局替换
  const escapedValue = searchValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escapedValue, 'g');
  return originalStr.replace(regex, replacement);
}

  static html(string) {
    return `<!doctype html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Marked.js</title>
    <style>
  p {
    max-width: 385px;
    margin-top: 0;
  }
  pre {
    background-color: #343541;
    color: white;
    border-radius: 5px;
    max-width: 400px;
    overflow-x: scroll;
    margin-top: 0;
    margin-bottom: 5px;
  }
  img {
    max-width: 385px;
  }
.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
}
.code-header button {
  margin-left: auto; /* 这将推动按钮到容器的右边 */
}
pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em
}
code.hljs {
  padding: 3px 5px
}
/*!
  Theme: GitHub Dark
  Description: Dark theme as seen on github.com
  Author: github.com
  Maintainer: @Hirse
  Updated: 2021-05-15

  Outdated base version: https://github.com/primer/github-syntax-dark
  Current colors taken from GitHub's CSS
*/
.hljs {
  color: #c9d1d9;
  background: #000000
}
.hljs-doctag,
.hljs-keyword,
.hljs-meta .hljs-keyword,
.hljs-template-tag,
.hljs-template-variable,
.hljs-type,
.hljs-variable.language_ {
  /* prettylights-syntax-keyword */
  color: #ff7b72
}
.hljs-title,
.hljs-title.class_,
.hljs-title.class_.inherited__,
.hljs-title.function_ {
  /* prettylights-syntax-entity */
  color: #d2a8ff
}
.hljs-attr,
.hljs-attribute,
.hljs-literal,
.hljs-meta,
.hljs-number,
.hljs-operator,
.hljs-variable,
.hljs-selector-attr,
.hljs-selector-class,
.hljs-selector-id {
  /* prettylights-syntax-constant */
  color: #79c0ff
}
.hljs-regexp,
.hljs-string,
.hljs-meta .hljs-string {
  /* prettylights-syntax-string */
  color: #a5d6ff
}
.hljs-built_in,
.hljs-symbol {
  /* prettylights-syntax-variable */
  color: #ffa657
}
.hljs-comment,
.hljs-code,
.hljs-formula {
  /* prettylights-syntax-comment */
  color: #8b949e
}
.hljs-name,
.hljs-quote,
.hljs-selector-tag,
.hljs-selector-pseudo {
  /* prettylights-syntax-entity-tag */
  color: #7ee787
}
.hljs-subst {
  /* prettylights-syntax-storage-modifier-import */
  color: #c9d1d9
}
.hljs-section {
  /* prettylights-syntax-markup-heading */
  color: #1f6feb;
  font-weight: bold
}
.hljs-bullet {
  /* prettylights-syntax-markup-list */
  color: #f2cc60
}
.hljs-emphasis {
  /* prettylights-syntax-markup-italic */
  color: #c9d1d9;
  font-style: italic
}
.hljs-strong {
  /* prettylights-syntax-markup-bold */
  color: #c9d1d9;
  font-weight: bold
}
.hljs-addition {
  /* prettylights-syntax-markup-inserted */
  color: #aff5b4;
  background-color: #033a16
}
.hljs-deletion {
  /* prettylights-syntax-markup-deleted */
  color: #ffdcd7;
  background-color: #67060c
}
.hljs-char.escape_,
.hljs-link,
.hljs-params,
.hljs-property,
.hljs-punctuation,
.hljs-tag {
  /* purposely ignored */
}
  </style>
  </head>
  <body contenteditable="true">${string}<script>
  // window.scrollTo(0,document.body.scrollHeight);

      MathJax = {
          tex: {
              inlineMath: [ ['$','$'], ["\\(","\\)"] ]
          }
      };
      var originalBodyContent = ""
      var isBodyEdited = false;
      document.addEventListener('input', function () {
        isBodyEdited = true;
      });
      function getSelectedTextOrPageText() {
          var selectedText = window.getSelection().toString();
          if (selectedText && selectedText.trim() !== '') {
              return selectedText;
          } else if (isBodyEdited){
              var body = document.body;
              var pageText = body.innerText || body.textContent;
              return pageText.trim();
          } else {
            return ""
          }
      }
      function copyToClipboard(uuid) {
        // 获取代码块的文本内容
        var code = document.getElementById(uuid).innerText;
        // 创建临时的textarea来选择文本
        var dummy = document.createElement('textarea');
        // 将代码块的文本内容赋值到textarea
        dummy.value = code;
        document.body.appendChild(dummy);
        // 选择textarea中的内容
        dummy.select();
        // 执行复制命令
        document.execCommand('copy');
        // 移除临时创建的textarea
        document.body.removeChild(dummy);
      }
  </script>
  <script id="MathJax-script" async src="https://vip.123pan.cn/1836303614/dl/cdn/es5/tex-svg-full.js"></script>
  </body>
  </html>`
  }
  static sum(array) {
    let sum = 0
    for (let i = 0; i < array.length; i++) {
      sum = sum+array[i]
    }
    return sum
  }
  static getTranslation(gesture){
    let locationToMN = gesture.locationInView(MNUtil.studyView)
    if (!gesture.moveDate) {
      gesture.moveDate = 0
    }
    if ((Date.now() - gesture.moveDate) > 100) {
      let translation = gesture.translationInView(MNUtil.studyView)
      let location2Button = gesture.locationInView(gesture.view)
      // if (gesture.state !== 3 && Math.abs(translation.y)<20 && Math.abs(translation.x)<20) {
      if (gesture.state === 1) {
        gesture.location2Button = {x:location2Button.x-translation.x,y:location2Button.y-translation.y}
        // MNUtil.showHUD(JSON.stringify(gesture.location2Button))
      }
    }
    // MNUtil.showHUD(JSON.stringify(locationToMN))
    if (locationToMN.x <= 0) {
      locationToMN.x = 0
    }
    if (locationToMN.x > MNUtil.studyView.frame.width) {
      locationToMN.x = MNUtil.studyView.frame.width
    }
    gesture.moveDate = Date.now()
    // let location = {x:locationToMN.x - self.locationToButton.x-gesture.view.frame.x,y:locationToMN.y -self.locationToButton.y-gesture.view.frame.y}
    let location = {x:locationToMN.x - gesture.location2Button.x,y:locationToMN.y -gesture.location2Button.y}
    if (location.y <= 0) {
      location.y = 0
    }
    if (location.y>=MNUtil.studyView.frame.height-15) {
      location.y = MNUtil.studyView.frame.height-15
    }
    return location
  }
  static getNewLoc(gesture,referenceView = MNUtil.studyView){
  try {

    let locationToMN = gesture.locationInView(referenceView)
    // if (!gesture.moveDate) {
    //   gesture.moveDate = 0
    // }
    // if ((Date.now() - gesture.moveDate) > 100) {
      let translation = gesture.translationInView(referenceView)
      let locationToBrowser = gesture.locationInView(gesture.view.superview)
      // if (gesture.state !== 3 && Math.abs(translation.y)<20 && Math.abs(translation.x)<20) {
      if (gesture.state === 1) {
        gesture.locationToBrowser = {x:locationToBrowser.x-translation.x,y:locationToBrowser.y-translation.y}
        // MNUtil.showHUD(JSON.stringify(gesture.locationToBrowser))
      }
      if (gesture.state === 2) {
        // gesture.locationToBrowser = {x:locationToBrowser.x-translation.x,y:locationToBrowser.y-translation.y}
        // gesture.locationToBrowser = {x:locationToBrowser.x,y:locationToBrowser.y}
      }
    // }
    // MNUtil.showHUD(JSON.stringify(locationToMN))
    if (locationToMN.x <= 0) {
      locationToMN.x = 0
    }
    if (locationToMN.x > referenceView.frame.width) {
      locationToMN.x = referenceView.frame.width
    }
    // gesture.moveDate = Date.now()
    // let location = {x:locationToMN.x - self.locationToButton.x-gesture.view.frame.x,y:locationToMN.y -self.locationToButton.y-gesture.view.frame.y}
    let location = {x:locationToMN.x - gesture.locationToBrowser.x,y:locationToMN.y -gesture.locationToBrowser.y}
    // let location = {x:locationToMN.x + translation.x,y:locationToMN.y + translation.y}
    if (location.y <= 0) {
      location.y = 0
    }
    if (location.y>=referenceView.frame.height-15) {
      location.y = referenceView.frame.height-15
    }
    return location
    
  } catch (error) {
    this.addErrorLog(error, "getNewLoc","gestureState:"+gesture.state)
    return undefined
  }
  }
  /**
   * 
   * @param {string} fullPath 
   * @returns {string}
   */
  static getExtensionFolder(fullPath) {
      // 找到最后一个'/'的位置
      let lastSlashIndex = fullPath.lastIndexOf('/');
      // 从最后一个'/'之后截取字符串，得到文件名
      let fileName = fullPath.substring(0,lastSlashIndex);
      return fileName;
  }
  static checkMNUtilsFolder(fullPath){
    let extensionFolder = this.getExtensionFolder(fullPath)
    let folderExist = NSFileManager.defaultManager().fileExistsAtPath(extensionFolder+"/marginnote.extension.mnutils/main.js")
    if (!folderExist) {
      this.showHUD("MN ChatAI: Please install 'MN Utils' first!",5)
    }
    return folderExist
  }
  static checkCouldAsk(){
      if (this.notifyController.view.hidden) {
        //如果界面都隐藏了，那肯定可以启动
        this.notifyController.onChat = false
        return true
      }
      //如果请求还没结束，或者在聊天模式，则不允许发起对话
      if (this.notifyController.onChat) {
        MNUtil.showHUD("On Chat Mode")
        // this.ensureView(this.notifyController.view)
        this.ensureViewInCurrentWindow(this.notifyController.view)
        this.notifyController.view.hidden = false
        return false
      }
      if (this.notifyController.connection) {
        MNUtil.showHUD("On Output...")
        return false
      }
    // }
      return true
  }
  /**
   * 
   * @param {UIView} view 
   */
  static ensureView(view){
    if (!MNUtil.isDescendantOfStudyView(view)) {
      view.hidden = true
      MNUtil.studyView.addSubview(view)
      this.forceToRefresh = true
    }
  }
  /**
   * 
   * @param {UIView} view 
   */
  static ensureViewInCurrentWindow(view){
    if (!view.isDescendantOfView(MNUtil.currentWindow)) {
      view.hidden = true
      MNUtil.currentWindow.addSubview(view)
      this.forceToRefresh = true
    }
  }
  static getLocalBufferFromImageData(imageData){
    let base64 = imageData.base64Encoding()
    let md5 = chatAIUtils.MD5(base64)
    let fileName = "local_"+md5+".png"
    if (!imageData) {
      return fileName
    }
    if (MNUtil.isfileExists(chatAIConfig.mainPath+"/"+fileName)) {
      //do nothing
    }else{
      imageData.writeToFileAtomically(chatAIConfig.mainPath+"/"+fileName, false)
    }
    return fileName
  }
  static isNSNull(obj){
    return (obj === NSNull.new())
  }
  /**
   * 
   * @param {NSData} imageData 
   */
  static getURLFromImageData(imageData,compression = false){
    if (compression) {
      let compressedImageData = UIImage.imageWithData(imageData).jpegData(0.0)
      return "data:image/jpeg;base64,"+compressedImageData.base64Encoding()
    }
    return "data:image/png;base64,"+imageData.base64Encoding()
  }
  static replaceBase64ImagesWithTemplate(markdown) {
  try {
    // 匹配 base64 图片链接的正则表达式
    const base64ImagePattern = /!\[.*?\]\((data:image\/png;base64,.*?)(\))/g;
    // 处理 Markdown 字符串，替换每个 base64 图片链接
    const result = markdown.replace(base64ImagePattern, (match, base64Str,p2) => {
      return match.replace(base64Str, "{{iamge}}");
    });
  return result;
} catch (error) {
  editorUtils.addErrorLog(error, "replaceBase64ImagesWithR2")
  return undefined
}
}
  /**
   * 
   * @param {string} context 
   * @param {NSData|NSData[]} imageData 
   * @returns 
   */
  static genUserMessage(context,imageData){
    let compression = chatAIConfig.getConfig("imageCompression")
    if (imageData) {
      let imageDatas
      if (Array.isArray(imageData)) {
        imageDatas = imageData
      }else{
        imageDatas = [imageData]
      }
      let content = [
          {
            "type": "text",
            "text": context
          }
      ]
      imageDatas.forEach((data,index)=>{
        content.push({
          "type": "image_url",
          "image_url": {
            "url" : this.getURLFromImageData(data,compression)
          }
        })
      })
      return {
        role: "user", 
        content: content
      }
    }else{
      return {role: "user", content: context}
    }
  }
  static genAssistantMessage(content=undefined,tool_calls = undefined,reasoningContent = undefined){
    let message = {
      role: "assistant",
    }
    if (content) {
      message.content = content
    }
    if (tool_calls) {
      message.tool_calls = tool_calls
    }
    if (reasoningContent) {
      message.reasoningContent = reasoningContent
    }
    return message
  }
  static findToc(md5,excludeNotebookId=undefined){
    let allNotebooks = this.allStudySets().filter(notebook=>{
      if (excludeNotebookId && notebook.notebookId === excludeNotebookId) {
        return false
      }
      if (notebook.options && "bookGroupNotes" in notebook.options && notebook.options.bookGroupNotes[md5]) {
        let target = notebook.options.bookGroupNotes[md5]
        if ("tocNoteIds" in target) {
          return true
        }
      }
      return false
    })
    if (allNotebooks.length) {
      let targetNotebook = allNotebooks[0]
      let target = targetNotebook.options.bookGroupNotes[md5].tocNoteIds
      let tocNotes = target.map(noteId=>{
        return MNNote.new(noteId)
      })
      return tocNotes
    }else{
      return undefined
    }
  }
  /**
   * 
   * @param {string} md5 
   * @param {string} notebookId 
   * @returns {MNNote[]}
   */
  static getDocTocNotes(md5=MNUtil.currentDocmd5,notebookId=MNUtil.currentNotebookId){
    let notebook = MNUtil.getNoteBookById(notebookId)
    if (notebook.options && "bookGroupNotes" in notebook.options && notebook.options.bookGroupNotes[md5] && "tocNoteIds" in notebook.options.bookGroupNotes[md5]) {
      let target = notebook.options.bookGroupNotes[md5]
      let tocNotes = target.tocNoteIds.map(noteId=>{
        return MNNote.new(noteId)
      })
      // tocNotes[0].focusInDocument()
      return tocNotes
    }else{//在其他笔记本中查找
      return this.findToc(md5,notebookId)
    }

  }
  /**
   * 
   * @param {string|MNNote} noteid 
   * @param {boolean} OCR_enabled 
   * @returns 
   */
  static async genCardStructure (noteid,OCR_enabled=false) {
  let hasImage = false
  let cardStructure = {}
  let note = undefined
  if (MNUtil.typeOf(noteid) === "MNNote") {
    note = noteid
  }else{
    note = MNNote.new(noteid)
  }
  if (note.noteTitle && note.noteTitle !== "") {
    cardStructure.title = note.noteTitle
  }
  if (note.excerptPic && !note.textFirst) {
    if (this.isBlankNote(note)) {
      hasImage = false
    }else{
      hasImage = true
    }
  }
  if (OCR_enabled && note.excerptPic && !note.textFirst) {
    cardStructure.content = await chatAINetwork.getTextOCR(MNUtil.getMediaByHash(note.excerptPic.paint))
    // hasImage = true
  }else if (this.noteHasExcerptText(note)){
    if (hasImage) {
      cardStructure.content = "{{image}}"
    }else{
      cardStructure.content = chatAIUtils.replaceBase64ImagesWithTemplate(note.excerptText)
    }
  }
  if (note.linkedNotes?.length) {
    cardStructure.linkedNoteIds = note.linkedNotes.map((linkedNote)=>{
      return linkedNote.noteid
    })
  }
  if (note.comments.length) {
    let comments = []
    for (let i = 0; i < note.comments.length; i++) {
      const comment = note.comments[i];
      switch (comment.type) {
        case "TextNote":
          if (/^marginnote\dapp:\/\//.test(comment.text)) {
          }else{
            comments.push(comment.text)
          }
          break
        case "HtmlNote":
          comments.push(comment.text)
          break
        case "LinkNote":
          if (OCR_enabled && comment.q_hpic && !note.textFirst) {
            comments.push(await chatAINetwork.getTextOCR(MNUtil.getMediaByHash(comment.q_hpic.paint)))
          }else{
            comments.push(comment.q_htext)
          }
          break
        case "PaintNote":
          if (comment.paint) {
            hasImage = true
          }
          if (OCR_enabled && comment.paint){
            comments.push(await chatAINetwork.getTextOCR(MNUtil.getMediaByHash(comment.paint)))
          }
          break
        default:
          break
      }
    }
    if (comments.length) {
      if (comments.length === 1) {
        cardStructure.comment = comments[0]
      }else{
        cardStructure.comments = comments
      }
    }
  }
  cardStructure.id = note.noteId
  cardStructure.url = "marginnote4app://note/"+note.noteId
  if (note.parentNote) {
    cardStructure.parentId = note.parentNote.noteId
  }
  if (note.colorIndex !== undefined) {
    cardStructure.color = note.color
  }
  if (note.notebookId) {
    let notebook = MNUtil.getNoteBookById(note.notebookId)
    cardStructure.notebook = notebook.title
  }
  if (note.tags && note.tags.length) {
    cardStructure.tags = note.tags
  }
  return cardStructure
}
/**
   * 
   * @param {string|MNNote} noteid 
   * @returns 
   */
  static genCardStructureForSearch (noteid) {
  let cardStructure = {}
  let note = undefined
  if (MNUtil.typeOf(noteid) === "MNNote") {
    note = noteid
  }else{
    note = MNNote.new(noteid)
  }
  cardStructure.content = note.allNoteText()
  cardStructure.id = note.noteId
  return cardStructure
}
  static stringifyCardStructure(cardStructure){
    switch (typeof cardStructure) {
      case "string":
        return cardStructure
      case "object":
        if (!Object.keys(cardStructure).length) {
          MNUtil.showHUD("No text in note/card!")
          return undefined
        }
        return JSON.stringify(cardStructure,null,2)
      default:
        return undefined
    }
  }
  static addErrorLog(error,source,info){
    MNUtil.showHUD("MN ChatAI Error ("+source+"): "+error)
    let tem = {source:source,time:(new Date(Date.now())).toString()}
    if (error.detail) {
      tem.error = {message:error.message,detail:error.detail}
    }else{
      tem.error = error.message
    }
    if (info) {
      tem.info = info
    }
    this.errorLog.push(tem)
    MNUtil.copy(this.errorLog)
    if (typeof MNUtil.log !== 'undefined') {
      MNUtil.log({
        source:"MN ChatAI",
        level:"error",
        message:source,
        detail:tem,
      })
    }
  }
  static checkLogo(){
    if (typeof MNUtil === 'undefined') return false
    if (typeof toolbarConfig !== 'undefined' && toolbarConfig.addonLogos && ("MNChatAI" in toolbarConfig.addonLogos) && !toolbarConfig.addonLogos["MNChatAI"]) {
        return false
    }
    return true
  }
  static extractJSONFromMarkdown(markdown) {
    // 使用正则表达式匹配被```JSON```包裹的内容
    const regex = /```JSON([\s\S]*?)```/g;
    const matches = regex.exec(markdown);
    
    // 提取匹配结果中的JSON字符串部分，并去掉多余的空格和换行符
    if (matches && matches[1]) {
        const jsonString = matches[1].trim();
        return jsonString;
    } else {
        return undefined;
    }
  }
    /**
   * 
   * @param {string} title 
   * @param {string} subTitle 
   * @param {string[]} items 
   * @returns {Promise<{input:string,button:number}>}
   */
  static input(title,subTitle,items) {
    return new Promise((resolve, reject) => {
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        title,subTitle,3,items[0],items.slice(1),
        (alert, buttonIndex) => {
          let res = {input:alert.textFieldAtIndex(0).text,button:buttonIndex}
          resolve(res)
        }
      )
    })
  }
 static moveElement(arr, element, direction) {
      // 获取元素的索引
      var index = arr.indexOf(element);
      if (index === -1) {
          this.showHUD('Element not found in array');
          return;
      }
      switch (direction) {
          case 'up':
              if (index === 0) {
                  this.showHUD('Element is already at the top');
                  return;
              }
              // 交换元素位置
              [arr[index], arr[index - 1]] = [arr[index - 1], arr[index]];
              break;
          case 'down':
              if (index === arr.length - 1) {
                  this.showHUD('Element is already at the bottom');
                  return;
              }
              // 交换元素位置
              [arr[index], arr[index + 1]] = [arr[index + 1], arr[index]];
              break;
          case 'top':
              // 移除元素
              arr.splice(index, 1);
              // 添加到顶部
              arr.unshift(element);
              break;
          case 'bottom':
              // 移除元素
              arr.splice(index, 1);
              // 添加到底部
              arr.push(element);
              break;
          default:
              this.showHUD('Invalid direction');
              break;
      }
  }
  /**
   * 
   * @param {number} value 
   * @param {number} min 
   * @param {number} max 
   * @returns {number}
   */
  static constrain(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }
  static openSideOutput(){
    if (chatAIUtils.isMN3()) {
      MNUtil.showHUD("Only available in MN4+")
      return
    }
    if (!this.sideOutputController) {
        this.sideOutputController = sideOutputController.new();
        MNUtil.toggleExtensionPanel()
        MNExtensionPanel.show()
        MNExtensionPanel.addSubview("chatAISideOutputView", this.sideOutputController.view)
        let panelView = MNExtensionPanel.view
        this.sideOutputController.view.hidden = false
        this.sideOutputController.view.frame = {x:0,y:0,width:panelView.frame.width,height:panelView.frame.height}
        this.sideOutputController.currentFrame = {x:0,y:0,width:panelView.frame.width,height:panelView.frame.height}
        // MNUtil.toggleExtensionPanel()
    }else{
      MNExtensionPanel.show("chatAISideOutputView")
    }
  }
  static isMN4(){
    return MNUtil.appVersion().version == "marginnote4"
  }
  static isMN3(){
    return MNUtil.appVersion().version == "marginnote3"
  }
  /**
   * 
   * @param {MNNote} focusNote 
   * @param {string} text 
   * @returns 
   */
  static async insertBlank(focusNote,text){
  try {

    if (!MNUtil.docMapSplitMode) {
      MNUtil.studyController.docMapSplitMode = 1
      // MNUtil.showHUD("❌ Unspported in full map mode")
      await MNUtil.delay(0.2)
    }
    // focusNote = focusNote.originNote
    focusNote.focusInDocument()
    await MNUtil.delay(0.1)
    MNUtil.excuteCommand("InsertBlank")
    await MNUtil.delay(0.2)
    let comments = MNComment.from(focusNote)
    // MNUtil.copy(comments)
    let comment = comments.findLast(c=>c.type==="blankTextComment" || c.type==="blankImageComment")
    if (comment) {
      let note = comment.note
      MNUtil.undoGrouping(()=>{
        note.excerptText = text
        note.excerptTextMarkdown = true
        note.textFirst = true
      })
    }else{
      await MNUtil.delay(0.2)
      let comments = MNComment.from(focusNote)
      let comment = comments.findLast(c=>c.type==="blankTextComment" || c.type==="blankImageComment")
      if (comment) {
        let note = comment.note
        MNUtil.undoGrouping(()=>{
          note.excerptText = text
          note.excerptTextMarkdown = true
          note.textFirst = true
        })
      }else{
        MNUtil.showHUD("❌ Failed to insert blank")
      }
    }
    // await MNUtil.delay(1)
    // let tem = MNComment.from(focusNote)
    // MNUtil.copy(tem)
    
  } catch (error) {
    chatAIUtils.addErrorLog(error, "chatAIUtils.insertBlank")
  }
  }
  static hasNoteDoc(vars){
    if (vars.includes("note.doc.content")) {
      return true
    }
    if (vars.includes("note.parent.doc.content")) {
      return true
    }
    if (vars.includes("note.parent.parent.doc.content")) {
      return true
    }
    if (vars.includes("note.parent.parent.parent.doc.content")) {
      return true
    }
  }
  static getParentLevel(vars){
    if (vars.some(v=>v.includes("note.parent.parent.parent."))) {
      return 3
    }
    if (vars.some(v=>v.includes("note.parent.parent."))) {
      return 2
    }
    if (vars.some(v=>v.includes("note.parent."))) {
      return 1
    }
    return 0
  }
  static hasChild(vars){
    if (vars.some(v=>v.includes("note.child"))) {
      return true
    }
    return false
  }
  static hasNote(vars){
    if (vars.some(v=>v.includes("note."))) {
      return true
    }
    return false
  }
  /**
   * 
   * @param {string[]} vars 
   * @returns 
   */
  static getNoteInfo(vars){
    //parentLevel为最高的一个
    let noteInfo = {hasNote:false,hasChildMindMap:false,hasParent:false,hasChild:false,parentLevel:0,hasNoteDoc:false}
    vars.map(v=>{
      if (v.startsWith("note.")) {
        noteInfo.hasNote = true//只要有一个变量带note就行
        if (v.startsWith("note.doc.content")) {
          noteInfo.hasNoteDoc = true
        }
        if (v.startsWith("note.childMindMap.")) {
          noteInfo.hasChildMindMap = true
          if (v.startsWith("note.childMindMap.doc.content")) {
            noteInfo.hasNoteDoc = true
          }
        }
        if (v.startsWith("note.parent.")) {
          noteInfo.hasParent = true
          if (v.startsWith("note.parent.parent.parent.")) {
            noteInfo.parentLevel = 3
            if (v.startsWith("note.parent.parent.parent.doc.content")) {
              noteInfo.hasNoteDoc = true
            }
          }else if (v.startsWith("note.parent.parent.")) {
            if (noteInfo.parentLevel !== 3) {//如果为3则不覆盖
              noteInfo.parentLevel = 2
            }
            if (v.startsWith("note.parent.parent.doc.content")) {
              noteInfo.hasNoteDoc = true
            }
          }else {
            if (noteInfo.parentLevel < 2) {//如果小于2则不覆盖
              noteInfo.parentLevel = 1
            }
            if (v.startsWith("note.parent.doc.content")) {
              noteInfo.hasNoteDoc = true
            }
          }
        }
        if (v.startsWith("note.child.")) {
          noteInfo.hasChild = true
        }
      }
    })
    return noteInfo
  }
  static parseVars(template){
  try {

    let tokens = mustache.parse(template)
    var pipelineRe = /\|\>?/;
    let vars = []
    function getChildToken(ele) {
      if (ele[0] !== "text") {
        let res = ele[1].split(pipelineRe)
        vars.push(res[0].trim())
      }
      if (ele.length > 4) {
        let newLevel = ele[4]
        if (Array.isArray(newLevel)) {
          newLevel.map(n=>{
            getChildToken(n)
          })
        }
      }
    }
    tokens.map((t)=>{
      getChildToken(t)
    })
    // MNUtil.copy(vars)
    // MNUtil.log({message:"vars",detail:vars})
    let config = {
      vars:MNUtil.unique(vars),
      hasContext:vars.includes("context"),
      hasOCR:vars.includes("textOCR"),
      hasCard:vars.includes("card"),
      hasCardOCR:vars.includes("cardOCR"),
      hasCards:vars.includes("cards"),
      hasCardsOCR:vars.includes("cardsOCR"),
      hasNotesInMindmap:vars.includes("notesInMindmap"),
      hasParentCard:vars.includes("parentCard"),
      hasParentCardOCR:vars.includes("parentCardOCR"),
      hasUserInput:vars.includes("userInput"),
      hasCurrentDocInfo:vars.includes("currentDocInfo"),
      hasCurrentPageInfo:vars.includes("hasCurrentPageInfo"),
      hasCurrentDocContent:vars.includes("currentDoc.content"),
      hasNoteDocInfo:vars.includes("noteDocInfo"),
      hasNoteDocAttach:vars.includes("noteDocAttach"),
      hasCurrentDocAttach:vars.includes("currentDocAttach"),
      hasClipboardText:vars.includes("clipboardText"),
      hasSelectionText:vars.includes("selectionText"),
      hasKnowledge:vars.includes("knowledge"),
      hasCurrentDocName:vars.includes("currentDocName"),
      noteInfo:this.getNoteInfo(vars),
      hasMindmapNotes:vars.includes("mindmap.allNotes"),
      hasMindmapFocusNotes:vars.includes("mindmap.focusNotes"),
    }
    return config
    
  } catch (error) {
    this.addErrorLog(error, "parseVars")
    throw error;
  }
  }
  static getCurrentNotesInMindmap(){
    if (MNUtil.mindmapView) {
      let notes = MNUtil.mindmapView.mindmapNodes.map((node)=>{
        return MNNote.new(node.note)
      })
      return notes
    }
    return undefined
  }
  /**
   * 
   * @param {string} str 
   * @param {number} index 
   * @returns {string}
   */
static getLineByIndex(str, index) {
    if (typeof str !== 'string' || index < 0 || index >= str.length) {
        return '';
    }

    // 查找上一个换行符的位置
    const prevBreak = str.lastIndexOf('\n', index);
    const lineStart = prevBreak + 1;

    // 查找下一个换行符的位置
    const nextBreak = str.indexOf('\n', lineStart);
    const lineEnd = nextBreak === -1 ? str.length : nextBreak;

    return str.substring(lineStart, lineEnd);
}

  static checkTemplate(prompt){
    try {
      let res = MNUtil.render(prompt, {})
      return true
    } catch (error) {
      let message = error.message
      if (message.includes("Unclosed tag at")) {
        let line = this.getLineByIndex(prompt,error.index)
        MNUtil.confirm("Invalid template",message+"\n\n请检查以下内容的变量格式是否正确：\n\n"+line)
      }else{
        MNUtil.confirm("Invalid template",message)
      }
      this.addErrorLog(error, "checkTemplate")
      return false
    }
  }






  static async render(template,opt={}){
    try {
      if (opt.noteId) {
        return await this.getNoteVarInfo(opt.noteId,template,opt.userInput,opt.vision)
      }else{
        return await this.getTextVarInfo(template,opt.userInput,opt.vision)
      }
    } catch (error) {
      this.addErrorLog(error, "render")
      throw error;
    }
  }
  static async getCardStructures(notes,OCR_enabled=false){
      let cardStructures = []
      for (let i = 0; i < notes.length; i++) {
        const note = notes[i];
        cardStructures.push(await this.genCardStructure(note.noteId,OCR_enabled))
      }
      return cardStructures
  }
  static async getMindmapObject(vars, OCR_enabled=false){
    if (MNUtil.docMapSplitMode === 2) {
      return {}
    }
    let mindmapTargets = []
    if (vars.hasMindmapNotes || vars.hasNotesInMindmap) {
      mindmapTargets.push("allNotes")
    }
    if (vars.hasMindmapFocusNotes) {
      mindmapTargets.push("focusNotes")
    }
    let mindmapView = MNUtil.mindmapView
    if (mindmapTargets.length === 0) {
      let note = MNNote.new(mindmapView.mindmapNodes[0].note)
      if(note.childMindMap){
        let childMindMap = await this.genCardStructure(note.childMindMap,OCR_enabled)
        return {
          isChildMindMap:true,
          childMindMap: childMindMap
        }
      }
      return {isChildMindMap:false}
    }

    let object = {isChildMindMap:false}
    if (mindmapTargets.includes("allNotes")) {
      let allNotes = mindmapView.mindmapNodes.map(node=>{
        return MNNote.new(node.note)
      })
      let cardStructures = await this.getCardStructures(allNotes,OCR_enabled)
      let allNotesTree = chatAIUtils.buildHierarchy(cardStructures)
      object.allNotes = JSON.stringify(allNotesTree,null,2)
      if (allNotes[0].childMindMap) {
        object.isChildMindMap = true
        object.childMindMap = await this.getCardStructures(allNotes[0].childMindMap,OCR_enabled)
      }
    }
    if (mindmapTargets.includes("focusNotes")) {
      let focusNotes = mindmapView.selViewLst.map(tem=>{
        return MNNote.new(tem.note.note)
      })
      let cardStructures = await this.getCardStructures(focusNotes,OCR_enabled)
      let focusNotesTree = chatAIUtils.buildHierarchy(cardStructures)
      object.focusNotes = JSON.stringify(focusNotesTree,null,2)
      if (!object.isChildMindMap && focusNotes[0].childMindMap) {
        object.isChildMindMap = true
        object.childMindMap = await this.getCardStructures(focusNotes[0].childMindMap,OCR_enabled)
      }
    }
    return object
  }
  static async getNoteVarInfo(noteid,text,userInput,vision=false,ocr = this.OCREnhancedMode) {
    try {
    let replaceText= text//this.checkVariableForNote(text, userInput)//提前写好要退化到的变量
    let vars = this.parseVars(replaceText)
    let noteInfo = vars.noteInfo
    // MNUtil.log({message:"noteInfo",detail:noteInfo})
    let note = MNNote.new(noteid)

    let mindmapObject = await this.getMindmapObject(vars,ocr)
    let docConfig = await this.getDocObject(MNUtil.currentDoc,{withContent:vars.hasCurrentDocContent})
    let noteConfig = undefined
    if (noteInfo.hasNote) {
      noteConfig = await this.getNoteObject(note,{
        noteInfo:noteInfo, parent:noteInfo.hasParent, child:noteInfo.hasChild,parentLevel:noteInfo.parentLevel
      })
    }
    let preObject = {
      visionMode:vision,
      currentDoc:docConfig,
      mindmap:mindmapObject
    }
    if (noteConfig) {
      preObject.note = noteConfig
    }
    let config = this.getVarInfo(vars,preObject)
    // let selectedText = MNUtil.selectionText
    let contextVar = ""
    if (vars.hasContext) {
      if (MNUtil.activeTextView && MNUtil.activeTextView.selectedRange.length>0) {
        let range = MNUtil.activeTextView.selectedRange
        contextVar = MNUtil.activeTextView.text.slice(range.location,range.location+range.length)
      }else{
        contextVar = await this.getTextForSearch(note,ocr)
      }
      config.context = contextVar
    }

    if (vars.hasCard) {
      // let stringified = await this.getMDFromNote(note,ocr)
      let structure = await this.genCardStructure(noteid,ocr)
      let stringified = this.stringifyCardStructure(structure)
      config.card = stringified
    }
    if (vars.hasCardOCR) {
      MNUtil.showHUD("OCR...")
      // let stringified = await this.getMDFromNote(note,0,true)
      let structure = await this.genCardStructure(noteid,true)
      let stringified = this.stringifyCardStructure(structure)
      config.cardOCR = stringified
    }
    if (vars.hasParentCard) {
      // let stringified = await this.getMDFromNote(note.parentNote,0,ocr)
      let structure = await this.genCardStructure(note.parentNote.noteId,ocr)
      let stringified = this.stringifyCardStructure(structure)
      config.parentCard = stringified
    }
    if (vars.hasParentCardOCR) {
      // let stringified = await this.getMDFromNote(note.parentNote,0,true)
      let structure = await this.genCardStructure(note.parentNote.noteId,true)
      let stringified = this.stringifyCardStructure(structure)
      config.parentCardOCR = stringified
    }
    if (vars.hasNotesInMindmap) {
      config.notesInMindmap = mindmapObject.allNotes
    }
    if (vars.hasCards) {
      let focusNotes = MNNote.getFocusNotes()
      let cardStructures = await this.getCardStructures(focusNotes,ocr)
      if (cardStructures.length === 1) {
        config.cards = this.stringifyCardStructure(cardStructures[0])
      }else{
        let tree = chatAIUtils.buildHierarchy(cardStructures)
        config.cards = JSON.stringify(tree,null,2)
      }
    }
    if (vars.hasCardsOCR) {
      let focusNotes = MNNote.getFocusNotes()
      let cardStructures = await this.getCardStructures(focusNotes,true)
      if (cardStructures.length === 1) {
        config.cardsOCR = this.stringifyCardStructure(cardStructures[0])
      }else{
        let tree = chatAIUtils.buildHierarchy(cardStructures)
        config.cardsOCR = JSON.stringify(tree,null,2)
      }
    }
    if (vars.hasOCR) {
      contextVar = await this.getTextForSearch(note,true)
      config.textOCR = contextVar
    }
    if (vars.hasUserInput) {
      if (userInput) {
        config.userInput = userInput
      }else{
        contextVar = await this.getTextForSearch(note,ocr)
        config.userInput = contextVar
      }
    }
    if (vars.hasCurrentDocInfo) {
      let currentFile = this.getCurrentFile()
      if (!currentFile.fileExists) {
        config.currentDocInfo = undefined
      }else{
        let PDFExtractMode = chatAIConfig.getConfig("PDFExtractMode")
        let fileInfo = await chatAIConfig.getFileContent(currentFile,PDFExtractMode === "local")
        config.currentDocInfo = JSON.stringify(fileInfo,undefined,2)
      }
    }
    if (vars.hasNoteDocInfo) {
      let currentFile = this.getNoteFile(noteid)
      if (!currentFile.fileExists) {
        currentFile = this.getCurrentFile()
      }
      if (!currentFile.fileExists) {
        config.noteDocInfo = undefined
      }else{
        let PDFExtractMode = chatAIConfig.getConfig("PDFExtractMode")
        let fileInfo = await chatAIConfig.getFileContent(currentFile,PDFExtractMode === "local")
        config.noteDocInfo = JSON.stringify(fileInfo,undefined,2)
      }
    }
    if (vars.hasNoteDocAttach) {
      let note = MNUtil.getNoteById(noteid)
      let content = editorUtils.getAttachContentByMD5(note.docMd5)
      if (!content) {
        MNUtil.showHUD("Attach is empty or not exist")
        config.noteDocAttach = undefined
      }else{
        config.noteDocAttach = content  
      }
    }
    if (vars.hasCurrentDocAttach) {
      if (typeof editorUtils === 'undefined') {
        MNUtil.showHUD("Please install 'MN Editor' first!")
        config.currentDocAttach = undefined
      }else{
        let content = editorUtils.getAttachContentByMD5(MNUtil.currentDocmd5)
        if (content) {
          config.currentDocAttach = content
        }else{
          MNUtil.showHUD("Attach is empty or not exist")
        }
      }
    }
    // MNUtil.copy(vars)
    // MNUtil.copy(config)
    let prompt = MNUtil.render(replaceText, config)
    return prompt
    } catch (error) {
      this.addErrorLog(error, "getNoteVarInfo")
      throw error;
    }
  }
  static MD5(base64Data){
    const wordArray = CryptoJS.enc.Base64.parse(base64Data);
    let md5 = CryptoJS.MD5(wordArray).toString();
    return md5
  }

static async getTextVarInfo(text,userInput,vision=false,ocr=this.OCREnhancedMode) {
  try {
  // MNUtil.log("getTextVarInfo")
  let vars = this.parseVars(text)
  let noteInfo = vars.noteInfo
  let mindmapObject = await this.getMindmapObject(vars)
    // this.showHUD(userInput+vars.hasUserInput)
  let replaceText= text//this.checkVariableForText(text, userInput)//提前写好要退化到的变量
  let noteConfig = undefined
  if (noteInfo.hasNote) {
    noteConfig = await this.getNoteObject(MNNote.getFocusNote(),{
      noteInfo:vars.noteInfo,first:true,parentLevel:noteInfo.parentLevel,child:noteInfo.hasChild
    })
  }
  let docConfig = await this.getDocObject(MNUtil.currentDoc,{withContent:vars.hasCurrentDocContent})
  let preObject = {
    visionMode:vision,
    currentDoc:docConfig,
    mindmap:mindmapObject
  }
  if (noteConfig) {
    preObject.note = noteConfig
  }
  let config = this.getVarInfo(vars,preObject)
  let fileContent = undefined
  let selectedText = MNUtil.selectionText
  if (MNUtil.activeTextView && MNUtil.activeTextView.selectedRange.length>0) {
    let range = MNUtil.activeTextView.selectedRange
    selectedText = MNUtil.activeTextView.text.slice(range.location,range.location+range.length)
  }
  if (vars.hasOCR || vars.hasCardOCR || vars.hasParentCardOCR || vars.hasCardsOCR) {
    let docImage = MNUtil.getDocImage()
    if (docImage) {
      let ocrText = await chatAINetwork.getTextOCR(docImage)
      if (ocrText && ocrText.trim()) {
        selectedText = ocrText
      }
    }
    if (vars.hasOCR) {
      config.textOCR = selectedText
    }
    if (vars.hasCardOCR) {
      config.cardOCR = selectedText
    }
    if (vars.hasParentCardOCR) {
      config.parentCardOCR = selectedText
    }
    if (vars.hasCardsOCR) {
      config.cardsOCR = selectedText
    }
  }
  if (vars.hasNotesInMindmap) {
    config.notesInMindmap = mindmapObject.allNotes
  }
  if (vars.hasContext || vars.hasCard || vars.hasParentCard || vars.hasCards) {
    
    if (ocr) {
      let docImage = MNUtil.getDocImage()
      if (docImage) {
        let ocrText = await chatAINetwork.getTextOCR(docImage)
        if (ocrText && ocrText.trim()) {
          selectedText = ocrText
        }
      }
    }
    if (vars.hasContext) {
      config.context = selectedText
    }
    if (vars.hasCard) {
      config.card = selectedText
    }
    if (vars.hasParentCard) {
      config.parentCard = selectedText
    }
    if (vars.hasCards) {
      config.cards = selectedText
    }
  }
  if (vars.hasUserInput ) {
    if (userInput ) {
      selectedText = userInput
    }else if (ocr) {
      let docImage = MNUtil.getDocImage()
      if (docImage) {
        let ocrText = await chatAINetwork.getTextOCR(docImage)
        if (ocrText && ocrText.trim()) {
          selectedText = ocrText
        }
      }
    }
    config.userInput = selectedText
  }
  if (MNUtil.currentSelection.onSelection) {
    config.isSelectionImage = !MNUtil.currentSelection.isText
    config.isSelectionText = !!MNUtil.currentSelection.text
  }else{
    config.isSelectionImage = false
    config.isSelectionText = false
  }
  if (vars.hasCurrentDocInfo || vars.hasNoteDocInfo) {
    let currentFile = this.getCurrentFile()
    if (!currentFile.fileExists) {
      return undefined
    }
    let PDFExtractMode = chatAIConfig.getConfig("PDFExtractMode")
    let fileInfo = await chatAIConfig.getFileContent(currentFile,PDFExtractMode === "local")
    // MNUtil.log({message:"fileInfo",detail:fileInfo})
    fileContent = JSON.stringify(fileInfo,undefined,2)
    // copy(fileContent)
    if (vars.hasCurrentDocInfo) {
      config.currentDocInfo = fileContent
    }
    if (vars.hasNoteDocInfo) {
      config.noteDocInfo = fileContent
    }
  }
  if (vars.hasCurrentDocAttach || vars.hasNoteDocAttach) {
    let content = ""
    if (typeof editorUtils === 'undefined') {
      MNUtil.showHUD("Please install 'MN Editor' first!")
    }else{
      content = editorUtils.getAttachContentByMD5(MNUtil.currentDocmd5)
    }
    if (vars.hasCurrentDocAttach) {
      config.currentDocAttach = content
    }
    if (vars.hasNoteDocAttach) {
      config.noteDocAttach = content
    }
  }
  // MNUtil.copy(config)
  let output = MNUtil.render(replaceText, config)
  return output
  // MNUtil.copy(output)
  // return this.replacVar(replaceText, config)
    } catch (error) {
    this.addErrorLog(error, "getTextVarInfo")
    throw error;
    // this.addErrorLog(error, "getTextVarInfo")
  }

}
  /**
   * Displays a confirmation dialog with a main title and a subtitle.
   * 
   * This method shows a confirmation dialog with the specified main title and subtitle.
   * It returns a promise that resolves with the button index of the button clicked by the user.
   * 
   * @param {string} mainTitle - The main title of the confirmation dialog.
   * @param {string} subTitle - The subtitle of the confirmation dialog.
   * @param {string[]} items - The items of the confirmation dialog.
   * @returns {Promise<number|undefined>} A promise that resolves with the button index of the button clicked by the user.
   */
  static async confirm(mainTitle,subTitle,items = ["Cancel","Confirm"]){
    if (MNOnAlert) {
      return
    }
    MNOnAlert = true
    return new Promise((resolve, reject) => {
      UIAlertView.showWithTitleMessageStyleCancelButtonTitleOtherButtonTitlesTapBlock(
        mainTitle,subTitle,0,items[0],items.slice(1),
        (alert, buttonIndex) => {
          MNOnAlert = false
          // MNUtil.copyJSON({alert:alert,buttonIndex:buttonIndex})
          resolve(buttonIndex)
        }
      )
    })
  }
  /**
   * 递归解析列表项及其子列表
   * @param {object[]} items 
   * @returns 
   */
  static processList(items) {
  return items.map(item => {
    // 提取当前列表项文本（忽略内部格式如粗体、斜体）
    const text = item.text.trim();
    const node = { name: text, children: [] ,type:item.type};

    // 检查列表项内部是否包含子列表（嵌套结构）
    const subLists = item.tokens.filter(t => t.type === 'list');
    if (subLists.length) {
      node.hasList = true
      node.listText = subLists[0].raw
      node.listStart = subLists[0].start
      node.listOrdered = subLists[0].ordered
      node.name = item.tokens[0].text
    }
    subLists.forEach(subList => {
      // 递归处理子列表的 items
      node.children.push(...this.processList(subList.items));
    });

    return node;
  });
}
static getUnformattedText(token) {
  if ("tokens" in token && token.tokens.length === 1) {
    return this.getUnformattedText(token.tokens[0])
  }else{
    return token.text
  }
}
/**
 * 构建树结构（整合标题和列表解析）
 * @param {object[]} tokens 
 * @returns 
 */
  static buildTree(tokens) {
  const root = { name: '中心主题', children: [] };
  const stack = [{ node: root, depth: 0 }]; // 用栈跟踪层级
  let filteredTokens = tokens.filter(token => token.type !== 'space' && token.type !== 'hr')

  filteredTokens.forEach((token,index) => {
    let current = stack[stack.length - 1];

    if (token.type === 'heading') {
      // 标题层级比栈顶浅，则回退栈到对应层级
      while (stack.length > 1 && token.depth <= current.depth) {
        stack.pop();
        current = stack[stack.length - 1]
      }
      const newNode = { name: this.getUnformattedText(token), children: [] ,type:'heading'};
      current.node.children.push(newNode);
      stack.push({ node: newNode, depth: token.depth });
    } else if (token.type === 'list') {
      // 处理列表（可能包含多级嵌套）
      const listNodes = this.processList(token.items);
      if(index && filteredTokens[index-1].type === 'paragraph'){
        if (current.node.type === 'paragraph') {
          stack.pop();
        }
        stack.push({ node: current.node.children.at(-1), depth: 100 });
        current = stack[stack.length - 1];
        // current.node.children.at(-1).hasList = true;
        // current.node.children.at(-1).listText = token.raw;
        // current.node.children.at(-1).listStart = token.start;
        // current.node.children.at(-1).ordered = token.ordered;
        // current.node.children.at(-1).children.push(...listNodes)
      }
      current.node.hasList = true;
      current.node.listText = token.raw;
      current.node.listStart = token.start;
      current.node.ordered = token.ordered;
      current.node.children.push(...listNodes);
      
    } else {
      if (token.type === 'paragraph' && current.node.type === 'paragraph') {
        stack.pop();
        current = stack[stack.length - 1];
      }
      current.node.children.push({ name: token.raw, raw: token.raw, children: [] ,type:token.type});
    }
  });
  return root;
}
  static markdown2AST(markdown){
    let tokens = marked.lexer(markdown)
    // MNUtil.copy(tokens)
    return this.buildTree(tokens)
  }
static  containsMathFormula(markdownText) {
    // 正则表达式匹配单美元符号包裹的公式
    const inlineMathRegex = /\$[^$]+\$/;
    // 正则表达式匹配双美元符号包裹的公式
    const blockMathRegex = /\$\$[^$]+\$\$/;
    // 检查是否包含单美元或双美元符号包裹的公式
    return inlineMathRegex.test(markdownText) || blockMathRegex.test(markdownText);
}
static  containsUrl(markdownText) {
    // 正则表达式匹配常见的网址格式
    const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+/i;
    
    // 使用正则表达式测试文本
    return urlPattern.test(markdownText);
}

static removeMarkdownFormat(markdownStr) {
  return markdownStr
    // 移除加粗 ** ** 和 __ __
    .replace(/\*\*(\S(.*?\S)?)\*\*/g, '$1')
    .replace(/__(\S(.*?\S)?)__/g, '$1')
    // 移除斜体 * * 和 _ _
    .replace(/\*(\S(.*?\S)?)\*/g, '$1')
    .replace(/_(\S(.*?\S)?)_/g, '$1')
    // 移除删除线 ~~ ~~
    .replace(/~~(\S(.*?\S)?)~~/g, '$1')
    // 移除内联代码 ` `
    .replace(/`([^`]+)`/g, '$1')
    // 移除链接 [text](url)
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 移除图片 ![alt](url)
    .replace(/!\[([^\]]+)\]\([^)]+\)/g, '$1')
    // 移除标题 # 和 ##
    .replace(/^#{1,6}\s+/gm, '')
    // 移除部分列表符号（*、-、+.）
    .replace(/^[\s\t]*([-*+]\.)\s+/gm, '')
    // 移除块引用 >
    .replace(/^>\s+/gm, '')
    // 移除水平线 ---
    .replace(/^[-*]{3,}/gm, '')
    // 移除HTML标签（简单处理）
    .replace(/<[^>]+>/g, '')
    // 合并多个空行
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
static getConfig(text){
  let hasMathFormula = this.containsMathFormula(text)
  if (hasMathFormula) {
    if (/\:/.test(text)) {
      let splitedText = text.split(":")
      if (this.containsMathFormula(splitedText[0])) {
        let config = {excerptText:text,excerptTextMarkdown:true}
        return config
      }
      if (this.containsMathFormula(splitedText[1])) {
        let config = {title:splitedText[0],excerptText:splitedText[1],excerptTextMarkdown:true}
        return config
      }
      let config = {title:splitedText[0],excerptText:splitedText[1]}
      return config
    }
    if (/\：/.test(text)) {
      let splitedText = text.split("：")
      if (this.containsMathFormula(splitedText[0])) {
        let config = {excerptText:text,excerptTextMarkdown:true}
        return config
      }
      if (this.containsMathFormula(splitedText[1])) {
        let config = {title:splitedText[0],excerptText:splitedText[1],excerptTextMarkdown:true}
        return config
      }
      let config = {title:splitedText[0],excerptText:splitedText[1]}
      return config
    }
    let config = {excerptText:text,excerptTextMarkdown:true}
    return config
  }
  if (this.containsUrl(text)) {
    let config = {excerptText:text,excerptTextMarkdown:true}
    return config
  }
    if (/\:/.test(text)) {
      let splitedText = text.split(":")
      if (splitedText[0].length > 50) {
        let config = {excerptText:text}
        return config
      }
      let config = {title:splitedText[0],excerptText:splitedText[1]}
      return config
    }
    if (/\：/.test(text)) {
      let splitedText = text.split("：")
      if (splitedText[0].length > 50) {
        let config = {excerptText:text}
        return config
      }
      let config = {title:splitedText[0],excerptText:splitedText[1]}
      return config
    }
  if (text.length > 50) {
    return {excerptText:text}
  }
  return {title:text}
}
  /**
 * 
 * @param {MNNote} note 
 * @param {Object} ast 
 */
static AST2Mindmap(note,ast,level = "all") {
try {
  if (ast.children && ast.children.length) {
    let hasList = ast.hasList
    let listOrdered = ast.listOrdered || ast.ordered
    ast.children.forEach((c,index)=>{
      if (c.type === 'hr') {
        return
      }
      if (c.type === 'table') {
        let config = {excerptText:c.name,excerptTextMarkdown:true}
        let childNote = note.createChildNote(config)
        return
      }
      let text = this.removeMarkdownFormat(c.name)
      // let text = c.name
      if (text.endsWith(":") || text.endsWith("：")) {
        text = text.slice(0,-1)
      }
      let config = this.getConfig(text)
      if ((text.startsWith('$') && text.endsWith('$')) || /\:/.test(text) || /：/.test(text)) {

      }else{
        if (c.children.length === 1 && !(/\:/.test(c.children[0].name) || /：/.test(c.children[0].name))) {
          if (text.endsWith(":") || text.endsWith("：")) {
            config = {excerptText:text+"\n"+c.children[0].name}
          }else{
            config = {title:text,excerptText:c.children[0].name}
          }
          let childNote = note.createChildNote(config)
          if (c.children[0].children.length) {
            this.AST2Mindmap(childNote,c.children[0])
          }
          return
        }
        if (c.children.length > 1 && c.children[0].type === 'paragraph' && c.children[1].type === 'heading') {
          if (text.endsWith(":") || text.endsWith("：")) {
            config = {excerptText:text+"\n"+c.children[0].name}
          }else{
            config = {title:text,excerptText:c.children[0].name}
          }
          c.children.shift()
        }
      }
      if (hasList && listOrdered) {
        if (ast.listStart == 0) {
          ast.listStart = 1
        }
        if (config.title) {
          config.title = (ast.listStart+index)+". "+config.title
        }else{
          config.excerptText = (ast.listStart+index)+". "+config.excerptText
        }
      }
      // MNUtil.showHUD("message")
      //继续创建子节点
      let childNote = note.createChildNote(config)
      this.AST2Mindmap(childNote,c)
    })
  }else{
    // MNUtil.showHUD("No children found")
  }
  } catch (error) {
  this.addErrorLog(error, "AST2Mindmap")
}
}
static getValidJSON(jsonString,debug = false) {
  try {
    if (typeof jsonString === "object") {
      return jsonString
    }
    return JSON.parse(jsonString)
  } catch (error) {
    try {
      return JSON.parse(jsonrepair(jsonString))
    } catch (error) {
      let errorString = error.toString()
      try {
        if (errorString.startsWith("Unexpected character \"{\" at position")) {
          return JSON.parse(jsonrepair(jsonString+"}"))
        }
        return {}
      } catch (error) {
        debug && this.addErrorLog(error, "getValidJSON", jsonString)
        return {}
      }
    }
  }
}

/**
 * 
 * @param {string|number} color 
 * @returns {number}
 */
static getColorIndex(color){
    if (typeof color === 'string') {
      let colorMap = {
        "LIGHTYELLOW":0,
        "LIGHTGREEN":1,
        "LIGHTBLUE":2,
        "LIGHTRED":3,
        "YELLOW":4,
        "GREEN":5,
        "BLUE":6,
        "RED":7,
        "ORANGE":8,
        "LIGHTORANGE":8,
        "DARKGREEN":9,
        "DARKBLUE":10,
        "DARKRED":11,
        "DEEPRED":11,
        "WHITE":12,
        "LIGHTGRAY":13,
        "DARKGRAY":14,
        "PURPLE":15,
        "LIGHTPURPLE":15,
      }
      // let colors  = ["LightYellow", "LightGreen", "LightBlue", "LightRed","Yellow", "Green", "Blue", "Red", "Orange", "DarkGreen","DarkBlue", "DeepRed", "White", "LightGray","DarkGray", "Purple"]
      let index = colorMap[color.toUpperCase()]
      if (index !== -1) {
        return index
      }
      return -1
    } else {
      return color
    }

  }
static fixMarkdownLatexSpaces(markdownText) {
  // 正则表达式用于匹配内联 LaTeX 公式
  // (?<!\$): 反向否定查找，确保前面的字符不是美元符号（排除 $$ 开头的情况）
  // \$: 匹配开头的美元符号
  // ([^$]+?): 捕获组1，匹配一个或多个非美元符号的字符（非贪婪模式），这是公式内容
  // \$: 匹配结尾的美元符号
  // (?!\$): 正向否定查找，确保后面的字符不是美元符号（排除 $$ 结尾的情况）
  const inlineLatexRegex = /(?<!\$)\$([^$]+?)\$(?!\$)/g;

  return markdownText.replace(inlineLatexRegex, (match, content) => {
    // match 是整个匹配到的字符串，例如 "$ i $" 或 "$ A \in \mathbb{R}^{n \times n} $"
    // content 是捕获组中的内容，例如 " i " 或 " A \in \mathbb{R}^{n \times n} "
    const trimmedContent = content.trim(); // 移除内容两端的空格
    return '$' + trimmedContent + '$';
  });
}
static replaceLtInLatexBlocks(markdown) {
    return markdown.replace(/\$\$(.*?)\$\$/gs, (match, latexContent) => {
        return '$$' + latexContent.replace(/</g, '\\lt') + '$$';
    });
}
/**
 * 
 * @param {string} code 
 * @returns 
 */
static getChoiceBlock(code) {
  let url = `userselect://choice?content=${encodeURIComponent(code)}`
  let tem = code.split(". ")
  if (tem.length > 1 && tem[0].trim().length === 1) {
    
  return `<div style="margin-top: 15px;">
    <div style="
      display: block;
      padding: 0.8em 0.8em;
      color: #495057;
      border-radius: 20px;
      text-decoration: none;
      border: 0.1em solid #dee2e6;
      background: #f1f7fe;
      cursor: pointer;
      box-sizing: border-box;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
      position: relative;
      "
     >
      <span style="
          display: inline-block;
          width: 1.8em;
          height: 1.8em;
          background: #2196f3;
          color: white;
          border-radius: 50%;
          text-align: center;
          line-height: 1.8em;
          font-weight: 600;
          margin-right: 0.5em;
          vertical-align: middle;
          ">${tem[0]}</span>
      <span style="vertical-align: middle;">${tem.slice(1).join(". ")}</span>
  </div>
  </div>`
  }
  return `<div style="margin-top: 15px;">
    <div 
     style="
      display: block;
      padding: 0.8em 0.8em;
      color: #495057;
      border-radius: 20px;
      text-decoration: none;
      border: 0.1em solid #dee2e6;
      background: #f1f7fe;
      cursor: pointer;
      box-sizing: border-box;
      transition: all 0.2s ease;
      box-shadow: 0 2px 4px rgba(0,0,0,0.02);
      position: relative;
      "
     >
      <span style="vertical-align: middle;">${code}</span>
  </div>
  </div>`
}
static getChoicesHTML(choices){
  let choicesHTML = choices.map(choice => {
    return this.getChoiceBlock(choice)
}).join("\n")
return choicesHTML
}
static codeBlockReplacer(lang,format,code){
    let encodedContent = encodeURIComponent(code);
    if (lang === "userSelect") {
      let url = `userselect://choice?content=${encodedContent}`
      return `<div><a href="${url}" style="
    display: block;
    padding: 10px 12px;
    margin-top: 10px;
    background: #e3eefc;
    color: #1565c0;
    border-radius: 8px;
    text-decoration: none;
    border: 2px solid transparent;
    border-color: #90caf9;
    font-size: 16px;
    cursor: pointer;
    box-sizing: border-box;
"
>
${code.trim()}
</a></div>`
    }
    if (lang === "addNote") {
      let url = `userselect://addnote?content=${encodedContent}`
      if (format === "markdown") {
        url = `userselect://addnote?content=${encodedContent}&format=markdown`
        code = MNUtil.md2html(code)
      }
      return `<div><a href="${url}" style="
    display: block;
    padding: 10px 12px;
    margin-top: 10px;
    background:rgb(230, 255, 239);
    color:#237427;
    border-radius: 8px;
    text-decoration: none;
    border: 2px solid transparent;
    border-color:#01b76e;
    font-size: 16px;
    cursor: pointer;
    box-sizing: border-box;
"
>
<div style="font-weight: bold;margin-bottom: 5px;font-size: 18px;">➕点击创建笔记：</div>
${code.trim()}
</a></div>`
  }
    if (lang === "addComment") {
      let url = `userselect://addcomment?content=${encodedContent}`
      if (format === "markdown") {
        url = `userselect://addnote?content=${encodedContent}&format=markdown`
        code = MNUtil.md2html(code)
      }
      return `<div><a href="${url}" style="
    display: block;
    padding: 10px 12px;
    margin-top: 10px;
    background:rgb(230, 255, 239);
    color:#237427;
    border-radius: 8px;
    text-decoration: none;
    border: 2px solid transparent;
    border-color:#01b76e;
    font-size: 16px;
    cursor: pointer;
    box-sizing: border-box;
"
>
<div style="font-weight: bold;margin-bottom: 5px;font-size: 18px;">➕点击添加卡片评论：</div>
${code.trim()}
</a></div>`
  }
  return ""
}

/**
 * 从markdown中提取 userSelect 或 addNote 代码块，并替换成指定内容
 * @param {string} markdown - 原始markdown
 * @returns {{markdown: string, blocks: string[]}} 
 */
static replaceSpecialBlocks(markdown) {
  // const blocks = [];
  // 正则：匹配```userSelect 或 ```addNote 开头，直到下一个```
const pattern = /```(userSelect|addNote|addComment)\s*(plaintext|markdown|json)?\n([\s\S]*?)```/g;
const newMarkdown = markdown.replace(pattern, (match, lang, format, code) => {
    // blocks.push(code);
    if (this.cacheInfo.enabled) {
      if (match in this.cache) {
        // this.cacheInfo.times++
        // this.cacheInfo.number = Object.keys(this.cache).length
        // MNUtil.log({message:"Using cache",cacheInfo:this.cacheInfo})
        return this.cache[match]
      }
      let res = this.codeBlockReplacer(lang,format,code)
      this.cache[match] = res
      return res
    }else{
      return this.codeBlockReplacer(lang,format,code)
    }
    // return typeof replacer === 'function'
    //   ? replacer(lang,format,code)
    //   : String(replacer);
  });
  return { markdown: newMarkdown };
}
static replaceButtonCodeBlocks(markdown) {
//   let replacer = (lang,format,code) => {
//     let encodedContent = encodeURIComponent(code);
//     if (lang === "userSelect") {
//       let url = `userselect://choice?content=${encodedContent}`
//       return `<div><a href="${url}" style="
//     display: block;
//     padding: 10px 12px;
//     margin-top: 10px;
//     background: #e3eefc;
//     color: #1565c0;
//     border-radius: 8px;
//     text-decoration: none;
//     border: 2px solid transparent;
//     border-color: #90caf9;
//     font-size: 16px;
//     cursor: pointer;
//     box-sizing: border-box;
// "
// >
// ${code.trim()}
// </a></div>`
//     }
//     if (lang === "addNote") {
//       let url = `userselect://addnote?content=${encodedContent}`
//       if (format === "markdown") {
//         url = `userselect://addnote?content=${encodedContent}&format=markdown`
//         code = MNUtil.md2html(code)
//       }
//       return `<div><a href="${url}" style="
//     display: block;
//     padding: 10px 12px;
//     margin-top: 10px;
//     background:rgb(230, 255, 239);
//     color:#237427;
//     border-radius: 8px;
//     text-decoration: none;
//     border: 2px solid transparent;
//     border-color:#01b76e;
//     font-size: 16px;
//     cursor: pointer;
//     box-sizing: border-box;
// "
// >
// <div style="font-weight: bold;margin-bottom: 5px;font-size: 18px;">➕点击创建笔记：</div>
// ${code.trim()}
// </a></div>`
//   }
//     if (lang === "addComment") {
//       let url = `userselect://addcomment?content=${encodedContent}`
//       if (format === "markdown") {
//         url = `userselect://addnote?content=${encodedContent}&format=markdown`
//         code = MNUtil.md2html(code)
//       }
//       return `<div><a href="${url}" style="
//     display: block;
//     padding: 10px 12px;
//     margin-top: 10px;
//     background:rgb(230, 255, 239);
//     color:#237427;
//     border-radius: 8px;
//     text-decoration: none;
//     border: 2px solid transparent;
//     border-color:#01b76e;
//     font-size: 16px;
//     cursor: pointer;
//     box-sizing: border-box;
// "
// >
// <div style="font-weight: bold;margin-bottom: 5px;font-size: 18px;">➕点击添加卡片评论：</div>
// ${code.trim()}
// </a></div>`
//   }
//   return ""
// }
let res = this.replaceSpecialBlocks(markdown)
  return res.markdown
}
/**
 * 通过对URL参数进行编码，来修复文本中特定格式的Markdown链接。
 * 此函数会查找形如 [文字](userselect://choice?content=文字) 的链接，
 * 并对 content 参数的值进行标准的URL编码，以确保链接格式正确，能被正常解析。
 *
 * @param {string} text - 包含可能需要修复的Markdown链接的原始字符串。
 * @returns {string} - 修复了链接格式的新字符串。
 */
static fixMarkdownLinks(text) {
  // 正则表达式用于匹配并捕获链接文本和需要编码的内容。
  // 捕获组1 ($1): 方括号内的链接文本。
  // 捕获组2 ($2): `content=`之后到右括号之前的所有内容。
  // const brokenLinkRegex = /\[([^\]]+)\]\(userselect:\/\/(choice|addnote|addcomment)(\?content=([^)]+))?\)/g;
  // 匹配加粗链接
  const brokenLinkRegex = /\**\[([^\]]+)\]\(userselect:\/\/(choice|addnote|addcomment)(\?content=([^)]+))?\)\**/g;

  /**
   * 这是一个自定义的替换函数。
   * String.prototype.replace() 可以接受一个函数作为第二个参数，
   * 对每一个匹配项动态地创建替换字符串。
   * @param {string} match - 完整的匹配项，例如 "[A...](userselect...)"
   * @param {string} linkText - 捕获组1的内容。
   * @param {string} content - 捕获组2的内容。
   * @returns {string} - 格式修复后的完整Markdown链接。
   */
  const replacer = (match, linkText, host,content) => {
    // 使用 encodeURIComponent 对包含特殊字符的内容进行编码。
    // 这是处理URL参数的标准做法。
      const encodedLinkText = encodeURIComponent(linkText);
    if (content) {
      const encodedContent = encodeURIComponent(decodeURIComponent(content).replace("?content=", ""));
      let url = `userselect://${host}?content=${encodedContent}&linkText=${encodedLinkText}`
      // 重新组装成修复后的链接。
      return `\n<div>
<a href="${url}" style="
    display: block;
    padding: 10px 12px;
    margin-top: 10px;
    background: #e3eefc;
    color: #1565c0;
    border-radius: 8px;
    text-decoration: none;
    border: 2px solid transparent;
    border-color: #90caf9;
    font-size: 16px;
    cursor: pointer;
    box-sizing: border-box;
"
>
    ${linkText}
</a>
</div>`
      // return `[${linkText}](userselect://${host}?content=${encodedContent}&linkText=${encodedLinkText})`;
    }else{
      let url = `userselect://${host}?linkText=${encodedLinkText}`
      // 重新组装成修复后的链接。
      return `\n<div>
<a href="${url}" style="
    display: block;
    padding: 10px 12px;
    margin-top: 10px;
    background: #e3eefc;
    color: #1565c0;
    border-radius: 8px;
    text-decoration: none;
    border: 2px solid transparent;
    border-color: #90caf9;
    font-size: 16px;
    cursor: pointer;
    box-sizing: border-box;
"
>
    ${linkText}
</a>
</div>`
      // return `[${linkText}](userselect://${host}?linkText=${encodedLinkText})`;
    }
  };

  // 执行查找和替换。
  return text.replace(brokenLinkRegex, replacer);
}
/**
 * 
 * @param {MNNote} note 
 * @returns {boolean}
 */
static isBlankNote(note){//指有图片摘录但图片分辨率为1x1的空白图片
  if (note.excerptPic) {
    let imageData = MNUtil.getMediaByHash(note.excerptPic.paint)
    let image = UIImage.imageWithData(imageData)
    if (image.size.width === 1 && image.size.height === 1) {
      return true
    }
  }
  return false
}
  /**
   * 
   * @param {NSData} data 
   * @returns {string}
   */
  static dataToString(data){
    if (data instanceof NSData) {
      return NSString.stringWithContentsOfData(data)
    }
    return data
  }
}

class chatAIConfig {
  // 构造器方法，用于初始化新创建的对象
  constructor(name) {
    this.name = name;
  }
  // static defaultAction
  static isFirst = true
  static his = []
  static fileContent = {}
  static onSync = false
  static currentPrompt
  /** @type {Number[]} */
  static currentFunc
  /** @type {Number[]} */
  static currentAction
  /** @type {String} */
  static currentTitle
  /** @type {String} */
  static mainPath
  static action = []
  static previousConfig = {}
  static get defaultPrompts() {
    return  {
      Translate:                      {title: "翻译",context:"请翻译下面这段话：{{context}}"},
      Keyword:                        {title: "关键词",context:"请为下面这段话提取关键词：{{context}}"},
      Title:                          {title: "标题",context:"请为下面这段话生成标题：{{context}}"}
    }
  }

  static get defaultConfig() {
    return {
    searchOrder: [2,1,3],
    sideBar: true,
    autoAction: false,
    onSelection: true,
    onSelectionImage: true,
    onNote: true,
    onNoteImage: true,
    onNewExcerpt: true,
    onNewExcerptImage: true,
    delay: 0,
    ignoreShortText: false,
    notifyLoc: 0,
    toolbar: true,
    model: "gpt-4o-mini",
    chatglmModel:"glm-4-plus",
    promptNames: Object.keys(this.defaultPrompts),
    currentPrompt: Object.keys(this.defaultPrompts)[0],
    apikey: "",
    modelOnReAsk: -1,
    syncDynamicModel:true,
    source: 'Built-in',
    url: "https://api.openai.com",
    openaiKey: "",
    tunnel:0,
    moonshotKey : "",
    moonshotModel : "moonshot-v1-8k",
    customKey : "",
    customModel : "",
    customUrl : "",
    customModelIndex : 0,
    claudeKey : "",
    claudeUrl : "https://api.anthropic.com",
    claudeModel : "claude-3-haiku-20240307",
    geminiKey : "",
    geminiUrl : 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    geminiModel : 0,
    miniMaxKey: "",
    miniMaxUrl: "https://api.minimax.chat/v1/text/chatcompletion_v2",
    miniMaxModel: "abab6.5-chat",
    miniMaxGroup:"1827907340364431485",
    deepseekKey:"",
    deepseekUrl:"https://api.deepseek.com/chat/completions",
    deepseekModel:"deepseek-chat",
    qwenKey:"",
    qwenUrl:"https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    qwenModel:"qwen-long",
    siliconFlowKey:"",
    siliconFlowUrl:"https://api.siliconflow.cn/v1/chat/completions",
    siliconFlowModel:"deepseek-ai/DeepSeek-V3",
    volcengineKey:"",
    volcengineUrl:"https://ark.cn-beijing.volces.com/api/v3/chat/completions",
    volcengineModel:"deepseek-v3-241226",
    githubKey: "",
    githubUrl: "https://models.inference.ai.azure.com/chat/completions",
    githubModel: "gpt-4o",
    metasoKey:"",
    metasoUrl:"https://metaso.cn/api/v1/chat/completions",
    metasoModel:"fast",
    ppioKey:"",
    ppioUrl:"https://api.ppinfra.com/v3/openai/chat/completions",
    ppioModel:"deepseek/deepseek-v3/community",
    dynamic:true,
    dynamicFunc : [],
    dynamicModel : "Default",
    dynamicAction: [],
    dynamicTemp: 0.8,
    dynamicToolbarAction: "",
    dynamicHistory: [],
    colorConfig: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    imageColorConfig: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    simpleTexKey:"",
    autoExport:false,
    autoImport:false,
    autoImage:false,
    autoOCR:false,
    lastSyncTime:0,
    modifiedTime:0,
    speech:false,
    speechSpeed:1.0,
    autoSpeech:false,
    speechVoice:"male-qn-qingse",
    speechKey:"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJHcm91cE5hbWUiOiLmnpfnq4vpo54iLCJVc2VyTmFtZSI6Iuael-eri-mjniIsIkFjY291bnQiOiIiLCJTdWJqZWN0SUQiOiIxODI3OTA3MzQwMzY4NjI1Nzg5IiwiUGhvbmUiOiIxMzAxNTk5MjA4NSIsIkdyb3VwSUQiOiIxODI3OTA3MzQwMzY0NDMxNDg1IiwiUGFnZU5hbWUiOiIiLCJNYWlsIjoiIiwiQ3JlYXRlVGltZSI6IjIwMjQtMDktMDEgMTk6MzI6NTYiLCJpc3MiOiJtaW5pbWF4In0.Z7XNgcL2Y6qspWYJJMo0QinzWJp1C9-iTkeZk-2-ouqbkGvnmdh2xfIj-5jB-KMG4rqTjShExBifBlkUMMZgHeCVTmUyz6KNPKAzVvkfkMOjjbD7gElmFgO_0zHtL3pc8q6iAUGxrSmtBY1feIK9CpbQKzTI6xLYEU6d8keAv4zV14eey9L5UT5WwpNJ9vZG0367XuoOyGYnICfwIlSC5qg74NdtREq7t0vgh6NQ6BtWRWhdM-Q06rNPA5H5I8Km5RD8DmCm05aspkxMq_SsNyco9HrpEIKLSvBrLW7TVB4XG324fpUa-xdfvX_rFm7SRBy9sHbC7EtWhR6pUBSeEQ",
    imageCompression:true,
    syncSource:"None",
    syncNoteId: "",
    r2file:"",
    r2password:"",
    InfiFile:"",
    InfiPassword:"",
    webdavFile:"",
    webdavFolder:"",
    webdavUser:"",
    webdavPassword:"",
    subscriptionModel:"gpt-4o-mini",
    autoTheme:false,
    autoClear:false,
    autoClose:false,
    chatModel:"Default",
    chatFuncIndices:[],
    chatSystemPrompt:"",
    allowEdit:false,
    PDFExtractMode:"local",
    customButton:{
      "button1":{
        "click":"bigbang",
        "longPress":"none",
        "autoClose":false
      },
      "button2":{
        "click":"addComment",
        "longPress":"addBlankComment",
        "autoClose":false
      },
      "button3":{
        "click":"setTitle",
        "longPress":"none",
        "autoClose":false
      },
      "button4":{
        "click":"copy",
        "longPress":"none",
        "autoClose":false
      },
      "button5":{
        "click":"setExcerpt",
        "longPress":"appendExcerpt",
        "autoClose":false
      },
      "button6":{
        "click":"addChildNote",
        "longPress":"markdown2Mindmap",
        "autoClose":false
      },
      "button7":{
        "click":"reAsk",
        "longPress":"reAskWithMenu",
        "autoClose":false
      },
      "button8":{
        "click":"openChat", 
        "longPress":"none",
        "autoClose":true
      }
    }
  }
  }

  static actionImages = {
    stopOutput:"stopImage",
    bigbang:"bigbangImage",
    addComment:"commentImage",
    setTitle:"titleImage",
    addTitle:"titleImage",
    copy:"copyImage",
    setExcerpt:"excerptImage",
    appendExcerpt:"excerptImage",
    addChildNote:"childImage",
    addBrotherNote:"brotherImage",
    markdown2Mindmap:"mindmapImage",
    addBlankComment:"commentImage",
    editMode:"editorImage",
    bindNote:"bindImage",
    openInEditor:"editorImage",
    snipaste:"snipasteImage",
    menu:"menuImage",
    searchInBrowser:"searchImage",
    reAsk:"reloadImage",
    reAskWithMenu:"reloadImage",
    openChat:"chatImage",
    none:"noneImage",
    switchLocation:"switchLocationImage",
    reply:"replyImage"
  }
  //直接返回UIImage
  static actionImage(action){
    if (action in this.actionImages) {
      return this[this.actionImages[action]]
    }
    if (action.startsWith("toolbar:")) {
      let toolbarAction = action.split(":")[1]
      let image = toolbarConfig.imageConfigs[toolbarAction]
      let scale = image.scale
      let newImage = UIImage.imageWithCGImageScaleOrientation(image.CGImage,scale*1.1,0)
      return newImage
    }
    return this.defaultActionImage
  }
  static getUnusedKey(){
      let i = 0
      while (chatAIConfig.prompts["customEngine"+i]) {
        i = i+1
      }
      return ("customEngine"+i)
  }
  static getActionImages(){
  try {

    let config = this.getConfig("customButton")
    // MNUtil.log({message:"getActionImages",source:"MN ChatAI",detail:config})
    let actions = [
      config.button1.click,
      config.button2.click,
      config.button3.click,
      config.button4.click,
      config.button5.click,
      config.button6.click
    ]
    if (config.button7) {
      actions.push(config.button7.click)
    }else{
      actions.push("reAsk")
    }
    if (config.button8) {
      actions.push(config.button8.click)
    }else{
      actions.push("openChat")
    }
    return actions.map(action=>{
      return this.actionImage(action)
    })
    
  } catch (error) {
    chatAIUtils.addErrorLog(error, "utils.getActionImages")
    return undefined
  }
  }
  static appendDynamicHistory(prompt){
    let dynamicHistory = this.getConfig("dynamicHistory")
    if(dynamicHistory.includes(prompt)){
      //remove the prompt
      dynamicHistory = dynamicHistory.filter(h=>h !== prompt)
    }
    dynamicHistory.unshift(prompt)
    dynamicHistory = dynamicHistory.slice(0,20)
    this.config.dynamicHistory = dynamicHistory
    this.save("MNChatglm_config")
  }
  static getLatestHistory(){
    let dynamicHistory = this.getConfig("dynamicHistory")
    return dynamicHistory[0]
  }
  static defaultModelConfig = {
    "Volcengine":[
          "deepseek-v3-250324",
          "deepseek-r1-250120",
          "doubao-1-5-pro-32k-250115",
          "doubao-1-5-pro-256k-250115",
          "doubao-1.5-vision-pro-250328",
          "doubao-1-5-vision-pro-32k-250115",
          "doubao-1.5-vision-lite-250315",
          "doubao-1-5-lite-32k-250115",
          "doubao-1-5-thinking-pro-250415",
          "doubao-1-5-thinking-pro-m-250415",
          "moonshot-v1-8k",
          "moonshot-v1-32k",
          "moonshot-v1-128k"
    ],
    "SiliconFlow":[
          "deepseek-ai/DeepSeek-R1",
          "Pro/deepseek-ai/DeepSeek-R1",
          "deepseek-ai/DeepSeek-R1-Distill-Llama-70B",
          "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
          "deepseek-ai/DeepSeek-R1-Distill-Qwen-14B",
          "deepseek-ai/DeepSeek-R1-Distill-Llama-8B",
          "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
          "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B",
          "deepseek-ai/DeepSeek-V3",
          "Pro/deepseek-ai/DeepSeek-V3",
          "deepseek-ai/DeepSeek-V2.5",
          "deepseek-ai/deepseek-vl2",
          "Qwen/QwQ-32B",
          "Qwen/QwQ-32B-Preview",
          "Qwen/QVQ-72B-Preview",
          "Qwen/Qwen2.5-Coder-32B-Instruct",
          "Qwen/Qwen2.5-72B-Instruct-128K",
          "Qwen/Qwen2.5-72B-Instruct",
          "Qwen/Qwen2.5-32B-Instruct",
          "Qwen/Qwen2-VL-72B-Instruct",
          "meta-llama/Llama-3.3-70B-Instruct",
          "meta-llama/Meta-Llama-3.1-405B-Instruct"
    ],
    "Github":["gpt-4.1","gpt-4.1-mini","gpt-4.1-nano","gpt-4o","gpt-4o-mini","DeepSeek-R1","Llama-3.3-70B-Instruct"],
    "Metaso":["fast","fast_thinking","ds-r1"],
    "ChatGLM":[
          "glm-4-plus",
          "glm-4v-plus-0111",
          "glm-4-air-250414",
          "glm-4-airx",
          "glm-4-long",
          "glm-4-flash",
          "glm-4-flash-250414",
          "glm-4-flashX",
          "glm-4v-flash",
          "glm-z1-air",
          "glm-z1-airx",
          "glm-z1-flash"
          ],
    "Gemini":[
          "gemini-1.5-pro-latest",
          "gemini-1.5-flash-latest",
          "gemini-exp-1206",
          "gemini-2.0-flash",
          "gemini-2.0-flash-exp",
          "gemini-2.0-flash-lite-preview-02-05",
          "gemini-2.0-flash-thinking-exp",
          "gemini-2.0-flash-thinking-exp-1219",
          "gemini-2.0-flash-thinking-exp-01-21",
          "gemini-2.5-pro-exp-03-25",
          "gemini-2.5-flash-preview-04-17"
    ],
    "ChatGPT":["gpt-4o-mini","gpt-4o","gpt-4-turbo","gpt-4","gpt-4.5-preview","gpt-4.1","gpt-4.1-2025-04-14","gpt-4.1-mini","gpt-4.1-mini-2025-04-14","gpt-4.1-nano","gpt-4.1-nano-2025-04-14"],
    "Subscription":[
          "gpt-4o-mini",
          "gpt-4o",
          "gpt-4.1",
          "gpt-4.1-mini",
          "gpt-4.1-nano",
          "claude-3-5-sonnet",
          "claude-3-7-sonnet",
          "claude-3-7-sonnet-thinking",
          "glm-4-plus",
          "glm-z1-airx",
          "doubao-1-5-thinking-pro",
          "MiniMax-Text-01",
          "gemini-2.0-flash",
          "gemini-2.0-flash-thinking",
          "gemini-2.5-pro",
          "deepseek-chat",
          "deepseek-reasoner"
        ],
    "KimiChat":[
          "kimi-latest",
          "moonshot-v1-8k",
          "moonshot-v1-32k",
          "moonshot-v1-128k",
          "moonshot-v1-auto",
          "moonshot-v1-8k-vision-preview",
          "moonshot-v1-32k-vision-preview",
          "moonshot-v1-128k-vision-preview"
        ],
    "Claude":[
          "claude-3-haiku-20240307",
          "claude-3-sonnet-20240229",
          "claude-3-opus-20240229",
          "claude-3-5-sonnet-20240620",
          "claude-3-5-sonnet-20241022",
          "claude-3-5-haiku-20241022",
          "claude-3-7-sonnet-20250219",
          "claude-3-7-sonnet-20250219-thinking"
        ],
    "Minimax":["MiniMax-Text-01","DeepSeek-R1"],
    "Deepseek":["deepseek-chat","deepseek-reasoner"],
    "Qwen":[
          "qwq-plus",
          "qwq-32b",
          "qvq-72b-preview",
          "qwen-omni-turbo",
          "qwen-long",
          "qwen-turbo",
          "qwen-plus",
          "qwen-max",
          "qwen-max-longcontext",
          "qwen-max-latest",
          "deepseek-r1",
          "deepseek-v3"
        ],
    "PPIO":[
        "deepseek/deepseek-r1-0528",
        "deepseek/deepseek-r1-turbo",
        "deepseek/deepseek-v3-0324",
        "deepseek/deepseek-v3-turbo",
        "deepseek/deepseek-v3/community",
        "deepseek/deepseek-r1/community",
        "deepseek/deepseek-prover-v2-671b",
        "moonshotai/kimi-k2-instruct",
        "baidu/ernie-4.5-vl-424b-a47b",
        "baidu/ernie-4.5-300b-a47b-paddle",
        "qwen/qwen3-235b-a22b-fp8",
        "qwen/qwen3-30b-a3b-fp8",
        "qwen/qwen3-32b-fp8",
        "qwen/qwen3-8b-fp8",
        "qwen/qwen3-4b-fp8",
        "thudm/glm-z1-32b-0414",
        "thudm/glm-z1-9b-0414",
        "thudm/glm-4-32b-0414",
        "thudm/glm-4-9b-0414",
        "thudm/glm-z1-rumination-32b-0414",
        "thudm/glm-4.1v-9b-thinking"
      ]
  }
  static defaultDynamicPrompt = {
    "note":"list below is the structure of a card:\n{{card}}",
    "text":"{{context}}"
  }
  /**
   * @type {string}
   */
  static knowledge
  static init(mainPath){
  try {

    if (mainPath) {
      this.mainPath = mainPath
    }
    this.checkDataDir()
    this.dataFolder = subscriptionUtils.extensionPath+"/data"
    this.backUpFile = subscriptionUtils.extensionPath+"/data/MNChatAI_totalConfig.json"
    this.default_usage = {limit:100,day:chatAIUtils.getToday(),usage:0}
    if (!this.isLocalConfigExists("MNChatglm_config") && this.isBackUpConfigExists()) {//不存在本地配置，但存在备份配置
      let config = MNUtil.readJSON(this.backUpFile)
      MNUtil.log("chatAIConfig.readFromBackupFile")
      this.importConfig(config)
      this.modelConfig = this.getByDefault("MNChatglm_modelConfig", this.defaultModelConfig)
      this.keys = this.getByDefault('MNChatglm_builtInKeys', {})
    }else{
      this.config = this.getByDefault('MNChatglm_config',this.defaultConfig)
      this.prompts = this.getByDefault('MNChatglm_prompts', this.defaultPrompts)
      // MNUtil.copyJSON(this.prompts)
      this.knowledge = this.getByDefault('MNChatglm_knowledge',"")
      this.keys = this.getByDefault('MNChatglm_builtInKeys', {})
      // this.keys = {}
      this.fileId = this.getByDefault("MNChatglm_fileId", {})
      this.usage = this.getByDefault('MNChatglm_usage',this.default_usage)
      this.dynamicPrompt = this.getByDefault("MNChatglm_dynamicPrompt", this.defaultDynamicPrompt)
      this.modelConfig = this.getByDefault("MNChatglm_modelConfig", this.defaultModelConfig)
    }
    this.currentPrompt = this.getConfig("currentPrompt")
    // MNUtil.copyJSON({prompts:this.prompts,config:this.config})
    let currentPrompt = this.prompts[this.currentPrompt]
    if (!currentPrompt) {
      let promptNames = Object.keys(this.prompts)
      this.currentPrompt = promptNames[0]
    }
    // this.currentFunc = this.prompts[this.currentPrompt].func ?? []
    // this.currentAction = this.prompts[this.currentPrompt].action ?? []
    // this.currentModel = this.prompts[this.currentPrompt].model ?? "Default"
    // this.currentTitle = this.prompts[this.currentPrompt].title
    this.setCurrentPrompt(this.currentPrompt,false)
    this.defaultModel = this.getDefaultModel()
    this.highlightColor = UIColor.blendedColor(
      UIColor.colorWithHexString("#2c4d81").colorWithAlphaComponent(0.8),
      chatAIUtils.app.defaultTextColor,
      0.8
    );
    let delay = this.getConfig("delay")
    if (delay == undefined) {
      this.config.delay = 0
    }
    let ignoreShortText = this.getConfig("ignoreShortText")
    if (ignoreShortText == undefined) {
      this.config.ignoreShortText = false
    }
    chatAITool.initTools()

    // MNUtil.copy(this.config.r2password)
    // /**
    //  * @type {chatglmController}
    //  */
    // let ctr = this
    // MNUtil.showHUD("message")
    this.reloadImage = MNUtil.getImage(this.mainPath + `/reload.png`)
    this.stopImage = MNUtil.getImage(this.mainPath + `/stop.png`)
    this.closeImage = MNUtil.getImage(this.mainPath + `/close.png`)
    this.bigbangImage = MNUtil.getImage(this.mainPath + `/bigbang.png`)
    this.copyImage = MNUtil.getImage(this.mainPath + `/copy.png`)
    this.titleImage = MNUtil.getImage(this.mainPath + `/title.png`)
    this.tagImage = MNUtil.getImage(this.mainPath + `/tag.png`)
    this.commentImage = MNUtil.getImage(this.mainPath + `/comment.png`)
    this.aiImage = MNUtil.getImage(this.mainPath + `/ai.png`, 3)
    this.aiLinkImage = MNUtil.getImage(this.mainPath + `/aiLink.png`)
    this.chatImage = MNUtil.getImage(this.mainPath + `/chat.png`)
    this.sendImage = MNUtil.getImage(this.mainPath + `/send.png`)
    this.lockImage = MNUtil.getImage(this.mainPath + `/lock.png`)
    this.unlockImage = MNUtil.getImage(this.mainPath + `/unlock.png`)
    this.excerptImage = MNUtil.getImage(this.mainPath + `/excerpt.png`,2.3)
    this.childImage = MNUtil.getImage(this.mainPath + `/childNote.png`)
    this.brotherImage = MNUtil.getImage(this.mainPath + `/brotherNote.png`)
    this.quoteImage = MNUtil.getImage(this.mainPath + `/quote.png`)
    this.clearImage = MNUtil.getImage(this.mainPath + `/eraser.png`)
    this.mindmapImage = MNUtil.getImage(this.mainPath + `/mindmap.png`)
    this.editorImage = MNUtil.getImage(this.mainPath + `/edit.png`,2.2)
    this.defaultActionImage = MNUtil.getImage(this.mainPath + `/action.png`)
    this.snipasteImage = MNUtil.getImage(this.mainPath + `/snipaste.png`)
    this.menuImage = MNUtil.getImage(this.mainPath + `/menu.png`)
    this.searchImage = MNUtil.getImage(this.mainPath + `/search.png`)
    this.noneImage = MNUtil.getImage(this.mainPath + `/none.png`)
    this.settingImage = MNUtil.getImage(this.mainPath + `/setting.png`)
    this.visionImage = MNUtil.getImage(this.mainPath + `/vision.png`,1.5)
    this.switchLocationImage = MNUtil.getImage(this.mainPath + `/switch.png`),
    this.replyImage = MNUtil.getImage(this.mainPath + `/reply.png`)
    this.aiFreeImage = MNUtil.getImage(this.mainPath + `/aiFree.png`)
    this.aiBindImage = MNUtil.getImage(this.mainPath + `/aiBind.png`)
    this.bindImage = MNUtil.getImage(this.mainPath + `/bind.png`)
    this.historyImage = MNUtil.getImage(this.mainPath + `/history.png`)
    
  } catch (error) {
    chatAIUtils.addErrorLog(error, "chatAIConfig.init")
  }
  }
  static isLocalConfigExists(key){
    let value = NSUserDefaults.standardUserDefaults().objectForKey(key)
    if (value && Object.keys(value).length > 0) {
      return true
    }
    return false
  }
  static isBackUpConfigExists(){
    if (MNUtil.isfileExists(this.backUpFile)) {
      let backupConfig = MNUtil.readJSON(this.backUpFile)
      if (backupConfig && Object.keys(backupConfig).length > 0) {
        return true
      }
      return true
    }
    return false
  }
  
  static checkDataDir(){
    if (MNUtil.initialized) {
      return
    }
    let extensionPath = subscriptionUtils.extensionPath
    if (extensionPath) {
      let dataPath = extensionPath+"/data"
      if (MNUtil.isfileExists(dataPath)) {
        return
      }
      MNUtil.createFolderDev(dataPath)
      // NSFileManager.defaultManager().createDirectoryAtPathAttributes(dataPath, undefined)
    }
  }
  static backUp(){
    MNUtil.log("chatAIConfig.backUp")
    let totalConfig = this.getAllConfig()
    MNUtil.writeJSON(this.backUpFile, totalConfig)
  }
  static exportChatData(data){
    this.checkDataDir()
    // MNUtil.copyJSON(data)
    MNUtil.writeJSON(subscriptionUtils.extensionPath+"/data/chatData.json", data)
  }
  static getChatData(){
    let dataPath = subscriptionUtils.extensionPath+"/data/chatData.json"
    if (MNUtil.isfileExists(dataPath)) {
      let data = MNUtil.readJSON(dataPath)
      let chatsLength = data.chats.length
      if (chatsLength) {
        for (let i = 0; i < chatsLength; i++) {
          if (typeof data.chats[i].name === "object") {
            if ("content" in data.chats[i].name) {
              data.chats[i].name = data.chats[i].name.content
            }else{
              data.chats[i].name = "New Chat"
            }
          }
      }
      }
      return data
    }
    return {
      "folder":[],
      "chats":[
        {
          name:"New Chat",
          data:[]
        }
      ],
      "chatIdxs": [0],
      "activeChatIdx": 0,
      "avatar": "https://file.feliks.top/avatar.webp"
    }
  }
  static async getCachedNotesInStudySet(studySetId){
  try {

    let dataPath = subscriptionUtils.extensionPath+"/data/"+studySetId+".json"
    if (MNUtil.isfileExists(dataPath)) {
      let data = MNUtil.readJSON(dataPath)
      return data
    }else{
      MNUtil.waitHUD("Generating cached notes in studySet...")
      await MNUtil.delay(0.01)
      let studySet = MNUtil.getNoteBookById(studySetId)
      let allNotes = studySet.notes.map(note=>MNNote.new(note))
      let noteSize = allNotes.length
      let noteInfo = []
      for (let i = 0; i < noteSize; i++) {
        let note = allNotes[i]
        let info = await chatAIUtils.genCardStructure(note)
        noteInfo.push(info)
        MNUtil.waitHUD("Generating cached notes in studySet... "+i+"/"+noteSize)
        await MNUtil.delay(0.00001)
      }
      MNUtil.writeJSON(dataPath, noteInfo)
      MNUtil.waitHUD("Generating cached notes in all study sets... Done")
      return noteInfo
    }
    
  } catch (error) {
    chatAIUtils.addErrorLog(error, "getCachedNotesInStudySet")
    return []
  }
  }
  static async getCachedNotesInAllStudySets(){
  try {

    let studySets = chatAIUtils.allStudySets()
    let studySetsSize = studySets.length
    let notesInStudySets = []
    for (let i = 0; i < studySetsSize; i++) {
      let studySet = studySets[i]
      let notes = await chatAIConfig.getCachedNotesInStudySet(studySet.topicId)
      notesInStudySets.push(notes)
    }
    let allNotes = notesInStudySets.flat()
    return allNotes
    
  } catch (error) {
    chatAIUtils.addErrorLog(error, "getCachedNotesInAllStudySets")
    return []
  }
  }
  static async getTunnels(){
  try {

    let TunnelMap = ['Tunnel 1️⃣: ','Tunnel 2️⃣: ','Tunnel 3️⃣: ','Tunnel 4️⃣: ','Tunnel 5️⃣: ','Tunnel 6️⃣: ','Tunnel 7️⃣: ','Tunnel 8️⃣: ']
    if (!Object.keys(this.keys).length) {
      MNUtil.showHUD("Refreshing built-in keys...")
      let keys = await chatAINetwork.fetchKeys()
      if (keys) {
        this.keys = keys 
        this.save('MNChatglm_builtInKeys')
        if (keys.message) {
          // copyJSON(keys)
          MNUtil.showHUD(keys.message)
        }else{
          MNUtil.showHUD("error")
          return ['Tunnel 1️⃣: ','Tunnel 2️⃣: ','Tunnel 3️⃣: ','Tunnel 4️⃣: ']
        }
        // chatAIUtils.chatController.refreshButton.setTitleForState(`Refresh (1️⃣: ${keys.key0.keys.length}, 2️⃣: ${keys.key1.keys.length}, 3️⃣: ${keys.key2.keys.length}, 4️⃣: ${keys.key3.keys.length})`,0)
      }else{
        MNUtil.showHUD("error")
        return ['Tunnel 1️⃣: ','Tunnel 2️⃣: ','Tunnel 3️⃣: ','Tunnel 4️⃣: ']
      }
    }
    // MNUtil.copy(this.keys)
    let keys = Object.keys(this.keys).filter(k=>k.startsWith("key"))
    // MNUtil.copy(res)
    return keys.map((k,index)=>{
      return TunnelMap[index]+this.keys["key"+index].model
    })
    
  } catch (error) {
    chatAIUtils.addErrorLog(error, "getTunnels")
  }
  }
  static copy(obj){
    return JSON.parse(JSON.stringify(obj))
  }
  static autoImport(checkSubscribe = false){
    if (checkSubscribe && !chatAIUtils.isSubscribed(false)) {
      return false
    }
    return this.getConfig("autoImport")
  }
  static getConfig(key){
    if (!this.config) {
      return false
    }
    if (this.config[key] !== undefined) {
      return this.config[key]
    }else{
      return this.defaultConfig[key]
    }
  }
  static hasAPIKeyInSource(source){
    switch (source) {
      case "Subscription":
        return chatAIUtils.isActivated()
      case "Deepseek":
        return this.getConfig("deepseekKey")
      case "ChatGLM":
        return this.getConfig("apikey")
      case "ChatGPT":
        return this.getConfig("openaiKey")
      case "KimiChat":
        return this.getConfig("moonshotKey")
      case "Minimax":
        return this.getConfig("miniMaxKey")
      case "Custom":
        return this.getConfig("customKey")
      case "Gemini":
        return this.getConfig("geminiKey")
      case "Claude":
        return this.getConfig("claudeKey")
      case "Qwen":
        return this.getConfig("qwenKey")
      case "SiliconFlow":
        return this.getConfig("siliconFlowKey")
      case "PPIO":
        return this.getConfig("ppioKey")
      case "Volcengine":
        return this.getConfig("volcengineKey")
      case "Github":
        return this.getConfig("githubKey")
      case "Metaso":
        return this.getConfig("metasoKey")
      default:
        return false
    }
  }
  static getAvailableModels(source){
    if (source) {
      return this.modelNames(source,true).map(model=>(source+": "+model.trim()))
    }else{
      let checkKey = true
      let allSource = this.allSource(false)
      let allModels = ["Default","Built-in"]
      allSource.forEach(source=>{
        let models = this.modelNames(source,checkKey).map(model=>(source+": "+model.trim()))
        allModels = allModels.concat(models)
      })
      return [...new Set(allModels)]
    }
  }
  static getAllConfig(){
    let config = {config:this.config,prompts:this.prompts,knowledge:this.knowledge,dynamicPrompt:this.dynamicPrompt,moonshotFileId:this.fileId}
    return config
  }
  static deepEqual(obj1, obj2) {
    if (obj1 === obj2) return true;

    if (typeof obj1 !== 'object' || obj1 === null ||
        typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }

    let keys1 = Object.keys(obj1);
    let keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (!keys2.includes(key)) {
            return false;
        }
        if (["modifiedTime","lastSyncTime","autoImport","autoExport"].includes(key)) {
          continue
        }
        // if (key === "currentPrompt") {
        //   MNUtil.copy(obj1[key]+":"	+ obj2[key])
        // }
        if (!this.deepEqual(obj1[key], obj2[key])) {
          return false;
        }
    }
    return true;
  }
  static setSyncStatus(onSync,success = false){
  try {
    this.onSync = onSync
    if (chatAIUtils.chatController) {
      if (onSync) {
        MNButton.setColor(chatAIUtils.chatController.moveButton, "#e06c75",0.5)
      }else{
        if (success) {
          MNButton.setColor(chatAIUtils.chatController.moveButton, "#30d36c",0.5)
          MNUtil.delay(1).then(()=>{
            MNButton.setColor(chatAIUtils.chatController.moveButton, "#3a81fb",0.5)
          })
        }else{
          MNButton.setColor(chatAIUtils.chatController.moveButton, "#3a81fb",0.5)
        }
      }
    }
  } catch (error) {
    MNUtil.showHUD(error)
  }
  }
  static isSameConfigWithLocal(config,alert = true){
  try {
    // MNUtil.copyJSON({remote:config,local:this.getAllConfig()})
    let same = this.deepEqual(config, this.getAllConfig())
    if (same && alert) {
      MNUtil.showHUD("Same config")
    }
    return same
  } catch (error) {
    return false
  }
  }
  /**
   * 
   * @param {MbBookNote} note
   */
  static expandesConfig(note,config,orderedKeys=undefined,exclude=undefined) {
    let keys
    if (orderedKeys) {
      keys = orderedKeys
    }else{
      keys = Object.keys(config)
    }
    keys.forEach((key)=>{
      let subConfig = config[key]
      if (typeof subConfig === "object") {
        let child = chatAIUtils.createChildNote(note,key)
        this.expandesConfig(child, subConfig,undefined,exclude)
      }else{
        if (exclude) {
          if (key !== exclude) {
            chatAIUtils.createChildNote(note,key,config[key])
          }
        }else{
          chatAIUtils.createChildNote(note,key,config[key])
        }
      }
    })
  }
  static getDefaultActionKeys() {
    let actions = this.getActions()
    return Object.keys(actions)
  }
  static save(key,ignoreExport = false,synchronize = true) {
    
    if (key === undefined) {//只保存最重要的
        this.config.modifiedTime = Date.now()
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.config,"MNChatglm_config")
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.prompts,"MNChatglm_prompts")
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.fileId,"MNChatglm_fileId")
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.knowledge,"MNChatglm_knowledge")
        NSUserDefaults.standardUserDefaults().setObjectForKey(this.dynamicPrompt,"MNChatglm_dynamicPrompt")
        if (!ignoreExport && chatAIUtils.isSubscribed(false) && this.getConfig("autoExport")) {
          this.export(false)
        }
    }else{
      if (Array.isArray(key)) {
        let changeModifiedTime = false
        key.forEach(k=>{
          switch (k) {
            case "MNChatglm_builtInKeys":
              NSUserDefaults.standardUserDefaults().setObjectForKey(this.keys,'MNChatglm_builtInKeys')
              break;
            case "MNChatglm_config":
              NSUserDefaults.standardUserDefaults().setObjectForKey(this.config,"MNChatglm_config")
              changeModifiedTime = true
              break;
            case "MNChatglm_modelConfig":
              NSUserDefaults.standardUserDefaults().setObjectForKey(this.modelConfig,"MNChatglm_modelConfig")
              break;
            case "MNChatglm_prompts":
              NSUserDefaults.standardUserDefaults().setObjectForKey(this.prompts,"MNChatglm_prompts")
              changeModifiedTime = true
              break;
            case "MNChatglm_fileId":
              NSUserDefaults.standardUserDefaults().setObjectForKey(this.fileId,"MNChatglm_fileId")
              break;
            case "MNChatglm_knowledge":
              NSUserDefaults.standardUserDefaults().setObjectForKey(this.knowledge,"MNChatglm_knowledge")
              changeModifiedTime = true
              break;
            case "MNChatglm_dynamicPrompt":
              NSUserDefaults.standardUserDefaults().setObjectForKey(this.dynamicPrompt,"MNChatglm_dynamicPrompt")
              changeModifiedTime = true
              break;
            case "MNChatglm_usage":
              NSUserDefaults.standardUserDefaults().setObjectForKey(this.usage,"MNChatglm_usage")
              break;
            default:
              MNUtil.showHUD("Not supported")
              break;
          }
        })
        if (changeModifiedTime) {
          this.config.modifiedTime = Date.now()
          if (!ignoreExport && chatAIUtils.isSubscribed(false) && this.getConfig("autoExport")) {
            this.export(false)
          }
        }
      }else{
      switch (key) {
        case "MNChatglm_builtInKeys":
          NSUserDefaults.standardUserDefaults().setObjectForKey(this.keys,'MNChatglm_builtInKeys')
          break;
        case "MNChatglm_config":
          NSUserDefaults.standardUserDefaults().setObjectForKey(this.config,"MNChatglm_config")
          this.config.modifiedTime = Date.now()
          if (!ignoreExport && chatAIUtils.isSubscribed(false) && this.getConfig("autoExport")) {
            this.export(false)
          }
          break;
        case "MNChatglm_modelConfig":
          NSUserDefaults.standardUserDefaults().setObjectForKey(this.modelConfig,"MNChatglm_modelConfig")
          break;
        case "MNChatglm_prompts":
          NSUserDefaults.standardUserDefaults().setObjectForKey(this.prompts,"MNChatglm_prompts")
          this.config.modifiedTime = Date.now()
          if (!ignoreExport && chatAIUtils.isSubscribed(false) && this.getConfig("autoExport")) {
            this.export(false)
          }
          break;
        case "MNChatglm_fileId":
          NSUserDefaults.standardUserDefaults().setObjectForKey(this.fileId,"MNChatglm_fileId")
          break;
        case "MNChatglm_knowledge":
          NSUserDefaults.standardUserDefaults().setObjectForKey(this.knowledge,"MNChatglm_knowledge")
          this.config.modifiedTime = Date.now()
          if (!ignoreExport && chatAIUtils.isSubscribed(false) && this.getConfig("autoExport")) {
            this.export(false)
          }
          break;
        case "MNChatglm_dynamicPrompt":
          NSUserDefaults.standardUserDefaults().setObjectForKey(this.dynamicPrompt,"MNChatglm_dynamicPrompt")
          this.config.modifiedTime = Date.now()
          if (!ignoreExport && chatAIUtils.isSubscribed(false) && this.getConfig("autoExport")) {
            this.export(false)
          }
          break;
        case "MNChatglm_usage":
          NSUserDefaults.standardUserDefaults().setObjectForKey(this.usage,"MNChatglm_usage")
          break;
        default:
          MNUtil.showHUD("Not supported")
          break;
      }
      }

    }
    if (synchronize) {
      NSUserDefaults.standardUserDefaults().synchronize()
    }
    if (this.backUpTimer) {//如果存在定时器，则取消定时器
      this.backUpTimer.invalidate()
      this.backUpTimer = undefined
    }
    //创建新的定时器
    this.backUpTimer = NSTimer.scheduledTimerWithTimeInterval(1, false, function () {
      chatAIConfig.backUpTimer.invalidate()
      chatAIConfig.backUpTimer = undefined
      chatAIConfig.backUp()
    });
  }
  static checkCloudStore(notificaiton = true){
    let iCloudSync = this.getConfig("syncSource") === "iCloud"
    if (iCloudSync &&!this.cloudStore) {
      this.cloudStore = NSUbiquitousKeyValueStore.defaultStore()
      if (notificaiton) {
        MNUtil.postNotification("NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI", {}) 
      }
    }
  }
  static initCloudStore(){
    this.cloudStore = NSUbiquitousKeyValueStore.defaultStore()
    MNUtil.postNotification("NSUbiquitousKeyValueStoreDidChangeExternallyNotificationUI", {})
  }
  static isValidTotalConfig(config){
    if (!config) {
      return false
    }
    let isVaild = ("config" in config && "prompts" in config && "knowledge" in config && "dynamicPrompt" in config)
    return isVaild
  }

  static importConfig(newConfig){
    if (this.isValidTotalConfig(newConfig)){
      this.previousConfig = this.getAllConfig()
      let autoImport = this.getConfig("autoImport")
      let autoExport = this.getConfig("autoExport")
      this.config = newConfig.config
      this.config.lastSyncTime = Date.now()
      this.config.autoImport = autoImport
      this.config.autoExport = autoExport
      // this.config.modifiedTime = Date.now()
      this.prompts = newConfig.prompts
      // MNUtil.copyJSON(prompts)
      this.knowledge = newConfig.knowledge
      this.dynamicPrompt = newConfig.dynamicPrompt
      if("moonshotFileId" in newConfig){
        this.fileId = newConfig.moonshotFileId
      }
      this.setCurrentPrompt(this.config.currentPrompt)
      this.saveAfterImport()
      this.setSyncStatus(false,true)
      if (chatAIUtils.notifyController) {
        chatAIUtils.notifyController.refreshCustomButton()
      }
      // MNUtil.log({message:"Import Config",source:"MN ChatAI",detail:newConfig})
      return true
    }else{
      this.setSyncStatus(false)
      return false
    }
  }
  static async readCloudConfig(msg = true,alert = false,force = false){
    this.checkCloudStore(false)
    if (force) {
      let cloudConfig = this.cloudStore.objectForKey("MNChatAI_totalConfig")
      let success = this.importConfig(cloudConfig)
      if (msg) {
        MNUtil.showHUD("Import from iCloud")
      }
      if (success) {
        if (alert) {
          MNUtil.showHUD("Import success!")
        }
        return true
      }else{
        MNUtil.showHUD("Invalid config in iCloud!")
        return false
      }
    }
    let iCloudSync = this.getConfig("syncSource") === "iCloud"
    if(!iCloudSync){
      return false
    }
    try {
      let cloudConfig = this.cloudStore.objectForKey("MNChatAI_totalConfig")
      // MNUtil.copy(cloudConfig)
      if (cloudConfig) {
        let same = this.deepEqual(cloudConfig, this.getAllConfig())
        if (same) {
          if (msg) {
            MNUtil.showHUD("Already synced")
          }
          return false
        }
        //要求云端的配置更新, 才能向本地写入
        //即使云端最旧的时间也要比本地最新的时候更新
        let localLatestTime = this.getLocalLatestTime()
        let localOldestTime = Math.min(this.config.lastSyncTime,this.config.modifiedTime)
        let cloudLatestTime = Math.max(cloudConfig.config.lastSyncTime,cloudConfig.config.modifiedTime)
        let cloudOldestTime = Math.min(cloudConfig.config.lastSyncTime,cloudConfig.config.modifiedTime)
        if (localLatestTime < cloudOldestTime) {
          if (alert) {
            let confirm = await MNUtil.confirm("MN ChatAI\nImport from iCloud?","是否导入iCloud配置？")
            if (!confirm) {
              return false
            }
          }
          if (msg) {
            MNUtil.showHUD("Import from iCloud")
          }
          let success = this.importConfig(cloudConfig)
          if (success) {
            if (alert) {
              MNUtil.showHUD("Import success!")
            }
            return true
          }else{
            MNUtil.showHUD("Invalid config in iCloud!")
            return false
          }
        }
        if (this.config.modifiedTime > (cloudConfig.config.modifiedTime+1000)) {
          if (alert) {
            let confirm = await MNUtil.confirm("MN ChatAI\n Uploading to iCloud?","📤 是否上传配置到iCloud？")
            if (!confirm) {
              return false
            }
          }
          this.writeCloudConfig(msg)
          return false
        }
        let userSelect = await MNUtil.userSelect("MN ChatAI\n Conflict config, import or export?","配置冲突，请选择操作",["📥 Import / 导入","📤 Export / 导出"])
        switch (userSelect) {
          case 0:
            MNUtil.showHUD("User Cancel")
            return false
          case 1:
            let success = this.importConfig(cloudConfig)
            if (success) {
              if (alert) {
                MNUtil.showHUD("Import success!")
              }
              return true
            }else{
              MNUtil.showHUD("Invalid config in iCloud!")
              return false
            }
          case 2:
            this.writeCloudConfig(msg,true)
            return false
          default:
            return false
        }
      }else{
        let confirm = await MNUtil.confirm("MN ChatAI\nEmpty config in iCloud, uploading?","iCloud配置为空,是否上传？")
        if (!confirm) {
          return false
        }
        this.writeCloudConfig(msg)
        if (msg) {
          MNUtil.showHUD("No config in iCloud, uploading...")
        }
        return false
      }
    } catch (error) {
      chatAIUtils.addErrorLog(error, "readCloudConfig")
      return false
    }
  }
  static writeCloudConfig(msg = true,force = false){
    // if (!chatAIUtils.checkSubscribe(false,msg,true)) {
    //   return false
    // }
    this.checkCloudStore(false)
    if (force) {
      this.config.lastSyncTime = Date.now()
      // this.config.modifiedTime = Date.now()
      let config = this.getAllConfig()
      this.cloudStore.setObjectForKey(config,"MNChatAI_totalConfig")
      this.config.lastSyncTime = Date.now()
      return this
    }
    let iCloudSync = this.getConfig("syncSource") === "iCloud"
    if(!iCloudSync){
      return false
    }
    let cloudConfig = this.cloudStore.objectForKey("MNChatAI_totalConfig")
    if (cloudConfig) {
      let same = this.isSameConfigWithLocal(cloudConfig)
      if (same) {
        //如果同步配置相同,不应该向云端写入
        return false
      }
      //如果云端的更新,那么不应该向云端写入
      let localLatestTime = Math.max(this.config.lastSyncTime,this.config.modifiedTime)
      let cloudOldestTime = Math.min(cloudConfig.config.lastSyncTime,cloudConfig.config.modifiedTime)
      if (localLatestTime < cloudOldestTime) {
        let localTime = Date.parse(localLatestTime).toLocaleString()
        let cloudTime = Date.parse(cloudOldestTime).toLocaleString()
        MNUtil.showHUD("Conflict config: local_"+localTime+", cloud_"+cloudTime)
        return false
      }
    }
    this.config.lastSyncTime = Date.now()
    // this.config.modifiedTime = Date.now()
    let config = this.getAllConfig()
    this.cloudStore.setObjectForKey(config,"MNChatAI_totalConfig")
    this.config.lastSyncTime = Date.now()
    // this.config.modifiedTime = Date.now()
    return true
  }
  static getSyncSourceString(){
    switch (this.getConfig("syncSource")) {
      case "MNNote":
        return "MNNote"
      case "CFR2":
        return "Cloudflare R2"
      case "Infi":
        return "InfiniCloud"
      case "Webdav":
        return "Webdav"
      case "iCloud":
        return "iCloud"
      case "None":
        return "None"
      default:
        break;
    }
    return undefined
  }
   static async checkR2Password(){
    if (!this.getConfig("r2password")) {
      let res = await MNUtil.input("Passward for Config","设置云端配置文件加密密码",["Cancel","Confirm"])
      if (!res.button) {
        MNUtil.showHUD("User Cancel")
        return false
      }
      if (res.input && res.input.trim()) {
        this.config.r2password = res.input
        this.save("MNChatglm_config",true)
        return true
      }else{
        return false
      }
    }
    return true
  }
   static async checkInfiPassword(){
    if (!this.getConfig("InfiPassword")) {
      let res = await MNUtil.input("Passward for Config","设置云端配置文件加密密码",["Cancel","Confirm"])
      if (!res.button) {
        MNUtil.showHUD("User Cancel")
        return false
      }
      if (res.input && res.input.trim()) {
        this.config.InfiPassword = res.input
        this.save("MNChatglm_config",true)
        return true
      }else{
        return false
      }
    }
    return true
  }
  static async checkWebdavAccount(force = false){
    // MNUtil.copyJSON(this.config)
    let shouldSave = false
    if (force || !this.getConfig("webdavFolder")) {
      let res = await MNUtil.input("Folder for Webdav","输入webdav文件夹",["Cancel","Confirm"])
      if (!res.button) {
        MNUtil.showHUD("User Cancel")
        return false
      }
      if (res.input && res.input.trim()) {
        if (res.input.endsWith("/")) {
          this.config.webdavFolder = res.input
        }else{
          this.config.webdavFolder = res.input + "/"
        }
      }else{
        return false
      }
      shouldSave = true
    }
    if (force || !this.getConfig("webdavUser")) {
      let res = await MNUtil.input("UserName for Webdav","输入webdav用户名",["Cancel","Confirm"])
      if (!res.button) {
        MNUtil.showHUD("User Cancel")
        return false
      }
      if (res.input && res.input.trim()) {
        this.config.webdavUser = res.input
      }else{
        return false
      }
      shouldSave = true
    }
    if (force || !this.getConfig("webdavPassword")) {
      let res = await MNUtil.input("Passward for Webdav","输入webdav密码",["Cancel","Confirm"])
      if (!res.button) {
        MNUtil.showHUD("User Cancel")
        return false
      }
      if (res.input && res.input.trim()) {
        this.config.webdavPassword = res.input
      }else{
        return false
      }
      shouldSave = true
    }
    if (shouldSave) {
      MNUtil.showHUD("Save Webdav account...")
      this.save("MNChatglm_config",true)
    }
    return true
  }
  static async export(alert = true,force = false){
  try {

    if (!chatAIUtils.checkSubscribe(true)) {
      return false
    }
    // MNUtil.copyJSON(this.getAllConfig())
    // return
    if (this.onSync) {
      MNUtil.showHUD("onSync")
      return
    }
    let syncSource = this.getConfig("syncSource")
    this.setSyncStatus(true)
    if (force) {
      switch (syncSource) {
        case "None":
          this.setSyncStatus(false,false)
          return false
        case "iCloud":
          let success = this.writeCloudConfig(true,true)
          this.setSyncStatus(false,success)
          return;
        case "MNNote":
          let noteId = this.getConfig("syncNoteId")
          let latestTime = this.getLocalLatestTime()
          let focusNote = MNNote.new(noteId)
          if (!focusNote) {
            focusNote = chatAIUtils.getFocusNote()
          }
          if (!focusNote) {
            this.setSyncStatus(false)
            MNUtil.showHUD("No focus note")
            return false
          }
          let modifiedDate = Date.parse(focusNote.modifiedDate ?? focusNote.createDate)
          let confirm = false
          if (latestTime > modifiedDate) {
            confirm = true
          }else{
            if (alert) {
              confirm = await MNUtil.confirm("MN ChatAI\nNewer config from note!\n卡片配置较新！","Overwrite?\n是否覆盖？")
            }
          }
          if (!confirm) {
            this.setSyncStatus(false)
            return false
          }
          this.config.lastSyncTime = Date.now()+5
          // this.config.modifiedTime = this.config.lastSyncTime
          this.config.syncNoteId = focusNote.noteId
          if (chatAIUtils.chatController) {
            chatAIUtils.chatController.configNoteIdInput.text = focusNote.noteId
          }
          this.export2MNNote(focusNote)
          this.setSyncStatus(false,true)
          return true
        case "CFR2":
          this.setSyncStatus(true)
          this.config.lastSyncTime = Date.now()+5
          // this.config.modifiedTime = this.config.lastSyncTime
          if (alert) {
            MNUtil.showHUD("Uploading...")
          }
          await chatAIConfig.uploadConfigWithEncryptionFromR2(this.config.r2file, this.config.r2password, alert)
          // MNUtil.copyJSON(this.config)
          this.setSyncStatus(false,true)
          return true
        case "Infi":
          this.setSyncStatus(true)
          this.config.lastSyncTime = Date.now()+5
          // this.config.modifiedTime = this.config.lastSyncTime
          if (alert) {
            MNUtil.showHUD("Uploading...")
          }
          await chatAIConfig.uploadConfigWithEncryptionToInfi(this.config.InfiFile, this.config.InfiPassword, alert)
          // MNUtil.copyJSON(this.config)
          this.setSyncStatus(false,true)
          return true
        case "Webdav":
        try {
          this.setSyncStatus(true)
          this.config.lastSyncTime = Date.now()+5
          // this.config.modifiedTime = this.config.lastSyncTime
          if (alert) {
            MNUtil.showHUD("Uploading...")
          }
          let authorization = {
            user:this.getConfig("webdavUser"),
            password:this.getConfig("webdavPassword")
          }
          let res = await chatAIConfig.uploadConfigToWebdav(this.config.webdavFile+".json", authorization)
          if (typeof res === "object" && "statusCode" in res && res.statusCode >= 400) {
            MNUtil.showHUD("Error when export.uploadConfigToWebdav: "+res.statusCode)
            MNUtil.copyJSON(res)
            this.setSyncStatus(false)
            return false
          }
          // MNUtil.copyJSON(this.config)
          this.setSyncStatus(false,true)
          return true
        } catch (error) {
          MNUtil.showHUD(error)
          this.setSyncStatus(false,false)
          return true
        }
      }
      return true
    }
    let remoteConfig = await this.getCloudConfigFromSource(syncSource, alert)
    if (remoteConfig && chatAIConfig.isSameConfigWithLocal(remoteConfig,alert)) {
      this.setSyncStatus(false)
      return false
    }
    switch (syncSource) {
      case "None":
        this.setSyncStatus(false,false)
        return false
      case "iCloud":
        let success = this.writeCloudConfig(false,true)
        this.setSyncStatus(false,success)
        return;
      case "MNNote":
        let noteId = this.getConfig("syncNoteId")
        let latestTime = this.getLocalLatestTime()
        let focusNote = MNNote.new(noteId)
        if (!focusNote) {
          focusNote = chatAIUtils.getFocusNote()
        }
        if (!focusNote) {
          this.setSyncStatus(false)
          MNUtil.showHUD("No focus note")
          return false
        }
        let modifiedDate = Date.parse(focusNote.modifiedDate ?? focusNote.createDate)
        let confirm = false
        if (latestTime > modifiedDate) {
          confirm = true
        }else{
          if (alert) {
            confirm = await MNUtil.confirm("MN ChatAI\nNewer config from note!\n卡片配置较新！","Overwrite?\n是否覆盖？")
          }
        }
        if (!confirm) {
          this.setSyncStatus(false)
          return false
        }
        this.config.lastSyncTime = Date.now()+5
        // this.config.modifiedTime = this.config.lastSyncTime
        this.config.syncNoteId = focusNote.noteId
        if (chatAIUtils.chatController) {
          chatAIUtils.chatController.configNoteIdInput.text = focusNote.noteId
        }
        this.export2MNNote(focusNote)
        this.setSyncStatus(false,true)
        return true
      case "CFR2":
        this.setSyncStatus(true)
        if (remoteConfig && remoteConfig.config && remoteConfig.config.modifiedTime > this.config.modifiedTime) {
          if (alert) {
            let confirm = await MNUtil.confirm("MN ChatAI\nNewer config from R2!\nR2配置较新！","Overwrite remote config?\n是否覆盖远程配置？")
            if (!confirm) {
              this.setSyncStatus(false)
              return false
            }
          }else{
            this.setSyncStatus(false)
            return false
          }
        }
        this.config.lastSyncTime = Date.now()+5
        // this.config.modifiedTime = this.config.lastSyncTime
        if (alert) {
          MNUtil.showHUD("Uploading...")
        }
        await chatAIConfig.uploadConfigWithEncryptionFromR2(this.config.r2file, this.config.r2password, alert)
        // MNUtil.copyJSON(this.config)
        this.setSyncStatus(false,true)
        return true
      case "Infi":
        this.setSyncStatus(true)
        if (remoteConfig && remoteConfig.config && remoteConfig.config.modifiedTime > this.config.modifiedTime) {
          if (alert) {
            let confirm = await MNUtil.confirm("MN ChatAI\nNewer config from InfiniCloud!\nInfiniCloud配置较新！","Overwrite remote config?\n是否覆盖远程配置？")
            if (!confirm) {
              this.setSyncStatus(false)
              return false
            }
          }else{
            this.setSyncStatus(false)
            return false
          }
        }
        this.config.lastSyncTime = Date.now()+5
        // this.config.modifiedTime = this.config.lastSyncTime
        if (alert) {
          MNUtil.showHUD("Uploading...")
        }
        await chatAIConfig.uploadConfigWithEncryptionToInfi(this.config.InfiFile, this.config.InfiPassword, alert)
        // MNUtil.copyJSON(this.config)
        this.setSyncStatus(false,true)
        return true
      case "Webdav":
      try {
        this.setSyncStatus(true)
        if (!Object.keys(remoteConfig).length || ("statusCode" in remoteConfig && (remoteConfig.statusCode >= 400 && remoteConfig.statusCode != 404 ))) {
          // chatAIUtils.addErrorLog(error, "export",remoteConfig.statusCode)
          MNUtil.showHUD("Error when export.readConfigFromWebdav: "+remoteConfig.statusCode)
          // MNUtil.copyJSON(remoteConfig)
          this.setSyncStatus(false)
          return false
        }
        if (remoteConfig && remoteConfig.config && remoteConfig.config.modifiedTime > this.config.modifiedTime) {
          if (alert) {
            let confirm = await MNUtil.confirm("MN ChatAI\nNewer config from Webdav!\nWebdav配置较新！","Overwrite remote config?\n是否覆盖远程配置？")
            if (!confirm) {
              this.setSyncStatus(false)
              return false
            }
          }else{
            this.setSyncStatus(false)
            return false
          }
        }

        this.config.lastSyncTime = Date.now()+5
        // this.config.modifiedTime = this.config.lastSyncTime
        if (alert) {
          MNUtil.showHUD("Uploading...")
        }
        let authorization = {
          user:this.getConfig("webdavUser"),
          password:this.getConfig("webdavPassword")
        }
        let res = await chatAIConfig.uploadConfigToWebdav(this.config.webdavFile+".json", authorization)
        if (typeof res === "object" && "statusCode" in res && res.statusCode >= 400) {
          MNUtil.showHUD("Error when export.uploadConfigToWebdav: "+res.statusCode)
          MNUtil.copyJSON(res)
          this.setSyncStatus(false)
          return false
        }
        // MNUtil.copyJSON(this.config)
        this.setSyncStatus(false,true)
        return true
      } catch (error) {
        MNUtil.showHUD(error)
        this.setSyncStatus(false,false)
        return true
      }
    }
    
  } catch (error) {
    chatAIUtils.addErrorLog(error, "export")
  }
    // chatAIConfig.his.push("export")
    // MNUtil.showHUD("his: "+chatAIConfig.his.length)
    // MNUtil.copyJSON(chatAIConfig.his)
    // MNUtil.showHUD("export")


    // MNUtil.copyJSON(config)
  }
  /**
   * 只负责获取配置和检查配置格式是否正确,不负责检查版本
   * @param {string} syncSource 
   * @param {boolean} alert 
   * @returns 
   */
  static async getCloudConfigFromSource(syncSource,alert){
    try {
    let config = undefined
    switch (syncSource) {
      case "None":
        return undefined
      case "iCloud":
        this.checkCloudStore(false)
        config = this.cloudStore.objectForKey("MNChatAI_totalConfig")
        break;
      case "MNNote":
        let noteId = this.getConfig("syncNoteId")
        // if (!noteId.trim()) {
        //   return undefined
        // }
        let focusNote = MNNote.new(noteId)
        if (!focusNote) {
          focusNote = chatAIUtils.getFocusNote()
        }
        if (!focusNote) {
          MNUtil.showHUD("Note not exists!")
          return undefined
        }
        if (chatAIUtils.chatController) {
          chatAIUtils.chatController.configNoteIdInput.text = focusNote.noteId
        }
        if (focusNote.noteTitle !== "MN ChatAI Config") {
          MNUtil.showHUD("Invalid note title!")
          this.setSyncStatus(false)
          return undefined
        }
        let contentToParse = focusNote.excerptText
        if (/```JSON/.test(contentToParse)) {
          contentToParse = chatAIUtils.extractJSONFromMarkdown(contentToParse)
        }
        if (!MNUtil.isValidJSON(contentToParse)) {
          MNUtil.showHUD("Invalid Config")
          return undefined
        }
        config = JSON.parse(contentToParse)
        break;
      case "CFR2":
        if (!chatAIConfig.getConfig("r2file")) {
          MNUtil.showHUD("No Config file")
          return undefined
        }
        let hasPassword = await this.checkR2Password()
        if (!hasPassword) {
          MNUtil.showHUD("No Password")
          return undefined
        }
        if (alert) { MNUtil.showHUD("Downloading...") }
        config = await chatAIConfig.readEncryptedConfigFromR2(chatAIConfig.config.r2file, chatAIConfig.config.r2password)
        break;
      case "Infi":
        if (!chatAIConfig.getConfig("InfiFile")) {
          MNUtil.showHUD("No Config file")
          return undefined
        }

        let hasInfiPassword = await this.checkInfiPassword()
        if (!hasInfiPassword) {
          MNUtil.showHUD("No Password")
          return undefined
        }
        if (alert) { MNUtil.showHUD("Downloading...") }
        config = await chatAIConfig.readEncryptedConfigFromInfi(chatAIConfig.config.InfiFile, chatAIConfig.config.InfiPassword)
        break;
      case "Webdav":
        if (!chatAIConfig.getConfig("webdavFile")) {
          MNUtil.showHUD("No Config file")
          return undefined
        }
        let hasAccount = await this.checkWebdavAccount()
        if (!hasAccount) {
          MNUtil.showHUD("No Account")
          return undefined
        }
        if (alert) { MNUtil.showHUD("Downloading...") }
        let authorization = {
          user:this.getConfig("webdavUser"),
          password:this.getConfig("webdavPassword")
        }
        config = await chatAIConfig.readConfigFromWebdav(chatAIConfig.config.webdavFile+".json",authorization)
        if (!Object.keys(config).length || ("statusCode" in config && config.statusCode >= 400)) {
          MNUtil.showHUD("Error when getCloudConfig: "+config.statusCode)
          MNUtil.copyJSON(config)
          return undefined
        }
        break;
    }
    if (this.isValidTotalConfig(config)) {
      return config
    }
    return undefined
    } catch (error) {
      chatAIUtils.addErrorLog(error, "getCloudConfigFromSource",syncSource)
      return undefined
    }
  }
  static getLocalLatestTime(){
    let lastSyncTime = this.config.lastSyncTime ?? 0
    let modifiedTime = this.config.modifiedTime ?? 0
    return Math.max(lastSyncTime,modifiedTime)
  }
  static async import(alert = true,force = false){
    if (!chatAIUtils.checkSubscribe(true)) {
      return false
    }
    if (this.onSync) {
      if (alert) {
        MNUtil.showHUD("onSync")
      }
      return false
    }
    let syncSource = this.getConfig("syncSource")
    // if (syncSource === "iCloud") {
    //   return false
    // }
    this.setSyncStatus(true)
    // MNUtil.showHUD("Importing...")
    let config = await this.getCloudConfigFromSource(syncSource, alert)
    if (force) {
      // MNUtil.copy(typeof config)
      let success = this.importConfig(config)
      if (success) {
        if (alert) {
          MNUtil.showHUD("Import success!")
        }
        return true
      }else{
        MNUtil.showHUD("Invalid config in note!")
        return false
      }
    }
    // MNUtil.showHUD("Importing123...")

    if (!config || chatAIConfig.isSameConfigWithLocal(config,alert)) {
      this.setSyncStatus(false)
      return false
    }
    let localLatestTime = this.getLocalLatestTime()
    let cloudOldestTime = Math.min(config.config.lastSyncTime,config.config.modifiedTime)
    let confirm = true
    //导入前检查配置是否正确
    //即使云端最旧的时间也要比本地最新的时候更新,否则需要用户确认
    if (localLatestTime > cloudOldestTime && alert) {
      let OverWriteOption = "Overwrite?\n是否覆盖？"
      switch (syncSource) {
        case "None":
          return false
        case "iCloud":
          confirm = await MNUtil.confirm("MN ChatAI\nOlder config from iCloud!\niCloud配置较旧！",OverWriteOption)
          break;
        case "MNNote":
          confirm = await MNUtil.confirm("MN ChatAI\nOlder config from note!\n卡片配置较旧！",OverWriteOption)
          break;
        case "CFR2":
          confirm = await MNUtil.confirm("MN ChatAI\nOlder config from R2!\nR2配置较旧！",OverWriteOption)
          break;
        case "Infi":
          confirm = await MNUtil.confirm("MN ChatAI\nOlder config from InfiniCloud!\nInfiniCloud配置较旧！","Overwrite local config?\n是否覆盖本地配置？")
          break;
        case "Webdav":
          confirm = await MNUtil.confirm("MN ChatAI\nOlder config from Webdav!\nWebdav配置较旧！","Overwrite local config?\n是否覆盖本地配置？")
          break;
      }
    }
    if (!confirm) {
      this.setSyncStatus(false)
      return false
    }

    let success = this.importConfig(config)
    if (success) {
      if (alert) {
        MNUtil.showHUD("Import success!")
      }
      return true
    }else{
      MNUtil.showHUD("Invalid config in note!")
      return false
    }
  }
  static saveAfterImport(){
    this.save("MNChatglm_dynamicPrompt",true)
    this.save("MNChatglm_knowledge",true)
    this.save("MNChatglm_prompts",true)
    this.save("MNChatglm_config",true)
  }
  static async sync(){
    let success
    let syncSource = this.getConfig("syncSource")
    switch (syncSource) {
      case "None":
        return false
      case "iCloud":
        success = await this.readCloudConfig(true)
        break;
      case "MNNote":
        success = await this.syncForMNNote()
        break;
      case "CFR2":
        success = await this.syncForCFR2()
        break;
      case "Infi":
        success = await this.syncForInfi()
        break;
      case "Webdav":
        success = await this.syncForWebdav()
        break;
    }
    if (success && this.chatController) {
      this.chatController.refreshLastSyncTime()
    }
  
  }
  /**
   * 
   * @param {MNNote} focusNote 
   */
  static export2MNNote(focusNote){
    this.config.lastSyncTime = Date.now()+5
    this.config.syncNoteId = focusNote.noteId
    let config = this.getAllConfig()
    MNUtil.undoGrouping(()=>{
      focusNote.excerptText = "```JSON\n"+JSON.stringify(config,null,2)+"\n```"
      focusNote.noteTitle = "MN ChatAI Config"
      focusNote.excerptTextMarkdown = true
    })
  }
 static async syncForMNNote(alert = false){
 try {

    if (!chatAIUtils.checkSubscribe(true)) {
      return false
    }
    let noteId = this.config.syncNoteId
    let latestTime = this.getLocalLatestTime()
    let focusNote = MNNote.new(noteId)
    if (!focusNote) {
      focusNote = chatAIUtils.getFocusNote()
    }
    let noteConfig = this.getCloudConfigFromSource("MNNote", alert)
    let modifiedDate = Date.parse(focusNote.modifiedDate ?? focusNote.createDate)
    if (noteConfig && latestTime < modifiedDate) {//导入
      this.setSyncStatus(true)
      let success = this.importConfig(noteConfig)
      if (success) {
        MNUtil.showHUD("Sync Success (import)!")
      }
      return success
    }else{//导出
      this.setSyncStatus(true)
      // MNUtil.showHUD("should export")
      // this.config.lastSyncTime = Date.now()+5
      // this.config.syncNoteId = focusNote.noteId
      this.export2MNNote(focusNote)
      chatAIUtils.chatController.refreshView("syncView")
      MNUtil.showHUD("Sync Success (export)!")
      this.setSyncStatus(false,true)
      return true
    }
 } catch (error) {
  chatAIUtils.addErrorLog(error, "SyncForMNNote")
  return false
 }
 }
 static async syncForCFR2(alert = false){
 try {

    if (!chatAIUtils.checkSubscribe(true)) {
      return false
    }
    this.setSyncStatus(true)
    let latestTime = this.getLocalLatestTime()
    let modifiedDate = 0
    let R2Config = this.getCloudConfigFromSource("CFR2", alert)
    if (R2Config && latestTime < modifiedDate) {      
      this.setSyncStatus(true)
      let success = this.importConfig(R2Config)
      if (success) {
        MNUtil.showHUD("Sync Success (import)!")
      }
      return success
    }else{
      // if (!this.getConfig("r2file")) {
      //   let fileName = NSUUID.UUID().UUIDString()
      //   this.config.r2file = fileName
      //   chatAIUtils.chatController.configNoteIdInput.text = fileName
      // }
      // this.config.lastSyncTime = Date.now()+5
      // this.config.modifiedTime = this.config.lastSyncTime
      
      MNUtil.showHUD("Uploading...")
      await this.uploadConfigWithEncryptionFromR2(this.config.r2file, this.config.r2password)
      // MNUtil.copyJSON(this.config)
      MNUtil.showHUD("Sync Success (export)!")
      this.setSyncStatus(false,true)
      return true
    }
 } catch (error) {
  this.setSyncStatus(false)
  chatAIUtils.addErrorLog(error, "SyncForCFR2")
 }
 }
 static async syncForInfi(alert = false){
 try {

    if (!chatAIUtils.checkSubscribe(true)) {
      return false
    }
    this.setSyncStatus(true)
    let latestTime = this.getLocalLatestTime()
    let modifiedDate = 0
    let InfiConfig = this.getCloudConfigFromSource("Infi", alert)
    if (InfiConfig && latestTime < modifiedDate) {
      this.setSyncStatus(true)
      let success = this.importConfig(InfiConfig)
      if (success) {
        MNUtil.showHUD("Sync Success (import)!")
      }
      return success
    }else{
      // if (!this.getConfig("InfiFile")) {
      //   let fileName = NSUUID.UUID().UUIDString()
      //   this.config.InfiFile = fileName
      //   chatAIUtils.chatController.configNoteIdInput.text = fileName
      // }

      // this.config.lastSyncTime = Date.now()+5
      // this.config.modifiedTime = this.config.lastSyncTime
      
      MNUtil.showHUD("Uploading...")
      await this.uploadConfigWithEncryptionToInfi(this.config.InfiFile, this.config.InfiPassword)
      // MNUtil.copyJSON(this.config)
      MNUtil.showHUD("Sync Success (export)!")
      this.setSyncStatus(false,true)
      return true
    }
 } catch (error) {
  this.setSyncStatus(false)
  chatAIUtils.addErrorLog(error, "SyncForInfi")
 }
 }
  static async syncForWebdav(alert = false){
 try {

    if (!chatAIUtils.checkSubscribe(true)) {
      return false
    }
    this.setSyncStatus(true)
    let latestTime = this.getLocalLatestTime()
    let modifiedDate = 0
    let remoteConfig = this.getCloudConfigFromSource("Webdav", alert)
    if (remoteConfig && latestTime < modifiedDate) {
      // MNUtil.showHUD("should import")
      this.setSyncStatus(true)
      let success = this.importConfig(remoteConfig)
      if (success) {
        MNUtil.showHUD("Sync Success (import)!")
      }
      return success
    }else{
      // if (!this.getConfig("webdavFile")) {
      //   let fileName = NSUUID.UUID().UUIDString()
      //   this.config.webdavFile = fileName
      //   chatAIUtils.chatController.configNoteIdInput.text = fileName
      // }

      // this.config.lastSyncTime = Date.now()+5
      // this.config.modifiedTime = this.config.lastSyncTime
      
      MNUtil.showHUD("Uploading...")
      let authorization = {
        user:this.getConfig("webdavUser"),
        password:this.getConfig("webdavPassword")
      }
      let res = await this.uploadConfigToWebdav(this.config.webdavFile+".json", authorization)
      if (typeof res === "object" && "statusCode" in res && res.statusCode >= 400) {
        MNUtil.showHUD("Error when export.uploadConfigToWebdav: "+res.statusCode)
        MNUtil.copyJSON(res)
        this.setSyncStatus(false)
        return false
      }
      // MNUtil.copyJSON(this.config)
      MNUtil.showHUD("Sync Success (export)!")
      this.setSyncStatus(false,true)
      return true
    }
 } catch (error) {
  chatAIUtils.addErrorLog(error, "SyncForWebdav")
  this.setSyncStatus(false)
 }
 }
  static get(key) {
    return NSUserDefaults.standardUserDefaults().objectForKey(key)
  }

  static getByDefault(key,defaultValue,backUpFile) {//记得在remove中增加备份文件的删除
    let value = NSUserDefaults.standardUserDefaults().objectForKey(key)
    if (value === undefined) {
      if (backUpFile && MNUtil.isfileExists(backUpFile)) {//需要检查备份文件
        let backupConfig = MNUtil.readJSON(backUpFile)
        if (backupConfig && Object.keys(backupConfig).length > 0) {
          MNUtil.log("backupConfig.readFromBackupFile")
          return backupConfig
        }
      }
      NSUserDefaults.standardUserDefaults().setObjectForKey(defaultValue,key)
      return defaultValue
    }
    return value
  }

  static remove(key) {
    NSUserDefaults.standardUserDefaults().removeObjectForKey(key)
  }
  static reset(){
    this.prompts = this.defaultPrompts
    this.config.promptNames = Object.keys(this.prompts)
    this.config.dynamic = false
    this.dynamicPrompt = this.defaultDynamicPrompt
    this.setCurrentPrompt(this.config.promptNames[0])
    this.save('MNChatglm_config')
    this.save('MNChatglm_prompts')
    this.save("MNChatglm_dynamicPrompt")
  }
  static setCurrentPrompt(prompt,save = true){
    this.currentPrompt = prompt//是promptKey
    this.config.currentPrompt = prompt
    this.currentFunc = this.prompts[this.currentPrompt].func ?? []
    this.currentAction = this.prompts[this.currentPrompt].action ?? []
    this.currentModel = this.prompts[this.currentPrompt].model ?? "Default"
    this.currentTitle = this.prompts[this.currentPrompt].title
    if (save) {
      NSUserDefaults.standardUserDefaults().setObjectForKey(this.config,"MNChatglm_config")
    }
  }
  static getUsage() {
    let today = chatAIUtils.getToday()
    this.usage.limit = 100
    if (today !== this.usage.day) {
      this.usage.usage = 0
      this.usage.day = today
    }
    return this.usage
  }
  static allSource(withBuiltIn = false,checkKey = false){
    let allSources = ['Subscription','ChatGPT','ChatGLM','KimiChat','Minimax','Deepseek','SiliconFlow','PPIO','Github','Qwen','Volcengine','Claude','Gemini','Metaso','Custom']
    if (checkKey) {
      allSources = allSources.filter(source=>this.hasAPIKeyInSource(source))
    }
    if (withBuiltIn) {
      allSources.unshift("Built-in")
    }
    return allSources
  }
  static sourceKeyName(source){
    switch (source) {
      case "Deepseek":
        return "deepseekKey"
      case "ChatGLM":
        return "apikey"
      case "ChatGPT":
        return "openaiKey"
      case "KimiChat":
        return "moonshotKey"
      case "Minimax":
        return "miniMaxKey"
      case "Custom":
        return "customKey"
      case "Gemini":
        return "geminiKey"
      case "Claude":
        return "claudeKey"
      case "Qwen":
        return "qwenKey"
      case "SiliconFlow":
        return "siliconFlowKey"
      case "PPIO":
        return "ppioKey"
      case "Volcengine":
        return "volcengineKey"
      case "Github":
        return "githubKey"
      case "Metaso":
        return "metasoKey"
      default:
        return ""
    }
  }
  /**
   * 
   * @param {string} source 提供商
   * @param {boolean} checkKey 
   * @returns 
   */
  static modelNames(source,checkKey = false){
    let models
    let additionalModels = []
    if (checkKey && !this.hasAPIKeyInSource(source)) {//如果对应的提供商的key不存在,就不返回任何模型
      return []
    }
    let modelConfig = (source in this.modelConfig)?this.modelConfig:this.defaultModelConfig
    switch (source) {
      case "Volcengine":
        return modelConfig["Volcengine"]
      case "SiliconFlow":
        return modelConfig["SiliconFlow"]
      case "PPIO":
        return modelConfig["PPIO"]
      case "Github":
        return modelConfig["Github"]
      case "Metaso":
        return modelConfig["Metaso"]
      case "ChatGLM":
        return modelConfig["ChatGLM"]
      case "Gemini":
        return modelConfig["Gemini"]
      case "ChatGPT":
        models = modelConfig["ChatGPT"]
        if (this.config.customModel.trim()) {
          additionalModels = this.config.customModel.split(",").map(model=>model.trim()).filter(model=>!models.includes(model))
        }
        return models.concat(additionalModels)
      case "Subscription":
        models = modelConfig["Subscription"]
        if (this.config.customModel.trim()) {
          additionalModels = this.config.customModel.split(",").map(model=>model.trim()).filter(model=>!models.includes(model))
        }
        return models.concat(additionalModels)
      case "KimiChat":
        return modelConfig["KimiChat"]
      case "Claude":
        return modelConfig["Claude"]
      case "Minimax":
        return modelConfig["Minimax"]
      case "Deepseek":
        return modelConfig["Deepseek"]
      case "Qwen":
        return modelConfig["Qwen"]
      case "Custom":
        return this.config.customModel.split(",").map(model=>model.trim())
      case "Built-in":
        return [];
      default:
        MNUtil.showHUD("Unspported source: "+source)
        return []
    }
  }
  static saveApiKey(apikey,url){
    MNUtil.showHUD("Save APIKey for "+this.config.source)
    switch (this.config.source) {
      case "ChatGLM":
        this.config.apikey = apikey
        break;
      case "Claude":
        this.config.claudeKey = apikey
        break;
      case "Gemini":
        this.config.geminiKey = apikey
        if (url) {
          this.config.geminiUrl = url
        }
        break;
      case "SiliconFlow":
        this.config.siliconFlowKey = apikey
        break;
      case "PPIO":
        this.config.ppioKey = apikey
        break;
      case "Volcengine":
        this.config.volcengineKey = apikey
        break;
      case "Github":
        this.config.githubKey = apikey
        break;
      case "Metaso":
        this.config.metasoKey = apikey
        break;
      case "ChatGPT":
        this.config.openaiKey = apikey
        if (url) {
          this.config.url = url
        }
        break;
      case "KimiChat":
        this.config.moonshotKey = apikey
        break;
      case "Minimax":
        this.config.miniMaxKey = apikey
        break
      case "Deepseek":
        this.config.deepseekKey = apikey
        break
      case "Qwen":
        this.config.qwenKey = apikey
        break
      case "Custom":
        this.config.customKey = apikey
        if (url) {
          this.config.customUrl = url
        }
        break
      default:
        MNUtil.showHUD("Unspported source: "+this.config.source)
        return
    }
    NSUserDefaults.standardUserDefaults().setObjectForKey(this.config,"MNChatglm_config")
    if (chatAIUtils.isSubscribed(false) && this.getConfig("autoExport")) {
      this.export(false)
    }
  }
  static setDynamicModel(source, model, save = true){
    switch (source) {
      case "ChatGLM":
      case "Claude":
      case "Gemini":
      case "SiliconFlow":
      case "PPIO":
      case "Volcengine":
      case "Github":
      case "Metaso":
      case "ChatGPT":
      case "KimiChat":
      case "Minimax":
      case "Deepseek":
      case "Qwen":
      case "Custom":
      case "Subscription":
        if (!model) {
          model = this.getDefaultModel(source)
        }
        this.config.dynamicModel = source+": "+model
        break;
      case "Built-in":
        this.config.dynamicModel = "Built-in"
        break;
      default:
        MNUtil.showHUD("Unspported source: "+source)
        return;
    }
    MNUtil.postNotification("dynamicModelChanged", {source: source, model: model})
    save && this.save("MNChatglm_config")
  }
  static setDefaultModel(source = this.config.source, model,save = true){
    this.config.source = source
    if (!model) {
      MNUtil.postNotification("defaultModelChanged", {source: source, model: model})
      save && this.save("MNChatglm_config")
      return
    }
    switch (source) {
      case "ChatGLM":
        this.config.chatglmModel = model
        break;
      case "Claude":
        this.config.claudeModel = model
        break;
      case "Gemini":
        this.config.geminiModel = model
        break;
      case "SiliconFlow":
        this.config.siliconFlowModel = model
        break;
      case "PPIO":
        this.config.ppioModel = model
        break;
      case "Volcengine":
        this.config.volcengineModel = model
        break;
      case "Github":
        this.config.githubModel = model
        break;
      case "Metaso":
        this.config.metasoModel = model
        break;
      case "ChatGPT":
        this.config.model = model
        break;
      case "KimiChat":
        this.config.moonshotModel = model
        break;
      case "Minimax":
        this.config.miniMaxModel = model
        break;
      case "Deepseek":
        this.config.deepseekModel = model
        break;
      case "Qwen":
        this.config.qwenModel = model
        break;
      case "Custom":
        this.config.customModelIndex = model
        break;
      case "Subscription":
        this.config.subscriptionModel = model
        break;
      case "PPIO":
        this.config.ppioModel = model
        break;
      case "Built-in":
        break;
      default:
        MNUtil.showHUD("Unspported source: "+source)
        return;
    }
    MNUtil.postNotification("defaultModelChanged", {source: source, model: model})
    save && this.save("MNChatglm_config")
  }
  static getDefaultModel(source = this.config.source){
    let models = this.modelNames(source)
    // MNUtil.copyJSON(models)
    let model//有可能是字符串,直接对应模型名,也能是数字,代表模型索引
    switch (source) {
      case "ChatGLM":
        model = this.getConfig("chatglmModel")
        break;
      case "Claude":
        model = this.getConfig("claudeModel")
        break;
      case "Gemini":
        model = this.getConfig("geminiModel")
        break;
      case "SiliconFlow":
        model = this.getConfig("siliconFlowModel")
        break;
      case "PPIO":
        model = this.getConfig("ppioModel")
        break;
      case "Volcengine":
        model = this.getConfig("volcengineModel")
        break;
      case "Github":
        model = this.getConfig("githubModel")
        break;
      case "Metaso":
        model = this.getConfig("metasoModel")
        break;
      case "ChatGPT":
        model = this.getConfig("model")
        break;
      case "KimiChat":
        model = this.getConfig("moonshotModel")
        break;
      case "Minimax":
        model = this.getConfig("miniMaxModel")
        break;
      case "Deepseek":
        model = this.getConfig("deepseekModel")
        break;
      case "Qwen":
        model = this.getConfig("qwenModel")
        break;
      case "Custom":
        model = this.getConfig("customModelIndex")
        break;
      case "Subscription":
        model = this.getConfig("subscriptionModel")
        break;
      case "Built-in":
        return undefined
      default:
        MNUtil.showHUD("Unspported source: "+source)
        return undefined;
    }
    // MNUtil.copyJSON(models)
    if (typeof model === "number") {
      if (model >= models.length) {
        model = 0
      }
      return models[model]
    }
    if (typeof model === "string") {
      return model
    }
    return undefined
  }
  /**
   * 解析model格式,返回一个对象
   * 这里的model是model:source格式的
   * @param {string} model 
   */
  static parseModelConfig(model){
    try {
    let config
    // MNUtil.copy("Model: " + model)
    let modelConfig = model.split(":").map(m=>m.trim())
    if (modelConfig.length === 1 && modelConfig[0] !== "Default" && modelConfig[0] !== "Built-in") {
      return {model:model}
    }
    if (modelConfig[0] !== "Default") {
      let source = modelConfig[0]
      config = chatAIConfig.getConfigFromSource(source)
      if (modelConfig.length === 2) {
        config.model = modelConfig[1]
      }
    }else{
      config = chatAIConfig.getConfigFromSource()
    }
    return config
    } catch (error) {
      chatAIUtils.addErrorLog(error, "parseModelConfig")
      return undefined
    }
  }
  static getConfigFromSource(source = this.config.source){
    let config = {source:source}
    config.model = this.getDefaultModel(source)
    switch (source) {
      case "ChatGLM":
        config.key = this.getConfig("apikey")
        config.url = "https://open.bigmodel.cn/api/paas/v4/chat/completions"
        return config
      case "Claude":
        config.key = this.getConfig("claudeKey")
        config.url = this.getConfig("claudeUrl")+"/v1/messages"
        return config
      case "Gemini":
        config.key = this.getConfig("geminiKey")
        config.url = this.getConfig("geminiUrl")
        if (config.url === "https://generativelanguage.googleapis.com") {
          config.url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
        }
        return config
      case "SiliconFlow":
        config.key = this.getConfig("siliconFlowKey")
        config.url = this.getConfig("siliconFlowUrl")
        return config
      case "PPIO":
        config.key = this.getConfig("ppioKey")
        config.url = this.getConfig("ppioUrl")
        return config
      case "Volcengine":
        config.key = this.getConfig("volcengineKey")
        config.url = this.getConfig("volcengineUrl")
        return config
      case "Github":
        config.key = this.getConfig("githubKey")
        config.url = this.getConfig("githubUrl")
        return config
      case "Metaso":
        config.key = this.getConfig("metasoKey")
        config.url = this.getConfig("metasoUrl")
        return config
      case "ChatGPT":
        config.key = this.getConfig("openaiKey")
        config.url = this.getConfig("url")+`/v1/chat/completions`
        return config
      case "KimiChat":
        config.key = this.getConfig("moonshotKey")
        config.url = "https://api.moonshot.cn/v1/chat/completions"
        return config
      case "Minimax":
        config.key = this.getConfig("miniMaxKey")
        config.url = "https://api.minimax.chat/v1/text/chatcompletion_v2"
        return config
      case "Deepseek":
        config.key = this.getConfig("deepseekKey")
        config.url = "https://api.deepseek.com/chat/completions"
        return config
      case "Qwen":
        config.key = this.getConfig("qwenKey")
        config.url = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
        return config
      case "Custom":
        config.key = this.getConfig("customKey")
        config.url = this.getConfig("customUrl")
        return config
      case "Subscription":
        config.key = subscriptionConfig.config.apikey 
        config.url = subscriptionConfig.config.url + "/v1/chat/completions"
        return config
      case "Built-in":
        config.key = ""
        return config
      default:
        MNUtil.showHUD("Unspported source: "+source)
        return undefined
    }
  }
  static getConfigFromPrompt(prompt = this.currentPrompt){
    let promptConfig = this.prompts[prompt]
    // MNUtil.copyJSON(promptConfig)
    let promptModel = promptConfig.model
    let config
    if (promptModel) {
      config = chatAIConfig.parseModelConfig(promptModel)
      // let modelConfig = promptModel.split(":").map(model=>model.trim())
      // if (modelConfig[0] !== "Default") {
      //   let source = modelConfig[0]
      //   config = this.getConfigFromSource(source)
      //   if (modelConfig.length === 2) {
      //     config.model = modelConfig[1]
      //   }
      // }else{
      //   config = this.getConfigFromSource()
      // }
    }else{
      config = this.getConfigFromSource()
    }
    config.title = promptConfig.title
    if (promptConfig.func) {
      config.func = promptConfig.func
    }
    if (promptConfig.temperature) {
      config.temperature = promptConfig.temperature
    }
    if (promptConfig.action) {
      config.action = promptConfig.action
    }
    if (promptConfig.toolbarAction) {
      config.toolbarAction = promptConfig.toolbarAction
    }
    return config
  }
  static getDynmaicConfig(){
    // let promptConfig = this.dynamicPrompt
    let promptModel = this.getConfig("dynamicModel")
    let dynamicFunc = this.getConfig("dynamicFunc")
    let dynamicAction = this.getConfig("dynamicAction")
    let dynamicTemp = this.getConfig("dynamicTemp")
    let dynamicToolbarAction = this.getConfig("dynamicToolbarAction")
    let config = chatAIConfig.parseModelConfig(promptModel)
    // MNUtil.copyJSON(config)
    // let modelConfig = promptModel.split(":").map(model=>model.trim())
    // if (modelConfig[0] !== "Default") {
    //   let source = modelConfig[0]
    //   config = this.getConfigFromSource(source)
    //   if (modelConfig.length === 2) {
    //     config.model = modelConfig[1]
    //   }
    // }else{
    //   config = this.getConfigFromSource()
    // }
    config.title = "Dynamic"
    config.temperature = dynamicTemp
    if (dynamicFunc.length) {
      config.func = dynamicFunc
    }
    if (dynamicAction.length){
      config.action = dynamicAction
    }
    if (dynamicToolbarAction) {
      config.toolbarAction = dynamicToolbarAction
    }
    return config
  }
  /**
   * 
   * @param {NSData} fileData 
   * @param {UIView} filename 
   */
  static exportFile(fileData,filename) {
    fileData.writeToFileAtomically(chatAIUtils.app.tempPath+"/"+filename, false)
    let UTI = "public.sqlite"
    chatAIUtils.app.saveFileWithUti(chatAIUtils.app.tempPath+"/"+filename, UTI)
    let tem = NSData.dataWithContentsOfFile(chatAIUtils.app.dbPath+"/vector.sqlite")
    tem.writeToFileAtomically(chatAIUtils.app.dbPath+"/export.sqlite", false)
  }
  static getOrderNumber(order){
    let orderNumber = `${order[0]}${order[1]}${order[2]}`
    if (order.length === 4) {
      orderNumber = `${order[0]}${order[1]}${order[2]}${order[3]}`
    }
    return orderNumber
  }
  static getOrderText() {
    let order = this.getConfig("searchOrder")
    let orderNumber = this.getOrderNumber(order)
    switch (orderNumber) {
      case "123":
        return 'Order: Title → Excerpt → Comment'
      case "132":
        return 'Order: Title → Comment → Excerpt'
      case "213":
        return 'Order: Excerpt → Title → Comment'
      case "231":
        return 'Order: Excerpt → Comment → Title'
      case "312":
        return 'Order: Comment → Title → Excerpt'
      case "321":
        return 'Order: Comment → Excerpt → Title'
      case "1234":
        return 'Order: Title → Excerpt → Comment'
      case "1324":
        return 'Order: Title → Comment → Excerpt'
      case "2134":
        return 'Order: Excerpt → Title → Comment'
      case "2314":
        return 'Order: Excerpt → Comment → Title'
      case "3124":
        return 'Order: Comment → Title → Excerpt'
      case "3214":
        return 'Order: Comment → Excerpt → Title'
      case "4123":
        return 'Order: MD → Title → Excerpt → Comment'
      case "4132":
        return 'Order: MD → Title → Comment → Excerpt'
      case "4213":
        return 'Order: MD → Excerpt → Title → Comment'
      case "4231":
        return 'Order: MD → Excerpt → Comment → Title'
      case "4312":
        return 'Order: MD → Comment → Title → Excerpt'
      case "4321":
        return 'Order: MD → Comment → Excerpt → Title'
      default:
        return "123";
    }
  }
  static async readEncryptedConfigFromR2(fileName,key){
  try {
    let url = "https://file.feliks.top/"+fileName+"?timestamp="+Date.now()
    // let res = await chatAINetwork.fetch(url)
    // let text = this.data2string(res)
    // return text
    // const headers = {
    //   "Cache-Control": "no-cache"
    // };
    let text = await MNUtil.readTextFromUrlAsync(url)
    if (typeof text === "object" && "statusCode" in text) {
      return text
    }
    if (!text) {
      this.setSyncStatus(false)
      return undefined
    }
    let decodedText = MNUtil.xorEncryptDecrypt(text, key)
    if (MNUtil.isValidJSON(decodedText)) {
      let config = JSON.parse(decodedText)
      return config
    }
    return undefined
  } catch (error) {
    chatAIUtils.addErrorLog(error, "readEncryptedConfigFromR2")
    return undefined
  }
  }
  static async uploadConfigWithEncryptionFromR2(fileName,key,alert = true){
    if (!this.getConfig("r2file")) {
      let fileName = NSUUID.UUID().UUIDString()
      this.config.r2file = fileName
      chatAIUtils.chatController.configNoteIdInput.text = fileName
    }
    this.config.lastSyncTime = Date.now()+5
    this.config.modifiedTime = this.config.lastSyncTime
    let text = JSON.stringify(this.getAllConfig())
    let encodedText = MNUtil.xorEncryptDecrypt(text, key)
    await chatAINetwork.uploadFileToR2(encodedText, fileName,alert)
  }
  static async readEncryptedConfigFromInfi(fileName,key){
  try {
    let url = "https://futtsu.teracloud.jp/dav/mnconfig/"+fileName
    let Authorization = {
      user:"Feliks15145",
      password:"Eeq3dnRy8bV86Zna"
    }
    // let res = await chatAINetwork.fetch(url)
    // let text = this.data2string(res)
    // return text
    // const headers = {
    //   "Cache-Control": "no-cache"
    // };
    // let text = await MNUtil.readTextFromUrlAsync(url)
    let text = await chatAINetwork.readWebDAVFile(url,Authorization.user,Authorization.password)
    // if (MNUtil.isValidJSON(text)) {
    //   let config = JSON.parse(text)
    //   return config
    // }
    // return text

    // let text = await this.readConfigFromWebdav(url,Authorization)
    // MNUtil.copyJSON(text)
    if (typeof text === "object" && "statusCode" in text) {
      return text
    }
    if (!text) {
      this.setSyncStatus(false)
      return undefined
    }
    let decodedText = MNUtil.xorEncryptDecrypt(text, key)
    // MNUtil.copy(decodedText)
    if (MNUtil.isValidJSON(decodedText)) {
      let config = JSON.parse(decodedText)
      return config
    }
    return undefined
  } catch (error) {
    MNUtil.copy(error.toString())
    return undefined
  }
  }
  static async uploadConfigWithEncryptionToInfi(fileName,key,alert = true){
    if (!this.getConfig("InfiFile")) {
      let fileName = NSUUID.UUID().UUIDString()
      this.config.InfiFile = fileName
      chatAIUtils.chatController.configNoteIdInput.text = fileName
    }
    this.config.lastSyncTime = Date.now()+5
    // this.config.modifiedTime = this.config.lastSyncTime
    let text = JSON.stringify(this.getAllConfig())
    let encodedText = MNUtil.xorEncryptDecrypt(text, key)
    let url = "https://futtsu.teracloud.jp/dav/mnconfig/"+fileName
    let Authorization = {
      user:"Feliks15145",
      password:"Eeq3dnRy8bV86Zna"
    }
    let res = await chatAINetwork.uploadWebDAVFile(url, Authorization.user, Authorization.password, encodedText)
    // await this.uploadConfigToWebdav(encodedText, fileName,Authorization)
  }
  /**
   * 
   * @param {string} fileName
   * @param {{user:string,password:string}} authorization 
   * @returns 
   */
  static async readConfigFromWebdav(fileName,authorization){
    let url = this.getConfig("webdavFolder")+fileName
    // MNUtil.copyJSON({url:url,user:authorization.user,password:authorization.password})
    // let url = "https://file.feliks.top/565DE95F-ADE9-4CE6-9395-68FFFD4F6708"
    let text = await chatAINetwork.readWebDAVFile(url,authorization.user,authorization.password)
    // chatAINetwork.uploadWebDAVFile(url, username, password, fileContent)
    // let text = await MNUtil.readTextFromUrlAsync(url)
    // let decodedText = MNUtil.xorEncryptDecrypt(text, key)
    if (MNUtil.isValidJSON(text)) {
      let config = JSON.parse(text)
      return config
    }
    return text
  }
  /**
   * 
   * @param {string} fileName
   * @param {{user:string,password:string}} authorization 
   * @returns 
   */
  static async uploadConfigToWebdav(fileName,authorization){
    if (!this.getConfig("webdavFile")) {
      let fileName = NSUUID.UUID().UUIDString()
      this.config.webdavFile = fileName
      chatAIUtils.chatController.configNoteIdInput.text = fileName
    }
    this.config.lastSyncTime = Date.now()+5
    this.config.modifiedTime = this.config.lastSyncTime
    let url = this.getConfig("webdavFolder")+fileName
    let text = JSON.stringify(this.getAllConfig())
    // let encodedText = MNUtil.xorEncryptDecrypt(text, key)
    let res = await chatAINetwork.uploadWebDAVFile(url, authorization.user, authorization.password, text)
    // MNUtil.copy(res)
    // await chatAINetwork.uploadFileToR2(encodedText, fileName)
    if (MNUtil.isValidJSON(res)) {
      let response = JSON.parse(res)
      return response
    }
    return res
  }
/**
 * @param {{name:String,path:String,md5:String}} fileObject
 */
static async getFileId (fileObject){
  let fileMd5 = fileObject.md5
  if (this.fileId[fileMd5]) {
    return this.fileId[fileMd5]
  }
  let key = this.config.moonshotKey
  if (!key) {
    MNUtil.showHUD("No Moonshot ApiKey!")
    return undefined
  }
  MNUtil.waitHUD("Upload file: "+fileObject.name)
  let res = await chatAINetwork.upload(fileObject.path,key)
  if ("statusCode" in res && res.statusCode >= 400) {
    if ("data" in res && "error" in res.data && "message" in res.data.error) {
      MNUtil.waitHUD("❌ Upload file failed: "+res.data.error.message)
      MNUtil.delay(1).then(()=>{
        MNUtil.stopHUD()
      })
      let newError = new Error("Upload file failed: "+res.data.error.message);
      newError.detail = res
      throw newError;
    }
    MNUtil.waitHUD("❌Upload file failed: "+res.statusCode)
    MNUtil.delay(1).then(()=>{
      MNUtil.stopHUD()
    })
    throw new Error("Upload file failed: "+res.statusCode);
  }
  let fileId = res.id
  if (!fileId) {
    return undefined
  }
  MNUtil.stopHUD()
  this.fileId[fileMd5] = fileId
  this.save("MNChatglm_fileId")
  return fileId
}
/**
 * @param {{name:String,path:String,md5:String}} fileObject
 */
static deleteFileId(fileObject){
  let fileMd5 = fileObject.md5
  delete this.fileId[fileMd5]
}
/**
 * @param {{name:String,path:String,md5:String}} fileObject
 */
static getLocalFileCache(fileObject){
  let fileMd5 = fileObject.md5
  if (MNUtil.isfileExists(this.dataFolder+"/"+fileMd5+".json")) {
    // let res = MNUtil.readJSON(this.dataFolder+"/"+fileMd5+".json")
    return MNUtil.readJSON(this.dataFolder+"/"+fileMd5+".json")
  }
  return {}
}

/**
 * @param {{name:String,path:String,md5:String}} fileObject
 */
static async getFilePageContents(fileObject,pageRange = undefined){//目前只支持local
  try {
    let fileMd5 = fileObject.md5
    let cachedFile = this.getLocalFileCache(fileObject)
    if ("pdfjsPageContents" in cachedFile) {
      MNUtil.log("read file content from local cache")
      // if (pageRange && "pageNo" in pageRange) {
      //   let pageNo = pageRange.pageNo
      //   let pageContents = cachedFile.pdfjsPageContents
      //   let pageContent = pageContents[pageNo-1]
      //   return pageContent
      // }
      return cachedFile.pdfjsPageContents
    }
    if (!MNUtil.isfileExists(fileObject.path)) {
      return []
    }
    // if (this.fileContent[fileMd5]) {
    //   return JSON.stringify(this.fileContent[fileMd5],null,2)
    // }
    let pageContents = await chatAIUtils.notifyController.getLocalFileContent(fileObject.path)
    if (pageContents.length === 0) {
      return []
    }
    let fileInfo = {
      content:pageContents.join("\n\n"),
      file_type: "application/pdf",
      type: "file",
      filename: fileObject.name,
    }
    let doc = MNUtil.getDocById(fileObject.md5)
    fileInfo.pageCount = doc.pageCount
    cachedFile.pdfjs = fileInfo
    cachedFile.pdfjsPageContents = pageContents
    MNUtil.writeJSON(this.dataFolder+"/"+fileObject.md5+".json", cachedFile)
    // MNUtil.copy(fileInfo)
    return pageContents;
    // return []
  } catch (error) {
    chatAIUtils.addErrorLog(error, "getFilePageContents")
    throw new Error(error.message)
  }
}

/**
 * @param {{name:String,path:String,md5:String}} fileObject
 * @param {boolean} local
 * @returns {Promise<{content:string,file_type:string,type:string,filename:string,pageCount:number}>}
 */
static async getFileContent(fileObject,local = false){
  try {
    let fileMd5 = fileObject.md5
    let cachedFile = this.getLocalFileCache(fileObject)
    if (local) {
      if ("pdfjs" in cachedFile && cachedFile.pdfjs.content.trim()) {
        MNUtil.log("read file content from local cache")
        return cachedFile.pdfjs
      }
      // if (this.fileContent[fileMd5]) {
      //   return JSON.stringify(this.fileContent[fileMd5],null,2)
      // }
      let pageContents = await chatAIUtils.notifyController.getLocalFileContent(fileObject.path)
      let content = pageContents.join("\n\n")
      if (content.trim()) {
        let fileInfo = {
          content:pageContents.join("\n\n"),
          file_type: "application/pdf",
          type: "file",
          filename: fileObject.name,
        }
        let doc = MNUtil.getDocById(fileObject.md5)
        fileInfo.pageCount = doc.pageCount
        cachedFile.pdfjs = fileInfo
        cachedFile.pdfjsPageContents = pageContents
        MNUtil.writeJSON(this.dataFolder+"/"+fileObject.md5+".json", cachedFile)
        // MNUtil.copy(fileInfo)
        return fileInfo;
      }else{
        // 如果本地没有缓存，则尝试从moonshot获取
        if ("moonshot" in cachedFile) {
          MNUtil.log("read file content from moonshot cache")
          return cachedFile.moonshot
        }
        let key = this.config.moonshotKey
        if (key && fileObject.fileExists) {//如果用户配置了moonshot key，则提示用户是否重新获取
          let confirm = await MNUtil.confirm("🤖 MN ChatAI","File content is empty from local extraction, do you want to retry with moonshot?\n\n本地文档内容抽取失败，是否重新使用Moonshot获取？")
          if (!confirm) {
            // 如果用户选择不重新获取，则返回空内容
            return {
              content:"",
              file_type: "application/pdf",
              type: "file",
              filename: fileObject.name,
            }
          }
        }else{
          chatAIUtils.addErrorLog("getFileContent", "file not exists", fileObject.path)
          return {
            content:"",
            file_type: "application/pdf",
            type: "file",
            filename: fileObject.name,
          }
        }
      }
    }
    if ("moonshot" in cachedFile) {
      MNUtil.log("read file content from local cache")
      return cachedFile.moonshot
    }
    let file_id = await this.getFileId(fileObject)
    if (!file_id) {
      return undefined
    }
    if (this.fileContent[file_id]) {
      cachedFile.moonshot = this.fileContent[file_id]
      MNUtil.writeJSON(this.dataFolder+"/"+fileObject.md5+".json", cachedFile)
      return this.fileContent[file_id]
    }

    let key = this.config.moonshotKey
    if (!key) {
      MNUtil.showHUD("No Moonshot ApiKey!")
      return undefined
    }
    MNUtil.waitHUD("Get file content: "+fileObject.name)
    let url = `https://api.moonshot.cn/v1/files/${file_id}/content`
    let headers = {
        Authorization: "Bearer "+key,
        "Content-Type": "application/json"
    }
    const res = await MNConnection.fetch(url,
      {
        method: "Get",
        timeout: 60,
        headers: headers
      }
    )
    if ("statusCode" in res && res.statusCode >= 400) {
      if("body" in res && res.body.error && res.body.error.message){
        chatAIUtils.addErrorLog(MNUtil.getStatusCodeDescription(res.statusCode), "getFileContent", res.body.error.message)
      }
      this.deleteFileId(fileObject)
      return await this.getFileContent(fileObject,false)
    }
    // res.file_type = "application/pdf"
    res.filename = fileObject.name
    this.fileContent[file_id] = res
    let doc = MNUtil.getDocById(fileObject.md5)
    res.pageCount = doc.pageCount
    cachedFile.moonshot = res
    // copyJSON(res)
    MNUtil.stopHUD()
    MNUtil.writeJSON(this.dataFolder+"/"+fileObject.md5+".json", cachedFile)
    // MNUtil.copyJSON(res)
    return res;
  } catch (error) {
    chatAIUtils.addErrorLog(error, "chatAIConfig.getFileContent")
    throw new Error(error.message)
  }
}
}


class chatAINetwork {
  constructor(name) {
    this.name = name;
  }
  static OCRBuffer = {}
  static requestWithURL(url){
    return NSMutableURLRequest.requestWithURL(NSURL.URLWithString(url))
  }
  static genNSURL(url) {
    return NSURL.URLWithString(url)
  }
  static async sendRequest(request){
    const queue = NSOperationQueue.mainQueue()
    return new Promise((resolve, reject) => {
      NSURLConnection.sendAsynchronousRequestQueueCompletionHandler(
        request,
        queue,
        (res, data, err) => {
          const result = NSJSONSerialization.JSONObjectWithDataOptions(
            data,
            1<<0
          )
          const validJson = NSJSONSerialization.isValidJSONObject(result)
          if (err.localizedDescription){
            // MNUtil.showHUD(err.localizedDescription)
            let error = {error:err.localizedDescription}
            if (validJson) {
              error.data = result
            }
            resolve(error)
          }
          // MNUtil.log(res.statusCode())
          if (res.statusCode() === 200) {
            // MNUtil.showHUD("OCR success")
          }else{
            let error = {statusCode:res.statusCode()}
            if (validJson) {
              error.data = result
            }
            resolve(error)
            // MNUtil.showHUD("Error in OCR")
          }
          if (validJson){
            resolve(result)
          }
          resolve(result)
        }
      )
  })
  }
  static async fetch (url,options = {}){
    // MNUtil.copy(url)
    const request = this.initRequest(url, options)
    const res = await this.sendRequest(request)
    return res
  }
/**
 * 
 * @param {*} url 
 * @param {*} options 
 * @param {NSData} imageData 
 * @returns 
 */
static initOCRRequest (url,options,imageData) {
  const request = NSMutableURLRequest.requestWithURL(this.genNSURL(url))
  // try {
  request.setHTTPMethod("Post")
  request.httpShouldHandleCookies = false
  // request.setCachePolicy(4)
  // request.setTimeoutInterval(options.timeout ?? 10)
  let boundary = "------------------------PN7UsJiL7Z78DgpbkjKEWE"//NSUUID.UUID().UUIDString()

  const headers = {
    "User-Agent": "curl/8.4.0",
    "Accept-Encoding":"*",
    "Accept-Language":"*",
    "Connection":"close",
    "Content-Type": "multipart/form-data; boundary="+boundary,
    Accept: "*/*"
  }
  request.setAllHTTPHeaderFields({
    ...headers,
    ...(options.headers ?? {})
  })

  
  let body = NSMutableData.new()
  let filePart = NSData.dataWithStringEncoding(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="Snipaste_2024-02-18_00-32-59.png"\r\nContent-Type: image/png\r\n\r\n`, 4)
  body.appendData(filePart)
  body.appendData(imageData)
  
  let endBoundary = NSData.dataWithStringEncoding(`\r\n--${boundary}--\r\n`, 4)
  body.appendData(endBoundary)
  // copy(body.base64Encoding())
  request.setHTTPBody(body)
  return request
}

static initFileRequest (url,options,purpose,fileName,fileData) {
  const request = NSMutableURLRequest.requestWithURL(this.genNSURL(url))
  try {
  request.setHTTPMethod("Post")
  request.setTimeoutInterval(options.timeout ?? 10)
  let boundary = NSUUID.UUID().UUIDString()

  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15",
    "Content-Type": "multipart/form-data; boundary="+boundary,
    Accept: "application/json"
  }
  request.setAllHTTPHeaderFields({
    ...headers,
    ...(options.headers ?? {})
  })
  let body = NSMutableData.new()
  let purposeData = NSData.dataWithStringEncoding(purpose, "utf8")
  let purposePart = NSData.dataWithStringEncoding(`
--${boundary}
Content-Disposition: form-data; name="purpose"

`, "utf8")
  let filePart = NSData.dataWithStringEncoding(`
--${boundary}
Content-Disposition: form-data; name="file"; filename="${fileName}"
Content-Type: application/pdf

`, "utf8")
  body.appendData(purposePart)
  body.appendData(purposeData)
  body.appendData(filePart)
  body.appendData(fileData)
  let endBoundary = NSData.dataWithStringEncoding(`--${boundary}--`, "utf8")
  body.appendData(endBoundary)
  request.setHTTPBody(body)
  return request
    } catch (error) {
    MNUtil.showHUD("Error in initFileRequest: "+error)
    return request
  }
}
  /**
   * @param {NSData} image 
   * @returns 
   */
  static async getTextOCR (image,compression = true) {
    try {
      if (compression) {
        image = UIImage.imageWithData(image).jpegData(0.1)
      }
      if (typeof ocrNetwork === 'undefined') {
        //OCR未安装，使用自带OCR
        return await this.freeOCR(image)
      }
      let res = await ocrNetwork.OCR(image)
      // MNUtil.copy(res)
      return res
    } catch (error) {
      chatAIUtils.addErrorLog(error, "getTextOCR",)
      throw error;
    }
  }
/**
 * 允许直接传入base64图片,减少转换耗时
 * @param {string|NSData} imageData
 * @returns {Promise<Object>}
 */
 static async ChatGPTVision(imageData,model="glm-4v-flash") {
  try {
  let keys = ['449628b94fcac030495890ee542284b8.F23PvJW4XXLJ4Lsu','b153822e28214c1ae0edc301f2b244c9.rvBehQYAxTkqznVs']
  // let key = 'sk-S2rXjj2qB98OiweU46F3BcF2D36e4e5eBfB2C9C269627e44'
  let key = chatAIUtils.getRandomElement(keys)
  MNUtil.waitHUD("OCR By "+model)
  // let url = subscriptionConfig.config.url + "/v1/chat/completions"
  let url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'
  let prompt = `—role—
Image Text Extraction Specialist

—goal—
* For the given image, please directly output the text in the image.

* For any formulas, you must enclose them with dollar signs.

—constrain—
* You are not allowed to output any content other than what is in the image.`
  // let compressedImageData = UIImage.imageWithData(imageData).jpegData(0.1)
  let imageUrl = "data:image/jpeg;base64,"
  if (typeof imageData === "string") {
    imageUrl = imageUrl+imageData
  }else{
    imageUrl = imageUrl+imageData.base64Encoding()
  }
  let history = [
    {
      role: "user", 
      content: [
        {
          "type": "text",
          "text": prompt
        },
        {
          "type": "image_url",
          "image_url": {
            "url" : imageUrl
          }
        }
      ]
    }
  ]
  let request = this.initRequestForChatGPTWithoutStream(history,key, url, model, 0.1)
    let res = await this.sendRequest(request)
    let ocrResult
    if (res.choices && res.choices.length) {
      ocrResult = res.choices[0].message.content
    }else{
      return undefined
    }
    let convertedText = ocrResult
      .replace(/\$\$\n?/g, '$$$\n')
      .replace(/(\\\[\s*\n?)|(\s*\\\]\n?)/g, '$$$\n')
      .replace(/(\\\(\s*)|(\s*\\\))/g, '$')
      .replace(/```/g,'')
    MNUtil.stopHUD()
    return convertedText
    
  } catch (error) {
    chatAIUtils.addErrorLog(error, "ChatGPTVision")
    throw error;
  }
}

/**
 * @param {string[]} texts 
 * @param {string} query
 * @returns {Promise<Object>}
 */
 static async rerank(texts,query,top_n=10) {
  try {
  let keys = [
    'sk-mntukfctmybybqirgzpbrxlhmeodbyotrokzcscukxbxgdiz',
    'sk-ntboxtwuptdfuxyrjyklqxcnagqtzzyklqiozmxnyknyfpbg',
    'sk-kasoqoophinagknminykaqfhzkftwfognfkghobwtqnnqpkk'
  ]
  let key = chatAIUtils.getRandomElement(keys)
  let url = "https://api.siliconflow.cn/v1/rerank"
  let model = "BAAI/bge-reranker-v2-m3"
 
  let request = this.initRequestForRerank(texts,query,key, url, model,top_n)
    let tem = await this.sendRequest(request)
    let res = tem.results
    // MNUtil.stopHUD()
    return res
    
  } catch (error) {
    chatAIUtils.addErrorLog(error, "rerank")
    throw error;
  }
}
  /**
   * @param {NSData} image 
   * @returns 
   */
  static async freeOCR(image){
    let imageBase64 = image.base64Encoding()
    let MD5 = chatAIUtils.MD5(imageBase64)
    if (MD5 in this.OCRBuffer) {
      // MNUtil.showHUD("Read from buffer...")
      // let sourcesForAction = ["Doc2X","SimpleTex"]
      let res = this.OCRBuffer[MD5]
      return res
    }

    let res = await this.ChatGPTVision(imageBase64)
    this.OCRBuffer[MD5] = res
    MNUtil.stopHUD()
    return res
  }
 static async fetchModelConfig () {
  let url = `https://vip.123pan.cn/1836303614/dl/new-api/model.json`
   try {
    const res = await this.fetch(url,
      {
        method: "Get",
        timeout: 60,
        headers:{
          "Cache-Control": "no-cache"
        }
      }
    )
    // MNUtil.copy(res)
    return res.modelConfig;
  } catch (error) {
    MNUtil.showHUD(error)

    return undefined
  }
    // const headers = {
    //   "Content-Type": "application/json",
    //   Authorization: "Bearer sk-gSrzDAH7TBrRCcOaCaFe8f159cAa4a57B7DaCd929f647a0d"
    // }

    // let body = {
    //   "model":"modelConfig",
    //   "messages":[{"role": "user", "content": "mnaddon"}]
    // }
    // let url = subscriptionConfig.getConfig("url")+ "/v1/chat/completions"
    // let options = {
    //     method: "POST",
    //     headers: headers,
    //     timeout: 60,
    //     json: body
    //   }
    // try {
    //   const res = await this.fetch(url,options)
    //   return res;
    // } catch (error) {
    //   chatAIUtils.addErrorLog(error, "fetchModelConfig")
    //   return undefined
    // }
  }
//备用，使用服务器而不是R2
  static async fetchKeys0 () {
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer sk-gSrzDAH7TBrRCcOaCaFe8f159cAa4a57B7DaCd929f647a0d"
    }

    let body = {
      "model":"share",
      "messages":[{"role": "user", "content": "mnaddon"}]
    }
    let url = subscriptionConfig.getConfig("url")+ "/v1/chat/completions"
    let options = {
        method: "POST",
        headers: headers,
        timeout: 60,
        json: body
      }
    try {
      const res = await this.fetch(url,options)
      return res;
    } catch (error) {
      MNUtil.showHUD(error)

      return undefined
    }
  }
  /**
   * 123云盘直链
   * @returns 
   */
  static async fetchKeys () {
  let url = `https://vip.123pan.cn/1836303614/dl/new-api/model.json`
  try {
    const res = await this.fetch(url,
      {
        method: "Get",
        timeout: 60,
        headers:{
          "Cache-Control": "no-cache"
        }
      }
    )
    // MNUtil.copy(res)
    let modelConfig = res.modelConfig
    let shareKeys = res.share
    if (shareKeys && "message" in shareKeys) {
      chatAIConfig.keys = shareKeys
      chatAIConfig.save('MNChatglm_builtInKeys',true,false)
    }
    if (modelConfig && "Github" in modelConfig) {
      let today = chatAIUtils.getToday()
      modelConfig.refreshDay = today
      chatAIConfig.modelConfig = modelConfig
      chatAIConfig.save("MNChatglm_modelConfig",true,false)
    }
    return {modelConfig,shareKeys};
  } catch (error) {
    chatAIUtils.addErrorLog(error, "fetchKeys")
    return undefined
  }
  }

  static initRequest(url,options) {
    const request = this.requestWithURL(url)
    request.setHTTPMethod(options.method ?? "GET")
    request.setTimeoutInterval(options.timeout ?? 10)
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1.1 Safari/605.1.15",
      "Content-Type": "application/json",
      Accept: "application/json"
    }
    request.setAllHTTPHeaderFields({
      ...headers,
      ...(options.headers ?? {})
    })
    if (options.search) {
      request.setURL(
        this.genNSURL(
          `${url.trim()}?${Object.entries(options.search).reduce((acc, cur) => {
            const [key, value] = cur
            return `${acc ? acc + "&" : ""}${key}=${encodeURIComponent(value)}`
          }, "")}`
        )
      )
    } else if (options.body) {
      request.setHTTPBody(NSData.dataWithStringEncoding(options.body, 4))
    } else if (options.form) {
      request.setHTTPBody(
        NSData.dataWithStringEncoding(
          Object.entries(options.form).reduce((acc, cur) => {
            const [key, value] = cur
            return `${acc ? acc + "&" : ""}${key}=${encodeURIComponent(value)}`
          }, ""),
          4
        )
      )
    } else if (options.json) {
      request.setHTTPBody(
        NSJSONSerialization.dataWithJSONObjectOptions(
          options.json,
          1
        )
      )
    }
    return request
  }
  static async getUsage(authorization,string) {
    let url = chatAIConfig.config.url
    let urlSubscription = url+'/v1/dashboard/billing/subscription'
    let urlUsage = url+"/v1/dashboard/billing/usage"

    let key = chatAIConfig.config.openaiKey
    if (key.trim() === "") {
      MNUtil.showHUD("no api key")
      return
    }
    let headers = {
        'Authorization': 'Bearer '+key,
        "Content-Type": "application/json"
    }
    let usage = {}
    const res = await this.fetch(urlUsage,
      {
        method: "GET",
        timeout: 60,
        headers: headers
      }
    )
    usage.usage = res.total_usage
    const total = await this.fetch(urlSubscription,
      {
        method: "GET",
        timeout: 60,
        headers: headers
      }
    )
    usage.total = total.hard_limit_usd
    return usage;
  }
/**
 * 
 * @param {*} fullPath 
 * @returns {Promise<{object:String,status:String,id:String,purpose:String,bytes:Number,filename:String}>}
 */
  static async upload(fullPath,key) {
  let fileData = chatAIUtils.getFile(fullPath)
  if (!fileData) {
    return {}
  }
  // let fileSizeWithMB = fileData.length()/1048576
  if (fileData.length() >= 104857600) {
    MNUtil.showHUD("Too large file!")
    return {}
  }
  // function sanitizeFileName(fileName) {
  //     // 定义一个包含所有需要替换的字符的正则表达式
  //     const invalidChars = /[\/\\:*?"<>|%+，。、；‘’“”【】{}《》！？（）￥——·~]/g;
    
  //     // 用下划线替换所有不合法的字符
  //     const sanitizedFileName = fileName.replace(invalidChars, '_');
  //     return sanitizedFileName;
  // }
  // fileName = sanitizeFileName(fileName)
  // copy("length:"+fileSizeWithMB+"MB")
  // showHUD("length:"+fileData.length())
  // let fileName = (fullPath)
  // let fileName = MNUtil.getFileName(fullPath)+".pdf"
  let fileName = `doc_${Date.now()}.pdf`
  const headers = {
    Authorization: "Bearer "+key
  }

  let url = "https://api.moonshot.cn/v1/files"
  // copyJSON(body)
  // showHUD(fileName)
  const request = this.initFileRequest(url, {
      headers: headers,
      timeout: 60
    },
    "file-extract",
    fileName,
    fileData)
  let res = await this.sendRequest(request)
  return res
//   const queue = NSOperationQueue.mainQueue()

//   return new Promise((resolve, reject) => {
    
//   NSURLConnection.sendAsynchronousRequestQueueCompletionHandler(
//     request,
//     queue,
//     (res, data, err) => {
//       if (err.localizedDescription){
//         showHUD(err.localizedDescription)
//         reject()
//       }
//       // if (data.length() === 0) resolve({})
//       const result = NSJSONSerialization.JSONObjectWithDataOptions(
//         data,
//         1<<0
//       )
//       if (NSJSONSerialization.isValidJSONObject(result)){
//         // showHUD(result)
//         // copyJSON(result)
//         resolve(result)
//       }
//       resolve(result)
//       // showHUD(result)
//     }
//   )
//   })
}
  static getAuthorization(apikey) {
    let header = JSON.stringify({"alg":"HS256","sign_type":"SIGN"})
    let payload =JSON.stringify({
      "api_key": apikey.split(".")[0],
      "exp": Date.now()+60000,
      "timestamp": Date.now()
    });
    let secretSalt = apikey.split(".")[1];
    let before_sign = this.base64UrlEncode(CryptoJS.enc.Utf8.parse(header)) + '.' + this.base64UrlEncode(CryptoJS.enc.Utf8.parse(payload));

    let  signature =CryptoJS.HmacSHA256(before_sign, secretSalt);
     signature = this.base64UrlEncode(signature);

    let final_sign = before_sign + '.' + signature;
    return final_sign
  }
   //和普通base64加密不一样
  static base64UrlEncode(str) {
     var encodedSource = CryptoJS.enc.Base64.stringify(str);
     var reg = new RegExp('/', 'g');
     encodedSource = encodedSource.replace(/=+$/,'').replace(/\+/g,'-').replace(reg,'_');
     return encodedSource;
  }
  static async uploadFileToR2(text, fileName, msg = true) {
    try {
      
    let textData = NSData.dataWithStringEncoding(text,4)
    let bucketName = 'test'
    var accessKeyId = 'a4dd38e9a43edd92e7c0a29d90fceb38';
    var secretAccessKey = 'c7f0d5fdf94a12e203762c1b536f49fd1accb9c9ea7bb0e4810e856bb27ac9e7';
    var endpointUrl = 'https://45485acd4578c553e0570e10e95105ef.r2.cloudflarestorage.com';
    var region = 'auto';
    var service = 's3';
    var urlString = endpointUrl + '/' + bucketName + '/' + fileName;
    let url = MNUtil.genNSURL(urlString);
    var request = NSMutableURLRequest.requestWithURL(url);
    request.setHTTPMethod('PUT');
    // 设置认证头
    var date = new Date();
    var amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, '');
    // amzDate = '20240614T154746Z'
    var shortDate = amzDate.substr(0, 8);
    var scope = shortDate + '/' + region + '/' + service + '/aws4_request';
    var host = '45485acd4578c553e0570e10e95105ef.r2.cloudflarestorage.com'
    // var payloadHash = CryptoJS.SHA256(imageData).toString(CryptoJS.enc.Hex);
    // payloadHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    var payloadHash = 'UNSIGNED-PAYLOAD'
    var canonicalUri = '/' + bucketName + '/' + fileName;
    var canonicalRequest = 'PUT\n' + canonicalUri + '\n\n' +
        'host:' + host + '\n' +
        'x-amz-content-sha256:'+payloadHash+'\n' +
        'x-amz-date:' + amzDate + '\n\n' +
        'host;x-amz-content-sha256;x-amz-date\n' +
        payloadHash;

    var hashedCanonicalRequest = CryptoJS.SHA256(canonicalRequest).toString(CryptoJS.enc.Hex);

    var stringToSign = 'AWS4-HMAC-SHA256\n' + amzDate + '\n' + scope + '\n' + hashedCanonicalRequest;
    var dateKey = CryptoJS.HmacSHA256(shortDate, 'AWS4' + secretAccessKey);
    var dateRegionKey = CryptoJS.HmacSHA256(region, dateKey);
    var dateRegionServiceKey = CryptoJS.HmacSHA256(service, dateRegionKey);
    var signingKey = CryptoJS.HmacSHA256('aws4_request', dateRegionServiceKey);
    var signature = CryptoJS.HmacSHA256(stringToSign, signingKey).toString(CryptoJS.enc.Hex);

    var authorizationHeader = 'AWS4-HMAC-SHA256 Credential=' + accessKeyId + '/' + scope + ', SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=' + signature;

    const headers = {
        "Accept-Encoding":"identity",
        "Authorization": authorizationHeader,
        'X-Amz-Content-SHA256': payloadHash,
        'Host': host,
        "X-Amz-Date": amzDate
    };
    request.setAllHTTPHeaderFields(headers);
    request.setHTTPBody(textData);
    let res = await this.sendRequest(request)
    if (res && "error" in res) {
      
    }else{
      if (msg) {
        MNUtil.showHUD("Upload success!")
      }
    }
    // MNUtil.copyJSON(res)
    return res
    } catch (error) {
      MNUtil.showHUD(error)
    }
}
static btoa(str) {
    // Encode the string to a WordArray
    const wordArray = CryptoJS.enc.Utf8.parse(str);
    // Convert the WordArray to Base64
    const base64 = CryptoJS.enc.Base64.stringify(wordArray);
    return base64;
}
static async readWebDAVFile(url, username, password) {
    const headers = {
      Authorization:'Basic ' + chatAINetwork.btoa(username + ':' + password),
      "Cache-Control": "no-cache"
      };
        const response = await MNConnection.fetch(url, {
            method: 'GET',
            headers: headers
        });
    try {
        // if ("statusCode" in response) {
        //   MNUtil.copyJSON(response)
        // }
        // MNUtil
        if (!response.base64Encoding) {
          return response
        }
        // let text = MNUtil.data2string(response)
        let text = chatAIUtils.dataToString(response)
        return text
        // MNUtil.copy(text)

        // if (!response.ok) {
        //     throw new Error('Network response was not ok: ' + response.statusText);
        // }

        // const text = await response.text();
        // return text;
    } catch (error) {
      chatAIUtils.addErrorLog(error, "readWebDAVFile")
      return response
    }
}
static async uploadWebDAVFile(url, username, password, fileContent) {
    const headers = {
      Authorization:'Basic ' + this.btoa(username + ':' + password),
      "Content-Type":'application/octet-stream'
    };

    try {
        const response = await MNConnection.fetch(url, {
            method: 'PUT',
            headers: headers,
            body: fileContent
        });
        if (!response.base64Encoding) {
          return response
        }
        // let text = MNUtil.data2string(response)
        let text = chatAIUtils.dataToString(response)
        return text
    } catch (error) {
      chatAIUtils.addErrorLog(error, "uploadWebDAVFile")
    }
}

/**
 * Initializes a request for ChatGPT using the provided configuration.
 * 
 * @param {Array} history - An array of messages to be included in the request.
 * @param {string} apikey - The API key for authentication.
 * @param {string} url - The URL endpoint for the API request.
 * @param {string} model - The model to be used for the request.
 * @param {number} temperature - The temperature parameter for the request.
 * @param {Array<number>} funcIndices - An array of function indices to be included in the request.
 * @throws {Error} If the API key is empty or if there is an error during the request initialization.
 */
static async webSearch (question,apikey) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer "+apikey,
    Accept: "text/event-stream"
  }
    // copyJSON(headers)
  // let body = {
  //   "tool":"web-search-pro",
  //   "messages":[{"role": "user", "content": question}],
  //   "stream":false
  // }
  let body = {
    "search_engine":"search_std",
    "search_query":question,
    "stream":false
  }
  // let url = "https://open.bigmodel.cn/api/paas/v4/tools"
  let url = "https://open.bigmodel.cn/api/paas/v4/web_search"
  // copyJSON(body)

  // MNUtil.copyJSON(body)
  // MNUtil.copy(url)
  let res = await MNConnection.fetch(url,{
      method: "POST",
      headers: headers,
      timeout: 60,
      json: body
    })
  try {
    return res.search_result
  } catch (error) {
    return res
  }
}


/**
 * Initializes a request for ChatGPT using the provided configuration.
 * 
 * @param {Array} history - An array of messages to be included in the request.
 * @param {string} apikey - The API key for authentication.
 * @param {string} url - The URL endpoint for the API request.
 * @param {string} model - The model to be used for the request.
 * @param {number} temperature - The temperature parameter for the request.
 * @param {Array<number>} funcIndices - An array of function indices to be included in the request.
 * @throws {Error} If the API key is empty or if there is an error during the request initialization.
 */
static initRequestForChatGPT (history,apikey,url,model,temperature,funcIndices=[]) {
  if (apikey.trim() === "") {
    MNUtil.confirm("MN ChatAI", `❌ APIKey not found!\n\nURL: ${url}\n\nModel: ${model}\n\nPlease check your settings.`)
    return
  }
  let key = apikey
  if (/,/.test(apikey)) {
    let apikeys = apikey.split(",").map(item=>item.trim())
    key = chatAIUtils.getRandomElement(apikeys)
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer "+key,
    Accept: "text/event-stream"
  }
    // copyJSON(headers)
  let body = {
    "model":model,
    "messages":history,
    "stream":true
  }
  // if (model !== "deepseek-reasoner") {
    body.temperature = temperature
    if (url === "https://api.minimax.chat/v1/text/chatcompletion_v2") {
      let tools = chatAITool.getToolsByIndex(funcIndices,true)
      if (tools.length) {
        body.tools = tools
      }
      body.max_tokens = 8000
    }else{
      let tools = chatAITool.getToolsByIndex(funcIndices,false)
      if (tools.length) {
        body.tools = tools
        body.tool_choice = "auto"
      }
    }
  const request = this.initRequest(url, {
      method: "POST",
      headers: headers,
      timeout: 60,
      json: body
    })
  return request
}

/**
 * Initializes a request for ChatGPT using the provided configuration.
 * 
 * @param {Array} history - An array of messages to be included in the request.
 * @param {string} apikey - The API key for authentication.
 * @param {string} url - The URL endpoint for the API request.
 * @param {string} model - The model to be used for the request.
 * @param {number} temperature - The temperature parameter for the request.
 * @param {Array<number>} funcIndices - An array of function indices to be included in the request.
 * @throws {Error} If the API key is empty or if there is an error during the request initialization.
 */
static initRequestForChatGPTWithoutStream (history,apikey,url,model,temperature,funcIndices=[]) {
  if (apikey.trim() === "") {
    MNUtil.confirm("MN ChatAI", `❌ APIKey not found!\n\nURL: ${url}\n\nModel: ${model}\n\nPlease check your settings.`)
    return
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer "+apikey,
    Accept: "text/event-stream"
  }
    // copyJSON(headers)
  let body = {
    "model":model,
    "messages":history
  }
  // if (model !== "deepseek-reasoner") {
    body.temperature = temperature
    if (url === "https://api.minimax.chat/v1/text/chatcompletion_v2") {
      let tools = chatAITool.getToolsByIndex(funcIndices,true)
      if (tools.length) {
        body.tools = tools
      }
      body.max_tokens = 8000
    }else{
      let tools = chatAITool.getToolsByIndex(funcIndices,false)
      if (tools.length) {
        body.tools = tools
        body.tool_choice = "auto"
      }
    }
  const request = this.initRequest(url, {
      method: "POST",
      headers: headers,
      timeout: 60,
      json: body
    })
  return request
}

/**
 * Initializes a request for ChatGPT using the provided configuration.
 * 
 * @param {Array} history - An array of messages to be included in the request.
 * @param {string} apikey - The API key for authentication.
 * @param {string} url - The URL endpoint for the API request.
 * @param {string} model - The model to be used for the request.
 * @param {number} temperature - The temperature parameter for the request.
 * @param {Array<number>} funcIndices - An array of function indices to be included in the request.
 * @throws {Error} If the API key is empty or if there is an error during the request initialization.
 */
static initRequestForRerank (texts,query,apikey,url,model,top_n=10) {
  // if (apikey.trim() === "") {
  //   MNUtil.showHUD(model+": No apikey!")
  //   return
  // }
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer "+apikey,
    Accept: "application/json"
  }
    // copyJSON(headers)
  let body = {
    "model":model,
    "query":query,
    "documents":texts,
    "top_n":top_n
  }
  const request = this.initRequest(url, {
      method: "POST",
      headers: headers,
      timeout: 60,
      json: body
    })
  return request
}

/**
 * Initializes a request for ChatGPT using the provided configuration.
 * 
 * @param {Array} history - An array of messages to be included in the request.
 * @param {string} apikey - The API key for authentication.
 * @param {string} url - The URL endpoint for the API request.
 * @param {string} model - The model to be used for the request.
 * @param {number} temperature - The temperature parameter for the request.
 * @param {Array<number>} funcIndices - An array of function indices to be included in the request.
 * @throws {Error} If the API key is empty or if there is an error during the request initialization.
 */
static initRequestForCogView (prompt,apikey,url,model,size = "1024x1024") {
  if (apikey.trim() === "") {
    MNUtil.showHUD(model+": No apikey!")
    return
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer "+apikey,
    Accept: "text/event-stream"
  }
    // copyJSON(headers)
  let body = {
    "model":model,
    "prompt":prompt,
    "size":size
  }
  const request = this.initRequest(url, {
      method: "POST",
      headers: headers,
      timeout: 60,
      json: body
    })
  return request
}

/**
 * Initializes a request for Claude using the provided configuration.
 * 
 * @param {Array} history - An array of messages to be included in the request.
 * @param {string} apikey - The API key for authentication.
 * @param {string} url - The URL endpoint for the API request.
 * @param {string} model - The model to be used for the request.
 * @param {number} temperature - The temperature parameter for the request.
 * @param {Array<number>} funcIndices - An array of function indices to be included in the request.
 * @throws {Error} If the API key is empty or if there is an error during the request initialization.
 */
static initRequestForClaude(history,apikey,url,model,temperature,funcIndices=[]) {
  try {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key":apikey,
    "anthropic-version":"2023-06-01"
  }
  let body = {
    "model":model,
    "max_tokens": 1024,
    "stream":true
  }
  let system = history.filter(item => item.role === "system")[0]
  // copyJSON(system)
  if (system) {
    body.system = system.content
    body.messages = history.filter(item => item.role !== "system")
  }else{
    body.messages = history
  }

  // copyJSON(body)
  const request = this.initRequest(url, {
      method: "POST",
      headers: headers,
      timeout: 60,
      json: body
    })
  return request
  } catch (error) {
      chatAIUtils.addErrorLog(error, "initRequestForClaude")
  }
  }
 
/**
 * Initializes a request for ChatGPT using the provided configuration.
 * 
 * @param {Array} history - An array of messages to be included in the request.
 * @param {string} apikey - The API key for authentication.
 * @param {string} url - The URL endpoint for the API request.
 * @param {string} model - The model to be used for the request.
 * @param {number} temperature - The temperature parameter for the request.
 * @param {Array<number>} funcIndices - An array of function indices to be included in the request.
 * @throws {Error} If the API key is empty or if there is an error during the request initialization.
 */
static initRequestForGemini (history,apikey,url,model,temperature,funcIndices=[]) {
  if (apikey.trim() === "") {
    MNUtil.confirm("MN ChatAI", `❌ APIKey not found!\n\nURL: ${url}\n\nModel: ${model}\n\nPlease check your settings.`)
    return
  }
  let key = apikey
  if (/,/.test(apikey)) {
    let apikeys = apikey.split(",").map(item=>item.trim())
    key = chatAIUtils.getRandomElement(apikeys)
  }
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer "+key,
    Accept: "text/event-stream"
  }
    // copyJSON(headers)
  let body = {
    "model":model,
    "messages":history,
    "stream":true,
    "extra_body": {
        "google": {
          "thinking_config": {
            "include_thoughts": true
          }
        }
      }
  }
  // if (model !== "deepseek-reasoner") {
    body.temperature = temperature
    if (url === "https://api.minimax.chat/v1/text/chatcompletion_v2") {
      let tools = chatAITool.getToolsByIndex(funcIndices,true)
      if (tools.length) {
        body.tools = tools
      }
      body.max_tokens = 8000
    }else{
      let tools = chatAITool.getToolsByIndex(funcIndices,false)
      if (tools.length) {
        body.tools = tools
        body.tool_choice = "auto"
      }
    }
  const request = this.initRequest(url, {
      method: "POST",
      headers: headers,
      timeout: 60,
      json: body
    })
  return request
}
}