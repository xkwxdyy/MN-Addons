// type XOR<T, U> = T | U extends object
//   ? (Without<T, U> & U) | (Without<U, T> & T)
//   : T | U
// type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

class Response {
  data
  constructor(data) {
    this.data = data
  }
  json() {
    if (this.data.length() === 0) return {}
    const res = NSJSONSerialization.JSONObjectWithDataOptions(
      this.data,
      1<<0
    )
    if (NSJSONSerialization.isValidJSONObject(res)) return res
    throw lang.not_JSON
  }
  /**
   * @deprecated not supported, always return empty string
   */
  text() {
    if (this.data.length() === 0) return ""
    return ""
  }
}


function xunfeiOption(imgBase64) {
  
/**
 * 公式识别 WebAPI 接口调用示例
 * 运行前：请先填写Appid、APIKey、APISecret
 * 
 * 1.接口文档（必看）：https://www.xfyun.cn/doc/words/formula-discern/API.html
 * 2.错误码链接：https://www.xfyun.cn/document/error-code （错误码code为5位数字）
 * @author iflytek
 */


// 系统配置
const config = {
  // 请求地址
  hostUrl: "https://rest-api.xfyun.cn/v2/itr",
  host: "rest-api.xfyun.cn",
  //在控制台-我的应用-公式识别获取
  appid: "098903db",
  //在控制台-我的应用-公式识别获取
  apiSecret: "Y2QxZDZhYTMyYTdmOTdkZTAxYjc2Y2Q0",
  //在控制台-我的应用-公式识别获取
  apiKey: "e1486e29cc09f5f291a61ee916853052",
  uri: "/v2/itr",
}

let date = (new Date().toUTCString()) // 获取当前时间 RFC1123格式
let postBody = getPostBody(imgBase64,config)
let digest = getDigest(postBody)

let options = {
  url: config.hostUrl,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json,version=1.0',
    'Host': config.host,
    'Date': date,
    'Digest': digest,
    'Authorization': getAuthStr(date, digest,config)
  },
  json: true,
  body: postBody
}
return options
}

// request.post(options, (err, resp, body) => {
//   if (err) {
//     log.error("调用失败！请根据错误信息检查代码，接口文档：https://www.xfyun.cn/doc/words/formula-discern/API.html")
//   }
//   if (body.code != 0) {
// 	//以下仅用于调试
//     log.error(`发生错误，错误码：${body.code}错误原因：${body.message}`)
//     log.error(`请前往https://www.xfyun.cn/document/error-code?code=${body.code}查询解决办法`)
//   }
//   log.info(`sid：${body.sid}`)
//   log.info(`【公式识别WebAPI 接口调用结果】`)
//   log.info(JSON.stringify(body.data))
// })

// 生成请求body
function getPostBody(imgBase64,config) {
  let digestObj = {
    "common": {
      "app_id": config.appid
    },
    "business": {
      "ent": "teach-photo-print",
      "aue": "raw"
    },
    "data": {
      "image": imgBase64
    }
  }
  return digestObj
}

// 请求获取请求体签名
function getDigest(body) {
  return 'SHA-256=' + CryptoJS.enc.Base64.stringify(CryptoJS.SHA256(JSON.stringify(body)))
}

// 鉴权签名
function getAuthStr(date, digest,config) {
  let signatureOrigin = `host: ${config.host}\ndate: ${date}\nPOST ${config.uri} HTTP/1.1\ndigest: ${digest}`
  let signatureSha = CryptoJS.HmacSHA256(signatureOrigin, config.apiSecret)
  let signature = CryptoJS.enc.Base64.stringify(signatureSha)
  let authorizationOrigin = `api_key="${config.apiKey}", algorithm="hmac-sha256", headers="host date request-line digest", signature="${signature}"`
  return authorizationOrigin
}

