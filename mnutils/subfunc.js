/**
 * 根据指定的 scheme、host、path、query 和 fragment 生成一个完整的 URL Scheme 字符串。
 * URL Scheme 完整格式：scheme://host/path?query#fragment
 *
 * @param {string} scheme - URL scheme，例如 'myapp'。必须提供。
 * @param {string|undefined} [host] - host 部分，例如 'user_profile'。
 * @param {string|string[]|undefined} [path] - path 部分，例如 'view/123'。
 * @param {Object<string, string|number|boolean|object>|undefined} [query] - 查询参数对象。
 * @param {string|undefined} [fragment] - fragment 标识符，即 URL 中 # 后面的部分。
 * @returns {string} - 生成的完整 URL 字符串。
 */
function generateUrlScheme(scheme, host, path, query, fragment) {
  // 1. 处理必须的 scheme
  if (!scheme) {
    console.error("Scheme is a required parameter.");
    return '';
  }
  // 2. 构建基础部分：scheme 和 host
  //    即使 host 为空，也会生成 'scheme://'，这对于 'file:///' 这类 scheme 是正确的
  let url = `${scheme}://${host || ''}`;

  // 3. 添加 path
  if (path) {
    if (Array.isArray(path)) {
      let pathStr = path.join('/')
      url += `/${pathStr.replace(/^\/+/, '')}`;
    }else{
      // 确保 host 和 path 之间只有一个斜杠，并处理 path 开头可能存在的斜杠
      url += `/${path.replace(/^\/+/, '')}`;
    }
  }

  // 4. 添加 query 参数
  if (query && Object.keys(query).length > 0) {
    const queryParts = [];
    for (const key in query) {
      // 确保我们只处理对象自身的属性
      if (Object.prototype.hasOwnProperty.call(query, key)) {
        const value = query[key];
        const encodedKey = encodeURIComponent(key);
        // 对值进行编码，如果是对象，则先序列化为 JSON 字符串
        const encodedValue = encodeURIComponent(
          typeof value === "object" && value !== null ? JSON.stringify(value) : value
        );
        queryParts.push(`${encodedKey}=${encodedValue}`);
      }
    }
    if (queryParts.length > 0) {
      url += `?${queryParts.join('&')}`;
    }
  }

  // 5. 添加 fragment
  if (fragment) {
    // Fragment 部分不应该被编码
    url += `#${fragment}`;
  }

  return url;
}
    /**
     * 根据指定的 scheme、路径和参数生成一个 URL Scheme 字符串。
     * URL Scheme协议完整格式：scheme://host/path?query_parameters#fragment_identifier
     *
     * @param {string} scheme - URL scheme, 例如 'myapp'。
     * @param {string} [host] - 可选的路径或操作名。
     * @param {Object<string, string|number|boolean>} [params] - 查询参数对象。
     * @returns {string} - 生成的完整 URL 字符串。
     */
    function generateUrlScheme(scheme, host, params) {
      let url = `${scheme}://${host || ''}`;
      if (params && Object.keys(params).length > 0) {
        const queryParts = [];
        for (const key in params) {
          // 确保我们只处理对象自身的属性
          if (Object.prototype.hasOwnProperty.call(params, key)) {
            const value = params[key];
            const type = typeof value
            // 对键和值都进行编码，这是至关重要的！
            const encodedKey = encodeURIComponent(key);
            const encodedValue = encodeURIComponent(type === "object"? JSON.stringify(value):value);
            queryParts.push(`${encodedKey}=${encodedValue}`);
          }
        }
        if (queryParts.length > 0) {
          url += `?${queryParts.join('&')}`;
        }
      }
      return url;
    }
    /**
     *
     * @param {string} scheme - URL scheme, 例如 'myapp'。
     * @param {string} [host] - 可选的路径或操作名。
     * @param {Object<string, string|number|boolean>} [params] - 查询参数对象。
     */
    function postMessageToAddon(scheme, host, params) {
      let url = generateUrlScheme(scheme,host,params)
      window.location.href = url
    }

    function copyToClipboard(text) {
      postMessageToAddon("nativeAction","copy",{text:text})
    }