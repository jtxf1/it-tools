export { main }

function main(): Promise<string> {
  return new Promise((resolve) => {
    try {
      utools.onPluginEnter(({ code, type, payload, option }) => {
        console.log('用户进入插件应用code', code)
        console.log('用户进入插件应用type', type)
        console.log('用户进入插件应用payload', payload)
        console.log('用户进入插件应用option', option)

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

        resolve(payload || '') // 当回调执行时解析 Promise
      })
    } catch (error) {
      console.log('非Utools环境', error)
      resolve('') // 出错时也解析 Promise
    }
  })
}