export { main }

function main() {
  // uTools API onPluginEnter(callback)
  // type 为 "text"、"regex"、 "over" 时， payload 值为进入插件应用时的主输入框文本
  try {
    utools.onPluginEnter(({ code, type, payload, option }) => {
      console.log('用户进入插件应用', code, type, payload, option)
      const statusElement = document.getElementById('status')
      const textElement = document.getElementById('text')
      if (statusElement && textElement && type === 'regex' && payload) {
        statusElement.innerText = '匹配到正则文本'
        textElement.textContent = payload
      } else {
        if (statusElement !== null && textElement !== null) {
          statusElement.innerText = '未匹配到正则文本'
          textElement.textContent = ''
        }
      }
    })
  } catch (_) {
    console.error(_)
    return true
  }
}
