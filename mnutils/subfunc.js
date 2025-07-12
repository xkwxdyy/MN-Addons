    /**
     * (手动实现) 根据指定的 scheme、路径和参数生成一个 URL Scheme 字符串。
     * 此版本不使用 URLSearchParams。
     *
     * @param {string} scheme - URL scheme, 例如 'myapp'。
     * @param {string} [path] - 可选的路径或操作名。
     * @param {Object<string, string|number|boolean>} [params] - 查询参数对象。
     * @returns {string} - 生成的完整 URL 字符串。
     */
    function generateUrlScheme(scheme, path, params) {
      let url = `${scheme}://${path || ''}`;
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
    function postMessageToAddon(scheme, path, params) {
      let url = generateUrlScheme(scheme,path,params)
      window.location.href = url
    }

    function copyToClipboard(text) {
      postMessageToAddon("nativeAction","copy",{text:text})
    }